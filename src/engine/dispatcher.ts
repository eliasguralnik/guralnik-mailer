// src/engine/dispatcher.ts
import { SmartMailerConfig } from '../types';
import { SmtpProvider } from '../providers/SmtpProvider';
import { SendgridProvider } from '../providers/SendgridProvider';
import { ResendProvider } from '../providers/ResendProvider'; 
import { logger as rootLogger } from "../logger";

const logger = rootLogger.child({ module: 'Dispatcher' });

export class EmailDispatcher {
  private config: SmartMailerConfig;
  private providerInstance: any;

  constructor(config: SmartMailerConfig) {
    this.config = config;
    this.initProvider();
  }

  private initProvider() {
    switch (this.config.provider) {
      case 'resend':
        this.providerInstance = new ResendProvider(this.config);
        break;
      case 'smtp':
        this.providerInstance = new SmtpProvider(this.config);
        break;
      case 'sendgrid':
        this.providerInstance = new SendgridProvider(this.config);
        break;
      default:
        logger.fatal({ provider: this.config.provider }, "Unknown provider in config!");
        throw new Error(`Unknown provider in config: ${this.config.provider}`);
    }
    
    logger.debug({ provider: this.config.provider }, "Provider initialized.");
  }

  async dispatch(to: string, subject: string, html: string): Promise<void> {
    logger.debug({ to, provider: this.config.provider }, "Attempting to dispatch email...");

    try {
      await this.providerInstance.send({
        from: this.config.senderEmail,
        to: to,
        subject: subject,
        html: html,
      });

      logger.info(
        { to, provider: this.config.provider }, 
        `🚀 Successfully dispatched via ${this.config.provider.toUpperCase()}`
      );
      
    } catch (error) {
      logger.error(
        { error, to, provider: this.config.provider }, 
        `❌ Failed to dispatch via ${this.config.provider}`
      );
      
      throw error;
    }
  }
}