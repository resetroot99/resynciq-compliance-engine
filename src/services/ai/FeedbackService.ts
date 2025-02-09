import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class FeedbackService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async submitFeedback(estimateId: string, feedback: any) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/feedback`, {
        estimateId,
        feedback
      });
      return response.data;
    } catch (error) {
      throw new Error(`Feedback submission failed: ${error.message}`);
    }
  }

  async getModelUpdates() {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/model-updates`);
      return response.data;
    } catch (error) {
      throw new Error(`Model updates retrieval failed: ${error.message}`);
    }
  }
}

export const feedbackService = new FeedbackService(); 