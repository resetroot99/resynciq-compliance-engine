export class PushNotificationService {
  async send(notification: { to: string; title: string; message: string }) {
    // Logic to send a push notification
    console.log(`Sending push notification to ${notification.to}: ${notification.title}`);
  }
} 