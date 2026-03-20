// src/components/AlertBox.tsx
import React from 'react';
import { Section } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

type AlertVariant = 'success' | 'warning' | 'info' | 'error';

interface AlertBoxProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

const variantConfig: Record<AlertVariant, { emoji: string; lightBg: string; darkBg: string; border: string; accent: string }> = {
  success: { emoji: '✓', lightBg: '#F0FFF4', darkBg: '#1a332a', border: '#C6F6D5', accent: '#38A169' },
  warning: { emoji: '!', lightBg: '#FFFBEB', darkBg: '#332d1a', border: '#FEFCBF', accent: '#D69E2E' },
  info:    { emoji: 'i', lightBg: '#EBF8FF', darkBg: '#1a2833', border: '#BEE3F8', accent: '#3182CE' },
  error:   { emoji: '✕', lightBg: '#FFF5F5', darkBg: '#331a1a', border: '#FED7D7', accent: '#E53E3E' },
};

export const AlertBox = ({ variant = 'info', title, children }: AlertBoxProps) => {
  const theme = useTheme();
  const config = variantConfig[variant];
  
  // Detect dark themes
  const isDark = ['futuristic', 'midnight', 'monochrome'].includes(theme.name) 
    || theme.colors.background.startsWith('#0') 
    || theme.colors.background.startsWith('#1');

  return (
    <Section style={{
      backgroundColor: isDark ? config.darkBg : config.lightBg,
      border: `1px solid ${config.border}`,
      borderLeft: `4px solid ${config.accent}`,
      borderRadius: theme.borderRadius.container,
      padding: '20px 24px',
      margin: `${theme.spacing.elementGap} 0`,
    }}>
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
        <tr>
          {/* Icon Circle */}
          <td style={{ width: '36px', verticalAlign: 'top', paddingRight: '16px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: config.accent,
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '28px',
              textAlign: 'center',
              fontFamily: theme.typography.fontFamily,
            }}>
              {config.emoji}
            </div>
          </td>
          {/* Content */}
          <td style={{ verticalAlign: 'top' }}>
            {title && (
              <ThemeText style={{ 
                margin: '0 0 6px 0', 
                fontWeight: 'bold', 
                fontSize: '15px',
                color: config.accent,
              }}>
                {title}
              </ThemeText>
            )}
            <ThemeText variant="muted" style={{ margin: 0, fontSize: '14px', lineHeight: '22px' }}>
              {children}
            </ThemeText>
          </td>
        </tr>
      </table>
    </Section>
  );
};
