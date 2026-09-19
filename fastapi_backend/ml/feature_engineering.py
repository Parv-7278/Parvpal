"""
Feature Engineering for POLARIS Microgrid Predictive Machine Learning.
Extracts temporal lags, diurnal harmonics, rolling statistics, thermal cooling gradients,
and microgrid electrical balance indicators.
"""

import math
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
import numpy as np

from .telemetry_dataset import TelemetryRecord

FEATURE_NAMES = [
    # 1. Base instantaneous values (t)
    "curr_battery",
    "curr_consumption",
    "curr_generation",
    "curr_surplus",
    "curr_gen_temp",
    "curr_ambient_temp",
    "curr_wind_speed",
    "curr_humidity",
    "curr_voltage",
    "curr_current",
    # 2. Diurnal harmonics
    "sin_hour",
    "cos_hour",
    # 3. Lag features (t-1, t-3, t-6)
    "lag1_battery",
    "lag1_consumption",
    "lag1_gen_temp",
    "lag3_battery",
    "lag3_consumption",
    "lag3_gen_temp",
    "lag6_battery",
    "lag6_consumption",
    "lag6_gen_temp",
    # 4. Moving rates of change (1-step and 3-step deltas)
    "delta_battery_1step",
    "delta_consumption_1step",
    "delta_temp_1step",
    "delta_battery_3step",
    "delta_consumption_3step",
    "delta_temp_3step",
    # 5. Rolling statistics (lookback 6)
    "rolling_mean_cons_6",
    "rolling_std_cons_6",
    "rolling_mean_temp_6",
    "rolling_std_temp_6",
    # 6. Physical microgrid & thermal indicators
    "thermal_gradient",          # (gen_temp - ambient_temp)
    "wind_cooling_factor",       # (wind_speed * thermal_gradient / 100.0)
    "generation_headroom_ratio", # (generation / consumption)
    "load_factor",               # (consumption / station_nominal_capacity)
    # 7. Generator operational status flags
    "status_running",
    "status_standby",
    "status_overheat",
    "status_fault",
]

TARGET_KEYS = [
    "batt_1h", "batt_6h", "batt_24h",
    "cons_1h", "cons_6h", "cons_24h",
    "temp_1h", "temp_6h", "temp_24h"
]


