const express = require('express');
const router = express.Router();
const aiAnalystController = require('../controllers/aiAnalystController');
const { validateStationAccess } = require('../middleware/authRoleMiddleware');

// GET /api/research/ai-analyst/status
router.get('/status', aiAnalystController.getAIAnalystStatus);

// POST /api/research/ai-analyst/analyze
router.post('/analyze', validateStationAccess, aiAnalystController.analyzeResearchData);

// POST /api/research/ai-analyst/ask
router.post('/ask', validateStationAccess, aiAnalystController.askResearchAI);

module.exports = router;
