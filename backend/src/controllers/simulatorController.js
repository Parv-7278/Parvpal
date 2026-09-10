const telemetryService = require('../services/telemetryService');
const alertService = require('../services/alertService');
const { runCommunicationComparison } = require('../queue/CommunicationBenchmark');

/**
 * Endpoint to trigger emergency simulation scenarios (e.g. Generator Overheat 70°C -> 95°C)
 */
async function triggerScenario(req, res) {
  const { scenarioType, stationId = 'station-bharati' } = req.body;

  try {
    if (scenarioType === 'GENERATOR_OVERHEAT') {
      // Step 1: Ingest preliminary telemetry showing rapid rise
      await telemetryService.ingestTelemetry({
        station_id: stationId,
        generator_status: 'OVERHEAT',
        generator_temperature: 95.0,
        power_consumption: 54.0,
        recorded_at: new Date().toISOString(),
      });

      // Step 2: Trigger Critical Emergency Alert
      const alertResult = await alertService.triggerAlert({
        station_id: stationId,
        priority: 'CRITICAL',
        category: 'GENERATOR',
        message: 'CRITICAL: Main Diesel Generator Core Temperature reached 95°C (Threshold: 90°C)',
        sensor_key: 'generator_temperature',
        sensor_value: 95.0,
        threshold_value: 90.0,
        triggered_at: new Date().toISOString(),
      });

      return res.json({
        success: true,
        scenario: 'GENERATOR_OVERHEAT',
        message: 'Generator thermal runaway simulated. Critical emergency message queued at priority level 1.',
        alert: alertResult,
      });
    }

    if (scenarioType === 'BLIZZARD_WARNING') {
      await telemetryService.ingestTelemetry({
        station_id: stationId,
        wind_speed: 115.0,
        temperature: -38.0,
        recorded_at: new Date().toISOString(),
      });

      const alertResult = await alertService.triggerAlert({
        station_id: stationId,
        priority: 'HIGH',
        category: 'WEATHER',
        message: 'HIGH: Antarctic Blizzard Winds at 115 km/h. Outdoor operations suspended.',
        sensor_key: 'wind_speed',
        sensor_value: 115.0,
        threshold_value: 90.0,
        triggered_at: new Date().toISOString(),
      });

      return res.json({
        success: true,
        scenario: 'BLIZZARD_WARNING',
        message: 'Blizzard storm simulated. High priority warning dispatched.',
        alert: alertResult,
      });
    }

    if (scenarioType === 'POWER_FAILURE') {
      await telemetryService.ingestTelemetry({
        station_id: stationId,
        battery_level: 18.5,
        generator_status: 'FAULT',
        recorded_at: new Date().toISOString(),
      });

      const alertResult = await alertService.triggerAlert({
        station_id: stationId,
        priority: 'CRITICAL',
        category: 'POWER',
        message: 'CRITICAL: Primary Power Grid Failure. Station operating on Emergency Battery Bank (18.5%).',
        sensor_key: 'battery_level',
        sensor_value: 18.5,
        threshold_value: 20.0,
        triggered_at: new Date().toISOString(),
      });

      return res.json({
        success: true,
        scenario: 'POWER_FAILURE',
        message: 'Power grid fault simulated. Emergency alert priority queued.',
        alert: alertResult,
      });
    }

    return res.status(400).json({
      success: false,
      message: `Unknown scenario type: ${scenarioType}. Supported: GENERATOR_OVERHEAT, BLIZZARD_WARNING, POWER_FAILURE`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/simulator/benchmark
 * Runs and returns the side-by-side FIFO vs PriorityQueue latency comparison.
 */
async function getBenchmark(req, res) {
  try {
    const results = await runCommunicationComparison();
    return res.json({
      success: true,
      label: 'Simulated Latency Benchmark',
      disclaimer: 'Simulated Latency: Calculated for prototype demonstration of queueing behavior.',
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  triggerScenario,
  getBenchmark,
};
