import { handleError } from './ErrorHandler';
import { authService } from '../services/core/AuthService';

export class ApiClient {
  private static BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.complianceiq.com';

  static async request(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ) {
    try {
      const token = authService.getCurrentUser()?.token;
      
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return await response.json();
    } catch (error) {
      throw handleError(error);
    }
  }

  static get(endpoint: string) {
    return this.request(endpoint);
  }

  static post(endpoint: string, data: any) {
    return this.request(endpoint, 'POST', data);
  }

  static put(endpoint: string, data: any) {
    return this.request(endpoint, 'PUT', data);
  }

  static delete(endpoint: string) {
    return this.request(endpoint, 'DELETE');
  }
} 