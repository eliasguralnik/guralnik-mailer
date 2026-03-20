// src/templates/GiftCardCreatedEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { useTheme } from '../theme/ThemeProvider';
import { DataRow } from '../components/DataRow';

export interface GiftCardCreatedProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    codeLabel: string;
    valueLabel: string;
    expiryLabel?: string;
    button: string;
    buttonLink?: string;
    outroText?: string;
  };
  giftCardCode: string;
  giftCardValue: string;
  expiryDate?: string;
}

const GiftCardBadge = ({ code, value }: { code: string; value: string }) => {
  const theme = useTheme();
  return (
    <Section style={{
      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent || theme.colors.primary})`,
      borderRadius: theme.borderRadius.container === '0px' ? '0px' : '16px',
      padding: '32px 24px',
      margin: '24px 0',
      textAlign: 'center',
    }}>
      <ThemeText style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: '600',
      }}>
        Gift Card
      </ThemeText>
      <ThemeText style={{
        margin: '0 0 16px 0',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </ThemeText>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '8px',
        padding: '10px 20px',
        display: 'inline-block',
      }}>
        <ThemeText style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#ffffff',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '0.15em',
        }}>
          {code}
        </ThemeText>
      </div>
    </Section>
  );
};

export const GiftCardCreatedEmail = ({ brandName, logoUrl, company, content, giftCardCode, giftCardValue, expiryDate }: GiftCardCreatedProps) => (
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

      <GiftCardBadge code={giftCardCode} value={giftCardValue} />

      <Section style={{ margin: '16px 0' }}>
        <DataRow label={content.codeLabel} value={giftCardCode} />
        <DataRow label={content.valueLabel} value={giftCardValue} />
        {expiryDate && content.expiryLabel && (
          <DataRow label={content.expiryLabel} value={expiryDate} />
        )}
      </Section>

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.buttonLink || '#'}>
          {content.button}
        </ThemeButton>
      </Section>

      {content.outroText && (
        <ThemeText variant="muted">{content.outroText}</ThemeText>
      )}
    </Section>
  </MasterLayout>
);
