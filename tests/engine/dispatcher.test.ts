// tests/engine/dispatcher.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const providerSendMocks: Record<string, ReturnType<typeof vi.fn>> = {
  resend: vi.fn(),
  sendgrid: vi.fn(),
  smtp: vi.fn(),
  ses: vi.fn(),
  mailgun: vi.fn(),
};

vi.mock('../../src/providers/ResendProvider', () => ({
  ResendProvider: vi.fn().mockImplementation(() => ({ send: providerSendMocks.resend })),
}));
vi.mock('../../src/providers/SendgridProvider', () => ({
  SendgridProvider: vi.fn().mockImplementation(() => ({ send: providerSendMocks.sendgrid })),
}));
vi.mock('../../src/providers/SmtpProvider', () => ({
  SmtpProvider: vi.fn().mockImplementation(() => ({ send: providerSendMocks.smtp })),
}));
vi.mock('../../src/providers/SesProvider', () => ({
  SesProvider: vi.fn().mockImplementation(() => ({ send: providerSendMocks.ses })),
}));
vi.mock('../../src/providers/MailgunProvider', () => ({
  MailgunProvider: vi.fn().mockImplementation(() => ({ send: providerSendMocks.mailgun })),
}));

import { EmailDispatcher } from '../../src/engine/dispatcher';
import { ProviderName } from '../../src/types';
import { buildConfig, sampleAttachment } from '../helpers';

const ALL_PROVIDERS: ProviderName[] = ['resend', 'sendgrid', 'smtp', 'ses', 'mailgun'];

describe('EmailDispatcher', () => {
  beforeEach(() => {
    Object.values(providerSendMocks).forEach((mock) => mock.mockReset().mockResolvedValue('ok'));
  });

  it.each(ALL_PROVIDERS)('routes provider "%s" to its adapter', async (provider) => {
    const dispatcher = new EmailDispatcher(buildConfig(provider));
    await dispatcher.dispatch('to@example.com', 'Subject', '<p>Hi</p>');

    expect(providerSendMocks[provider]).toHaveBeenCalledWith({
      from: 'Test Store <test@example.com>',
      to: 'to@example.com',
      subject: 'Subject',
      html: '<p>Hi</p>',
    });
  });

  it.each(ALL_PROVIDERS)('passes attachments through to provider "%s"', async (provider) => {
    const dispatcher = new EmailDispatcher(buildConfig(provider));
    await dispatcher.dispatch('to@example.com', 'Subject', '<p>Hi</p>', {
      attachments: [sampleAttachment],
    });

    expect(providerSendMocks[provider]).toHaveBeenCalledWith(
      expect.objectContaining({ attachments: [sampleAttachment] })
    );
  });

  it('does not add an attachments key when none are provided', async () => {
    const dispatcher = new EmailDispatcher(buildConfig('resend'));
    await dispatcher.dispatch('to@example.com', 'Subject', '<p>Hi</p>');
    expect(providerSendMocks.resend.mock.calls[0][0]).not.toHaveProperty('attachments');
  });

  it('throws on unknown providers', () => {
    expect(() => new EmailDispatcher({ ...buildConfig('resend'), provider: 'postmark' as any })).toThrow(
      /Unknown provider/
    );
  });

  it('propagates provider errors', async () => {
    providerSendMocks.ses.mockRejectedValue(new Error('SES Fehler: boom'));
    const dispatcher = new EmailDispatcher(buildConfig('ses'));

    await expect(dispatcher.dispatch('to@example.com', 'S', '<p/>')).rejects.toThrow('SES Fehler: boom');
  });
});
