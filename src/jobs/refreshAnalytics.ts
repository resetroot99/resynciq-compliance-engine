import { CronJob } from 'cron';
import prisma from '../lib/prisma';
import { invalidateAnalyticsCache } from '../lib/redis';

export function startAnalyticsRefreshJob() {
  // Refresh analytics every hour
  new CronJob('0 * * * *', async () => {
    try {
      // Get all companies
      const companies = await prisma.company.findMany();

      // Refresh analytics for each company
      for (const company of companies) {
        await invalidateAnalyticsCache(company.id);
        // The next request will regenerate the analytics
      }
    } catch (error) {
      console.error('Analytics refresh job error:', error);
    }
  }).start();
} 