import time
from datetime import datetime, timezone

def run_generator_thermal_runaway(sensor_model, send_telemetry_fn, send_alert_fn):
    """
    Scenario: Generator temperature gradually increases:
    70°C → 78°C → 85°C → 92°C → 95°C
    Generates telemetry steps and fires a CRITICAL emergency alert at threshold breach.
    """
    print(f"\n🔥 [SCENARIO INITIATED] Generator Thermal Runaway on {sensor_model.name}")
    sensor_model.in_emergency = True
    temp_steps = [70.0, 78.0, 85.0, 92.0, 95.0]

    for i, temp in enumerate(temp_steps, 1):
        sensor_model.state["generator_temperature"] = temp
        sensor_model.state["generator_status"] = "WARNING" if temp >= 85.0 else "RUNNING"
        if temp >= 92.0:
            sensor_model.state["generator_status"] = "OVERHEAT"

        telemetry = sensor_model.get_telemetry_payload()
        print(f"  ↳ Step {i}/5: Generator Core Temp = {temp}°C -> Sending Telemetry...")
        send_telemetry_fn(telemetry)

        # Trigger alert at intermediate warning (85°C) and critical breach (95°C)
        if temp >= 95.0:
            print(f"  🚨 [TRIGGER CRITICAL ALERT] 95°C exceeded critical threshold (90°C)!")
            alert_payload = {
                "station_id": sensor_model.station_id,
                "priority": "CRITICAL",
                "category": "GENERATOR",
                "message": f"CRITICAL: Generator 1 on {sensor_model.name} reached {temp}°C! Risk of core shutdown.",
                "sensor_key": "generator_temperature",
                "sensor_value": temp,
                "threshold_value": 90.0,
                "triggered_at": datetime.now(timezone.utc).isoformat(),
            }
            send_alert_fn(alert_payload)
        
        time.sleep(1.5)

    sensor_model.in_emergency = False
    print(f"✅ [SCENARIO COMPLETED] Generator Thermal Runaway finished.\n")

def run_blizzard_warning(sensor_model, send_telemetry_fn, send_alert_fn):
    """Simulate rapid wind speed escalation from 45km/h to 125km/h."""
    print(f"\n❄️ [SCENARIO INITIATED] Blizzard Storm Alert on {sensor_model.name}")
    sensor_model.in_emergency = True
    sensor_model.state["wind_speed"] = 125.0
    sensor_model.state["temperature"] = -38.5

    telemetry = sensor_model.get_telemetry_payload()
    send_telemetry_fn(telemetry)

    alert_payload = {
        "station_id": sensor_model.station_id,
        "priority": "HIGH",
        "category": "WEATHER",
        "message": f"HIGH: Blizzard winds exceeding 120 km/h detected at {sensor_model.name}.",
        "sensor_key": "wind_speed",
        "sensor_value": 125.0,
        "threshold_value": 90.0,
        "triggered_at": datetime.now(timezone.utc).isoformat(),
    }
    send_alert_fn(alert_payload)
    sensor_model.in_emergency = False
    print(f"✅ [SCENARIO COMPLETED] Blizzard Alert Dispatched.\n")
