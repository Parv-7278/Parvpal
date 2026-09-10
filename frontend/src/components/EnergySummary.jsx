import React from 'react';
import { SunMedium, BatteryCharging, Power, ArrowRight, Zap } from 'lucide-react';

export default function EnergySummary({ energy: energyProp }) {
  const energy = energyProp || {
    generation: 132,
    batteryPercent: 82,
    consumption: 105,
    surplus: 27,
  };

  return (
    <div className="energy-summary-card polaris-card">
      <div className="card-header-simple">
        <span className="card-title">ENERGY SUMMARY</span>
      </div>

      <div className="energy-flow-container">
        {/* Node 1: Generation */}
        <div className="energy-flow-node">
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
        <div className="energy-flow-node">
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
        <div className="energy-flow-node">
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
      <div className="energy-card-footer">
        <span className="surplus-badge">
          Surplus: <strong className="mono-num">{energy.surplus} kW</strong>
        </span>
      </div>
    </div>
  );
}
