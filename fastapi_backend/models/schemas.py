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
    timezone: str = "UTC"
    timezone_label: str = "UTC+0"
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

# ==============================================================================
# 10. SIMULATOR INGESTION & ALERT SCHEMAS
# ==============================================================================

class TelemetryIngestPayload(BaseModel):
    station_id: str = Field(..., description="Station ID e.g. 'station-maitri' or 'station-bharati'")
    station_name: Optional[str] = None
    temperature: float = Field(..., description="Ambient temperature in °C")
    battery_level: Optional[float] = Field(default=None, description="Battery level %")
    battery: Optional[float] = Field(default=None, description="Battery level alias")
    power_consumption: float = Field(..., description="Power consumption in kW")
    generator_status: Optional[str] = Field(default="RUNNING", description="Generator operational status")
    generator_temperature: float = Field(..., description="Generator core temperature in °C")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    water_level: float = Field(..., description="Water storage level %")
    comms_status: Optional[str] = Field(default="SAT_LINK_NOMINAL", description="Satellite comms status")
    recorded_at: Optional[str] = None

class AlertIngestPayload(BaseModel):
    id: Optional[str] = None
    station_id: str
    priority: str = Field(default="NORMAL", description="'CRITICAL', 'HIGH', 'NORMAL', 'LOW'")
    category: Optional[str] = Field(default="GENERAL", description="Subsystem category e.g. 'GENERATOR', 'WEATHER'")
    message: str
    sensor_key: Optional[str] = None
    sensor_value: Optional[float] = None
    threshold_value: Optional[float] = None
    action_required: Optional[str] = None
    triggered_at: Optional[str] = None
    acknowledged: Optional[bool] = False

class AlertItem(BaseModel):
    id: str
    station_id: str
    station_name: str
    priority: str
    category: str
    message: str
    sensor_key: Optional[str] = None
    sensor_value: Optional[float] = None
    threshold_value: Optional[float] = None
    action_required: Optional[str] = None
    triggered_at: str
    acknowledged: bool = False
    status_color: str = "#ef4444"

# ==============================================================================
# 11. 24-HOUR COMPREHENSIVE OPERATIONAL & RESEARCH REPORT SCHEMAS
# ==============================================================================

class MetricComparisonDelta(BaseModel):
    label: str
    current_value: str
    previous_value: str
    delta_value: str
    change_pct: float
    direction: str  # 'UP', 'DOWN', 'STABLE'
    status_type: str = "nominal"  # 'nominal', 'warning', 'critical', 'positive'
    interpretation: Optional[str] = None

class SubsystemHealthDelta(BaseModel):
    id: str
    label: str
    current_score: int
    previous_score: int
    delta: int
    change_pct: float
    status: str
    color: str

class ExecutiveSummaryReport(BaseModel):
    report_title: str = "POLARIS 24-HOUR OPERATIONAL & RESEARCH REPORT"
    station_id: str
    station_name: str
    reporting_period: str
    comparison_period: str
    overall_status: str  # 'NORMAL', 'WARNING', 'CRITICAL'
    overall_risk_score: int = Field(ge=0, le=100)
    ai_summary: str
    ai_label: str = "AI-GENERATED SUMMARY"
    recommendations: List[str]

class StationHealthReport(BaseModel):
    current_health_score: int
    previous_health_score: int
    change_pct: float
    rating: str
    rating_color: str
    subsystems: List[SubsystemHealthDelta]
    active_warnings_count: int
    critical_systems_count: int
    active_alerts: List[Dict[str, Any]] = []

class EnergyReport(BaseModel):
    status: str
    generation_avg_kw: float
    generation_max_kw: float
    generation_min_kw: float
    generation_delta_pct: float
    consumption_avg_kw: float
    peak_consumption_kw: float
    consumption_min_kw: float
    consumption_delta_pct: float
    surplus_avg_kw: float
    battery_current_pct: float
    battery_min_pct: float
    battery_max_pct: float
    battery_change_pct: float
    battery_health_pct: float
    battery_reserve_days: str
    generator_status: str
    generator_temp_max_c: float
    generator_temp_avg_c: float
    generator_temp_delta_c: float
    fuel_liters: str
    fuel_days_remaining: str
    fuel_change_pct: float
    sources: Dict[str, Any]
    breakdown: List[Dict[str, Any]]
    comparisons: List[MetricComparisonDelta]
    ai_insight: str

class EnvironmentReport(BaseModel):
    temp_avg_c: float
    temp_min_c: float
    temp_max_c: float
    temp_delta_c: float
    temp_trend: str
    wind_avg_kmh: float
    wind_max_kmh: float
    wind_min_kmh: float
    wind_dir: str
    wind_delta_kmh: float
    wind_trend: str
    pressure_avg_hpa: float
    pressure_min_hpa: float
    pressure_max_hpa: float
    pressure_trend: str
    humidity_avg_pct: float
    snow_accumulation_24h_cm: float
    snow_total_depth_cm: float
    snow_drift_rate_cm_hr: float
    snow_delta_cm: float
    anomalies: List[Dict[str, Any]]
    comparisons: List[MetricComparisonDelta]
    ai_interpretation: str

class ResearchFinding(BaseModel):
    major_trend: str
    major_anomaly: str
    attention_parameter: str

class ResearchReport(BaseModel):
    observatory_name: str
    seismic: Dict[str, Any]
    snow_firn: Dict[str, Any]
    geomagnetic: Dict[str, Any]
    crew_vitals: Dict[str, Any]
    findings: ResearchFinding
    scientific_telemetry_summary: str

class LogisticsItemReport(BaseModel):
    id: str
    name: str
    current_amount: str
    percent: float
    days_remaining: str
    consumption_24h: str
    change_pct: float
    status: str
    color: str

class LogisticsReport(BaseModel):
    items: List[LogisticsItemReport]
    critical_inventory_count: int
    low_stock_items: List[str]
    depletion_forecast_date: str
    ai_insight: str

class InfrastructureModuleReport(BaseModel):
    id: str
    name: str
    status: str
    status_type: str
    temperature: str
    power_draw: str
    subsystem: str
    notes: str
    maintenance_health: Optional[str] = None
    next_inspection: Optional[str] = None

class InfrastructureReport(BaseModel):
    modules_count: int
    modules: List[InfrastructureModuleReport]
    operational_count: int
    warning_count: int
    critical_count: int
    infrastructure_health_score: int
    ai_insight: str

class SingleStation24hReport(BaseModel):
    station_id: str
    station_name: str
    generated_at: str
    reporting_period: str
    comparison_period: str
    executive_summary: ExecutiveSummaryReport
    station_health: StationHealthReport
    energy: EnergyReport
    environment: EnvironmentReport
    research: ResearchReport
    logistics: LogisticsReport
    infrastructure: InfrastructureReport

class Comprehensive24hReportResponse(BaseModel):
    success: bool
    station_id: str
    station_name: str
    generated_at: str
    reporting_period: str
    comparison_period: str
    data_points_analyzed: int
    overall_status: str
    overall_risk_score: int
    ai_provider: str
    report: SingleStation24hReport
    station_reports: Optional[Dict[str, SingleStation24hReport]] = None
    combined_summary: Optional[Dict[str, Any]] = None
    comparison_matrix: Optional[List[Dict[str, Any]]] = None


