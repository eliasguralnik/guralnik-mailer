// src/templates/PasswordResetEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';

export interface PasswordResetProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    button: string;
    resetLink: string;
    expiryNote?: string;
  };
}

export const PasswordResetEmail = ({ brandName, logoUrl, company, content }: PasswordResetProps) => (
  <MasterLayout 
    previewText={content.previewText || content.greeting} 
    brandName={brandName}
    logoUrl={logoUrl}
    company={company}
  >
    <ThemeHeading level="h2">
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
    
    <Section style={{ textAlign: 'center', margin: '32px 0' }}>
      <ThemeButton href={content.resetLink || "#"}>
        {content.button}
      </ThemeButton>
    </Section>

  </MasterLayout>
);