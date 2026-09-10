/**
 * POLARIS Role-Based Access Control Middleware
 * Validates that station operators can only access their assigned station.
 */

function validateStationAccess(req, res, next) {
  const userRole = req.headers['x-user-role'] || 'india_operator';
  const assignedStation = req.headers['x-station-id'];
  
  // Extract requested station ID from params, query, or body
  const requestedStation = req.params.stationId || req.query.stationId || req.query.station_id || req.body?.stationId || req.body?.station_id;

  // India Operator has unrestricted access to all stations
  if (userRole === 'india_operator' || !requestedStation) {
    return next();
  }

  // Station Operator can ONLY access their assigned station
  if (userRole === 'station_operator') {
    const normAssigned = (assignedStation || '').toLowerCase();
    const normRequested = requestedStation.toLowerCase();

    // Check match for maitri or bharati
    const isMaitriMatch = (normAssigned.includes('maitri') && normRequested.includes('maitri'));
    const isBharatiMatch = (normAssigned.includes('bharati') && normRequested.includes('bharati'));

    if (isMaitriMatch || isBharatiMatch || normAssigned === normRequested) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error_code: 'ACCESS_FORBIDDEN_STATION_ISOLATION',
      message: `Access Denied (HTTP 403): Station operator assigned to '${assignedStation || 'local station'}' is strictly prohibited from accessing '${requestedStation}' telemetry.`,
    });
  }

  return next();
}

module.exports = {
  validateStationAccess,
};
