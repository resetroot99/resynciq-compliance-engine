// Core API service
class APIService {
    constructor() {
        this.baseURL = process.env.API_URL || 'https://api.resynciq.com/v1';
        this.version = '1.0.0';
    }

    // API implementation

    // Add version header
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'X-ReSyncIQ-Version': this.version
        };
    }
}

class API {
    constructor() {
        this.baseURL = 'https://api.resynciq.com/v1';
    }

    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}/${endpoint}`);
        Object.keys(params).forEach(key => 
            url.searchParams.append(key, params[key])
        );

        const response = await fetch(url, {
            headers: this.getHeaders()
        });

        return this.handleResponse(response);
    }

    async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        return this.handleResponse(response);
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    }
}

// API Endpoints
const APIEndpoints = {
    PROCESS_ESTIMATE: 'estimates/process',
    GET_QUEUE: 'estimates/queue',
    SAVE_RULES: 'rules/save',
    GET_RULES: 'rules',
    CCC_EXTRACT: 'integration/ccc/extract',
    GET_DRP_RULES: 'rules/drp',
    GET_APPROVAL_PATTERNS: 'ai/patterns',
    SUBMIT_FEEDBACK: 'ai/feedback',
    APPLY_CORRECTIONS: 'estimates/corrections',
    GET_ESTIMATE: 'estimates/detail'
};

// Initialize API
const api = new API(); 