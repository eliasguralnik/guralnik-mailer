// src/medusa.ts
import { mailer } from './engine';
import { logger as rootLogger } from "./logger";

const logger = rootLogger.child({ module: 'MedusaAdapter' });

function extractAddress(rawAddress: any) {
  if (!rawAddress) return undefined;
  return {
    name: [rawAddress.first_name, rawAddress.last_name].filter(Boolean).join(' '),
    company: rawAddress.company || undefined,
    address1: rawAddress.address_1 || rawAddress.address1 || '',
    address2: rawAddress.address_2 || rawAddress.address2 || undefined,
    city: rawAddress.city || '',
    province: rawAddress.province || rawAddress.state || undefined,
    postalCode: rawAddress.postal_code || rawAddress.zip || undefined,
    country: rawAddress.country_code?.toUpperCase() || rawAddress.country || undefined,
    phone: rawAddress.phone || undefined,
  };
}

function extractItems(rawItems: any[], currencySymbol: string) {
  if (!rawItems || !Array.isArray(rawItems)) return [];
  return rawItems.map((item: any) => ({
    title: item.title || item.product_title || 'Item',
    subtitle: item.variant?.title || item.variant_title || undefined,
    quantity: item.quantity || 1,
    price: item.unit_price ? `${(item.unit_price / 100).toFixed(2)} ${currencySymbol}` : '',
    image: item.thumbnail || item.variant?.product?.thumbnail || undefined,
  }));
}

function formatAmount(amount: any, currencySymbol: string): string {
  if (amount === undefined || amount === null) return '';
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(numericAmount)) return '';
  return `${(numericAmount / 100).toFixed(2)} ${currencySymbol}`;
}

function getCurrencySymbol(currencyCode?: string): string {
  switch (currencyCode?.toLowerCase()) {
    case 'usd': return '$';
    case 'eur': return '€';
    case 'gbp': return '£';
    case 'ils': return '₪';
    default: return '€';
  }
}

function getName(eventData: any): string {
  return eventData.first_name 
    || eventData.shipping_address?.first_name 
    || eventData.customer?.first_name 
    || eventData.name 
    || 'Customer';
}

function getEmail(eventData: any): string {
  return eventData.email 
    || eventData.customer?.email 
    || eventData.order?.email 
    || '';
}

function getOrderId(eventData: any): string {
  return eventData.display_id || eventData.id || eventData.order_id || eventData.order?.display_id || '';
}

