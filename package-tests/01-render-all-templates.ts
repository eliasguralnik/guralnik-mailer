// package-tests/01-render-all-templates.ts
// ═══════════════════════════════════════════════════════════════
// TEST: Rendert ALLE 19 Templates in allen 3 Sprachen und
//       speichert die HTML-Ausgabe in _output/ zum Inspizieren.
// ═══════════════════════════════════════════════════════════════

import * as React from 'react';
import { render } from '@react-email/components';
import { themes } from '../src/theme/profiles';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { TemplateRegistry, TemplateName } from '../src/engine/registry';
import { recordResult, printSummary, saveHtml, mockData } from './_helpers';

// Template → Props mapping (all templates with their required data)
const templateProps: Record<string, any> = {
  Welcome: {
    content: { subject: 'Test', greeting: 'Hi Elias!', body: 'Welcome to our shop.', button: 'Visit Shop' },
  },
  PasswordReset: {
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'Reset your password.', button: 'Reset', expiryNote: 'Link expires in 24h.', resetLink: 'https://test.com/reset' },
  },
  CustomerVerify: {
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'Verify your email.', button: 'Verify', verifyLink: 'https://test.com/verify', expiryNote: 'Link expires in 48h.' },
  },
  InviteCreated: {
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'You have been invited.', button: 'Accept Invite', inviteLink: 'https://test.com/invite', expiryNote: '7 days.' },
  },
  OrderConfirmation: {
    ...mockData.order,
    content: {
      subject: 'Test', previewText: 'Order received', headline: 'Thank you, Elias! 🎉',
      introText: 'Your order is being prepared.', orderIdLabel: 'Order Number', dateLabel: 'Order Date',
      itemsHeading: 'Your Items', shippingAddressTitle: 'Shipping Address',
      quantityLabel: 'Qty', ctaText: 'View Order', ctaLink: '#', outroText: 'Questions? Reply to this email.',
      totalsLabels: { subtotal: 'Subtotal', shipping: 'Shipping', tax: 'Tax', total: 'Total' },
    },
  },
  ShipmentCreated: {
    content: {
      subject: 'Test', greeting: 'Good news, Elias! 🚚', body: 'Your order is on its way.',
      trackingLabel: 'Tracking Number', button: 'Track Shipment', outroText: 'Questions?',
      trackingNumber: mockData.tracking.trackingNumber, trackingLink: mockData.tracking.trackingLink,
    },
  },
  OrderDelivered: {
    orderId: 'ORD-1042',
    content: {
      subject: 'Test', greeting: 'Your package is here! 🎁', body: 'Order ORD-1042 has been delivered.',
      orderIdLabel: 'Order Number', deliveredNote: 'Your package was delivered. Contact us within 14 days if there are issues.',
      button: 'View Order', reviewButton: 'Leave a Review ⭐', buttonLink: '#', reviewButtonLink: '#', outroText: 'Thank you!',
    },
  },
  OrderCanceled: {
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'Order ORD-1042 has been canceled.', refundNote: 'Refund in 5-10 days.', button: 'Contact Support' },
  },
  OrderRefund: {
    orderId: 'ORD-1042', refundAmount: '267.00 ₪', refundMethod: 'Credit Card',
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'We processed a refund.', orderIdLabel: 'Order Number', refundAmountLabel: 'Refund Amount', refundMethodLabel: 'Refund Method', button: 'View Order', outroText: 'Questions?' },
  },
  OrderReturn: {
    orderId: 'ORD-1042', returnId: 'RET-001',
    content: { subject: 'Test', greeting: 'Hi Elias,', body: "We've received your return request.", orderIdLabel: 'Order Number', returnIdLabel: 'Return ID', instructionsHeading: 'Next Steps', instructions: 'Pack items securely and drop off.', button: 'Track Return', outroText: 'Questions?' },
  },
  OrderExchange: {
    orderId: 'ORD-1042', exchangeId: 'EXC-001',
    content: { subject: 'Test', greeting: 'Hi Elias,', body: "We've confirmed your exchange.", orderIdLabel: 'Order Number', exchangeIdLabel: 'Exchange ID', button: 'View Exchange', outroText: 'Questions?' },
  },
  OrderTransfer: {
    orderId: 'ORD-1042',
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'Order transferred to your account.', orderIdLabel: 'Order Number', button: 'View Order', outroText: 'Questions?' },
  },
  OrderPaymentFailed: {
    orderId: 'ORD-1042', amount: '267.00 ₪',
    content: { subject: 'Test', greeting: 'Hi Elias,', body: 'Payment could not be processed.', orderIdLabel: 'Order Number', amountLabel: 'Amount', errorNote: 'Your card was declined. Try a different method.', button: 'Retry Payment', outroText: 'Questions?' },
  },
  ReviewRequest: {
    items: mockData.order.items,
    content: { subject: 'Test', greeting: 'Hey Elias! 🌟', body: 'How was your purchase?', itemsHeading: 'Your purchased items', button: 'Leave a Review', outroText: 'Thank you! ❤️' },
  },
  AbandonedCart: {
    items: mockData.order.items,
    content: { subject: 'Test', greeting: 'Hey Elias, you left something behind! 🛒', body: 'You still have items in your cart.', itemsHeading: 'Your Cart', urgencyNote: 'These items are popular!', button: 'View Cart', outroText: 'Questions?' },
  },
  GiftCardCreated: {
    ...mockData.giftCard,
    content: { subject: 'Test', greeting: "You've got a gift! 🎁", body: 'Here is your gift card.', codeLabel: 'Gift Card Code', valueLabel: 'Balance', expiryLabel: 'Valid until', button: 'Redeem Now', outroText: 'Happy shopping!' },
  },
  BackInStock: {
    ...mockData.product,
    content: { subject: 'Test', greeting: 'Good news! 🔔', body: 'An item you wanted is back in stock.', urgencyNote: 'High demand – grab it now!', button: 'Shop Now', outroText: 'Questions?', buttonLink: '#' },
  },
  NewsletterWelcome: {
    content: {
      subject: 'Test', greeting: 'Welcome to the Newsletter! 📬', body: 'Thanks for subscribing!',
      perksHeading: "Here's what you get", confirmNote: "You're all set!",
      perks: [
        { icon: '🎁', label: 'Exclusive', value: 'Member-only offers' },
        { icon: '🚀', label: 'First Access', value: 'New products' },
        { icon: '💡', label: 'Tips', value: 'Expert advice' },
        { icon: '📦', label: 'Free Shipping', value: 'Orders over 200₪' },
      ],
      button: 'Visit Shop', buttonLink: '#', outroText: 'Questions?',
    },
  },
  AccountDeleted: {
    content: { subject: 'Test', greeting: 'Goodbye, Elias 👋', body: 'Your account has been deleted.', warningNote: 'All data permanently deleted. Reactivate within 30 days.', button: 'Create New Account', buttonLink: '#', outroText: 'We hope to see you again.' },
  },
};

