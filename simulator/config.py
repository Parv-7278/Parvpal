import os

# Backend API endpoint configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
TELEMETRY_ENDPOINT = f"{BACKEND_URL}/api/telemetry"
ALERT_ENDPOINT = f"{BACKEND_URL}/api/alerts"

# Simulation timings
TELEMETRY_INTERVAL_SECONDS = 3.0

# Antarctic Research Station Profiles
STATIONS = {
    "station-maitri": {
        "name": "Maitri Research Station",
        "location": "Schirmacher Oasis, Queen Maud Land",
        "coordinates": (-70.765833, 11.735833),
        "baseline": {
            "temperature": -18.0,       # °C
            "battery_level": 95.0,      # %
            "power_consumption": 45.0,  # kW
            "generator_status": "RUNNING",
            "generator_temperature": 72.0, # °C
            "wind_speed": 32.0,         # km/h
            "water_level": 88.0,        # %
            "comms_status": "SAT_LINK_NOMINAL"
        }
    },
    "station-bharati": {
        "name": "Bharati Research Station",
        "location": "Larsemann Hills",
        "coordinates": (-69.407778, 76.187222),
        "baseline": {
            "temperature": -14.0,       # °C
            "battery_level": 98.0,      # %
            "power_consumption": 52.0,  # kW
            "generator_status": "RUNNING",
            "generator_temperature": 70.0, # °C
            "wind_speed": 25.0,         # km/h
            "water_level": 92.0,        # %
            "comms_status": "SAT_LINK_NOMINAL"
        }
    }
}
