const sensorService = require('../services/sensorService');
const { defaultSatelliteLink } = require('../queue/satelliteLink');

/**
 * POST /api/sensor-data
 * Ingests station sensor data, validates, detects critical anomalies, and queues message.
 */
async function ingestSensorData(req, res) {
  try {
    const result = await sensorService.processSensorData(req.body);
    
    // Status code: 201 Created (or 202 Accepted into priority queue)
    const statusCode = result.criticalConditionDetected ? 201 : 202;
    
    return res.status(statusCode).json({
      success: true,
      message: result.criticalConditionDetected
        ? 'Sensor data ingested. CRITICAL condition detected and priority alert dispatched!'
        : 'Sensor data ingested and enqueued for satellite transmission.',
      data: result,
    });
  } catch (error) {
    console.error('[SensorController] Error processing sensor data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing sensor data.',
      error: error.message,
    });
  }
}

/**
 * GET /api/sensor-data/latest or /api/telemetry/latest
 */
function getLatest(req, res) {
  const { stationId, station_id } = req.query;
  const targetStation = stationId || station_id;
  const data = sensorService.getLatestData(targetStation);
  return res.json({ success: true, data });
}

/**
 * GET /api/sensor-data/history or /api/telemetry/history
 */
function getHistory(req, res) {
  const { stationId, station_id, limit } = req.query;
  const targetStation = stationId || station_id;
  const data = sensorService.getHistory(targetStation, limit ? parseInt(limit, 10) : 50);
  return res.json({ success: true, data });
}

/**
 * GET /api/telemetry/queue-metrics
 */
function getQueueMetrics(req, res) {
  const metrics = defaultSatelliteLink.getMetrics();
  return res.json({ success: true, data: metrics });
}

module.exports = {
  ingestSensorData,
  getLatest,
  getHistory,
  getQueueMetrics,
};
