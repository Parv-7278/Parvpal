/**
 * Phase 2 API Verification Test Suite
 */

const { server } = require('./src/server');

const BASE_URL = 'http://localhost:5001';

async function testSuite() {
  console.log('===============================================================');
  console.log('🧪 Starting Phase 2 Express Backend API Verification');
  console.log('===============================================================');

  // Start test server on port 5001
  await new Promise((resolve) => server.listen(5001, resolve));
  console.log('🚀 Test server active on http://localhost:5001\n');

  let passed = 0;
  let failed = 0;

  async function assert(testName, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${testName}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Test POST /api/sensor-data (Normal telemetry)
  await assert('POST /api/sensor-data (Normal Telemetry)', async () => {
    const res = await fetch(`${BASE_URL}/api/sensor-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: 'station-bharati',
        temperature: -14.2,
        battery: 98.0,
        power_consumption: 52.0,
        generator_temperature: 70.5,
        generator_status: 'RUNNING',
        wind_speed: 25.0,
        water_level: 92.0,
      }),
    });

    const json = await res.json();
    if (res.status !== 202) throw new Error(`Expected status 202, got ${res.status}: ${JSON.stringify(json)}`);
    if (!json.success) throw new Error('Response success was false');
    if (json.data.criticalConditionDetected) throw new Error('Expected normal telemetry, got critical flag');
  });

  // 2. Test POST /api/sensor-data (Validation Error handling)
  await assert('POST /api/sensor-data (Validation Error Handling for missing fields)', async () => {
    const res = await fetch(`${BASE_URL}/api/sensor-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: 'station-bharati',
        // missing required fields
      }),
    });

    const json = await res.json();
    if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    if (json.success !== false) throw new Error('Expected success=false');
    if (!json.errors || json.errors.length === 0) throw new Error('Expected validation errors list');
  });

  // 3. Test POST /api/sensor-data (Automated Critical Condition Detection)
  await assert('POST /api/sensor-data (Automated Anomaly Detection on 95°C Generator Temp)', async () => {
    const res = await fetch(`${BASE_URL}/api/sensor-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: 'station-bharati',
        temperature: -13.8,
        battery: 98.0,
        power_consumption: 54.0,
        generator_temperature: 95.0, // Exceeds 90.0°C limit!
        generator_status: 'OVERHEAT',
        wind_speed: 25.0,
        water_level: 92.0,
      }),
    });

    const json = await res.json();
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    if (!json.data.criticalConditionDetected) throw new Error('Expected criticalConditionDetected=true');
    if (json.data.triggeredAlerts.length === 0) throw new Error('Expected automatic alert creation');
    if (json.data.triggeredAlerts[0].alert.priority !== 'CRITICAL') throw new Error('Expected CRITICAL priority alert');
  });

  // 4. Test POST /api/alerts
  await assert('POST /api/alerts (Direct Emergency Alert Creation)', async () => {
    const res = await fetch(`${BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        station_id: 'station-bharati',
        priority: 'CRITICAL',
        category: 'POWER',
        message: 'Primary power bus failure. Emergency battery bank engaged.',
        sensor_key: 'battery_level',
        sensor_value: 18.5,
        threshold_value: 20.0,
      }),
    });

    const json = await res.json();
    if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
    if (json.data.alert.priority !== 'CRITICAL') throw new Error('Expected CRITICAL priority');
  });

  // 5. Test GET /api/stations/:stationId/status
  await assert('GET /api/stations/:stationId/status (Station Health & Sensor Status)', async () => {
    const res = await fetch(`${BASE_URL}/api/stations/station-bharati/status`);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!json.data.metadata || json.data.metadata.name !== 'Bharati Research Station') {
      throw new Error('Metadata missing or invalid station name');
    }
    if (!json.data.latest_sensors) throw new Error('Missing latest_sensors object');
    if (json.data.overall_health !== 'CRITICAL') {
      throw new Error(`Expected CRITICAL overall_health due to previous alert, got ${json.data.overall_health}`);
    }
  });

  // 6. Test GET /api/alerts
  await assert('GET /api/alerts (Fetch Active Alert Feed)', async () => {
    const res = await fetch(`${BASE_URL}/api/alerts`);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (json.count < 1) throw new Error('Expected at least 1 active alert');
  });

  // 7. Test GET /api/stations/:stationId/research (Maitri vs Bharati data & RBAC)
  await assert('GET /api/stations/station-maitri/research (Maitri Research Telemetry)', async () => {
    const res = await fetch(`${BASE_URL}/api/stations/station-maitri/research`, {
      headers: { 'x-user-role': 'station_operator', 'x-station-id': 'station-maitri' }
    });
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (!json.success || !json.data) throw new Error('Expected success with research data payload');
    if (json.data.station_name !== 'MAITRI') throw new Error(`Expected MAITRI, got ${json.data.station_name}`);
    if (json.data.crew_biotelemetry.active_overwintering_personnel !== 24) throw new Error('Expected 24 crew for Maitri');
  });

  await assert('GET /api/stations/station-bharati/research (Bharati Research Telemetry)', async () => {
    const res = await fetch(`${BASE_URL}/api/stations/station-bharati/research`, {
      headers: { 'x-user-role': 'india_operator' }
    });
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
    if (json.data.station_name !== 'BHARATI') throw new Error(`Expected BHARATI, got ${json.data.station_name}`);
    if (json.data.crew_biotelemetry.active_overwintering_personnel !== 42) throw new Error('Expected 42 crew for Bharati');
  });

  await assert('GET /api/stations/station-bharati/research (RBAC 403 for Maitri Operator attempting Bharati)', async () => {
    const res = await fetch(`${BASE_URL}/api/stations/station-bharati/research`, {
      headers: { 'x-user-role': 'station_operator', 'x-station-id': 'station-maitri' }
    });
    const json = await res.json();
    if (res.status !== 403) throw new Error(`Expected status 403, got ${res.status}`);
    if (json.error_code !== 'ACCESS_FORBIDDEN_STATION_ISOLATION') throw new Error(`Expected ACCESS_FORBIDDEN_STATION_ISOLATION, got ${json.error_code}`);
  });

  console.log('\n---------------------------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('---------------------------------------------------------------');

  process.exit(0);
}

testSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
