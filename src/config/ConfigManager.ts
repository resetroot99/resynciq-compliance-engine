export class ConfigManager {
  private static instance: ConfigManager;
  private config: any;

  private constructor() {
    this.config = {
      api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        timeout: 30000,
        retryAttempts: 3
      },
      features: {
        photoAnalysis: true,
        adasValidation: true,
        realTimeValidation: true,
        supplementPrediction: true
      },
      integrations: {
        cccOne: {
          enabled: true,
          apiKey: process.env.CCC_API_KEY
        },
        mitchell: {
          enabled: true,
          apiKey: process.env.MITCHELL_API_KEY
        },
        audatex: {
          enabled: true,
          apiKey: process.env.AUDATEX_API_KEY
        }
      },
      validation: {
        rules: {
          strict: true,
          autoCorrect: false,
          requirePhotos: true
        }
      }
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig() {
    return this.config;
  }
} 