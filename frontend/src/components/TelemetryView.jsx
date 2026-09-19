import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Thermometer, 
  Droplets, 
  Radio, 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  Layers, 
  AlertTriangle, 
  CheckCircle2,
  Sliders,
  Filter
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { STATIONS_DATA } from '../data/stationsData';
import { formatStationTime } from '../utils/timeUtils';

export default function TelemetryView({ selectedStation }) {
  const stationId = selectedStation === 'all-stations' ? 'station-maitri' : selectedStation;
  const station = STATIONS_DATA[stationId] || STATIONS_DATA['station-maitri'];
  const isMaitri = station.id === 'station-maitri';

  const { liveTelemetry } = useTelemetry();
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [sampleRate, setSampleRate] = useState('1 Hz');

  // Real-time telemetry stream series
  const [streamData, setStreamData] = useState([
    { time: 'T-30s', genTemp: 70.0, powerCons: isMaitri ? 105 : 148, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.7 : -14.2 },
    { time: 'T-25s', genTemp: 70.2, powerCons: isMaitri ? 106 : 149, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.8 : -14.3 },
    { time: 'T-20s', genTemp: 70.5, powerCons: isMaitri ? 104 : 147, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.6 : -14.2 },
    { time: 'T-15s', genTemp: 70.8, powerCons: isMaitri ? 105 : 148, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.7 : -14.1 },
    { time: 'T-10s', genTemp: 71.0, powerCons: isMaitri ? 107 : 150, battPct: isMaitri ? 73 : 90, extTemp: isMaitri ? -18.9 : -14.4 },
    { time: 'T-5s', genTemp: 70.6, powerCons: isMaitri ? 105 : 148, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.7 : -14.2 },
    { time: 'Live', genTemp: liveTelemetry?.generator_temperature || 70.0, powerCons: isMaitri ? 105 : 148, battPct: isMaitri ? 74 : 91, extTemp: isMaitri ? -18.7 : -14.2 },
  ]);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeTag = formatStationTime(now, station.timezone);
      const currentGenTemp = liveTelemetry?.generator_temperature || (70.0 + (Math.random() * 0.8 - 0.4));
      
      setStreamData(prev => {
        const next = [...prev.slice(1), {
          time: timeTag,
          genTemp: +currentGenTemp.toFixed(1),
          powerCons: +(isMaitri ? 105 + (Math.random() * 2 - 1) : 148 + (Math.random() * 3 - 1.5)).toFixed(1),
          battPct: isMaitri ? 74 : 91,
          extTemp: +(isMaitri ? -18.7 + (Math.random() * 0.2 - 0.1) : -14.2 + (Math.random() * 0.2 - 0.1)).toFixed(1)
        }];
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, liveTelemetry, isMaitri]);

  // Grouped Sensor Telemetry Matrices
  const sensorGroups = [
    {
      groupId: 'POWER_GRID',
      groupName: 'Power & Electrical Grid (415V SCADA)',
      icon: Zap,
      color: '#38bdf8',
      sensors: [
        { id: 'SEN-PWR-01', name: isMaitri ? 'Diesel Genset G-01 Active Load' : 'CHP Genset C-01 Active Load', val: isMaitri ? '65.2 kW' : '92.4 kW', range: '0 - 100 kW', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-PWR-02', name: isMaitri ? 'Diesel Genset G-02 Stator Temp' : 'CHP Genset C-02 Stator Temp', val: `${liveTelemetry?.generator_temperature || 70.0}°C`, range: '40 - 85°C', status: 'MONITORING', color: '#f59e0b' },
        { id: 'SEN-PWR-03', name: 'Main Busbar Voltage (L1-L2-L3)', val: '415.4 V ± 0.8%', range: '400 - 425 V', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-PWR-04', name: 'Grid Frequency Stability', val: '50.02 Hz', range: '49.8 - 50.2 Hz', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-PWR-05', name: 'BESS Battery Bank State of Charge', val: isMaitri ? '74.2% (320 kWh)' : '91.5% (480 kWh)', range: '20 - 100%', status: 'OPTIMAL', color: '#10b981' },
      ]
    },
    {
      groupId: 'THERMAL_HVAC',
      groupName: 'Thermal Loops & Trace Heating Systems',
      icon: Thermometer,
      color: '#f59e0b',
      sensors: [
        { id: 'SEN-TH-01', name: isMaitri ? 'Priyadarshini Lake Conduit Glycol Trace' : 'RO Desalination Intake Thermal Trace', val: isMaitri ? '+4.8°C' : '+3.9°C', range: '+2.0 - +8.0°C', status: 'ACTIVE', color: '#10b981' },
        { id: 'SEN-TH-02', name: 'Habitat Main Core HVAC Return Temp', val: '+21.4°C', range: '+18.0 - +23.0°C', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-TH-03', name: 'Exhaust Heat Recovery Boiler #1', val: '+164.2°C', range: '140 - 190°C', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-TH-04', name: 'Bulk Diesel Storage Tank T-01 Core Temp', val: isMaitri ? '-4.2°C (Heated)' : '-2.8°C (Heated)', range: '>-15.0°C', status: 'NOMINAL', color: '#10b981' },
      ]
    },
    {
      groupId: 'CRYOSPHERE_WEATHER',
      groupName: 'Cryosphere & Micro-Meteorology Array',
      icon: Droplets,
      color: '#06b6d4',
      sensors: [
        { id: 'SEN-MET-01', name: 'External Ambient Sonic Temperature', val: isMaitri ? '-18.7°C' : '-14.2°C', range: '-50 - +5°C', status: 'NOMINAL', color: '#38bdf8' },
        { id: 'SEN-MET-02', name: '3-Axis Ultrasonic Anemometer Wind Speed', val: isMaitri ? '42 km/h' : '38 km/h', range: '0 - 180 km/h', status: 'STEADY', color: '#10b981' },
        { id: 'SEN-MET-03', name: 'Laser Snow Depth Gauge (Accumulation 24h)', val: isMaitri ? '12.4 cm' : '24.2 cm', range: '0 - 100 cm', status: 'MONITORING', color: '#f59e0b' },
        { id: 'SEN-MET-04', name: 'Barometric Pressure Transducer', val: isMaitri ? '982.4 hPa' : '994.1 hPa', range: '940 - 1040 hPa', status: 'NOMINAL', color: '#10b981' },
      ]
    },
    {
      groupId: 'SATCOM_RF',
      groupName: 'Space-Ground Satcom & RF Tracking',
      icon: Radio,
      color: '#a855f7',
      sensors: [
        { id: 'SEN-RF-01', name: 'INSAT-4CR Ku-band Carrier-to-Noise (C/N)', val: '14.8 dB', range: '> 10.0 dB', status: 'LOCKED', color: '#10b981' },
        { id: 'SEN-RF-02', name: 'GSAT-30 Uplink Power Amplifier (SSPA)', val: '45.2 W', range: '20 - 80 W', status: 'NOMINAL', color: '#10b981' },
        { id: 'SEN-RF-03', name: 'Radome Internal De-Icing Blower Air Temp', val: '+12.4°C', range: '+5 - +25°C', status: 'ACTIVE', color: '#10b981' },
        { id: 'SEN-RF-04', name: 'Space Weather Ionospheric Scintillation (S4)', val: isMaitri ? '0.161' : '0.185', range: '< 0.300', status: 'QUIET', color: '#10b981' },
      ]
    }
  ];

  const filteredGroups = selectedGroup === 'ALL' 
    ? sensorGroups 
    : sensorGroups.filter(g => g.groupId === selectedGroup);

  const handleExportCSV = () => {
    const csvRows = [
      'Timestamp,Sensor_ID,Sensor_Name,Telemetry_Value,SCADA_Status'
    ];
    sensorGroups.forEach(group => {
      group.sensors.forEach(s => {
        csvRows.push(`"${new Date().toISOString()}","${s.id}","${s.name}","${s.val}","${s.status}"`);
      });
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `POLARIS_SCADA_Telemetry_${station.name}_${Date.now()}.csv`;
    a.click();
  };

  // SVG dimensions & calculations for streaming chart
  const svgWidth = 600;
  const svgHeight = 150;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;
  const graphWidth = svgWidth - paddingLeft - paddingRight;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  // Scales
  const getX = (idx) => paddingLeft + (idx / (streamData.length - 1)) * graphWidth;
  const getYTemp = (val) => paddingTop + graphHeight - ((val - 68) / 6) * graphHeight;
  const getYPower = (val) => paddingTop + graphHeight - ((val - (isMaitri ? 95 : 135)) / 30) * graphHeight;
  const getYBatt = (val) => paddingTop + graphHeight - ((val - 60) / 40) * graphHeight;

  const tempPoints = streamData.map((d, i) => `${getX(i)},${getYTemp(d.genTemp)}`).join(' ');
  const powerPoints = streamData.map((d, i) => `${getX(i)},${getYPower(d.powerCons)}`).join(' ');
  const battPoints = streamData.map((d, i) => `${getX(i)},${getYBatt(d.battPct)}`).join(' ');

  return (
    <div className="tab-page-container telemetry-view-container">
      {/* Header Banner */}
      <div className="tab-page-header">
        <div>
          <h2 className="tab-page-title">{station.name} SCADA Transducer & Sensor Telemetry Matrix</h2>
          <span className="tab-page-subtitle">
            Real-Time Multi-Channel Industrial Telemetry Bus • Station Local SCADA Substation • {station.region}
          </span>
        </div>
        <div className="header-status-badge">
          <Activity size={14} className="text-cyan animate-pulse" />
          <span>SCADA BUS: ONLINE (4 CHANNELS ACTIVE)</span>
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="telemetry-toolbar polaris-card">
        <div className="toolbar-left">
          <button 
            className={`btn-stream-toggle ${isStreaming ? 'streaming' : 'paused'}`}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? <Pause size={14} /> : <Play size={14} />}
            <span>{isStreaming ? 'PAUSE LIVE STREAM' : 'RESUME LIVE STREAM'}</span>
          </button>

          <div className="sample-rate-selector">
            <span className="toolbar-lbl">Sample Rate:</span>
            {['1 Hz', '2 Hz', '5 Hz'].map((rate) => (
              <button
                key={rate}
                className={`rate-btn ${sampleRate === rate ? 'active' : ''}`}
                onClick={() => setSampleRate(rate)}
              >
                {rate}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          <button className="btn-export-csv" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export SCADA CSV Log</span>
          </button>
        </div>
      </div>

      {/* Live Graph Streaming Box (Native SVG) */}
      <div className="telemetry-stream-graph-card polaris-card">
        <div className="stream-graph-header">
          <div className="stream-title-wrap">
            <Activity size={16} className={`text-cyan ${isStreaming ? 'animate-pulse' : ''}`} />
            <h3 className="section-title">Live SCADA Signal Stream (Sampling: {sampleRate})</h3>
          </div>
          <div className="stream-channel-legend">
            <span className="ch-pill text-amber">● Genset G-02 Temp (°C)</span>
            <span className="ch-pill text-cyan">● Grid Consumption (kW)</span>
            <span className="ch-pill text-emerald">● Battery Level (%)</span>
          </div>
        </div>

        <div className="stream-chart-container" style={{ height: 210, padding: '0.5rem 0' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
              const y = paddingTop + graphHeight - p * graphHeight;
              return (
                <g key={idx}>
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                  <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                    {Math.round(p * 100)}%
                  </text>
                </g>
              );
            })}

            {/* Time labels on X Axis */}
            {streamData.map((d, i) => (
              <text key={i} x={getX(i)} y={svgHeight - 6} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {d.time}
              </text>
            ))}

            {/* Polylines for data */}
            <polyline fill="none" stroke="#f59e0b" strokeWidth="2" points={tempPoints} strokeLinecap="round" strokeLinejoin="round" />
            <polyline fill="none" stroke="#38bdf8" strokeWidth="1.8" points={powerPoints} strokeLinecap="round" strokeLinejoin="round" />
            <polyline fill="none" stroke="#10b981" strokeWidth="1.8" points={battPoints} strokeLinecap="round" strokeLinejoin="round" />

            {/* Data point dots */}
            {streamData.map((d, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getYTemp(d.genTemp)} r="3" fill="#f59e0b" stroke="#060b14" strokeWidth="1" />
                <circle cx={getX(i)} cy={getYPower(d.powerCons)} r="2.5" fill="#38bdf8" stroke="#060b14" strokeWidth="1" />
                <circle cx={getX(i)} cy={getYBatt(d.battPct)} r="2.5" fill="#10b981" stroke="#060b14" strokeWidth="1" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Subsystem Group Filter Bar */}
      <div className="telemetry-filter-bar polaris-card">
        <span className="filter-lbl">Subsystem Domain:</span>
        <div className="filter-pill-row">
          <button 
            className={`domain-pill ${selectedGroup === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedGroup('ALL')}
          >
            All Subsystems ({sensorGroups.reduce((acc, g) => acc + g.sensors.length, 0)} Sensors)
          </button>
          {sensorGroups.map((g) => (
            <button 
              key={g.groupId}
              className={`domain-pill ${selectedGroup === g.groupId ? 'active' : ''}`}
              onClick={() => setSelectedGroup(g.groupId)}
            >
              {g.groupName}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Matrices Grid */}
      <div className="sensor-matrices-grid">
        {filteredGroups.map((group) => {
          const IconComp = group.icon;
          return (
            <div key={group.groupId} className="sensor-group-card polaris-card">
              <div className="group-card-header">
                <div className="group-title-wrap">
                  <IconComp size={16} style={{ color: group.color }} />
                  <h4 className="group-name">{group.groupName}</h4>
                </div>
                <span className="sensor-count-badge">{group.sensors.length} Transducers</span>
              </div>

              <div className="sensors-table-wrap">
                <table className="sensors-table">
                  <thead>
                    <tr>
                      <th>Sensor ID</th>
                      <th>Parameter Description</th>
                      <th>Telemetry Value</th>
                      <th>Nominal Range</th>
                      <th>SCADA Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sensors.map((s) => (
                      <tr key={s.id}>
                        <td className="mono-num text-cyan">{s.id}</td>
                        <td className="sensor-name-cell">{s.name}</td>
                        <td className="mono-num font-bold" style={{ color: s.color }}>{s.val}</td>
                        <td className="mono-num text-dim">{s.range}</td>
                        <td>
                          <span className="sensor-status-tag" style={{ borderColor: s.color, color: s.color }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
