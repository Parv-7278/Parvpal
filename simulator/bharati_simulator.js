/**
 * ==============================================================================
 * Phase 1: Antarctic Station Simulator - Bharati Research Station (Node.js Runner)
 * ==============================================================================
 * Exactly mirrors bharati_simulator.py for quick execution in Node.js environments.
 */

const STATION_NAME = 'Bharati Research Station';
const STATION_ID = 'station-bharati';
const INTERVAL_MS = 2000;

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TELEMETRY_API_URL = `${BACKEND_BASE_URL}/api/sensor-data`;
const ALERT_API_URL = `${BACKEND_BASE_URL}/api/alerts`;

async function sendToApi(url, payload) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Silently continue if backend is not running
  }
}

class BharatiSimulator {
  constructor() {
    this.temperature = -14.0;
    this.battery = 98.0;
    this.power_consumption = 52.0;
    this.generator_temperature = 70.0;
    this.generator_status = 'RUNNING';
    this.wind_speed = 25.0;
    this.water_level = 92.0;

    this.emergency_steps = [70.0, 78.0, 85.0, 92.0, 95.0];
    this.emergency_step_index = 0;
    this.is_emergency_mode = false;
  }

  generateNormalData() {
    this.temperature = +(this.temperature + (Math.random() * 0.6 - 0.3)).toFixed(1);
    this.temperature = Math.max(-35, Math.min(-5, this.temperature));

    this.battery = +(this.battery + (Math.random() * 0.4 - 0.2)).toFixed(1);
    this.battery = Math.max(80, Math.min(100, this.battery));

    this.power_consumption = +(this.power_consumption + (Math.random() * 1.6 - 0.8)).toFixed(1);
    this.power_consumption = Math.max(35, Math.min(70, this.power_consumption));

    this.generator_temperature = +(70.0 + (Math.random() * 2.5 - 1.0)).toFixed(1);
    this.generator_status = 'RUNNING';

    this.wind_speed = +(this.wind_speed + (Math.random() * 3.0 - 1.5)).toFixed(1);
    this.wind_speed = Math.max(10, Math.min(65, this.wind_speed));

    this.water_level = +(this.water_level + (Math.random() * 0.2 - 0.1)).toFixed(1);
    this.water_level = Math.max(50, Math.min(100, this.water_level));

    return this._buildPayload();
  }

  generateEmergencyStep() {
    if (this.emergency_step_index < this.emergency_steps.length) {
      this.generator_temperature = this.emergency_steps[this.emergency_step_index];
      this.emergency_step_index++;
    } else {
      this.generator_temperature = 95.0;
    }

    if (this.generator_temperature >= 92.0) {
      this.generator_status = 'OVERHEAT';
    } else if (this.generator_temperature >= 85.0) {
      this.generator_status = 'WARNING';
    } else {
      this.generator_status = 'RUNNING';
    }

    this.temperature = +(this.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1);
    this.power_consumption = +(this.power_consumption + (Math.random() * 2.0 - 0.5)).toFixed(1);

    const payload = this._buildPayload();
    let alert = null;

    if (this.generator_temperature > 90.0) {
      alert = this._buildCriticalAlert();
    }

    return { payload, alert };
  }

  _buildPayload() {
    return {
      station_id: STATION_ID,
      station_name: STATION_NAME,
      temperature: +this.temperature.toFixed(1),
      battery: +this.battery.toFixed(1),
      power_consumption: +this.power_consumption.toFixed(1),
      generator_temperature: +this.generator_temperature.toFixed(1),
      generator_status: this.generator_status,
      wind_speed: +this.wind_speed.toFixed(1),
      water_level: +this.water_level.toFixed(1),
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
    };
  }

  _buildCriticalAlert() {
    return {
      station_id: STATION_ID,
      priority: 'CRITICAL',
      category: 'GENERATOR',
      message: `CRITICAL: Generator temperature reached ${this.generator_temperature}°C (Limit: 90.0°C)!`,
      sensor_key: 'generator_temperature',
      sensor_value: this.generator_temperature,
      threshold_value: 90.0,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
    };
  }
}

