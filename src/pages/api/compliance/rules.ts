import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../middleware/withAuth';
import { withValidation } from '../../../middleware/withValidation';
import { complianceRuleSchema } from '../../../schemas/api';
import prisma from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const rules = await prisma.complianceRule.findMany({
          where: { active: true },
          orderBy: { category: 'asc' }
        });
        return res.json(rules);

      case 'POST':
        // @ts-ignore
        const user = req.user;
        if (user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Forbidden' });
        }

        const rule = await prisma.complianceRule.create({
          // @ts-ignore
          data: req.validatedData
        });
        return res.status(201).json(rule);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAuth(
  withValidation(complianceRuleSchema, handler)
); 