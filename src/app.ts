import { configService } from './services/config/ConfigService';
import { loggingService } from './services/logging/LoggingService';
import { databaseService } from './services/database/DatabaseService';
import { authService } from './services/core/AuthService';
import { notificationService } from './services/notification/NotificationService';
import { estimateProcessorService } from './services/estimate/EstimateProcessorService';
import { dashboardService } from './services/dashboard/DashboardService';
import { deploymentService } from './services/deployment/DeploymentService';
import { apiClientService } from './services/api/ApiClientService';
import { telemetryService } from './services/telemetry/TelemetryService';
import { performanceMonitor } from './services/performance/PerformanceMonitorService';
import { featureFlagService } from './services/feature-flags/FeatureFlagService';
import express from 'express';
import { json } from 'body-parser';
import { estimateRouter } from './routes/estimate';
import { complianceRouter } from './routes/compliance';

class Application {
  private isShuttingDown = false;

  async initialize() {
    try {
      // 1. Initialize configuration
      loggingService.log({ level: 'INFO', message: 'Initializing configuration...' });
      configService.get('environment'); // Test config loading

      // 2. Initialize logging and telemetry
      loggingService.log({ level: 'INFO', message: 'Initializing telemetry...' });
      telemetryService.trackEvent('app_initialization_started');

      // 3. Initialize database
      loggingService.log({ level: 'INFO', message: 'Initializing database...' });
      await databaseService.getEstimate('test'); // Test database connection

      // 4. Initialize feature flags
      loggingService.log({ level: 'INFO', message: 'Initializing feature flags...' });
      featureFlagService.isEnabled('photoAnalysis'); // Test feature flags

      // 5. Initialize services
      loggingService.log({ level: 'INFO', message: 'Initializing services...' });
      await this.initializeServices();

      // 6. Set up graceful shutdown
      this.setupShutdownHandlers();

      loggingService.log({ level: 'INFO', message: 'Application initialized successfully' });
      telemetryService.trackEvent('app_initialization_completed');
    } catch (error) {
      loggingService.log({
        level: 'ERROR',
        message: 'Application initialization failed',
        context: { error: error.message }
      });
      telemetryService.trackEvent('app_initialization_failed', {
        errorMessage: error.message
      });
      process.exit(1);
    }
  }

  private async initializeServices() {
    // Initialize services in proper order
    await performanceMonitor.measureAsync('auth_service_init', () =>
      authService.initialize()
    );

    await performanceMonitor.measureAsync('notification_service_init', () =>
      notificationService.initialize()
    );

    await performanceMonitor.measureAsync('estimate_processor_init', () =>
      estimateProcessorService.initialize()
    );

    await performanceMonitor.measureAsync('dashboard_service_init', () =>
      dashboardService.initialize()
    );

    await performanceMonitor.measureAsync('api_client_init', () =>
      apiClientService.initialize()
    );
  }

  private setupShutdownHandlers() {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      loggingService.log({
        level: 'INFO',
        message: `Received ${signal}, shutting down...`
      });

      try {
        // Shutdown services in reverse order
        await performanceMonitor.measureAsync('api_client_shutdown', () =>
          apiClientService.shutdown()
        );

        await performanceMonitor.measureAsync('dashboard_service_shutdown', () =>
          dashboardService.shutdown()
        );

        await performanceMonitor.measureAsync('estimate_processor_shutdown', () =>
          estimateProcessorService.shutdown()
        );

        await performanceMonitor.measureAsync('notification_service_shutdown', () =>
          notificationService.shutdown()
        );

        await performanceMonitor.measureAsync('auth_service_shutdown', () =>
          authService.shutdown()
        );

        await performanceMonitor.measureAsync('database_shutdown', () =>
          databaseService.close()
        );

        loggingService.log({ level: 'INFO', message: 'Shutdown complete' });
        process.exit(0);
      } catch (error) {
        loggingService.log({
          level: 'ERROR',
          message: 'Error during shutdown',
          context: { error: error.message }
        });
        process.exit(1);
      }
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      loggingService.log({
        level: 'ERROR',
        message: 'Uncaught exception',
        context: { error: error.message }
      });
      shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
      loggingService.log({
        level: 'ERROR',
        message: 'Unhandled rejection',
        context: { reason }
      });
      shutdown('unhandledRejection');
    });
  }

  async start() {
    try {
      // Start the main application logic
      loggingService.log({ level: 'INFO', message: 'Starting application...' });

      // Example: Start processing estimates
      await estimateProcessorService.startProcessing();

      // Example: Start dashboard updates
      await dashboardService.startUpdates();

      loggingService.log({ level: 'INFO', message: 'Application started successfully' });
    } catch (error) {
      loggingService.log({
        level: 'ERROR',
        message: 'Application failed to start',
        context: { error: error.message }
      });
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new Application();

app.initialize()
  .then(() => app.start())
  .catch((error) => {
    loggingService.log({
      level: 'ERROR',
      message: 'Application failed to initialize',
      context: { error: error.message }
    });
    process.exit(1);
  });

const expressApp = express();
expressApp.use(json());

// AI service status endpoint
expressApp.get('/ai-service/status', (req, res) => {
  res.status(200).json({ status: 'AI service is running' });
});

expressApp.use('/api/estimate', estimateRouter);
expressApp.use('/api/compliance', complianceRouter);

const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 