class FeatureEngineer:
    """Transforms raw TelemetryRecords into structured NumPy feature matrices for training and inference."""

    @staticmethod
    def _compute_status_one_hot(status: str) -> List[float]:
        s = status.upper()
        return [
            1.0 if s == "RUNNING" else 0.0,
            1.0 if s == "STANDBY" else 0.0,
            1.0 if s == "OVERHEAT" else 0.0,
            1.0 if s == "FAULT" else 0.0,
        ]

    @classmethod
    def extract_single_feature_vector(
        cls,
        history: List[TelemetryRecord],
        station_id: str = "maitri"
    ) -> np.ndarray:
        """
        Extracts feature vector for the latest observation in history for online inference.
        Requires at least 1 record; pads lookback if history is short.
        """
        if not history:
            raise ValueError("Telemetry history is empty.")

        n = len(history)
        latest = history[-1]
        is_bharati = "bharati" in station_id.lower()
        nominal_capacity = 190.0 if is_bharati else 135.0

        dt = latest.timestamp
        hour = dt.hour + dt.minute / 60.0
        sin_h = math.sin(2 * math.pi * hour / 24.0)
        cos_h = math.cos(2 * math.pi * hour / 24.0)

        # Lookbacks
        r_1 = history[-2] if n >= 2 else latest
        r_3 = history[-4] if n >= 4 else (history[0] if n > 0 else latest)
        r_6 = history[-7] if n >= 7 else (history[0] if n > 0 else latest)

        # Rolling statistics
        window_records = history[-6:] if n >= 6 else history
        cons_vals = [r.power_consumption for r in window_records]
        temp_vals = [r.generator_temperature for r in window_records]

        mean_cons = float(np.mean(cons_vals))
        std_cons = float(np.std(cons_vals)) if len(cons_vals) > 1 else 0.5
        mean_temp = float(np.mean(temp_vals))
        std_temp = float(np.std(temp_vals)) if len(temp_vals) > 1 else 0.2

        # Physics indicators
        thermal_gradient = latest.generator_temperature - latest.ambient_temperature
        wind_cooling = (latest.wind_speed * thermal_gradient) / 100.0
        headroom = latest.energy_generation / max(1.0, latest.power_consumption)
        load_factor = latest.power_consumption / nominal_capacity

        status_flags = cls._compute_status_one_hot(latest.generator_status)

        vector = [
            # Base instantaneous
            latest.battery_level,
            latest.power_consumption,
            latest.energy_generation,
            latest.surplus if latest.surplus is not None else (latest.energy_generation - latest.power_consumption),
            latest.generator_temperature,
            latest.ambient_temperature,
            latest.wind_speed,
            latest.humidity,
            latest.voltage or 415.0,
            latest.current or (latest.power_consumption * 1.6),
            # Diurnal
            sin_h,
            cos_h,
            # Lags
            r_1.battery_level,
            r_1.power_consumption,
            r_1.generator_temperature,
            r_3.battery_level,
            r_3.power_consumption,
            r_3.generator_temperature,
            r_6.battery_level,
            r_6.power_consumption,
            r_6.generator_temperature,
            # Deltas
            latest.battery_level - r_1.battery_level,
            latest.power_consumption - r_1.power_consumption,
            latest.generator_temperature - r_1.generator_temperature,
            latest.battery_level - r_3.battery_level,
            latest.power_consumption - r_3.power_consumption,
            latest.generator_temperature - r_3.generator_temperature,
            # Rolling
            mean_cons,
            std_cons,
            mean_temp,
            std_temp,
            # Physics & status
            thermal_gradient,
            wind_cooling,
            headroom,
            load_factor,
            *status_flags
        ]

        return np.array([vector], dtype=np.float32)

    @classmethod
    def build_training_matrix(
        cls,
        records: List[TelemetryRecord],
        station_id: str = "maitri",
        lookback_window: int = 6
    ) -> Tuple[np.ndarray, np.ndarray, List[str], List[str]]:
        """
        Builds complete feature matrix X and multi-horizon target matrix Y for supervised model training.
        X shape: (N - lookback, num_features)
        Y shape: (N - lookback, 9) [batt_1h, batt_6h, batt_24h, cons_1h, cons_6h, cons_24h, temp_1h, temp_6h, temp_24h]
        """
        n = len(records)
        if n < (lookback_window + 2):
            raise ValueError(f"Insufficient records ({n}) for training. Minimum {lookback_window + 2} required.")

        is_bharati = "bharati" in station_id.lower()
        nominal_capacity = 190.0 if is_bharati else 135.0

        batt_series = [r.battery_level for r in records]
        cons_series = [r.power_consumption for r in records]
        temp_series = [r.generator_temperature for r in records]

        X_rows = []
        Y_rows = []

        for i in range(lookback_window, n):
            r = records[i]
            dt = r.timestamp
            hour = dt.hour + dt.minute / 60.0
            sin_h = math.sin(2 * math.pi * hour / 24.0)
            cos_h = math.cos(2 * math.pi * hour / 24.0)

            # Lags
            r_1 = records[i - 1]
            r_3 = records[i - 3] if i >= 3 else records[0]
            r_6 = records[i - 6] if i >= 6 else records[0]

            # Rolling stats over lookback
            window = cons_series[max(0, i - 6):i + 1]
            temp_window = temp_series[max(0, i - 6):i + 1]
            mean_cons = float(np.mean(window))
            std_cons = float(np.std(window)) if len(window) > 1 else 0.5
            mean_temp = float(np.mean(temp_window))
            std_temp = float(np.std(temp_window)) if len(temp_window) > 1 else 0.2

            # Physics
            thermal_gradient = r.generator_temperature - r.ambient_temperature
            wind_cooling = (r.wind_speed * thermal_gradient) / 100.0
            headroom = r.energy_generation / max(1.0, r.power_consumption)
            load_factor = r.power_consumption / nominal_capacity

            status_flags = cls._compute_status_one_hot(r.generator_status)

            surplus_val = r.surplus if r.surplus is not None else (r.energy_generation - r.power_consumption)

            x_vec = [
                r.battery_level,
                r.power_consumption,
                r.energy_generation,
                surplus_val,
                r.generator_temperature,
                r.ambient_temperature,
                r.wind_speed,
                r.humidity,
                r.voltage or 415.0,
                r.current or (r.power_consumption * 1.6),
                sin_h,
                cos_h,
                r_1.battery_level,
                r_1.power_consumption,
                r_1.generator_temperature,
                r_3.battery_level,
                r_3.power_consumption,
                r_3.generator_temperature,
                r_6.battery_level,
                r_6.power_consumption,
                r_6.generator_temperature,
                r.battery_level - r_1.battery_level,
                r.power_consumption - r_1.power_consumption,
                r.generator_temperature - r_1.generator_temperature,
                r.battery_level - r_3.battery_level,
                r.power_consumption - r_3.power_consumption,
                r.generator_temperature - r_3.generator_temperature,
                mean_cons,
                std_cons,
                mean_temp,
                std_temp,
                thermal_gradient,
                wind_cooling,
                headroom,
                load_factor,
                *status_flags
            ]
            X_rows.append(x_vec)

            # Targets (+1, +6, +24 horizons)
            idx_1h = min(i + 1, n - 1)
            idx_6h = min(i + 6, n - 1)
            idx_24h = min(i + 24, n - 1)

            y_vec = [
                batt_series[idx_1h],
                batt_series[idx_6h],
                batt_series[idx_24h],
                cons_series[idx_1h],
                cons_series[idx_6h],
                cons_series[idx_24h],
                temp_series[idx_1h],
                temp_series[idx_6h],
                temp_series[idx_24h],
            ]
            Y_rows.append(y_vec)

        X = np.array(X_rows, dtype=np.float32)
        Y = np.array(Y_rows, dtype=np.float32)

        return X, Y, FEATURE_NAMES, TARGET_KEYS
