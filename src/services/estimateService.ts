import axios from 'axios';
import { analyzeImage } from '../utils/aiUtils';
import { PrismaClient } from '@prisma/client';
import { analyzeEstimate } from './aiService';
import { validateCompliance } from './complianceService';
import logger from '../lib/logger';
import { invalidateAnalyticsCache } from '../lib/redis';
import prisma from '../lib/prisma';
import { extractVehicleInfo } from './ocrService';

const prismaClient = new PrismaClient();

export async function uploadEstimate(file: File) {
  // First, analyze the image/document using AI
  const aiAnalysis = await analyzeImage(file);
  
  // Upload to backend
  const formData = new FormData();
  formData.append('file', file);
  formData.append('analysis', JSON.stringify(aiAnalysis));
  
  const response = await axios.post('/api/estimates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

export async function validateCompliance(estimate: any) {
  const response = await axios.post('/api/compliance/validate', {
    estimate,
  });
  
  return response.data;
}

export async function processEstimate(estimateId: string) {
  logger.info({ estimateId }, 'Starting estimate processing');

  try {
    const estimate = await prisma.estimate.update({
      where: { id: estimateId },
      data: { status: 'PROCESSING' }
    });

    // Extract vehicle information using OCR
    const vehicleInfo = await extractVehicleInfo(estimate.fileUrl);
    await prisma.vehicleInfo.create({
      data: {
        ...vehicleInfo,
        estimateId: estimate.id
      }
    });

    // Run AI analysis
    const aiAnalysis = await analyzeEstimate(estimate.fileUrl);
    
    // Validate compliance
    const complianceResults = await validateCompliance(estimate.fileUrl);
    await prisma.complianceCheck.create({
      data: {
        score: complianceResults.score,
        issues: complianceResults.issues,
        estimateId: estimate.id
      }
    });

    // Update estimate status
    await prisma.estimate.update({
      where: { id: estimateId },
      data: {
        status: 'COMPLETED',
        aiAnalysis
      }
    });

    // Invalidate analytics cache
    await invalidateAnalyticsCache(estimate.companyId);

    logger.info({ estimateId }, 'Estimate processing completed');
  } catch (error) {
    logger.error({ estimateId, error }, 'Error processing estimate');

    await prisma.estimate.update({
      where: { id: estimateId },
      data: { status: 'FAILED' }
    });

    throw error;
  }
} 