// src/layouts/MasterLayout.tsx
import React from 'react';
import { Html, Head, Body, Preview, Section } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeContainer } from '../components/ThemeContainer';
import { ThemeDivider } from '../components/ThemeDivider';
import { ThemeText } from '../components/ThemeTypography';
import { Footer } from '../components/Footer';

export interface MasterLayoutProps {
  previewText: string;
  brandName: string;
  logoUrl?: string;
  company?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    contactEmail: string;
  };
  socials?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  children: React.ReactNode;
}

export const MasterLayout = ({ previewText, brandName, logoUrl, company, socials, children }: MasterLayoutProps) => {
  const theme = useTheme();

  return (
    <Html>
      <Head>
        {/* Google Fonts Fallback for supported clients */}
        <style>{`
          @media screen {
            body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      
      <Body style={{ 
        backgroundColor: theme.colors.background, 
        fontFamily: theme.typography.fontFamily,
        padding: '40px 20px',
        margin: '0',
        WebkitTextSizeAdjust: '100%',
      }}>
        
        {/* Container Card with Shadow */}
        <ThemeContainer>
          
          {/* ═══════ HEADER ═══════ */}
          <Section style={{ 
            textAlign: 'center', 
            paddingBottom: '32px',
          }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                height="40"
                style={{ 
                  margin: '0 auto', 
                  display: 'block', 
                  maxWidth: '180px',
                }}
              />
            ) : (
              <ThemeText style={{ 
                fontSize: '20px',
                fontWeight: theme.typography.heading.fontWeight,
                margin: 0,
                color: theme.colors.primary,
                letterSpacing: theme.typography.heading.letterSpacing || '0',
                ...(theme.name === 'bold' && { 
                  textTransform: 'uppercase' as const, 
                  letterSpacing: '0.15em',
                  fontSize: '18px',
                }),
                ...(theme.name === 'elegant' && { 
                  fontStyle: 'italic', 
                  letterSpacing: '0.08em',
                  fontSize: '22px',
                }),
                ...(theme.name === 'monochrome' && {
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.2em',
                  fontSize: '16px',
                  borderBottom: '3px solid #000',
                  paddingBottom: '8px',
                  display: 'inline-block',
                }),
              }}>
                {brandName}
              </ThemeText>
            )}
          </Section>

          {/* ═══════ DIVIDER ═══════ */}
          <ThemeDivider />

          {/* ═══════ CONTENT ═══════ */}
          <Section style={{ paddingTop: '8px' }}>
            {children}
          </Section>

          {/* ═══════ FOOTER ═══════ */}
          <Footer brandName={brandName} company={company} socials={socials} />

        </ThemeContainer>
        
      </Body>
    </Html>
  );
};