// src/components/ProductCard.tsx
import React from 'react';
import { Section, Img, Row, Column } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';
import { ThemeButton } from './Button';

export interface ProductCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string; // Durchgestrichener Preis
  badge?: string;         // z.B. "SALE", "NEU", "AUSVERKAUFT"
  buttonText?: string;
  buttonLink?: string;
}

export const ProductCard = ({ image, title, subtitle, price, originalPrice, badge, buttonText, buttonLink }: ProductCardProps) => {
  const theme = useTheme();

  return (
    <Section style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.container,
      overflow: 'hidden',
      marginBottom: theme.spacing.elementGap,
      maxWidth: '260px',
    }}>
      {/* Image */}
      {image && (
        <div style={{ position: 'relative' as const }}>
          <Img
            src={image}
            width="260"
            height="200"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {badge && (
            <div style={{
              position: 'absolute' as const,
              top: '12px',
              left: '12px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.surface,
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: theme.typography.fontFamily,
              padding: '4px 10px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <ThemeText style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '16px' }}>
          {title}
        </ThemeText>

        {subtitle && (
          <ThemeText variant="muted" style={{ margin: '0 0 12px 0', fontSize: '13px' }}>
            {subtitle}
          </ThemeText>
        )}

        {/* Price */}
        <div style={{ marginBottom: buttonText ? '16px' : '0' }}>
          <span style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '18px',
            fontWeight: 'bold',
            color: theme.colors.text.main,
          }}>
            {price}
          </span>
          {originalPrice && (
            <span style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: '14px',
              color: theme.colors.text.muted,
              textDecoration: 'line-through',
              marginLeft: '8px',
            }}>
              {originalPrice}
            </span>
          )}
        </div>

        {buttonText && buttonLink && (
          <ThemeButton href={buttonLink}>
            {buttonText}
          </ThemeButton>
        )}
      </div>
    </Section>
  );
};
