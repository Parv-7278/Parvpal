const AIAnalystService = require('../services/aiAnalystService');

exports.getAIAnalystStatus = async (req, res) => {
  res.json({
    status: 'ONLINE',
    badge: 'AI ANALYSIS READY',
    engine: 'POLARIS Hybrid Python Analytics + AI Synthesis',
    supported_time_ranges: ['24h', '7d', '30d'],
    supported_analysis_types: [
      'trends',
      'anomalies',
      'correlations',
      'summary',
      'summary_24h',
      'compare',
      'forecast',
      'energy_env',
      'risk',
    ],
    station_security_enforced: true,
  });
};

exports.generate24hSummaryReport = async (req, res) => {
  try {
    const { station_id = 'station-maitri' } = req.body;
    const userRole = req.headers['x-user-role'] || 'india_operator';
    const userStation = req.headers['x-station-id'] || null;

    const result = await AIAnalystService.generate24hReport(station_id, userRole, userStation);
    res.json(result);
  } catch (err) {
    console.error('[24h Report Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate 24-hour operational report.',
      error: err.message,
    });
  }
};


exports.analyzeResearchData = async (req, res) => {
  try {
    const {
      station_id = 'station-maitri',
      analysis_type = 'summary',
      time_range = '7d',
      user_query = null,
    } = req.body;

    const result = await AIAnalystService.runFullAnalysis(station_id, analysis_type, time_range, user_query);
    res.json(result);
  } catch (err) {
    console.error('[AI Analyst Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI research analysis.',
      error: err.message,
    });
  }
};

exports.askResearchAI = async (req, res) => {
  try {
    const {
      station_id = 'station-maitri',
      question = '',
      time_range = '7d',
    } = req.body;

    let analysis_type = 'summary';
    const qLower = (question || '').toLowerCase();
    if (qLower.includes('compare') || qLower.includes('vs')) analysis_type = 'compare';
    else if (qLower.includes('anomal') || qLower.includes('unusual')) analysis_type = 'anomalies';
    else if (qLower.includes('trend') || qLower.includes('change')) analysis_type = 'trends';
    else if (qLower.includes('predict') || qLower.includes('forecast')) analysis_type = 'forecast';
    else if (qLower.includes('correlat') || qLower.includes('relation')) analysis_type = 'correlations';

    const result = await AIAnalystService.runFullAnalysis(station_id, analysis_type, time_range, question);
    res.json({
      answer: result.summary,
      ...result,
    });
  } catch (err) {
    console.error('[AI Analyst Question Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI question.',
      error: err.message,
    });
  }
};
