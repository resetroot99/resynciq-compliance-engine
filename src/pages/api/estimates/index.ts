import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';
import { uploadToFirebase } from '../../../lib/firebase';
import { processEstimate } from '../../../services/estimateService';

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
        const user = await prisma.user.findUnique({
          where: { auth0Id: session.user.sub },
          include: { company: true }
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const fileUrl = await uploadToFirebase(req.body.file);

        const estimate = await prisma.estimate.create({
          data: {
            status: 'UPLOADED',
            fileUrl,
            userId: user.id,
            companyId: user.companyId!
          }
        });

        // Process estimate asynchronously
        processEstimate(estimate.id).catch(console.error);

        return res.status(201).json(estimate);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 