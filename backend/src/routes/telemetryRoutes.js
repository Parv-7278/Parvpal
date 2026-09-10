const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { validateSensorData } = require('../middleware/validator');

// POST /api/telemetry (Alias for /api/sensor-data)
router.post('/', validateSensorData, sensorController.ingestSensorData);

// GET /api/telemetry/latest
router.get('/latest', sensorController.getLatest);

// GET /api/telemetry/history
router.get('/history', sensorController.getHistory);

// GET /api/telemetry/queue-metrics (Satellite link & Priority Queue stats)
router.get('/queue-metrics', sensorController.getQueueMetrics);

module.exports = router;
