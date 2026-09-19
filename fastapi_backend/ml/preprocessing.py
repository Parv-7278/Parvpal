"""
POLARIS Machine Learning Preprocessing & Feature Engineering Module.
Builds training feature matrices with time-lagged signals, diurnal cycles,
thermodynamic indicators, and What-If parametric perturbation features.
"""

import math
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
import numpy as np

from .synthetic_telemetry import SyntheticTelemetryPoint

# Feature Names for the ML Regressor Pipeline
FEATURE_NAMES = [
    # 1. Base instantaneous station telemetry
    "curr_battery_level",
    "curr_power_generation",
    "curr_power_consumption",
    "curr_net_power",
    "curr_generator_temperature",
    "curr_ambient_temperature",
    "curr_wind_velocity",
    "curr_humidity",
    "curr_life_support_reserve",
    "curr_bus_voltage",

    # 2. What-If parametric inputs (Injected stress testing features)
    "whatif_ambient_temperature",
    "whatif_generator_derate",
    "whatif_wind_velocity",
    "whatif_life_support_min_reserve",

    # 3. Diurnal time cycle harmonics (24h sine/cosine)
    "sin_diurnal_hour",
    "cos_diurnal_hour",

    # 4. Temporal Lag Features (t-15m, t-30m, t-60m)
    "lag1_battery",
    "lag1_consumption",
    "lag1_generation",
    "lag1_gen_temp",
    "lag2_battery",
    "lag2_consumption",
    "lag2_gen_temp",
    "lag4_battery",
    "lag4_consumption",
    "lag4_gen_temp",

    # 5. Short-term derivative rates of change (deltas)
    "delta_battery_1step",
    "delta_consumption_1step",
    "delta_gen_temp_1step",
    "delta_battery_4step",
    "delta_consumption_4step",
    "delta_gen_temp_4step",

    # 6. Rolling statistics (Lookback window = 8 steps / 2 hours)
    "rolling_mean_consumption",
    "rolling_std_consumption",
    "rolling_mean_gen_temp",
    "rolling_std_gen_temp",

    # 7. Thermodynamic and microgrid physical indicators
    "thermal_gradient",              # (gen_temp - ambient_temp)
    "wind_convective_cooling_rate",  # (wind_velocity * thermal_gradient / 100.0)
    "electrical_load_factor",        # (power_consumption / available_generation)
    "bess_discharge_stress_index",   # (max(0, -net_power) / curr_battery_level)
    "life_support_deficit_margin",   # (curr_life_support - whatif_life_support_min_reserve)

    # 8. Operational status one-hot flags
    "status_running",
    "status_derated",
    "status_warning",
    "status_overheat"
]

# Multi-Horizon Future Prediction Targets: +15m, +30m, +60m, +120m (4 horizons x 5 variables = 20 targets)
TARGET_NAMES = [
    # Horizon 1: +15 minutes (1 step)
    "batt_15m", "pwr_gen_15m", "pwr_dem_15m", "gen_temp_15m", "life_sup_15m",
    # Horizon 2: +30 minutes (2 steps)
    "batt_30m", "pwr_gen_30m", "pwr_dem_30m", "gen_temp_30m", "life_sup_30m",
    # Horizon 3: +60 minutes (4 steps)
    "batt_60m", "pwr_gen_60m", "pwr_dem_60m", "gen_temp_60m", "life_sup_60m",
    # Horizon 4: +120 minutes (8 steps)
    "batt_120m", "pwr_gen_120m", "pwr_dem_120m", "gen_temp_120m", "life_sup_120m"
]

HORIZONS = [
    {"key": "15min", "label": "+15m", "offset_steps": 1, "offset_mins": 15},
    {"key": "30min", "label": "+30m", "offset_steps": 2, "offset_mins": 30},
    {"key": "60min", "label": "+60m", "offset_steps": 4, "offset_mins": 60},
    {"key": "120min", "label": "+120m", "offset_steps": 8, "offset_mins": 120},
]

