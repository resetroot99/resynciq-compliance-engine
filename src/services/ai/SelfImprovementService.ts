import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class SelfImprovementService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async triggerSelfImprovement() {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/self-improve`);
      return response.data;
    } catch (error) {
      throw new Error(`Self-improvement trigger failed: ${error.message}`);
    }
  }

  async getImprovementStatus() {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/improvement-status`);
      return response.data;
    } catch (error) {
      throw new Error(`Improvement status retrieval failed: ${error.message}`);
    }
  }
}

export const selfImprovementService = new SelfImprovementService(); 