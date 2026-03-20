// src/templates/OrderDeliveredEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { ProgressTracker } from '../components/ProgressTracker';
import { DataRow } from '../components/DataRow';
import { AlertBox } from '../components/AlertBox';

export interface OrderDeliveredProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  socials?: { instagram?: string; twitter?: string; facebook?: string; website?: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    orderIdLabel: string;
    deliveredNote?: string;
    button: string;
    buttonLink?: string;
    reviewButton?: string;
    reviewButtonLink?: string;
    outroText?: string;
    progressSteps?: Array<{ label: string; completed: boolean; active?: boolean }>;
  };
  orderId: string;
}

export const OrderDeliveredEmail = ({ brandName, logoUrl, company, socials, content, orderId }: OrderDeliveredProps) => (
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

      {content.progressSteps && (
        <ProgressTracker steps={content.progressSteps} />
      )}

      <Section style={{ margin: '16px 0' }}>
        <DataRow label={content.orderIdLabel} value={orderId} />
      </Section>

      {content.deliveredNote && (
        <AlertBox variant="success">
          {content.deliveredNote}
        </AlertBox>
      )}

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.buttonLink || '#'}>
          {content.button}
        </ThemeButton>
        {content.reviewButton && content.reviewButtonLink && (
          <>
            <ThemeSpacer size="small" />
            <ThemeButton href={content.reviewButtonLink} variant="secondary">
              {content.reviewButton}
            </ThemeButton>
          </>
        )}
      </Section>

      {content.outroText && (
        <ThemeText variant="muted">{content.outroText}</ThemeText>
      )}
    </Section>
  </MasterLayout>
);
