// tests/providers/mime.test.ts
import { describe, it, expect } from 'vitest';
import { buildRawMimeMessage } from '../../src/providers/mime';
import { sampleMail, sampleAttachment, pdfBuffer } from '../helpers';

describe('buildRawMimeMessage', () => {
  it('builds a multipart/mixed message with an HTML body part', () => {
    const raw = buildRawMimeMessage({ ...sampleMail, attachments: [] });

    expect(raw).toContain(`From: ${sampleMail.from}`);
    expect(raw).toContain(`To: ${sampleMail.to}`);
    expect(raw).toContain(`Subject: ${sampleMail.subject}`);
    expect(raw).toContain('MIME-Version: 1.0');
    expect(raw).toContain('Content-Type: multipart/mixed; boundary="');
    expect(raw).toContain('Content-Type: text/html; charset=UTF-8');

    // HTML content is base64 encoded and decodable
    const htmlBase64 = raw
      .split('Content-Transfer-Encoding: base64\r\n\r\n')[1]
      .split('\r\n--')[0]
      .replace(/\r\n/g, '');
    expect(Buffer.from(htmlBase64, 'base64').toString('utf-8')).toBe(sampleMail.html);
  });

  it('encodes non-ASCII subjects as RFC 2047 words', () => {
    const raw = buildRawMimeMessage({ ...sampleMail, subject: 'Bestellung bestätigt 🎉' });
    expect(raw).toMatch(/Subject: =\?UTF-8\?B\?[A-Za-z0-9+/=]+\?=/);
  });

  it('appends attachment parts with disposition and content type', () => {
    const raw = buildRawMimeMessage({ ...sampleMail, attachments: [sampleAttachment] });

    expect(raw).toContain('Content-Type: application/pdf; name="invoice.pdf"');
    expect(raw).toContain('Content-Disposition: attachment; filename="invoice.pdf"');
    expect(raw).toContain(pdfBuffer.toString('base64'));
  });

  it('closes the MIME message with a final boundary', () => {
    const raw = buildRawMimeMessage({ ...sampleMail, attachments: [sampleAttachment] });
    const boundary = raw.match(/boundary="([^"]+)"/)![1];
    expect(raw.trimEnd().endsWith(`--${boundary}--`)).toBe(true);
  });

  it('wraps base64 lines at 76 characters (RFC 2045)', () => {
    const bigAttachment = { filename: 'big.bin', content: Buffer.alloc(5000, 7) };
    const raw = buildRawMimeMessage({ ...sampleMail, attachments: [bigAttachment] });

    for (const line of raw.split('\r\n')) {
      expect(line.length).toBeLessThanOrEqual(998); // RFC hard limit
      if (/^[A-Za-z0-9+/=]+$/.test(line) && line.length > 0) {
        expect(line.length).toBeLessThanOrEqual(76);
      }
    }
  });
});
