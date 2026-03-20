// src/templates/OrderReturnEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { DataRow } from '../components/DataRow';

export interface OrderReturnProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    orderIdLabel: string;
    returnIdLabel?: string;
    button: string;
    buttonLink?: string;
    instructionsHeading?: string;
    instructions?: string;
    outroText?: string;
  };
  orderId: string;
  returnId?: string;
}

export const OrderReturnEmail = ({ brandName, logoUrl, company, content, orderId, returnId }: OrderReturnProps) => (
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
        {returnId && content.returnIdLabel && (
          <DataRow label={content.returnIdLabel} value={returnId} />
        )}
      </Section>

      {content.instructions && (
        <>
          <ThemeSpacer size="small" />
          {content.instructionsHeading && (
            <ThemeHeading level="h3">{content.instructionsHeading}</ThemeHeading>
          )}
          <ThemeText variant="muted">
            {content.instructions}
          </ThemeText>
        </>
      )}

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
