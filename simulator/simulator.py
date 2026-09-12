import argparse
import time
import requests
import sys

from config import STATIONS, TELEMETRY_ENDPOINT, ALERT_ENDPOINT, TELEMETRY_INTERVAL_SECONDS
from sensors import StationSensorModel
from scenarios import run_generator_thermal_runaway, run_blizzard_warning

def send_telemetry(payload):
    st_name = "MAITRI" if "maitri" in payload['station_id'] else "BHARATI"
    temp = payload.get('temperature', 0)
    gen_temp = payload.get('generator_temperature', 0)
    batt = payload.get('battery_level') or payload.get('battery') or 0
    try:
        response = requests.post(TELEMETRY_ENDPOINT, json=payload, timeout=3.0)
        if response.status_code in [200, 201, 202]:
            print(f"[SIMULATOR] Station: {st_name} | Sending telemetry... | Temp: {temp}°C | Gen: {gen_temp}°C | Battery: {batt}% | Response: 200 OK")
        else:
            print(f"[SIMULATOR WARNING] Station: {st_name} | Backend returned {response.status_code} ({response.text})")
    except requests.exceptions.RequestException as e:
        print(f"[SIMULATOR ERROR] Connection failed for {st_name} to {TELEMETRY_ENDPOINT}: {e}")

def send_alert(payload):
    st_name = "MAITRI" if "maitri" in payload['station_id'] else "BHARATI"
    try:
        response = requests.post(ALERT_ENDPOINT, json=payload, timeout=3.0)
        if response.status_code in [200, 201, 202]:
            print(f"[SIMULATOR ALERT] 🚨 {st_name} PRIORITY ALERT DISPATCHED: {payload.get('priority')} -> {payload.get('message')}")
        else:
            print(f"[SIMULATOR WARNING] Alert dispatch returned {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[SIMULATOR ERROR] Alert dispatch failed to {ALERT_ENDPOINT}: {e}")

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
    print("🏔️  [SIMULATOR] Starting POLARIS Station Telemetry Simulator")
    print(f"📡 Target Endpoint: {TELEMETRY_ENDPOINT}")
    print(f"🚨 Alert Endpoint:  {ALERT_ENDPOINT}")
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
    print("\n▶️  [SIMULATOR] Starting normal multi-station telemetry loop...\n")
    try:
        step_count = 0
        while True:
            step_count += 1
            for station_id, model in station_models.items():
                telemetry = model.step_normal_drift()
                send_telemetry(telemetry)

            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\n⏹️ [SIMULATOR] Stopped by operator.")
        sys.exit(0)

if __name__ == "__main__":
    main()
