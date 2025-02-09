import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
} 