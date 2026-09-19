import React from 'react';
import { 
  Building2, 
  Zap, 
  Package, 
  Leaf, 
  Radio,
  Activity,
  ShieldCheck
} from 'lucide-react';
import ExpandableTelemetryCard from './ExpandableTelemetryCard';

export default function StationHealthGauge({ health, selectedStation = 'Maitri Station' }) {
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
      color: '#10b981',
      details: [
        { label: 'Structural Integrity', value: '98%', color: '#10b981' },
        { label: 'Thermal Envelope', value: '92%', color: '#38bdf8' },
        { label: 'Foundation Anchor Health', value: '95%', color: '#10b981' },
      ],
      interpretation: 'Main station structure, containerized living pods, and elevated foundation pilings show no permafrost deformation.'
    },
    { 
      id: 'energy', 
      label: 'Energy', 
      score: healthData.energy, 
      icon: Zap, 
      color: healthData.energy >= 85 ? '#10b981' : '#a3e635',
      details: [
        { label: 'Microgrid Stability', value: '96%', color: '#10b981' },
        { label: 'Genset Health Index', value: '82%', color: '#f59e0b' },
        { label: 'BESS Battery Health (SoH)', value: '98.4%', color: '#10b981' },
      ],
      interpretation: 'Microgrid power generation is steady; Genset G-02 stator temp under surveillance during routine load cycles.'
    },
    { 
      id: 'logistics', 
      label: 'Logistics', 
      score: healthData.logistics, 
      icon: Package, 
      color: '#10b981',
      details: [
        { label: 'Fuel Reserves', value: '43 Days', color: '#f59e0b' },
        { label: 'Food Rations', value: '67 Days', color: '#10b981' },
        { label: 'Medical Supplies', value: '89 Days', color: '#10b981' },
      ],
      interpretation: 'Consumable stock levels are sufficient for the overwintering cycle with scheduled resupply voyage window.'
    },
    { 
      id: 'environment', 
      label: 'Environment', 
      score: healthData.environment, 
      icon: Leaf, 
      color: healthData.environment >= 90 ? '#10b981' : '#facc15',
      details: [
        { label: 'Life Support Air Quality', value: '99%', color: '#10b981' },
        { label: 'Internal Pressure', value: '1013 hPa', color: '#38bdf8' },
        { label: 'Thermal Comfort AHU', value: '94%', color: '#10b981' },
      ],
      interpretation: 'Habitat HVAC and biological water treatment systems are maintaining optimal indoor environmental conditions.'
    },
    { 
      id: 'communication', 
      label: 'Communication', 
      score: healthData.communication, 
      icon: Radio, 
      color: '#10b981',
      details: [
        { label: 'Satellite C/Ku Uplink', value: '99.8% Uptime', color: '#10b981' },
        { label: 'VHF Polar Network', value: 'Nominal', color: '#38bdf8' },
        { label: 'Telemetry Jitter', value: '< 15 ms', color: '#10b981' },
      ],
      interpretation: 'INSAT-4CR space-ground link maintains continuous high-throughput data telemetry with the India HQ Control Centre.'
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
      <ExpandableTelemetryCard
        title="Composite Station Health Score"
        category="STATION MISSION INTEGRITY"
        value={`${healthData.total} / 100`}
        percent={healthData.total}
        status={healthData.total >= 85 ? 'nominal' : healthData.total >= 70 ? 'warning' : 'critical'}
        icon={ShieldCheck}
        color={healthData.ratingColor}
        subtext={`Overall Operational Rating: ${healthData.rating.toUpperCase()}`}
        details={[
          { label: 'Infrastructure', value: `${healthData.infrastructure}/100`, color: '#10b981' },
          { label: 'Energy Grid', value: `${healthData.energy}/100`, color: '#a3e635' },
          { label: 'Logistics Buffer', value: `${healthData.logistics}/100`, color: '#10b981' },
          { label: 'Environment & Life Support', value: `${healthData.environment}/100`, color: '#facc15' },
          { label: 'Communications Link', value: `${healthData.communication}/100`, color: '#10b981' },
        ]}
        interpretation="Comprehensive aggregated station readiness rating combining SCADA bus telemetry, structural health, and life support systems."
        recommendation="All major subsystems are in high readiness state with standard monitoring active."
        stationName={selectedStation}
        className="radial-gauge-wrapper"
      >
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
      </ExpandableTelemetryCard>

      {/* Granular Sub-metrics List */}
      <div className="health-submetrics-list">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <ExpandableTelemetryCard
              key={m.id}
              title={`${m.label} Health Index`}
              category="SUBSYSTEM INTEGRITY"
              value={`${m.score} / 100`}
              percent={m.score}
              status={m.score >= 85 ? 'nominal' : m.score >= 70 ? 'warning' : 'critical'}
              icon={Icon}
              color={m.color}
              subtext={`Integrity score: ${m.score}%`}
              details={m.details}
              interpretation={m.interpretation}
              stationName={selectedStation}
              className="health-metric-row-wrapper"
            >
              <div className="health-metric-row">
                <div className="metric-left">
                  <Icon size={14} style={{ color: m.color }} className="metric-icon" />
                  <span className="metric-label">{m.label}</span>
                </div>
                <span className="metric-score mono-num" style={{ color: m.color }}>
                  {m.score}
                </span>
              </div>
            </ExpandableTelemetryCard>
          );
        })}
      </div>
    </div>
  );
}
