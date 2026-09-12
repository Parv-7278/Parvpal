import React, { useState } from 'react';
import {
  CloudSnow,
  Wind,
  Thermometer,
  Compass,
  Eye,
  Sun,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Layers,
  Radio,
  Zap,
  TrendingDown,
  TrendingUp,
  Snowflake,
  Maximize2
} from 'lucide-react';
import { STATIONS_DATA } from '../data/stationsData';
import { useModal } from '../context/ModalContext';

export default function EnvironmentView({ selectedStation }) {
  const { openDrillDown } = useModal();
  const stationId = selectedStation === 'all-stations' ? 'station-maitri' : selectedStation;
  const station = STATIONS_DATA[stationId] || STATIONS_DATA['station-maitri'];
  const isMaitri = station.id === 'station-maitri';

  const [activeSubTab, setActiveSubTab] = useState('meteorology');

  // Weather data parameters
  const weather = station.weather || {};
  const isBharati = !isMaitri;

  // 24h Meteorological Trend Graph Data
  const hourlyData = [
    { time: '00:00', temp: isMaitri ? -19.4 : -15.1, wind: isMaitri ? 22 : 38, pressure: 984.2, solar: 0 },
    { time: '04:00', temp: isMaitri ? -20.2 : -15.8, wind: isMaitri ? 25 : 42, pressure: 983.8, solar: 10 },
    { time: '08:00', temp: isMaitri ? -18.9 : -14.6, wind: isMaitri ? 28 : 45, pressure: 983.1, solar: 180 },
    { time: '12:00', temp: isMaitri ? -17.8 : -13.5, wind: isMaitri ? 31 : 48, pressure: 982.5, solar: 340 },
    { time: '16:00', temp: isMaitri ? -18.7 : -14.2, wind: isMaitri ? 28 : 44, pressure: 982.9, solar: 210 },
    { time: '20:00', temp: isMaitri ? -19.6 : -14.9, wind: isMaitri ? 24 : 40, pressure: 983.5, solar: 25 },
    { time: 'Now', temp: isMaitri ? -18.7 : -14.2, wind: isMaitri ? 28 : 44, pressure: isMaitri ? 983.1 : 991.4, solar: 140 },
  ];

  // 7-Day Polar Meteorological Forecast
  const forecast7Day = [
    { day: 'Today', high: isMaitri ? -17.5 : -13.2, low: isMaitri ? -20.5 : -16.0, wind: isMaitri ? '28 km/h' : '44 km/h', cond: 'Scattered Cirrus', snow: '2.5 cm' },
    { day: 'Tomorrow', high: isMaitri ? -16.8 : -12.5, low: isMaitri ? -19.8 : -15.2, wind: isMaitri ? '35 km/h' : '52 km/h', cond: 'Polar Blizzard Warning', snow: '14.0 cm' },
    { day: 'Day +2', high: isMaitri ? -19.2 : -15.0, low: isMaitri ? -23.5 : -18.5, wind: isMaitri ? '45 km/h' : '65 km/h', cond: 'Gale Force Whiteout', snow: '22.0 cm' },
    { day: 'Day +3', high: isMaitri ? -21.0 : -16.8, low: isMaitri ? -24.8 : -20.1, wind: isMaitri ? '30 km/h' : '48 km/h', cond: 'Clearing Katabatic', snow: '4.0 cm' },
    { day: 'Day +4', high: isMaitri ? -18.4 : -14.0, low: isMaitri ? -21.2 : -16.9, wind: isMaitri ? '20 km/h' : '36 km/h', cond: 'Clear Polar Skies', snow: '0.5 cm' },
    { day: 'Day +5', high: isMaitri ? -17.9 : -13.5, low: isMaitri ? -20.6 : -16.4, wind: isMaitri ? '24 km/h' : '38 km/h', cond: 'High Cirrus', snow: '1.2 cm' },
    { day: 'Day +6', high: isMaitri ? -18.5 : -14.1, low: isMaitri ? -21.0 : -17.0, wind: isMaitri ? '26 km/h' : '42 km/h', cond: 'Overcast Stratus', snow: '3.0 cm' },
  ];

  // Subsurface & Permafrost Temperature Array
  const permafrostSensors = isMaitri ? [
    { depth: 'Surface Ground (0 m)', temp: -18.2, status: 'FROZEN SOLID' },
    { depth: 'Subsurface Firn (-5 m)', temp: -16.4, status: 'PERMAFROST' },
    { depth: 'Bedrock Borehole (-15 m)', temp: -14.1, status: 'STABLE GEOTHERMAL' },
    { depth: 'Deep Borehole (-30 m)', temp: -12.6, status: 'ISOTHERMAL' },
  ] : [
    { depth: 'Coastal Bedrock (0 m)', temp: -13.8, status: 'FROZEN SOLID' },
    { depth: 'Ice Shelf Core (-5 m)', temp: -12.8, status: 'MARINE INFLUENCED' },
    { depth: 'Promontory Subsurface (-15 m)', temp: -10.5, status: 'STABLE GEOTHERMAL' },
    { depth: 'Prydz Bay Sea Floor (-45 m)', temp: -1.8, status: 'SUBSEA CRYOSPHERIC' },
  ];

  // SVG dimensions for 24h Profile
  const chartW = 540;
  const chartH = 150;
  const padL = 45;
  const padR = 25;
  const padT = 20;
  const padB = 25;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const minTemp = isMaitri ? -22 : -18;
  const maxTemp = isMaitri ? -16 : -12;
  const getTempY = (t) => padT + innerH - ((t - minTemp) / (maxTemp - minTemp)) * innerH;
  const getTempX = (i) => padL + (i / (hourlyData.length - 1)) * innerW;

  const tempLinePoints = hourlyData.map((d, i) => `${getTempX(i)},${getTempY(d.temp)}`).join(' ');
  const tempAreaPoints = `${padL},${padT + innerH} ${tempLinePoints} ${padL + innerW},${padT + innerH}`;

  return (
    <div className="tab-page-container environment-view-container">
      {/* Top Banner */}
      <div className="tab-page-header">
        <div>
          <h2 className="tab-page-title">{station.name} Polar Meteorological & Space Weather Center</h2>
          <span className="tab-page-subtitle">
            Live Cryospheric Sensors, Blizzard Hazard Warning System, and Geomagnetic Aurora Observatory ({station.region})
          </span>
        </div>
        <div className="header-status-badge">
          <Snowflake size={14} className="text-cyan" />
          <span>STATION CLIMATE: {isMaitri ? 'INLAND CONTINENTAL MORAINE' : 'COASTAL MARITIME ANTARCTIC'}</span>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="env-kpi-ribbon">
        <div 
          className="env-kpi-card clickable-drilldown-card"
          onClick={() => openDrillDown({
            title: 'Ambient Surface Temperature',
            station: station.name,
            category: 'ENVIRONMENT',
            metricKey: 'temperature',
            currentValue: isMaitri ? -18.7 : -14.2,
            unit: '°C',
            status: 'NORMAL',
            thresholds: { warning: '< -25.0 °C', critical: '< -35.0 °C' },
            stats: { min: isMaitri ? '-24.2 °C' : '-19.8 °C', avg: isMaitri ? '-18.9 °C' : '-14.8 °C', max: isMaitri ? '-12.1 °C' : '-8.4 °C' },
            historicalData: hourlyData.map(h => ({ time: h.time, val: h.temp })),
            interpretation: `Micro-meteorological sensors on ${station.name} indicate stable thermal conditions consistent with seasonal Antarctic models.`,
            recommendation: 'Exterior corridor heating and trace circuits nominal.',
          })}
          title="Click to view comprehensive temperature waveform & statistics"
        >
          <div className="kpi-label-row">
            <Thermometer size={16} className="text-cyan" />
            <span className="kpi-lbl">SURFACE TEMP</span>
          </div>
          <div className="kpi-big-val mono-num">{weather.temp || '-18.7'}°C</div>
          <div className="kpi-sub-txt">
            RealFeel Wind Chill: <span className="text-cyan font-bold">{isMaitri ? '-28.4°C' : '-24.8°C'}</span>
          </div>
        </div>

        <div 
          className="env-kpi-card clickable-drilldown-card"
          onClick={() => openDrillDown({
            title: 'Katabatic Surface Wind Velocity',
            station: station.name,
            category: 'ENVIRONMENT',
            metricKey: 'wind_speed',
            currentValue: isMaitri ? 28 : 44,
            unit: 'km/h',
            status: 'NORMAL',
            thresholds: { warning: '> 60 km/h', critical: '> 85 km/h' },
            stats: { min: '12 km/h', avg: isMaitri ? '28 km/h' : '42 km/h', max: isMaitri ? '68 km/h' : '82 km/h' },
            historicalData: hourlyData.map(h => ({ time: h.time, val: h.wind })),
            interpretation: 'Polar katabatic winds descending from continental ice sheets remain below high-danger storm thresholds.',
            recommendation: 'Anchor outdoor instrumentation arrays if wind exceeds 50 km/h.',
          })}
          title="Click to view wind velocity dynamics"
        >
          <div className="kpi-label-row">
            <Wind size={16} className="text-amber" />
            <span className="kpi-lbl">WIND VELOCITY</span>
          </div>
          <div className="kpi-big-val mono-num">{weather.windSpeed || '28 km/h'}</div>
          <div className="kpi-sub-txt">
            Direction: <span className="text-amber font-bold">{weather.windDir || 'NW'}</span> | Gusts: {isMaitri ? '42 km/h' : '62 km/h'}
          </div>
        </div>

        <div 
          className="env-kpi-card clickable-drilldown-card"
          onClick={() => openDrillDown({
            title: 'Cryospheric Snow Accumulation Rate',
            station: station.name,
            category: 'ENVIRONMENT',
            metricKey: 'snow_accumulation',
            currentValue: isMaitri ? 12.4 : 24.2,
            unit: 'cm',
            status: 'NORMAL',
            thresholds: { warning: '> 30 cm / 24h', critical: '> 60 cm' },
            stats: { min: '3 cm', avg: isMaitri ? '12.4 cm' : '22.1 cm', max: '34 cm' },
            historicalData: [
              { time: '00:00', val: 8.5 },
              { time: '04:00', val: 9.4 },
              { time: '08:00', val: 10.6 },
              { time: '12:00', val: 11.8 },
              { time: '16:00', val: 12.2 },
              { time: 'Now', val: isMaitri ? 12.4 : 24.2 },
            ],
            interpretation: 'Ultrasonic depth sensors confirm stable drift levels around the aerodynamic stilt foundations.',
            recommendation: 'Air intake plenum auto-blower cycle scheduled for 06:00 UTC.',
          })}
          title="Click to inspect snow accumulation data"
        >
          <div className="kpi-label-row">
            <CloudSnow size={16} className="text-blue" />
            <span className="kpi-lbl">SNOW ACCUMULATION</span>
          </div>
          <div className="kpi-big-val mono-num">{weather.snowAccumulation || (isMaitri ? '12.4 cm' : '24.2 cm')}</div>
          <div className="kpi-sub-txt">
            24h Drift Rate: <span className="text-blue font-bold">{isMaitri ? '0.85 cm/hr' : '1.75 cm/hr'}</span>
          </div>
        </div>

        <div 
          className="env-kpi-card clickable-drilldown-card"
          onClick={() => openDrillDown({
            title: 'Optical Runway & Station Visibility',
            station: station.name,
            category: 'ENVIRONMENT',
            metricKey: 'visibility',
            currentValue: parseFloat(weather.visibility) || 4.8,
            unit: 'km',
            status: 'NORMAL',
            thresholds: { warning: '< 1.5 km', critical: '< 0.3 km' },
            stats: { min: '1.2 km', avg: '5.2 km', max: '15.0 km' },
            historicalData: [
              { time: '00:00', val: 6.2 },
              { time: '04:00', val: 5.5 },
              { time: '08:00', val: 4.8 },
              { time: '12:00', val: 5.0 },
              { time: '16:00', val: 4.8 },
              { time: 'Now', val: 4.8 },
            ],
            interpretation: 'Laser transmissometer indicates clear visual horizon with minimal blowing surface drift.',
            recommendation: 'Maintain runway guidance strobes on standby.',
          })}
          title="Click to inspect optical range telemetry"
        >
          <div className="kpi-label-row">
            <Eye size={16} className="text-emerald" />
            <span className="kpi-lbl">VISIBILITY</span>
          </div>
          <div className="kpi-big-val mono-num">{weather.visibility || '4.8 km'}</div>
          <div className="kpi-sub-txt">
            Condition: <span className="text-emerald font-bold">{weather.condition || 'Polar Clear'}</span>
          </div>
        </div>

        <div 
          className="env-kpi-card clickable-drilldown-card"
          onClick={() => openDrillDown({
            title: 'Geomagnetic Planetary Kp-Index',
            station: station.name,
            category: 'RESEARCH',
            metricKey: 'geomagnetic_kp',
            currentValue: isMaitri ? 2.3 : 2.8,
            unit: 'Kp',
            status: 'NORMAL',
            thresholds: { warning: '> 5.0 Kp (G2 Storm)', critical: '> 7.0 Kp (G4 Storm)' },
            stats: { min: '1.0 Kp', avg: '2.4 Kp', max: '4.2 Kp' },
            historicalData: [
              { time: '00:00', val: 1.8 },
              { time: '04:00', val: 2.1 },
              { time: '08:00', val: 2.6 },
              { time: '12:00', val: 2.9 },
              { time: '16:00', val: 2.4 },
              { time: 'Now', val: isMaitri ? 2.3 : 2.8 },
            ],
            interpretation: 'Triaxial fluxgate magnetometer reports minor magnetospheric substorm activity. Auroral oval overhead active.',
            recommendation: 'Ionospheric sounder operations nominal. HF comms unaffected.',
          })}
          title="Click to inspect space weather and geomagnetic telemetry"
        >
          <div className="kpi-label-row">
            <Activity size={16} className="text-purple" />
            <span className="kpi-lbl">GEOMAGNETIC KP</span>
          </div>
          <div className="kpi-big-val mono-num">Kp {isMaitri ? '2.3' : '2.8'}</div>
          <div className="kpi-sub-txt">
            Space Weather: <span className="text-purple font-bold">G1 Minor Storm / Aurora</span>
          </div>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="env-main-grid">
        {/* Left Column: 24h Trend Chart & Space Weather Console */}
        <div className="env-charts-col">
          {/* 24h Temperature & Wind Profile (Native SVG) */}
          <div 
            className="env-chart-card polaris-card clickable-drilldown-card"
            onClick={() => openDrillDown({
              title: '24-Hour Polar Thermal & Katabatic Wind Profile (Expanded)',
              station: station.name,
              category: 'ENVIRONMENT',
              metricKey: 'temperature',
              currentValue: isMaitri ? -18.7 : -14.2,
              unit: '°C',
              status: 'NORMAL',
              thresholds: { warning: '< -25.0 °C', critical: '< -35.0 °C' },
              stats: { min: isMaitri ? '-20.2 °C' : '-15.8 °C', avg: isMaitri ? '-18.9 °C' : '-14.6 °C', max: isMaitri ? '-17.8 °C' : '-13.5 °C' },
              historicalData: hourlyData.map(h => ({ time: h.time, val: h.temp })),
              interpretation: 'Continuous 24-hour meteorological logging from station mast transducers showing regular diurnal solar oscillation.',
              recommendation: 'Baseline thermal profiles match historical Antarctic climate records.',
            })}
            title="Click to expand high-resolution thermal waveform"
          >
            <div className="panel-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Thermometer size={16} className="text-cyan" />
                <h3 className="section-title">24-Hour Polar Thermal & Katabatic Wind Profile</h3>
              </div>
              <div className="stream-channel-legend" style={{ fontSize: '0.72rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: '#38bdf8' }}>● Temperature (°C)</span>
                <Maximize2 size={13} className="text-cyan" />
              </div>
            </div>
            <p className="section-subtitle">
              Micro-meteorological telemetry recorded by station mast weather transducers. (Click to expand)
            </p>

            <div className="chart-container" style={{ height: 200, padding: '0.5rem 0' }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                  const y = padT + innerH - p * innerH;
                  const tempVal = (minTemp + p * (maxTemp - minTemp)).toFixed(1);
                  return (
                    <g key={idx}>
                      <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <text x={padL - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                        {tempVal}°C
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis labels */}
                {hourlyData.map((d, i) => (
                  <text key={i} x={getTempX(i)} y={chartH - 6} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {d.time}
                  </text>
                ))}

                {/* Shaded Area */}
                <polygon points={tempAreaPoints} fill="url(#tempGradient)" />

                {/* Main Temperature Line */}
                <polyline fill="none" stroke="#38bdf8" strokeWidth="2.2" points={tempLinePoints} strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points */}
                {hourlyData.map((d, i) => (
                  <g key={i}>
                    <circle cx={getTempX(i)} cy={getTempY(d.temp)} r="3" fill="#38bdf8" stroke="#060b14" strokeWidth="1.5" />
                    <text x={getTempX(i)} y={getTempY(d.temp) - 8} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {d.temp}°
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Space Weather & Aurora Oval */}
          <div className="space-weather-card polaris-card">
            <div className="panel-title-row">
              <Zap size={16} className="text-purple" />
              <h3 className="section-title">Upper Atmosphere & Space Weather Telemetry</h3>
            </div>
            <div className="space-weather-grid">
              <div 
                className="sw-item clickable-drilldown-card"
                onClick={() => openDrillDown({
                  title: 'Solar Wind Plasma Velocity (ACE / DSCOVR)',
                  station: station.name,
                  category: 'RESEARCH',
                  metricKey: 'solar_wind',
                  currentValue: 442.8,
                  unit: 'km/s',
                  status: 'NORMAL',
                  thresholds: { warning: '> 600 km/s (High Speed Stream)', critical: '> 800 km/s (CME Impact)' },
                  stats: { min: '380 km/s', avg: '435 km/s', max: '510 km/s' },
                  historicalData: [
                    { time: '00:00', val: 410 },
                    { time: '04:00', val: 425 },
                    { time: '08:00', val: 450 },
                    { time: '12:00', val: 448 },
                    { time: '16:00', val: 442.8 },
                  ],
                  interpretation: 'Interplanetary solar wind plasma flux is nominal. No Earth-directed coronal mass ejection detected.',
                  recommendation: 'GPS L-band positioning accuracy remains unperturbed.',
                })}
              >
                <span className="sw-label">Solar Wind Speed</span>
                <span className="sw-val mono-num">442.8 km/s</span>
                <span className="sw-status text-emerald">Nominal Velocity</span>
              </div>
              <div 
                className="sw-item clickable-drilldown-card"
                onClick={() => openDrillDown({
                  title: 'Interplanetary Magnetic Field (IMF Bz)',
                  station: station.name,
                  category: 'RESEARCH',
                  metricKey: 'imf_bz',
                  currentValue: -2.4,
                  unit: 'nT',
                  status: 'WARNING',
                  thresholds: { warning: '< -5.0 nT (Reconnection)', critical: '< -10.0 nT (Major Storm)' },
                  stats: { min: '-6.2 nT', avg: '-1.8 nT', max: '+4.1 nT' },
                  historicalData: [
                    { time: '00:00', val: 1.2 },
                    { time: '04:00', val: -0.5 },
                    { time: '08:00', val: -1.8 },
                    { time: '12:00', val: -3.1 },
                    { time: '16:00', val: -2.4 },
                  ],
                  interpretation: 'Southward IMF orientation facilitates magnetic reconnection with Earth’s dayside magnetopause, triggering visual aurora.',
                  recommendation: 'All-sky auroral imager active in automated capture mode.',
                })}
              >
                <span className="sw-label">Interplanetary Mag Field (IMF Bz)</span>
                <span className="sw-val mono-num">-2.4 nT (Southward)</span>
                <span className="sw-status text-amber">Minor Auroral Injection</span>
              </div>
              <div 
                className="sw-item clickable-drilldown-card"
                onClick={() => openDrillDown({
                  title: 'Ionospheric Scintillation Index (S4)',
                  station: station.name,
                  category: 'COMMUNICATION',
                  metricKey: 's4_index',
                  currentValue: 0.165,
                  unit: 'S4',
                  status: 'NORMAL',
                  thresholds: { warning: '> 0.40 (Phase Drift)', critical: '> 0.70 (Satcom Outage)' },
                  stats: { min: '0.08', avg: '0.14', max: '0.28' },
                  historicalData: [
                    { time: '00:00', val: 0.12 },
                    { time: '04:00', val: 0.15 },
                    { time: '08:00', val: 0.18 },
                    { time: '12:00', val: 0.16 },
                    { time: '16:00', val: 0.165 },
                  ],
                  interpretation: 'Low ionospheric amplitude fluctuations ensure crystal-clear GSAT / Inmarsat satellite downlink signals.',
                  recommendation: 'High-bandwidth research data sync permitted.',
                })}
              >
                <span className="sw-label">Ionospheric Scintillation (S4)</span>
                <span className="sw-val mono-num">0.165</span>
                <span className="sw-status text-emerald">Satcom UHF Safe</span>
              </div>
              <div 
                className="sw-item clickable-drilldown-card"
                onClick={() => openDrillDown({
                  title: 'Total Atmospheric Ozone Column (Dobson Array)',
                  station: station.name,
                  category: 'RESEARCH',
                  metricKey: 'ozone_column',
                  currentValue: 285,
                  unit: 'DU',
                  status: 'NORMAL',
                  thresholds: { warning: '< 220 DU (Ozone Hole)', critical: '< 150 DU' },
                  stats: { min: '260 DU', avg: '282 DU', max: '315 DU' },
                  historicalData: [
                    { time: '00:00', val: 278 },
                    { time: '04:00', val: 280 },
                    { time: '08:00', val: 285 },
                    { time: '12:00', val: 288 },
                    { time: '16:00', val: 285 },
                  ],
                  interpretation: 'Dobson Spectrophotometer readings demonstrate strong stratospheric ozone recovery during current polar cycle.',
                  recommendation: 'Standard UV-B outdoor protection protocol active.',
                })}
              >
                <span className="sw-label">Total Ozone Column</span>
                <span className="sw-val mono-num">285 Dobson Units</span>
                <span className="sw-status text-cyan">Spring Ozone Layer Nominal</span>
              </div>
            </div>
          </div>

          {/* Subsurface Borehole & Permafrost Temperature Array */}
          <div className="permafrost-card polaris-card">
            <div className="panel-title-row">
              <Layers size={16} className="text-blue" />
              <h3 className="section-title">Cryospheric Permafrost Borehole Array</h3>
            </div>
            <div className="permafrost-table">
              {permafrostSensors.map((p, idx) => (
                <div 
                  key={idx} 
                  className="permafrost-row clickable-drilldown-card"
                  onClick={() => openDrillDown({
                    title: `Permafrost Thermistor: ${p.depth}`,
                    station: station.name,
                    category: 'ENVIRONMENT',
                    metricKey: 'permafrost_temp',
                    currentValue: p.temp,
                    unit: '°C',
                    status: 'NORMAL',
                    thresholds: { warning: '> -2.0 °C (Active Layer Thaw)', critical: '> 0.0 °C' },
                    stats: { min: `${p.temp - 2.5}°C`, avg: `${p.temp}°C`, max: `${p.temp + 1.8}°C` },
                    historicalData: [
                      { time: '00:00', val: +(p.temp - 0.4).toFixed(1) },
                      { time: '06:00', val: +(p.temp - 0.2).toFixed(1) },
                      { time: '12:00', val: +(p.temp + 0.1).toFixed(1) },
                      { time: '18:00', val: +(p.temp).toFixed(1) },
                    ],
                    interpretation: `Subsurface cryo-sensor at ${p.depth} indicates rock/firn core is fully frozen and structurally anchoring station foundations.`,
                    recommendation: 'No thermal degradation of foundation pilings detected.',
                  })}
                >
                  <span className="pf-depth">{p.depth}</span>
                  <span className="pf-temp mono-num">{p.temp}°C</span>
                  <span className="pf-status-pill">{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 7-Day Forecast & Polar Wind Rose Radar */}
        <div className="env-side-col">
          {/* 7-Day Detailed Forecast List */}
          <div className="forecast-card polaris-card">
            <div className="panel-title-row">
              <Clock size={16} className="text-cyan" />
              <h3 className="section-title">7-Day Polar Meteorological Forecast</h3>
            </div>
            <div className="forecast-list">
              {forecast7Day.map((fc, i) => (
                <div key={i} className={`forecast-item-row ${i === 1 ? 'forecast-item-warning' : ''}`}>
                  <div className="fc-day-col">
                    <span className="fc-day-name">{fc.day}</span>
                    <span className="fc-cond-name">{fc.cond}</span>
                  </div>
                  <div className="fc-snow-col">
                    <CloudSnow size={12} className="text-cyan" />
                    <span>{fc.snow}</span>
                  </div>
                  <div className="fc-wind-col">
                    <Wind size={12} className="text-amber" />
                    <span>{fc.wind}</span>
                  </div>
                  <div className="fc-temp-col mono-num">
                    <span className="fc-high">{fc.high}°</span>
                    <span className="fc-low">{fc.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blizzard Emergency Readiness Checklist */}
          <div className="blizzard-readiness-card polaris-card">
            <div className="panel-title-row">
              <AlertTriangle size={16} className="text-amber" />
              <h3 className="section-title">Blizzard Safety & Readiness Status</h3>
            </div>
            <div className="readiness-list">
              <div className="readiness-item">
                <span className="check-dot text-emerald">✓</span>
                <span className="readiness-txt">Emergency Guideline Ropes Checked</span>
              </div>
              <div className="readiness-item">
                <span className="check-dot text-emerald">✓</span>
                <span className="readiness-txt">Diesel Tank Trace Heating Auto-Engaged</span>
              </div>
              <div className="readiness-item">
                <span className="check-dot text-emerald">✓</span>
                <span className="readiness-txt">Science Outdoor Field Parties Recalled to Station</span>
              </div>
              <div className="readiness-item">
                <span className="check-dot text-emerald">✓</span>
                <span className="readiness-txt">Emergency Survival Rations & Satcom Beacons Primed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
