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
} 