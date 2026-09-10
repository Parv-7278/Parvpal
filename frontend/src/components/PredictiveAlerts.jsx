import React from 'react';
import { AlertOctagon, AlertTriangle, Radio, Activity } from 'lucide-react';

export default function PredictiveAlerts({ insights: insightsProp, onOpenInsight }) {
  const defaultInsights = [
    {
      id: 'insight-1',
      severity: 'high',
      title: 'Generator G-02 (Maitri) – Bearing Vibration Risk',
      description: 'Vibration and temperature trend elevated. Estimated failure window: 24 - 48 hrs.',
      actionLabel: 'View Details',
      detailData: {
        title: 'Generator G-02 Diagnostic Report (Maitri)',
        riskLevel: 'HIGH (84% Probability)',
        window: '24 - 48 Hours',
        vibration: '4.8 mm/s RMS (Threshold: 2.5 mm/s)',
        temp: '78.4°C (Operating Max: 75°C)',
        recommendation: 'Transfer 25 kW load to Generator G-01. Schedule oil sample extraction and bearing inspection.'
      }
    },
    {
      id: 'insight-2',
      severity: 'medium',
      title: 'Lake Priyadarshini Intake Trace Heating',
      description: 'Water intake temperature dipping near freezing point (+0.4°C). Trace heater load adjustment advised.',
      actionLabel: 'View Details',
      detailData: {
        title: 'Lake Intake Thermal Integrity',
        riskLevel: 'MEDIUM (Freeze Risk)',
        window: '6 - 12 Hours',
        temp: '+0.4°C (Safe Margin: > +2.0°C)',
        recommendation: 'Increase intake pipeline heat tracing from 35% to 65% power before midnight temperature trough.'
      }
    },
    {
      id: 'insight-3',
      severity: 'info',
      title: 'Katabatic Wind Energy Surge Window',
      description: 'Forecasted 35 km/h gusts tonight will increase wind turbine yield by +28%.',
      actionLabel: 'View Details',
      detailData: {
        title: 'Renewable Power Capture Opportunity',
        riskLevel: 'POSITIVE HARVEST',
        window: 'Tonight (22:00 - 06:00)',
        windGusts: 'Gusts up to 48 km/h NW',
        recommendation: 'Pre-condition battery storage banks to absorb excess wind turbine generation.'
      }
    },
  ];

  const rawInsights = insightsProp || defaultInsights;

  const insights = rawInsights.map(item => {
    let Icon = AlertTriangle;
    let iconColor = '#f59e0b';
    let iconBg = 'rgba(245, 158, 11, 0.15)';

    if (item.severity === 'high') {
      Icon = AlertOctagon;
      iconColor = '#ef4444';
      iconBg = 'rgba(239, 68, 68, 0.15)';
    } else if (item.severity === 'info') {
      Icon = Radio;
      iconColor = '#38bdf8';
      iconBg = 'rgba(56, 189, 248, 0.15)';
    }

    return {
      ...item,
      icon: Icon,
      iconColor,
      iconBg,
      actionLabel: item.actionLabel || 'View Details',
    };
  });

  return (
    <div className="predictive-alerts-card polaris-card">
      <div className="card-header-simple">
        <span className="card-title">PREDICTIVE ALERTS & INSIGHTS</span>
      </div>

      <div className="predictive-list-wrap">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`predictive-item-row ${item.severity}`}>
              {/* Icon */}
              <div 
                className="predictive-icon-box"
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              >
                <Icon size={16} />
              </div>

              {/* Text Description */}
              <div className="predictive-text-wrap">
                <div className="predictive-title-row">{item.title}</div>
                <div className="predictive-desc-row">{item.description}</div>
              </div>

              {/* Action Button */}
              <button 
                className="predictive-action-btn"
                onClick={() => onOpenInsight(item.detailData)}
              >
                {item.actionLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
