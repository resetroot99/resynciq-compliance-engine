import { estimateProcessorService } from '../services/estimate/EstimateProcessorService';

export class EstimateUtil {
  static async processEstimate(estimateData: any) {
    return estimateProcessorService.processEstimate(estimateData);
  }

  static async getEstimate(estimateId: string) {
    return estimateProcessorService.getEstimate(estimateId);
  }
} 