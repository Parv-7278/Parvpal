"""
POLARIS Antarctic Research Station - Physics-Constrained Synthetic Telemetry Generator.

NOTE & DISCLOSURE:
This dataset generator produces SYNTHETIC telemetry representing realistic polar microgrid
operations for India's Antarctic stations (Maitri & Bharati).
It is explicitly labeled as SYNTHETIC in accordance with ML transparency standards.
It incorporates thermodynamic, aerodynamic, electrical, and life-support governing equations:
1. Colder ambient temperatures increase habitat heating load and trace heating power draw.
2. Higher katabatic wind velocities cause convective heat loss and gust-induced mechanical/electrical stress.
3. Generator capacity derates reduce available kW and increase thermal rise on surviving alternators.
4. Power deficits accelerate Battery Energy Storage System (BESS) state-of-charge depletion.
5. Prolonged thermal and electrical stress increases equipment failure probability and reduces life-support margins.
"""

import math
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SyntheticTelemetryPoint(BaseModel):
    """Normalized observation for Antarctic station telemetry."""
    timestamp: datetime
    station_id: str
    ambient_temperature: float    # °C (-55 to -5)
    wind_velocity: float          # km/h (0 to 160)
    humidity: float               # % (30 to 95)
    power_generation: float       # kW (0 to 220)
    power_consumption: float      # kW (40 to 220)
    battery_level: float          # % (10 to 100)
    generator_temperature: float  # °C (45 to 115)
    generator_status: str         # 'RUNNING', 'DERATED', 'OVERHEAT', 'FAULT'
    generator_capacity_derate: float # % derated (0 to 100)
    life_support_reserve: float   # % (20 to 100)
    fuel_reserves_liters: float   # Liters (10,000 to 90,000)
    bus_voltage: float            # V (380 to 425)

