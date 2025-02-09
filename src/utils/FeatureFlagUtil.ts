import { featureFlagService } from '../services/feature-flags/FeatureFlagService';

export class FeatureFlagUtil {
  static isEnabled(feature: string): boolean {
    return featureFlagService.isEnabled(feature);
  }

  static enable(feature: string) {
    featureFlagService.enable(feature);
  }

  static disable(feature: string) {
    featureFlagService.disable(feature);
  }
} 