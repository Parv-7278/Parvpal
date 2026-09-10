import React from 'react';

export default function MetricCard({ title, value, unit, icon: Icon, status = 'nominal', subtext, statusColor }) {
  const getStatusClass = () => {
    switch (status) {
      case 'critical':
        return 'border-critical glow-critical text-critical';
      case 'warning':
        return 'border-warning text-warning';
      case 'nominal':
      default:
        return 'border-nominal text-cyan';
    }
  };

  return (
    <div className={`metric-card glass-panel ${getStatusClass()}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && <Icon size={20} className="metric-icon" />}
      </div>
      <div className="metric-body">
        <span className="metric-value mono-text">{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  );
}
