import React from 'react';
import { ArrowDownUp, Zap, Clock, Info, ShieldAlert, FileText } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function LatencyChart() {
  const { queueMetrics } = useTelemetry();
  const { summary, queueSnapshot, recentLogs } = queueMetrics;

  const critStats = summary?.critical || { avgQueueDelayMs: 0, avgTotalLatencyMs: 0, count: 0 };
  const highStats = summary?.high || { avgQueueDelayMs: 0, avgTotalLatencyMs: 0, count: 0 };
  const normStats = summary?.normal || { avgQueueDelayMs: 0, avgTotalLatencyMs: 0, count: 0 };
  const lowStats = summary?.low || { avgQueueDelayMs: 0, avgTotalLatencyMs: 0, count: 0 };

  return (
    <div className="latency-panel glass-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <ArrowDownUp className="text-cyan" size={20} />
          <h2>4-Level Priority Queue & Satellite Link Latency Monitor</h2>
        </div>
        <div className="queue-badge mono-text">
          Buffer Queue: <span className="text-cyan">{queueSnapshot?.count || 0} pkts</span>
        </div>
      </div>

      {/* 4 Priority Level Metrics Cards Grid */}
      <div className="latency-4col-grid">
        {/* Level 1: CRITICAL */}
        <div className="latency-level-card border-critical-lvl">
          <div className="level-card-header">
            <span className="badge badge-critical">Level 1: CRITICAL</span>
            <Zap size={14} className="text-rose" />
          </div>
          <div className="level-stat-row">
            <div>
              <div className="level-label">Queue Delay</div>
              <div className="level-val mono-text text-emerald">{critStats.avgQueueDelayMs} ms</div>
            </div>
            <div>
              <div className="level-label">Total Latency</div>
              <div className="level-val mono-text text-rose">{critStats.avgTotalLatencyMs} ms</div>
            </div>
          </div>
          <div className="level-tagline">⚡ Preempts transmission buffer</div>
        </div>

        {/* Level 2: HIGH */}
        <div className="latency-level-card border-high-lvl">
          <div className="level-card-header">
            <span className="badge badge-high">Level 2: HIGH</span>
            <ShieldAlert size={14} className="text-amber" />
          </div>
          <div className="level-stat-row">
            <div>
              <div className="level-label">Queue Delay</div>
              <div className="level-val mono-text text-amber">{highStats.avgQueueDelayMs} ms</div>
            </div>
            <div>
              <div className="level-label">Total Latency</div>
              <div className="level-val mono-text text-amber">{highStats.avgTotalLatencyMs} ms</div>
            </div>
          </div>
          <div className="level-tagline">⚠️ Dispatched before normal packets</div>
        </div>

        {/* Level 3: NORMAL */}
        <div className="latency-level-card border-normal-lvl">
          <div className="level-card-header">
            <span className="badge badge-normal">Level 3: NORMAL</span>
            <Clock size={14} className="text-blue" />
          </div>
          <div className="level-stat-row">
            <div>
              <div className="level-label">Queue Delay</div>
              <div className="level-val mono-text text-blue">{normStats.avgQueueDelayMs} ms</div>
            </div>
            <div>
              <div className="level-label">Total Latency</div>
              <div className="level-val mono-text text-blue">{normStats.avgTotalLatencyMs} ms</div>
            </div>
          </div>
          <div className="level-tagline">📦 Rate-limited routine telemetry</div>
        </div>

        {/* Level 4: LOW */}
        <div className="latency-level-card border-low-lvl">
          <div className="level-card-header">
            <span className="badge badge-category">Level 4: LOW</span>
            <FileText size={14} className="text-muted" />
          </div>
          <div className="level-stat-row">
            <div>
              <div className="level-label">Queue Delay</div>
              <div className="level-val mono-text text-muted">{lowStats.avgQueueDelayMs} ms</div>
            </div>
            <div>
              <div className="level-label">Total Latency</div>
              <div className="level-val mono-text text-muted">{lowStats.avgTotalLatencyMs} ms</div>
            </div>
          </div>
          <div className="level-tagline">📄 Diagnostic & maintenance logs</div>
        </div>
      </div>

      {/* Live Dispatched Satellite Packets Table */}
      <div className="packet-stream-section">
        <h4 className="stream-title mono-text">Live Dispatched Satellite Packet Stream</h4>
        <div className="packet-table-wrapper">
          <table className="packet-table mono-text">
            <thead>
              <tr>
                <th>Message ID</th>
                <th>Station</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Queue Delay</th>
                <th>Simulated Propagation</th>
                <th>Total Simulated Latency</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs && recentLogs.length > 0 ? (
                recentLogs.slice(0, 8).map((pkt) => {
                  const isCrit = pkt.priority_level === 1 || pkt.priority === 'CRITICAL';
                  const isHigh = pkt.priority_level === 2 || pkt.priority === 'HIGH';
                  return (
                    <tr key={pkt.message_id || pkt.packet_id} className={isCrit ? 'row-critical' : isHigh ? 'row-high' : ''}>
                      <td>{(pkt.message_id || pkt.packet_id || '').substring(0, 18)}</td>
                      <td>{(pkt.station_id || '').replace('station-', '')}</td>
                      <td>{pkt.message_type || pkt.packet_type}</td>
                      <td>
                        <span className={`badge ${isCrit ? 'badge-critical' : isHigh ? 'badge-high' : 'badge-normal'}`}>
                          {pkt.priority} ({pkt.priority_level || (isCrit ? 1 : isHigh ? 2 : 3)})
                        </span>
                      </td>
                      <td className={pkt.queue_delay_ms < 100 ? 'text-emerald font-bold' : 'text-amber'}>
                        {pkt.queue_delay_ms} ms
                      </td>
                      <td>{pkt.simulated_transmission_ms} ms</td>
                      <td className="text-cyan font-bold">{pkt.total_simulated_latency_ms || pkt.total_latency_ms} ms</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No satellite packets processed yet. Start the simulator to begin stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latency Simulation Disclaimer */}
      <div className="latency-disclaimer">
        <Info size={14} />
        <span>
          Note: This is a software simulation demonstrating 4-level priority queueing over a constrained link. Latency values represent <strong>Simulated Latency</strong>, not live Antarctic satellite infrastructure.
        </span>
      </div>
    </div>
  );
}
