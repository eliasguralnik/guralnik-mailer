// src/components/Button.tsx
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from '@react-email/components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ThemeButtonProps {
  href: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const ThemeButton = ({ href, variant = 'primary', fullWidth = false, children }: ThemeButtonProps) => {
  const theme = useTheme();

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.body.fontSize,
      fontWeight: 'bold',
      padding: '14px 32px',
      borderRadius: theme.borderRadius.button,
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      letterSpacing: '0.02em',
      ...(fullWidth && { width: '100%', boxSizing: 'border-box' as const }),
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: theme.colors.primary,
          color: theme.colors.surface,
          border: 'none',
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: theme.colors.primary,
          border: `2px solid ${theme.colors.primary}`,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: theme.colors.text.main,
          border: `1px solid ${theme.colors.border}`,
          fontWeight: 'normal',
        };
    }
  };

  return (
    <Button href={href} style={getStyles()}>
      {children}
    </Button>
  );
};