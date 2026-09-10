import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Trash2 } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { acknowledgeAlert, clearAllAlerts } from '../services/api';

export default function AlertFeed() {
  const { alerts, refreshData } = useTelemetry();

  const handleAck = async (id) => {
    await acknowledgeAlert(id);
    refreshData();
  };

  const handleClear = async () => {
    await clearAllAlerts();
    refreshData();
  };

  return (
    <div className="alert-panel glass-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <ShieldAlert className="text-warning" size={20} />
          <h2>Prioritized Incident & Alert Log</h2>
        </div>
        {alerts.length > 0 && (
          <button onClick={handleClear} className="btn-secondary btn-small">
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="empty-alerts">
            <CheckCircle2 size={32} className="text-emerald" />
            <p>No active emergency alerts. All systems running nominal.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.priority === 'CRITICAL';
            const isAck = alert.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alert.id}
                className={`alert-item ${isCritical ? 'alert-critical-item' : 'alert-high-item'} ${
                  isAck ? 'alert-acked' : ''
                }`}
              >
                <div className="alert-item-header">
                  <div className="alert-badge-group">
                    <span className={`badge ${isCritical ? 'badge-critical' : 'badge-high'}`}>
                      {alert.priority}
                    </span>
                    <span className="badge badge-category">{alert.category}</span>
                    <span className="alert-station-tag mono-text">{alert.station_id}</span>
                  </div>
                  <div className="alert-time mono-text">
                    <Clock size={12} />
                    {new Date(alert.triggered_at).toLocaleTimeString()}
                  </div>
                </div>

                <div className="alert-message">{alert.message}</div>

                {alert.sensor_value && (
                  <div className="alert-meta mono-text">
                    Sensor: <span>{alert.sensor_key}</span> | Value:{' '}
                    <span className="text-warning">{alert.sensor_value}</span> | Safe Limit:{' '}
                    <span>{alert.threshold_value}</span>
                  </div>
                )}

                <div className="alert-actions">
                  {!isAck ? (
                    <button onClick={() => handleAck(alert.id)} className="btn-action-ack">
                      Acknowledge Incident
                    </button>
                  ) : (
                    <span className="acked-label mono-text">✓ Acknowledged</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
