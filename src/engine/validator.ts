// src/engine/validator.ts
import { SmartMailerConfig } from '../types';
import { TemplateName } from './registry';
import { logger as rootLogger } from "../logger";

const logger = rootLogger.child({ module: 'Validator' });

export interface ValidatedData {
  lang: string;
  templateName: TemplateName;
  variables: Record<string, any>;
}

export function validateAndPrepareData(
  templateName: TemplateName, 
  rawData: any, 
  config: SmartMailerConfig
): ValidatedData {
  
  if (!config.provider) throw new Error("Config-Error: 'provider' missing!");
  if (!config.senderEmail) throw new Error("Config-Error: 'senderEmail' missing!");
  if (!config.theme || !config.theme.colors) throw new Error("Config-Error: 'Theme-Config' missing!");

  const rawLocale = rawData?.locale || config.defaultLanguage || 'en';
  const lang = rawLocale.split('-')[0].toLowerCase();

  logger.debug({ template: templateName, lang }, "Validating data...");

  // Build variables
  const variables: Record<string, any> = {
    name: rawData?.name || "Customer", 
    brandName: config.theme.brandName || "Our Shop",
    storeUrl: config.storeUrl || process.env.STORE_URL || 'http://localhost:8000',
    contactEmail: config.theme.company?.contactEmail || config.senderEmail,
  };

  // Merge all rawData into variables (preserve objects, arrays, etc.)
  for (const [key, value] of Object.entries(rawData || {})) {
    if (key !== 'locale' && key !== 'name' && value !== undefined && value !== null) {
      variables[key] = value;
    }
  }

  // ──── Validation warnings ────
  const orderTemplates: TemplateName[] = ['OrderConfirmation', 'ShipmentCreated', 'OrderDelivered', 'OrderCanceled', 'OrderRefund', 'OrderReturn', 'OrderExchange', 'OrderTransfer', 'OrderPaymentFailed'];
  if (orderTemplates.includes(templateName) && !variables.orderId) {
    logger.warn({ template: templateName }, "Missing 'orderId'.");
  }

  const linkRequired: Partial<Record<TemplateName, string>> = {
    PasswordReset: 'resetLink',
    InviteCreated: 'inviteLink',
    CustomerVerify: 'verifyLink',
  };
  const requiredLink = linkRequired[templateName];
  if (requiredLink && !variables[requiredLink]) {
    logger.warn({ template: templateName }, `Missing '${requiredLink}'.`);
  }

  if (templateName === 'OrderRefund' && !variables.refundAmount) {
    logger.warn({ template: templateName }, "Missing 'refundAmount'.");
  }
  if (templateName === 'GiftCardCreated' && !variables.giftCardCode) {
    logger.warn({ template: templateName }, "Missing 'giftCardCode'.");
  }

  logger.info({ template: templateName, lang }, "Validation finished.");

  return { lang, templateName, variables };
}