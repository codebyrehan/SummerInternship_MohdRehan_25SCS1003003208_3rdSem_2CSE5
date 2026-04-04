import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

let redisClient = null;
let useRedis = false;

try {
  // Only try to connect if REDIS_URL is present, or for local dev if specifically enabled
  if (process.env.REDIS_URL || process.env.ENABLE_REDIS === 'true') {
     redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
       maxRetriesPerRequest: 1,
       retryStrategy: (times) => null, // Stop retrying immediately
     });
     
     redisClient.on('error', (err) => {
       console.error('⚠️  Redis unavailable, falling back to memory store.');
       useRedis = false;
     });

     redisClient.on('connect', () => {
       console.log('✅ Redis rate limiter connected');
       useRedis = true;
     });
  }
} catch (error) {
  console.warn('⚠️  Redis failed initialization, using memory store.');
}

const getStore = () => {
  if (redisClient && useRedis) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  }
  return undefined; // Falls back to express-rate-limit memory store
};

// Auth routes: 5 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

// AI routes: 20 calls per hour per user
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'AI rate limit reached. Try again in an hour.' },
  keyGenerator: (req) => req.userId?.toString() || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

// General API: 100 requests per 15 min
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  store: getStore(),
});
