import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Thermometer, Wind, Zap, Activity, Clock } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, title, type, data }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-dialog-card polaris-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-bar">
          <div className="modal-title-wrap">
            <span className="modal-badge-type">{type || 'TELEMETRY'}</span>
            <h3 className="modal-heading">{title || 'Detailed Diagnostics'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-content-body">
          {type === 'ALERT_VIEW_ALL' && (
            <div className="modal-alerts-list">
              <div className="modal-alert-item critical">
                <div className="m-alert-header">
                  <span className="m-tag critical">CRITICAL</span>
                  <span className="m-time mono-num">12:40 PM</span>
                </div>
                <h4 className="m-alert-title">High Vibration Detected - Generator G-02 (Bharati)</h4>
                <p className="m-alert-desc">Radial vibration RMS 4.8 mm/s exceeded standard safe threshold (2.5 mm/s). Risk of mechanical bearing seizure.</p>
                <div className="m-alert-actions">
                  <button className="btn-modal-primary" onClick={onClose}>Acknowledge Alert</button>
                  <button className="btn-modal-secondary" onClick={onClose}>Initiate Load Shed</button>
                </div>
              </div>

              <div className="modal-alert-item warning">
                <div className="m-alert-header">
                  <span className="m-tag warning">WARNING</span>
                  <span className="m-time mono-num">12:35 PM</span>
                </div>
                <h4 className="m-alert-title">Fuel Reserve Critical Trend - Maitri Station</h4>
                <p className="m-alert-desc">Predicted depletion date accelerated from 30 Aug 2025 to 15 Jul 2025 due to low ambient temperatures requiring continuous auxiliary heating.</p>
                <div className="m-alert-actions">
                  <button className="btn-modal-primary" onClick={onClose}>Acknowledge Alert</button>
                </div>
              </div>

              <div className="modal-alert-item warning">
                <div className="m-alert-header">
                  <span className="m-tag warning">WARNING</span>
                  <span className="m-time mono-num">12:30 PM</span>
                </div>
                <h4 className="m-alert-title">High Wind Warning (Both Stations)</h4>
                <p className="m-alert-desc">Approaching katabatic wind front with gusts reaching 95 km/h over Larsemann Hills and Schirmacher Oasis.</p>
                <div className="m-alert-actions">
                  <button className="btn-modal-primary" onClick={onClose}>Lock Down Outer Arrays</button>
                </div>
              </div>
            </div>
          )}

          {type === 'INSIGHT_DETAIL' && data && (
            <div className="modal-insight-detail">
              <div className="insight-stat-banner">
                <div className="i-stat">
                  <span className="i-label">Risk Probability</span>
                  <span className="i-val text-red mono-num">{data.riskLevel}</span>
                </div>
                <div className="i-stat">
                  <span className="i-label">Estimated Failure Window</span>
                  <span className="i-val text-amber mono-num">{data.window}</span>
                </div>
              </div>

              <div className="insight-specs-grid">
                {data.vibration && (
                  <div className="i-spec-box">
                    <span className="i-spec-lbl">Vibration Signature</span>
                    <span className="i-spec-val mono-num">{data.vibration}</span>
                  </div>
                )}
                {data.temp && (
                  <div className="i-spec-box">
                    <span className="i-spec-lbl">Operating Temperature</span>
                    <span className="i-spec-val mono-num">{data.temp}</span>
                  </div>
                )}
                {data.internalResistance && (
                  <div className="i-spec-box">
                    <span className="i-spec-lbl">Internal Cell Resistance</span>
                    <span className="i-spec-val mono-num">{data.internalResistance}</span>
                  </div>
                )}
                {data.windGusts && (
                  <div className="i-spec-box">
                    <span className="i-spec-lbl">Peak Gust Estimate</span>
                    <span className="i-spec-val mono-num">{data.windGusts}</span>
                  </div>
                )}
              </div>

              <div className="recommendation-callout">
                <h4 className="rec-title">AI Actionable Recommendation:</h4>
                <p className="rec-body">{data.recommendation}</p>
              </div>

              <div className="modal-actions-bar">
                <button className="btn-modal-primary" onClick={onClose}>Apply Recommended Mitigation</button>
                <button className="btn-modal-secondary" onClick={onClose}>Dismiss</button>
              </div>
            </div>
          )}

          {type === 'SIMULATION_REPORT' && data && (
            <div className="modal-simulation-report">
              <div className="sim-summary-box">
                <h4>Scenario: {data.label}</h4>
                <p>Digital Twin dynamic stress model simulated against active polar mission baseline.</p>
              </div>

              <div className="sim-report-table">
                <div className="sim-rep-row header">
                  <span>Subsystem</span>
                  <span>Baseline</span>
                  <span>Simulated State</span>
                  <span>Status</span>
                </div>
                <div className="sim-rep-row">
                  <span>Generator G-01 Primary</span>
                  <span>70 kW</span>
                  <span>108 kW (Overload)</span>
                  <span className="text-amber">Warning</span>
                </div>
                <div className="sim-rep-row">
                  <span>BESS Battery Bank</span>
                  <span>98% SoC</span>
                  <span>58% SoC in 6h</span>
                  <span className="text-cyan">Discharging</span>
                </div>
                <div className="sim-rep-row">
                  <span>Life Support Modules</span>
                  <span>100% Nominal</span>
                  <span>100% Protected</span>
                  <span className="text-green">Secure</span>
                </div>
                <div className="sim-rep-row">
                  <span>Non-Essential Science Labs</span>
                  <span>Active</span>
                  <span>Automatic Load Shed</span>
                  <span className="text-amber">Shedded</span>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button className="btn-modal-primary" onClick={onClose}>Export PDF Report</button>
                <button className="btn-modal-secondary" onClick={onClose}>Close</button>
              </div>
            </div>
          )}

          {type === 'FORECAST' && (
            <div className="modal-forecast-view">
              <div className="forecast-timeline-grid">
                {[
                  { time: '00:00', temp: '-19°C', wind: '26 km/h', cond: 'Light Snow' },
                  { time: '06:00', temp: '-22°C', wind: '32 km/h', cond: 'Blowing Snow' },
                  { time: '12:00', temp: '-18.7°C', wind: '28 km/h', cond: 'Light Snow' },
                  { time: '18:00', temp: '-24°C', wind: '45 km/h', cond: 'Blizzard Alert' },
                  { time: 'Tomorrow', temp: '-28°C', wind: '62 km/h', cond: 'Severe Storm' },
                ].map((f, i) => (
                  <div key={i} className="f-item-card">
                    <span className="f-time mono-num">{f.time}</span>
                    <span className="f-temp mono-num">{f.temp}</span>
                    <span className="f-wind">{f.wind}</span>
                    <span className="f-cond">{f.cond}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
