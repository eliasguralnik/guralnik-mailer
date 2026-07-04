<div align="center">
  <h3>✉️ Guralnik Mailer</h3>
  <p>A zero-code, multi-language, premium email engine for Medusa v2 and modern Node.js applications.</p>

  <p>
    <a href="https://github.com/eliasguralnik/guralnik-mailer/actions/workflows/test.yml"><img src="https://github.com/eliasguralnik/guralnik-mailer/actions/workflows/test.yml/badge.svg" alt="CI Status"></a>
    <a href="https://www.npmjs.com/package/guralnik-mailer"><img src="https://img.shields.io/npm/v/guralnik-mailer.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/guralnik-mailer"><img src="https://img.shields.io/npm/dm/guralnik-mailer.svg" alt="npm downloads"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#template-preview-server">Preview Server</a> •
    <a href="#medusa-integration">Medusa Setup</a> •
    <a href="#standalone-nodejs-support">Standalone Usage</a> •
    <a href="#available-templates">Templates</a> •
    <a href="#about-the-developer">About the Developer</a>
  </p>
</div>

---

## Overview

The Guralnik Mailer is a plug-and-play email package designed to simplify transaction emails for digital storefronts and SaaS platforms. Built natively for Medusa v2 (while fully supporting standalone usage), it entirely eliminates the need to manually build, translate, and route emails.

You provide a configuration file with your brand colors, select your preferred email provider, and the engine handles the rest—rendering responsive React templates, applying your selected design theme, translating content into the user's preferred language, and dispatching the email.

## Features

- **🪄 Setup Wizard:** An interactive CLI tool that configures your entire project with beautiful prompts in under ten seconds.
- **🛍️ Zero-Code Medusa Integration:** Automatically listens to 22 Medusa events. It extracts customer data, line items, address details, and variables without you writing a single line of subscriber logic.
- **🎨 10 Design Themes:** Switch between incredibly distinct aesthetic profiles (like `modern`, `minimal`, `midnight`, `monochrome`, `playful`, etc.) by changing a single word in your configuration.
- **🌐 10 Languages:** Out-of-the-box translations for English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Swedish, and Hebrew.
- **📦 19 Pre-built Templates:** Covers everything from order confirmations and refunds to password resets, abandoned carts, and review requests.
- **📞 Multi-Provider Routing:** Built-in routing plugins for **Resend, SendGrid, SMTP, AWS SES, and Mailgun** — switch providers by changing one word in your config.
- **👀 Live Preview Server:** Run `npx guralnik-mailer preview` to browse all templates in your browser, switch themes and languages live, inspect the HTML source, and send test emails.
- **📎 Attachment Support:** Attach invoices, PDFs, or any file to every email — the package passes your Buffers through to whichever provider you use.
- **🚀 Batch Sending:** Send campaigns to thousands of recipients with built-in rate limiting, automatic retries with exponential backoff, and progress callbacks.

---

## Installation

We've built an extremely smooth CLI wizard to get you started. This wizard will completely set up the `guralnik-mailer` package in your project, ask you for your preferences, and configure everything automatically.

Open your terminal in your project root and run:

```bash
npx guralnik-mailer
```

### The Setup Process (What it asks & what it does)
During the terminal process, here is exactly what you will be asked to input:

1. **"Which email provider do you use?"** -> Select `resend`, `sendgrid`, `smtp`, `ses`, or `mailgun`.
2. **Provider credentials** -> Depending on your choice:
   - *Resend / SendGrid:* your API key.
   - *SMTP:* host, port, username, and password.
   - *AWS SES:* your AWS region, plus an optional Access Key ID + Secret Access Key (leave blank to use the AWS default credential chain — env vars, shared config, IAM roles).
   - *Mailgun:* your API key, sending domain, and region (`us` or `eu`).