class Preprocessor:
    """Handles feature extraction, scaling, and training matrix assembly."""

    @staticmethod
    def _status_flags(status_str: str) -> List[float]:
        s = str(status_str).upper()
        return [
            1.0 if s == "RUNNING" else 0.0,
            1.0 if s == "DERATED" else 0.0,
            1.0 if s == "WARNING" else 0.0,
            1.0 if s in ["OVERHEAT", "FAULT"] else 0.0
        ]

    @classmethod
    def extract_single_inference_vector(
        cls,
        history: List[SyntheticTelemetryPoint],
        whatif_params: Dict[str, Any],
        station_id: str = "station-maitri"
    ) -> np.ndarray:
        """
        Combines recent station telemetry history with user What-If parameters
        to construct a 1 x NumFeatures vector for ML model inference.
        """
        if not history:
            raise ValueError("Telemetry history cannot be empty for inference.")

        latest = history[-1]
        n = len(history)

        # What-If injected values (with fallback to current live telemetry if not supplied)
        whatif_temp = float(whatif_params.get("ambient_temperature", latest.ambient_temperature))
        whatif_derate = float(whatif_params.get("generator_capacity_derate", latest.generator_capacity_derate))
        whatif_wind = float(whatif_params.get("wind_velocity", latest.wind_velocity))
        whatif_min_reserve = float(whatif_params.get("life_support_min_reserve", 80.0))

        # Diurnal harmonics
        dt = latest.timestamp
        hour_float = dt.hour + dt.minute / 60.0
        sin_hour = math.sin(2.0 * math.pi * hour_float / 24.0)
        cos_hour = math.cos(2.0 * math.pi * hour_float / 24.0)

        # Lookbacks (1 step = 15m, 2 steps = 30m, 4 steps = 60m)
        r_lag1 = history[-2] if n >= 2 else latest
        r_lag2 = history[-3] if n >= 3 else (history[0] if n > 0 else latest)
        r_lag4 = history[-5] if n >= 5 else (history[0] if n > 0 else latest)

        # Rolling statistics
        window = history[-8:] if n >= 8 else history
        cons_window = [r.power_consumption for r in window]
        temp_window = [r.generator_temperature for r in window]

        mean_cons = float(np.mean(cons_window))
        std_cons = float(np.std(cons_window)) if len(cons_window) > 1 else 0.5
        mean_temp = float(np.mean(temp_window))
        std_temp = float(np.std(temp_window)) if len(temp_window) > 1 else 0.3

        # Physics indicators
        thermal_gradient = latest.generator_temperature - whatif_temp
        wind_cooling = (whatif_wind * thermal_gradient) / 100.0
        
        # Effective generation with What-If derate applied
        effective_gen = latest.power_generation * (1.0 - (whatif_derate / 100.0))
        load_factor = latest.power_consumption / max(40.0, effective_gen)
        net_power = effective_gen - latest.power_consumption
        discharge_stress = max(0.0, -net_power) / max(1.0, latest.battery_level)
        life_support_margin = latest.life_support_reserve - whatif_min_reserve

        status_flags = cls._status_flags(latest.generator_status)

        vector = [
            # 1. Base telemetry
            latest.battery_level,
            latest.power_generation,
            latest.power_consumption,
            latest.power_generation - latest.power_consumption,
            latest.generator_temperature,
            latest.ambient_temperature,
            latest.wind_velocity,
            latest.humidity,
            latest.life_support_reserve,
            latest.bus_voltage,

            # 2. What-If inputs
            whatif_temp,
            whatif_derate,
            whatif_wind,
            whatif_min_reserve,

            # 3. Diurnal
            sin_hour,
            cos_hour,

            # 4. Lags
            r_lag1.battery_level,
            r_lag1.power_consumption,
            r_lag1.power_generation,
            r_lag1.generator_temperature,
            r_lag2.battery_level,
            r_lag2.power_consumption,
            r_lag2.generator_temperature,
            r_lag4.battery_level,
            r_lag4.power_consumption,
            r_lag4.generator_temperature,

            # 5. Deltas
            latest.battery_level - r_lag1.battery_level,
            latest.power_consumption - r_lag1.power_consumption,
            latest.generator_temperature - r_lag1.generator_temperature,
            latest.battery_level - r_lag4.battery_level,
            latest.power_consumption - r_lag4.power_consumption,
            latest.generator_temperature - r_lag4.generator_temperature,

            # 6. Rolling
            mean_cons,
            std_cons,
            mean_temp,
            std_temp,

            # 7. Physical indicators
            thermal_gradient,
            wind_cooling,
            load_factor,
            discharge_stress,
            life_support_margin,

            # 8. Status
            *status_flags
        ]

        return np.array([vector], dtype=np.float32)

    @classmethod
    def build_training_dataset(
        cls,
        records: List[SyntheticTelemetryPoint],
        station_id: str = "station-maitri",
        lookback_steps: int = 8
    ) -> Tuple[np.ndarray, np.ndarray, List[str], List[str]]:
        """
        Builds feature matrix X and multi-horizon target matrix Y for supervised learning.
        Target matrix contains 20 continuous variables across 4 forward horizons (+15m, +30m, +60m, +120m).
        """
        n = len(records)
        max_horizon_step = 8 # +120m is 8 steps ahead for 15-min intervals
        
        if n < (lookback_steps + max_horizon_step + 10):
            raise ValueError(f"Insufficient telemetry data ({n} records). Minimum {lookback_steps + max_horizon_step + 10} required.")

        X_rows = []
        Y_rows = []

        batt_series = [r.battery_level for r in records]
        gen_series = [r.power_generation for r in records]
        dem_series = [r.power_consumption for r in records]
        temp_series = [r.generator_temperature for r in records]
        life_series = [r.life_support_reserve for r in records]

        for i in range(lookback_steps, n - max_horizon_step):
            r = records[i]
            dt = r.timestamp
            hour_float = dt.hour + dt.minute / 60.0
            sin_hour = math.sin(2.0 * math.pi * hour_float / 24.0)
            cos_hour = math.cos(2.0 * math.pi * hour_float / 24.0)

            # Lags
            r_lag1 = records[i - 1]
            r_lag2 = records[i - 2]
            r_lag4 = records[i - 4]

            # Rolling stats over lookback
            window_dem = dem_series[i - lookback_steps:i + 1]
            window_temp = temp_series[i - lookback_steps:i + 1]
            mean_cons = float(np.mean(window_dem))
            std_cons = float(np.std(window_dem)) if len(window_dem) > 1 else 0.5
            mean_temp = float(np.mean(window_temp))
            std_temp = float(np.std(window_temp)) if len(window_temp) > 1 else 0.3

            thermal_gradient = r.generator_temperature - r.ambient_temperature
            wind_cooling = (r.wind_velocity * thermal_gradient) / 100.0
            load_factor = r.power_consumption / max(40.0, r.power_generation)
            net_power = r.power_generation - r.power_consumption
            discharge_stress = max(0.0, -net_power) / max(1.0, r.battery_level)
            life_support_margin = r.life_support_reserve - 80.0

            status_flags = cls._status_flags(r.generator_status)

            x_vec = [
                # 1. Base telemetry
                r.battery_level,
                r.power_generation,
                r.power_consumption,
                net_power,
                r.generator_temperature,
                r.ambient_temperature,
                r.wind_velocity,
                r.humidity,
                r.life_support_reserve,
                r.bus_voltage,

                # 2. What-If inputs (at training time, matches observation with minor stochastic jitter)
                r.ambient_temperature,
                r.generator_capacity_derate,
                r.wind_velocity,
                80.0,

                # 3. Diurnal
                sin_hour,
                cos_hour,

                # 4. Lags
                r_lag1.battery_level,
                r_lag1.power_consumption,
                r_lag1.power_generation,
                r_lag1.generator_temperature,
                r_lag2.battery_level,
                r_lag2.power_consumption,
                r_lag2.generator_temperature,
                r_lag4.battery_level,
                r_lag4.power_consumption,
                r_lag4.generator_temperature,

                # 5. Deltas
                r.battery_level - r_lag1.battery_level,
                r.power_consumption - r_lag1.power_consumption,
                r.generator_temperature - r_lag1.generator_temperature,
                r.battery_level - r_lag4.battery_level,
                r.power_consumption - r_lag4.power_consumption,
                r.generator_temperature - r_lag4.generator_temperature,

                # 6. Rolling
                mean_cons,
                std_cons,
                mean_temp,
                std_temp,

                # 7. Physical indicators
                thermal_gradient,
                wind_cooling,
                load_factor,
                discharge_stress,
                life_support_margin,

                # 8. Status
                *status_flags
            ]

            # Forward Targets: +1 step (15m), +2 steps (30m), +4 steps (60m), +8 steps (120m)
            y_vec = [
                # 15m
                batt_series[i + 1], gen_series[i + 1], dem_series[i + 1], temp_series[i + 1], life_series[i + 1],
                # 30m
                batt_series[i + 2], gen_series[i + 2], dem_series[i + 2], temp_series[i + 2], life_series[i + 2],
                # 60m
                batt_series[i + 4], gen_series[i + 4], dem_series[i + 4], temp_series[i + 4], life_series[i + 4],
                # 120m
                batt_series[i + 8], gen_series[i + 8], dem_series[i + 8], temp_series[i + 8], life_series[i + 8],
            ]

            X_rows.append(x_vec)
            Y_rows.append(y_vec)

        X = np.array(X_rows, dtype=np.float32)
        Y = np.array(Y_rows, dtype=np.float32)

        return X, Y, FEATURE_NAMES, TARGET_NAMES
