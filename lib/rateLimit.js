// A simple in-memory rate limiter for development
// In production, use Upstash Redis or a database-based limiter.

const cache = new Map();

export function rateLimit(req, limit = 5, windowMs = 60000) {
  // Get IP address (works in most hosting environments)
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  const now = Date.now();
  const record = cache.get(ip) || { count: 0, resetTime: now + windowMs };

  // Reset count if window has passed
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  record.count += 1;
  cache.set(ip, record);

  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: new Date(record.resetTime).toISOString(),
  };
}