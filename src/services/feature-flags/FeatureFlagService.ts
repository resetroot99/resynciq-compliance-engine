import { ConfigUtil } from '../../utils/ConfigUtil';

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private featureFlags: Map<string, boolean> = new Map();

  private constructor() {
    // Initialize from config
    Object.entries(ConfigUtil.get('FEATURES')).forEach(([key, value]) => {
      this.featureFlags.set(key, value as boolean);
    });
  }

  static getInstance(): FeatureFlagService {
    if (!this.instance) {
      this.instance = new FeatureFlagService();
    }
    return this.instance;
  }

  isEnabled(feature: string): boolean {
    return this.featureFlags.get(feature) || false;
  }

  enable(feature: string) {
    this.featureFlags.set(feature, true);
  }

  disable(feature: string) {
    this.featureFlags.set(feature, false);
  }
}

export const featureFlagService = FeatureFlagService.getInstance(); 