class SyntheticPolarTelemetryGenerator:
    """
    Generates multi-day physics-consistent synthetic time-series for model training & evaluation.
    """

    @classmethod
    def generate_station_dataset(
        cls,
        station_id: str = "station-maitri",
        num_hours: int = 720,  # 30 days of hourly telemetry
        step_minutes: int = 15, # 15-minute intervals (2,880 samples for 30 days)
        seed: int = 42
    ) -> List[SyntheticTelemetryPoint]:
        random.seed(seed)
        is_bharati = "bharati" in station_id.lower()
        clean_id = "station-bharati" if is_bharati else "station-maitri"

        # Baseline ratings
        nominal_gen_kw = 185.0 if is_bharati else 132.0
        base_demand_kw = 145.0 if is_bharati else 105.0
        batt_capacity_kwh = 480.0 if is_bharati else 320.0
        initial_batt_pct = 88.0 if is_bharati else 78.0
        initial_fuel_liters = 78000.0 if is_bharati else 50000.0
        initial_life_support = 95.0

        total_steps = int((num_hours * 60) / step_minutes)
        start_time = datetime.now(timezone.utc) - timedelta(hours=num_hours)

        records: List[SyntheticTelemetryPoint] = []

        curr_batt = initial_batt_pct
        curr_gen_temp = 72.0 if is_bharati else 78.0
        curr_fuel = initial_fuel_liters
        curr_life_support = initial_life_support

        for step in range(total_steps):
            current_time = start_time + timedelta(minutes=step * step_minutes)
            hour_float = current_time.hour + current_time.minute / 60.0
            day_idx = step // (24 * (60 // step_minutes))

            # 1. Weather Cycles (Diurnal cycle + multi-day storm front waves)
            storm_wave = math.sin(day_idx * 0.45) * 12.0
            daily_temp_cycle = math.sin((hour_float - 14) * math.pi / 12) * 4.5
            ambient_temp = round(-26.0 + storm_wave + daily_temp_cycle + random.gauss(0, 1.2), 1)
            ambient_temp = max(-52.0, min(-8.0, ambient_temp))

            # Wind speed with katabatic gusting
            wind_base = 35.0 if is_bharati else 28.0
            wind_gust = max(0.0, math.sin(day_idx * 0.7 + hour_float * 0.1) * 35.0)
            wind_velocity = round(wind_base + wind_gust + random.uniform(-4.0, 6.0), 1)
            wind_velocity = max(5.0, min(145.0, wind_velocity))

            humidity = round(max(35.0, min(92.0, 65.0 + math.sin(hour_float * 0.2) * 15.0 + random.gauss(0, 3.0))), 1)

            # 2. Station Power Demand (Colder temp & higher wind -> more heating load)
            heating_load_kw = max(0.0, (-18.0 - ambient_temp) * (1.15 if is_bharati else 0.95))
            wind_convective_load_kw = max(0.0, (wind_velocity - 40.0) * 0.24)
            daily_activity_load_kw = math.sin((hour_float - 7) * math.pi / 12) * (14.0 if is_bharati else 10.0)

            total_demand_kw = round(
                base_demand_kw + heating_load_kw + wind_convective_load_kw + daily_activity_load_kw + random.gauss(0, 2.5),
                1
            )
            total_demand_kw = max(45.0, min(240.0, total_demand_kw))

            # 3. Generator Derate & Fault Scenarios (Synthetic Stress Injections)
            is_stress_event = (day_idx % 6 == 4) and (10 <= hour_float <= 18)
            gen_derate_pct = 35.0 if is_stress_event else 0.0

            # Renewable yield contribution (Solar + Wind turbine)
            solar_yield = max(0.0, math.sin((hour_float - 4) * math.pi / 14)) * (22.0 if is_bharati else 14.0)
            wind_yield = min(35.0, (wind_velocity / 45.0) * (20.0 if is_bharati else 12.0))

            available_gen_capacity = nominal_gen_kw * (1.0 - (gen_derate_pct / 100.0))
            total_generation_kw = round(min(available_gen_capacity + solar_yield + wind_yield, 230.0), 1)

            # 4. Power Balance & Battery State of Charge
            net_power_kw = total_generation_kw - total_demand_kw
            dt_hours = step_minutes / 60.0

            if net_power_kw < 0:
                # Discharging BESS
                discharge_kwh = abs(net_power_kw) * dt_hours
                batt_delta_pct = (discharge_kwh / batt_capacity_kwh) * 100.0
                curr_batt = max(12.0, curr_batt - batt_delta_pct)
            else:
                # Surplus charging
                charge_kwh = min(net_power_kw * 0.75, 25.0) * dt_hours
                batt_delta_pct = (charge_kwh / batt_capacity_kwh) * 100.0
                curr_batt = min(99.0, curr_batt + batt_delta_pct)

            curr_batt = round(curr_batt, 2)

            # 5. Generator Stator Thermal Dynamics
            load_factor = total_demand_kw / max(60.0, available_gen_capacity)
            target_stator_temp = (74.0 if is_bharati else 80.0) + (load_factor - 0.7) * 32.0 + (gen_derate_pct * 0.25)
            # Convective cooling effect
            target_stator_temp -= (wind_velocity * 0.04)

            curr_gen_temp = curr_gen_temp + (target_stator_temp - curr_gen_temp) * 0.08 + random.gauss(0, 0.2)
            curr_gen_temp = round(max(45.0, min(112.0, curr_gen_temp)), 1)

            # Generator operational status
            if curr_gen_temp >= 95.0:
                gen_status = "OVERHEAT"
            elif gen_derate_pct > 20.0:
                gen_status = "DERATED"
            elif curr_gen_temp >= 88.0:
                gen_status = "WARNING"
            else:
                gen_status = "RUNNING"

            # 6. Life-Support Reserve Depletion
            # Life support draws continuous buffer; decreases faster if battery < 40% or temp < -35°C
            if curr_batt < 40.0 or ambient_temp < -38.0:
                curr_life_support = max(15.0, curr_life_support - (0.08 * dt_hours))
            else:
                curr_life_support = min(99.0, curr_life_support + (0.04 * dt_hours))
            curr_life_support = round(curr_life_support, 2)

            # 7. Fuel Consumption
            fuel_burn_rate_l_hr = (total_demand_kw / 3.2) * dt_hours
            curr_fuel = max(5000.0, curr_fuel - fuel_burn_rate_l_hr)

            bus_voltage = round(415.0 - (total_demand_kw / 220.0) * 8.0 + random.gauss(0, 0.5), 1)

            records.append(SyntheticTelemetryPoint(
                timestamp=current_time,
                station_id=clean_id,
                ambient_temperature=ambient_temp,
                wind_velocity=wind_velocity,
                humidity=humidity,
                power_generation=total_generation_kw,
                power_consumption=total_demand_kw,
                battery_level=curr_batt,
                generator_temperature=curr_gen_temp,
                generator_status=gen_status,
                generator_capacity_derate=gen_derate_pct,
                life_support_reserve=curr_life_support,
                fuel_reserves_liters=round(curr_fuel, 1),
                bus_voltage=bus_voltage
            ))

        return records
