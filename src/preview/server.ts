// src/preview/server.ts
// Lokaler Template-Preview-Server (npx guralnik-mailer preview).
// Bewusst auf node:http gebaut — null zusätzliche Runtime-Dependencies,
// und landet niemals in Produktions-Bundles (wird nur von der CLI geladen).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { SmartMailerConfig } from '../types';
import { TemplateRegistry, TemplateName } from '../engine/registry';
import { EmailBuilder } from '../engine/builder';
import { EmailDispatcher } from '../engine/dispatcher';
import { normalizeConfig } from '../engine';
import { renderPreviewPage } from './ui';
import { templateCategories, previewLanguages, previewThemes, getMockData } from './mock-data';

export interface PreviewServerOptions {
  port?: number;
  openBrowser?: boolean;
  /** Überschreibt das Config-Loading — nur für Tests gedacht. */
  config?: SmartMailerConfig;
}

interface LoadedConfig {
  config: SmartMailerConfig;
  /** true, wenn eine echte mailer.config.json gefunden wurde (→ "Send test" aktiv) */
  isReal: boolean;
}

// Fallback, damit die Preview auch ohne mailer.config.json funktioniert
const DEMO_CONFIG: SmartMailerConfig = {
  provider: 'resend',
  apiKey: 'preview-demo-key',
  senderEmail: 'Acme Store <hello@example.com>',
  storeUrl: 'https://example.com',
  defaultLanguage: 'en',
  theme: {
    designType: 'modern',
    brandName: 'Acme Store',
    colors: { primary: '#0A0A0A', background: '#f6f9fc', text: '#1a1a2e' },
    company: { name: 'Acme Store GmbH', addressLine1: '123 Commerce St, Berlin', contactEmail: 'support@example.com' },
    socials: { instagram: 'https://instagram.com/acme', website: 'https://example.com' },
  },
};

function loadConfig(override?: SmartMailerConfig): LoadedConfig {
  if (override) return { config: override, isReal: true };

  const configPath = path.join(process.cwd(), 'mailer.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return { config: normalizeConfig(raw), isReal: true };
    } catch {
      console.warn('⚠ mailer.config.json is not valid JSON — falling back to demo branding.');
    }
  }
  return { config: DEMO_CONFIG, isReal: false };
}

function json(res: http.ServerResponse, statusCode: number, payload: any) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) reject(new Error('Request body too large'));
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function openInBrowser(url: string) {
  const platform = process.platform;
  const [cmd, args] =
    platform === 'darwin' ? ['open', [url]] :
    platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] :
    ['xdg-open', [url]];
  try {
    spawn(cmd, args as string[], { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  } catch {
    // Browser nicht automatisch öffnbar — URL steht im Terminal
  }
}

function validateParams(template: string | null, theme: string | null, lang: string | null): string | null {
  if (!template || !(template in TemplateRegistry)) {
    return `Unknown template '${template}'. Valid: ${Object.keys(TemplateRegistry).join(', ')}`;
  }
  if (theme && !previewThemes.includes(theme)) {
    return `Unknown theme '${theme}'. Valid: ${previewThemes.join(', ')}`;
  }
  if (lang && !previewLanguages.some((l) => l.code === lang)) {
    return `Unknown language '${lang}'. Valid: ${previewLanguages.map((l) => l.code).join(', ')}`;
  }
  return null;
}

export function createPreviewServer(options: PreviewServerOptions = {}) {
  const loaded = loadConfig(options.config);

  // Ein Builder pro Theme reicht — die Config wird pro Request geklont,
  // damit das Theme-Dropdown live umschalten kann.
  const buildForTheme = (theme: string | null) => {
    const config: SmartMailerConfig = {
      ...loaded.config,
      theme: { ...loaded.config.theme, designType: (theme || loaded.config.theme.designType) as any },
    };
    return { config, builder: new EmailBuilder(config) };
  };

  let dispatcher: EmailDispatcher | null = null;
  const getDispatcher = () => {
    if (!dispatcher) dispatcher = new EmailDispatcher(loaded.config);
    return dispatcher;
  };

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    try {
      // ─── UI ───
      if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderPreviewPage());
        return;
      }

      // ─── Metadata für das Frontend ───
      if (req.method === 'GET' && url.pathname === '/api/meta') {
        json(res, 200, {
          categories: templateCategories,
          themes: previewThemes,
          languages: previewLanguages,
          defaultTheme: loaded.config.theme.designType || 'modern',
          defaultLanguage: loaded.config.defaultLanguage || 'en',
          brandName: loaded.config.theme.brandName,
          provider: loaded.config.provider,
          configLoaded: loaded.isReal,
        });
        return;
      }

      // ─── Live-Rendering mit Mock-Daten ───
      if (req.method === 'GET' && url.pathname === '/api/render') {
        const template = url.searchParams.get('template');
        const theme = url.searchParams.get('theme');
        const lang = url.searchParams.get('lang');

        const validationError = validateParams(template, theme, lang);
        if (validationError) return json(res, 400, { error: validationError });

        const { builder } = buildForTheme(theme);
        const mockData = { ...getMockData(template as TemplateName), locale: lang || undefined };
        const result = await builder.build(template as TemplateName, mockData);

        json(res, 200, { html: result.html, subject: result.subject, lang: result.lang });
        return;
      }

      // ─── Test-Email an echte Adresse schicken ───
      if (req.method === 'POST' && url.pathname === '/api/send') {
        if (!loaded.isReal) {
          return json(res, 400, {
            error: 'No mailer.config.json found. Run `npx guralnik-mailer` first to configure a provider.',
          });
        }

        const body = await readBody(req);
        const { template, theme, lang, to } = body;

        if (!to || typeof to !== 'string' || !to.includes('@')) {
          return json(res, 400, { error: 'Please provide a valid recipient email address.' });
        }
        const validationError = validateParams(template, theme, lang);
        if (validationError) return json(res, 400, { error: validationError });

        const { builder } = buildForTheme(theme);
        const mockData = { ...getMockData(template as TemplateName), locale: lang || undefined };
        const result = await builder.build(template as TemplateName, mockData);

        await getDispatcher().dispatch(to, result.subject, result.html);

        json(res, 200, {
          ok: true,
          message: `Test email sent to ${to} via ${loaded.config.provider}! 🚀`,
        });
        return;
      }

      json(res, 404, { error: `Not found: ${req.method} ${url.pathname}` });
    } catch (error: any) {
      json(res, 500, { error: error.message || 'Internal server error' });
    }
  });
}

export function startPreviewServer(options: PreviewServerOptions = {}): Promise<http.Server> {
  const port = options.port ?? 4321;
  const server = createPreviewServer(options);

  return new Promise((resolve, reject) => {
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${port} is already in use. Try: npx guralnik-mailer preview --port ${port + 1}\n`);
        process.exit(1);
      }
      reject(error);
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log('');
      console.log('  ✉️  Guralnik Mailer Preview');
      console.log(`  ➜  Local: ${url}`);
      console.log('  ➜  19 templates · 10 themes · 10 languages');
      console.log('  ➜  Press Ctrl+C to stop');
      console.log('');
      if (options.openBrowser !== false) openInBrowser(url);
      resolve(server);
    });
  });
}
