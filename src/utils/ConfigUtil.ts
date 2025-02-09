import { configService } from '../services/config/ConfigService';

export class ConfigUtil {
  static get(key: string): any {
    return configService.get(key);
  }

  static isFeatureEnabled(feature: string): boolean {
    return configService.isFeatureEnabled(feature);
  }

  static getEnvironment(): string {
    return this.get('NODE_ENV') || 'development';
  }

  static isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  static isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }
} 