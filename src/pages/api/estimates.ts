import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Here you would typically:
    // 1. Process the uploaded file
    // 2. Store it in Firebase Storage
    // 3. Save the metadata to your database
    // 4. Return the processed estimate data

    // For now, we'll return mock data
    return res.status(200).json({
      id: 'est_' + Date.now(),
      status: 'processed',
      uploadedAt: new Date().toISOString(),
      aiAnalysis: {
        damageDetected: true,
        damageLocations: ['front_bumper', 'hood'],
        severityScore: 0.8,
        recommendedRepairs: ['replace_bumper', 'repair_hood'],
      }
    });
  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({ message: 'Error processing estimate' });
  }
} 