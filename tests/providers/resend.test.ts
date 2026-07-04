// tests/providers/resend.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

import { Resend } from 'resend';
import { ResendProvider } from '../../src/providers/ResendProvider';
import { buildConfig, sampleMail, sampleAttachment, pdfBuffer } from '../helpers';

describe('ResendProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMock.mockResolvedValue({ data: { id: 'resend-id-1' }, error: null });
  });

  it('initializes the Resend client with the configured API key', () => {
    new ResendProvider(buildConfig('resend'));
    expect(Resend).toHaveBeenCalledWith('re_test_key');
  });

  it('sends a plain email and returns the message id', async () => {
    const provider = new ResendProvider(buildConfig('resend'));
    const id = await provider.send(sampleMail);

    expect(id).toBe('resend-id-1');
    expect(sendMock).toHaveBeenCalledWith({
      from: sampleMail.from,
      to: sampleMail.to,
      subject: sampleMail.subject,
      html: sampleMail.html,
    });
  });

  it('passes attachments through as-is (Buffer + contentType)', async () => {
    const provider = new ResendProvider(buildConfig('resend'));
    await provider.send({ ...sampleMail, attachments: [sampleAttachment] });

    const payload = sendMock.mock.calls[0][0];
    expect(payload.attachments).toEqual([
      { filename: 'invoice.pdf', content: pdfBuffer, contentType: 'application/pdf' },
    ]);
  });

  it('omits the attachments key entirely when none are given', async () => {
    const provider = new ResendProvider(buildConfig('resend'));
    await provider.send(sampleMail);
    expect(sendMock.mock.calls[0][0]).not.toHaveProperty('attachments');
  });

  it('throws when the Resend API reports an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'Invalid API key' } });
    const provider = new ResendProvider(buildConfig('resend'));

    await expect(provider.send(sampleMail)).rejects.toThrow('Resend Fehler: Invalid API key');
  });
});
