const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulatorController');

// POST /api/simulator/scenario (Trigger emergency scenarios)
router.post('/scenario', simulatorController.triggerScenario);

// GET /api/simulator/benchmark (Side-by-side FIFO vs PriorityQueue comparison)
router.get('/benchmark', simulatorController.getBenchmark);

module.exports = router;
