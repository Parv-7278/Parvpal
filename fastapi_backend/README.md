# POLARIS Antarctic Digital Twin - Production FastAPI Backend

Production-ready FastAPI backend for the **POLARIS Antarctic Digital Twin** mission control platform managing India's **Maitri** (Schirmacher Oasis) and **Bharati** (Larsemann Hills) Antarctic research stations.

---

## 🛰️ Architecture & Capabilities

1. **FastAPI Application (`main.py`)**:
   - Modern async ASGI server with CORS middleware, Pydantic v2 validation, and clean JSON error handling.
   - Supabase PostgreSQL client integration with in-memory fallback.
   - Interactive OpenAPI documentation at `/docs` and ReDoc at `/redoc`.

2. **Core Station REST Endpoints (`routers/stations.py`)**:
   - `GET /api/stations` - Metadata for Indian Antarctic stations.
   - `GET /api/stations/{id}/health` - Radial health index scores (0-100) and subsystem status breakdown.
   - `GET /api/stations/{id}/modules` - 3D Digital Twin model pins, building catalogs, occupancy, and maintenance schedules.
   - `GET /api/stations/{id}/energy` - Real-time generation (kW), consumption (kW), surplus, battery BESS, fuel reserves (L/days).
   - `GET /api/stations/{id}/logistics` - Arctic diesel, food rations, medical stores, spare parts inventory.
   - `GET /api/stations/{id}/environment` - Ambient temperature, wind speed/direction, barometric pressure, SVG sparklines.

3. **Dedicated Scientific Research Observatory Route (`routers/research.py`)**:
   - `GET /api/stations/{id}/research` - Live JSON payload:
     - **Borehole Seismic Tremors**: Dominant frequency (Hz), peak ground acceleration ($g$), displacement amplitude ($\mu\text{m}$), classification (`ICE_SHEET_FRACTURE`, `TECTONIC_MICRO`, etc.).
     - **Ultrasonic Snow Accumulation**: Snowpack depth (cm), 24h accumulation, drift accumulation rate (cm/hr), snow density ($\text{kg/m}^3$).
     - **Tri-Axial Geomagnetic Kp Index**: Planetary Kp (0-9 storm scale), total magnetic field intensity (nT), S4 GPS scintillation index.
     - **Expedition Crew Bio-Telemetry**: Overwintering personnel vitals (heart rate, $\text{SpO}_2$, skin temp, stress score, activity status).

4. **What-If Simulation Engine (`routers/simulations.py`)**:
   - `GET /api/simulations/scenarios` - Available operational failure & storm scenarios.
   - `POST /api/simulations/run` - Calculates dynamic power drops, battery reserve hours, automated load shedding actions, and mission risk factors ($0-100\%$).

5. **WebSocket Real-Time Ticker Stream (`routers/websocket.py`)**:
   - `WebSocket /ws/telemetry` - High-frequency streaming of Recharts-compatible time-series graph points every 1.5s for live dashboard visualizers.

---

## 📦 Installation & Execution

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
uvicorn main:app --reload --port 8000 --host 0.0.0.0
```

### 4. Interactive API Documentation
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 📋 Sample API Endpoints & Payloads

### 1. Research Telemetry (`GET /api/stations/station-maitri/research`)
```json
{
  "station_id": "station-maitri",
  "station_name": "MAITRI",
  "research_observatory_name": "Maitri Solid Earth Geomagnetic & Seismic Observatory",
  "timestamp": "2026-09-08T15:20:00.000Z",
  "seismic": {
    "dominant_frequency_hz": 1.84,
    "peak_ground_acceleration_g": 0.00185,
    "tremor_amplitude_um": 3.42,
    "status": "NOMINAL_MICROSEISMIC",
    "event_classification": "TECTONIC_BASEMENT_MICRO_FRACTURE",
    "borehole_depth_meters": 45.0
  },
  "snow_accumulation": {
    "snowpack_total_depth_cm": 142.5,
    "snow_accumulation_24h_cm": 12.4,
    "drift_accumulation_rate_cm_per_hr": 0.85,
    "snow_density_kg_per_m3": 345.0,
    "subsurface_firn_temperature_c": -16.4
  },
  "geomagnetic_kp": {
    "kp_index_current": 2.45,
    "storm_classification": "G1_MINOR_UNSETTLED",
    "total_magnetic_field_intensity_nt": 42875.2,
    "horizontal_component_h_nt": 18632.4,
    "magnetic_declination_deg": -21.4,
    "auroral_electrojet_activity": "Active Auroral Bands Visible",
    "ionospheric_scintillation_s4": 0.161
  },
  "crew_biotelemetry": {
    "active_overwintering_personnel": 24,
    "average_heart_rate_bpm": 73.0,
    "average_spo2_percent": 98.4,
    "average_stress_index": 24.0,
    "hypothermia_alert_count": 0,
    "crew_members": [
      {
        "member_id": "MTR-01",
        "codename": "LEADER-EXP44",
        "role": "Station Commander",
        "heart_rate_bpm": 72,
        "spo2_percent": 98.5,
        "skin_temp_c": 34.2,
        "stress_index_score": 24,
        "sleep_efficiency_pct": 88.0,
        "polar_circadian_alignment": "Synchronized",
        "activity_status": "Command Operations"
      }
    ]
  }
}
```

### 2. What-If Simulation Engine (`POST /api/simulations/run`)
**Request**:
```json
{
  "station_id": "station-maitri",
  "scenario_type": "GENERATOR_FAILURE",
  "shed_non_critical_loads": true,
  "duration_hours": 24
}
```
**Response**:
```json
{
  "simulation_id": "sim-8f3a9e12",
  "station_id": "station-maitri",
  "station_name": "MAITRI",
  "scenario_type": "GENERATOR_FAILURE",
  "scenario_label": "Primary Diesel Generator Sudden Trip / Fault",
  "metrics": {
    "powerDelta": "-28.0%",
    "powerNote": "( Grid Shift )",
    "batteryReserve": "16 Hrs",
    "batteryNote": "( Reserve )",
    "loadAction": "Auto-Shed Non-Critical Labs",
    "loadNote": "( Habitation )",
    "risk": "Medium",
    "riskNote": "( 62% Probability )",
    "riskColor": "#f59e0b",
    "powerColor": "#ef4444"
  },
  "overall_risk_level": "Medium",
  "risk_score_pct": 62,
  "estimated_depletion_hours": 16.0,
  "recommended_mitigations": [
    "Transfer essential loads to Standby Generator #2.",
    "Shed secondary heating circuits in science module and storage bays.",
    "Engage lithium battery storage to bridge automatic synchronizer start."
  ]
}
```
