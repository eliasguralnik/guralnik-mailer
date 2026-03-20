// src/components/ReceiptTotals.tsx
import React from 'react';
import { Row, Column } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';
import { ThemeDivider } from './ThemeDivider';

export interface ReceiptTotalsProps {
  subtotal: string;
  shipping: string;
  tax?: string;
  total: string;
  labels?: {
    subtotal?: string;
    shipping?: string;
    tax?: string;
    total?: string;
  };
}

export const ReceiptTotals = ({ subtotal, shipping, tax, total, labels }: ReceiptTotalsProps) => {
  const theme = useTheme();

  const l = {
    subtotal: labels?.subtotal || 'Subtotal',
    shipping: labels?.shipping || 'Shipping',
    tax: labels?.tax || 'Tax',
    total: labels?.total || 'Total',
  };

  const TotalRow = ({ label, value, isTotal = false }: { label: string; value: string; isTotal?: boolean }) => (
    <Row style={{ width: '100%', marginBottom: '8px' }}>
      <Column>
        <ThemeText variant={isTotal ? 'main' : 'muted'} style={{ margin: 0, fontWeight: isTotal ? 'bold' : 'normal' }}>
          {label}
        </ThemeText>
      </Column>
      <Column style={{ textAlign: 'right' }}>
        <ThemeText style={{ margin: 0, fontWeight: isTotal ? 'bold' : 'normal' }}>
          {value}
        </ThemeText>
      </Column>
    </Row>
  );

  return (
    <div style={{ 
      width: '100%', 
      padding: '24px', 
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.container, 
      marginTop: theme.spacing.elementGap,
      boxSizing: 'border-box'
    }}>
      <TotalRow label={l.subtotal} value={subtotal} />
      <TotalRow label={l.shipping} value={shipping} />
      {tax && <TotalRow label={l.tax} value={tax} />}
      
      <div style={{ margin: '16px 0' }}>
        <ThemeDivider />
      </div>
      
      <TotalRow label={l.total} value={total} isTotal={true} />
    </div>
  );
};