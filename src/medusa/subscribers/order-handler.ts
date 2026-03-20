// src/medusa/subscribers/order-handler.ts
import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";
import { SmartMedusaAdapter } from "../../medusa";

export default async function emailNotificationHandler({ eventName, data }: SubscriberArgs<any>) {
  await SmartMedusaAdapter.handleEvent(eventName, data);
}

export const config: SubscriberConfig = {
  event: [
    // Customer lifecycle
    "customer.created",
    "customer.password_reset",
    "customer.email_verification",
    "customer.deleted",
    // Order lifecycle
    "order.placed", 
    "order.shipment_created",
    "order.fulfillment_delivered",
    "order.delivered",
    "order.canceled",
    "order.payment_failed",
    // Order post-purchase
    "order.refund_created",
    "order.return_requested",
    "order.exchange_created",
    "order.transfer_requested",
    // Admin
    "user.invite_created",
    "invite.created",
    // Marketing
    "gift_card.created",
    "product.back_in_stock",
    "newsletter.subscribed",
    // Fallback event names
    "refund.created",
    "return.requested",
    "exchange.created",
    "payment.payment_failed",
  ]
};