export const SmartMedusaAdapter = {
  async handleEvent(eventName: string, eventData: any) {
    logger.debug({ eventName }, "Processing Medusa event...");

    try {
      const locale = eventData.locale || eventData.metadata?.locale || eventData.customer?.metadata?.locale || null;
      const currency = getCurrencySymbol(eventData.currency_code);
      const storeUrl = eventData.store_url || process.env.STORE_URL || 'http://localhost:8000';
      const adminUrl = eventData.admin_url || process.env.ADMIN_URL || 'http://localhost:9000';

      switch (eventName) {
        // ═══════════ CUSTOMER ═══════════

        case 'customer.created':
          await mailer.send("Welcome", getEmail(eventData), { name: getName(eventData), locale, buttonLink: storeUrl });
          break;

        case 'customer.password_reset':
          await mailer.send("PasswordReset", getEmail(eventData), { name: getName(eventData), resetLink: `${storeUrl}/reset-password?token=${eventData.token}`, locale });
          break;

        case 'customer.email_verification':
          await mailer.send("CustomerVerify", getEmail(eventData), { name: getName(eventData), verifyLink: `${storeUrl}/verify-email?token=${eventData.token}`, locale });
          break;

        case 'customer.deleted':
          await mailer.send("AccountDeleted", getEmail(eventData), { name: getName(eventData), locale, buttonLink: storeUrl });
          break;

        // ═══════════ ADMIN / INVITE ═══════════

        case 'user.invite_created':
        case 'invite.created':
          await mailer.send("InviteCreated", eventData.user_email || getEmail(eventData), { 
            name: eventData.first_name || eventData.user_email || 'Team Member',
            inviteLink: `${adminUrl}/invite?token=${eventData.token}`, 
            locale,
          });
          break;

        // ═══════════ ORDERS – LIFECYCLE ═══════════

        case 'order.placed':
          await mailer.send("OrderConfirmation", getEmail(eventData), {
            orderId: getOrderId(eventData),
            orderDate: eventData.created_at ? new Date(eventData.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            name: getName(eventData),
            items: extractItems(eventData.items, currency),
            totals: {
              subtotal: formatAmount(eventData.subtotal, currency),
              shipping: formatAmount(eventData.shipping_total, currency),
              tax: eventData.tax_total ? formatAmount(eventData.tax_total, currency) : undefined,
              total: formatAmount(eventData.total, currency),
            },
            shippingAddress: extractAddress(eventData.shipping_address),
            locale,
          });
          break;

        case 'order.shipment_created':
          await mailer.send("ShipmentCreated", getEmail(eventData), { 
            orderId: getOrderId(eventData),
            name: getName(eventData),
            trackingNumber: eventData.tracking_links?.[0]?.tracking_number || eventData.tracking_number,
            trackingLink: eventData.tracking_links?.[0]?.url || eventData.tracking_url,
            locale,
          });
          break;

        case 'order.fulfillment_delivered':
        case 'order.delivered':
          await mailer.send("OrderDelivered", getEmail(eventData), {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            buttonLink: `${storeUrl}/account/orders/${getOrderId(eventData)}`,
            reviewButtonLink: `${storeUrl}/account/orders/${getOrderId(eventData)}#review`,
            locale,
          });
          break;

        case 'order.canceled':
          await mailer.send("OrderCanceled", getEmail(eventData), { orderId: getOrderId(eventData), name: getName(eventData), locale });
          break;

        case 'order.payment_failed':
        case 'payment.payment_failed':
          await mailer.send("OrderPaymentFailed", getEmail(eventData), {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            amount: formatAmount(eventData.total || eventData.amount, currency),
            buttonLink: `${storeUrl}/account/orders/${getOrderId(eventData)}`,
            locale,
          });
          break;

        // ═══════════ ORDERS – POST-PURCHASE ═══════════

        case 'order.refund_created':
        case 'refund.created':
          await mailer.send("OrderRefund", getEmail(eventData) || eventData.order?.email, {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            refundAmount: formatAmount(eventData.amount, currency),
            refundMethod: eventData.reason || '',
            locale,
          });
          break;

        case 'order.return_requested':
        case 'return.requested':
          await mailer.send("OrderReturn", getEmail(eventData) || eventData.order?.email, {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            returnId: eventData.return_id || eventData.id,
            locale,
          });
          break;

        case 'order.exchange_created':
        case 'exchange.created':
          await mailer.send("OrderExchange", getEmail(eventData) || eventData.order?.email, {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            exchangeId: eventData.exchange_id || eventData.id,
            locale,
          });
          break;

        case 'order.transfer_requested':
        case 'order.transfer_created':
          await mailer.send("OrderTransfer", getEmail(eventData) || eventData.order?.email, {
            orderId: getOrderId(eventData),
            name: getName(eventData),
            locale,
          });
          break;

        // ═══════════ MARKETING ═══════════

        case 'gift_card.created':
          await mailer.send("GiftCardCreated", getEmail(eventData), {
            name: getName(eventData),
            giftCardCode: eventData.code || eventData.gift_card?.code || '',
            giftCardValue: formatAmount(eventData.balance || eventData.value, currency),
            expiryDate: eventData.ends_at ? new Date(eventData.ends_at).toLocaleDateString() : undefined,
            buttonLink: storeUrl,
            locale,
          });
          break;

        case 'product.back_in_stock':
          await mailer.send("BackInStock", getEmail(eventData), {
            name: getName(eventData),
            product: eventData.product ? {
              title: eventData.product.title,
              subtitle: eventData.variant?.title,
              price: formatAmount(eventData.variant?.prices?.[0]?.amount, currency),
              image: eventData.product.thumbnail,
            } : undefined,
            buttonLink: eventData.product ? `${storeUrl}/products/${eventData.product.handle}` : storeUrl,
            locale,
          });
          break;

        case 'newsletter.subscribed':
          await mailer.send("NewsletterWelcome", getEmail(eventData), { name: getName(eventData), buttonLink: storeUrl, locale });
          break;

        default:
          logger.debug({ eventName }, "Ignoring unmapped Medusa event.");
      }
    } catch (error) { 
      logger.error({ error, eventName }, "Failed to process Medusa event!"); 
      throw error;
    }
  }
};