const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { validateSensorData } = require('../middleware/validator');

// POST /api/sensor-data - Ingest station sensor reading
router.post('/', validateSensorData, sensorController.ingestSensorData);

// GET /api/sensor-data/latest - Latest station telemetry
router.get('/latest', sensorController.getLatest);

// GET /api/sensor-data/history - Telemetry history
router.get('/history', sensorController.getHistory);

module.exports = router;
