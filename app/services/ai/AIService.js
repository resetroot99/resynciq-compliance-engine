import { CONFIG } from '../../config/config';
import { APIService } from '../../utils/APIService';

class AIService {
    async getUpdateMessage(updateType) {
        return APIService.makeRequest('/ai/update-message', 'POST', { updateType });
    }

    async validateWithAI(data) {
        return APIService.makeRequest('/ai/validate', 'POST', data);
    }

    async getPredictions(estimateData) {
        return APIService.makeRequest('/ai/predict', 'POST', estimateData);
    }
}

export const aiService = new AIService(); 