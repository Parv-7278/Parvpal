import os
import urllib.request
import urllib.error

# Backend API endpoint configuration (Node.js default :5000, FastAPI fallback :8000)
_env_backend = os.getenv("BACKEND_URL")
if _env_backend:
    BACKEND_URL = _env_backend
else:
    # Auto-detect active backend
    BACKEND_URL = "http://localhost:5000"
    for port in [5000, 8000]:
        try:
            req = urllib.request.Request(f"http://localhost:{port}/api/health", method="GET")
            with urllib.request.urlopen(req, timeout=0.6):
                BACKEND_URL = f"http://localhost:{port}"
                break
        except Exception:
            continue

TELEMETRY_ENDPOINT = f"{BACKEND_URL}/api/telemetry"
ALERT_ENDPOINT = f"{BACKEND_URL}/api/alerts"

# Simulation timings
TELEMETRY_INTERVAL_SECONDS = 3.0

# Antarctic Research Station Profiles (Distinct Telemetry for Maitri vs Bharati)
STATIONS = {
    "station-maitri": {
        "name": "Maitri Research Station",
        "location": "Schirmacher Oasis, Queen Maud Land",
        "coordinates": (-70.765833, 11.735833),
        "timezone": "UTC",
        "timezone_label": "UTC+0",
        "baseline": {
            "temperature": -18.7,       # °C
            "battery_level": 74.0,      # %
            "power_consumption": 105.0, # kW
            "generator_status": "RUNNING",
            "generator_temperature": 78.4, # °C
            "wind_speed": 28.0,         # km/h
            "water_level": 88.0,        # %
            "comms_status": "SAT_LINK_NOMINAL"
        }
    },
    "station-bharati": {
        "name": "Bharati Research Station",
        "location": "Larsemann Hills",
        "coordinates": (-69.407778, 76.187222),
        "timezone": "Antarctica/Mawson",
        "timezone_label": "UTC+5",
        "baseline": {
            "temperature": -14.2,       # °C
            "battery_level": 91.0,      # %
            "power_consumption": 148.0, # kW
            "generator_status": "RUNNING",
            "generator_temperature": 74.1, # °C
            "wind_speed": 44.0,         # km/h
            "water_level": 94.0,        # %
            "comms_status": "SAT_LINK_NOMINAL"
        }
    }
}

