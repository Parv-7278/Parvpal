from datetime import datetime
from typing import List, Dict, Optional, Any, Union
from enum import Enum
from pydantic import BaseModel, Field

# ==============================================================================
# ENUMS
# ==============================================================================

class StationIdEnum(str, Enum):
    MAITRI = "station-maitri"
    BHARATI = "station-bharati"

class StatusLevelEnum(str, Enum):
    NORMAL = "normal"
    WARNING = "warning"
    CRITICAL = "critical"
    OPTIMAL = "optimal"

class ScenarioTypeEnum(str, Enum):
    GENERATOR_FAILURE = "GENERATOR_FAILURE"
    BLIZZARD_KATABATIC = "BLIZZARD_KATABATIC"
    LAKE_INTAKE_FREEZE = "LAKE_INTAKE_FREEZE"
    FUEL_CONVOY_DELAY = "FUEL_CONVOY_DELAY"
    RADOME_ICING = "RADOME_ICING"
    SEAWATER_DESAL_ICE = "SEAWATER_DESAL_ICE"
    SOLAR_BLACKOUT = "SOLAR_BLACKOUT"

# ==============================================================================
# 1. STATION BASE SCHEMAS
# ==============================================================================

class StationMetadata(BaseModel):
    id: str
    name: str
    full_name: str
    country: str = "India"
    established: int
    region: str
    coords: str
    status: str = "Online"
    status_color: str = "#10b981"
    altitude: str
    environment_type: str
    hero_image: Optional[str] = None

# ==============================================================================
# 2. STATION HEALTH INDEX SCHEMAS
# ==============================================================================

class SubsystemScore(BaseModel):
    id: str
    label: str
    score: int = Field(ge=0, le=100)
    status: str
    color: str

class StationHealthResponse(BaseModel):
    station_id: str
    station_name: str
    total_score: int = Field(ge=0, le=100)
    rating: str
    rating_color: str
    infrastructure: int
    energy: int
    logistics: int
    environment: int
    communication: int
    subsystems: List[SubsystemScore]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 3. 3D MODULES & DIGITAL TWIN SCHEMAS
# ==============================================================================

class DigitalTwinPin(BaseModel):
    id: str
    name: str
    status: str
    type: str  # 'normal', 'warning', 'critical'
    top: str
    left: str
    temp: str
    power: str
    pressure: str
    subsystem: str
    notes: str

class BuildingSystem(BaseModel):
    name: str
    status: str
    status_type: str

class BuildingMaintenance(BaseModel):
    last_inspection: str
    next_scheduled: str
    health: str
    notes: str

class BuildingDetail(BaseModel):
    id: str
    name: str
    category: str
    status: str
    status_type: str
    metric_label: str
    metric_val: str
    type: str
    built_year: str
    area: str
    occupancy: str
    description: str
    pin_pos: Optional[Dict[str, str]] = None
    systems: List[BuildingSystem] = []
    maintenance: Optional[BuildingMaintenance] = None

class StationModulesResponse(BaseModel):
    station_id: str
    station_name: str
    pins_count: int
    pins: List[DigitalTwinPin]
    buildings: Dict[str, BuildingDetail]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 4. ENERGY FLOW METRICS SCHEMAS
# ==============================================================================

class EnergySource(BaseModel):
    name: str
    current_kw: float
    max_kw: float
    load_pct: float
    runtime: str
    status: str

class EnergyBreakdownItem(BaseModel):
    name: str
    kw: float
    pct: float
    color: str

class EnergyForecast(BaseModel):
    expected_gen: str
    gen_delta: str
    expected_cons: str
    cons_delta: str
    battery_reserve: str

class EnergyFlowResponse(BaseModel):
    station_id: str
    station_name: str
    generation_kw: float
    consumption_kw: float
    surplus_kw: float
    battery_percent: float
    battery_charge_kwh: str
    battery_capacity_kwh: str
    fuel_liters: str
    fuel_days: str
    daily_usage_liters: str
    fuel_bar_percent: float
    sources: Dict[str, EnergySource]
    breakdown: List[EnergyBreakdownItem]
    forecast: EnergyForecast
    ai_insights: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. LOGISTICS INVENTORY SCHEMAS
# ==============================================================================

class LogisticsItem(BaseModel):
    id: str
    name: str
    amount: str
    percent: float
    days_left: str
    bar_color: str
    icon_color: str

class ResourceTrendData(BaseModel):
    selected_default: str
    unit: str
    y_max: str
    y_mid: str
    y_low: str
    depletion_date: str
    actual_path: str
    forecast_path: str

class LogisticsResponse(BaseModel):
    station_id: str
    station_name: str
    items: List[LogisticsItem]
    resource_trend: ResourceTrendData
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 6. ENVIRONMENT TELEMETRY SCHEMAS
# ==============================================================================

class SparklineWaveforms(BaseModel):
    temp: str
    wind: str
    snow: str
    visibility: str

class EnvironmentTelemetryResponse(BaseModel):
    station_id: str
    station_name: str
    temp_c: str
    condition: str
    wind_speed_kmh: str
    wind_dir: str
    humidity_pct: str
    pressure_hpa: str
    visibility_km: str
    snow_accumulation_cm: str
    local_time: str
    date_str: str
    sparklines: SparklineWaveforms
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 7. DEDICATED RESEARCH ROUTE SCHEMAS (/api/stations/{id}/research)
# ==============================================================================

