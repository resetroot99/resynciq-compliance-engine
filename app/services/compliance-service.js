import { APIService } from '../utils/APIService';
import { ErrorHandler } from '../utils/ErrorHandler';
import { CONFIG } from '../config/config';

class ComplianceService {
    static async validateEstimate(estimateData) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/compliance/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(estimateData)
            });
            
            return response.json();
        } catch (error) {
            ErrorHandler.showError(error);
            throw error;
        }
    }

    static async getGuidelinesUpdate() {
        return APIService.makeRequest('/compliance/guidelines', 'GET');
    }

    static async validateOEMStandards(partsData) {
        return APIService.makeRequest('/compliance/oem-validate', 'POST', partsData);
    }

    static async checkLaborRates(laborData) {
        return APIService.makeRequest('/compliance/labor-rates', 'POST', laborData);
    }

    static async validateInsuranceStandards(estimateData) {
        return APIService.makeRequest('/compliance/insurance-validate', 'POST', estimateData);
    }

    static async validateEnvironmentalCompliance(estimateData) {
        return APIService.makeRequest('/compliance/environmental-validate', 'POST', estimateData);
    }

    static handleValidationError(error) {
        if (error.response) {
            throw new Error(`Validation failed: ${error.response.data.message}`);
        } else {
            throw new Error('Network error during validation');
        }
    }

    // Add all other methods...
}

export const complianceService = new ComplianceService(); 