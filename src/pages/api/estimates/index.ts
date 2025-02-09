import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';
import { uploadToFirebase } from '../../../lib/firebase';
import { processEstimate } from '../../../services/estimateService';
import { estimateProcessor } from '../../../services/estimate-processor';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const estimates = await prisma.estimate.findMany({
          where: {
            user: {
              auth0Id: session.user.sub
            }
          },
          include: {
            vehicleInfo: true,
            compliance: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return res.json(estimates);

      case 'POST':
        const result = await estimateProcessor.processEstimate(req.body);
        res.status(200).json(result);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 