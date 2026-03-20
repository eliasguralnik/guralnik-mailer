// src/components/ThemeContainer.tsx
import React from 'react';
import { Container } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeContainerProps {
  children: React.ReactNode;
}

export const ThemeContainer = ({ children }: ThemeContainerProps) => {
  const theme = useTheme();

  return (
    <Container
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.containerPadding,
        borderRadius: theme.borderRadius.container,
        border: `1px solid ${theme.colors.border}`,
        margin: '0 auto',
        maxWidth: '600px',
        overflow: 'hidden',
        ...(theme.shadow && {
          boxShadow: theme.shadow,
        }),
      }}
    >
      {children}
    </Container>
  );
};