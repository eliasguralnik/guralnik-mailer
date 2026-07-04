import nodemailer from 'nodemailer';
import { EmailProvider, MailOptions } from './index';

export class SmtpProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(config: any) {
    // Unterstützt beide Config-Formen: flach (host/port/user/apiKey)
    // und verschachtelt ({ smtp: { host, port, user, pass } }) wie vom Setup-Wizard erzeugt.
    const smtp = config.smtp || config;
    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass ?? config.apiKey,
      },
    });
  }

  async send(options: MailOptions) {
    return await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.attachments && options.attachments.length > 0
        ? {
            attachments: options.attachments.map((att) => ({
              filename: att.filename,
              // Nodemailer interpretiert Strings als utf-8 — Base64-Strings vorher dekodieren
              content: Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content, 'base64'),
              ...(att.contentType ? { contentType: att.contentType } : {}),
            })),
          }
        : {}),
    });
  }
}
