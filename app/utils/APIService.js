import { CONFIG } from '../config/config';
import { AuthService } from '../security/AuthService';

export class APIService {
    static async makeRequest(endpoint, method, data = null) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: data ? JSON.stringify(data) : null
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            throw new Error(`API request error: ${error.message}`);
        }
    }
} 