export class EmailService {
  async send(email: { to: string; subject: string; body: string }) {
    // Logic to send an email
    console.log(`Sending email to ${email.to}: ${email.subject}`);
  }
} 