// src/types.ts

export type DesignType =
  | 'modern' | 'minimal' | 'elegant' | 'bold' | 'classic'
  | 'futuristic' | 'midnight' | 'nature' | 'playful' | 'monochrome';

export interface ThemeConfig {
  designType: DesignType;
  brandName: string;
  logoUrl?: string;

  colors: {
    primary: string;
    background: string;
    surface?: string;
    text: string;
    textMuted?: string;
    border?: string;
  };

  company?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    contactEmail: string;
  };

  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
}

export interface SmartMailerConfig {
  provider: 'resend' | 'sendgrid' | 'smtp';
  apiKey?: string;
  host?: string;
  port?: number;
  user?: string;
  senderEmail: string;
  storeUrl?: string;
  defaultLanguage?: string;
  theme: ThemeConfig;
}