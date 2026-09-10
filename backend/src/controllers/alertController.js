const alertService = require('../services/alertService');

/**
 * POST /api/alerts
 * Ingest high-priority emergency alerts and enqueue at Priority Level 1 or 2.
 */
async function postAlert(req, res) {
  try {
    const result = await alertService.triggerAlert(req.body);
    return res.status(201).json({
      success: true,
      message: 'Emergency alert received and fast-tracked through Priority Queue.',
      data: result,
    });
  } catch (error) {
    console.error('[AlertController] Error creating alert:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing alert.',
      error: error.message,
    });
  }
}

/**
 * GET /api/alerts
 * Fetch active and recent alerts with optional filters.
 */
function getAlerts(req, res) {
  const { stationId, station_id, priority, status } = req.query;
  const targetStation = stationId || station_id;
  const alerts = alertService.getAlerts({ stationId: targetStation, priority, status });
  return res.json({
    success: true,
    count: alerts.length,
    data: alerts,
  });
}

/**
 * PATCH /api/alerts/:alertId/ack
 * Acknowledge an alert.
 */
function acknowledge(req, res) {
  const { alertId } = req.params;
  const updated = alertService.acknowledgeAlert(alertId);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Alert '${alertId}' not found.`,
    });
  }
  return res.json({
    success: true,
    message: 'Alert acknowledged successfully.',
    data: updated,
  });
}

/**
 * DELETE /api/alerts/clear
 */
function clearAll(req, res) {
  const result = alertService.clearAlerts();
  return res.json({
    success: true,
    message: 'Active alerts cleared.',
    data: result,
  });
}

module.exports = {
  postAlert,
  getAlerts,
  acknowledge,
  clearAll,
};
