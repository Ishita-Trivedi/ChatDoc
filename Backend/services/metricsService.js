const samples = [];
const MAX_SAMPLES = 500;

const recordMetric = (metric) => {
  samples.push({ ...metric, timestamp: new Date().toISOString() });
  if (samples.length > MAX_SAMPLES) samples.shift();
};

const percentile = (values, p) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
};

const getMetrics = (ownerId) => {
  const scoped = samples.filter((sample) => !ownerId || sample.ownerId === ownerId);
  const successful = scoped.filter((sample) => sample.success);
  const durations = successful.map((sample) => sample.durationMs);
  return {
    requests: scoped.length,
    successRate: scoped.length ? Number((successful.length / scoped.length).toFixed(3)) : 1,
    latencyMs: { p50: percentile(durations, 50), p95: percentile(durations, 95) },
    averageCitations: successful.length
      ? Number((successful.reduce((sum, sample) => sum + sample.citationCount, 0) / successful.length).toFixed(2)) : 0,
    recent: scoped.slice(-20).reverse().map(({ ownerId: _ownerId, ...sample }) => sample),
  };
};

module.exports = { recordMetric, getMetrics };
