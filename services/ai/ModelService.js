import axios from 'axios';
import config from '../../config';

class ModelService {
  constructor() {
    this.modelPath = config.aiModelPath;
  }

  async loadModel(modelName, version) {
    const response = await axios.get(`${this.modelPath}/${modelName}/${version}`);
    return response.data;
  }

  async checkModelStatus(modelName) {
    const response = await axios.get(`${this.modelPath}/${modelName}/status`);
    return response.data;
  }
}

export const modelService = new ModelService(); 