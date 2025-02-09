import Redis from 'ioredis';
import { Analytics } from '../types/analytics';

const redis = new Redis(process.env.REDIS_URL!);

export async function getCachedAnalytics(companyId: string, type: string): Promise<Analytics | null> {
  const key = `analytics:${companyId}:${type}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheAnalytics(companyId: string, type: string, data: any): Promise<void> {
  const key = `analytics:${companyId}:${type}`;
  await redis.setex(key, 3600, JSON.stringify(data)); // Cache for 1 hour
}

export async function invalidateAnalyticsCache(companyId: string): Promise<void> {
  const keys = await redis.keys(`analytics:${companyId}:*`);
  if (keys.length) {
    await redis.del(...keys);
  }
} 