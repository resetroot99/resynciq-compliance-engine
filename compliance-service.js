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

    static async validateEstimateTimeline(estimateData) {
        return APIService.makeRequest('/compliance/timeline-validate', 'POST', estimateData);
    }

    static async validateEstimatePhotos(photos) {
        return APIService.makeRequest('/compliance/photos-validate', 'POST', photos);
    }

    static async validateSupplements(supplements) {
        return APIService.makeRequest('/compliance/supplements-validate', 'POST', supplements);
    }

    static async validateRepairProcedures(procedures) {
        return APIService.makeRequest('/compliance/repair-procedures', 'POST', {
            procedures,
            validateAgainst: ['OEM', 'I-CAR', 'ASE']
        });
    }

    static async validateDocumentation(docs) {
        return APIService.makeRequest('/compliance/documentation', 'POST', {
            documents: docs,
            requiredTypes: ['estimate', 'photos', 'measurements']
        });
    }

    static async generateComplianceReport(estimateId) {
        return APIService.makeRequest(`/compliance/report/${estimateId}`, 'GET');
    }

    static handleValidationError(error) {
        if (error.response) {
            throw new Error(`Validation failed: ${error.response.data.message}`);
        } else {
            throw new Error('Network error during validation');
        }
    }

    static logValidationError(error) {
        console.error('Validation Error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    static async validateBatchEstimates(estimates) {
        const batchSize = 10;
        const results = [];
        
        for (let i = 0; i < estimates.length; i += batchSize) {
            const batch = estimates.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(estimate => this.validateEstimate(estimate))
            );
            results.push(...batchResults);
        }
        
        return results;
    }

    static async reportValidationError(error, context) {
        await fetch('/api/errors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            },
            body: JSON.stringify({
                error: error.message,
                context,
                timestamp: new Date().toISOString()
            })
        });
    }
} 