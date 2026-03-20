// src/templates/OrderTransferEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { DataRow } from '../components/DataRow';

export interface OrderTransferProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    orderIdLabel: string;
    button: string;
    buttonLink?: string;
    outroText?: string;
  };
  orderId: string;
}

export const OrderTransferEmail = ({ brandName, logoUrl, company, content, orderId }: OrderTransferProps) => (
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

      <Section style={{ margin: '16px 0' }}>
        <DataRow label={content.orderIdLabel} value={orderId} />
      </Section>

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.buttonLink || '#'}>
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
