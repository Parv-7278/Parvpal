import uuid
from datetime import datetime
from typing import Dict, Any, List
from models.schemas import (
    SimulationRequest,
    SimulationResponse,
    SimulationMetricDelta,
    ScenarioTypeEnum,
    StationIdEnum
)

class SimulationEngine:
    @classmethod
    def run_simulation(cls, request: SimulationRequest) -> SimulationResponse:
        station_id_str = request.station_id.value
        is_maitri = "maitri" in station_id_str.lower()
        station_name = "MAITRI" if is_maitri else "BHARATI"

        # Baseline Parameters
        if is_maitri:
            base_gen = 132.0
            base_cons = 105.0
            base_batt_kwh = 2960.0
            base_fuel_liters = 50200.0
            base_fuel_days = 43.0
        else:
            base_gen = 185.0
            base_cons = 148.0
            base_batt_kwh = 5460.0
            base_fuel_liters = 78500.0
            base_fuel_days = 68.0

        scenario = request.scenario_type
        sim_id = f"sim-{uuid.uuid4().hex[:8]}"

        # Calculation logic based on scenario
        if scenario == ScenarioTypeEnum.GENERATOR_FAILURE:
            scenario_label = "Primary Diesel Generator Sudden Trip / Fault"
            power_drop_pct = -28.0 if is_maitri else -22.0
            sim_gen = base_gen * (1.0 + power_drop_pct / 100.0)
            sim_cons = base_cons * 0.85 if request.shed_non_critical_loads else base_cons
            deficit = max(0.0, sim_cons - sim_gen)
            reserve_hours = round(base_batt_kwh / max(1.0, deficit if deficit > 0 else 10.0), 1)
            risk_score = 62 if is_maitri else 45
            risk_level = "Medium"
            risk_color = "#f59e0b"
            power_color = "#ef4444"
            load_action_str = "Auto-Shed Non-Critical Labs" if request.shed_non_critical_loads else "Overload Warning"
            mitigations = [
                f"Transfer essential loads to Standby Generator #2.",
                f"Shed secondary heating circuits in science module and storage bays.",
                f"Engage lithium battery storage to bridge automatic synchronizer start."
            ]

        elif scenario == ScenarioTypeEnum.BLIZZARD_KATABATIC:
            scenario_label = f"Extreme Polar Blizzard & Katabatic Gale (-35°C, {90 + int(request.wind_spike_kmh)} km/h)"
            power_spike_pct = 38.0 if is_maitri else 32.0
            sim_gen = base_gen + (15.0 if is_maitri else 20.0) # wind turbine boost
            sim_cons = base_cons * (1.0 + power_spike_pct / 100.0)
            reserve_hours = 14.0 if is_maitri else 20.0
            risk_score = 78
            risk_level = "High"
            risk_color = "#ef4444"
            power_color = "#ef4444"
            load_action_str = "Priority Habitation Hold"
            mitigations = [
                f"Lock down exterior solar arrays and feather wind turbine pitch if gusts > 110 km/h.",
                f"Maximize trace heating on freshwater pipelines and diesel fuel manifold.",
                f"Enforce mandatory red-alert station shelter-in-place for all expedition crew."
            ]

        elif scenario == ScenarioTypeEnum.LAKE_INTAKE_FREEZE:
            scenario_label = "Lake Priyadarshini Sub-Surface Water Intake Freeze (Maitri)"
            sim_gen = base_gen
            sim_cons = base_cons + 14.0 # Auxiliary melt skid heater power
            reserve_hours = 28.0
            risk_score = 55
            risk_level = "Medium"
            risk_color = "#f59e0b"
            power_color = "#38bdf8"
            load_action_str = "Emergency Melt Skid Active"
            mitigations = [
                f"Increase electrical heat tracing from 35% to 85% power along Lake Priyadarshini pipeline.",
                f"Activate secondary indoor snow-melt reservoir tank (40,000 L buffer).",
                f"Deploy heated steam probe if flow differential indicates ice bridging."
            ]

        elif scenario == ScenarioTypeEnum.FUEL_CONVOY_DELAY:
            scenario_label = "Resupply Vessel / Snowcat Overland Convoy 3-Week Delay"
            sim_gen = base_gen * 0.88
            sim_cons = base_cons * 0.85
            reserve_hours = 528.0 # 22 days
            risk_score = 35
            risk_level = "Low"
            risk_color = "#10b981"
            power_color = "#38bdf8"
            load_action_str = "Economy Fuel Conservation Mode"
            mitigations = [
                f"Initiate Stage-1 fuel conservation protocol (temperature setpoint adjusted to 19.5°C).",
                f"Maximize solar and wind renewable contribution during diurnal peaks.",
                f"Reschedule heavy equipment workshop usage and non-urgent snow groomer runs."
            ]

        elif scenario == ScenarioTypeEnum.RADOME_ICING:
            scenario_label = "Prydz Bay Maritime Coastal Riming & Radome Freezing (Bharati)"
            sim_gen = base_gen
            sim_cons = base_cons + 32.0 # Radome de-icing heaters
            reserve_hours = 20.0
            risk_score = 68
            risk_level = "High"
            risk_color = "#ef4444"
            power_color = "#ef4444"
            load_action_str = "Satellite Link Priority Lock"
            mitigations = [
                f"Circulate secondary CHP thermal glycol loop directly into radome base ducting.",
                f"Pre-warm tracking dish azimuth gearbox before scheduled RISAT-2B pass.",
                f"Switch non-essential research servers to idle state during de-icing cycle."
            ]

        elif scenario == ScenarioTypeEnum.SEAWATER_DESAL_ICE:
            scenario_label = "Sub-Sea Seawater Intake Ice Blockage (Bharati Desalination)"
            sim_gen = base_gen
            sim_cons = base_cons + 18.0
            reserve_hours = 34.0
            risk_score = 52
            risk_level = "Medium"
            risk_color = "#f59e0b"
            power_color = "#38bdf8"
            load_action_str = "Freshwater Buffer Draw (45k L)"
            mitigations = [
                f"Reverse pump cycle with heated brine to clear intake suction grille.",
                f"Rely on indoor 45,000 L potable water reserve bank.",
                f"Inspect sub-sea acoustic Doppler sensor for tidal frazil ice concentration."
            ]

        else: # SOLAR_BLACKOUT
            scenario_label = "Polar Night Complete Solar Absence (Winter-Over Phase)"
            sim_gen = base_gen - 15.0
            sim_cons = base_cons
            reserve_hours = 48.0
            risk_score = 40
            risk_level = "Moderate"
            risk_color = "#38bdf8"
            power_color = "#fbbf24"
            load_action_str = "100% Thermal CHP / Diesel Load"
            mitigations = [
                f"Transition grid controller to continuous dual-generator synchronized baseload.",
                f"Utilize generator exhaust heat recovery for 100% of station space heating.",
                f"Maintain battery state-of-charge above 80% as immediate spinning reserve buffer."
            ]

        power_delta_pct_val = round(((sim_gen - base_gen) / base_gen) * 100.0, 1)
        power_delta_str = f"{power_delta_pct_val:+0.1f}%"

        power_delta_item = SimulationMetricDelta(
            label="Available Power",
            initial_value=f"{base_gen:.0f} kW",
            simulated_value=f"{sim_gen:.0f} kW",
            delta=power_delta_str,
            note="( Grid Shift )",
            status_color=power_color
        )

        batt_reserve_item = SimulationMetricDelta(
            label="Battery Reserve",
            initial_value=f"{base_batt_kwh / 100:.0f} Hrs",
            simulated_value=f"{reserve_hours:.0f} Hrs",
            delta=f"{reserve_hours:.0f} Hours Buffer",
            note="( Active Reserve )",
            status_color="#fbbf24" if reserve_hours < 24 else "#10b981"
        )

        load_action_item = SimulationMetricDelta(
            label="Non-critical Load",
            initial_value="Standard Grid Mode",
            simulated_value=load_action_str,
            delta="Controlled Load Shedding" if request.shed_non_critical_loads else "No Load Shedding",
            note="( Priority Hold )",
            status_color="#38bdf8"
        )

        mission_risk_item = SimulationMetricDelta(
            label="Mission Risk",
            initial_value="Nominal (8%)",
            simulated_value=f"{risk_level} ({risk_score}%)",
            delta=f"+{risk_score - 8}% Risk Elevation",
            note="( Thermal / Power Margin )",
            status_color=risk_color
        )

        metrics_map = {
            "powerDelta": power_delta_str,
            "powerNote": "( Grid Shift )",
            "batteryReserve": f"{reserve_hours:.0f} Hrs",
            "batteryNote": "( Reserve )",
            "loadAction": load_action_str,
            "loadNote": "( Habitation )",
            "risk": risk_level,
            "riskNote": f"( {risk_score}% Probability )",
            "riskColor": risk_color,
            "powerColor": power_color
        }

        return SimulationResponse(
            simulation_id=sim_id,
            station_id=station_id_str,
            station_name=station_name,
            scenario_type=scenario.value,
            scenario_label=scenario_label,
            metrics=metrics_map,
            power_delta=power_delta_item,
            battery_reserve=batt_reserve_item,
            load_action=load_action_item,
            mission_risk=mission_risk_item,
            overall_risk_level=risk_level,
            risk_score_pct=risk_score,
            estimated_depletion_hours=reserve_hours,
            recommended_mitigations=mitigations,
            executed_at=datetime.utcnow()
        )
