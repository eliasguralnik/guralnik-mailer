// src/components/SocialBar.tsx
import React from 'react';
import { Section, Link } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';

interface SocialBarProps {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
}

// Unicode-basierte Social Icons (email-safe, kein Bild nötig)
const socialItems: { key: keyof SocialBarProps; label: string; icon: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: '📷' },
  { key: 'twitter', label: 'X', icon: '𝕏' },
  { key: 'facebook', label: 'Facebook', icon: '👤' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'website', label: 'Web', icon: '🌐' },
];

export const SocialBar = (props: SocialBarProps) => {
  const theme = useTheme();
  const activeItems = socialItems.filter(item => props[item.key]);

  if (activeItems.length === 0) return null;

  return (
    <Section style={{ textAlign: 'center', margin: '24px 0' }}>
      <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
        <tr>
          {activeItems.map((item, index) => (
            <td key={item.key} style={{ padding: '0 6px' }}>
              <Link
                href={props[item.key]!}
                style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  lineHeight: '40px',
                  textAlign: 'center',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
              >
                {item.icon}
              </Link>
            </td>
          ))}
        </tr>
      </table>
    </Section>
  );
};
