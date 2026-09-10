const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function getAuthHeaders(role = 'india_operator', assignedStation = null, operatorName = null) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-role': role || 'india_operator',
  };
  if (assignedStation) headers['x-station-id'] = assignedStation;
  if (operatorName) headers['x-operator-name'] = operatorName;
  return headers;
}

export async function fetchLatestTelemetry(stationId, role, assignedStation) {
  const url = stationId 
    ? `${BACKEND_URL}/api/sensor-data/latest?stationId=${stationId}`
    : `${BACKEND_URL}/api/sensor-data/latest`;
  const res = await fetch(url, { headers: getAuthHeaders(role, assignedStation) });
  return res.json();
}

export async function fetchStationStatus(stationId, role, assignedStation) {
  const res = await fetch(`${BACKEND_URL}/api/stations/${stationId}/status`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function fetchStationResearch(stationId, role, assignedStation) {
  const res = await fetch(`${BACKEND_URL}/api/stations/${stationId}/research`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function fetchRemoteOperations(stationId, role, assignedStation) {
  const res = await fetch(`${BACKEND_URL}/api/stations/${stationId}/remote-operations`, {
    headers: getAuthHeaders(role, assignedStation),
  });
  return res.json();
}

export async function executeRemoteCommand(stationId, commandData, operatorName, role, assignedStation) {
  const res = await fetch(`${BACKEND_URL}/api/stations/${stationId}/remote-operations`, {
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

export async function fetchAlerts(stationId, role, assignedStation) {
  const url = stationId 
    ? `${BACKEND_URL}/api/alerts?stationId=${stationId}`
    : `${BACKEND_URL}/api/alerts`;
  const res = await fetch(url, { headers: getAuthHeaders(role, assignedStation) });
  return res.json();
}

export async function triggerScenario(scenarioType, stationId = 'station-bharati') {
  const res = await fetch(`${BACKEND_URL}/api/simulator/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioType, stationId }),
  });
  return res.json();
}

export async function fetchBenchmark() {
  const res = await fetch(`${BACKEND_URL}/api/simulator/benchmark`);
  return res.json();
}

export async function acknowledgeAlert(alertId) {
  const res = await fetch(`${BACKEND_URL}/api/alerts/${alertId}/ack`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function clearAllAlerts() {
  const res = await fetch(`${BACKEND_URL}/api/alerts/clear`, {
    method: 'DELETE',
  });
  return res.json();
}
