// src/engine/registry.ts
import { WelcomeEmail } from '../templates/WelcomeEmail';
import { OrderConfirmationEmail } from '../templates/OrderConfirmationEmail';
import { PasswordResetEmail } from '../templates/PasswordResetEmail';
import { ShipmentCreatedEmail } from '../templates/ShipmentCreatedEmail';
import { OrderCanceledEmail } from '../templates/OrderCanceledEmail';
import { InviteCreatedEmail } from '../templates/InviteCreatedEmail';
import { OrderRefundEmail } from '../templates/OrderRefundEmail';
import { OrderReturnEmail } from '../templates/OrderReturnEmail';
import { OrderExchangeEmail } from '../templates/OrderExchangeEmail';
import { OrderTransferEmail } from '../templates/OrderTransferEmail';
import { CustomerVerifyEmail } from '../templates/CustomerVerifyEmail';
import { OrderDeliveredEmail } from '../templates/OrderDeliveredEmail';
import { ReviewRequestEmail } from '../templates/ReviewRequestEmail';
import { AbandonedCartEmail } from '../templates/AbandonedCartEmail';
import { GiftCardCreatedEmail } from '../templates/GiftCardCreatedEmail';
import { OrderPaymentFailedEmail } from '../templates/OrderPaymentFailedEmail';
import { BackInStockEmail } from '../templates/BackInStockEmail';
import { NewsletterWelcomeEmail } from '../templates/NewsletterWelcomeEmail';
import { AccountDeletedEmail } from '../templates/AccountDeletedEmail';

export const TemplateRegistry = {
  // Core
  Welcome: WelcomeEmail,
  PasswordReset: PasswordResetEmail,
  CustomerVerify: CustomerVerifyEmail,
  InviteCreated: InviteCreatedEmail,
  // Orders
  OrderConfirmation: OrderConfirmationEmail,
  ShipmentCreated: ShipmentCreatedEmail,
  OrderDelivered: OrderDeliveredEmail,
  OrderCanceled: OrderCanceledEmail,
  OrderRefund: OrderRefundEmail,
  OrderReturn: OrderReturnEmail,
  OrderExchange: OrderExchangeEmail,
  OrderTransfer: OrderTransferEmail,
  OrderPaymentFailed: OrderPaymentFailedEmail,
  // Marketing
  ReviewRequest: ReviewRequestEmail,
  AbandonedCart: AbandonedCartEmail,
  GiftCardCreated: GiftCardCreatedEmail,
  BackInStock: BackInStockEmail,
  NewsletterWelcome: NewsletterWelcomeEmail,
  AccountDeleted: AccountDeletedEmail,
};

export type TemplateName = keyof typeof TemplateRegistry;