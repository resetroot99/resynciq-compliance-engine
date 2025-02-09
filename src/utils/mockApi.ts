import { mockEstimates, mockAnalytics } from './mockData';

export async function uploadEstimate(file: File) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    id: `est_${Date.now()}`,
    status: 'processing',
    uploadedAt: new Date().toISOString(),
    aiAnalysis: null
  };
}

export async function getEstimates() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockEstimates;
}

export async function getAnalytics() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockAnalytics;
}

export async function processEstimate(id: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id,
    status: 'completed',
    uploadedAt: new Date().toISOString(),
    aiAnalysis: {
      damageDetected: true,
      damageLocations: ['front_bumper', 'hood'],
      severityScore: 0.85,
      recommendedRepairs: ['replace_bumper', 'repair_hood']
    }
  };
} 