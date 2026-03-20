import nodemailer from 'nodemailer';
import { EmailProvider } from './index';

export class SmtpProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(config: any) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.apiKey, 
      },
    });
  }

  async send(options: { to: string; subject: string; html: string; from: string }) {
    return await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}