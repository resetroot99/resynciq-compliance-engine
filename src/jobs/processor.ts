import { CronJob } from 'cron';
import prisma from '../lib/prisma';
import { processEstimate } from '../services/estimateService';
import { invalidateAnalyticsCache } from '../lib/redis';

export function startJobProcessor() {
  // Process pending estimates every minute
  new CronJob('* * * * *', async () => {
    try {
      const pendingEstimates = await prisma.estimate.findMany({
        where: { status: 'UPLOADED' },
        take: 10, // Process 10 at a time
      });

      for (const estimate of pendingEstimates) {
        await processEstimate(estimate.id);
      }
    } catch (error) {
      console.error('Job processor error:', error);
    }
  }).start();

  // Cleanup old files daily
  new CronJob('0 0 * * *', async () => {
    // Cleanup logic here
  }).start();
} 