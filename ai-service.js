class OCRService {
    static async extractFromPDF(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/ocr/extract`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }

    static async processEMS(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/ems/process`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }
}

class PredictiveModel {
    static async getApprovalProbability(estimateData) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/ai/predict-approval`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estimateData)
        });
        
        return response.json();
    }

    static async submitFeedback(estimateId, outcome) {
        return APIService.makeRequest('/ai/feedback', 'POST', {
            estimateId,
            outcome,
            timestamp: new Date().toISOString()
        });
    }
} 