// tests/helpers.ts — shared config builders for unit tests
import { SmartMailerConfig, ProviderName } from '../src/types';

export function buildConfig(provider: ProviderName, overrides: Partial<SmartMailerConfig> = {}): SmartMailerConfig {
  const base: SmartMailerConfig = {
    provider,
    senderEmail: 'Test Store <test@example.com>',
    storeUrl: 'https://test-store.com',
    defaultLanguage: 'en',
    theme: {
      designType: 'modern',
      brandName: 'Test Store',
      colors: { primary: '#4F46E5', background: '#F6F9FC', text: '#1a1a2e' },
      company: { name: 'Test Co.', addressLine1: '123 Test St.', contactEmail: 'support@test.com' },
      socials: {},
    },
  };

  switch (provider) {
    case 'resend':
      return { ...base, apiKey: 're_test_key', ...overrides };
    case 'sendgrid':
      return { ...base, apiKey: 'SG.test_key', ...overrides };
    case 'smtp':
      return { ...base, host: 'smtp.test.com', port: 587, user: 'testuser', apiKey: 'testpass', ...overrides };
    case 'ses':
      return { ...base, region: 'eu-central-1', ...overrides };
    case 'mailgun':
      return { ...base, apiKey: 'key-test', domain: 'mg.test.com', ...overrides };
  }
}

export const pdfBuffer = Buffer.from('%PDF-1.4 fake invoice content');

export const sampleAttachment = {
  filename: 'invoice.pdf',
  content: pdfBuffer,
  contentType: 'application/pdf',
};

export const sampleMail = {
  from: 'Test Store <test@example.com>',
  to: 'customer@example.com',
  subject: 'Your order #ORD-1',
  html: '<html><body><h1>Hello</h1></body></html>',
};
