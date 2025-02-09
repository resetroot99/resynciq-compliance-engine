import { ConfigUtil } from '../../utils/ConfigUtil';
import { AuthService } from '../core/AuthService';

export class TelemetryService {
  private static instance: TelemetryService;
  private userId: string | null = null;

  private constructor(
    private authService = AuthService
  ) {
    this.userId = this.authService.getCurrentUser()?.id || null;
  }

  static getInstance(): TelemetryService {
    if (!this.instance) {
      this.instance = new TelemetryService();
    }
    return this.instance;
  }

  trackEvent(eventName: string, properties?: Record<string, any>) {
    const baseProperties = {
      userId: this.userId,
      timestamp: new Date().toISOString(),
      environment: ConfigUtil.get('ENVIRONMENT')
    };

    const eventData = {
      ...baseProperties,
      ...properties
    };

    // Console logging for development
    if (ConfigUtil.get('ENVIRONMENT') === 'development') {
      console.log(`Telemetry Event: ${eventName}`, eventData);
    }

    // Send to external telemetry service
    this.sendToTelemetryService(eventName, eventData);
  }

  private async sendToTelemetryService(eventName: string, eventData: any) {
    try {
      // Implement integration with telemetry service like Mixpanel, Amplitude
      // Example:
      // await fetch('https://telemetry.service/track', {
      //   method: 'POST',
      //   body: JSON.stringify({ eventName, eventData })
      // });
    } catch (error) {
      console.error('Telemetry tracking failed', error);
    }
  }

  trackPageView(pageName: string) {
    this.trackEvent('page_view', { pageName });
  }

  trackEstimateAction(action: string, estimateId: string) {
    this.trackEvent('estimate_action', { 
      action, 
      estimateId 
    });
  }
}

export const telemetryService = TelemetryService.getInstance(); 