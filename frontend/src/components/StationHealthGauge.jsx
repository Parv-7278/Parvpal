import React from 'react';
import { 
  Building2, 
  Zap, 
  Package, 
  Leaf, 
  Radio
} from 'lucide-react';

export default function StationHealthGauge({ health }) {
  const healthData = health || {
    total: 87,
    rating: 'Good',
    ratingColor: '#10b981',
    infrastructure: 91,
    energy: 84,
    logistics: 89,
    environment: 78,
    communication: 94,
  };

  const metrics = [
    { 
      id: 'infrastructure', 
      label: 'Infrastructure', 
      score: healthData.infrastructure, 
      icon: Building2, 
      color: '#10b981' 
    },
    { 
      id: 'energy', 
      label: 'Energy', 
      score: healthData.energy, 
      icon: Zap, 
      color: healthData.energy >= 85 ? '#10b981' : '#a3e635' 
    },
    { 
      id: 'logistics', 
      label: 'Logistics', 
      score: healthData.logistics, 
      icon: Package, 
      color: '#10b981' 
    },
    { 
      id: 'environment', 
      label: 'Environment', 
      score: healthData.environment, 
      icon: Leaf, 
      color: healthData.environment >= 90 ? '#10b981' : '#facc15' 
    },
    { 
      id: 'communication', 
      label: 'Communication', 
      score: healthData.communication, 
      icon: Radio, 
      color: '#10b981' 
    },
  ];

  const size = 130;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (healthData.total / 100) * circumference;
  const dashoffset = circumference - progress;

  return (
    <div className="station-health-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">STATION HEALTH INDEX</span>
      </div>

      {/* Circular Radial Gauge */}
      <div className="radial-gauge-container">
        <div className="gauge-svg-wrap">
          <svg width={size} height={size} className="gauge-svg">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e699" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(30, 58, 95, 0.4)"
              strokeWidth={strokeWidth}
            />

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="url(#gaugeGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: 'stroke-dashoffset 0.8s ease'
              }}
            />
          </svg>

          <div className="gauge-center-content">
            <div className="score-main-row">
              <span className="score-big mono-num">{healthData.total}</span>
              <span className="score-max">/100</span>
            </div>
            <span className="score-status-badge" style={{ color: healthData.ratingColor }}>
              {healthData.rating.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Granular Sub-metrics List */}
      <div className="health-submetrics-list">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="health-metric-row">
              <div className="metric-left">
                <Icon size={14} style={{ color: m.color }} className="metric-icon" />
                <span className="metric-label">{m.label}</span>
              </div>
              <span className="metric-score mono-num" style={{ color: m.color }}>
                {m.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
