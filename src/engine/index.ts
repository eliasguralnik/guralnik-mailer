// src/engine/index.ts
import * as fs from 'fs';
import * as path from 'path';

import { logger as rootLogger } from "../logger";
import { SmartMailerConfig, SendOptions, BatchRecipient, BatchOptions, BatchResult } from '../types';
import { TemplateName } from './registry';
import { EmailBuilder } from './builder';
import { EmailDispatcher } from './dispatcher';
import { runBatch } from './batch';

const logger = rootLogger.child({ module: 'Engine' });

/**
 * Akzeptiert `from` als Alias für `senderEmail` und hebt einen
 * verschachtelten `smtp`-Block auf die flachen Felder — beides Formate,
 * die der Setup-Wizard bzw. die README dokumentieren.
 */
export function normalizeConfig(raw: any): SmartMailerConfig {
  const config = { ...raw };
  if (!config.senderEmail && config.from) {
    config.senderEmail = config.from;
  }
  return config as SmartMailerConfig;
}

function autoLoadConfig(): SmartMailerConfig {
  const configPath = path.join(process.cwd(), 'mailer.config.json');

  if (!fs.existsSync(configPath)) {
    logger.fatal({ path: configPath }, "Missing mailer.config.json!");
    throw new Error("Missing mailer.config.json!");
  }

  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    return normalizeConfig(JSON.parse(rawData));
  } catch (error) {
    logger.fatal({ error, path: configPath }, "mailer.config.json is not valid JSON!");
    throw new Error("Invalid mailer.config.json format!");
  }
}

class BlackboxMailer {
  private builder?: EmailBuilder;
  private dispatcher?: EmailDispatcher;

  // Config wird lazy beim ersten Send geladen — so crasht ein bloßer Import
  // (z.B. durch den CLI-Wizard oder Tests) nicht ohne mailer.config.json.
  private ensureInitialized() {
    if (this.builder && this.dispatcher) return;

    const config = autoLoadConfig();
    this.builder = new EmailBuilder(config);
    this.dispatcher = new EmailDispatcher(config);

    logger.debug("BlackboxMailer initialized successfully.");
  }

  async send(templateName: TemplateName, customerEmail: string, rawData: any, options?: SendOptions) {
    try {
      this.ensureInitialized();

      logger.debug({ template: templateName, to: customerEmail }, "Starting email pipeline...");

      const emailContent = await this.builder!.build(templateName, rawData);

      logger.info(
        { template: templateName, lang: emailContent.lang, subject: emailContent.subject },
        "Email built successfully."
      );

      await this.dispatcher!.dispatch(customerEmail, emailContent.subject, emailContent.html, options);

      logger.info({ to: customerEmail }, "Live dispatch completed successfully.");

    } catch (error) {
      logger.error({ error, template: templateName, to: customerEmail }, "Critical error in the engine!");

      throw error;
    }
  }

  /**
   * Verschickt dasselbe Template an viele Empfänger — mit Rate-Limiting,
   * automatischen Retries bei transienten Fehlern (429/5xx) und Callbacks.
   * Jeder Empfänger bekommt sein eigenes Rendering (eigene Sprache & Daten).
   */
  async sendBatch(
    templateName: TemplateName,
    recipients: BatchRecipient[],
    options: BatchOptions = {}
  ): Promise<BatchResult> {
    this.ensureInitialized();

    return runBatch(
      async (recipient) => {
        const emailContent = await this.builder!.build(templateName, recipient.data);
        await this.dispatcher!.dispatch(recipient.to, emailContent.subject, emailContent.html, {
          attachments: options.attachments,
        });
      },
      recipients,
      options
    );
  }
}

export const mailer = new BlackboxMailer();
