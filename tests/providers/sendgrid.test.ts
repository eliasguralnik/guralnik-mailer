// tests/providers/sendgrid.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn(),
  },
}));

import sgMail from '@sendgrid/mail';
import { SendgridProvider } from '../../src/providers/SendgridProvider';
import { buildConfig, sampleMail, sampleAttachment, pdfBuffer } from '../helpers';

describe('SendgridProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (sgMail.send as any).mockResolvedValue([{ statusCode: 202 }]);
  });

  it('registers the API key on construction', () => {
    new SendgridProvider(buildConfig('sendgrid'));
    expect(sgMail.setApiKey).toHaveBeenCalledWith('SG.test_key');
  });

  it('sends a plain email', async () => {
    const provider = new SendgridProvider(buildConfig('sendgrid'));
    await provider.send(sampleMail);

    expect(sgMail.send).toHaveBeenCalledWith({
      to: sampleMail.to,
      from: sampleMail.from,
      subject: sampleMail.subject,
      html: sampleMail.html,
    });
  });

  it('converts Buffer attachments to base64 strings (SendGrid requirement)', async () => {
    const provider = new SendgridProvider(buildConfig('sendgrid'));
    await provider.send({ ...sampleMail, attachments: [sampleAttachment] });

    const msg = (sgMail.send as any).mock.calls[0][0];
    expect(msg.attachments).toEqual([
      {
        filename: 'invoice.pdf',
        content: pdfBuffer.toString('base64'),
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ]);
  });

  it('keeps base64 string attachments untouched', async () => {
    const provider = new SendgridProvider(buildConfig('sendgrid'));
    const base64 = pdfBuffer.toString('base64');
    await provider.send({
      ...sampleMail,
      attachments: [{ filename: 'invoice.pdf', content: base64 }],
    });

    const msg = (sgMail.send as any).mock.calls[0][0];
    expect(msg.attachments[0].content).toBe(base64);
    expect(msg.attachments[0].type).toBe('application/octet-stream');
  });

  it('unwraps nested SendGrid error responses', async () => {
    (sgMail.send as any).mockRejectedValue({
      message: 'Bad Request',
      response: { body: { errors: [{ message: 'from address not verified' }] } },
    });
    const provider = new SendgridProvider(buildConfig('sendgrid'));

    await expect(provider.send(sampleMail)).rejects.toThrow('from address not verified');
  });
});
