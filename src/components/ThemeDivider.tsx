// src/components/ThemeDivider.tsx
import React from 'react';
import { Hr } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';

export const ThemeDivider = () => {
  const theme = useTheme();

  return (
    <Hr
      style={{
        borderColor: theme.colors.border, // Zieht sich z.B. das feine Grau aus dem elegant-Theme
        borderWidth: '1px',               // Schön dünn und edel
        borderStyle: 'solid',
        margin: `${theme.spacing.elementGap} 0`, // Dynamischer Abstand nach oben und unten
        width: '100%',
      }}
    />
  );
};