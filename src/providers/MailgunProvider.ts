// src/providers/MailgunProvider.ts
import Mailgun from 'mailgun.js';
import { SmartMailerConfig } from '../types';
import { EmailProvider, MailOptions } from './index';

const MAILGUN_API_URLS: Record<string, string> = {
  us: 'https://api.mailgun.net',
  eu: 'https://api.eu.mailgun.net',
};

export class MailgunProvider implements EmailProvider {
  private client: ReturnType<InstanceType<typeof Mailgun>['client']>;
  private domain: string;

  constructor(config: SmartMailerConfig) {
    if (!config.domain) {
      throw new Error("Mailgun Fehler: 'domain' fehlt in der mailer.config.json!");
    }
    this.domain = config.domain;

    const region = (config.region || 'us').toLowerCase();
    const mailgun = new Mailgun(FormData);
    this.client = mailgun.client({
      username: 'api',
      key: config.apiKey || '',
      url: MAILGUN_API_URLS[region] || MAILGUN_API_URLS.us,
    });
  }

  // Einheitliche Sende-Funktion, genau wie bei den anderen Providern
  async send(mailOptions: MailOptions) {
    try {
      const response = await this.client.messages.create(this.domain, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        ...(mailOptions.attachments && mailOptions.attachments.length > 0
          ? {
              attachment: mailOptions.attachments.map((att) => ({
                filename: att.filename,
                data: Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content, 'base64'),
              })),
            }
          : {}),
      });
      return response.id;
    } catch (error: any) {
      const errorMessage = error.details || error.message || String(error);
      throw new Error(`Mailgun Fehler: ${errorMessage}`);
    }
  }
}
