import argparse
import time
import requests
import sys

from config import STATIONS, TELEMETRY_ENDPOINT, ALERT_ENDPOINT, TELEMETRY_INTERVAL_SECONDS
from sensors import StationSensorModel
from scenarios import run_generator_thermal_runaway, run_blizzard_warning

def send_telemetry(payload):
    try:
        response = requests.post(TELEMETRY_ENDPOINT, json=payload, timeout=3.0)
        if response.status_code in [200, 201, 202]:
            print(f"[{payload['station_id']}] 📊 Telemetry Queued | Temp: {payload['temperature']}°C, Gen: {payload['generator_temperature']}°C")
        else:
            print(f"[{payload['station_id']}] ⚠️ Backend returned {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[{payload['station_id']}] ❌ Connection error to backend: {e}")

def send_alert(payload):
    try:
        response = requests.post(ALERT_ENDPOINT, json=payload, timeout=3.0)
        if response.status_code in [200, 201, 202]:
            print(f"[{payload['station_id']}] 🚨 PRIORITY ALERT DISPATCHED: {payload['priority']} -> {payload['message']}")
        else:
            print(f"[{payload['station_id']}] ⚠️ Alert post failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[{payload['station_id']}] ❌ Alert dispatch error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Antarctic Research Station Sensor Simulator")
    parser.add_argument("--scenario", choices=["generator_overheat", "blizzard", "none"], default="none",
                        help="Trigger a specific emergency scenario immediately")
    parser.add_argument("--station", choices=["station-maitri", "station-bharati"], default="station-maitri",
                        help="Target station for scenario")
    parser.add_argument("--interval", type=float, default=TELEMETRY_INTERVAL_SECONDS,
                        help="Telemetry interval in seconds")
    args = parser.parse_args()

    # Initialize sensor models for all stations
    station_models = {
        s_id: StationSensorModel(s_id, s_meta)
        for s_id, s_meta in STATIONS.items()
    }

    print("==================================================================")
    print("🏔️  Antarctic Research Station Sensor Simulator (Maitri & Bharati)")
    print(f"📡 Telemetry Target: {TELEMETRY_ENDPOINT}")
    print(f"🚨 Alert Target: {ALERT_ENDPOINT}")
    print("==================================================================")

    # If a specific scenario is requested
    if args.scenario == "generator_overheat":
        target_model = station_models[args.station]
        run_generator_thermal_runaway(target_model, send_telemetry, send_alert)
        return
    elif args.scenario == "blizzard":
        target_model = station_models[args.station]
        run_blizzard_warning(target_model, send_telemetry, send_alert)
        return

    # Continuous background telemetry loop
    print("\n▶️  Starting normal telemetry stream (Press Ctrl+C to stop)...\n")
    try:
        step_count = 0
        while True:
            step_count += 1
            for station_id, model in station_models.items():
                telemetry = model.step_normal_drift()
                send_telemetry(telemetry)

            # Every 10 steps, offer a periodic prompt or automatic demonstration
            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\n⏹️ Simulator stopped by user.")
        sys.exit(0)

if __name__ == "__main__":
    main()
