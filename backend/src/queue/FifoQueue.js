const { getPriorityLevel, getPriorityName } = require('./PriorityLevels');

/**
 * Standard FIFO Queue (No Priority Reordering).
 * Used as a baseline to benchmark the queueing delay reduction of the PriorityQueue.
 */
class FifoQueue {
  constructor() {
    this.items = [];
    this.insertionSequence = 0;
  }

  enqueue(message, priorityInput = 3) {
    const priorityLevel = getPriorityLevel(priorityInput);
    const now = Date.now();

    const queueElement = {
      ...message,
      message_id: message.message_id || message.id || `msg-${now}-${Math.random().toString(36).substr(2, 6)}`,
      station_id: message.station_id || 'station-bharati',
      message_type: message.message_type || (priorityLevel <= 2 ? 'EMERGENCY_ALERT' : 'TELEMETRY'),
      priority: getPriorityName(priorityLevel),
      priority_level: priorityLevel,
      created_timestamp: message.created_timestamp || now,
      created_at: message.created_at || new Date(now).toISOString(),
      queued_timestamp: now,
      queued_at: new Date(now).toISOString(),
      sequence: ++this.insertionSequence,
    };

    // Strict FIFO append at the tail of the queue
    this.items.push(queueElement);
    return queueElement;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

module.exports = FifoQueue;
