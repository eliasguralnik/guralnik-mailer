// src/components/Header.tsx
import * as React from 'react';
import { Section, Img } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeHeading } from './ThemeTypography';

export const Header = ({ brandName, logoUrl }: { brandName: string; logoUrl?: string }) => {
  const theme = useTheme();

  return (
    <Section style={{ paddingBottom: '24px', textAlign: 'center' }}>
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt={brandName}
          height="45"
          style={{ margin: '0 auto', display: 'block', maxWidth: '100%' }}
        />
      ) : (
        <ThemeHeading level="h2" style={{ 
          margin: 0,
          ...(theme.name === 'bold' && { textTransform: 'uppercase' as const, letterSpacing: '2px' }),
          ...(theme.name === 'elegant' && { fontStyle: 'italic', letterSpacing: '1px' }),
        }}>
          {brandName}
        </ThemeHeading>
      )}
    </Section>
  );
};