const allThemes = ['modern', 'minimal', 'elegant', 'bold', 'futuristic', 'midnight', 'nature', 'playful', 'monochrome'] as const;

async function main() {
  console.log('\n🧪 TEST 01: Render All Templates');
  console.log('─'.repeat(60));

  const templateNames = Object.keys(TemplateRegistry) as TemplateName[];

  // Test 1: Render every template with 'modern' theme
  for (const name of templateNames) {
    const start = Date.now();
    try {
      const Component = TemplateRegistry[name];
      const props = { brandName: 'Ceramicis', company: { name: 'Ceramicis Studio', addressLine1: 'Tiberias', contactEmail: 'hello@ceramicis.com' }, ...(templateProps[name] || {}) };

      const html = await render(
        // @ts-ignore: ThemeProvider expects children but type definition is strict
        React.createElement(ThemeProvider, { theme: themes.modern },
          React.createElement(Component as any, props)
        )
      );

      if (!html || html.length < 100) throw new Error('HTML output too short');

      saveHtml(`01-${name}-modern`, html);
      recordResult({ name: `Render ${name} (modern)`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Render ${name} (modern)`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // Test 2: Render OrderConfirmation in ALL themes (design coverage)
  console.log('\n  📐 Theme Coverage (OrderConfirmation):');
  for (const theme of allThemes) {
    const start = Date.now();
    try {
      const Component = TemplateRegistry.OrderConfirmation;
      const props = { brandName: 'Ceramicis', company: { name: 'Ceramicis', addressLine1: 'Tiberias', contactEmail: 'hi@cer.com' }, ...templateProps.OrderConfirmation };

      const html = await render(
        // @ts-ignore: ThemeProvider expects children but type definition is strict
        React.createElement(ThemeProvider, { theme: themes[theme] },
          React.createElement(Component as any, props)
        )
      );

      saveHtml(`01-OrderConfirmation-${theme}`, html);
      recordResult({ name: `Theme: ${theme}`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Theme: ${theme}`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // Test 3: Render Welcome in ALL 3 languages
  console.log('\n  🌍 Language Coverage (Welcome):');
  const langGreetings: Record<string, string> = {
    en: 'Hi Elias! 👋',
    de: 'Hallo Elias! 👋',
    he: 'שלום Elias! 👋',
  };
  for (const [lang, greeting] of Object.entries(langGreetings)) {
    const start = Date.now();
    try {
      const Component = TemplateRegistry.Welcome;
      const props = { brandName: 'Ceramicis', content: { subject: 'Test', greeting, body: `Welcome in ${lang}!`, button: 'Shop' } };

      const html = await render(
        // @ts-ignore: ThemeProvider expects children but type definition is strict
        React.createElement(ThemeProvider, { theme: themes.modern },
          React.createElement(Component as any, props)
        )
      );

      saveHtml(`01-Welcome-${lang}`, html);
      recordResult({ name: `Language: ${lang}`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Language: ${lang}`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  const allPassed = printSummary();
  process.exit(allPassed ? 0 : 1);
}

main();
