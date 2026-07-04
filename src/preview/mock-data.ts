// src/preview/mock-data.ts
// Realistische Mock-Daten für den Preview-Server. Jedes Template bekommt
// genau die rawData, die ein Entwickler auch an mailer.send() übergeben würde.
import { TemplateName } from '../engine/registry';

export interface TemplateCategory {
  label: string;
  templates: TemplateName[];
}

// Gruppierung identisch zur README ("Available Templates")
export const templateCategories: TemplateCategory[] = [
  {
    label: 'Customer & Account Lifecycle',
    templates: ['Welcome', 'PasswordReset', 'CustomerVerify', 'InviteCreated', 'AccountDeleted'],
  },
  {
    label: 'Order Processing',
    templates: ['OrderConfirmation', 'ShipmentCreated', 'OrderDelivered', 'OrderCanceled'],
  },
  {
    label: 'Post-Purchase & Operational',
    templates: ['OrderRefund', 'OrderReturn', 'OrderExchange', 'OrderTransfer', 'OrderPaymentFailed'],
  },
  {
    label: 'Marketing & Engagement',
    templates: ['ReviewRequest', 'AbandonedCart', 'GiftCardCreated', 'BackInStock', 'NewsletterWelcome'],
  },
];

export const previewLanguages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pt', label: 'Português' },
  { code: 'pl', label: 'Polski' },
  { code: 'sv', label: 'Svenska' },
  { code: 'he', label: 'עברית' },
];

export const previewThemes = [
  'modern', 'minimal', 'elegant', 'midnight', 'monochrome',
  'nature', 'playful', 'futuristic', 'bold', 'classic',
];

// Produktbilder-Platzhalter (stabile Seeds, keine API-Keys nötig)
const img = (seed: string) => `https://picsum.photos/seed/${seed}/150/150`;

const mockItems = [
  { image: img('ceramic-mug'), title: 'Handmade Ceramic Mug', subtitle: 'Color: Sand Beige', quantity: 2, price: '€24.00' },
  { image: img('linen-towel'), title: 'Linen Kitchen Towel', subtitle: 'Set of 3', quantity: 1, price: '€18.50' },
  { image: img('oak-board'), title: 'Oak Serving Board', subtitle: 'Size: Large', quantity: 1, price: '€42.00' },
];

const mockTotals = {
  subtotal: '€108.50',
  shipping: '€4.90',
  tax: '€21.55',
  total: '€134.95',
};

const mockAddress = {
  name: 'Anna Schneider',
  address1: 'Torstraße 145',
  address2: 'Apt 4B',
  city: 'Berlin',
  postalCode: '10119',
  country: 'DE',
  phone: '+49 30 12345678',
};

const mockProduct = {
  image: img('ceramic-vase'),
  title: 'Ceramic Vase "Nordic"',
  subtitle: 'Handmade, 24cm',
  price: '€36.00',
  originalPrice: '€48.00',
};

const ORDER_ID = 'ORD-2861';

export const mockDataRegistry: Record<TemplateName, Record<string, any>> = {
  // ─── Customer & Account Lifecycle ───
  Welcome: {
    name: 'Anna',
  },
  PasswordReset: {
    name: 'Anna',
    resetLink: 'https://example.com/reset-password?token=preview-token',
  },
  CustomerVerify: {
    name: 'Anna',
    verifyLink: 'https://example.com/verify-email?token=preview-token',
  },
  InviteCreated: {
    name: 'Yossi',
    inviteLink: 'https://admin.example.com/invite?token=preview-token',
  },
  AccountDeleted: {
    name: 'Anna',
  },

  // ─── Order Processing ───
  OrderConfirmation: {
    name: 'Anna',
    orderId: ORDER_ID,
    orderDate: new Date().toLocaleDateString(),
    items: mockItems,
    totals: mockTotals,
    shippingAddress: mockAddress,
  },
  ShipmentCreated: {
    name: 'Anna',
    orderId: ORDER_ID,
    trackingNumber: 'DHL-9405511899223197428490',
    trackingLink: 'https://tracking.example.com/DHL-9405511899223197428490',
  },
  OrderDelivered: {
    name: 'Anna',
    orderId: ORDER_ID,
    buttonLink: `https://example.com/account/orders/${ORDER_ID}`,
    reviewButtonLink: `https://example.com/account/orders/${ORDER_ID}#review`,
  },
  OrderCanceled: {
    name: 'Anna',
    orderId: ORDER_ID,
  },

  // ─── Post-Purchase & Operational ───
  OrderRefund: {
    name: 'Anna',
    orderId: ORDER_ID,
    refundAmount: '€134.95',
    refundMethod: 'Visa •••• 4242',
  },
  OrderReturn: {
    name: 'Anna',
    orderId: ORDER_ID,
    returnId: 'RET-0482',
  },
  OrderExchange: {
    name: 'Anna',
    orderId: ORDER_ID,
    exchangeId: 'EXC-0113',
  },
  OrderTransfer: {
    name: 'Anna',
    orderId: ORDER_ID,
  },
  OrderPaymentFailed: {
    name: 'Anna',
    orderId: ORDER_ID,
    amount: '€134.95',
  },

  // ─── Marketing & Engagement ───
  ReviewRequest: {
    name: 'Anna',
    orderId: ORDER_ID,
    items: mockItems.slice(0, 2),
  },
  AbandonedCart: {
    name: 'Anna',
    items: mockItems.slice(0, 2),
  },
  GiftCardCreated: {
    name: 'Anna',
    giftCardCode: 'GIFT-4X9M-K2LP',
    giftCardValue: '€50.00',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  },
  BackInStock: {
    name: 'Anna',
    product: mockProduct,
  },
  NewsletterWelcome: {
    name: 'Anna',
  },
};

export function getMockData(templateName: TemplateName): Record<string, any> {
  return mockDataRegistry[templateName] || { name: 'Anna' };
}
