import os

# Backend API endpoint configuration (FastAPI default :8000, Express fallback :5000)
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
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

