import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class DashboardService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async getDashboardData(userId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Dashboard data retrieval failed: ${error.message}`);
    }
  }

  async getContextualSuggestions(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/suggestions/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Contextual suggestions retrieval failed: ${error.message}`);
    }
  }
}

export const dashboardService = new DashboardService(); 