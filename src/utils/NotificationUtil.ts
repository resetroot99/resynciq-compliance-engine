import { notificationService } from '../services/notification/NotificationService';

export class NotificationUtil {
  static async sendEstimateNotification(
    estimateId: string, 
    status: string, 
    options: { email?: string; phone?: string; pushToken?: string; userId?: string }
  ) {
    return notificationService.sendEstimateNotification(estimateId, status, options);
  }
} 