// lib/rateLimit.js

// In-memory store: { ip: [timestamp, timestamp, ...] }
const requestLog = new Map();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLog.entries()) {
    const valid = timestamps.filter((ts) => now - ts < 60 * 1000); // keep last 60 seconds
    if (valid.length === 0) {
      requestLog.delete(ip);
    } else {
      requestLog.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limiter middleware for API routes.
 * @param {Request} req - Next.js Request object
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Time window in milliseconds (default 60,000)
 * @returns {object} { success: boolean, limit, remaining, resetTime }
 */
export function rateLimit(req, limit = 100, windowMs = 60 * 1000) {
  // Get IP from headers (for production behind proxies)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             req.ip ||
             'unknown';

  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetTime = oldest + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: new Date(resetTime).toISOString(),
    };
  }

  // Add current request timestamp
  validTimestamps.push(now);
  requestLog.set(ip, validTimestamps);

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetTime: new Date(now + windowMs).toISOString(),
  };
}