import { NotificationService } from '../core/NotificationService';
import { LoggerService } from '../core/LoggerService';

export class ErrorHandler {
  constructor(
    private notificationService: NotificationService,
    private logger: LoggerService
  ) {}

  async handleError(error: any) {
    // Log error
    await this.logger.error({
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      context: error.context
    });

    // Notify relevant parties
    await this.notificationService.notifyError({
      type: this.categorizeError(error),
      message: this.formatErrorMessage(error),
      severity: this.determineSeverity(error)
    });

    // Return user-friendly error
    return {
      message: this.getUserMessage(error),
      code: error.code || 'UNKNOWN_ERROR',
      retry: this.canRetry(error)
    };
  }

  private categorizeError(error: any) {
    // Categorize errors for proper handling
    if (error.code?.startsWith('VALIDATION')) return 'VALIDATION_ERROR';
    if (error.code?.startsWith('AUTH')) return 'AUTHENTICATION_ERROR';
    if (error.code?.startsWith('API')) return 'API_ERROR';
    return 'SYSTEM_ERROR';
  }
} 