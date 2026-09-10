/**
 * Node.js alternative runner for Antarctic Station Sensor Simulator.
 * Provides the same telemetry drift & emergency scenario simulations as simulator.py.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TELEMETRY_ENDPOINT = `${BACKEND_URL}/api/telemetry`;
const ALERT_ENDPOINT = `${BACKEND_URL}/api/alerts`;

const STATIONS = {
  'station-maitri': {
    name: 'Maitri Research Station',
    state: {
      temperature: -18.0,
      battery_level: 95.0,
      power_consumption: 45.0,
      generator_status: 'RUNNING',
      generator_temperature: 72.0,
      wind_speed: 32.0,
      water_level: 88.0,
      comms_status: 'SAT_LINK_NOMINAL',
    }
  },
  'station-bharati': {
    name: 'Bharati Research Station',
    state: {
      temperature: -14.0,
      battery_level: 98.0,
      power_consumption: 52.0,
      generator_status: 'RUNNING',
      generator_temperature: 70.0,
      wind_speed: 25.0,
      water_level: 92.0,
      comms_status: 'SAT_LINK_NOMINAL',
    }
  }
};

async function postJson(url, data) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(`❌ Connection error to ${url}:`, err.message);
    return null;
  }
}

async function runGeneratorThermalRunaway(stationId = 'station-maitri') {
  const stn = STATIONS[stationId];
  console.log(`\n🔥 [SCENARIO INITIATED] Generator Thermal Runaway on ${stn.name}`);
  const steps = [70.0, 78.0, 85.0, 92.0, 95.0];

  for (let i = 0; i < steps.length; i++) {
    const temp = steps[i];
    stn.state.generator_temperature = temp;
    stn.state.generator_status = temp >= 92 ? 'OVERHEAT' : temp >= 85 ? 'WARNING' : 'RUNNING';

    const payload = {
      station_id: stationId,
      station_name: stn.name,
      ...stn.state,
      recorded_at: new Date().toISOString(),
    };

    console.log(`  ↳ Step ${i + 1}/5: Generator Core Temp = ${temp}°C -> Sending Telemetry...`);
    await postJson(TELEMETRY_ENDPOINT, payload);

    if (temp >= 95.0) {
      console.log(`  🚨 [TRIGGER CRITICAL ALERT] 95°C exceeded critical threshold (90°C)!`);
      const alertPayload = {
        station_id: stationId,
        priority: 'CRITICAL',
        category: 'GENERATOR',
        message: `CRITICAL: Generator 1 on ${stn.name} reached ${temp}°C! Immediate intervention required.`,
        sensor_key: 'generator_temperature',
        sensor_value: temp,
        threshold_value: 90.0,
        triggered_at: new Date().toISOString(),
      };
      await postJson(ALERT_ENDPOINT, alertPayload);
    }

    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`✅ [SCENARIO COMPLETED] Generator Thermal Runaway finished.\n`);
}

function driftSensors(stationId) {
  const stn = STATIONS[stationId];
  const s = stn.state;

  s.temperature = +(s.temperature + (Math.random() * 0.8 - 0.4)).toFixed(2);
  s.battery_level = +(Math.max(85, Math.min(100, s.battery_level + (Math.random() * 0.4 - 0.2)))).toFixed(2);
  s.power_consumption = +(Math.max(30, Math.min(75, s.power_consumption + (Math.random() * 1.6 - 0.8)))).toFixed(2);
  s.generator_temperature = +(Math.max(65, Math.min(78, s.generator_temperature + (Math.random() * 1.0 - 0.5)))).toFixed(2);
  s.wind_speed = +(Math.max(5, Math.min(70, s.wind_speed + (Math.random() * 3.0 - 1.5)))).toFixed(2);
  s.water_level = +(Math.max(50, Math.min(100, s.water_level + (Math.random() * 0.2 - 0.1)))).toFixed(2);

  return {
    station_id: stationId,
    station_name: stn.name,
    ...s,
    recorded_at: new Date().toISOString(),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const isScenario = args.includes('--scenario') || args.includes('-s');

  console.log('==================================================================');
  console.log('🏔️  Antarctic Research Station Sensor Simulator (Node.js Runner)');
  console.log(`📡 Backend Target: ${BACKEND_URL}`);
  console.log('==================================================================');

  if (isScenario) {
    await runGeneratorThermalRunaway('station-maitri');
    return;
  }

  console.log('▶️  Starting normal telemetry stream (Press Ctrl+C to stop)...\n');
  setInterval(async () => {
    for (const stnId of Object.keys(STATIONS)) {
      const payload = driftSensors(stnId);
      await postJson(TELEMETRY_ENDPOINT, payload);
      console.log(`[${stnId}] 📊 Telemetry Queued | Temp: ${payload.temperature}°C, Gen: ${payload.generator_temperature}°C`);
    }
  }, 3000);
}

main();
