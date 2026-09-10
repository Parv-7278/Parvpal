const { PRIORITY, getPriorityLevel, getPriorityName } = require('./PriorityLevels');

/**
 * PriorityQueue implementation for Antarctic Satellite Link.
 * Lower numeric priority level = higher urgency (1: CRITICAL, 2: HIGH, 3: NORMAL, 4: LOW).
 * Items with identical priority levels maintain strict First-In-First-Out (FIFO) ordering.
 */
class PriorityQueue {
  constructor() {
    this.items = [];
    this.insertionSequence = 0;
  }

  enqueue(message, priorityInput = PRIORITY.NORMAL) {
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

    // Insert maintaining priority order (level 1 before 2, 3, 4; ties preserve FIFO)
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority_level < this.items[i].priority_level) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }

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
    this.insertionSequence = 0;
  }

  getSnapshot() {
    return {
      count: this.items.length,
      criticalCount: this.items.filter(i => i.priority_level === 1).length,
      highCount: this.items.filter(i => i.priority_level === 2).length,
      normalCount: this.items.filter(i => i.priority_level === 3).length,
      lowCount: this.items.filter(i => i.priority_level === 4).length,
      items: this.items.slice(0, 15),
    };
  }
}

module.exports = PriorityQueue;
