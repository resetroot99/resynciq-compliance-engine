import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class PredictionService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async getApprovalPrediction(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/prediction/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Approval prediction failed: ${error.message}`);
    }
  }

  async getPredictionConfidence(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/prediction-confidence/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Prediction confidence retrieval failed: ${error.message}`);
    }
  }
}

export const predictionService = new PredictionService(); 