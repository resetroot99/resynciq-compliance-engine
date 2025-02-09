import { EmailService } from '../core/EmailService';
import { SMSService } from '../core/SMSService';
import { PushNotificationService } from '../core/PushNotificationService';
import { LoggingService } from '../logging/LoggingService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { aiService } from '../ai/AIService';

export interface NotificationOptions {
  email?: string;
  phone?: string;
  pushToken?: string;
  userId?: string;
}

export interface NotificationTemplate {
  subject: string;
  body: string;
}

export class NotificationService {
  private logger = LoggingService.getInstance();
  private telemetry = TelemetryService.getInstance();

  constructor(
    private emailService = new EmailService(),
    private smsService = new SMSService(),
    private pushService = new PushNotificationService()
  ) {}

  async initialize() {
    this.logger.log({ level: 'INFO', message: 'Notification service initialized' });
  }

  async shutdown() {
    this.logger.log({ level: 'INFO', message: 'Notification service shutdown' });
  }

  async sendEstimateNotification(
    estimateId: string, 
    status: string, 
    options: NotificationOptions
  ) {
    try {
      const template = this.getNotificationTemplate(status);
      const notificationMessage = this.formatNotificationMessage(template, { 
        estimateId, 
        status 
      });

      // Log notification attempt
      this.logger.log({
        level: 'INFO',
        message: 'Sending estimate notification',
        context: { 
          estimateId, 
          status, 
          channels: Object.keys(options).filter(k => k !== 'userId') 
        }
      });

      // Track notification event
      this.telemetry.trackEvent('estimate_notification_sent', {
        estimateId,
        status,
        userId: options.userId
      });

      // Send notifications
      const notificationPromises = [];

      if (options.email) {
        notificationPromises.push(
          this.emailService.send({
            to: options.email,
            subject: template.subject,
            body: notificationMessage
          })
        );
      }

      if (options.phone) {
        notificationPromises.push(
          this.smsService.send({
            to: options.phone,
            message: notificationMessage
          })
        );
      }

      if (options.pushToken) {
        notificationPromises.push(
          this.pushService.send({
            to: options.pushToken,
            title: template.subject,
            message: notificationMessage
          })
        );
      }

      // Wait for all notifications to be sent
      await Promise.allSettled(notificationPromises);

      return true;
    } catch (error) {
      // Log and track notification failure
      this.logger.log({
        level: 'ERROR',
        message: 'Failed to send estimate notification',
        context: { 
          estimateId, 
          status, 
          error: error.message 
        }
      });

      this.telemetry.trackEvent('estimate_notification_failed', {
        estimateId,
        status,
        errorMessage: error.message
      });

      return false;
    }
  }

  private getNotificationTemplate(status: string): NotificationTemplate {
    const templates = {
      'CREATED': {
        subject: 'New Estimate Created',
        body: 'Your estimate #{estimateId} has been created and is being processed.'
      },
      'APPROVED': {
        subject: 'Estimate Approved',
        body: 'Your estimate #{estimateId} has been approved.'
      },
      'REJECTED': {
        subject: 'Estimate Requires Review',
        body: 'Your estimate #{estimateId} needs additional review.'
      },
      'COMPLETED': {
        subject: 'Estimate Completed',
        body: 'Your estimate #{estimateId} has been completed.'
      },
      'DEFAULT': {
        subject: 'Estimate Update',
        body: 'Your estimate #{estimateId} status is now: {status}'
      }
    };

    return templates[status] || templates['DEFAULT'];
  }

  private formatNotificationMessage(
    template: NotificationTemplate, 
    context: { estimateId: string; status: string }
  ): string {
    return template.body
      .replace('#{estimateId}', context.estimateId)
      .replace('{status}', context.status);
  }

  async sendAIUpdateNotification(userId: string, updateType: string) {
    try {
      const message = await aiService.getUpdateMessage(updateType);
      await this.sendNotification({
        userId,
        type: 'AI_UPDATE',
        message
      });
    } catch (error) {
      throw new Error(`AI update notification failed: ${error.message}`);
    }
  }

  async sendModelImprovementNotification(userId: string) {
    try {
      const message = await aiService.getImprovementMessage();
      await this.sendNotification({
        userId,
        type: 'MODEL_IMPROVEMENT',
        message
      });
    } catch (error) {
      throw new Error(`Model improvement notification failed: ${error.message}`);
    }
  }
}

export const notificationService = new NotificationService(); 