import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class AutoCorrectionService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = ConfigUtil.get('AI_SERVICE_URL');
  }

  async getCorrectionSuggestions(estimateId: string) {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/corrections/${estimateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Correction suggestions retrieval failed: ${error.message}`);
    }
  }

  async applyCorrections(estimateId: string, corrections: any) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/apply-corrections`, {
        estimateId,
        corrections
      });
      return response.data;
    } catch (error) {
      throw new Error(`Correction application failed: ${error.message}`);
    }
  }
}

export const autoCorrectionService = new AutoCorrectionService(); 