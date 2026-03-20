// src/templates/BackInStockEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { ProductCard } from '../components/ProductCard';
import { AlertBox } from '../components/AlertBox';

export interface BackInStockProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  socials?: { instagram?: string; twitter?: string; facebook?: string; website?: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    urgencyNote?: string;
    button: string;
    buttonLink?: string;
    outroText?: string;
  };
  product?: {
    image?: string;
    title: string;
    subtitle?: string;
    price: string;
    originalPrice?: string;
  };
}

export const BackInStockEmail = ({ brandName, logoUrl, company, socials, content, product }: BackInStockProps) => (
  <MasterLayout 
    previewText={content.previewText || content.greeting} 
    brandName={brandName}
    logoUrl={logoUrl}
    company={company}
    socials={socials}
  >
    <Section>
      <ThemeHeading level="h1">
        {content.greeting}
      </ThemeHeading>

      <ThemeText>
        {content.body}
      </ThemeText>

      {product && (
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <ProductCard
            image={product.image}
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            originalPrice={product.originalPrice}
            badge="Back in Stock"
            buttonText={content.button}
            buttonLink={content.buttonLink}
          />
        </Section>
      )}

      {content.urgencyNote && (
        <AlertBox variant="warning">
          {content.urgencyNote}
        </AlertBox>
      )}

      {!product && (
        <>
          <ThemeSpacer size="small" />
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <ThemeButton href={content.buttonLink || '#'}>
              {content.button}
            </ThemeButton>
          </Section>
        </>
      )}

      {content.outroText && (
        <ThemeText variant="muted">{content.outroText}</ThemeText>
      )}
    </Section>
  </MasterLayout>
);
