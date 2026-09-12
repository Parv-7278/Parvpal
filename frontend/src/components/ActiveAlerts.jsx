import React from 'react';
import { AlertTriangle, Flame, Wind, BellRing } from 'lucide-react';
import { useModal } from '../context/ModalContext';

export default function ActiveAlerts({ alerts: alertsProp, unreadCount, onOpenViewAll, selectedStation = 'Maitri Station' }) {
  const { openDrillDown } = useModal();

  const defaultAlerts = [
    {
      id: 'alert-1',
      severity: 'critical',
      title: 'High Vibration Detected',
      source: 'Generator G-02 (Maitri)',
      time: '12:40 PM',
      type: 'critical',
      details: 'Shaft harmonic vibration frequency reached 4.8 mm/s exceeding nominal threshold of 2.5 mm/s. Bearing casing inspection advised.',
    },
    {
      id: 'alert-2',
      severity: 'warning',
      title: 'Fuel Reserve Critical Trend',
      source: 'Maitri Fuel Farm',
      time: '12:35 PM',
      type: 'warning',
      details: 'Daily consumption rate increased by 14% over baseline due to auxiliary laboratory heating load.',
    },
    {
      id: 'alert-3',
      severity: 'warning',
      title: 'Katabatic High Wind Warning',
      source: 'Schirmacher Oasis',
      time: '12:30 PM',
      type: 'warning',
      details: 'Wind speeds gusting at 58.4 km/h with sudden pressure drops. Outdoor scientific traverses suspended.',
    },
  ];

  const rawAlerts = alertsProp || defaultAlerts;

  const alertsList = rawAlerts.map(item => {
    let Icon = AlertTriangle;
    let iconBg = 'rgba(245, 158, 11, 0.18)';
    let iconColor = '#fbbf24';

    if (item.severity === 'critical') {
      Icon = Flame;
      iconBg = 'rgba(239, 68, 68, 0.18)';
      iconColor = '#f87171';
    } else if (item.severity === 'info') {
      Icon = BellRing;
      iconBg = 'rgba(56, 189, 248, 0.18)';
      iconColor = '#38bdf8';
    } else if (item.title?.toLowerCase().includes('wind')) {
      Icon = Wind;
      iconBg = 'rgba(234, 179, 8, 0.18)';
      iconColor = '#facc15';
    }

    return {
      ...item,
      icon: Icon,
      iconBg,
      iconColor
    };
  });

  const handleAlertClick = (alert) => {
    openDrillDown({
      title: `Alert: ${alert.title}`,
      type: 'ALERT_DETAIL',
      category: 'ALERT',
      currentValue: alert.severity.toUpperCase(),
      unit: 'Severity',
      status: alert.severity === 'critical' ? 'CRITICAL' : 'WARNING',
      interpretation: alert.details || `${alert.title} reported on ${alert.source} at ${alert.time}.`,
      recommendation: 'Follow standard Antarctic mission control standard operating procedures (SOP).',
      station: selectedStation,
      metadata: {
        source: alert.source,
        timestamp: alert.time,
        severity: alert.severity,
      }
    });
  };

  return (
    <div className="active-alerts-section polaris-card">
      <div className="card-header-with-action">
        <span className="card-title">ACTIVE ALERTS</span>
        <button 
          className="card-action-link"
          onClick={onOpenViewAll}
        >
          View All
        </button>
      </div>

      <div className="alerts-card-list">
        {alertsList.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              className={`alert-list-item ${item.severity} interactive-card`}
              onClick={() => handleAlertClick(item)}
            >
              <div 
                className="alert-icon-wrap"
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              >
                <Icon size={15} />
              </div>
              
              <div className="alert-content-wrap">
                <div className="alert-title-row">
                  <span className="alert-item-title">{item.title}</span>
                  <span className="alert-item-time mono-num">{item.time}</span>
                </div>
                <div className="alert-item-source">{item.source}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="alerts-card-footer">
        <span className="total-unread-label">Total Unread Alerts</span>
        <span className="unread-badge-count">{unreadCount !== undefined ? unreadCount : alertsList.length}</span>
      </div>
    </div>
  );
}
