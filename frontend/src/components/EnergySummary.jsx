import React from 'react';
import { SunMedium, BatteryCharging, Power, ArrowRight, Zap } from 'lucide-react';
import { useModal } from '../context/ModalContext';

export default function EnergySummary({ energy: energyProp }) {
  const { openDrillDown } = useModal();
  const energy = energyProp || {
    generation: 132,
    batteryPercent: 82,
    consumption: 105,
    surplus: 27,
  };

  const handleGenerationClick = () => {
    openDrillDown({
      title: 'Microgrid Total Power Generation',
      category: 'ENERGY',
      metricKey: 'power_generation',
      currentValue: energy.generation,
      unit: 'kW',
      status: 'NORMAL',
      thresholds: { warning: '< 100 kW (Low Margin)', critical: '< 80 kW (Deficit)' },
      stats: { min: '95 kW', avg: '128 kW', max: '148 kW' },
      historicalData: [
        { time: '00:00', val: 110 },
        { time: '04:00', val: 115 },
        { time: '08:00', val: 135 },
        { time: '12:00', val: 142 },
        { time: '16:00', val: 138 },
        { time: '20:00', val: 125 },
        { time: 'Now', val: energy.generation },
      ],
      interpretation: 'Combined generation from Diesel Generator Gensets (G-01/G-02) and Solar Photovoltaic arrays is operating stably with healthy reserve headroom.',
      recommendation: 'Scheduled oil sampling for Gen-01 due in 48 running hours.',
    });
  };

  const handleStorageClick = () => {
    openDrillDown({
      title: 'Battery Energy Storage System (BESS) SoC',
      category: 'ENERGY',
      metricKey: 'battery_level',
      currentValue: energy.batteryPercent,
      unit: '%',
      status: energy.batteryPercent < 40 ? 'WARNING' : 'OPTIMAL',
      thresholds: { warning: '< 40% SoC', critical: '< 20% SoC' },
      stats: { min: '62%', avg: '84%', max: '98%' },
      historicalData: [
        { time: '00:00', val: 74 },
        { time: '04:00', val: 68 },
        { time: '08:00', val: 78 },
        { time: '12:00', val: 86 },
        { time: '16:00', val: 84 },
        { time: '20:00', val: 82 },
        { time: 'Now', val: energy.batteryPercent },
      ],
      interpretation: 'LiFePO4 battery rack cell voltages balanced across 12 strings. State of Health (SoH) rated at 96.4%. Thermal management running nominal at +18°C.',
      recommendation: 'Autonomous peak shaving algorithm armed.',
    });
  };

  const handleConsumptionClick = () => {
    openDrillDown({
      title: 'Station Base Load & Life Support Power Consumption',
      category: 'ENERGY',
      metricKey: 'power_consumption',
      currentValue: energy.consumption,
      unit: 'kW',
      status: 'NORMAL',
      thresholds: { warning: '> 130 kW', critical: '> 150 kW (Overload)' },
      stats: { min: '88 kW', avg: '102 kW', max: '122 kW' },
      historicalData: [
        { time: '00:00', val: 92 },
        { time: '04:00', val: 88 },
        { time: '08:00', val: 108 },
        { time: '12:00', val: 114 },
        { time: '16:00', val: 106 },
        { time: '20:00', val: 104 },
        { time: 'Now', val: energy.consumption },
      ],
      interpretation: 'Life support heating, water snow-melters, science laboratories, and comms transmitters consuming normal seasonal base load.',
      recommendation: 'Non-critical snow melter tank #2 load shed ready on emergency trigger.',
    });
  };

  const handleSurplusClick = () => {
    openDrillDown({
      title: 'Microgrid Net Power Surplus / Reserve Margin',
      category: 'ENERGY',
      metricKey: 'power_surplus',
      currentValue: energy.surplus,
      unit: 'kW',
      status: energy.surplus >= 0 ? 'OPTIMAL' : 'WARNING',
      thresholds: { warning: '< 10 kW', critical: '< 0 kW (Net Deficit)' },
      stats: { min: '12 kW', avg: '26 kW', max: '42 kW' },
      historicalData: [
        { time: '00:00', val: 18 },
        { time: '04:00', val: 27 },
        { time: '08:00', val: 27 },
        { time: '12:00', val: 28 },
        { time: '16:00', val: 32 },
        { time: 'Now', val: energy.surplus },
      ],
      interpretation: 'Net power generation exceeds station demand by positive delta. Excess power is continuously directed to trickle-charge the BESS bank.',
      recommendation: 'Maintain current governor droop setting on active genset.',
    });
  };

  return (
    <div className="energy-summary-card polaris-card">
      <div className="card-header-simple">
        <span className="card-title">ENERGY SUMMARY</span>
        <span className="card-subtitle-badge">CLICK NODES</span>
      </div>

      <div className="energy-flow-container">
        {/* Node 1: Generation */}
        <div 
          className="energy-flow-node clickable-drilldown-card"
          onClick={handleGenerationClick}
          title="Click to view full power generation diagnostics"
        >
          <span className="node-category-label">Generation</span>
          <div className="node-icon-circle generation-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
            </svg>
          </div>
          <div className="node-value-box">
            <span className="node-val mono-num">{energy.generation} <span className="val-unit">kW</span></span>
            <span className="node-sub">Total Generation</span>
          </div>
        </div>

        {/* Animated Connector 1 */}
        <div className="flow-connector-wrap">
          <svg width="34" height="20" className="connector-svg">
            <line 
              x1="2" 
              y1="10" 
              x2="28" 
              y2="10" 
              stroke="#10b981" 
              strokeWidth="2" 
              strokeDasharray="4 3" 
              className="flowing-wire-anim" 
            />
            <polygon points="26,6 32,10 26,14" fill="#10b981" />
          </svg>
        </div>

        {/* Node 2: Storage */}
        <div 
          className="energy-flow-node clickable-drilldown-card"
          onClick={handleStorageClick}
          title="Click to view battery storage telemetry"
        >
          <span className="node-category-label">Storage</span>
          <div className="node-icon-circle storage-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <rect x="2" y="7" width="16" height="12" rx="2" />
              <line x1="22" y1="11" x2="22" y2="15" />
              <rect x="5" y="10" width="10" height="6" fill="#10b981" fillOpacity="0.7" rx="1" />
            </svg>
          </div>
          <div className="node-value-box">
            <span className="node-val mono-num green-highlight">{energy.batteryPercent}%</span>
            <span className="node-sub">Battery Charge</span>
          </div>
        </div>

        {/* Animated Connector 2 */}
        <div className="flow-connector-wrap">
          <svg width="34" height="20" className="connector-svg">
            <line 
              x1="2" 
              y1="10" 
              x2="28" 
              y2="10" 
              stroke="#06b6d4" 
              strokeWidth="2" 
              strokeDasharray="4 3" 
              className="flowing-wire-anim" 
            />
            <polygon points="26,6 32,10 26,14" fill="#06b6d4" />
          </svg>
        </div>

        {/* Node 3: Consumption */}
        <div 
          className="energy-flow-node clickable-drilldown-card"
          onClick={handleConsumptionClick}
          title="Click to view power consumption breakdown"
        >
          <span className="node-category-label">Consumption</span>
          <div className="node-icon-circle consumption-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3" />
              <path d="M12 18v3" />
              <path d="M3 12h3" />
              <path d="M18 12h3" />
            </svg>
          </div>
          <div className="node-value-box">
            <span className="node-val mono-num">{energy.consumption} <span className="val-unit">kW</span></span>
            <span className="node-sub">Total Consumption</span>
          </div>
        </div>
      </div>

      {/* Surplus Footer Status */}
      <div 
        className="energy-card-footer clickable-drilldown-card"
        onClick={handleSurplusClick}
        title="Click to inspect power margin"
      >
        <span className="surplus-badge">
          Surplus: <strong className="mono-num">{energy.surplus} kW</strong>
        </span>
      </div>
    </div>
  );
}
