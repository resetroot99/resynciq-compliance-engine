import { z } from 'zod';

export const estimateSchema = z.object({
  file: z.any(),
  vehicleInfo: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number(),
    vin: z.string()
  }).optional()
});

export const complianceRuleSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  severity: z.enum(['INFO', 'WARNING', 'ERROR']),
  parameters: z.record(z.any()),
  active: z.boolean().default(true)
}); 