// src/providers/mime.ts
// Minimal RFC 2822 / MIME builder. AWS SES only accepts attachments through
// SendRawEmailCommand, which expects a fully assembled raw message.
import { MailOptions } from './index';

function encodeHeaderValue(value: string): string {
  // Encode as RFC 2047 word if the value contains non-ASCII characters
  if (/^[\x20-\x7E]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, 'utf-8').toString('base64')}?=`;
}

function wrapBase64(base64: string): string {
  // RFC 2045: base64 lines must not exceed 76 characters
  return base64.replace(/(.{76})/g, '$1\r\n').trim();
}

export function buildRawMimeMessage(options: MailOptions): string {
  const boundary = `----=_guralnik_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  const lines: string[] = [
    `From: ${options.from}`,
    `To: ${options.to}`,
    `Subject: ${encodeHeaderValue(options.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(Buffer.from(options.html, 'utf-8').toString('base64')),
  ];

  for (const attachment of options.attachments || []) {
    const contentType = attachment.contentType || 'application/octet-stream';
    const content = Buffer.isBuffer(attachment.content)
      ? attachment.content.toString('base64')
      : Buffer.from(attachment.content, 'base64').toString('base64'); // normalizes base64 strings

    lines.push(
      '',
      `--${boundary}`,
      `Content-Type: ${contentType}; name="${attachment.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      '',
      wrapBase64(content),
    );
  }

  lines.push('', `--${boundary}--`, '');
  return lines.join('\r\n');
}
