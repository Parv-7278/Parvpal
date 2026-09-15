"""
====================================================================================
Antarctic Research Station Communication Simulator: Priority Queue vs FIFO
====================================================================================
Demonstrates priority-based message delivery over a simulated satellite uplink.

Four Priority Levels:
  CRITICAL = 1 (Emergency life-support, thermal runaway, power collapse)
  HIGH     = 2 (Approaching safe thresholds, storm warning)
  NORMAL   = 3 (Periodic routine sensor telemetry)
  LOW      = 4 (Diagnostic logs & maintenance records)

Formulas (Clearly labeled as Simulated Latency):
  queue delay   = sent time - created time
  total latency = received time - created time
"""

import sys
import time
from datetime import datetime, timezone

# Fix Windows console UTF-8 UnicodeEncodeError
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# 1. Define Priority Levels
CRITICAL = 1
HIGH = 2
NORMAL = 3
LOW = 4

PRIORITY_LABELS = {
    1: "CRITICAL",
    2: "HIGH",
    3: "NORMAL",
    4: "LOW"
}

# ----------------------------------------------------------------------------------
# Queue Implementations
# ----------------------------------------------------------------------------------
class Message:
    def __init__(self, message_id, station_id, message_type, priority, created_time_ms):
        self.message_id = message_id
        self.station_id = station_id
        self.message_type = message_type
        self.priority_level = priority
        self.priority_name = PRIORITY_LABELS[priority]
        self.created_timestamp = created_time_ms
        self.created_at = datetime.fromtimestamp(created_time_ms / 1000, tz=timezone.utc).strftime("%H:%M:%S.%f")[:-3]

        # Delivery timing fields (calculated upon transmission)
        self.sent_timestamp = None
        self.sent_at = None
        self.received_timestamp = None
        self.received_at = None
        self.queue_delay_ms = None
        self.total_simulated_latency_ms = None


class FifoQueue:
    """Standard First-In-First-Out Queue (No Priority Reordering)."""
    def __init__(self):
        self.items = []

    def enqueue(self, message):
        self.items.append(message)

    def dequeue(self):
        return self.items.pop(0) if self.items else None

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)


class PriorityQueue:
    """4-Level Priority Queue: Lower number = Higher priority."""
    def __init__(self):
        self.items = []

    def enqueue(self, message):
        # Insert maintaining priority order (1 -> 2 -> 3 -> 4), ties preserve FIFO
        added = False
        for i in range(len(self.items)):
            if message.priority_level < self.items[i].priority_level:
                self.items.insert(i, message)
                added = True
                break
        if not added:
            self.items.append(message)

    def dequeue(self):
        return self.items.pop(0) if self.items else None

    def peek(self):
        return self.items[0] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)


# ----------------------------------------------------------------------------------
# Simulation Benchmark Engine
# ----------------------------------------------------------------------------------
def run_simulation(queue_class, queue_name, link_rate_ms=600, propagation_ms=240):
    queue = queue_class()
    start_time = int(time.time() * 1000)

    # 1. Enqueue 4 Normal Telemetry messages
    for i in range(1, 5):
        msg = Message(
            message_id=f"TEL-NORM-0{i}",
            station_id="station-bharati",
            message_type="TELEMETRY",
            priority=NORMAL,
            created_time_ms=start_time + (i * 20)
        )
        queue.enqueue(msg)

    # 2. Enqueue 1 Low Priority Diagnostic Log
    queue.enqueue(Message(
        message_id="LOG-LOW-01",
        station_id="station-bharati",
        message_type="DIAGNOSTIC_LOG",
        priority=LOW,
        created_time_ms=start_time + 100
    ))

    # 3. Emergency incident occurs: CRITICAL alert arrives at t = 120ms
    crit_msg = Message(
        message_id="EMERGENCY-CRIT-95C",
        station_id="station-bharati",
        message_type="EMERGENCY_ALERT",
        priority=CRITICAL,
        created_time_ms=start_time + 120
    )
    queue.enqueue(crit_msg)

    # Process all messages over simulated satellite link
    processed = []
    current_clock = start_time

    while not queue.is_empty():
        msg = queue.dequeue()
        current_clock += link_rate_ms  # satellite channel transmission interval

        # Record transmission timestamps
        msg.sent_timestamp = current_clock
        msg.sent_at = datetime.fromtimestamp(msg.sent_timestamp / 1000, tz=timezone.utc).strftime("%H:%M:%S.%f")[:-3]

        msg.received_timestamp = msg.sent_timestamp + propagation_ms
        msg.received_at = datetime.fromtimestamp(msg.received_timestamp / 1000, tz=timezone.utc).strftime("%H:%M:%S.%f")[:-3]

        # Calculate Queue Delay and Total Latency
        # Formula 1: queue delay = sent time - created time
        msg.queue_delay_ms = msg.sent_timestamp - msg.created_timestamp

        # Formula 2: total latency = received time - created time
        msg.total_simulated_latency_ms = msg.received_timestamp - msg.created_timestamp

        processed.append(msg)

    return processed