function printTelemetryCard(data, step = null) {
  let statusIndicator = '🟢 NOMINAL';
  if (data.generator_status === 'WARNING') statusIndicator = '🟡 WARNING';
  if (data.generator_status === 'OVERHEAT') statusIndicator = '🔴 OVERHEAT';

  const stepInfo = step ? ` [Step ${step}/5]` : '';
  console.log(`\n┌──────────────────────────────────────────────────────────────┐`);
  console.log(`│ 🏔️  BHARATI STATION TELEMETRY -- ${data.timestamp}${stepInfo.padEnd(18)} │`);
  console.log(`├──────────────────────────────────────────────────────────────┤`);
  console.log(`│ Ambient Temp: ${(data.temperature + ' °C').padEnd(14)} │ Battery Bank:    ${(data.battery + ' %').padEnd(12)} │`);
  console.log(`│ Power Load:   ${(data.power_consumption + ' kW').padEnd(14)} │ Water Reserve:   ${(data.water_level + ' %').padEnd(12)} │`);
  console.log(`│ Wind Speed:   ${(data.wind_speed + ' km/h').padEnd(14)} │ Generator State: ${statusIndicator.padEnd(12)} │`);
  console.log(`│ Generator Temp: ${(data.generator_temperature + ' °C').padEnd(12)} │ Core Threshold:  90.0 °C      │`);
  console.log(`└──────────────────────────────────────────────────────────────┘`);
}

function printAlertBanner(alert) {
  console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║ 🚨 [CRITICAL EMERGENCY ALERT DETECTED]                       ║`);
  console.log(`╠══════════════════════════════════════════════════════════════╣`);
  console.log(`║ Target:    ${alert.station_id.padEnd(49)} ║`);
  console.log(`║ Priority:  ${alert.priority.padEnd(49)} ║`);
  console.log(`║ Event:     ${alert.message.padEnd(49)} ║`);
  console.log(`║ Time:      ${alert.timestamp.padEnd(49)} ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝`);
}

async function main() {
  const simulator = new BharatiSimulator();
  const args = process.argv.slice(2);
  const isEmergency = args.includes('--emergency') || args.includes('-e');

  console.log('================================================================');
  console.log(`   ❄️  Antarctic Research Station Simulator: ${STATION_NAME}`);
  console.log('   ⏱️  Generating sensor telemetry every 2 seconds');
  console.log('================================================================');

  if (isEmergency) {
    simulator.is_emergency_mode = true;
    console.log('\n🔥 Starting EMERGENCY MODE: Simulating Generator Thermal Runaway...');
  } else {
    console.log('\n🟢 Starting NORMAL MODE: Continuous background sensor stream (Ctrl+C to stop)...');
  }

  let cycle = 0;
  setInterval(async () => {
    cycle++;
    if (simulator.is_emergency_mode) {
      const step = simulator.emergency_step_index + 1;
      const { payload, alert } = simulator.generateEmergencyStep();

      printTelemetryCard(payload, Math.min(step, 5));
      await sendToApi(TELEMETRY_API_URL, payload);

      if (alert) {
        printAlertBanner(alert);
        await sendToApi(ALERT_API_URL, alert);
      }

      if (simulator.emergency_step_index >= simulator.emergency_steps.length) {
        console.log('\n✅ Emergency simulation sequence completed.');
        console.log('Simulator will now continue monitoring at 95°C. Press Ctrl+C to exit.\n');
        simulator.is_emergency_mode = false;
      }
    } else {
      const payload = simulator.generateNormalData();
      printTelemetryCard(payload);
      await sendToApi(TELEMETRY_API_URL, payload);

      if (cycle % 5 === 0) {
        console.log('💡 Tip: Re-run with --emergency flag to simulate generator overheating.');
      }
    }
  }, INTERVAL_MS);
}

main();
