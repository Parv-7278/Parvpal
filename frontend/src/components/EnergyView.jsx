import React, { useState } from 'react';
import { 
  Building2, 
  Zap, 
  Package, 
  Mountain, 
  Wrench, 
  Radio, 
  Bell, 
  Bot, 
  CloudSnow, 
  Wind, 
  Compass, 
  Droplets, 
  Gauge, 
  Eye, 
  Clock, 
  Sun, 
  Fuel, 
  BatteryCharging, 
  ChevronRight, 
  AlertTriangle, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Download, 
  BarChart3, 
  Cpu, 
  Check
} from 'lucide-react';
import { STATIONS_DATA } from '../data/stationsData';

export default function EnergyView({ 
  selectedStation = 'station-maitri', 
  onOpenAlerts,
  onOpenReport 
}) {
  const [breakdownPeriod, setBreakdownPeriod] = useState('today'); // 'today' | '7days' | '30days'
  const [forecastPeriod, setForecastPeriod] = useState('7days'); // '7days' | '30days'
  const [insightModalOpen, setInsightModalOpen] = useState(false);

  const stationData = STATIONS_DATA[selectedStation] || STATIONS_DATA['station-maitri'];
  const energy = stationData.energy;
  const weather = stationData.weather;
  const energyStatus = stationData.energyStatus || { score: 84, rating: 'Good', subsystems: [] };
  const aiInsights = stationData.aiInsights || {
    summary: 'Energy telemetry nominal.',
    recommendations: ['Monitor primary generation sources.', 'Maintain battery storage reserves.']
  };

  const isBharati = selectedStation === 'station-bharati';

  // Subsystem icons mapper
  const getSubsystemIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('gen') || l.includes('chp')) return Zap;
    if (l.includes('load') || l.includes('cons')) return Activity;
    if (l.includes('batt') || l.includes('bess')) return BatteryCharging;
    if (l.includes('fuel')) return Fuel;
    if (l.includes('solar')) return Sun;
    if (l.includes('wind')) return Wind;
    return Zap;
  };

  return (
    <div className="energy-view-layout">
      {/* ====================================================================
          LEFT SIDEBAR: Station Identity Card + Weather + Local Time
          ==================================================================== */}
      <aside className="energy-left-sidebar">
        {/* Station Identity Card */}
        <div className="energy-station-card polaris-card">
          <div className="energy-station-thumb">
            <img src={stationData.heroImage} alt={stationData.name} className="st-thumb-img" />
            <div className="thumb-scanline" />
          </div>
          <div className="energy-station-meta">
            <h3 className="st-name-title">{stationData.fullName ? stationData.fullName.toUpperCase() : `${stationData.name} STATION`}</h3>
            <div className="st-coords-text mono-num">{stationData.coords}</div>
            <div className="st-oasis-text">{stationData.region}</div>
            <div className="st-status-row">
              <span className="live-dot" />
              <span>{stationData.status}</span>
            </div>
          </div>
        </div>

        {/* Weather Overview Widget */}
        <div className="energy-weather-card polaris-card">
          <div className="e-weather-header">
            <div className="e-weather-cloud">
              <svg viewBox="0 0 40 30" width="34" height="26" fill="none">
                <circle cx="12" cy="10" r="6" fill="#facc15" fillOpacity="0.8" />
                <path d="M28 14C27.5 9 22 6 17 8C12 6 6 10 7 15C3 17 2 23 7 25C9 26 30 26 31 25C35 24 36 17 31 15C30 14.5 29 14 28 14Z" fill="#38bdf8" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="e-weather-temp-wrap">
              <span className="e-temp-num mono-num">{weather.temp}{weather.unit}</span>
              <span className="e-temp-cond">{weather.condition}</span>
            </div>
          </div>

          <div className="e-weather-details-list">
            <div className="e-w-row">
              <span className="e-w-lbl"><Wind size={11} /> Wind Speed</span>
              <span className="e-w-val mono-num">{weather.windSpeed}</span>
            </div>
            <div className="e-w-row">
              <span className="e-w-lbl"><Compass size={11} /> Wind Direction</span>
              <span className="e-w-val mono-num">{weather.windDir}</span>
            </div>
            <div className="e-w-row">
              <span className="e-w-lbl"><Droplets size={11} /> Humidity</span>
              <span className="e-w-val mono-num">{weather.humidity}</span>
            </div>
            <div className="e-w-row">
              <span className="e-w-lbl"><Gauge size={11} /> Pressure</span>
              <span className="e-w-val mono-num">{weather.pressure}</span>
            </div>
            <div className="e-w-row">
              <span className="e-w-lbl"><Eye size={11} /> Visibility</span>
              <span className="e-w-val mono-num">{weather.visibility}</span>
            </div>
          </div>
        </div>

        {/* Local Time Widget */}
        <div className="energy-time-card polaris-card">
          <div className="e-time-hdr">
            <Clock size={12} className="text-cyan" />
            <span>Local Time ({stationData.name})</span>
          </div>
          <div className="e-time-digits mono-num">{weather.localTime}</div>
          <div className="e-time-date">{weather.date}</div>
          <div className="e-time-system-status">
            <span className="live-dot" />
            <span>System Operational</span>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          CENTER MAIN CONTENT: Energy Management Dashboard
          ==================================================================== */}
      <section className="energy-center-section">
        {/* Top Title Bar & Metric Badges */}
        <div className="energy-header-banner">
          <div className="banner-title-block">
            <h2 className="banner-heading">Energy Management – {stationData.name}</h2>
            <p className="banner-sub">Monitor real-time microgrid power generation, load distribution and storage reserves.</p>
          </div>

          <div className="banner-metrics-cluster">
            <div className="banner-metric-pill gen-pill">
              <div className="pill-icon-box green-box"><Zap size={13} /></div>
              <div className="pill-meta">
                <span className="pill-lbl">Total Generation</span>
                <span className="pill-val mono-num">{energy.generation} kW</span>
              </div>
            </div>

            <div className="banner-metric-pill cons-pill">
              <div className="pill-icon-box blue-box"><Activity size={13} /></div>
              <div className="pill-meta">
                <span className="pill-lbl">Total Consumption</span>
                <span className="pill-val mono-num">{energy.consumption} kW</span>
              </div>
            </div>

            <div className="banner-metric-pill batt-pill">
              <div className="pill-icon-box green-box"><BatteryCharging size={13} /></div>
              <div className="pill-meta">
                <span className="pill-lbl">Battery Charge</span>
                <span className="pill-val mono-num">{energy.batteryPercent}%</span>
              </div>
            </div>

            <button 
              className="forecast-quick-btn"
              onClick={() => onOpenReport && onOpenReport({ label: `7-Day Polar Energy Forecast (${stationData.name})` })}
            >
              <Zap size={13} />
              <span>Energy Forecast</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Top Grid: Power Generation & Consumption Curve + Generation Sources */}
        <div className="energy-top-row-grid">
          {/* Card 1: Power Generation & Consumption */}
          <div className="energy-gen-cons-card polaris-card">
            <div className="card-header-with-action">
              <div className="hdr-title-with-pill">
                <span className="card-title">Power Generation & Consumption</span>
                <span className="live-pill-badge"><span className="live-dot" /> Live</span>
              </div>
              <div className="chart-legend-simple">
                <span className="leg-item"><span className="leg-dot green-dot" /> Generation</span>
                <span className="leg-item"><span className="leg-dot blue-dot" /> Consumption</span>
              </div>
            </div>

            <div className="gen-cons-body-grid">
              {/* Left Line Chart */}
              <div className="gen-cons-chart-wrap">
                <svg viewBox="0 0 380 150" className="gen-cons-svg">
                  {/* Grid Lines */}
                  <line x1="35" y1="20" x2="375" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="35" y1="50" x2="375" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="35" y1="80" x2="375" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <line x1="35" y1="110" x2="375" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                  {/* Y-Axis Labels */}
                  <text x="30" y="24" fill="#64748b" fontSize="7.5" textAnchor="end" className="mono-num">{isBharati ? '250' : '200'}</text>
                  <text x="30" y="54" fill="#64748b" fontSize="7.5" textAnchor="end" className="mono-num">{isBharati ? '200' : '150'}</text>
                  <text x="30" y="84" fill="#64748b" fontSize="7.5" textAnchor="end" className="mono-num">{isBharati ? '150' : '100'}</text>
                  <text x="30" y="114" fill="#64748b" fontSize="7.5" textAnchor="end" className="mono-num">{isBharati ? '75' : '50'}</text>
                  <text x="30" y="138" fill="#64748b" fontSize="7.5" textAnchor="end" className="mono-num">0</text>
                  <text x="35" y="10" fill="#475569" fontSize="6.5">Power (kW)</text>

                  {/* Consumption Curve (Blue) */}
                  <path
                    d={isBharati 
                      ? "M 40,76 Q 85,82 130,75 T 220,68 T 310,62 T 375,58"
                      : "M 40,86 Q 85,94 130,88 T 220,80 T 310,74 T 375,70"}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.2"
                  />
                  {/* Consumption Data Points */}
                  <circle cx="40" cy={isBharati ? 76 : 86} r="2.5" fill="#0284c7" />
                  <circle cx="95" cy={isBharati ? 80 : 92} r="2.5" fill="#0284c7" />
                  <circle cx="150" cy={isBharati ? 74 : 85} r="2.5" fill="#0284c7" />
                  <circle cx="205" cy={isBharati ? 70 : 82} r="2.5" fill="#0284c7" />
                  <circle cx="260" cy={isBharati ? 66 : 78} r="2.5" fill="#0284c7" />
                  <circle cx="315" cy={isBharati ? 62 : 74} r="2.5" fill="#0284c7" />
                  <circle cx="370" cy={isBharati ? 58 : 70} r="2.5" fill="#0284c7" />

                  {/* Generation Curve (Green) */}
                  <path
                    d={isBharati 
                      ? "M 40,64 Q 85,58 130,60 T 220,48 T 310,50 T 375,38"
                      : "M 40,78 Q 85,72 130,76 T 220,64 T 310,68 T 375,52"}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                  />
                  {/* Generation Data Points */}
                  <circle cx="40" cy={isBharati ? 64 : 78} r="2.5" fill="#10b981" />
                  <circle cx="95" cy={isBharati ? 59 : 73} r="2.5" fill="#10b981" />
                  <circle cx="150" cy={isBharati ? 60 : 75} r="2.5" fill="#10b981" />
                  <circle cx="205" cy={isBharati ? 50 : 65} r="2.5" fill="#10b981" />
                  <circle cx="260" cy={isBharati ? 53 : 71} r="2.5" fill="#10b981" />
                  <circle cx="315" cy={isBharati ? 49 : 67} r="2.5" fill="#10b981" />
                  <circle cx="370" cy={isBharati ? 38 : 52} r="3" fill="#ffffff" stroke="#10b981" strokeWidth="2" />

                  {/* X-Axis Horizontal Base Line */}
                  <line x1="35" y1="135" x2="375" y2="135" stroke="rgba(255,255,255,0.1)" />

                  {/* X-Axis Time Ticks */}
                  <text x="40" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">00:00</text>
                  <text x="95" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">04:00</text>
                  <text x="150" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">08:00</text>
                  <text x="205" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">12:00</text>
                  <text x="260" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">16:00</text>
                  <text x="315" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">20:00</text>
                  <text x="370" y="146" fill="#64748b" fontSize="7" textAnchor="middle" className="mono-num">24:00</text>
                </svg>
              </div>

              {/* Right Donut Load */}
              <div className="current-load-donut-wrap">
                <span className="load-title-lbl">Current Load</span>
                <div className="donut-and-breakdown">
                  {/* SVG Doughnut */}
                  <div className="donut-relative-box">
                    <svg width="86" height="86" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(30,58,95,0.3)" strokeWidth="11" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0284c7" strokeWidth="11" strokeDasharray="100 138" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="11" strokeDasharray="43 195" strokeDashoffset="-100" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="11" strokeDasharray="36 202" strokeDashoffset="-143" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray="19 219" strokeDashoffset="-179" transform="rotate(-90 50 50)" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="11" strokeDasharray="40 198" strokeDashoffset="-198" transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="donut-center-txt">
                      <span className="donut-val mono-num">{energy.consumption} <span className="d-unit">kW</span></span>
                      <span className="donut-sub">Total Consumption</span>
                    </div>
                  </div>

                  {/* Load Labels */}
                  <div className="load-categories-list">
                    {energy.breakdown.map((item, idx) => (
                      <div key={idx} className="load-cat-row">
                        <span className="cat-dot" style={{ backgroundColor: item.color }} />
                        <span className="cat-name">{item.name}</span>
                        <span className="cat-pct mono-num">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Generation Sources Grid */}
          <div className="energy-sources-card polaris-card">
            <div className="card-header-simple">
              <span className="card-title">Generation Sources ({stationData.name})</span>
            </div>

            <div className="sources-four-grid">
              {/* Source 1 */}
              <div className="source-item-box">
                <div className="source-top-line">
                  <div className="src-icon-name">
                    <Cpu size={14} className="text-cyan" />
                    <span className="src-title">{energy.sources.gen1.name}</span>
                  </div>
                  <span className="src-status"><span className="live-dot" /> {energy.sources.gen1.status}</span>
                </div>
                <div className="src-output-row">
                  <span className="src-out-main mono-num">{energy.sources.gen1.current} kW <span className="src-out-max">/ {energy.sources.gen1.max} kW</span></span>
                </div>
                <div className="src-bar-track">
                  <div className="src-bar-fill green-fill" style={{ width: `${energy.sources.gen1.loadPct}%` }} />
                </div>
                <div className="src-footer-info">
                  <span className="src-load-txt">{energy.sources.gen1.loadPct}% Load</span>
                  <span className="src-runtime mono-num">Runtime: {energy.sources.gen1.runtime}</span>
                </div>
              </div>

              {/* Source 2 */}
              <div className="source-item-box">
                <div className="source-top-line">
                  <div className="src-icon-name">
                    <Cpu size={14} className="text-cyan" />
                    <span className="src-title">{energy.sources.gen2.name}</span>
                  </div>
                  <span className="src-status"><span className="live-dot" /> {energy.sources.gen2.status}</span>
                </div>
                <div className="src-output-row">
                  <span className="src-out-main mono-num">{energy.sources.gen2.current} kW <span className="src-out-max">/ {energy.sources.gen2.max} kW</span></span>
                </div>
                <div className="src-bar-track">
                  <div className="src-bar-fill green-fill" style={{ width: `${energy.sources.gen2.loadPct}%` }} />
                </div>
                <div className="src-footer-info">
                  <span className="src-load-txt">{energy.sources.gen2.loadPct}% Load</span>
                  <span className="src-runtime mono-num">Runtime: {energy.sources.gen2.runtime}</span>
                </div>
              </div>

              {/* Source 3: Solar */}
              <div className="source-item-box">
                <div className="source-top-line">
                  <div className="src-icon-name">
                    <Sun size={14} className="text-amber" />
                    <span className="src-title">{energy.sources.solar.name}</span>
                  </div>
                  <span className="src-status"><span className="live-dot" /> {energy.sources.solar.status}</span>
                </div>
                <div className="src-output-row">
                  <span className="src-out-main mono-num">{energy.sources.solar.current} kW <span className="src-out-max">/ {energy.sources.solar.max} kW</span></span>
                </div>
                <div className="src-bar-track">
                  <div className="src-bar-fill cyan-fill" style={{ width: `${energy.sources.solar.loadPct}%` }} />
                </div>
                <div className="src-footer-info">
                  <span className="src-load-txt">{energy.sources.solar.loadPct}% Load</span>
                  <span className="src-runtime mono-num">{energy.sources.solar.runtime}</span>
                </div>
              </div>

              {/* Source 4: Wind */}
              <div className="source-item-box">
                <div className="source-top-line">
                  <div className="src-icon-name">
                    <Wind size={14} className="text-cyan" />
                    <span className="src-title">{energy.sources.wind.name}</span>
                  </div>
                  <span className="src-status"><span className="live-dot" /> {energy.sources.wind.status}</span>
                </div>
                <div className="src-output-row">
                  <span className="src-out-main mono-num">{energy.sources.wind.current} kW <span className="src-out-max">/ {energy.sources.wind.max} kW</span></span>
                </div>
                <div className="src-bar-track">
                  <div className="src-bar-fill cyan-fill" style={{ width: `${energy.sources.wind.loadPct}%` }} />
                </div>
                <div className="src-footer-info">
                  <span className="src-load-txt">{energy.sources.wind.loadPct}% Load</span>
                  <span className="src-runtime mono-num">{energy.sources.wind.runtime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Grid: 3 Cards (Breakdown, Battery, Fuel) */}
        <div className="energy-middle-row-grid">
          {/* Card 1: Energy Consumption Breakdown */}
          <div className="e-breakdown-card polaris-card">
            <div className="card-header-with-action">
              <span className="card-title">Energy Consumption Breakdown</span>
              <div className="period-pill-switch">
                <button 
                  className={`p-pill-btn ${breakdownPeriod === 'today' ? 'active' : ''}`}
                  onClick={() => setBreakdownPeriod('today')}
                >
                  Today
                </button>
                <button 
                  className={`p-pill-btn ${breakdownPeriod === '7days' ? 'active' : ''}`}
                  onClick={() => setBreakdownPeriod('7days')}
                >
                  7 Days
                </button>
                <button 
                  className={`p-pill-btn ${breakdownPeriod === '30days' ? 'active' : ''}`}
                  onClick={() => setBreakdownPeriod('30days')}
                >
                  30 Days
                </button>
              </div>
            </div>

            <div className="breakdown-content-flex">
              <div className="bd-donut-wrap">
                <svg width="84" height="84" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(30,58,95,0.3)" strokeWidth="11" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0284c7" strokeWidth="11" strokeDasharray="100 138" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="11" strokeDasharray="43 195" strokeDashoffset="-100" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="11" strokeDasharray="36 202" strokeDashoffset="-143" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray="19 219" strokeDashoffset="-179" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="11" strokeDasharray="40 198" strokeDashoffset="-198" transform="rotate(-90 50 50)" />
                </svg>
                <div className="bd-center-label">
                  <span className="bd-c-val mono-num">{energy.consumption} <span className="d-unit">kW</span></span>
                  <span className="bd-c-sub">Total Consumption</span>
                </div>
              </div>

              <div className="bd-details-rows">
                {energy.breakdown.map((bItem, bIdx) => (
                  <div key={bIdx} className="bd-row">
                    <div className="bd-cat">
                      <span className="cat-dot" style={{ backgroundColor: bItem.color }} /> {bItem.name}
                    </div>
                    <span className="bd-val mono-num">{bItem.kw} kW ({bItem.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Battery Storage */}
          <div className="e-battery-card polaris-card">
            <div className="card-header-with-action">
              <span className="card-title">Battery Storage (BESS)</span>
              <span className="live-pill-badge"><span className="live-dot" /> Live</span>
            </div>

            <div className="battery-hero-stats">
              <div className="b-hero-left">
                <div className="b-icon-box">
                  <BatteryCharging size={18} className="text-green" />
                </div>
                <div className="b-pct-meta">
                  <span className="b-pct-num mono-num">{energy.batteryPercent}%</span>
                  <span className="b-pct-lbl">Charge Level</span>
                </div>
              </div>

              <div className="b-hero-right">
                <div className="b-spec-col">
                  <span className="b-spec-lbl">Current Charge</span>
                  <span className="b-spec-val mono-num">{energy.batteryChargeKWh}</span>
                </div>
                <div className="b-spec-col">
                  <span className="b-spec-lbl">Capacity</span>
                  <span className="b-spec-val mono-num">{energy.batteryCapacityKWh}</span>
                </div>
              </div>
            </div>

            <div className="battery-chart-box">
              <svg viewBox="0 0 260 75" className="battery-svg">
                <defs>
                  <linearGradient id="battGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="25" y1="12" x2="255" y2="12" stroke="rgba(255,255,255,0.05)" />
                <line x1="25" y1="36" x2="255" y2="36" stroke="rgba(255,255,255,0.05)" />
                <line x1="25" y1="60" x2="255" y2="60" stroke="rgba(255,255,255,0.05)" />

                <text x="20" y="15" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">100</text>
                <text x="20" y="39" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">75</text>
                <text x="20" y="63" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">50</text>

                <polygon points="30,42 65,38 100,40 135,33 170,30 205,32 250,28 250,60 30,60" fill="url(#battGrad)" />
                <path d="M 30,42 L 65,38 L 100,40 L 135,33 L 170,30 L 205,32 L 250,28" fill="none" stroke="#10b981" strokeWidth="1.8" />
                <circle cx="250" cy="28" r="2.5" fill="#10b981" />

                <text x="30" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">00:00</text>
                <text x="74" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">04:00</text>
                <text x="118" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">08:00</text>
                <text x="162" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">12:00</text>
                <text x="206" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">16:00</text>
                <text x="250" y="70" fill="#64748b" fontSize="6" textAnchor="middle" className="mono-num">24:00</text>
              </svg>
            </div>
          </div>

          {/* Card 3: Fuel Storage */}
          <div className="e-fuel-card polaris-card">
            <div className="card-header-with-action">
              <span className="card-title">Fuel Storage & Reserve</span>
              <span className="live-pill-badge"><span className="live-dot" /> Live</span>
            </div>

            <div className="fuel-hero-stats">
              <div className="f-hero-left">
                <div className="f-icon-box">
                  <Fuel size={18} className="text-amber" />
                </div>
                <div className="f-pct-meta">
                  <span className="f-days-num mono-num">{energy.fuelDays}</span>
                  <span className="f-days-lbl">Estimated Remaining</span>
                </div>
              </div>

              <div className="f-hero-right">
                <div className="f-spec-col">
                  <span className="f-spec-lbl">Total Fuel</span>
                  <span className="f-spec-val mono-num">{energy.fuelLiters}</span>
                </div>
                <div className="f-spec-col">
                  <span className="f-spec-lbl">Daily Usage</span>
                  <span className="f-spec-val mono-num">{energy.dailyUsageL}</span>
                </div>
              </div>
            </div>

            <div className="fuel-progress-row">
              <div className="fuel-bar-track">
                <div className="fuel-bar-fill" style={{ width: `${energy.fuelBarPercent}%` }} />
              </div>
              <span className="fuel-bar-pct mono-num">{energy.fuelBarPercent}%</span>
            </div>

            <div className="fuel-trend-box">
              <span className="f-trend-sub-lbl">Fuel Consumption Trend</span>
              <svg viewBox="0 0 260 55" className="fuel-svg">
                <line x1="20" y1="12" x2="255" y2="12" stroke="rgba(255,255,255,0.05)" />
                <line x1="20" y1="28" x2="255" y2="28" stroke="rgba(255,255,255,0.05)" />
                <line x1="20" y1="44" x2="255" y2="44" stroke="rgba(255,255,255,0.05)" />

                <text x="16" y="14" fill="#64748b" fontSize="5.5" textAnchor="end" className="mono-num">2.0k</text>
                <text x="16" y="30" fill="#64748b" fontSize="5.5" textAnchor="end" className="mono-num">1.5k</text>
                <text x="16" y="46" fill="#64748b" fontSize="5.5" textAnchor="end" className="mono-num">1.0k</text>

                <path d="M 25,24 L 75,20 L 125,32 L 175,34" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
                <circle cx="25" cy="24" r="2" fill="#f59e0b" />
                <circle cx="75" cy="20" r="2" fill="#f59e0b" />
                <circle cx="125" cy="32" r="2" fill="#f59e0b" />
                <circle cx="175" cy="34" r="2" fill="#f59e0b" />

                <path d="M 175,34 L 215,38 L 250,42" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" />
                <circle cx="215" cy="38" r="2" fill="none" stroke="#38bdf8" />
                <circle cx="250" cy="42" r="2" fill="none" stroke="#38bdf8" />

                <text x="35" y="52" fill="#64748b" fontSize="5.5" textAnchor="middle">19 May</text>
                <text x="105" y="52" fill="#64748b" fontSize="5.5" textAnchor="middle">21 May</text>
                <text x="175" y="52" fill="#64748b" fontSize="5.5" textAnchor="middle">23 May</text>
                <text x="240" y="52" fill="#64748b" fontSize="5.5" textAnchor="middle">25 May</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Energy Forecast + AI Energy Insights */}
        <div className="energy-bottom-row-grid">
          {/* Card 1: Energy Forecast */}
          <div className="e-forecast-card polaris-card">
            <div className="card-header-with-action">
              <span className="card-title">Energy Forecast (7-Day Trend)</span>
              <div className="period-pill-switch">
                <button 
                  className={`p-pill-btn ${forecastPeriod === '7days' ? 'active' : ''}`}
                  onClick={() => setForecastPeriod('7days')}
                >
                  Next 7 Days
                </button>
                <button 
                  className={`p-pill-btn ${forecastPeriod === '30days' ? 'active' : ''}`}
                  onClick={() => setForecastPeriod('30days')}
                >
                  Next 30 Days
                </button>
              </div>
            </div>

            <div className="forecast-stat-tiles">
              <div className="f-tile-item">
                <span className="f-tile-lbl"><Zap size={11} className="text-cyan" /> Expected Generation</span>
                <span className="f-tile-val mono-num">{energy.forecast.expectedGen}</span>
                <span className="f-tile-delta text-green">{energy.forecast.genDelta}</span>
              </div>

              <div className="f-tile-item">
                <span className="f-tile-lbl"><Activity size={11} className="text-cyan" /> Expected Consumption</span>
                <span className="f-tile-val mono-num">{energy.forecast.expectedCons}</span>
                <span className="f-tile-delta text-green">{energy.forecast.consDelta}</span>
              </div>

              <div className="f-tile-item">
                <span className="f-tile-lbl"><BatteryCharging size={11} className="text-green" /> Battery Reserve</span>
                <span className="f-tile-val mono-num">{energy.forecast.batteryReserve}</span>
                <span className="f-tile-delta text-dim">(at current trend)</span>
              </div>
            </div>

            <div className="forecast-chart-wrap">
              <svg viewBox="0 0 380 90" className="forecast-svg">
                <line x1="30" y1="15" x2="375" y2="15" stroke="rgba(255,255,255,0.05)" />
                <line x1="30" y1="40" x2="375" y2="40" stroke="rgba(255,255,255,0.05)" />
                <line x1="30" y1="65" x2="375" y2="65" stroke="rgba(255,255,255,0.05)" />

                <text x="25" y="18" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">200</text>
                <text x="25" y="43" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">150</text>
                <text x="25" y="68" fill="#64748b" fontSize="6.5" textAnchor="end" className="mono-num">100</text>

                <path d="M 35,46 L 90,44 L 145,47 L 200,43 L 255,48 L 310,45 L 365,49" fill="none" stroke="#0284c7" strokeWidth="1.8" />
                <path d="M 35,38 L 90,36 L 145,34 L 200,38 L 255,35 L 310,36 L 365,33" fill="none" stroke="#10b981" strokeWidth="1.8" />

                <text x="35" y="82" fill="#64748b" fontSize="6" textAnchor="middle">26 May</text>
                <text x="90" y="82" fill="#64748b" fontSize="6" textAnchor="middle">27 May</text>
                <text x="145" y="82" fill="#64748b" fontSize="6" textAnchor="middle">28 May</text>
                <text x="200" y="82" fill="#64748b" fontSize="6" textAnchor="middle">29 May</text>
                <text x="255" y="82" fill="#64748b" fontSize="6" textAnchor="middle">30 May</text>
                <text x="310" y="82" fill="#64748b" fontSize="6" textAnchor="middle">31 May</text>
                <text x="365" y="82" fill="#64748b" fontSize="6" textAnchor="middle">01 Jun</text>
              </svg>
            </div>
          </div>

          {/* Card 2: AI Energy Insights */}
          <div className="e-ai-insights-card polaris-card">
            <div className="card-header-simple">
              <div className="ai-title-wrap">
                <Bot size={14} className="text-cyan" />
                <span className="card-title">AI Energy Insights ({stationData.name})</span>
              </div>
            </div>

            <div className="ai-summary-callout">
              <div className="ai-robot-badge">
                <Bot size={16} />
              </div>
              <p className="ai-summary-text">
                {aiInsights.summary}
              </p>
            </div>

            <div className="ai-rec-section">
              <span className="rec-section-title">Recommended Actions</span>
              <div className="rec-actions-list">
                {aiInsights.recommendations.map((rec, rIdx) => (
                  <div key={rIdx} className="rec-item">
                    <Check size={12} className="rec-check-icon text-green" />
                    <span className="rec-text">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-card-footer">
              <button 
                className="ai-view-details-btn"
                onClick={() => setInsightModalOpen(true)}
              >
                View Diagnostic Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          RIGHT SIDEBAR: Energy Status + Recent Alerts + Quick Actions
          ==================================================================== */}
      <aside className="energy-right-sidebar">
        {/* Card 1: Energy Status Circular Gauge */}
        <div className="e-status-gauge-card polaris-card">
          <div className="card-header-simple">
            <span className="card-title">Energy Status</span>
          </div>

          <div className="e-gauge-circle-wrap">
            <div className="e-gauge-box">
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(30,58,95,0.4)" strokeWidth="7" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="7" 
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - energyStatus.score / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" 
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className="e-gauge-center">
                <span className="e-gauge-score mono-num">{energyStatus.score}<span className="den">/100</span></span>
                <span className="e-good-badge" style={{ color: energyStatus.rating === 'Optimal' ? '#00e699' : '#10b981' }}>{energyStatus.rating}</span>
              </div>
            </div>
          </div>

          {/* Subsystem Health Breakdown Rows */}
          <div className="e-subsystems-list">
            {(energyStatus.subsystems || []).map((sub, idx) => {
              const SubIcon = getSubsystemIcon(sub.label);
              return (
                <div key={idx} className="e-subsystem-row">
                  <div className="e-sub-left">
                    <SubIcon size={12} style={{ color: sub.color }} />
                    <span className="e-sub-label">{sub.label}</span>
                  </div>
                  <div className="e-sub-right">
                    <span className="e-sub-val mono-num" style={{ color: sub.color }}>{sub.val}</span>
                    <ChevronRight size={12} className="text-dim" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Recent Alerts */}
        <div className="e-recent-alerts-card polaris-card">
          <div className="card-header-with-action">
            <span className="card-title">Recent Alerts</span>
            <button className="card-action-link" onClick={onOpenAlerts}>View All</button>
          </div>

          <div className="e-alerts-list">
            {(stationData.alerts || []).map((alt) => {
              let alertClass = 'amber-alert';
              let Icon = AlertTriangle;
              let bgClass = 'amber-bg';

              if (alt.severity === 'critical') {
                alertClass = 'red-alert';
                Icon = Flame;
                bgClass = 'red-bg';
              } else if (alt.severity === 'info') {
                alertClass = 'blue-alert';
                Icon = Activity;
                bgClass = 'blue-bg';
              }

              return (
                <div key={alt.id} className={`e-alert-item ${alertClass}`}>
                  <div className={`e-alert-icon-box ${bgClass}`}><Icon size={12} /></div>
                  <div className="e-alert-meta">
                    <span className="e-alert-title">{alt.title}</span>
                    <span className="e-alert-sub mono-num">{alt.time} • {alt.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="e-quick-actions-card polaris-card">
          <div className="card-header-simple">
            <span className="card-title">Quick Actions</span>
          </div>

          <div className="quick-actions-btns-list">
            <button 
              className="quick-act-btn"
              onClick={() => onOpenReport && onOpenReport({ label: `What-If Grid Load Surge Simulation (${stationData.name})` })}
            >
              <Zap size={13} className="text-cyan" />
              <span>Run What-If Simulation</span>
            </button>
            <button 
              className="quick-act-btn"
              onClick={() => onOpenReport && onOpenReport({ label: `7-Day Polar Energy Forecast (${stationData.name})` })}
            >
              <BarChart3 size={13} className="text-cyan" />
              <span>View Energy Forecast</span>
            </button>
            <button 
              className="quick-act-btn"
              onClick={() => onOpenReport && onOpenReport({ label: `${stationData.name} Primary Power Generation Health` })}
            >
              <Wrench size={13} className="text-cyan" />
              <span>Check Generation Health</span>
            </button>
            <button className="quick-act-btn" onClick={() => alert(`Exporting ${stationData.name} Mission Energy Telemetry PDF...`)}>
              <Download size={13} className="text-cyan" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
