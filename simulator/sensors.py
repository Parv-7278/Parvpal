import random
from datetime import datetime, timezone

class StationSensorModel:
    def __init__(self, station_id, station_meta):
        self.station_id = station_id
        self.name = station_meta["name"]
        self.state = dict(station_meta["baseline"])
        self.in_emergency = False

    def step_normal_drift(self):
        """Simulate realistic slight stochastic variations around baseline."""
        if not self.in_emergency:
            # Ambient temp slight drift (±0.4°C)
            self.state["temperature"] += round(random.uniform(-0.4, 0.4), 2)
            self.state["temperature"] = max(-50.0, min(-5.0, self.state["temperature"]))

            # Battery level slow fluctuation (90% - 100%)
            self.state["battery_level"] += round(random.uniform(-0.2, 0.2), 2)
            self.state["battery_level"] = max(85.0, min(100.0, self.state["battery_level"]))

            # Power consumption (35kW - 65kW)
            self.state["power_consumption"] += round(random.uniform(-0.8, 0.8), 2)
            self.state["power_consumption"] = max(30.0, min(75.0, self.state["power_consumption"]))

            # Generator temperature (68°C - 78°C normal operating range)
            self.state["generator_temperature"] += round(random.uniform(-0.5, 0.5), 2)
            self.state["generator_temperature"] = max(65.0, min(78.0, self.state["generator_temperature"]))
            self.state["generator_status"] = "RUNNING"

            # Wind speed (10 - 60 km/h normal)
            self.state["wind_speed"] += round(random.uniform(-1.5, 1.5), 2)
            self.state["wind_speed"] = max(5.0, min(80.0, self.state["wind_speed"]))

            # Water level slowly declines or replenishes
            self.state["water_level"] += round(random.uniform(-0.1, 0.1), 2)
            self.state["water_level"] = max(50.0, min(100.0, self.state["water_level"]))

            self.state["comms_status"] = "SAT_LINK_NOMINAL"

        return self.get_telemetry_payload()

    def get_telemetry_payload(self):
        return {
            "station_id": self.station_id,
            "station_name": self.name,
            "temperature": round(self.state["temperature"], 2),
            "battery": round(self.state["battery_level"], 2),
            "battery_level": round(self.state["battery_level"], 2),
            "power_consumption": round(self.state["power_consumption"], 2),
            "generator_status": self.state["generator_status"],
            "generator_temperature": round(self.state["generator_temperature"], 2),
            "wind_speed": round(self.state["wind_speed"], 2),
            "water_level": round(self.state["water_level"], 2),
            "comms_status": self.state["comms_status"],
            "recorded_at": datetime.now(timezone.utc).isoformat(),
        }
