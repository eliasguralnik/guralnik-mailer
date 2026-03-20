<div align="center">
  <h3>✉️ Guralnik Mailer</h3>
  <p>A zero-code, multi-language, premium email engine for Medusa v2 and modern Node.js applications.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#medusa-integration">Medusa Setup</a> •
    <a href="#templates">Templates</a> •
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
- **📞 Multi-Provider Routing:** Built-in routing plugins for Resend, SendGrid, and standard SMTP.

---

## Installation

We've built an extremely smooth CLI wizard to get you started. This wizard will completely set up the `guralnik-mailer` package in your project, ask you for your preferences, and configure everything automatically.

Open your terminal in your project root and run:

```bash
npx guralnik-mailer
```

### The Setup Process (What it asks & what it does)
During the terminal process, here is exactly what you will be asked to input:

1. **"Which email provider do you use?"** -> Select `resend`, `sendgrid`, or standard `smtp`.
2. **"Enter your API Key (or connection URI)"** -> Paste your provider key (e.g., `re_123456789...` for Resend).
3. **"What is the name of your brand?"** -> E.g., `My Cool Store`. This will appear in the email footers and headers.
4. **"From what email address should emails be sent?"** -> E.g., `My Store <hello@mystore.com>`.
5. **"What is the URL of your store?"** -> The primary link used for logos and footers (e.g., `https://mystore.com`).
6. **"Which design theme do you want to use?"** -> Choose one of our 10 beautiful UI profiles (like `midnight` or `minimal`). This shapes every single email sent.
7. **"Are you using Medusa JS?"** -> If you select `Yes`, the wizard will automatically generate the required subscriber files in your `src/subscribers` folder!

**What happens next?**
The CLI will generate a `mailer.config.json` file in your root folder. If you answered "Yes" to Medusa, it will also inject the zero-code subscriber adapter. Finally, it installs the `guralnik-mailer` npm package into your dependencies. You are instantly ready to go!

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
- **`resend`** (Requires `apiKey`)
- **`sendgrid`** (Requires `apiKey`)
- **`smtp`** (Requires an `smtp` object with `host`, `port`, `user`, and `pass` properties instead of an `apiKey`)

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

## Available Templates

Click any template name to view its source code structure. All templates adapt intelligently to the 10 themes and 10 language dictionaries.

**Customer & Account Lifecycle**
- 🤝 [`Welcome`](./src/templates/Welcome.tsx) - Sent when a new customer registers.
- 🔐 [`PasswordReset`](./src/templates/PasswordReset.tsx) - Secure token link for resetting a forgotten password.
- ✉️ [`CustomerVerify`](./src/templates/CustomerVerify.tsx) - Email verification request.
- 🎟️ [`InviteCreated`](./src/templates/InviteCreated.tsx) - Admin/Customer team invitations.
- 🗑️ [`AccountDeleted`](./src/templates/AccountDeleted.tsx) - Goodbye email after account deletion.

**Order Processing**
- ✅ [`OrderConfirmation`](./src/templates/OrderConfirmation.tsx) - Beautiful receipt with line items and tracking links.
- 🚚 [`ShipmentCreated`](./src/templates/ShipmentCreated.tsx) - Notifies the customer that their order has shipped (includes tracking).
- 🎁 [`OrderDelivered`](./src/templates/OrderDelivered.tsx) - Sent when the package has arrived.
- ❌ [`OrderCanceled`](./src/templates/OrderCanceled.tsx) - Cancellation notification.

**Post-Purchase & Operational**
- 💸 [`OrderRefund`](./src/templates/OrderRefund.tsx) - Detail breakdown of refunded amounts and methods.
- 📬 [`OrderReturn`](./src/templates/OrderReturn.tsx) - Instructions for placing a return.
- 🔄 [`OrderExchange`](./src/templates/OrderExchange.tsx) - Details regarding item exchanges.
- 🔄 [`OrderTransfer`](./src/templates/OrderTransfer.tsx) - Ownership modifications of orders.
- ⚠️ [`OrderPaymentFailed`](./src/templates/OrderPaymentFailed.tsx) - Alert prompting the user to retry payment.

**Marketing & Engagement**
- ⭐ [`ReviewRequest`](./src/templates/ReviewRequest.tsx) - Sent a few days after delivery to request feedback.
- 🛒 [`AbandonedCart`](./src/templates/AbandonedCart.tsx) - Highly converting remainder displaying unpurchased cart items.
- 🎁 [`GiftCardCreated`](./src/templates/GiftCardCreated.tsx) - A stunning layout revealing a digital gift card code.
- 🔔 [`BackInStock`](./src/templates/BackInStock.tsx) - Restock alerts for subscribed customers.
- 📧 [`NewsletterWelcome`](./src/templates/NewsletterWelcome.tsx) - Thank you email for subscribing to a newsletter.

---

## Standalone Node.js Support

If you aren't using Medusa, the core engine allows you to send stunning emails manually anywhere in your Node/TypeScript backend.

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

---

## About the Developer

The Guralnik Mailer was built by me—**Elias Guralnik**.

I'm a 19-year-old full-stack web developer based in Israel, specializing in building modern applications and custom e-commerce architectures. My focus goes way beyond the frontend; I spend my time deep in Next.js, React, server infrastructures, APIs, and headless commerce engines like Medusa and Docker.

This package was born directly from that full-stack perspective. While building real-world client projects and digital storefronts, I kept hitting the exact same bottleneck: transactional emails. The pain isn't just about wrestling with legacy inline CSS to make Outlook's dark mode behave. The real nightmare is the logic behind it—managing dozens of template variations, dynamically injecting translation files, and cleanly syncing backend data without turning your codebase into a mess. It’s a massive, error-prone time sink that slows down development.

This package is my answer to that chaos. I built Guralnik Mailer to radically decouple visual design logic from your core application code. The result is a powerful email architecture that guarantees premium, out-of-the-box quality. With 10 ready-to-use design themes, smart data extraction that maps natively with Medusa, and a clean single-file configuration, every line of code was engineered to save you hours of work without dropping a single pixel in aesthetic or functional quality.

Whether you have feedback, implementation questions, or just want to say hi—feel free to reach out!

- **Email:** [guralnikelias390@gmail.com](mailto:guralnikelias390@gmail.com)
- **NPM Profile:** [@guralnik-mailer](https://www.npmjs.com/package/guralnik-mailer)

### Support the Project

Guralnik Mailer is an open-source project built to save developers from the absolute headache of debugging legacy HTML tables across dozens of email clients. 

If this package helped streamline your email architecture and saved you hours of work, consider supporting the late-night coding sessions! You can back the project by dropping a star on GitHub, sharing your thoughts in the issues, or buying me a coffee. 

[![Buy Me A Coffee](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/eliasguralnik)

---

## License
MIT License. Feel free to use it in your personal and commercial projects.
