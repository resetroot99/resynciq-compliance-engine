export class SMSService {
  async send(sms: { to: string; message: string }) {
    // Logic to send an SMS
    console.log(`Sending SMS to ${sms.to}: ${sms.message}`);
  }
} 