import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class AIService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async processEstimate(file: File | string, type: 'pdf' | 'ems') {
    try {
      const formData = new FormData();
      if (type === 'pdf') {
        formData.append('file', file);
      } else {
        formData.append('ems', file);
      }

      const response = await axios.post(`${this.aiServiceUrl}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Estimate processing failed: ${error.message}`);
    }
  }

  async getComplianceCheck(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/compliance/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Compliance check failed: ${error.message}`);
    }
  }

  async getApprovalPrediction(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/prediction/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Approval prediction failed: ${error.message}`);
    }
  }

  async applyAutoCorrections(estimateId: string) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/auto-correct/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Auto-correction failed: ${error.message}`);
    }
  }

  async getReviewRecommendations(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/recommendations/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Recommendations retrieval failed: ${error.message}`);
    }
  }
}

export const aiService = new AIService(); 