import { Datadog } from '@datadog/browser-rum';
import * as Sentry from '@sentry/nextjs';

export function initializeMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    // Initialize Datadog RUM
    Datadog.init({
      applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID!,
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
      site: 'datadoghq.com',
      service: 'resynciq-frontend',
      env: process.env.NODE_ENV,
      trackInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // Initialize Sentry
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
} 