import { LoggingService } from '../logging/LoggingService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { ConfigService } from '../config/ConfigService';
import { AuthService } from '../core/AuthService';

export class ApiClientService {
  private logger = LoggingService.getInstance();
  private telemetry = TelemetryService.getInstance();
  private config = ConfigService.getInstance();
  private authService = AuthService;

  async request(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ) {
    const requestStart = Date.now();
    const url = `${this.config.get('api.baseUrl')}${endpoint}`;

    try {
      this.telemetry.trackEvent('api_request_started', { 
        endpoint,
        method
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getCurrentUser()?.token}`
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      this.telemetry.trackEvent('api_request_completed', { 
        endpoint,
        method,
        duration: Date.now() - requestStart
      });

      return responseData;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'API request failed',
        context: { 
          endpoint,
          method,
          error: error.message
        }
      });

      this.telemetry.trackEvent('api_request_failed', { 
        endpoint,
        method,
        errorMessage: error.message
      });

      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, 'POST', data);
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, 'PUT', data);
  }

  async delete(endpoint: string) {
    return this.request(endpoint, 'DELETE');
  }
}

export const apiClientService = new ApiClientService(); 