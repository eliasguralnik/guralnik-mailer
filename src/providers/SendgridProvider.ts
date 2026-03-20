// src/providers/SendgridProvider.ts
import sgMail from '@sendgrid/mail';
import { SmartMailerConfig } from '../types';

export class SendgridProvider {
  private config: SmartMailerConfig;

  constructor(config: SmartMailerConfig) {
    this.config = config;
    // 1. SendGrid mit deinem API-Key aus der config.json füttern
    sgMail.setApiKey(this.config.apiKey);
  }

  // 2. Einheitliche Sende-Funktion, genau wie bei SMTP
  async send(mailOptions: { from: string; to: string; subject: string; html: string }) {
    const msg = {
      to: mailOptions.to,
      from: mailOptions.from, // ⚠️ Wichtig: Diese E-Mail muss in SendGrid verifiziert sein!
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

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