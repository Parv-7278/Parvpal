/**
 * Input validation middleware for sensor data and alerts
 */

function validateSensorData(req, res, next) {
  const { 
    station_id, 
    temperature, 
    battery, 
    battery_level, 
    power_consumption, 
    generator_temperature, 
    generator_status, 
    wind_speed, 
    water_level 
  } = req.body;

  const errors = [];

  // Check required station_id
  if (!station_id || typeof station_id !== 'string' || station_id.trim() === '') {
    errors.push("Field 'station_id' is required and must be a non-empty string.");
  }

  // Check numeric sensor fields
  if (temperature === undefined || isNaN(Number(temperature))) {
    errors.push("Field 'temperature' is required and must be a valid number.");
  }

  const batt = battery !== undefined ? battery : battery_level;
  if (batt === undefined || isNaN(Number(batt))) {
    errors.push("Field 'battery' (or 'battery_level') is required and must be a valid number.");
  }

  if (power_consumption === undefined || isNaN(Number(power_consumption))) {
    errors.push("Field 'power_consumption' is required and must be a valid number.");
  }

  if (generator_temperature === undefined || isNaN(Number(generator_temperature))) {
    errors.push("Field 'generator_temperature' is required and must be a valid number.");
  }

  if (!generator_status || typeof generator_status !== 'string') {
    errors.push("Field 'generator_status' is required (e.g. 'RUNNING', 'WARNING', 'OVERHEAT').");
  }

  if (wind_speed === undefined || isNaN(Number(wind_speed))) {
    errors.push("Field 'wind_speed' is required and must be a valid number.");
  }

  if (water_level === undefined || isNaN(Number(water_level))) {
    errors.push("Field 'water_level' is required and must be a valid number.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for incoming sensor data.",
      errors,
    });
  }

  next();
}

function validateAlert(req, res, next) {
  const { station_id, priority, category, message } = req.body;
  const errors = [];

  if (!station_id || typeof station_id !== 'string') {
    errors.push("Field 'station_id' is required.");
  }

  const validPriorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  if (!priority || !validPriorities.includes(priority.toUpperCase())) {
    errors.push(`Field 'priority' must be one of: ${validPriorities.join(', ')}.`);
  }

  if (!category || typeof category !== 'string') {
    errors.push("Field 'category' is required (e.g. 'GENERATOR', 'POWER', 'WEATHER').");
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.push("Field 'message' is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed for incoming alert.",
      errors,
    });
  }

  next();
}

module.exports = {
  validateSensorData,
  validateAlert,
};
