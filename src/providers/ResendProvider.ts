// src/providers/ResendProvider.ts
import { Resend } from 'resend';
import { SmartMailerConfig } from '../types';

export class ResendProvider {
  private client: Resend;

  constructor(config: SmartMailerConfig) {
    this.client = new Resend(config.apiKey);
  }

  // Einheitliche Sende-Funktion für unsere Engine
  async send(mailOptions: { from: string; to: string; subject: string; html: string }) {
    const response = await this.client.emails.send({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });

    // Fehler direkt hier abfangen
    if (response.error) {
      throw new Error(`Resend Fehler: ${response.error.message}`);
    }

    return response.data?.id; // Gibt die ID zurück, falls wir sie loggen wollen
  }
}