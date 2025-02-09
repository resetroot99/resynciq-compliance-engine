import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '../lib/prisma';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getSession(req, res);
      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Attach user to request
      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        include: { company: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // @ts-ignore
      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
} 