def print_table(messages, title):
    print(f"\n--- [{title} - Simulated Dispatch Log] ---")
    print(f"Order | Message ID           | Type            | Priority       | Queue Delay   | Total Latency")
    print(f"------|----------------------|-----------------|----------------|---------------|---------------")
    for idx, m in enumerate(messages, 1):
        icon = "🚨 " if m.priority_level == 1 else "   "
        print(f"{icon}#{idx:<3}| {m.message_id:<21}| {m.message_type:<16}| {m.priority_name} (Lvl {m.priority_level})   | {str(m.queue_delay_ms) + ' ms':<14}| {str(m.total_simulated_latency_ms) + ' ms'}")


def main():
    print("====================================================================================")
    print("🛰️  ANTARCTIC RESEARCH STATION: SATELLITE COMMUNICATION SIMULATION")
    print("⚠️  [DISCLAIMER]: All delay and latency values are SIMULATED for prototype evaluation.")
    print("====================================================================================")

    # 1. Run FIFO (No Priority)
    fifo_results = run_simulation(FifoQueue, "FIFO Queue")
    print_table(fifo_results, "Experiment 1: Standard FIFO Queue (No Priority)")

    # 2. Run Priority Queue (4 Priority Levels)
    priority_results = run_simulation(PriorityQueue, "4-Level Priority Queue")
    print_table(priority_results, "Experiment 2: 4-Level Priority Queue (CRITICAL=1, HIGH=2, NORMAL=3, LOW=4)")

    # 3. Compare Emergency Delays
    fifo_crit = next(m for m in fifo_results if m.priority_level == CRITICAL)
    prio_crit = next(m for m in priority_results if m.priority_level == CRITICAL)

    reduction_ms = fifo_crit.queue_delay_ms - prio_crit.queue_delay_ms
    reduction_pct = (reduction_ms / fifo_crit.queue_delay_ms) * 100

    print("\n====================================================================================")
    print("📊 COMPARISON SUMMARY: EMERGENCY MESSAGE QUEUEING DELAY")
    print("====================================================================================")
    print(f"Queueing Mechanism       | Queue Delay (Simulated) | Total Latency (Simulated) | Position in Queue")
    print(f"-------------------------|-------------------------|---------------------------|------------------")
    print(f"1. FIFO / No Priority    | {str(fifo_crit.queue_delay_ms) + ' ms':<24}| {str(fifo_crit.total_simulated_latency_ms) + ' ms':<26}| Position #6 (Last)")
    print(f"2. Priority Queue (Lvl 1)| {str(prio_crit.queue_delay_ms) + ' ms':<24}| {str(prio_crit.total_simulated_latency_ms) + ' ms':<26}| Position #1 (Immediate!)")
    print(f"------------------------------------------------------------------------------------")
    print(f"⚡ Emergency Queueing Delay Reduction: {reduction_ms} ms (-{reduction_pct:.1f}%)")
    print(f"✅ Result: The CRITICAL alert preempted all 5 normal/low packets and was dispatched first!")
    print("====================================================================================\n")


if __name__ == "__main__":
    main()
