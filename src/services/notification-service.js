import { EmailService } from './email-service';
import { SMSService } from './sms-service';
import { PushNotificationService } from './push-notification-service';

export class NotificationService {
  constructor() {
    this.subscribers = new Set();
    this.channels = {
      email: new EmailService(),
      sms: new SMSService(),
      push: new PushNotificationService(),
      inApp: true
    };
    
    this.notificationPreferences = new Map();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(message, type = 'info') {
    this.subscribers.forEach(callback => callback({ message, type }));
  }

  async sendNotification(message, type, recipient) {
    const preferences = await this.getRecipientPreferences(recipient);
    const notifications = [];

    if (preferences.email) {
      notifications.push(
        this.channels.email.send({
          to: recipient.email,
          subject: this.getSubjectForType(type),
          body: message,
          template: this.getTemplateForType(type)
        })
      );
    }

    if (preferences.sms && this.isUrgent(type)) {
      notifications.push(
        this.channels.sms.send({
          to: recipient.phone,
          message: this.formatSMSMessage(message, type)
        })
      );
    }

    // ... more notification channels

    await Promise.all(notifications);
  }

  async sendPriorityAlert(message, recipient) {
    // High-priority notifications for immediate attention
    // Example: Parts price changes, labor rate updates
  }

  async sendComplianceAlert(message, recipient) {
    // Compliance-specific notifications
    // Example: Missing photos, incorrect labor rates
  }

  async sendSupplementAlert(message, recipient) {
    // Supplement-related notifications
    // Example: Additional operations needed, parts price updates
  }
}

export const notificationService = new NotificationService(); 