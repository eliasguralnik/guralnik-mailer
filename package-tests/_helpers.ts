// package-tests/_helpers.ts
// Shared test infrastructure: config builders, mock data, HTML output, result tracking

import * as fs from 'fs';
import * as path from 'path';

// ─── Result Tracking ───
export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

export function recordResult(result: TestResult) {
  results.push(result);
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
  console.log(`  ${icon} ${result.name} (${result.duration}ms)${result.error ? ` – ${result.error}` : ''}`);
}

export function printSummary() {
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const skip = results.filter(r => r.status === 'SKIP').length;
  const total = results.length;
  const totalTime = results.reduce((a, r) => a + r.duration, 0);

  console.log('\n' + '═'.repeat(60));
  console.log(`  📊 TEST RESULTS: ${pass} passed, ${fail} failed, ${skip} skipped (${total} total)`);
  console.log(`  ⏱️  Total time: ${totalTime}ms`);
  console.log('═'.repeat(60));

  if (fail > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  • ${r.name}: ${r.error}`);
    });
  }

  console.log('');
  return fail === 0;
}

// ─── HTML Output ───
const outputDir = path.join(process.cwd(), 'package-tests', '_output');

export function saveHtml(filename: string, html: string) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${filename}.html`);
  fs.writeFileSync(filePath, html, 'utf-8');
  return filePath;
}

// ─── Config Builders ───
export function buildConfig(provider: 'resend' | 'sendgrid' | 'smtp', overrides?: any) {
  const base = {
    senderEmail: 'test@example.com',
    storeUrl: 'https://test-store.com',
    defaultLanguage: 'en',
    theme: {
      designType: 'modern' as const,
      brandName: 'Test Store',
      colors: { primary: '#4F46E5', background: '#F6F9FC', text: '#1a1a2e' },
      company: { name: 'Test Co.', addressLine1: '123 Test St.', contactEmail: 'support@test.com' },
      socials: { instagram: 'https://instagram.com/test' },
    },
    ...overrides,
  };

  switch (provider) {
    case 'resend':
      return { ...base, provider: 'resend' as const, apiKey: 're_test_key' };
    case 'sendgrid':
      return { ...base, provider: 'sendgrid' as const, apiKey: 'SG.test_key' };
    case 'smtp':
      return { ...base, provider: 'smtp' as const, host: 'smtp.test.com', port: 587, user: 'testuser' };
  }
}

// ─── Mock Data ───
export const mockData = {
  customer: {
    name: 'Elias Guralnik',
    email: 'test@example.com',
    locale: 'de',
  },

  order: {
    orderId: 'ORD-1042',
    orderDate: '20.03.2026',
    items: [
      { image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&q=80', title: 'Handgemachter Becher', subtitle: 'Farbe: Sandbeige', quantity: 2, price: '80.00 ₪' },
      { image: 'https://images.unsplash.com/photo-1590204128543-c6460e5ba6ea?w=150&q=80', title: 'Minimalistischer Teller', subtitle: 'Größe: 24cm', quantity: 1, price: '55.00 ₪' },
    ],
    totals: { subtotal: '215.00 ₪', shipping: '15.00 ₪', tax: '37.00 ₪', total: '267.00 ₪' },
    shippingAddress: {
      name: 'Elias Guralnik',
      address1: 'Rothschild Blvd 42',
      city: 'Tiberias',
      postalCode: '1410001',
      country: 'IL',
      phone: '+972-50-1234567',
    },
  },

  tracking: {
    trackingNumber: 'IL-TRK-987654321',
    trackingLink: 'https://tracking.example.com/IL-TRK-987654321',
  },

  giftCard: {
    giftCardCode: 'GIFT-2026-ABCD',
    giftCardValue: '200.00 ₪',
    expiryDate: '20.03.2027',
  },

  product: {
    product: {
      title: 'Keramik Vase',
      subtitle: 'Handgemacht',
      price: '120.00 ₪',
      originalPrice: '180.00 ₪',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b28?w=150&q=80',
    },
  },

  medusaOrder: {
    id: 'ord_01J3456',
    display_id: 'ORD-5500',
    email: 'customer@example.com',
    currency_code: 'ILS',
    total: 26700,
    subtotal: 21500,
    shipping_total: 1500,
    tax_total: 3700,
    created_at: '2026-03-20T10:30:00Z',
    shipping_address: {
      first_name: 'Elias',
      last_name: 'Guralnik',
      address_1: 'Rothschild Blvd 42',
      city: 'Tiberias',
      postal_code: '1410001',
      country_code: 'il',
      phone: '+972-50-1234567',
    },
    items: [
      { title: 'Handgemachter Becher', variant_title: 'Sandbeige', quantity: 2, unit_price: 8000, thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&q=80' },
      { title: 'Minimalistischer Teller', variant_title: '24cm', quantity: 1, unit_price: 5500, thumbnail: 'https://images.unsplash.com/photo-1590204128543-c6460e5ba6ea?w=150&q=80' },
    ],
    tracking_links: [{ tracking_number: 'IL-TRK-987654321', url: 'https://tracking.example.com/IL-TRK-987654321' }],
    customer: { first_name: 'Elias', email: 'customer@example.com', metadata: { locale: 'de' } },
  },
};