3. **"What is the name of your brand?"** -> E.g., `My Cool Store`. This will appear in the email footers and headers.
4. **"From what email address should emails be sent?"** -> E.g., `My Store <hello@mystore.com>`.
5. **"What is the URL of your store?"** -> The primary link used for logos and footers (e.g., `https://mystore.com`).
6. **"Which design theme do you want to use?"** -> Choose one of our 10 beautiful UI profiles (like `midnight` or `minimal`). This shapes every single email sent.
7. **"Are you using Medusa JS?"** -> If you select `Yes`, the wizard will automatically generate the required subscriber files in your `src/subscribers` folder!

**What happens next?**
The CLI will generate a `mailer.config.json` file in your root folder. If you answered "Yes" to Medusa, it will also inject the zero-code subscriber adapter. Finally, it installs the `guralnik-mailer` npm package into your dependencies. You are instantly ready to go!

### CLI Commands

| Command | Description |
| --- | --- |
| `npx guralnik-mailer` | Interactive setup wizard — generates `mailer.config.json` |
| `npx guralnik-mailer preview` | Local template preview server on port `4321` |
| `npx guralnik-mailer preview --port 5000` | Preview server on a custom port |
| `npx guralnik-mailer preview --no-open` | Preview server without auto-opening the browser |

---

## Configuration

If you didn't use the setup wizard, or just want to manually edit your settings, the package relies on a `mailer.config.json` file in the root directory of your project.

### Example `mailer.config.json`
```json
{
  "provider": "resend",
  "apiKey": "re_your_api_key_here",
  "from": "Your Brand <hello@your-domain.com>",
  "storeUrl": "https://your-store.com",
  "defaultLanguage": "en",
  "theme": {
    "designType": "midnight",
    "brandName": "Your Brand",
    "colors": {
      "primary": "#4F46E5",
      "background": "#111827",
      "text": "#F9FAFB"
    },
    "company": {
      "name": "Your Company LLC",
      "addressLine1": "123 Commerce St",
      "contactEmail": "support@your-domain.com"
    },
    "socials": {
      "instagram": "https://instagram.com/your_brand",
      "twitter": "https://twitter.com/your_brand"
    }
  }
}
```

### Supported Providers

Switch providers by changing the `"provider"` value — the rest of your config (theme, languages, templates) stays untouched.

#### `resend`
```json
{
  "provider": "resend",
  "apiKey": "re_your_api_key"
}
```

#### `sendgrid`
```json
{
  "provider": "sendgrid",
  "apiKey": "SG.your_api_key"
}
```

#### `smtp`
```json
{
  "provider": "smtp",
  "smtp": {
    "host": "smtp.your-server.com",
    "port": 587,
    "user": "mailer@your-domain.com",
    "pass": "your_password"
  }
}
```

#### `ses` (AWS SES)
```json
{
  "provider": "ses",
  "region": "eu-central-1",
  "accessKeyId": "AKIA...",
  "secretAccessKey": "your_secret"
}
```
`accessKeyId` and `secretAccessKey` are **optional**. If you omit them, the AWS SDK v3 default credential chain is used automatically — environment variables (`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`), your shared `~/.aws` config, ECS/EC2 IAM roles, SSO sessions, etc. That means on AWS infrastructure you usually need **zero credentials in the config**:
```json
{
  "provider": "ses",
  "region": "eu-central-1"
}
```
> Emails **with attachments** are automatically sent as raw MIME messages via `SendRawEmailCommand`; plain emails use the regular `SendEmailCommand`.

#### `mailgun`
```json
{
  "provider": "mailgun",
  "apiKey": "your_mailgun_api_key",
  "domain": "mg.your-domain.com",
  "region": "eu"
}
```
`region` is optional: `"us"` (default, `api.mailgun.net`) or `"eu"` (`api.eu.mailgun.net`).

