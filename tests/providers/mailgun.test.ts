// tests/providers/mailgun.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const messagesCreateMock = vi.fn();
const clientMock = vi.fn(() => ({ messages: { create: messagesCreateMock } }));

vi.mock('mailgun.js', () => ({
  default: vi.fn().mockImplementation(() => ({ client: clientMock })),
}));

import { MailgunProvider } from '../../src/providers/MailgunProvider';
import { buildConfig, sampleMail, sampleAttachment, pdfBuffer } from '../helpers';

describe('MailgunProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    messagesCreateMock.mockResolvedValue({ id: '<mailgun-id-1>', status: 200 });
  });

  it('throws a clear error when domain is missing', () => {
    expect(() => new MailgunProvider(buildConfig('mailgun', { domain: undefined }))).toThrow(/domain/);
  });

  it('defaults to the US API endpoint', () => {
    new MailgunProvider(buildConfig('mailgun'));
    expect(clientMock).toHaveBeenCalledWith({
      username: 'api',
      key: 'key-test',
      url: 'https://api.mailgun.net',
    });
  });

  it('uses the EU endpoint when region is "eu"', () => {
    new MailgunProvider(buildConfig('mailgun', { region: 'eu' }));
    expect(clientMock).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://api.eu.mailgun.net' }));
  });

  it('sends against the configured domain and returns the message id', async () => {
    const provider = new MailgunProvider(buildConfig('mailgun'));
    const id = await provider.send(sampleMail);

    expect(id).toBe('<mailgun-id-1>');
    expect(messagesCreateMock).toHaveBeenCalledWith('mg.test.com', {
      from: sampleMail.from,
      to: sampleMail.to,
      subject: sampleMail.subject,
      html: sampleMail.html,
    });
  });

  it('maps attachments to mailgun.js format ({ filename, data })', async () => {
    const provider = new MailgunProvider(buildConfig('mailgun'));
    await provider.send({ ...sampleMail, attachments: [sampleAttachment] });

    const payload = messagesCreateMock.mock.calls[0][1];
    expect(payload.attachment).toEqual([{ filename: 'invoice.pdf', data: pdfBuffer }]);
  });

  it('decodes base64 string attachments into Buffers', async () => {
    const provider = new MailgunProvider(buildConfig('mailgun'));
    await provider.send({
      ...sampleMail,
      attachments: [{ filename: 'invoice.pdf', content: pdfBuffer.toString('base64') }],
    });

    const payload = messagesCreateMock.mock.calls[0][1];
    expect(Buffer.isBuffer(payload.attachment[0].data)).toBe(true);
    expect(payload.attachment[0].data.equals(pdfBuffer)).toBe(true);
  });

  it('surfaces Mailgun error details', async () => {
    messagesCreateMock.mockRejectedValue({ status: 401, message: 'Unauthorized', details: 'Invalid private key' });
    const provider = new MailgunProvider(buildConfig('mailgun'));

    await expect(provider.send(sampleMail)).rejects.toThrow('Mailgun Fehler: Invalid private key');
  });
});
