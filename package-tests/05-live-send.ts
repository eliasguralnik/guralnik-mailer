// package-tests/05-live-send.ts
// ═══════════════════════════════════════════════════════════════
// TEST: Echten Email-Versand über die konfigurierte mailer.config.json.
//       Sendet EINE Test-Email pro Template an die angegebene Adresse.
//       ACHTUNG: Verbraucht API-Quota!
//
// Usage: npx tsx package-tests/05-live-send.ts <email> [template]
//   email: Ziel-Email-Adresse
//   template: Optional – einzelnes Template testen (z.B. "Welcome")
// ═══════════════════════════════════════════════════════════════

import { mailer } from '../src/engine/index';
import { TemplateName } from '../src/engine/registry';
import { recordResult, printSummary, mockData } from './_helpers';

const email = process.argv[2];
const singleTemplate = process.argv[3] as TemplateName | undefined;

if (!email) {
  console.error('❌ Usage: npx tsx package-tests/05-live-send.ts <email> [template]');
  console.error('   Example: npx tsx package-tests/05-live-send.ts me@gmail.com Welcome');
  process.exit(1);
}

const allTemplateData: Record<string, any> = {
  Welcome: { name: 'Elias', locale: 'de' },
  PasswordReset: { name: 'Elias', locale: 'de', resetLink: 'https://example.com/reset?token=abc123' },
  CustomerVerify: { name: 'Elias', locale: 'de', verifyLink: 'https://example.com/verify?token=abc123' },
  InviteCreated: { name: 'Elias', locale: 'de', inviteLink: 'https://example.com/invite?token=abc123' },
  OrderConfirmation: { name: 'Elias', locale: 'de', ...mockData.order },
  ShipmentCreated: { name: 'Elias', locale: 'de', orderId: 'ORD-1042', ...mockData.tracking },
  OrderDelivered: { name: 'Elias', locale: 'de', orderId: 'ORD-1042' },
  OrderCanceled: { name: 'Elias', locale: 'de', orderId: 'ORD-1042' },
  OrderRefund: { name: 'Elias', locale: 'de', orderId: 'ORD-1042', refundAmount: '267.00 ₪', refundMethod: 'Kreditkarte' },
  OrderReturn: { name: 'Elias', locale: 'de', orderId: 'ORD-1042', returnId: 'RET-001' },
  OrderExchange: { name: 'Elias', locale: 'de', orderId: 'ORD-1042', exchangeId: 'EXC-001' },
  OrderTransfer: { name: 'Elias', locale: 'de', orderId: 'ORD-1042' },
  OrderPaymentFailed: { name: 'Elias', locale: 'de', orderId: 'ORD-1042', amount: '267.00 ₪' },
  ReviewRequest: { name: 'Elias', locale: 'de', items: mockData.order.items },
  AbandonedCart: { name: 'Elias', locale: 'de', items: mockData.order.items },
  GiftCardCreated: { name: 'Elias', locale: 'de', ...mockData.giftCard },
  BackInStock: { name: 'Elias', locale: 'de', ...mockData.product },
  NewsletterWelcome: { name: 'Elias', locale: 'de' },
  AccountDeleted: { name: 'Elias', locale: 'de' },
};

async function main() {
  console.log(`\n🚀 TEST 05: Live Send to ${email}`);
  console.log('─'.repeat(60));

  const templatesToTest = singleTemplate ? [singleTemplate] : Object.keys(allTemplateData) as TemplateName[];

  for (const name of templatesToTest) {
    const data = allTemplateData[name];
    if (!data) { recordResult({ name: `Send ${name}`, status: 'SKIP', duration: 0, error: 'No test data' }); continue; }

    const start = Date.now();
    try {
      await mailer.send(name, email, data);
      recordResult({ name: `Send ${name}`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Send ${name}`, status: 'FAIL', duration: Date.now() - start, error: err.message?.slice(0, 80) });
    }

    // Small delay between sends to avoid rate limits
    await new Promise(r => setTimeout(r, 500));
  }

  printSummary();
}

main();
