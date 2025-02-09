import { telemetryService } from '../services/telemetry/TelemetryService';

export class TelemetryUtil {
  static trackEvent(eventName: string, properties?: any) {
    telemetryService.trackEvent(eventName, properties);
  }

  static trackPageView(pageName: string) {
    telemetryService.trackPageView(pageName);
  }

  static trackEstimateAction(action: string, estimateId: string) {
    telemetryService.trackEstimateAction(action, estimateId);
  }
} 