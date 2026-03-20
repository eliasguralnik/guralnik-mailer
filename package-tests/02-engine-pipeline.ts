// package-tests/02-engine-pipeline.ts
// ═══════════════════════════════════════════════════════════════
// TEST: Testet die komplette Engine-Pipeline (Validator → Builder → Renderer)
//       OHNE echten Versand. Prüft Dictionary-Auflösung, Placeholder-Ersetzung,
//       Theme-Auflösung, und korrekten Subject-Output.
// ═══════════════════════════════════════════════════════════════

import * as fs from 'fs';
import * as path from 'path';
import { validateAndPrepareData } from '../src/engine/validator';
import { renderTemplate } from '../src/engine/renderer';
import { TemplateName } from '../src/engine/registry';
import { SmartMailerConfig } from '../src/types';
import { recordResult, printSummary, saveHtml, buildConfig } from './_helpers';

const config = buildConfig('resend') as SmartMailerConfig;

// All template names with minimum required fields
const templateTests: Array<{ name: TemplateName; data: any; expectSubjectContains?: string }> = [
  { name: 'Welcome', data: { name: 'Elias', locale: 'de' }, expectSubjectContains: 'Willkommen' },
  { name: 'Welcome', data: { name: 'Elias', locale: 'en' }, expectSubjectContains: 'Welcome' },
  { name: 'Welcome', data: { name: 'Elias', locale: 'he' }, expectSubjectContains: 'ברוכים' },
  { name: 'PasswordReset', data: { name: 'Elias', locale: 'de', resetLink: 'https://x.com/reset' }, expectSubjectContains: 'Passwort' },
  { name: 'CustomerVerify', data: { name: 'Elias', locale: 'en', verifyLink: 'https://x.com/verify' }, expectSubjectContains: 'Verify' },
  { name: 'InviteCreated', data: { name: 'Elias', locale: 'en', inviteLink: 'https://x.com/invite' }, expectSubjectContains: 'invited' },
  { name: 'OrderConfirmation', data: { name: 'Elias', locale: 'de', orderId: 'ORD-42', items: [{ title: 'Becher', quantity: 1, price: '80 ₪' }], totals: { subtotal: '80 ₪', shipping: '10 ₪', total: '90 ₪' } }, expectSubjectContains: 'Bestellung' },
  { name: 'ShipmentCreated', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42', trackingNumber: 'TRK-123', trackingLink: '#' }, expectSubjectContains: 'shipped' },
  { name: 'OrderDelivered', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42' }, expectSubjectContains: 'delivered' },
  { name: 'OrderCanceled', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42' }, expectSubjectContains: 'canceled' },
  { name: 'OrderRefund', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42', refundAmount: '90 ₪' }, expectSubjectContains: 'Refund' },
  { name: 'OrderReturn', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42', returnId: 'RET-1' }, expectSubjectContains: 'Return' },
  { name: 'OrderExchange', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42', exchangeId: 'EXC-1' }, expectSubjectContains: 'Exchange' },
  { name: 'OrderTransfer', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42' }, expectSubjectContains: 'transferred' },
  { name: 'OrderPaymentFailed', data: { name: 'Elias', locale: 'en', orderId: 'ORD-42', amount: '90 ₪' }, expectSubjectContains: 'Payment' },
  { name: 'ReviewRequest', data: { name: 'Elias', locale: 'en' }, expectSubjectContains: 'purchase' },
  { name: 'AbandonedCart', data: { name: 'Elias', locale: 'en', items: [{ title: 'Becher', quantity: 1, price: '80 ₪' }] }, expectSubjectContains: 'left' },
  { name: 'GiftCardCreated', data: { name: 'Elias', locale: 'en', giftCardCode: 'GIFT-123', giftCardValue: '200 ₪' }, expectSubjectContains: 'gift card' },
  { name: 'BackInStock', data: { name: 'Elias', locale: 'en' }, expectSubjectContains: 'stock' },
  { name: 'NewsletterWelcome', data: { name: 'Elias', locale: 'en' }, expectSubjectContains: 'Newsletter' },
  { name: 'AccountDeleted', data: { name: 'Elias', locale: 'en' }, expectSubjectContains: 'deleted' },
];

async function main() {
  console.log('\n🧪 TEST 02: Engine Pipeline (Validate → Build → Render)');
  console.log('─'.repeat(60));

  // ── Test 1: Validator ──
  console.log('\n  📋 Validator Tests:');
  for (const t of templateTests) {
    const start = Date.now();
    try {
      const result = validateAndPrepareData(t.name, t.data, config);
      if (!result.lang) throw new Error('No language resolved');
      if (!result.templateName) throw new Error('No template name');
      if (!result.variables.brandName) throw new Error('Missing brandName in variables');
      recordResult({ name: `Validate ${t.name} (${t.data.locale})`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Validate ${t.name} (${t.data.locale})`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 2: Full Render Pipeline ──
  console.log('\n  🔧 Full Render Pipeline:');
  for (const t of templateTests) {
    const start = Date.now();
    try {
      const validated = validateAndPrepareData(t.name, t.data, config);
      const { htmlOutput, subject } = await renderTemplate(validated.templateName, validated.lang, validated.variables, config);

      // Subject assertion
      if (t.expectSubjectContains && !subject.toLowerCase().includes(t.expectSubjectContains.toLowerCase())) {
        throw new Error(`Subject "${subject}" does not contain "${t.expectSubjectContains}"`);
      }

      // HTML assertions
      if (!htmlOutput || htmlOutput.length < 200) throw new Error(`HTML too short: ${htmlOutput.length} chars`);
      if (!htmlOutput.includes('<!DOCTYPE')) throw new Error('Missing DOCTYPE');
      if (!htmlOutput.includes(config.theme.brandName)) throw new Error(`HTML missing brandName "${config.theme.brandName}"`);

      saveHtml(`02-pipeline-${t.name}-${t.data.locale}`, htmlOutput);
      recordResult({ name: `Pipeline ${t.name} (${t.data.locale})`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Pipeline ${t.name} (${t.data.locale})`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 3: Placeholder Replacement ──
  console.log('\n  🔤 Placeholder Replacement:');
  {
    const start = Date.now();
    try {
      const validated = validateAndPrepareData('Welcome', { name: 'TestUser', locale: 'en' }, config);
      const { htmlOutput, subject } = await renderTemplate('Welcome', validated.lang, validated.variables, config);
      if (subject.includes('{{')) throw new Error(`Unresolved placeholder in subject: "${subject}"`);
      if (htmlOutput.includes('{{brandName}}')) throw new Error('Unresolved {{brandName}} in HTML');
      if (htmlOutput.includes('{{name}}')) throw new Error('Unresolved {{name}} in HTML');
      recordResult({ name: 'Placeholder replacement', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'Placeholder replacement', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 4: Language Fallback ──
  console.log('\n  🌐 Language Fallback:');
  {
    const start = Date.now();
    try {
      const validated = validateAndPrepareData('Welcome', { name: 'Test', locale: 'ru-RU' }, config);
      if (validated.lang !== 'ru') throw new Error(`Expected 'ru' but got '${validated.lang}'`);
      const { subject } = await renderTemplate('Welcome', validated.lang, validated.variables, config);
      // Should fall back to 'en' since 'ru' doesn't exist
      if (!subject.toLowerCase().includes('welcome')) throw new Error(`Expected English fallback, got: "${subject}"`);
      recordResult({ name: 'Fallback ru → en', status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: 'Fallback ru → en', status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  // ── Test 5: Theme Profiles ──
  console.log('\n  🎨 Theme Profile Resolution:');
  const designTypes = ['modern', 'minimal', 'elegant', 'bold', 'classic', 'futuristic', 'midnight', 'nature', 'playful', 'monochrome'];
  for (const dt of designTypes) {
    const start = Date.now();
    try {
      const themedConfig = { ...config, theme: { ...config.theme, designType: dt as any } };
      const validated = validateAndPrepareData('Welcome', { name: 'Test', locale: 'en' }, themedConfig);
      const { htmlOutput } = await renderTemplate('Welcome', validated.lang, validated.variables, themedConfig);
      if (!htmlOutput || htmlOutput.length < 200) throw new Error('HTML too short');
      saveHtml(`02-theme-Welcome-${dt}`, htmlOutput);
      recordResult({ name: `Theme: ${dt}`, status: 'PASS', duration: Date.now() - start });
    } catch (err: any) {
      recordResult({ name: `Theme: ${dt}`, status: 'FAIL', duration: Date.now() - start, error: err.message });
    }
  }

  const allPassed = printSummary();
  process.exit(allPassed ? 0 : 1);
}

main();
