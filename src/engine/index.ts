// src/engine/index.ts
import * as fs from 'fs';
import * as path from 'path';

import { logger as rootLogger } from "../logger";
import { SmartMailerConfig } from '../types';
import { TemplateName } from './registry';
import { EmailBuilder } from './builder';      
import { EmailDispatcher } from './dispatcher'; 

const logger = rootLogger.child({ module: 'Engine' });

function autoLoadConfig(): SmartMailerConfig {
  const configPath = path.join(process.cwd(), 'mailer.config.json');

  if (!fs.existsSync(configPath)) {
    logger.fatal({ path: configPath }, "Missing mailer.config.json!");
    throw new Error("Missing mailer.config.json!");
  }

  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    logger.fatal({ error, path: configPath }, "mailer.config.json is not valid JSON!");
    throw new Error("Invalid mailer.config.json format!");
  }
}

class BlackboxMailer {
  private builder: EmailBuilder;
  private dispatcher: EmailDispatcher;

  constructor() {
    const config = autoLoadConfig();
    this.builder = new EmailBuilder(config);
    this.dispatcher = new EmailDispatcher(config);
    
    logger.debug("BlackboxMailer initialized successfully.");
  }

  async send(templateName: TemplateName, customerEmail: string, rawData: any) {
    try {
      logger.debug({ template: templateName, to: customerEmail }, "Starting email pipeline...");

      const emailContent = await this.builder.build(templateName, rawData);

      logger.info(
        { template: templateName, lang: emailContent.lang, subject: emailContent.subject }, 
        "Email built successfully."
      );

      await this.dispatcher.dispatch(customerEmail, emailContent.subject, emailContent.html);

      logger.info({ to: customerEmail }, "Live dispatch completed successfully.");
      
    } catch (error) {
      logger.error({ error, template: templateName, to: customerEmail }, "Critical error in the engine!");
      
      throw error;
    }
  }
}

export const mailer = new BlackboxMailer();