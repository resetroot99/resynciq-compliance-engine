import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid estimate ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const estimate = await prisma.estimate.findUnique({
          where: { id },
          include: {
            vehicleInfo: true,
            compliance: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        });

        if (!estimate) {
          return res.status(404).json({ error: 'Estimate not found' });
        }

        return res.json(estimate);

      case 'DELETE':
        await prisma.estimate.delete({
          where: { id }
        });

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 