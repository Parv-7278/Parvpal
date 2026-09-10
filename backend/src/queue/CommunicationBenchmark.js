const PriorityQueue = require('./PriorityQueue');
const FifoQueue = require('./FifoQueue');
const { PRIORITY } = require('./PriorityLevels');

/**
 * Runs a side-by-side comparison between:
 * 1. Standard FIFO Queue (No priority reordering)
 * 2. 4-Level Priority Queue (CRITICAL=1, HIGH=2, NORMAL=3, LOW=4)
 * 
 * Scenario:
 * - 4 Normal telemetry messages are already buffered in the queue.
 * - 1 Low priority diagnostic log is buffered.
 * - An emergency situation occurs and a CRITICAL alert arrives.
 * 
 * Demonstrates the preemption and dramatic reduction in emergency queue delay.
 */
async function runCommunicationComparison(options = {}) {
  const linkIntervalMs = options.linkIntervalMs || 600; // Time to transmit 1 packet over satellite
  const basePropagationMs = options.basePropagationMs || 240;

  console.log('====================================================================================');
  console.log('🛰️  ANTARCTIC SATELLITE COMMUNICATION SIMULATION: QUEUEING & LATENCY BENCHMARK');
  console.log('⚠️  Note: All latency and delay values are SIMULATED for prototype demonstration.');
  console.log('====================================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Benchmark: Standard FIFO Queue (No Priority)
  // ---------------------------------------------------------------------------
  console.log('┌──────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EXPERIMENT 1: Standard FIFO Queue (No Priority Ordering)                         │');
  console.log('└──────────────────────────────────────────────────────────────────────────────────┘');

  const fifoQueue = new FifoQueue();
  const fifoProcessed = [];
  const baseTime = Date.now();

  // Enqueue 4 Normal Telemetry messages at t=0
  for (let i = 1; i <= 4; i++) {
    fifoQueue.enqueue({
      message_id: `FIFO-NORM-${i}`,
      station_id: 'station-bharati',
      message_type: 'TELEMETRY',
      data: { temp: -14.0 + i },
      created_timestamp: baseTime + (i * 20),
    }, PRIORITY.NORMAL);
  }

  // Enqueue 1 Low priority log
  fifoQueue.enqueue({
    message_id: `FIFO-LOW-1`,
    station_id: 'station-bharati',
    message_type: 'DIAGNOSTIC_LOG',
    created_timestamp: baseTime + 100,
  }, PRIORITY.LOW);

  // A CRITICAL alert arrives at t=120ms (after the 5 messages are already queued)
  const criticalCreatedTime = baseTime + 120;
  fifoQueue.enqueue({
    message_id: `FIFO-CRIT-EMERGENCY`,
    station_id: 'station-bharati',
    message_type: 'EMERGENCY_ALERT',
    data: { message: 'CRITICAL: Generator Core Temp 95°C' },
    created_timestamp: criticalCreatedTime,
  }, PRIORITY.CRITICAL);

  console.log(`[FIFO] 6 messages queued. Position of CRITICAL alert in FIFO queue: #${fifoQueue.size()} (Last!)`);
  console.log(`[FIFO] Transmitting packets at 1 packet per ${linkIntervalMs}ms...\n`);

  let currentClock = baseTime;
  while (!fifoQueue.isEmpty()) {
    const msg = fifoQueue.dequeue();
    currentClock += linkIntervalMs; // Advance time by transmission slot
    
    const sentTime = currentClock;
    const receivedTime = sentTime + basePropagationMs;
    const queueDelayMs = sentTime - msg.created_timestamp;
    const totalSimulatedLatencyMs = receivedTime - msg.created_timestamp;

    fifoProcessed.push({
      ...msg,
      sent_timestamp: sentTime,
      received_timestamp: receivedTime,
      queue_delay_ms: queueDelayMs,
      total_simulated_latency_ms: totalSimulatedLatencyMs,
    });
  }

  printResultsTable(fifoProcessed, 'FIFO (No Priority)');

  // ---------------------------------------------------------------------------
  // 2. Benchmark: 4-Level Priority Queue
  // ---------------------------------------------------------------------------
  console.log('\n┌──────────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ EXPERIMENT 2: 4-Level Priority Queue (CRITICAL=1, HIGH=2, NORMAL=3, LOW=4)       │');
  console.log('└──────────────────────────────────────────────────────────────────────────────────┘');

  const priorityQueue = new PriorityQueue();
  const priorityProcessed = [];
  const pBaseTime = Date.now();

  // Enqueue 4 Normal Telemetry messages at t=0
  for (let i = 1; i <= 4; i++) {
    priorityQueue.enqueue({
      message_id: `PRIO-NORM-${i}`,
      station_id: 'station-bharati',
      message_type: 'TELEMETRY',
      data: { temp: -14.0 + i },
      created_timestamp: pBaseTime + (i * 20),
    }, PRIORITY.NORMAL);
  }

  // Enqueue 1 Low priority log
  priorityQueue.enqueue({
    message_id: `PRIO-LOW-1`,
    station_id: 'station-bharati',
    message_type: 'DIAGNOSTIC_LOG',
    created_timestamp: pBaseTime + 100,
  }, PRIORITY.LOW);

  // A CRITICAL alert arrives at t=120ms
  const pCritCreatedTime = pBaseTime + 120;
  priorityQueue.enqueue({
    message_id: `PRIO-CRIT-EMERGENCY`,
    station_id: 'station-bharati',
    message_type: 'EMERGENCY_ALERT',
    data: { message: 'CRITICAL: Generator Core Temp 95°C' },
    created_timestamp: pCritCreatedTime,
  }, PRIORITY.CRITICAL);

  console.log(`[PriorityQueue] 6 messages queued.`);
  console.log(`[PriorityQueue] Next message at front of Priority Queue: ${priorityQueue.peek().message_id} (Priority: ${priorityQueue.peek().priority} - Level ${priorityQueue.peek().priority_level})`);
  console.log(`[PriorityQueue] Transmitting packets...\n`);

  let pCurrentClock = pBaseTime;
  while (!priorityQueue.isEmpty()) {
    const msg = priorityQueue.dequeue();
    pCurrentClock += linkIntervalMs;
    
    const sentTime = pCurrentClock;
    const receivedTime = sentTime + basePropagationMs;
    const queueDelayMs = sentTime - msg.created_timestamp;
    const totalSimulatedLatencyMs = receivedTime - msg.created_timestamp;

    priorityProcessed.push({
      ...msg,
      sent_timestamp: sentTime,
      received_timestamp: receivedTime,
      queue_delay_ms: queueDelayMs,
      total_simulated_latency_ms: totalSimulatedLatencyMs,
    });
  }

  printResultsTable(priorityProcessed, 'Priority Queue (4 Levels)');

  // ---------------------------------------------------------------------------
  // 3. Side-by-Side Comparison Summary
  // ---------------------------------------------------------------------------
  const fifoCrit = fifoProcessed.find(m => m.priority_level === PRIORITY.CRITICAL);
  const prioCrit = priorityProcessed.find(m => m.priority_level === PRIORITY.CRITICAL);

  const delayReduction = fifoCrit.queue_delay_ms - prioCrit.queue_delay_ms;
  const reductionPercent = ((delayReduction / fifoCrit.queue_delay_ms) * 100).toFixed(1);

  console.log('\n====================================================================================');
  console.log('📊 COMPARISON SUMMARY: EMERGENCY MESSAGE QUEUEING ADVANTAGE');
  console.log('====================================================================================');
  console.log(`Queue Mechanism           | Queue Delay (Simulated) | Total Latency (Simulated) | Dispatch Order`);
  console.log(`--------------------------|-------------------------|---------------------------|----------------`);
  console.log(`1. FIFO / No Priority     | ${String(fifoCrit.queue_delay_ms + ' ms').padEnd(23)} | ${String(fifoCrit.total_simulated_latency_ms + ' ms').padEnd(25)} | Position #6 (Last)`);
  console.log(`2. 4-Level Priority Queue | ${String(prioCrit.queue_delay_ms + ' ms').padEnd(23)} | ${String(prioCrit.total_simulated_latency_ms + ' ms').padEnd(25)} | Position #1 (Immediate!)`);
  console.log(`------------------------------------------------------------------------------------`);
  console.log(`⚡ Emergency Queue Delay Reduced by: ${delayReduction} ms (-${reductionPercent}%)`);
  console.log(`✅ Result: CRITICAL message bypassed all 5 waiting telemetry/log messages!`);
  console.log('====================================================================================\n');

  return {
    fifo: fifoProcessed,
    priority: priorityProcessed,
    summary: {
      fifoCriticalQueueDelayMs: fifoCrit.queue_delay_ms,
      priorityCriticalQueueDelayMs: prioCrit.queue_delay_ms,
      delayReductionMs: delayReduction,
      reductionPercent: Number(reductionPercent),
    }
  };
}

function printResultsTable(records, title) {
  console.log(`--- [${title} - Processed Packets Log] ---`);
  console.log(`Order | Message ID           | Type            | Priority    | Queue Delay | Total Latency`);
  console.log(`------|----------------------|-----------------|-------------|-------------|--------------`);
  records.forEach((r, idx) => {
    const isCrit = r.priority_level === 1;
    const highlight = isCrit ? '🚨 ' : '   ';
    console.log(
      `${highlight}#${idx + 1}`.padEnd(6) + '| ' +
      `${r.message_id}`.padEnd(21) + '| ' +
      `${r.message_type}`.padEnd(16) + '| ' +
      `${r.priority} (${r.priority_level})`.padEnd(12) + '| ' +
      `${r.queue_delay_ms} ms`.padEnd(12) + '| ' +
      `${r.total_simulated_latency_ms} ms`
    );
  });
}

module.exports = {
  runCommunicationComparison,
};
