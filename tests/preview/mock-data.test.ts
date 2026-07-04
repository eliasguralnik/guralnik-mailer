// tests/preview/mock-data.test.ts
import { describe, it, expect } from 'vitest';
import { TemplateRegistry, TemplateName } from '../../src/engine/registry';
import { templateCategories, mockDataRegistry, previewLanguages, previewThemes, getMockData } from '../../src/preview/mock-data';
import { EmailBuilder } from '../../src/engine/builder';
import { buildConfig } from '../helpers';

const allTemplates = Object.keys(TemplateRegistry) as TemplateName[];

describe('preview mock data', () => {
  it('covers all 19 registered templates', () => {
    expect(allTemplates).toHaveLength(19);
    for (const template of allTemplates) {
      expect(mockDataRegistry, `missing mock data for ${template}`).toHaveProperty(template);
    }
  });

  it('lists every template in exactly one sidebar category', () => {
    const categorized = templateCategories.flatMap((category) => category.templates);
    expect(categorized.sort()).toEqual([...allTemplates].sort());
    expect(new Set(categorized).size).toBe(categorized.length);
  });

  it('exposes 10 themes and 10 languages', () => {
    expect(previewThemes).toHaveLength(10);
    expect(previewLanguages).toHaveLength(10);
  });

  it('renders every template successfully with its mock data', async () => {
    const builder = new EmailBuilder(buildConfig('resend'));

    for (const template of allTemplates) {
      const result = await builder.build(template, { ...getMockData(template), locale: 'en' });
      expect(result.html, `empty html for ${template}`).toContain('<html');
      expect(result.subject, `empty subject for ${template}`).toBeTruthy();
    }
  });
});
