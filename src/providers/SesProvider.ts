// src/providers/SesProvider.ts
import { SESClient, SendEmailCommand, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { SmartMailerConfig } from '../types';
import { EmailProvider, MailOptions } from './index';
import { buildRawMimeMessage } from './mime';

export class SesProvider implements EmailProvider {
  private client: SESClient;

  constructor(config: SmartMailerConfig) {
    // Explizite Credentials nur setzen, wenn sie in der Config stehen —
    // sonst greift automatisch die AWS SDK v3 Standard-Credential-Chain
    // (env vars, shared config, IAM role, etc.)
    this.client = new SESClient({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
      ...(config.accessKeyId && config.secretAccessKey
        ? {
            credentials: {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey,
            },
          }
        : {}),
    });
  }

  // Einheitliche Sende-Funktion, genau wie bei den anderen Providern
  async send(mailOptions: MailOptions) {
    try {
      // Attachments brauchen eine raw MIME message (SendRawEmailCommand),
      // einfache HTML-Mails gehen über SendEmailCommand.
      if (mailOptions.attachments && mailOptions.attachments.length > 0) {
        const rawMessage = buildRawMimeMessage(mailOptions);
        const response = await this.client.send(new SendRawEmailCommand({
          RawMessage: { Data: Buffer.from(rawMessage, 'utf-8') },
        }));
        return response.MessageId;
      }

      const response = await this.client.send(new SendEmailCommand({
        Source: mailOptions.from,
        Destination: { ToAddresses: [mailOptions.to] },
        Message: {
          Subject: { Data: mailOptions.subject, Charset: 'UTF-8' },
          Body: { Html: { Data: mailOptions.html, Charset: 'UTF-8' } },
        },
      }));
      return response.MessageId;
    } catch (error: any) {
      throw new Error(`SES Fehler: ${error.message || error}`);
    }
  }
}
