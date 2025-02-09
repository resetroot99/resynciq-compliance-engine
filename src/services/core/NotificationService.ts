import { EmailService } from './EmailService';
import { SMSService } from './SMSService';
import { PushNotificationService } from './PushNotificationService';

export class NotificationService {
  constructor(
    private emailService = new EmailService(),
    private smsService = new SMSService(),
    private pushService = new PushNotificationService()
  ) {}

  async notifyProcessComplete(result: any) {
    // Notify relevant parties about the completion of the estimate process
    await this.emailService.send({
      to: result.userEmail,
      subject: 'Estimate Process Complete',
      body: `Your estimate for ${result.vehicle.make} ${result.vehicle.model} is complete.`
    });

    await this.smsService.send({
      to: result.userPhone,
      message: `Estimate for ${result.vehicle.make} ${result.vehicle.model} is complete.`
    });

    await this.pushService.send({
      to: result.userId,
      title: 'Estimate Complete',
      message: `Your estimate for ${result.vehicle.make} ${result.vehicle.model} is complete.`
    });
  }

  async notifyError(error: any) {
    // Notify relevant parties about an error
    await this.emailService.send({
      to: 'support@company.com',
      subject: 'Error Notification',
      body: `An error occurred: ${error.message}`
    });

    await this.pushService.send({
      to: 'admin',
      title: 'Error Alert',
      message: `An error occurred: ${error.message}`
    });
  }
} 