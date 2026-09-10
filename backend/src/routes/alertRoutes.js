const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { validateAlert } = require('../middleware/validator');

// POST /api/alerts - Ingest emergency alert
router.post('/', validateAlert, alertController.postAlert);

// GET /api/alerts - Fetch active / filtered alerts
router.get('/', alertController.getAlerts);

// PATCH /api/alerts/:alertId/ack - Acknowledge alert
router.patch('/:alertId/ack', alertController.acknowledge);

// DELETE /api/alerts/clear - Clear alerts
router.delete('/clear', alertController.clearAll);

module.exports = router;
