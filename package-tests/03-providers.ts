// package-tests/03-providers.ts
// ═══════════════════════════════════════════════════════════════
// TEST: Testet Provider-Initialisierung und Config-Validierung
//       für Resend, SendGrid und SMTP.
//       SENDET KEINE ECHTEN EMAILS (nur Initialisierung + Build).
// ═══════════════════════════════════════════════════════════════

import { EmailBuilder } from '../src/engine/builder';
import { EmailDispatcher } from '../src/engine/dispatcher';
import { SmartMailerConfig } from '../src/types';
import { recordResult, printSummary, buildConfig } from './_helpers';

async function main() {
  console.log('\n🧪 TEST 03: Provider Initialization');
  console.log('─'.repeat(60));

  // ── Test 1: Resend Provider ──
  console.log('\n  📨 Resend:');
  {
    const start = Date.now();
    try {
      const config = buildConfig('resend') as SmartMailerConfig;
      const dispatcher = new EmailDispatcher(config);
      if (!dispatcher) throw new Error('Dispatcher not created');
      recordResult({ name: 'Resend init', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'Resend init', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }
  {
    const start = Date.now();
    try {
      const config = buildConfig('resend') as SmartMailerConfig;
      const builder = new EmailBuilder(config);
      const result = await builder.build('Welcome', { name: 'Test', locale: 'en' });
      if (!result.html) throw new Error('No HTML output');
      if (!result.subject) throw new Error('No subject');
      recordResult({ name: 'Resend build pipeline', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'Resend build pipeline', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 2: SendGrid Provider ──
  console.log('\n  📧 SendGrid:');
  {
    const start = Date.now();
    try {
      const config = buildConfig('sendgrid') as SmartMailerConfig;
      const dispatcher = new EmailDispatcher(config);
      if (!dispatcher) throw new Error('Dispatcher not created');
      recordResult({ name: 'SendGrid init', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'SendGrid init', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }
  {
    const start = Date.now();
    try {
      const config = buildConfig('sendgrid') as SmartMailerConfig;
      const builder = new EmailBuilder(config);
      const result = await builder.build('OrderConfirmation', {
        name: 'Test', locale: 'en', orderId: 'ORD-1',
        items: [{ title: 'Item', quantity: 1, price: '$10' }],
        totals: { subtotal: '$10', shipping: '$5', total: '$15' },
      });
      if (!result.html.includes('Item')) throw new Error('HTML missing item data');
      recordResult({ name: 'SendGrid build OrderConfirmation', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'SendGrid build OrderConfirmation', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 3: SMTP Provider ──
  console.log('\n  📬 SMTP:');
  {
    const start = Date.now();
    try {
      const config = buildConfig('smtp') as SmartMailerConfig;
      const dispatcher = new EmailDispatcher(config);
      if (!dispatcher) throw new Error('Dispatcher not created');
      recordResult({ name: 'SMTP init', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'SMTP init', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }
  {
    const start = Date.now();
    try {
      const config = buildConfig('smtp') as SmartMailerConfig;
      const builder = new EmailBuilder(config);
      const result = await builder.build('GiftCardCreated', {
        name: 'Test', locale: 'en', giftCardCode: 'GIFT-123', giftCardValue: '200 ₪',
      });
      if (!result.html.includes('GIFT-123')) throw new Error('HTML missing gift card code');
      recordResult({ name: 'SMTP build GiftCardCreated', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'SMTP build GiftCardCreated', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 4: Invalid Provider ──
  console.log('\n  🚫 Invalid Provider:');
  {
    const start = Date.now();
    try {
      const config = { ...buildConfig('resend'), provider: 'invalid' as any } as SmartMailerConfig;
      new EmailDispatcher(config);
      recordResult({ name: 'Invalid provider should throw', status: 'FAIL', duration: Date.now() - start, error: 'Did not throw' });
    } catch (err: any) {
      if (err.message.includes('Unknown provider')) {
        recordResult({ name: 'Invalid provider throws', status: 'PASS', duration: Date.now() - start });
      } else {
        recordResult({ name: 'Invalid provider throws', status: 'FAIL', duration: Date.now() - start, error: `Wrong error: ${err.message}` });
      }
    }
  }

  // ── Test 5: Missing Config Fields ──
  console.log('\n  ⚠️ Config Validation:');
  {
    const start = Date.now();
    try {
      const badConfig = { theme: { colors: {} } } as any;
      const builder = new EmailBuilder(badConfig);
      await builder.build('Welcome', { name: 'Test', locale: 'en' });
      recordResult({ name: 'Missing provider should throw', status: 'FAIL', duration: Date.now() - start, error: 'Did not throw' });
    } catch (err: any) {
      if (err.message.includes('provider')) {
        recordResult({ name: 'Missing provider throws', status: 'PASS', duration: Date.now() - start });
      } else {
        recordResult({ name: 'Missing provider throws', status: 'FAIL', duration: Date.now() - start, error: err.message });
      }
    }
  }
  {
    const start = Date.now();
    try {
      const badConfig = { provider: 'resend', senderEmail: 'x@x.com' } as any;
      const builder = new EmailBuilder(badConfig);
      await builder.build('Welcome', { name: 'Test', locale: 'en' });
      recordResult({ name: 'Missing theme should throw', status: 'FAIL', duration: Date.now() - start, error: 'Did not throw' });
    } catch (err: any) {
      if (err.message.includes('Theme')) {
        recordResult({ name: 'Missing theme throws', status: 'PASS', duration: Date.now() - start });
      } else {
        recordResult({ name: 'Missing theme throws', status: 'FAIL', duration: Date.now() - start, error: err.message });
      }
    }
  }

  const allPassed = printSummary();
  process.exit(allPassed ? 0 : 1);
}

main();
