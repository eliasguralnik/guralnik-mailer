// src/providers/SendgridProvider.ts
import sgMail from '@sendgrid/mail';
import { SmartMailerConfig } from '../types';
import { EmailProvider, MailOptions } from './index';

export class SendgridProvider implements EmailProvider {
  private config: SmartMailerConfig;

  constructor(config: SmartMailerConfig) {
    this.config = config;
    // 1. SendGrid mit deinem API-Key aus der config.json füttern
    sgMail.setApiKey(this.config.apiKey!);
  }

  // 2. Einheitliche Sende-Funktion, genau wie bei SMTP
  async send(mailOptions: MailOptions) {
    const msg: any = {
      to: mailOptions.to,
      from: mailOptions.from, // ⚠️ Wichtig: Diese E-Mail muss in SendGrid verifiziert sein!
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    if (mailOptions.attachments && mailOptions.attachments.length > 0) {
      // SendGrid erwartet den Content zwingend als Base64-String
      msg.attachments = mailOptions.attachments.map((att) => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content.toString('base64') : att.content,
        type: att.contentType || 'application/octet-stream',
        disposition: 'attachment',
      }));
    }

    try {
      await sgMail.send(msg);
      return true;
    } catch (error: any) {
      // SendGrid versteckt die echten Fehler oft tief im response-Objekt
      const errorMessage = error.response?.body ? JSON.stringify(error.response.body) : error.message;
      console.error("❌ SendGrid API Fehler:", errorMessage);
      throw new Error(`SendGrid Fehler: ${errorMessage}`);
    }
  }
}
