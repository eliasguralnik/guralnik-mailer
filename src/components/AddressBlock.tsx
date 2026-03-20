// src/components/AddressBlock.tsx
import React from 'react';
import { Section } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

export interface AddressData {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

interface AddressBlockProps {
  title: string;
  address: AddressData;
}

export const AddressBlock = ({ title, address }: AddressBlockProps) => {
  const theme = useTheme();

  return (
    <Section style={{
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.container,
      padding: '20px 24px',
      marginBottom: '12px',
    }}>
      <ThemeText style={{ 
        margin: '0 0 12px 0', 
        fontWeight: 'bold', 
        fontSize: '13px', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.colors.text.muted,
      }}>
        {title}
      </ThemeText>

      <ThemeText style={{ margin: '0 0 4px 0', fontWeight: '600' }}>
        {address.name}
      </ThemeText>

      {address.company && (
        <ThemeText variant="muted" style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
          {address.company}
        </ThemeText>
      )}

      <ThemeText variant="muted" style={{ margin: '0 0 2px 0', fontSize: '14px' }}>
        {address.address1}
      </ThemeText>

      {address.address2 && (
        <ThemeText variant="muted" style={{ margin: '0 0 2px 0', fontSize: '14px' }}>
          {address.address2}
        </ThemeText>
      )}

      <ThemeText variant="muted" style={{ margin: '0 0 2px 0', fontSize: '14px' }}>
        {[address.postalCode, address.city].filter(Boolean).join(' ')}{address.province ? `, ${address.province}` : ''}
      </ThemeText>

      {address.country && (
        <ThemeText variant="muted" style={{ margin: '0 0 2px 0', fontSize: '14px' }}>
          {address.country}
        </ThemeText>
      )}

      {address.phone && (
        <ThemeText variant="muted" style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
          📞 {address.phone}
        </ThemeText>
      )}
    </Section>
  );
};
