// src/templates/AccountDeletedEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { AlertBox } from '../components/AlertBox';

export interface AccountDeletedProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    warningNote?: string;
    button?: string;
    buttonLink?: string;
    outroText?: string;
  };
}

export const AccountDeletedEmail = ({ brandName, logoUrl, company, content }: AccountDeletedProps) => (
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

      {content.warningNote && (
        <AlertBox variant="warning">
          {content.warningNote}
        </AlertBox>
      )}

      {content.button && content.buttonLink && (
        <>
          <ThemeSpacer size="small" />
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <ThemeButton href={content.buttonLink} variant="ghost">
              {content.button}
            </ThemeButton>
          </Section>
        </>
      )}

      {content.outroText && (
        <ThemeText variant="muted">{content.outroText}</ThemeText>
      )}
    </Section>
  </MasterLayout>
);
