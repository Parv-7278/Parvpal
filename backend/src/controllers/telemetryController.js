const telemetryService = require('../services/telemetryService');
const { defaultSatelliteLink } = require('../queue/satelliteLink');

async function postTelemetry(req, res) {
  try {
    const result = await telemetryService.ingestTelemetry(req.body);
    return res.status(202).json({
      success: true,
      message: 'Telemetry received and queued for transmission',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

function getLatest(req, res) {
  const { stationId } = req.query;
  const data = telemetryService.getLatestTelemetry(stationId);
  return res.json({ success: true, data });
}

function getHistory(req, res) {
  const { stationId, limit } = req.query;
  const data = telemetryService.getTelemetryHistory(stationId, limit ? parseInt(limit, 10) : 50);
  return res.json({ success: true, data });
}

function getQueueMetrics(req, res) {
  const metrics = defaultSatelliteLink.getMetrics();
  return res.json({ success: true, data: metrics });
}

module.exports = {
  postTelemetry,
  getLatest,
  getHistory,
  getQueueMetrics,
};
