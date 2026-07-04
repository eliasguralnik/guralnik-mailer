// tests/providers/ses.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const sesSendMock = vi.fn();
const sesClientMock = vi.fn(() => ({ send: sesSendMock }));

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: vi.fn().mockImplementation((...args: any[]) => sesClientMock(...args)),
  SendEmailCommand: vi.fn().mockImplementation((input: any) => ({ __type: 'SendEmailCommand', input })),
  SendRawEmailCommand: vi.fn().mockImplementation((input: any) => ({ __type: 'SendRawEmailCommand', input })),
}));

import { SESClient } from '@aws-sdk/client-ses';
import { SesProvider } from '../../src/providers/SesProvider';
import { buildConfig, sampleMail, sampleAttachment } from '../helpers';

describe('SesProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sesSendMock.mockResolvedValue({ MessageId: 'ses-id-1' });
  });

  it('uses explicit credentials when configured', () => {
    new SesProvider(buildConfig('ses', { accessKeyId: 'AKIA_TEST', secretAccessKey: 'secret' }));

    expect(SESClient).toHaveBeenCalledWith({
      region: 'eu-central-1',
      credentials: { accessKeyId: 'AKIA_TEST', secretAccessKey: 'secret' },
    });
  });

  it('falls back to the AWS default credential chain when no keys are set', () => {
    new SesProvider(buildConfig('ses'));

    const clientConfig = (SESClient as any).mock.calls[0][0];
    expect(clientConfig.region).toBe('eu-central-1');
    expect(clientConfig).not.toHaveProperty('credentials');
  });

  it('sends plain emails via SendEmailCommand', async () => {
    const provider = new SesProvider(buildConfig('ses'));
    const id = await provider.send(sampleMail);

    expect(id).toBe('ses-id-1');
    const command = sesSendMock.mock.calls[0][0];
    expect(command.__type).toBe('SendEmailCommand');
    expect(command.input).toEqual({
      Source: sampleMail.from,
      Destination: { ToAddresses: [sampleMail.to] },
      Message: {
        Subject: { Data: sampleMail.subject, Charset: 'UTF-8' },
        Body: { Html: { Data: sampleMail.html, Charset: 'UTF-8' } },
      },
    });
  });

  it('switches to SendRawEmailCommand (raw MIME) when attachments are present', async () => {
    const provider = new SesProvider(buildConfig('ses'));
    await provider.send({ ...sampleMail, attachments: [sampleAttachment] });

    const command = sesSendMock.mock.calls[0][0];
    expect(command.__type).toBe('SendRawEmailCommand');

    const raw = command.input.RawMessage.Data.toString('utf-8');
    expect(raw).toContain(`From: ${sampleMail.from}`);
    expect(raw).toContain(`To: ${sampleMail.to}`);
    expect(raw).toContain('Content-Type: multipart/mixed');
    expect(raw).toContain('Content-Type: application/pdf; name="invoice.pdf"');
    expect(raw).toContain('Content-Disposition: attachment; filename="invoice.pdf"');
  });

  it('wraps SDK errors in a readable message', async () => {
    sesSendMock.mockRejectedValue(new Error('MessageRejected: Email address is not verified'));
    const provider = new SesProvider(buildConfig('ses'));

    await expect(provider.send(sampleMail)).rejects.toThrow('SES Fehler: MessageRejected');
  });
});
