// src/components/ThemeTypography.tsx
import React from 'react';
import { Text, Heading } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';

// ==========================================
// 1. ÜBERSCHRIFTEN (ThemeHeading)
// ==========================================
interface ThemeHeadingProps {
  level?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  style?: React.CSSProperties; // Falls du in Ausnahmefällen mal was überschreiben musst
}

export const ThemeHeading = ({ level = 'h1', children, style }: ThemeHeadingProps) => {
  const theme = useTheme();

  // Kleine Mathematik-Magie: Wir berechnen h1, h2, h3 dynamisch aus dem Theme-Standardwert
  const getFontSize = () => {
    const baseSize = parseInt(theme.typography.heading.fontSize); // z.B. 24 aus modernTheme
    if (level === 'h1') return `${baseSize + 6}px`; // 30px
    if (level === 'h2') return `${baseSize}px`;     // 24px (Standard)
    if (level === 'h3') return `${baseSize - 4}px`; // 20px
    return theme.typography.heading.fontSize;
  };

  return (
    <Heading
      as={level}
      style={{
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text.main,
        fontSize: getFontSize(),
        fontWeight: theme.typography.heading.fontWeight,
        margin: '0 0 16px 0', // Sauberer Abstand nach unten
        ...style,
      }}
    >
      {children}
    </Heading>
  );
};

// ==========================================
// 2. FLIESSTEXT (ThemeText)
// ==========================================
interface ThemeTextProps {
  variant?: 'main' | 'muted'; // 'muted' ist für grauen, unwichtigen Text (z.B. Footer)
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ThemeText = ({ variant = 'main', children, style }: ThemeTextProps) => {
  const theme = useTheme();

  return (
    <Text
      style={{
        fontFamily: theme.typography.fontFamily,
        // Zieht sich dynamisch das dunkle oder graue Text-Theme:
        color: variant === 'muted' ? theme.colors.text.muted : theme.colors.text.main,
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        margin: '0 0 16px 0',
        ...style,
      }}
    >
      {children}
    </Text>
  );
};