class SeismicReading(BaseModel):
    station_id: str
    sensor_model: str = "Nanometrics Trillium 120QA High-Gain Seismometer"
    dominant_frequency_hz: float = Field(..., description="Dominant tremor frequency in Hz")
    peak_ground_acceleration_g: float = Field(..., description="Peak ground acceleration in g")
    tremor_amplitude_um: float = Field(..., description="Ground displacement amplitude in micrometers")
    status: str = Field(..., description="Status e.g. 'MICRO_SEISMIC', 'NOMINAL', 'ELEVATED'")
    event_classification: str = Field(..., description="e.g. 'GLACIAL_CALVING', 'ICE_SHEET_FRACTURE', 'TECTONIC_MICRO'")
    borehole_depth_meters: float

class SnowAccumulationData(BaseModel):
    station_id: str
    sensor_model: str = "Campbell Scientific SR50A Acoustic Ultrasonic Depth Sensor"
    snowpack_total_depth_cm: float
    snow_accumulation_24h_cm: float
    drift_accumulation_rate_cm_per_hr: float
    snow_density_kg_per_m3: float
    subsurface_firn_temperature_c: float

class GeomagneticKpIndex(BaseModel):
    station_id: str
    sensor_model: str = "Fluxgate Tri-Axial Magnetometer (dIdD)"
    kp_index_current: float = Field(..., ge=0.0, le=9.0, description="Planetary Kp Index (0-9)")
    storm_classification: str = Field(..., description="'G0_QUIET', 'G1_MINOR', 'G2_MODERATE', 'G3_STRONG', 'G4_SEVERE'")
    total_magnetic_field_intensity_nt: float = Field(..., description="Total geomagnetic field intensity in nanoTesla")
    horizontal_component_h_nt: float
    magnetic_declination_deg: float
    auroral_electrojet_activity: str
    ionospheric_scintillation_s4: float = Field(..., description="GPS/GNSS L-band S4 Scintillation Index")

class CrewVitals(BaseModel):
    member_id: str
    codename: str
    role: str
    heart_rate_bpm: int
    spo2_percent: float
    skin_temp_c: float
    stress_index_score: int = Field(ge=0, le=100)
    sleep_efficiency_pct: float
    polar_circadian_alignment: str
    activity_status: str

class CrewBiotelemetry(BaseModel):
    station_id: str
    active_overwintering_personnel: int
    average_heart_rate_bpm: float
    average_spo2_percent: float
    average_stress_index: float
    hypothermia_alert_count: int
    crew_members: List[CrewVitals]

class ResearchTelemetryResponse(BaseModel):
    station_id: str
    station_name: str
    research_observatory_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    seismic: SeismicReading
    snow_accumulation: SnowAccumulationData
    geomagnetic_kp: GeomagneticKpIndex
    crew_biotelemetry: CrewBiotelemetry

# ==============================================================================
# 8. WHAT-IF SIMULATION ENGINE SCHEMAS (POST /api/simulations/run)
# ==============================================================================

class SimulationRequest(BaseModel):
    station_id: StationIdEnum = Field(default=StationIdEnum.MAITRI, description="Station identifier")
    scenario_type: ScenarioTypeEnum = Field(..., description="Selected failure scenario")
    ambient_temp_drop_c: Optional[float] = Field(default=0.0, description="Manual temp drop modifier in °C")
    wind_spike_kmh: Optional[float] = Field(default=0.0, description="Manual wind speed surge modifier in km/h")
    shed_non_critical_loads: Optional[bool] = Field(default=True, description="Enable automatic non-critical load shedding")
    duration_hours: Optional[int] = Field(default=24, description="Simulation projection horizon in hours")

class SimulationMetricDelta(BaseModel):
    label: str
    initial_value: str
    simulated_value: str
    delta: str
    note: str
    status_color: str

class SimulationResponse(BaseModel):
    simulation_id: str
    station_id: str
    station_name: str
    scenario_type: str
    scenario_label: str
    metrics: Dict[str, Any]
    power_delta: SimulationMetricDelta
    battery_reserve: SimulationMetricDelta
    load_action: SimulationMetricDelta
    mission_risk: SimulationMetricDelta
    overall_risk_level: str
    risk_score_pct: int = Field(ge=0, le=100)
    estimated_depletion_hours: float
    recommended_mitigations: List[str]
    executed_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 9. WEBSOCKET REAL-TIME TICKER PAYLOAD SCHEMAS (/ws/telemetry)
# ==============================================================================

class WebSocketTickerPayload(BaseModel):
    packet_id: str
    station_id: str
    station_name: str
    timestamp: str
    time_label: str
    power_generation_kw: float
    power_consumption_kw: float
    battery_level_percent: float
    ambient_temperature_c: float
    wind_speed_kmh: float
    generator_core_temp_c: float
    seismic_frequency_hz: float
    geomagnetic_kp_index: float
    comms_latency_ms: int
    system_status: str
