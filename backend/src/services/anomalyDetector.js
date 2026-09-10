/**
 * Automated Critical Condition and Anomaly Detector for Antarctic Research Stations.
 */

function checkAnomalies(sensorData) {
  const anomalies = [];
  const stationId = sensorData.station_id || 'station-bharati';
  const genTemp = Number(sensorData.generator_temperature);
  const battery = Number(sensorData.battery !== undefined ? sensorData.battery : sensorData.battery_level);
  const windSpeed = Number(sensorData.wind_speed);

  // 1. Critical Generator Thermal Runaway Detection (> 90.0°C)
  if (genTemp > 90.0) {
    anomalies.push({
      station_id: stationId,
      priority: 'CRITICAL',
      category: 'GENERATOR',
      message: `CRITICAL: Generator core temperature reached ${genTemp.toFixed(1)}°C (Safe limit: 90.0°C)! Risk of shutdown.`,
      sensor_key: 'generator_temperature',
      sensor_value: genTemp,
      threshold_value: 90.0,
      triggered_at: new Date().toISOString(),
    });
  } else if (genTemp >= 85.0) {
    anomalies.push({
      station_id: stationId,
      priority: 'HIGH',
      category: 'GENERATOR',
      message: `HIGH: Generator temperature elevated to ${genTemp.toFixed(1)}°C (Warning threshold: 85.0°C).`,
      sensor_key: 'generator_temperature',
      sensor_value: genTemp,
      threshold_value: 85.0,
      triggered_at: new Date().toISOString(),
    });
  }

  // 2. Battery Depletion Detection (< 20.0%)
  if (battery < 20.0) {
    anomalies.push({
      station_id: stationId,
      priority: 'CRITICAL',
      category: 'POWER',
      message: `CRITICAL: Station battery reserve critically depleted to ${battery.toFixed(1)}% (Threshold: 20.0%)!`,
      sensor_key: 'battery_level',
      sensor_value: battery,
      threshold_value: 20.0,
      triggered_at: new Date().toISOString(),
    });
  }

  // 3. Severe Blizzard Wind Detection (> 100 km/h)
  if (windSpeed > 100.0) {
    anomalies.push({
      station_id: stationId,
      priority: 'HIGH',
      category: 'WEATHER',
      message: `HIGH: Severe Antarctic Blizzard detected! Winds at ${windSpeed.toFixed(1)} km/h.`,
      sensor_key: 'wind_speed',
      sensor_value: windSpeed,
      threshold_value: 100.0,
      triggered_at: new Date().toISOString(),
    });
  }

  return anomalies;
}

module.exports = {
  checkAnomalies,
};
