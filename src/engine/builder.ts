// src/engine/builder.ts
import { SmartMailerConfig } from '../types';
import { TemplateName } from './registry';
import { validateAndPrepareData, ValidatedData } from './validator';
import { renderTemplate } from './renderer'; 
import { logger as rootLogger } from "../logger";

export class EmailBuilder {
  private config: SmartMailerConfig;
  private logger;

  constructor(config: SmartMailerConfig) {
    this.config = config;
    this.logger = rootLogger.child({ module: 'Builder' });
  }

  async build(templateName: TemplateName, rawData: any) {
    this.logger.debug({ template: templateName }, "Builder starting process...");

    const cleanData: ValidatedData = validateAndPrepareData(templateName, rawData, this.config);

    this.logger.debug({ lang: cleanData.lang }, "Renderer building HTML...");

    const { htmlOutput, subject } = await renderTemplate(
      cleanData.templateName,
      cleanData.lang,
      cleanData.variables,
      this.config
    );

    return {
      html: htmlOutput,
      subject: subject,
      lang: cleanData.lang
    };
  }
}