// src/templates/CustomerVerifyEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';

export interface CustomerVerifyProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    button: string;
    verifyLink: string;
    expiryNote?: string;
  };
}

export const CustomerVerifyEmail = ({ brandName, logoUrl, company, content }: CustomerVerifyProps) => (
  <MasterLayout 
    previewText={content.previewText || content.greeting} 
    brandName={brandName}
    logoUrl={logoUrl}
    company={company}
  >
    <Section>
      <ThemeHeading level="h1">
        {content.greeting}
      </ThemeHeading>

      <ThemeText>
        {content.body}
      </ThemeText>

      {content.expiryNote && (
        <ThemeText variant="muted" style={{ fontSize: '13px' }}>
          {content.expiryNote}
        </ThemeText>
      )}

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.verifyLink || '#'}>
          {content.button}
        </ThemeButton>
      </Section>
    </Section>
  </MasterLayout>
);
