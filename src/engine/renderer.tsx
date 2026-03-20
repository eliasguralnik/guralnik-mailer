// src/engine/renderer.tsx
import * as React from 'react';
import { render } from '@react-email/components';
import { dictionary } from '../dictionary';
import { TemplateRegistry, TemplateName } from './registry';
import { SmartMailerConfig } from '../types';
import { ThemeProvider } from '../theme/ThemeProvider';
import { themes } from '../theme/profiles';
import { logger as rootLogger } from "../logger";

const logger = rootLogger.child({ module: 'Renderer' });

function replacePlaceholders(text: string, variables: Record<string, any>) {
  let processed = text;
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'string' || typeof value === 'number') {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
  }
  return processed.replace(/{{[^}]+}}/g, ''); 
}

export async function renderTemplate(
  templateName: TemplateName, 
  lang: string, 
  variables: Record<string, any>, 
  config: SmartMailerConfig
) {
  logger.debug({ template: templateName, lang }, "Starting rendering process...");

  const Component = TemplateRegistry[templateName];
  if (!Component) {
    logger.fatal({ template: templateName }, "Template not found in the Registry!");
    throw new Error(`Renderer Error: Template '${templateName}' is not in the Registry!`);
  }

  const templateDict = (dictionary as any)[templateName];
  if (!templateDict) {
    logger.fatal({ template: templateName }, "Template missing in the Dictionary!");
    throw new Error(`Renderer Error: '${templateName}' missing in the Dictionary!`);
  }
  
  let strings = templateDict[lang];
  if (!strings) {
    logger.warn({ template: templateName, missingLang: lang, fallback: 'en' }, `Language '${lang}' not found. Falling back to English.`);
    strings = templateDict['en']; 
  }

  // Replace placeholders in all string values
  const content: any = {};
  for (const [key, textValue] of Object.entries(strings)) {
    if (typeof textValue === 'string') {
      content[key] = replacePlaceholders(textValue, variables);
    }
  }

  // Build ReceiptTotals labels from dictionary (for OrderConfirmation)
  if (content.subtotalLabel || content.shippingLabel || content.taxLabel || content.totalLabel) {
    content.totalsLabels = {
      subtotal: content.subtotalLabel,
      shipping: content.shippingLabel,
      tax: content.taxLabel,
      total: content.totalLabel,
    };
  }

  // Inject progress steps for order templates (if not explicitly provided)
  const orderProgressTemplates = ['OrderConfirmation', 'ShipmentCreated', 'OrderDelivered'];
  if (orderProgressTemplates.includes(templateName) && !content.progressSteps) {
    const progressLabels: Record<string, Record<string, string[]>> = {
      de: { OrderConfirmation: ['Bestellt', 'In Bearbeitung', 'Versendet', 'Zugestellt'], ShipmentCreated: ['Bestellt', 'Versendet', 'Zugestellt'], OrderDelivered: ['Bestellt', 'Versendet', 'Zugestellt'] },
      en: { OrderConfirmation: ['Ordered', 'Processing', 'Shipped', 'Delivered'], ShipmentCreated: ['Ordered', 'Shipped', 'Delivered'], OrderDelivered: ['Ordered', 'Shipped', 'Delivered'] },
      he: { OrderConfirmation: ['הוזמן', 'בעיבוד', 'נשלח', 'נמסר'], ShipmentCreated: ['הוזמן', 'נשלח', 'נמסר'], OrderDelivered: ['הוזמן', 'נשלח', 'נמסר'] },
    };
    const labels = (progressLabels[lang] || progressLabels['en'])[templateName] || progressLabels['en'][templateName];
    if (labels) {
      const activeIndex = templateName === 'OrderConfirmation' ? 1 : templateName === 'ShipmentCreated' ? 1 : labels.length - 1;
      content.progressSteps = labels.map((label: string, i: number) => ({
        label,
        completed: i < activeIndex,
        active: i === activeIndex,
      }));
    }
  }

  // Inject review button links for OrderDelivered
  if (templateName === 'OrderDelivered' && variables.reviewButtonLink) {
    content.reviewButtonLink = variables.reviewButtonLink;
  }

  // Resolve the ThemeProfile
  const designType = config.theme.designType || 'modern';
  const themeProfile = themes[designType] || themes.modern;

  // Build shared props
  const sharedProps: any = {
    brandName: config.theme.brandName || 'Our Shop',
    logoUrl: config.theme.logoUrl,
    company: config.theme.company,
    socials: config.theme.socials,
    content,
  };

  // Pass through template-specific data props (non-string, non-locale values)
  const dataPassthroughKeys = [
    'orderId', 'orderDate', 'items', 'totals', 'shippingAddress',
    'refundAmount', 'refundMethod', 'returnId', 'exchangeId',
    'giftCardCode', 'giftCardValue', 'expiryDate', 'amount', 'product',
  ];
  for (const key of dataPassthroughKeys) {
    if (variables[key] !== undefined) {
      sharedProps[key] = variables[key];
    }
  }

  logger.debug("Translation complete. Generating React HTML...");

  const html = await render(
    <ThemeProvider theme={themeProfile}>
      <Component {...sharedProps} />
    </ThemeProvider>
  );
  
  logger.info({ template: templateName }, "HTML successfully generated!");

  return { 
    htmlOutput: html, 
    subject: content.subject || "Notification from " + config.theme.brandName 
  };
}