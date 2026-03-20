// src/components/ThemeSpacer.tsx
import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeSpacerProps {
  size?: 'small' | 'medium' | 'large'; 
}

export const ThemeSpacer = ({ size = 'medium' }: ThemeSpacerProps) => {
  const theme = useTheme();

  // Wir berechnen die Höhe basierend auf unserem Theme-Abstand
  const getHeight = () => {
    const baseGap = parseInt(theme.spacing.elementGap); // z.B. 24px
    if (size === 'small') return `${Math.floor(baseGap / 2)}px`; // 12px
    if (size === 'large') return `${baseGap * 2}px`;             // 48px
    return `${baseGap}px`;                                       // 24px (Standard)
  };

  return (
    <div 
      style={{ 
        height: getHeight(), 
        width: '100%',
        display: 'block' 
      }} 
    />
  );
};