// src/components/ImageBanner.tsx
import React from 'react';
import { Section, Img } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

interface ImageBannerProps {
  imageUrl: string;
  height?: string;
  title?: string;
  subtitle?: string;
  overlayOpacity?: number;
}

export const ImageBanner = ({ imageUrl, height = '200', title, subtitle, overlayOpacity = 0.4 }: ImageBannerProps) => {
  const theme = useTheme();

  if (!title && !subtitle) {
    // Simple image banner without overlay
    return (
      <Section style={{ margin: `${theme.spacing.elementGap} 0` }}>
        <Img
          src={imageUrl}
          width="600"
          height={height}
          style={{
            width: '100%',
            height: `${height}px`,
            objectFit: 'cover',
            display: 'block',
            borderRadius: theme.borderRadius.container,
          }}
        />
      </Section>
    );
  }

  // Banner with text overlay
  return (
    <Section style={{ 
      margin: `${theme.spacing.elementGap} 0`,
      position: 'relative' as const,
      borderRadius: theme.borderRadius.container,
      overflow: 'hidden',
    }}>
      <Img
        src={imageUrl}
        width="600"
        height={height}
        style={{
          width: '100%',
          height: `${height}px`,
          objectFit: 'cover',
          display: 'block',
        }}
      />
      {/* Overlay with text */}
      <div style={{
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        right: '0',
        background: `linear-gradient(transparent, rgba(0,0,0,${overlayOpacity}))`,
        padding: '40px 24px 24px 24px',
      }}>
        {title && (
          <ThemeText style={{
            margin: '0 0 4px 0',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#ffffff',
          }}>
            {title}
          </ThemeText>
        )}
        {subtitle && (
          <ThemeText style={{
            margin: 0,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.85)',
          }}>
            {subtitle}
          </ThemeText>
        )}
      </div>
    </Section>
  );
};
