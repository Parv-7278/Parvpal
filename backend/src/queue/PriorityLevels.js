/**
 * Priority Level Definitions for Antarctic Satellite Link Simulation.
 * 
 * Hierarchy:
 * 1: CRITICAL - Emergency alerts (Generator thermal runaway, life support, power grid collapse)
 * 2: HIGH     - Warning threshold alerts (Elevated temps, approaching storms)
 * 3: NORMAL   - Routine sensor telemetry (Ambient temp, battery, solar/wind power)
 * 4: LOW      - Background diagnostic logs, non-urgent station maintenance reports
 */

const PRIORITY = {
  CRITICAL: 1,
  HIGH: 2,
  NORMAL: 3,
  LOW: 4,
};

const PRIORITY_NAMES = {
  1: 'CRITICAL',
  2: 'HIGH',
  3: 'NORMAL',
  4: 'LOW',
};

function getPriorityLevel(nameOrLevel) {
  if (typeof nameOrLevel === 'number') {
    return (nameOrLevel >= 1 && nameOrLevel <= 4) ? nameOrLevel : PRIORITY.NORMAL;
  }
  if (typeof nameOrLevel === 'string') {
    const upper = nameOrLevel.toUpperCase().trim();
    return PRIORITY[upper] || PRIORITY.NORMAL;
  }
  return PRIORITY.NORMAL;
}

function getPriorityName(level) {
  return PRIORITY_NAMES[level] || 'NORMAL';
}

module.exports = {
  PRIORITY,
  PRIORITY_NAMES,
  getPriorityLevel,
  getPriorityName,
};
