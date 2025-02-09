import { apiClientService } from '../services/api/ApiClientService';

export class ApiUtil {
  static async get(endpoint: string) {
    return apiClientService.get(endpoint);
  }

  static async post(endpoint: string, data: any) {
    return apiClientService.post(endpoint, data);
  }

  static async put(endpoint: string, data: any) {
    return apiClientService.put(endpoint, data);
  }

  static async delete(endpoint: string) {
    return apiClientService.delete(endpoint);
  }
} 