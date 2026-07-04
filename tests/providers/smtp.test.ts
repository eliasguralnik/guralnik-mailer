// tests/providers/smtp.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock('nodemailer', () => ({
  default: { createTransport: (...args: any[]) => createTransportMock(...args) },
}));

import { SmtpProvider } from '../../src/providers/SmtpProvider';
import { buildConfig, sampleMail, sampleAttachment, pdfBuffer } from '../helpers';

describe('SmtpProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMailMock.mockResolvedValue({ messageId: 'smtp-id-1' });
  });

  it('creates a transport from flat config fields (host/port/user/apiKey)', () => {
    new SmtpProvider(buildConfig('smtp'));

    expect(createTransportMock).toHaveBeenCalledWith({
      host: 'smtp.test.com',
      port: 587,
      secure: false,
      auth: { user: 'testuser', pass: 'testpass' },
    });
  });

  it('supports the nested smtp block written by the setup wizard', () => {
    new SmtpProvider({
      provider: 'smtp',
      smtp: { host: 'mail.wizard.com', port: 465, user: 'wizard', pass: 'secret' },
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      host: 'mail.wizard.com',
      port: 465,
      secure: true,
      auth: { user: 'wizard', pass: 'secret' },
    });
  });

  it('sends a plain email through the transport', async () => {
    const provider = new SmtpProvider(buildConfig('smtp'));
    await provider.send(sampleMail);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: sampleMail.from,
      to: sampleMail.to,
      subject: sampleMail.subject,
      html: sampleMail.html,
    });
  });

  it('passes Buffer attachments to nodemailer with contentType', async () => {
    const provider = new SmtpProvider(buildConfig('smtp'));
    await provider.send({ ...sampleMail, attachments: [sampleAttachment] });

    const mail = sendMailMock.mock.calls[0][0];
    expect(mail.attachments).toEqual([
      { filename: 'invoice.pdf', content: pdfBuffer, contentType: 'application/pdf' },
    ]);
  });

  it('decodes base64 string attachments into Buffers', async () => {
    const provider = new SmtpProvider(buildConfig('smtp'));
    await provider.send({
      ...sampleMail,
      attachments: [{ filename: 'invoice.pdf', content: pdfBuffer.toString('base64') }],
    });

    const mail = sendMailMock.mock.calls[0][0];
    expect(Buffer.isBuffer(mail.attachments[0].content)).toBe(true);
    expect(mail.attachments[0].content.equals(pdfBuffer)).toBe(true);
  });
});
