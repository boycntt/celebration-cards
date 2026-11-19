export function createRateLimiter({
  windowMs = 60_000,
  maxRequests = 10,
  message = 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  maxTrackedKeys = 1000,
} = {}) {
  const timestampsByKey = new Map();

  return function rateLimiterMiddleware(req, res, next) {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const existing = timestampsByKey.get(key) || [];
    const recent = existing.filter((ts) => now - ts < windowMs);

    if (recent.length >= maxRequests) {
      timestampsByKey.set(key, recent);
      res.status(429).json({ error: message });
      return;
    }

    recent.push(now);
    timestampsByKey.set(key, recent);

    if (timestampsByKey.size > maxTrackedKeys) {
      for (const [k, timestamps] of timestampsByKey.entries()) {
        const valid = timestamps.filter((ts) => now - ts < windowMs);
        if (valid.length === 0) {
          timestampsByKey.delete(k);
        } else {
          timestampsByKey.set(k, valid);
        }
      }
    }

    next();
  };
}
