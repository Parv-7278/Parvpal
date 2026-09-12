import React, { useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Zap, 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  FileText,
  BarChart3,
  Flame,
  BatteryCharging,
  Maximize2
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { useModal } from '../context/ModalContext';

export default function DetailModal(props) {
  const modalContext = useModal();
  const { currentTelemetry, isSimulatorOnline, selectedStation } = useTelemetry();

  const isOpen = props.isOpen !== undefined ? props.isOpen : modalContext.modalState?.isOpen;
  const onClose = props.onClose || modalContext.closeModal;
  const state = props.modalState || modalContext.modalState || {};

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const {
    title = 'Detailed Diagnostics',
    type = 'DRILL_DOWN',
    category = 'TELEMETRY',
    metricKey,
    currentValue: initialValue,
    unit = '',
    status: initialStatus = 'NORMAL',
    historicalData = [],
    stats,
    thresholds,
    interpretation,
    recommendation,
    metadata,
    station: stationName = selectedStation === 'station-bharati' ? 'Bharati Station' : 'Maitri Station',
    data,
  } = state;

  // Real-time live value binding from WebSocket telemetry if metricKey matches
  let liveValue = initialValue;
  let liveStatus = initialStatus;

  if (metricKey && currentTelemetry) {
    if (metricKey === 'temperature' && currentTelemetry.temperature !== undefined) {
      liveValue = currentTelemetry.temperature;
    } else if (metricKey === 'generator_temperature' && currentTelemetry.generator_temperature !== undefined) {
      liveValue = currentTelemetry.generator_temperature;
      if (liveValue >= 95.0) liveStatus = 'CRITICAL';
      else if (liveValue >= 85.0) liveStatus = 'WARNING';
      else liveStatus = 'NORMAL';
    } else if (metricKey === 'battery_level' && (currentTelemetry.battery_level !== undefined || currentTelemetry.battery !== undefined)) {
      liveValue = currentTelemetry.battery_level ?? currentTelemetry.battery;
    } else if (metricKey === 'power_consumption' && currentTelemetry.power_consumption !== undefined) {
      liveValue = currentTelemetry.power_consumption;
    } else if (metricKey === 'power_generation' && currentTelemetry.power_generation !== undefined) {
      liveValue = currentTelemetry.power_generation;
    } else if (metricKey === 'wind_speed' && currentTelemetry.wind_speed !== undefined) {
      liveValue = currentTelemetry.wind_speed;
    } else if (metricKey === 'water_level' && currentTelemetry.water_level !== undefined) {
      liveValue = currentTelemetry.water_level;
    }
  }

  // Format historical graph SVG paths
  const chartPoints = useMemo(() => {
    if (historicalData && historicalData.length > 0) {
      return historicalData;
    }
    // Default fallback baseline series
    const baseVal = typeof liveValue === 'number' ? liveValue : 50;
    return [
      { time: '00:00', val: +(baseVal - 1.8).toFixed(1) },
      { time: '03:00', val: +(baseVal - 2.4).toFixed(1) },
      { time: '06:00', val: +(baseVal - 1.2).toFixed(1) },
      { time: '09:00', val: +(baseVal + 0.6).toFixed(1) },
      { time: '12:00', val: +(baseVal + 1.4).toFixed(1) },
      { time: '15:00', val: +(baseVal + 0.8).toFixed(1) },
      { time: '18:00', val: +(baseVal - 0.5).toFixed(1) },
      { time: 'Now', val: +(baseVal).toFixed(1) },
    ];
  }, [historicalData, liveValue]);

  // Compute SVG Area Path for Historical Graph
  const svgW = 540;
  const svgH = 140;
  const padX = 35;
  const padY = 20;
  const plotW = svgW - padX * 2;
  const plotH = svgH - padY * 2;

  const vals = chartPoints.map((p) => p.val);
  const minVal = Math.min(...vals, (stats?.min ? parseFloat(stats.min) : Infinity));
  const maxVal = Math.max(...vals, (stats?.max ? parseFloat(stats.max) : -Infinity));
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const coords = chartPoints.map((pt, i) => {
    const x = padX + (i / (chartPoints.length - 1)) * plotW;
    const y = padY + (1 - (pt.val - minVal) / range) * plotH;
    return { x, y, pt };
  });

  const pathD = coords.reduce((acc, c, i) => {
    if (i === 0) return `M ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
    const prev = coords[i - 1];
    const mx = (prev.x + c.x) / 2;
    return `${acc} C ${mx.toFixed(1)},${prev.y.toFixed(1)} ${mx.toFixed(1)},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
  }, '');

  const areaD = coords.length > 0 
    ? `${pathD} L ${coords[coords.length - 1].x.toFixed(1)},${svgH - padY} L ${coords[0].x.toFixed(1)},${svgH - padY} Z`
    : '';

  const statusColorClass = liveStatus === 'CRITICAL' || liveStatus === 'OVERHEAT'
    ? 'status-critical'
    : liveStatus === 'WARNING'
    ? 'status-warning'
    : 'status-optimal';

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-dialog-card polaris-card drilldown-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="drilldown-header-bar">
          <div className="drilldown-header-left">
            <span className="drilldown-category-badge">{category.toUpperCase()}</span>
            <div className="drilldown-title-group">
              <h3 className="drilldown-main-title">{title}</h3>
              <span className="drilldown-station-name">{stationName}</span>
            </div>
          </div>

          <div className="drilldown-header-right">
            <div className={`drilldown-live-beacon ${isSimulatorOnline ? 'online' : 'offline'}`}>
              <span className="live-dot" />
              <span>{isSimulatorOnline ? 'LIVE TELEMETRY LINK' : 'REAL-TIME LINK DISCONNECTED'}</span>
            </div>
            <button className="drilldown-close-btn" onClick={onClose} title="Close (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="drilldown-body-content">
          
          {/* ================================================================
              MODE 1: GENERIC & DETAILED PARAMETER DRILL-DOWN VIEW
              ================================================================ */}
          {type === 'DRILL_DOWN' && (
            <div className="drilldown-parameter-view">
              
              {/* Top Hero Metric Row */}
              <div className="drilldown-hero-row">
                <div className="drilldown-hero-val-box">
                  <span className="drilldown-hero-number mono-num">
                    {liveValue !== null && liveValue !== undefined ? liveValue : '--'}
                  </span>
                  <span className="drilldown-hero-unit">{unit}</span>
                </div>

                <div className="drilldown-hero-status-box">
                  <span className={`drilldown-status-pill ${statusColorClass}`}>
                    {liveStatus}
                  </span>
                  <span className="drilldown-last-sync">
                    <Clock size={12} className="text-dim" />
                    <span>Last Updated: {new Date().toLocaleTimeString()}</span>
                  </span>
                </div>
              </div>

              {/* Historical Trend Chart Box */}
              <div className="drilldown-chart-section">
                <div className="drilldown-chart-header">
                  <span className="drilldown-chart-title">24-Hour Telemetry Trend Waveform</span>
                  <div className="drilldown-chart-legend">
                    <span className="legend-dot" /> Sensor Stream
                  </div>
                </div>

                <div className="drilldown-svg-chart-wrap">
                  <svg viewBox={`0 0 ${svgW} ${svgH}`} className="drilldown-waveform-svg">
                    <defs>
                      <linearGradient id="drilldownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {[0.2, 0.5, 0.8].map((ratio, idx) => (
                      <line
                        key={idx}
                        x1={padX}
                        y1={padY + ratio * plotH}
                        x2={svgW - padX}
                        y2={padY + ratio * plotH}
                        stroke="rgba(56, 189, 248, 0.15)"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Area fill */}
                    {areaD && <path d={areaD} fill="url(#drilldownGrad)" />}
                    {/* Spline line */}
                    {pathD && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))' }}
                      />
                    )}

                    {/* Data Points */}
                    {coords.map((c, i) => (
                      <g key={i}>
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={i === coords.length - 1 ? 4.5 : 2.5}
                          fill={i === coords.length - 1 ? '#38bdf8' : '#ffffff'}
                          stroke={i === coords.length - 1 ? '#ffffff' : '#0284c7'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={c.x}
                          y={svgH - 4}
                          fill="#64748b"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {c.pt.time}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Statistical Boundaries & Thresholds Grid */}
              <div className="drilldown-stats-grid">
                <div className="stat-card-item">
                  <span className="stat-lbl">MIN RECORDED</span>
                  <span className="stat-num mono-num">{stats?.min || `${(minVal).toFixed(1)} ${unit}`}</span>
                </div>
                <div className="stat-card-item">
                  <span className="stat-lbl">24H AVERAGE</span>
                  <span className="stat-num mono-num">{stats?.avg || `${((minVal + maxVal) / 2).toFixed(1)} ${unit}`}</span>
                </div>
                <div className="stat-card-item">
                  <span className="stat-lbl">MAX PEAK</span>
                  <span className="stat-num mono-num">{stats?.max || `${(maxVal).toFixed(1)} ${unit}`}</span>
                </div>
                <div className="stat-card-item">
                  <span className="stat-lbl">WARNING THRESHOLD</span>
                  <span className="stat-num mono-num text-amber">{thresholds?.warning || 'Threshold Nominal'}</span>
                </div>
                <div className="stat-card-item">
                  <span className="stat-lbl">CRITICAL TRIP LIMIT</span>
                  <span className="stat-num mono-num text-red">{thresholds?.critical || 'Non-Critical'}</span>
                </div>
                <div className="stat-card-item">
                  <span className="stat-lbl">SAMPLING FREQUENCY</span>
                  <span className="stat-num mono-num text-cyan">1.5 Hz (Continuous)</span>
                </div>
              </div>

              {/* Engineering Analysis & Recommendation Callout */}
              <div className="drilldown-analysis-box">
                <div className="analysis-header-row">
                  <Sparkles size={14} className="text-cyan" />
                  <span className="analysis-title">Digital Twin System Interpretation</span>
                </div>
                <p className="analysis-text">
                  {interpretation || 
                    `Telemetry for ${title} on ${stationName} is performing within expected environmental boundaries. Digital Twin predictive models project stable performance over the next 48-hour mission cycle.`}
                </p>
                {recommendation && (
                  <div className="analysis-rec-sub">
                    <strong>Recommended Action:</strong> {recommendation}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="drilldown-actions-bar">
                <button type="button" className="btn-drilldown-primary" onClick={onClose}>
                  Acknowledge & Close
                </button>
                <button type="button" className="btn-drilldown-secondary" onClick={() => window.print()}>
                  Export Parameter Log (.PDF)
                </button>
              </div>

            </div>
          )}

          {/* ================================================================
              MODE 2: LEGACY / SPECIALIZED MODES (ALERTS, INSIGHTS, SIMULATIONS, FORECAST)
              ================================================================ */}
          {type === 'ALERT_VIEW_ALL' && (
            <div className="modal-alerts-list">
              <div className="modal-alert-item critical">
                <div className="m-alert-header">
                  <span className="m-tag critical">CRITICAL</span>
                  <span className="m-time mono-num">14:20 IST</span>
                </div>
                <h4 className="m-alert-title">🚨 Generator G-01 Overheat (Maitri Station)</h4>
                <p className="m-alert-desc">Core stator temperature reached 95°C. Critical threshold breached. Risk of emergency shutdown.</p>
                <div className="m-alert-actions">
                  <button className="btn-drilldown-primary" onClick={onClose}>Acknowledge & Dispatch Response</button>
                  <button className="btn-drilldown-secondary" onClick={onClose}>Switch to Generator 2</button>
                </div>
              </div>

              <div className="modal-alert-item warning">
                <div className="m-alert-header">
                  <span className="m-tag warning">WARNING</span>
                  <span className="m-time mono-num">13:45 IST</span>
                </div>
                <h4 className="m-alert-title">Katabatic Wind Warning - Schirmacher Oasis</h4>
                <p className="m-alert-desc">Sustained gusts reaching 78 km/h. Outer solar tracking array locked to horizontal storm profile.</p>
                <div className="m-alert-actions">
                  <button className="btn-drilldown-primary" onClick={onClose}>Acknowledge</button>
                </div>
              </div>
            </div>
          )}

          {type === 'INSIGHT_DETAIL' && data && (
            <div className="modal-insight-detail">
              <div className="insight-stat-banner">
                <div className="i-stat">
                  <span className="i-label">Risk Probability</span>
                  <span className="i-val text-red mono-num">{data.riskLevel || '84% Probability'}</span>
                </div>
                <div className="i-stat">
                  <span className="i-label">Estimated Failure Window</span>
                  <span className="i-val text-amber mono-num">{data.window || '4-8 Hours'}</span>
                </div>
              </div>

              <div className="recommendation-callout">
                <h4 className="rec-title">AI Actionable Recommendation:</h4>
                <p className="rec-body">{data.recommendation || 'Initiate load shedding to reduce thermal strain on primary inverter.'}</p>
              </div>

              <div className="drilldown-actions-bar">
                <button className="btn-drilldown-primary" onClick={onClose}>Apply Recommended Mitigation</button>
                <button className="btn-drilldown-secondary" onClick={onClose}>Dismiss</button>
              </div>
            </div>
          )}

          {type === 'SIMULATION_REPORT' && data && (
            <div className="modal-simulation-report">
              <div className="sim-summary-box">
                <h4>Scenario: {data.label || 'Generator Failure Dynamic Stress Test'}</h4>
                <p>Digital Twin dynamic failure simulation projected against active Antarctic baseline.</p>
              </div>

              <div className="sim-report-table">
                <div className="sim-rep-row header">
                  <span>Subsystem</span>
                  <span>Baseline</span>
                  <span>Simulated State</span>
                  <span>Status</span>
                </div>
                <div className="sim-rep-row">
                  <span>Diesel Generator G-01</span>
                  <span>70 kW</span>
                  <span>108 kW (Overload)</span>
                  <span className="text-amber">Warning</span>
                </div>
                <div className="sim-rep-row">
                  <span>BESS Battery Storage</span>
                  <span>98% SoC</span>
                  <span>58% SoC in 6h</span>
                  <span className="text-cyan">Discharging</span>
                </div>
                <div className="sim-rep-row">
                  <span>Life Support Modules</span>
                  <span>Nominal</span>
                  <span>100% Protected</span>
                  <span className="text-green">Secure</span>
                </div>
              </div>

              <div className="drilldown-actions-bar">
                <button className="btn-drilldown-primary" onClick={onClose}>Export Simulation Report</button>
                <button className="btn-drilldown-secondary" onClick={onClose}>Close</button>
              </div>
            </div>
          )}

          {type === 'FORECAST' && (
            <div className="modal-forecast-view">
              <div className="forecast-timeline-grid">
                {[
                  { time: '00:00', temp: '-19.4°C', wind: '22 km/h', cond: 'Light Snow' },
                  { time: '06:00', temp: '-21.8°C', wind: '34 km/h', cond: 'Blowing Snow' },
                  { time: '12:00', temp: '-18.7°C', wind: '28 km/h', cond: 'Light Snow' },
                  { time: '18:00', temp: '-23.5°C', wind: '48 km/h', cond: 'Katabatic Drift' },
                  { time: 'Tomorrow', temp: '-26.0°C', wind: '65 km/h', cond: 'Blizzard Warning' },
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
