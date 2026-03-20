// src/components/OrderLineItem.tsx
import React from 'react';
import { Row, Column, Img } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

export interface OrderLineItemProps {
  image?: string;
  title: string;
  subtitle?: string;
  quantity: number;
  price: string;
  quantityLabel?: string; // e.g. "Qty" / "Anzahl" / "כמות"
}

export const OrderLineItem = ({ image, title, subtitle, quantity, price, quantityLabel = 'Qty' }: OrderLineItemProps) => {
  const theme = useTheme();

  return (
    <Row style={{ marginBottom: theme.spacing.elementGap, width: '100%' }}>
      {image && (
        <Column style={{ width: '64px', paddingRight: '16px', verticalAlign: 'top' }}>
          <Img
            src={image}
            width="64"
            height="64"
            style={{
              borderRadius: theme.borderRadius.button,
              objectFit: 'cover',
              border: `1px solid ${theme.colors.border}`,
            }}
          />
        </Column>
      )}

      <Column style={{ verticalAlign: 'top' }}>
        <ThemeText style={{ margin: 0, fontWeight: 'bold' }}>{title}</ThemeText>
        {subtitle && (
          <ThemeText variant="muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            {subtitle}
          </ThemeText>
        )}
      </Column>

      <Column style={{ verticalAlign: 'top', textAlign: 'right' }}>
        <ThemeText style={{ margin: 0, fontWeight: 'bold' }}>{price}</ThemeText>
        <ThemeText variant="muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
          {quantityLabel}: {quantity}
        </ThemeText>
      </Column>
    </Row>
  );
};