### Built-in Theme Types
Change the `"designType"` property to instantly overhaul the visual look of all your emails:
- `modern` (Default: clean, rounded edges, soft shadows)
- `minimal` (Stripped-back, strict whitespace, pure content)
- `elegant` (Sophisticated typography, thin borders)
- `midnight` (Stunning dark-mode experience)
- `monochrome` (Strict black-and-white grayscale layout)
- `nature` (Earthy, organic styling with soft corners)
- `playful` (Vibrant, friendly aesthetics)
- `bold` (High contrast, sharp edges, heavy typography)
- `futuristic` (Cyber-inspired layouts with neon accents)
- `classic` (Traditional, trustworthy email formats)

---

## Template Preview Server

Want to see exactly what your customers will receive — in your branding, in every theme, in every language — before anything goes live? Run:

```bash
npx guralnik-mailer preview
```

This starts a local preview server on [`http://localhost:4321`](http://localhost:4321) (use `--port <number>` to change it) and automatically opens your browser. Inside you get:

- **📚 All 19 templates** in a sidebar, grouped by category (Customer & Account Lifecycle, Order Processing, Post-Purchase & Operational, Marketing & Engagement).
- **🎨 Live theme switching** — flip through all 10 design themes with a dropdown; the preview re-renders instantly without a page reload.
- **🌐 Live language switching** — check all 10 translations, including Hebrew RTL rendering.
- **🧪 Realistic mock data** — every template is rendered with sensible, auto-generated demo content (names, product images, prices, order IDs, tracking numbers).
- **📤 "Send test" button** — sends the currently displayed template + theme + language combination to any email address you enter, using the real provider credentials from your `mailer.config.json`.
- **🔍 HTML source view** — toggle between the rendered email and its raw HTML source (great for debugging email-client quirks), with one-click copy.
- **📱 Desktop/mobile toggle** — preview how the email collapses at phone widths.

The preview reads your `mailer.config.json` automatically, so you see **your** brand name, colors, and footer. No config yet? The preview still works with demo branding — only test-sending is disabled.

The preview server is a pure development tool: it is built on Node's built-in `http` module (zero extra dependencies) and is only reachable through the CLI — it never ends up in your production bundle.

---

## Medusa Integration

The Guralnik Mailer offers a 100% zero-code integration with Medusa JS. The intelligent `SmartMedusaAdapter` automatically connects to the event bus, parses complex payload data intelligently, and triggers the appropriate email.

### Setup Instructions
If you ran `npx guralnik-mailer`, this code was already injected into your project. If not, simply create a subscriber file:

```typescript
// src/subscribers/mailer.ts
import { SmartMedusaAdapter } from "guralnik-mailer";

const adapter = new SmartMedusaAdapter();

export default async function mailerSubscriber({ data, eventName }: any) {
  // Pass the event directly to the smart adapter
  await adapter.handleEvent(eventName, data);
}

// Subscribe to all 22 supported Medusa events automatically
export const config = {
  event: SmartMedusaAdapter.getSupportedEvents(),
  context: { subscriberId: "guralnik-mailer" }
};
```
The adapter handles everything: address formatting, line-item arrays (with product images), currency symbols, refund amounts, and customer language detection (`customer.metadata.locale`, `cart.context.locale`, etc.).

---

## Standalone Node.js Support

If you aren't using Medusa, the core engine allows you to send stunning emails manually anywhere in your Node/TypeScript backend.

### Sending a single email

```typescript
import { mailer } from "guralnik-mailer";

// Send a localized, themed email to the user
await mailer.send("OrderConfirmation", "customer@example.com", {
  locale: "de", // Translates everything to German instantly
  name: "John Doe",
  orderId: "ORD-12345",
  items: [
    { title: "Ceramic Mug", quantity: 2, price: "45.00", currency: "€" }
  ],
  totals: {
    subtotal: "90.00 €",
    shipping: "5.00 €",
    total: "95.00 €"
  }
});
```

*(Tip: Supported languages for the `locale` parameter are `en`, `de`, `fr`, `es`, `it`, `nl`, `pt`, `pl`, `sv`, `he`.)*

### Sending attachments

Attach invoices, receipts, or any other file by passing an optional fourth argument. You generate the file (Buffer or base64 string) — the package passes it through to your provider in exactly the format that provider expects. Works identically across all 5 providers:

```typescript
import { mailer } from "guralnik-mailer";
import { readFile } from "node:fs/promises";

const pdfBuffer = await readFile("./invoices/ORD-12345.pdf");

await mailer.send("OrderConfirmation", "customer@example.com", {
  locale: "de",
  name: "John Doe",
  orderId: "ORD-12345",
  // ... template props
}, {
  attachments: [
    { filename: "invoice.pdf", content: pdfBuffer, contentType: "application/pdf" }
  ]
});
```

- `content` accepts a `Buffer` or a **base64-encoded string**.
- `contentType` is optional (defaults to `application/octet-stream`).
- With AWS SES, attachments are transparently sent as a raw MIME message — you don't have to do anything.

### Batch sending

Need to send a campaign or notification to many recipients? `mailer.sendBatch()` sends the same template to a list of recipients — each with their own data and language — while respecting your provider's rate limits:

```typescript
import { mailer } from "guralnik-mailer";

const result = await mailer.sendBatch("NewsletterWelcome", [
  { to: "user1@example.com", data: { name: "Anna", locale: "de" } },
  { to: "user2@example.com", data: { name: "Yossi", locale: "he" } },
  { to: "user3@example.com", data: { name: "Marie", locale: "fr" } },
  // ... thousands more
], {
  requestsPerSecond: 10,   // Rate limiting (default: 10)
  retryOnFailure: true,    // Auto-retry transient errors (default: true)
  maxRetries: 3,           // Retries per recipient (default: 3)
  retryBackoffMs: 500,     // Exponential backoff base delay (default: 500ms)
  onProgress: (sent, total) => console.log(`${sent}/${total} processed`),
  onError: (recipient, error) => console.error(`Failed: ${recipient}`, error.message),
});

console.log(result);
// { sent: 2998, failed: 2, errors: [{ recipient: "...", error: Error }] }
```

How it behaves:

- **Rate limiting:** sends are spaced evenly (`requestsPerSecond: 10` → one send every 100ms), so you never blow through provider limits.
- **Automatic retries:** transient failures (HTTP `429`, `5xx`, network resets) are retried with exponential backoff (`500ms → 1s → 2s → ...`). Permanent errors (invalid address, auth failure) fail immediately without wasting retries.
- **Per-recipient rendering:** every recipient gets their own render — their own name, their own language, their own data.
- **Summary result:** you always get `{ sent, failed, errors }` back; a failing recipient never aborts the rest of the batch.
- Works with all 5 providers, and accepts an `attachments` array applied to every email in the batch.

---

## Available Templates

Click any template name to view its source code structure. All templates adapt intelligently to the 10 themes and 10 language dictionaries.

**Customer & Account Lifecycle**
- 🤝 [`Welcome`](./src/templates/WelcomeEmail.tsx) - Sent when a new customer registers.
- 🔐 [`PasswordReset`](./src/templates/PasswordResetEmail.tsx) - Secure token link for resetting a forgotten password.
- ✉️ [`CustomerVerify`](./src/templates/CustomerVerifyEmail.tsx) - Email verification request.
- 🎟️ [`InviteCreated`](./src/templates/InviteCreatedEmail.tsx) - Admin/Customer team invitations.
- 🗑️ [`AccountDeleted`](./src/templates/AccountDeletedEmail.tsx) - Goodbye email after account deletion.

**Order Processing**
- ✅ [`OrderConfirmation`](./src/templates/OrderConfirmationEmail.tsx) - Beautiful receipt with line items and tracking links.
- 🚚 [`ShipmentCreated`](./src/templates/ShipmentCreatedEmail.tsx) - Notifies the customer that their order has shipped (includes tracking).
- 🎁 [`OrderDelivered`](./src/templates/OrderDeliveredEmail.tsx) - Sent when the package has arrived.
- ❌ [`OrderCanceled`](./src/templates/OrderCanceledEmail.tsx) - Cancellation notification.

**Post-Purchase & Operational**
- 💸 [`OrderRefund`](./src/templates/OrderRefundEmail.tsx) - Detail breakdown of refunded amounts and methods.
- 📬 [`OrderReturn`](./src/templates/OrderReturnEmail.tsx) - Instructions for placing a return.
- 🔄 [`OrderExchange`](./src/templates/OrderExchangeEmail.tsx) - Details regarding item exchanges.
- 🔄 [`OrderTransfer`](./src/templates/OrderTransferEmail.tsx) - Ownership modifications of orders.
- ⚠️ [`OrderPaymentFailed`](./src/templates/OrderPaymentFailedEmail.tsx) - Alert prompting the user to retry payment.

**Marketing & Engagement**
- ⭐ [`ReviewRequest`](./src/templates/ReviewRequestEmail.tsx) - Sent a few days after delivery to request feedback.
- 🛒 [`AbandonedCart`](./src/templates/AbandonedCartEmail.tsx) - Highly converting reminder displaying unpurchased cart items.
- 🎁 [`GiftCardCreated`](./src/templates/GiftCardCreatedEmail.tsx) - A stunning layout revealing a digital gift card code.
- 🔔 [`BackInStock`](./src/templates/BackInStockEmail.tsx) - Restock alerts for subscribed customers.
- 📧 [`NewsletterWelcome`](./src/templates/NewsletterWelcomeEmail.tsx) - Thank you email for subscribing to a newsletter.

---

## Testing & Quality

The package ships with a [Vitest](https://vitest.dev/) test suite covering all 5 provider adapters (with fully mocked SDKs — no real API calls), template rendering across themes and languages, batch rate-limiting and retry behavior, attachment handling, and the preview server API. Every push and pull request runs the suite against Node 18, 20, and 22 via GitHub Actions.

```bash
npm test           # run the suite once
npm run test:watch # watch mode
npm run test:coverage # with coverage report
```

See the [CHANGELOG](./CHANGELOG.md) for a complete release history.

---

## About the Developer

The Guralnik Mailer was built by me—**Elias Guralnik**.

I'm a 20-year-old full-stack web developer based in Israel, specializing in building modern applications and custom e-commerce architectures. My focus goes way beyond the frontend; I spend my time deep in Next.js, React, server infrastructures, APIs, and headless commerce engines like Medusa and Docker.

This package was born directly from that full-stack perspective. While building real-world client projects and digital storefronts, I kept hitting the exact same bottleneck: transactional emails. The pain isn't just about wrestling with legacy inline CSS to make Outlook's dark mode behave. The real nightmare is the logic behind it—managing dozens of template variations, dynamically injecting translation files, and cleanly syncing backend data without turning your codebase into a mess. It’s a massive, error-prone time sink that slows down development.

This package is my answer to that chaos. I built Guralnik Mailer to radically decouple visual design logic from your core application code. The result is a powerful email architecture that guarantees premium, out-of-the-box quality. With 10 ready-to-use design themes, smart data extraction that maps natively with Medusa, and a clean single-file configuration, every line of code was engineered to save you hours of work without dropping a single pixel in aesthetic or functional quality.

Whether you have feedback, implementation questions, or just want to say hi—feel free to reach out!

- **Email:** [guralnikelias390@gmail.com](mailto:guralnikelias390@gmail.com)
- **NPM Profile:** [@guralnik-mailer](https://www.npmjs.com/package/guralnik-mailer)
- **My Website:** [guralnik.dev](https://guralnik.dev)

### Support the Project

Guralnik Mailer is an open-source project built to save developers from the absolute headache of debugging legacy HTML tables across dozens of email clients. 

If this package helped streamline your email architecture and saved you hours of work, consider supporting the late-night coding sessions! You can back the project by dropping a star on GitHub, sharing your thoughts in the issues, or buying me a coffee. 

[![Buy Me A Coffee](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/eliasguralnik)

---

## License
MIT License. Feel free to use it in your personal and commercial projects.
