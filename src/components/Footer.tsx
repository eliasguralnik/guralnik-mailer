// src/components/Footer.tsx
import * as React from 'react';
import { Section, Hr, Link } from '@react-email/components';
import { useTheme } from '../theme/ThemeProvider';
import { ThemeText } from './ThemeTypography';

interface FooterProps {
  brandName: string;
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
}

export const Footer = ({ brandName, company, socials }: FooterProps) => {
  const theme = useTheme();

  const linkStyle = {
    color: theme.colors.text.muted,
    textDecoration: 'underline',
    margin: '0 8px',
    fontSize: '12px',
  };

  return (
    <Section style={{ marginTop: '32px', paddingTop: '24px' }}>
      <Hr style={{ 
        borderColor: theme.name === 'minimal' ? 'transparent' : theme.colors.border, 
        borderWidth: theme.name === 'bold' ? '2px' : '1px' 
      }} />

      {socials && Object.keys(socials).length > 0 && (
        <Section style={{ textAlign: 'center', marginBottom: '16px', marginTop: '16px' }}>
          {socials.instagram && <Link href={socials.instagram} style={linkStyle}>Instagram</Link>}
          {socials.twitter && <Link href={socials.twitter} style={linkStyle}>X (Twitter)</Link>}
          {socials.facebook && <Link href={socials.facebook} style={linkStyle}>Facebook</Link>}
          {socials.website && <Link href={socials.website} style={linkStyle}>Website</Link>}
        </Section>
      )}

      {company && (
        <Section>
          <ThemeText variant="muted" style={{ fontSize: '12px', textAlign: 'center', margin: '4px 0', fontWeight: 'bold' }}>
            {company.name}
          </ThemeText>
          <ThemeText variant="muted" style={{ fontSize: '12px', textAlign: 'center', margin: '4px 0' }}>
            {company.addressLine1} {company.addressLine2 && `• ${company.addressLine2}`}
          </ThemeText>
          <ThemeText variant="muted" style={{ fontSize: '12px', textAlign: 'center', margin: '4px 0' }}>
            <Link href={`mailto:${company.contactEmail}`} style={{ color: theme.colors.text.muted, textDecoration: 'none' }}>
              {company.contactEmail}
            </Link>
          </ThemeText>
        </Section>
      )}

      <ThemeText variant="muted" style={{ fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </ThemeText>
    </Section>
  );
};