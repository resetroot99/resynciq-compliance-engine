// API Service Layer
class APIService {
    static async makeRequest(endpoint, method = 'GET', data = null) {
        const url = CONFIG.API_BASE_URL + endpoint;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers here
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
}

// Estimate Service
class EstimateService {
    static async uploadEstimate(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.upload, {
            method: 'POST',
            body: formData
        });
        return response.json();
    }

    static async analyzeEstimate(estimateId) {
        return APIService.makeRequest(CONFIG.ENDPOINTS.analyze + `/${estimateId}`, 'POST');
    }

    static async getRecommendations(estimateId) {
        return APIService.makeRequest(CONFIG.ENDPOINTS.recommendations + `/${estimateId}`);
    }

    static async getCompliance(estimateId) {
        return APIService.makeRequest(CONFIG.ENDPOINTS.compliance + `/${estimateId}`);
    }

    static async processEstimate(estimateId, action) {
        return APIService.makeRequest(CONFIG.ENDPOINTS.process + `/${estimateId}`, 'POST', { action });
    }
}

// Queue Service
class QueueService {
    static async getQueueItems(filter = 'all', search = '') {
        const params = new URLSearchParams({ filter, search });
        return APIService.makeRequest(CONFIG.ENDPOINTS.queue + `?${params}`);
    }

    static async updateQueueItem(itemId, updates) {
        return APIService.makeRequest(CONFIG.ENDPOINTS.queue + `/${itemId}`, 'PATCH', updates);
    }
}

// AI Analysis Service
class AIService {
    static async analyzeLaborRates(estimateData) {
        return APIService.makeRequest('/ai/labor-rates', 'POST', estimateData);
    }

    static async validateParts(partsData) {
        return APIService.makeRequest('/ai/parts-validation', 'POST', partsData);
    }

    static async getPredictiveApproval(estimateId) {
        return APIService.makeRequest('/ai/predictive-approval/' + estimateId);
    }
} 