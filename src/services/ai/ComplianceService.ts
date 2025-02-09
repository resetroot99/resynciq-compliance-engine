import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class ComplianceService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async checkCompliance(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/compliance/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Compliance check failed: ${error.message}`);
    }
  }

  async getComplianceTrends() {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/compliance-trends`);
      return response.data;
    } catch (error) {
      throw new Error(`Compliance trends retrieval failed: ${error.message}`);
    }
  }
}

export const complianceService = new ComplianceService(); 