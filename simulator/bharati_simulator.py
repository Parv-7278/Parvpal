"""
==============================================================================
Phase 1: Antarctic Station Simulator - Bharati Research Station
==============================================================================
This script simulates real-time environmental and machinery sensor data for
India's Bharati Station in Antarctica (Larsemann Hills).

Requirements Implemented:
1. Generates telemetry every 2 seconds.
2. Generates:
   - temperature (ambient °C)
   - battery (%)
   - power_consumption (kW)
   - generator_temperature (°C)
   - generator_status (RUNNING, WARNING, OVERHEAT)
   - wind_speed (km/h)
   - water_level (%)
3. Normally generates realistic changing values with slight drift.
4. Emergency simulation mode: generator_temperature rises:
   70°C → 78°C → 85°C → 92°C → 95°C.
5. When generator_temperature > 90°C, creates a CRITICAL alert.
6. Prints clearly formatted cards and alert banners in terminal.
7. Structured with HTTP helper to send data to Node.js backend later.
"""

import sys
import time
import random
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
STATION_NAME = "Bharati Research Station"
STATION_ID = "station-bharati"
INTERVAL_SECONDS = 2.0

# Backend API endpoints (Ready for Node.js Backend integration)
BACKEND_BASE_URL = "http://localhost:5000"
TELEMETRY_API_URL = f"{BACKEND_BASE_URL}/api/sensor-data"
ALERT_API_URL = f"{BACKEND_BASE_URL}/api/alerts"

# Set this to True when you want to send data to the Node.js backend
SEND_TO_BACKEND = True


# -----------------------------------------------------------------------------
# API Helper Functions (For Backend Integration)
# -----------------------------------------------------------------------------
def send_to_api(url, payload):
    """
    Helper function to send JSON data to the backend via HTTP POST.
    Uses Python's built-in urllib so no external libraries are needed.
    """
    if not SEND_TO_BACKEND:
        return

    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=1.5) as response:
            pass  # Successfully received by backend
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ConnectionRefusedError, OSError):
        # Silently continue if backend is not running yet
        pass


# -----------------------------------------------------------------------------
# Sensor Simulation Logic
# -----------------------------------------------------------------------------
class BharatiSimulator:
    def __init__(self):
        # Baseline normal values for Bharati Station
        self.temperature = -14.0            # Ambient temperature (°C)
        self.battery = 98.0                 # Battery level (%)
        self.power_consumption = 52.0       # Power consumption (kW)
        self.generator_temperature = 70.0   # Generator core temp (°C)
        self.generator_status = "RUNNING"   # Status: RUNNING, WARNING, OVERHEAT
        self.wind_speed = 25.0              # Wind speed (km/h)
        self.water_level = 92.0             # Water / Fuel reserve (%)

        # Emergency sequence steps as requested: 70 → 78 → 85 → 92 → 95°C
        self.emergency_steps = [70.0, 78.0, 85.0, 92.0, 95.0]
        self.emergency_step_index = 0
        self.is_emergency_mode = False

    def generate_normal_data(self):
        """Simulate realistic slight fluctuations for all sensors."""
        self.temperature += round(random.uniform(-0.3, 0.3), 1)
        self.temperature = max(-35.0, min(-5.0, self.temperature))

        self.battery += round(random.uniform(-0.2, 0.2), 1)
        self.battery = max(80.0, min(100.0, self.battery))

        self.power_consumption += round(random.uniform(-0.8, 0.8), 1)
        self.power_consumption = max(35.0, min(70.0, self.power_consumption))

        # Generator is stable in normal mode
        self.generator_temperature = round(70.0 + random.uniform(-1.0, 1.5), 1)
        self.generator_status = "RUNNING"

        self.wind_speed += round(random.uniform(-1.5, 1.5), 1)
        self.wind_speed = max(10.0, min(65.0, self.wind_speed))

        self.water_level += round(random.uniform(-0.1, 0.1), 1)
        self.water_level = max(50.0, min(100.0, self.water_level))

        return self._build_payload()

    def generate_emergency_step(self):
        """Advance the generator temperature along: 70 → 78 → 85 → 92 → 95°C."""
        if self.emergency_step_index < len(self.emergency_steps):
            self.generator_temperature = self.emergency_steps[self.emergency_step_index]
            self.emergency_step_index += 1
        else:
            self.generator_temperature = 95.0

        # Update generator status based on temperature
        if self.generator_temperature >= 92.0:
            self.generator_status = "OVERHEAT"
        elif self.generator_temperature >= 85.0:
            self.generator_status = "WARNING"
        else:
            self.generator_status = "RUNNING"

        # Slight ambient drift during emergency
        self.temperature += round(random.uniform(-0.2, 0.2), 1)
        self.power_consumption += round(random.uniform(0.5, 1.5), 1)

        payload = self._build_payload()

        # Check if temperature exceeded critical threshold (> 90°C)
        alert = None
        if self.generator_temperature > 90.0:
            alert = self._build_critical_alert()

        return payload, alert

    def _build_payload(self):
        """Construct the telemetry data dictionary."""
        return {
            "station_id": STATION_ID,
            "station_name": STATION_NAME,
            "temperature": round(self.temperature, 1),
            "battery": round(self.battery, 1),
            "power_consumption": round(self.power_consumption, 1),
            "generator_temperature": round(self.generator_temperature, 1),
            "generator_status": self.generator_status,
            "wind_speed": round(self.wind_speed, 1),
            "water_level": round(self.water_level, 1),
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S UTC")
        }

    def _build_critical_alert(self):
        """Construct a high-priority emergency alert payload."""
        return {
            "station_id": STATION_ID,
            "priority": "CRITICAL",
            "category": "GENERATOR",
            "message": f"CRITICAL: Generator temperature reached {self.generator_temperature}°C (Limit: 90.0°C)!",
            "sensor_key": "generator_temperature",
            "sensor_value": self.generator_temperature,
            "threshold_value": 90.0,
            "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S UTC")
        }


