/**
 * Node.js CLI runner for the Communication Simulation & Latency Benchmark.
 */

const { runCommunicationComparison } = require('./src/queue/CommunicationBenchmark');

runCommunicationComparison()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Benchmark failed:', err);
    process.exit(1);
  });
