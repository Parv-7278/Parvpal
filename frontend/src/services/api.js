const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function getAuthHeaders(role = 'india_operator', assignedStation = null, operatorName = null) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-role': role || 'india_operator',
  };
  if (assignedStation) headers['x-station-id'] = assignedStation;
  if (operatorName) headers['x-operator-name'] = operatorName;
  return headers;
}

// -----------------------------------------------------------------------------
// Core Station-Aware API Suite
// -----------------------------------------------------------------------------

export async function getStationHealth(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/health`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationModules(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/modules`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationEnergy(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/energy`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationLogistics(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/logistics`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationEnvironment(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/environment`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationResearch(stationId = 'station-maitri', role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/research`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function getStationAlerts(stationId = null, role, assignedStation) {
  const filterParam = stationId && stationId !== 'all-stations' && stationId !== 'all' ? `?stationId=${stationId}` : '';
  const res = await fetch(`${BACKEND_URL}/api/alerts${filterParam}`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

// -----------------------------------------------------------------------------
// Aliases & Extended Services
// -----------------------------------------------------------------------------

export const fetchStationHealth = getStationHealth;
export const fetchStationModules = getStationModules;
export const fetchStationEnergy = getStationEnergy;
export const fetchStationLogistics = getStationLogistics;
export const fetchStationEnvironment = getStationEnvironment;
export const fetchStationResearch = getStationResearch;
export const fetchAlerts = getStationAlerts;

export async function fetchLatestTelemetry(stationId, role, assignedStation) {
  const filterParam = stationId && stationId !== 'all-stations' && stationId !== 'all' ? `?stationId=${stationId}` : '';
  const res = await fetch(`${BACKEND_URL}/api/sensor-data/latest${filterParam}`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function fetchStationStatus(stationId, role, assignedStation) {
  return getStationHealth(stationId, role, assignedStation);
}

export async function fetchRemoteOperations(stationId, role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/remote-operations`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function executeRemoteCommand(stationId, commandData, operatorName, role, assignedStation) {
  const normId = stationId === 'all-stations' || stationId === 'all' ? 'station-maitri' : stationId;
  const res = await fetch(`${BACKEND_URL}/api/stations/${normId}/remote-operations`, {
    method: 'POST',
    headers: getAuthHeaders(role, assignedStation, operatorName),
    body: JSON.stringify(commandData),
  });
  return res.json();
}

export async function fetchQueueMetrics() {
  const res = await fetch(`${BACKEND_URL}/api/telemetry/queue-metrics`);
  return res.json();
}

export async function triggerScenario(scenarioType, stationId = 'station-bharati') {
  const res = await fetch(`${BACKEND_URL}/api/simulations/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_type: scenarioType, station_id: stationId }),
  });
  return res.json();
}

export async function acknowledgeAlert(alertId) {
  const res = await fetch(`${BACKEND_URL}/api/alerts/${alertId}/ack`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function clearAllAlerts(stationId = null) {
  const filterParam = stationId ? `?stationId=${stationId}` : '';
  const res = await fetch(`${BACKEND_URL}/api/alerts/clear${filterParam}`, {
    method: 'DELETE',
  });
  return res.json();
}

// -----------------------------------------------------------------------------
// AI Research Analyst Services
// -----------------------------------------------------------------------------

export async function analyzeResearchData(params = {}, role, assignedStation) {
  const {
    stationId = 'station-maitri',
    analysisType = 'summary',
    timeRange = '7d',
    userQuery = null
  } = params;

  const res = await fetch(`${BACKEND_URL}/api/research/ai-analyst/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(role, assignedStation),
    body: JSON.stringify({
      station_id: stationId,
      analysis_type: analysisType,
      time_range: timeRange,
      user_query: userQuery
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Analysis request failed with status ${res.status}`);
  }
  return res.json();
}

export async function askResearchAI(params = {}, role, assignedStation) {
  const {
    stationId = 'station-maitri',
    question = '',
    timeRange = '7d'
  } = params;

  const res = await fetch(`${BACKEND_URL}/api/research/ai-analyst/ask`, {
    method: 'POST',
    headers: getAuthHeaders(role, assignedStation),
    body: JSON.stringify({
      station_id: stationId,
      question,
      time_range: timeRange
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Query request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getAIAnalystStatus(role, assignedStation) {
  const res = await fetch(`${BACKEND_URL}/api/research/ai-analyst/status`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

