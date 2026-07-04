// src/providers/index.ts
import { EmailAttachment } from '../types';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  from: string;
  attachments?: EmailAttachment[];
}

export interface EmailProvider {
  send(options: MailOptions): Promise<any>;
}
