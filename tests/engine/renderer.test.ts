// tests/engine/renderer.test.ts
// Stichprobenartige Render-Tests über Templates × Themes × Sprachen.
import { describe, it, expect } from 'vitest';
import { EmailBuilder } from '../../src/engine/builder';
import { buildConfig } from '../helpers';
import { DesignType } from '../../src/types';

const orderData = {
  name: 'Anna',
  locale: 'en',
  orderId: 'ORD-77',
  items: [{ title: 'Ceramic Mug', quantity: 2, price: '€24.00' }],
  totals: { subtotal: '€48.00', shipping: '€4.90', total: '€52.90' },
};

describe('Template rendering', () => {
  it.each<DesignType>(['modern', 'midnight', 'minimal', 'playful', 'classic'])(
    'renders OrderConfirmation with the %s theme',
    async (designType) => {
      const config = buildConfig('resend');
      config.theme.designType = designType;
      const builder = new EmailBuilder(config);

      const result = await builder.build('OrderConfirmation', orderData);

      expect(result.html).toContain('Ceramic Mug');
      expect(result.html).toContain('ORD-77');
      expect(result.subject).toBe('Your order #ORD-77');
    }
  );

  it.each([
    ['de', 'Willkommen bei Test Store'],
    ['fr', 'Bienvenue chez Test Store'],
    ['he', 'ברוכים הבאים ל-Test Store'],
    ['sv', 'Välkommen till Test Store'],
  ])('translates the Welcome subject for locale %s', async (locale, expectedSubject) => {
    const builder = new EmailBuilder(buildConfig('resend'));
    const result = await builder.build('Welcome', { name: 'Anna', locale });

    expect(result.subject).toBe(expectedSubject);
    expect(result.lang).toBe(locale);
  });

  it('falls back to English for unsupported locales', async () => {
    const builder = new EmailBuilder(buildConfig('resend'));
    const result = await builder.build('Welcome', { name: 'Anna', locale: 'ja' });

    expect(result.subject).toBe('Welcome to Test Store');
  });

  it('normalizes regional locales like de-AT to their base language', async () => {
    const builder = new EmailBuilder(buildConfig('resend'));
    const result = await builder.build('Welcome', { name: 'Anna', locale: 'de-AT' });

    expect(result.lang).toBe('de');
    expect(result.subject).toBe('Willkommen bei Test Store');
  });

  it('replaces {{placeholders}} with runtime variables', async () => {
    const builder = new EmailBuilder(buildConfig('resend'));
    const result = await builder.build('Welcome', { name: 'Sarah', locale: 'en' });

    expect(result.html).toContain('Hi Sarah!');
    expect(result.html).not.toContain('{{name}}');
  });

  it('renders gift card data passed through raw data', async () => {
    const builder = new EmailBuilder(buildConfig('resend'));
    const result = await builder.build('GiftCardCreated', {
      name: 'Anna',
      locale: 'en',
      giftCardCode: 'GIFT-XYZ-123',
      giftCardValue: '€50.00',
    });

    expect(result.html).toContain('GIFT-XYZ-123');
    expect(result.html).toContain('€50.00');
  });

  it('rejects configs without a provider', async () => {
    const builder = new EmailBuilder({ theme: { colors: {} } } as any);
    await expect(builder.build('Welcome', { name: 'X' })).rejects.toThrow(/provider/);
  });

  it('accepts `from` as alias for senderEmail after normalization', async () => {
    const { normalizeConfig } = await import('../../src/engine');
    const config = normalizeConfig({ ...buildConfig('resend'), senderEmail: undefined, from: 'Shop <s@x.com>' });

    expect(config.senderEmail).toBe('Shop <s@x.com>');
  });
});
