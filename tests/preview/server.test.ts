// tests/preview/server.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { AddressInfo } from 'node:net';
import http from 'node:http';

// EmailDispatcher mocken, damit /api/send keine echten Provider-Clients baut
const dispatchMock = vi.fn().mockResolvedValue(undefined);
vi.mock('../../src/engine/dispatcher', () => ({
  EmailDispatcher: vi.fn().mockImplementation(() => ({ dispatch: dispatchMock })),
}));

import { createPreviewServer } from '../../src/preview/server';
import { buildConfig } from '../helpers';

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  server = createPreviewServer({ config: buildConfig('resend') });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('preview server', () => {
  it('serves the UI on /', async () => {
    const res = await fetch(baseUrl + '/');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('Guralnik Mailer');
    expect(html).toContain('/api/render');
  });

  it('exposes metadata (categories, themes, languages)', async () => {
    const res = await fetch(baseUrl + '/api/meta');
    const meta = await res.json();

    expect(res.status).toBe(200);
    expect(meta.categories).toHaveLength(4);
    expect(meta.themes).toHaveLength(10);
    expect(meta.languages).toHaveLength(10);
    expect(meta.configLoaded).toBe(true);
    expect(meta.brandName).toBe('Test Store');
  });

  it('renders a template with theme + language overrides', async () => {
    const res = await fetch(baseUrl + '/api/render?template=OrderConfirmation&theme=midnight&lang=de');
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.subject).toContain('Bestellung');
    expect(data.lang).toBe('de');
    expect(data.html).toContain('<html');
  });

  it('rejects unknown templates with a 400', async () => {
    const res = await fetch(baseUrl + '/api/render?template=NotATemplate&theme=modern&lang=en');
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Unknown template');
  });

  it('rejects unknown themes and languages with a 400', async () => {
    const badTheme = await fetch(baseUrl + '/api/render?template=Welcome&theme=neon&lang=en');
    expect(badTheme.status).toBe(400);

    const badLang = await fetch(baseUrl + '/api/render?template=Welcome&theme=modern&lang=xx');
    expect(badLang.status).toBe(400);
  });

  it('sends a test email through the dispatcher', async () => {
    const res = await fetch(baseUrl + '/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: 'Welcome', theme: 'modern', lang: 'en', to: 'me@example.com' }),
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(dispatchMock).toHaveBeenCalledWith('me@example.com', expect.any(String), expect.stringContaining('<html'));
  });

  it('validates the recipient address on /api/send', async () => {
    const res = await fetch(baseUrl + '/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: 'Welcome', theme: 'modern', lang: 'en', to: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await fetch(baseUrl + '/api/unknown');
    expect(res.status).toBe(404);
  });
});
