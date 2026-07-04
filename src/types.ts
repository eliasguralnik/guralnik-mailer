// src/types.ts

export type DesignType =
  | 'modern' | 'minimal' | 'elegant' | 'bold' | 'classic'
  | 'futuristic' | 'midnight' | 'nature' | 'playful' | 'monochrome';

export interface ThemeConfig {
  designType: DesignType;
  brandName: string;
  logoUrl?: string;

  colors: {
    primary: string;
    background: string;
    surface?: string;
    text: string;
    textMuted?: string;
    border?: string;
  };

  company?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    contactEmail: string;
  };

  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
}

export type ProviderName = 'resend' | 'sendgrid' | 'smtp' | 'ses' | 'mailgun';

export interface SmartMailerConfig {
  provider: ProviderName;
  apiKey?: string;

  // SMTP (flat or nested via `smtp` block)
  host?: string;
  port?: number;
  user?: string;
  smtp?: {
    host: string;
    port?: number;
    user?: string;
    pass?: string;
  };

  // AWS SES: an AWS region like "eu-central-1". When accessKeyId/secretAccessKey are
  // omitted, the AWS SDK v3 default credential chain is used (env vars, shared config, IAM role, ...)
  // Mailgun: "us" (default) or "eu" — selects the API base URL.
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;

  // Mailgun
  domain?: string;

  senderEmail: string;
  /** Alias for senderEmail — accepted in mailer.config.json (written by the setup wizard). */
  from?: string;
  storeUrl?: string;
  defaultLanguage?: string;
  theme: ThemeConfig;
}

// ─── Attachments ───

export interface EmailAttachment {
  filename: string;
  /** Raw file content — a Buffer or a base64-encoded string. The package never generates files, it only passes them through. */
  content: Buffer | string;
  contentType?: string;
}

export interface SendOptions {
  attachments?: EmailAttachment[];
}

// ─── Batch Sending ───

export interface BatchRecipient {
  to: string;
  data: Record<string, any>;
}

export interface BatchOptions {
  /** Maximum sends per second (default: 10). Keeps you inside your provider's rate limits. */
  requestsPerSecond?: number;
  /** Retry transient failures (429 / 5xx / network errors) automatically (default: true). */
  retryOnFailure?: boolean;
  /** Maximum retry attempts per recipient (default: 3). */
  maxRetries?: number;
  /** Base delay for exponential backoff in ms — doubles on every retry (default: 500). */
  retryBackoffMs?: number;
  /** Attachments applied to every email in the batch. */
  attachments?: EmailAttachment[];
  /** Called after every settled send (successful or finally failed). */
  onProgress?: (sent: number, total: number) => void;
  /** Called once per recipient whose send failed permanently. */
  onError?: (recipient: string, error: Error) => void;
}

export interface BatchResult {
  sent: number;
  failed: number;
  errors: Array<{ recipient: string; error: Error }>;
}
