import React, { useState } from 'react';
import { Play, ArrowRight, Zap, Clock, ShieldCheck, Info } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export default function BenchmarkView() {
  const { benchmarkData, runLiveBenchmark } = useTelemetry();
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    await runLiveBenchmark();
    setTimeout(() => setIsRunning(false), 600);
  };

  const summary = benchmarkData?.summary;
  const fifoList = benchmarkData?.fifo || [];
  const priorityList = benchmarkData?.priority || [];

  return (
    <div className="benchmark-card glass-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <Zap className="text-cyan" size={20} />
          <h2>Satellite Communication Benchmark: FIFO vs 4-Level Priority Queue</h2>
        </div>
        <button 
          onClick={handleRun} 
          disabled={isRunning}
          className="btn-benchmark-run mono-text"
        >
          <Play size={14} className={isRunning ? 'animate-spin' : ''} />
          {isRunning ? 'Simulating Uplink...' : 'Run Live Benchmark'}
        </button>
      </div>

      <div className="benchmark-body">
        <p className="benchmark-explanation">
          Demonstrates how emergency packets (Priority 1) preempt lower-priority messages in a bandwidth-constrained satellite link.
        </p>

        {summary ? (
          <>
            {/* Top comparison summary cards */}
            <div className="benchmark-comparison-grid">
              <div className="benchmark-stat-card border-fifo">
                <div className="benchmark-card-badge text-muted">1. FIFO (No Priority)</div>
                <div className="benchmark-stat-val text-amber mono-text">
                  {summary.fifoCriticalQueueDelayMs} ms
                </div>
                <div className="benchmark-stat-sub">Emergency Message Queue Delay</div>
                <div className="benchmark-position-tag text-rose mono-text">
                  Dispatch Order: #6 (Last behind normal packets)
                </div>
              </div>

              <div className="benchmark-stat-card border-priority">
                <div className="benchmark-card-badge text-cyan">2. 4-Level Priority Queue</div>
                <div className="benchmark-stat-val text-emerald mono-text">
                  {summary.priorityCriticalQueueDelayMs} ms
                </div>
                <div className="benchmark-stat-sub">Emergency Message Queue Delay</div>
                <div className="benchmark-position-tag text-emerald mono-text">
                  Dispatch Order: #1 (Instant Preemption!)
                </div>
              </div>

              <div className="benchmark-stat-card border-highlight">
                <div className="benchmark-card-badge text-emerald">Efficiency Gain</div>
                <div className="benchmark-stat-val text-cyan mono-text">
                  -{summary.reductionPercent}%
                </div>
                <div className="benchmark-stat-sub">Queue Delay Reduction</div>
                <div className="benchmark-position-tag text-cyan mono-text">
                  Saved: {summary.delayReductionMs} ms of emergency lag
                </div>
              </div>
            </div>

            {/* Side-by-side Tables */}
            <div className="tables-comparison-split">
              <div className="split-table-col">
                <h4 className="table-subheading text-muted mono-text">FIFO Queue Transmission Log</h4>
                <div className="packet-table-wrapper">
                  <table className="packet-table mono-text">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Message ID</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Queue Delay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fifoList.map((m, idx) => (
                        <tr key={m.message_id} className={m.priority_level === 1 ? 'row-critical' : ''}>
                          <td>#{idx + 1}</td>
                          <td>{m.message_id}</td>
                          <td>{m.message_type}</td>
                          <td>
                            <span className={`badge ${m.priority_level === 1 ? 'badge-critical' : m.priority_level === 2 ? 'badge-high' : 'badge-normal'}`}>
                              {m.priority} ({m.priority_level})
                            </span>
                          </td>
                          <td className={m.priority_level === 1 ? 'text-rose font-bold' : ''}>
                            {m.queue_delay_ms} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="split-table-col">
                <h4 className="table-subheading text-cyan mono-text">Priority Queue Transmission Log</h4>
                <div className="packet-table-wrapper">
                  <table className="packet-table mono-text">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Message ID</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Queue Delay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priorityList.map((m, idx) => (
                        <tr key={m.message_id} className={m.priority_level === 1 ? 'row-critical' : ''}>
                          <td>#{idx + 1}</td>
                          <td>{m.message_id}</td>
                          <td>{m.message_type}</td>
                          <td>
                            <span className={`badge ${m.priority_level === 1 ? 'badge-critical' : m.priority_level === 2 ? 'badge-high' : 'badge-normal'}`}>
                              {m.priority} ({m.priority_level})
                            </span>
                          </td>
                          <td className={m.priority_level === 1 ? 'text-emerald font-bold' : ''}>
                            {m.queue_delay_ms} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="benchmark-placeholder">
            <ShieldCheck size={36} className="text-cyan" />
            <p>Click <strong>"Run Live Benchmark"</strong> above to execute a real-time side-by-side comparison of FIFO vs Priority Queueing.</p>
          </div>
        )}

        <div className="latency-disclaimer">
          <Info size={14} />
          <span>
            Note: All values represent <strong>Simulated Latency</strong> calculated for demonstration of priority satellite packet scheduling.
          </span>
        </div>
      </div>
    </div>
  );
}
