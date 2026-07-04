# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-07-04

### Added

- **AWS SES provider** (`"provider": "ses"`): sends via `@aws-sdk/client-ses` (SDK v3). Configure a `region` plus optional `accessKeyId`/`secretAccessKey` — when omitted, the AWS SDK default credential chain (env vars, shared config, IAM roles) is used automatically. Emails with attachments are sent as raw MIME messages via `SendRawEmailCommand`.
- **Mailgun provider** (`"provider": "mailgun"`): sends via the official `mailgun.js` SDK. Configure `apiKey`, `domain`, and an optional `region` (`us` or `eu`, defaults to `us`).
- **Template preview server**: `npx guralnik-mailer preview` starts a local server (default port `4321`, configurable via `--port`) and opens your browser. Browse all 19 templates grouped by category, switch between all 10 themes and 10 languages live, inspect the raw HTML source, toggle desktop/mobile viewport widths, and send test emails to any address using your configured provider. Zero extra dependencies — built on `node:http`; never included in production bundles.
- **Attachment support**: `mailer.send()` accepts an optional fourth argument with an `attachments` array (`{ filename, content, contentType }`). Content is passed through as-is (Buffer or base64 string) and mapped to the correct format for each of the 5 providers.
- **Batch sending**: new `mailer.sendBatch(template, recipients, options)` API with configurable rate limiting (`requestsPerSecond`), automatic retries with exponential backoff on transient errors (429/5xx/network), `onProgress`/`onError` callbacks, per-recipient locale + data, and a `{ sent, failed, errors }` summary result. Works across all 5 providers.
- **Setup wizard**: the provider question now offers all 5 providers. AWS SES prompts for region and optional credentials; Mailgun prompts for API key, domain, and region; SMTP now asks for host, port, username, and password individually.
- **Test suite**: Vitest unit tests covering all 5 provider adapters (mocked SDKs), template rendering across themes/languages, batch rate-limiting/retry behavior, attachment handling, the raw MIME builder, and the preview server API.
- **CI/CD**: GitHub Actions workflows — `test.yml` runs the test suite on every push/PR across Node 18/20/22, `publish.yml` tests and publishes to npm on `v*` tag pushes.

### Fixed

- Configs written by the setup wizard (using the `from` key) are now normalized to the engine's `senderEmail` field, and the nested `smtp` config block documented in the README is now understood by the SMTP provider.
- Importing the package no longer throws immediately when `mailer.config.json` is missing — the config is loaded lazily on the first send instead.

## [2.0.2] - 2026-04-02

### Added

- Interactive CLI setup wizard (`npx guralnik-mailer`) that generates `mailer.config.json`, optionally injects the Medusa subscriber, and installs the package.
- 19 pre-built, responsive React email templates covering the customer lifecycle, order processing, post-purchase flows, and marketing.
- 10 design themes (`modern`, `minimal`, `elegant`, `midnight`, `monochrome`, `nature`, `playful`, `futuristic`, `bold`, `classic`) switchable via a single config value.
- Out-of-the-box translations for 10 languages: English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Swedish, and Hebrew (including RTL rendering).
- Zero-code Medusa v2 integration: the `SmartMedusaAdapter` listens to 22 Medusa events and extracts customers, line items, addresses, totals, and locales automatically.
- Multi-provider routing for Resend, SendGrid, and standard SMTP.
- Standalone Node.js/TypeScript API: `mailer.send(template, to, data)`.

[2.1.0]: https://github.com/eliasguralnik/guralnik-mailer/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/eliasguralnik/guralnik-mailer/releases/tag/v2.0.2
