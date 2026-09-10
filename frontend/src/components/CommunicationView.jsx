import React, { useState } from 'react';
import {
  Radio,
  Satellite,
  ArrowDownUp,
  Zap,
  ShieldAlert,
  Activity,
  Clock,
  Send,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  Signal,
  Wifi
} from 'lucide-react';
import LatencyChart from './LatencyChart';
import BenchmarkView from './BenchmarkView';
import { STATIONS_DATA } from '../data/stationsData';

export default function CommunicationView({ selectedStation }) {
  const stationId = selectedStation === 'all-stations' ? 'station-bharati' : selectedStation;
  const station = STATIONS_DATA[stationId] || STATIONS_DATA['station-bharati'];
  const isMaitri = station.id === 'station-maitri';

  const [messagePriority, setMessagePriority] = useState('CRITICAL');
  const [injectedMessages, setInjectedMessages] = useState([
    { id: 'msg-01', type: 'EMERGENCY_ALARM', priority: 'CRITICAL (P1)', size: '256 B', queueDelay: '0 ms', satTransit: '240 ms', status: 'DELIVERED', time: '1 min ago' },
    { id: 'msg-02', type: 'GENERATOR_METRIC', priority: 'HIGH (P2)', size: '1.2 KB', queueDelay: '45 ms', satTransit: '245 ms', status: 'DELIVERED', time: '3 mins ago' },
    { id: 'msg-03', type: 'SCADA_ROUTINE_POLL', priority: 'NORMAL (P3)', size: '4.8 KB', queueDelay: '180 ms', satTransit: '250 ms', status: 'DELIVERED', time: '6 mins ago' },
    { id: 'msg-04', type: 'SEISMIC_RAW_WAVEFORM', priority: 'LOW (P4)', size: '64 KB', queueDelay: '620 ms', satTransit: '280 ms', status: 'QUEUED', time: '8 mins ago' },
  ]);

  // Satellite Constellation Link Status
  const satelliteLinks = [
    {
      id: 'INSAT-4CR',
      name: 'INSAT-4CR (Geostationary 74°E)',
      role: 'Primary Tactical SCADA Telemetry & Telephony',
      frequency: 'Ku-Band (14.2 GHz Uplink / 11.5 GHz Downlink)',
      snr: '14.8 dB (Optimal)',
      ber: '1.2 × 10⁻⁸',
      elevation: '24.5°',
      azimuth: '348.2°',
      status: 'LOCKED & ONLINE',
      latency: '240 ms (Simulated Transit)',
    },
    {
      id: 'GSAT-30',
      name: 'GSAT-30 (Geostationary 83°E)',
      role: 'High-Bandwidth Science Payload & Earth Obs Data',
      frequency: 'C-Band (6.2 GHz Uplink / 4.0 GHz Downlink)',
      snr: '16.2 dB (Optimal)',
      ber: '8.4 × 10⁻⁹',
      elevation: '21.8°',
      azimuth: '354.1°',
      status: 'LOCKED & ONLINE',
      latency: '245 ms (Simulated Transit)',
    },
    {
      id: 'CARTOSAT-2S',
      name: 'Cartosat-2 / Oceansat-3 (LEO Polar Orbit)',
      role: 'Direct X-Band Earth Station Downlink (Bharati Ground Station)',
      frequency: 'X-Band (8.1 GHz Downlink)',
      snr: '22.4 dB (Pass Active)',
      ber: '2.1 × 10⁻¹⁰',
      elevation: '48.2° (Ascending)',
      azimuth: '182.4°',
      status: 'ACTIVE PASS (11 min window)',
      latency: '15 ms (Simulated Transit)',
    }
  ];

  // Latency Comparison Benchmark Data for Recharts
  const latencyBenchmark = [
    { priority: 'P1: Critical Emergency', withoutPriority: 850, withPriority: 240, saved: '71% Faster' },
    { priority: 'P2: High Operational', withoutPriority: 620, withPriority: 290, saved: '53% Faster' },
    { priority: 'P3: Normal Telemetry', withoutPriority: 480, withPriority: 450, saved: 'Standard' },
    { priority: 'P4: Low Bulk Research', withoutPriority: 380, withPriority: 720, saved: 'Buffered' },
  ];

  const handleInjectMessage = () => {
    const newMsg = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      type: messagePriority === 'CRITICAL' ? 'EMERGENCY_ALARM' : messagePriority === 'HIGH' ? 'GENERATOR_STATE' : 'SCADA_ROUTINE',
      priority: `${messagePriority} (${messagePriority === 'CRITICAL' ? 'P1' : messagePriority === 'HIGH' ? 'P2' : messagePriority === 'NORMAL' ? 'P3' : 'P4'})`,
      size: messagePriority === 'CRITICAL' ? '256 B' : '2.4 KB',
      queueDelay: messagePriority === 'CRITICAL' ? '0 ms' : messagePriority === 'HIGH' ? '35 ms' : '210 ms',
      satTransit: '240 ms',
      status: 'DELIVERED',
      time: 'Just now'
    };
    setInjectedMessages([newMsg, ...injectedMessages]);
  };

  return (
    <div className="tab-page-container comm-view-container">
      {/* Header Banner */}
      <div className="tab-page-header">
        <div>
          <h2 className="tab-page-title">Satellite Communication & Priority Queue Latency Engine</h2>
          <span className="tab-page-subtitle">
            Bandwidth-Constrained Antarctic Space-Ground Uplink • Target: {station.name} ({station.region})
          </span>
        </div>
        <div className="header-status-badge">
          <Wifi size={14} className="text-emerald" />
          <span>ISRO SPACE-GROUND LINK: ACTIVE (INSAT-4CR LOCKED)</span>
        </div>
      </div>

      {/* Primary KPI Bar */}
      <div className="comm-kpi-bar">
        <div className="comm-kpi-card">
          <div className="kpi-label-row">
            <Clock size={16} className="text-cyan" />
            <span className="kpi-lbl">CRITICAL MSG LATENCY</span>
          </div>
          <div className="kpi-big-val mono-num text-cyan">240 ms</div>
          <div className="kpi-sub-txt">
            Queue Delay: <span className="text-emerald font-bold">0 ms (Instant Preemption)</span>
          </div>
        </div>

        <div className="comm-kpi-card">
          <div className="kpi-label-row">
            <Clock size={16} className="text-muted" />
            <span className="kpi-lbl">NORMAL MSG LATENCY</span>
          </div>
          <div className="kpi-big-val mono-num">485 ms</div>
          <div className="kpi-sub-txt">
            Queue Delay: <span className="text-amber font-bold">~245 ms</span> (Buffered)
          </div>
        </div>

        <div className="comm-kpi-card">
          <div className="kpi-label-row">
            <Signal size={16} className="text-emerald" />
            <span className="kpi-lbl">CARRIER SNR QUALITY</span>
          </div>
          <div className="kpi-big-val mono-num text-emerald">14.8 dB</div>
          <div className="kpi-sub-txt">
            BER: <span className="text-emerald font-bold">1.2 × 10⁻⁸ (Zero Loss)</span>
          </div>
        </div>

        <div className="comm-kpi-card">
          <div className="kpi-label-row">
            <Server size={16} className="text-purple" />
            <span className="kpi-lbl">GROUND GATEWAYS</span>
          </div>
          <div className="kpi-big-val mono-num">NCPOR Goa & NRSC</div>
          <div className="kpi-sub-txt">
            Dual Redundant Fiber Backbone
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Link Diagnostics (Left) & Satellite Constellation Status (Right) */}
      <div className="comm-main-grid">
        {/* Left Column: Priority Queue Demonstration & Benchmark */}
        <div className="comm-left-col">
          {/* Priority Queue Comparison Visualizer */}
          <div className="priority-visualizer-card polaris-card">
            <div className="panel-title-row">
              <Zap size={16} className="text-cyan" />
              <h3 className="section-title">4-Level Priority Satellite Queue Architecture</h3>
            </div>
            <p className="section-subtitle">
              Demonstrates how critical emergency alerts bypass standard FIFO queue buffering to prevent delay during life-support and generator faults. Clearly labeled: <strong>SIMULATED LATENCY</strong>.
            </p>

            {/* Visual Queue Graphic Comparison */}
            <div className="queue-comparison-graphic">
              {/* Without Priority Box */}
              <div className="graphic-box without-priority">
                <div className="g-box-header text-amber">
                  <span>WITHOUT PRIORITY (Standard FIFO)</span>
                </div>
                <div className="packet-pipe">
                  <span className="pkt-item pkt-normal">Normal #1</span>
                  <span className="pkt-item pkt-normal">Normal #2</span>
                  <span className="pkt-item pkt-normal">Normal #3</span>
                  <span className="pkt-item pkt-critical animate-pulse">CRITICAL #4 (Blocked Behind Queue)</span>
                </div>
                <div className="g-box-result text-amber font-bold">
                  Critical Message Transit Time: ~850 ms (Delayed!)
                </div>
              </div>

              {/* With Priority Box */}
              <div className="graphic-box with-priority">
                <div className="g-box-header text-emerald">
                  <span>WITH POLARIS PRIORITY QUEUE (Preemptive)</span>
                </div>
                <div className="packet-pipe">
                  <span className="pkt-item pkt-critical animate-bounce">CRITICAL #4 (Preempts to Head of Queue)</span>
                  <span className="pkt-item pkt-normal">Normal #1</span>
                  <span className="pkt-item pkt-normal">Normal #2</span>
                  <span className="pkt-item pkt-normal">Normal #3</span>
                </div>
                <div className="g-box-result text-emerald font-bold">
                  Critical Message Transit Time: 240 ms (Zero Queue Delay!)
                </div>
              </div>
            </div>

            {/* Benchmark Latency Chart */}
            <div className="benchmark-chart-wrap" style={{ height: 180, marginTop: 14 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyBenchmark} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="priority" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#0b1324', borderColor: '#38bdf8', borderRadius: 6, fontSize: '0.75rem' }}
                  />
                  <Bar dataKey="withoutPriority" name="Without Priority (ms)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withPriority" name="With Polaris Priority (ms)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Packet Injection Sandbox */}
          <div className="packet-injector-card polaris-card">
            <div className="panel-title-row">
              <Send size={16} className="text-cyan" />
              <h3 className="section-title">Telemetry Packet Priority Injection Sandbox</h3>
            </div>
            <div className="injector-controls">
              <div className="priority-selector-row">
                <span className="inj-lbl">Select Packet Priority:</span>
                <div className="priority-pill-group">
                  {['CRITICAL', 'HIGH', 'NORMAL', 'LOW'].map((p) => (
                    <button
                      key={p}
                      className={`p-pill-btn ${messagePriority === p ? `active-${p.toLowerCase()}` : ''}`}
                      onClick={() => setMessagePriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button className="inject-btn" onClick={handleInjectMessage}>
                <Send size={13} />
                <span>Inject Packet into Satellite Queue</span>
              </button>
            </div>

            {/* Injected Queue Feed */}
            <div className="injected-table-wrap">
              <table className="injected-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Size</th>
                    <th>Queue Delay</th>
                    <th>Sat Transit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {injectedMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td className="font-bold">{msg.type}</td>
                      <td>
                        <span className={`p-badge p-${msg.priority.slice(0, 4).toLowerCase()}`}>
                          {msg.priority}
                        </span>
                      </td>
                      <td className="mono-num">{msg.size}</td>
                      <td className="mono-num text-emerald">{msg.queueDelay}</td>
                      <td className="mono-num">{msg.satTransit}</td>
                      <td>
                        <span className="status-pill-ok">
                          <CheckCircle2 size={11} /> {msg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Active Satellite Constellation Telemetry */}
        <div className="comm-right-col">
          <div className="sat-constellation-card polaris-card">
            <div className="panel-title-row">
              <Satellite size={16} className="text-cyan" />
              <h3 className="section-title">ISRO Polar Satellite Constellation & Ground Links</h3>
            </div>

            <div className="sat-cards-list">
              {satelliteLinks.map((sat) => (
                <div key={sat.id} className="sat-link-item">
                  <div className="sat-top-row">
                    <div className="sat-title-cluster">
                      <Satellite size={18} className="text-cyan" />
                      <div>
                        <h4 className="sat-name">{sat.name}</h4>
                        <span className="sat-role">{sat.role}</span>
                      </div>
                    </div>
                    <span className="sat-status-pill">{sat.status}</span>
                  </div>

                  <div className="sat-specs-grid">
                    <div className="sat-spec">
                      <span className="spec-lbl">Frequency Band:</span>
                      <span className="spec-val">{sat.frequency}</span>
                    </div>
                    <div className="sat-spec">
                      <span className="spec-lbl">Carrier SNR:</span>
                      <span className="spec-val text-emerald font-bold">{sat.snr}</span>
                    </div>
                    <div className="sat-spec">
                      <span className="spec-lbl">Azimuth / Elevation:</span>
                      <span className="spec-val mono-num">{sat.azimuth} / {sat.elevation}</span>
                    </div>
                    <div className="sat-spec">
                      <span className="spec-lbl">Simulated Transit:</span>
                      <span className="spec-val mono-num text-cyan">{sat.latency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master Ground Stations Card */}
          <div className="ground-station-card polaris-card">
            <div className="panel-title-row">
              <Server size={16} className="text-emerald" />
              <h3 className="section-title">Indian Ground Station Telemetry Gateways</h3>
            </div>
            <div className="gw-item">
              <span className="gw-name">NCPOR Master Ground Terminal (Goa)</span>
              <span className="gw-status text-emerald font-bold">OPERATIONAL • 100% Uptime</span>
              <span className="gw-desc">Direct satellite uplink terminal with 7.3m Cassegrain dish antenna.</span>
            </div>
            <div className="gw-item">
              <span className="gw-name">NRSC Earth Station (Shadnagar, Hyderabad)</span>
              <span className="gw-status text-emerald font-bold">OPERATIONAL • Low-Earth Polar Tracking</span>
              <span className="gw-desc">Dedicated remote sensing payload reception for Bharati coastal radome.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
