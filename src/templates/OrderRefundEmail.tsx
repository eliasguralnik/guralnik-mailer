// src/templates/OrderRefundEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { DataRow } from '../components/DataRow';
import { useTheme } from '../theme/ThemeProvider';

export interface OrderRefundProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    orderIdLabel: string;
    refundAmountLabel: string;
    refundMethodLabel?: string;
    button: string;
    buttonLink?: string;
    outroText?: string;
  };
  orderId: string;
  refundAmount: string;
  refundMethod?: string;
}

const RefundBadge = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Section style={{
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.container,
      padding: '20px',
      margin: '24px 0',
      textAlign: 'center',
    }}>
      <ThemeText style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
        {text}
      </ThemeText>
    </Section>
  );
};

export const OrderRefundEmail = ({ brandName, logoUrl, company, content, orderId, refundAmount, refundMethod }: OrderRefundProps) => (
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

      <RefundBadge text={refundAmount} />

      <Section style={{ margin: '16px 0' }}>
        <DataRow label={content.orderIdLabel} value={orderId} />
        <DataRow label={content.refundAmountLabel} value={refundAmount} />
        {refundMethod && content.refundMethodLabel && (
          <DataRow label={content.refundMethodLabel} value={refundMethod} />
        )}
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