# -----------------------------------------------------------------------------
# Terminal Printing & Display
# -----------------------------------------------------------------------------
def print_telemetry_card(data, step=None):
    """Prints a clean telemetry reading in the terminal."""
    status_indicator = "🟢 NOMINAL"
    if data["generator_status"] == "WARNING":
        status_indicator = "🟡 WARNING"
    elif data["generator_status"] == "OVERHEAT":
        status_indicator = "🔴 OVERHEAT"

    step_info = f" [Step {step}/5]" if step else ""
    print(f"\n┌──────────────────────────────────────────────────────────────┐")
    print(f"│ 🏔️  BHARATI STATION TELEMETRY -- {data['timestamp']}{step_info.ljust(18)} │")
    print(f"├──────────────────────────────────────────────────────────────┤")
    print(f"│ Ambient Temp: {str(data['temperature']) + ' °C':<14} │ Battery Bank:    {str(data['battery']) + ' %':<12} │")
    print(f"│ Power Load:   {str(data['power_consumption']) + ' kW':<14} │ Water Reserve:   {str(data['water_level']) + ' %':<12} │")
    print(f"│ Wind Speed:   {str(data['wind_speed']) + ' km/h':<14} │ Generator State: {status_indicator:<12} │")
    print(f"│ Generator Temp: {str(data['generator_temperature']) + ' °C':<12} │ Core Threshold:  90.0 °C      │")
    print(f"└──────────────────────────────────────────────────────────────┘")

def print_alert_banner(alert):
    """Prints a prominent visual alert box for critical events."""
    print(f"\n╔══════════════════════════════════════════════════════════════╗")
    print(f"║ 🚨 [CRITICAL EMERGENCY ALERT DETECTED]                       ║")
    print(f"╠══════════════════════════════════════════════════════════════╣")
    print(f"║ Target:    {alert['station_id']:<49} ║")
    print(f"║ Priority:  {alert['priority']:<49} ║")
    print(f"║ Event:     {alert['message']:<49} ║")
    print(f"║ Time:      {alert['timestamp']:<49} ║")
    print(f"╚══════════════════════════════════════════════════════════════╝")


# -----------------------------------------------------------------------------
# Main Runner Loop
# -----------------------------------------------------------------------------
def main():
    simulator = BharatiSimulator()

    # Check command-line arguments for quick execution
    if "--emergency" in sys.argv or "-e" in sys.argv:
        mode = "2"
    elif "--normal" in sys.argv or "-n" in sys.argv:
        mode = "1"
    else:
        print("================================================================")
        print(f"   ❄️  Antarctic Research Station Simulator: {STATION_NAME}")
        print("   ⏱️  Generating sensor telemetry every 2 seconds")
        print("================================================================")
        print("\nSelect Simulation Mode:")
        print("  [1] Normal Telemetry Mode (Continuous realistic data)")
        print("  [2] Emergency Simulation Mode (70°C → 78°C → 85°C → 92°C → 95°C)")
        
        try:
            mode = input("\nEnter choice (1 or 2, default is 1): ").strip()
        except EOFError:
            mode = "1"

    if mode == "2":
        simulator.is_emergency_mode = True
        print("\n🔥 Starting EMERGENCY MODE: Simulating Generator Thermal Runaway...")
    else:
        print("\n🟢 Starting NORMAL MODE: Continuous background sensor stream (Ctrl+C to stop)...")

    cycle_count = 0

    try:
        while True:
            cycle_count += 1

            if simulator.is_emergency_mode:
                step_num = simulator.emergency_step_index + 1
                data, alert = simulator.generate_emergency_step()
                
                # Print telemetry card
                print_telemetry_card(data, step=min(step_num, 5))
                send_to_api(TELEMETRY_API_URL, data)

                # If alert generated (when temp > 90°C)
                if alert:
                    print_alert_banner(alert)
                    send_to_api(ALERT_API_URL, alert)

                # Stop when the 5-step sequence completes
                if simulator.emergency_step_index >= len(simulator.emergency_steps):
                    print("\n✅ Emergency simulation sequence completed.")
                    print("Simulator will now continue monitoring at 95°C. Press Ctrl+C to exit.\n")
                    simulator.is_emergency_mode = False

            else:
                data = simulator.generate_normal_data()
                print_telemetry_card(data)
                send_to_api(TELEMETRY_API_URL, data)

                if cycle_count % 5 == 0:
                    print("💡 Tip: Re-run with option [2] or flag --emergency to simulate generator overheating.")

            # Wait 2 seconds before the next reading
            time.sleep(INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\n\n⏹️ Simulator stopped by user. Goodbye!")


if __name__ == "__main__":
    main()
