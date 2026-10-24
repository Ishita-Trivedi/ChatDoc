const buckets = new Map();

const rateLimit = ({ windowMs = 60_000, limit = 30 } = {}) => (req, res, next) => {
  const key = req.userId || req.ip;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }
  bucket.count += 1;
  res.set('RateLimit-Limit', String(limit));
  res.set('RateLimit-Remaining', String(Math.max(0, limit - bucket.count)));
  if (bucket.count > limit) {
    res.set('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }
  return next();
};

module.exports = { rateLimit };
