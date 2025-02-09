import { LoggingService } from '../logging/LoggingService';

export class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, any>;
  private logger = LoggingService.getInstance();

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): Record<string, any> {
    try {
      const config = {
        environment: process.env.NODE_ENV || 'development',
        api: {
          baseUrl: process.env.API_BASE_URL || 'https://api.complianceiq.com',
          timeout: parseInt(process.env.API_TIMEOUT || '5000')
        },
        database: {
          url: process.env.DATABASE_URL,
          poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10')
        },
        features: {
          photoAnalysis: process.env.FEATURE_PHOTO_ANALYSIS === 'true',
          adasValidation: process.env.FEATURE_ADAS_VALIDATION === 'true',
          supplementPrediction: process.env.FEATURE_SUPPLEMENT_PREDICTION === 'true'
        }
      };

      this.logger.log({
        level: 'INFO',
        message: 'Configuration loaded successfully'
      });

      return config;
    } catch (error) {
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to load configuration',
        context: { error: error.message }
      });

      throw error;
    }
  }

  get(key: string): any {
    const keys = key.split('.');
    return keys.reduce((acc, k) => acc && acc[k], this.config);
  }

  isFeatureEnabled(feature: string): boolean {
    return this.get(`features.${feature}`) === true;
  }
}

export const configService = ConfigService.getInstance(); 