import React from 'react';
import { 
  Thermometer, 
  BatteryCharging, 
  Zap, 
  Cpu, 
  Wind, 
  Droplet, 
  Radio 
} from 'lucide-react';
import MetricCard from './MetricCard';
import { useTelemetry } from '../context/TelemetryContext';

export default function TelemetryGrid() {
  const { currentTelemetry } = useTelemetry();

  // Determine status thresholds
  const genTemp = Number(currentTelemetry.generator_temperature || 70);
  const genStatusLevel = genTemp >= 90 ? 'critical' : genTemp >= 80 ? 'warning' : 'nominal';

  const battery = Number(currentTelemetry.battery_level || 95);
  const batteryStatusLevel = battery < 25 ? 'critical' : battery < 50 ? 'warning' : 'nominal';

  const wind = Number(currentTelemetry.wind_speed || 30);
  const windStatusLevel = wind > 90 ? 'critical' : wind > 60 ? 'warning' : 'nominal';

  return (
    <div className="telemetry-grid">
      <MetricCard
        title="Generator Core Temp"
        value={genTemp.toFixed(1)}
        unit="°C"
        icon={Cpu}
        status={genStatusLevel}
        subtext={`Status: ${currentTelemetry.generator_status || 'RUNNING'} (Max Safe: 85°C)`}
      />

      <MetricCard
        title="Station Battery Bank"
        value={battery.toFixed(1)}
        unit="%"
        icon={BatteryCharging}
        status={batteryStatusLevel}
        subtext="Emergency storage online"
      />

      <MetricCard
        title="Power Consumption"
        value={Number(currentTelemetry.power_consumption || 45).toFixed(1)}
        unit="kW"
        icon={Zap}
        status="nominal"
        subtext="Base load: Living & Lab Quarters"
      />

      <MetricCard
        title="Ambient Temperature"
        value={Number(currentTelemetry.temperature || -20).toFixed(1)}
        unit="°C"
        icon={Thermometer}
        status="nominal"
        subtext="External Antarctic Environment"
      />

      <MetricCard
        title="Wind Speed"
        value={wind.toFixed(1)}
        unit="km/h"
        icon={Wind}
        status={windStatusLevel}
        subtext={wind > 90 ? 'BLIZZARD CONDITIONS' : 'Moderate Arctic Winds'}
      />

      <MetricCard
        title="Water / Fuel Reserve"
        value={Number(currentTelemetry.water_level || 85).toFixed(1)}
        unit="%"
        icon={Droplet}
        status="nominal"
        subtext="Primary melted glacial reserve"
      />

      <MetricCard
        title="Satellite Communication"
        value={currentTelemetry.comms_status || 'NOMINAL'}
        unit=""
        icon={Radio}
        status="nominal"
        subtext="Constrained simulated uplink"
      />
    </div>
  );
}
