// src/providers/ResendProvider.ts
import { Resend } from 'resend';
import { SmartMailerConfig } from '../types';
import { EmailProvider, MailOptions } from './index';

export class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor(config: SmartMailerConfig) {
    this.client = new Resend(config.apiKey);
  }

  // Einheitliche Sende-Funktion für unsere Engine
  async send(mailOptions: MailOptions) {
    const response = await this.client.emails.send({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      ...(mailOptions.attachments && mailOptions.attachments.length > 0
        ? {
            attachments: mailOptions.attachments.map((att) => ({
              filename: att.filename,
              content: att.content, // Resend akzeptiert Buffer oder Base64-String direkt
              ...(att.contentType ? { contentType: att.contentType } : {}),
            })),
          }
        : {}),
    });

    // Fehler direkt hier abfangen
    if (response.error) {
      throw new Error(`Resend Fehler: ${response.error.message}`);
    }

    return response.data?.id; // Gibt die ID zurück, falls wir sie loggen wollen
  }
}
