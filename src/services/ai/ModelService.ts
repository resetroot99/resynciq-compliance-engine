import axios from 'axios';
import { ConfigUtil } from '../../utils/ConfigUtil';

export class ModelService {
  private modelServiceUrl: string;

  constructor() {
    this.modelServiceUrl = ConfigUtil.get('MODEL_SERVICE_URL');
  }

  async updateModel(modelName: string, version: string) {
    try {
      const response = await axios.post(`${this.modelServiceUrl}/update-model`, {
        model: modelName,
        version
      });
      return response.data;
    } catch (error) {
      throw new Error(`Model update failed: ${error.message}`);
    }
  }

  async getModelStatus(modelName: string) {
    try {
      const response = await axios.get(`${this.modelServiceUrl}/status/${modelName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Model status check failed: ${error.message}`);
    }
  }
}

export const modelService = new ModelService(); 