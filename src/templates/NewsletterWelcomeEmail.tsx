// src/templates/NewsletterWelcomeEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { InfoGrid } from '../components/InfoGrid';
import { AlertBox } from '../components/AlertBox';

export interface NewsletterWelcomeProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  socials?: { instagram?: string; twitter?: string; facebook?: string; website?: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    perksHeading?: string;
    perks?: Array<{ icon?: string; label: string; value: string }>;
    confirmNote?: string;
    button?: string;
    buttonLink?: string;
    outroText?: string;
  };
}

export const NewsletterWelcomeEmail = ({ brandName, logoUrl, company, socials, content }: NewsletterWelcomeProps) => (
  <MasterLayout 
    previewText={content.previewText || content.greeting} 
    brandName={brandName}
    logoUrl={logoUrl}
    company={company}
    socials={socials}
  >
    <Section>
      <ThemeHeading level="h1">
        {content.greeting}
      </ThemeHeading>

      <ThemeText>
        {content.body}
      </ThemeText>

      {content.perks && content.perks.length > 0 && (
        <>
          {content.perksHeading && (
            <ThemeHeading level="h3">{content.perksHeading}</ThemeHeading>
          )}
          <InfoGrid items={content.perks} columns={2} />
        </>
      )}

      {content.confirmNote && (
        <AlertBox variant="success">
          {content.confirmNote}
        </AlertBox>
      )}

      {content.button && content.buttonLink && (
        <>
          <ThemeSpacer size="small" />
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <ThemeButton href={content.buttonLink}>
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
