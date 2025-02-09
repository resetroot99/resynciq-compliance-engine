import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { userId } = req.query;

    const [totalEstimates, complianceData, pendingReviews] = await Promise.all([
      prisma.estimate.count({
        where: { userId: userId as string }
      }),
      prisma.estimate.findMany({
        where: { userId: userId as string },
        select: { compliance: true }
      }),
      prisma.estimate.count({
        where: {
          userId: userId as string,
          status: 'PENDING_REVIEW'
        }
      })
    ]);

    const complianceRate = complianceData.reduce(
      (acc, est) => acc + (est.compliance || 0),
      0
    ) / (complianceData.length || 1) * 100;

    res.json({
      totalEstimates,
      complianceRate: Math.round(complianceRate),
      pendingReviews
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 