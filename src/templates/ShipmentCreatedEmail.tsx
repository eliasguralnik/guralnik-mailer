// src/templates/ShipmentCreatedEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { useTheme } from '../theme/ThemeProvider';
import { DataRow } from '../components/DataRow';

export interface ShipmentCreatedProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    trackingLabel?: string;
    trackingNumber?: string;
    trackingLink?: string;
    button: string;
    outroText?: string;
  };
}

const TrackingBox = ({ label, trackingNumber }: { label: string; trackingNumber: string }) => {
  const theme = useTheme();
  return (
    <Section style={{ 
      margin: '24px 0', 
      padding: '20px', 
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.container,
      border: `1px solid ${theme.colors.border}`,
    }}>
      <DataRow label={label} value={trackingNumber} />
    </Section>
  );
};

export const ShipmentCreatedEmail = ({ brandName, logoUrl, company, content }: ShipmentCreatedProps) => (
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

      {content.trackingNumber && (
        <TrackingBox 
          label={content.trackingLabel || 'Tracking'} 
          trackingNumber={content.trackingNumber} 
        />
      )}

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.trackingLink || '#'}>
          {content.button}
        </ThemeButton>
      </Section>

      {content.outroText && (
        <ThemeText variant="muted">
          {content.outroText}
        </ThemeText>
      )}
    </Section>
  </MasterLayout>
);