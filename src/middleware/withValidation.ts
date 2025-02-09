import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export function withValidation(schema: z.ZodSchema, handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const validatedData = schema.parse(req.body);
      // @ts-ignore
      req.validatedData = validatedData;
      return handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation Error',
          details: error.errors 
        });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
} 