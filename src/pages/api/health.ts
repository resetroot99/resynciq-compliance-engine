import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Redis } from 'ioredis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    const redis = new Redis(process.env.REDIS_URL);
    await redis.ping();
    await redis.quit();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 