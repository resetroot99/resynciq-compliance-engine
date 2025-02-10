import { CONFIG } from '../../config/config';
import { APIService } from '../../utils/APIService';

class InsurerService {
    async getRuleUpdateMessage(insurerId) {
        return APIService.makeRequest(`/insurers/${insurerId}/rule-update-message`, 'GET');
    }

    async validateInsurerRules(estimateData, insurerId) {
        return APIService.makeRequest(`/insurers/${insurerId}/validate`, 'POST', estimateData);
    }

    async getInsurerGuidelines(insurerId) {
        return APIService.makeRequest(`/insurers/${insurerId}/guidelines`, 'GET');
    }
}

export const insurerService = new InsurerService(); 