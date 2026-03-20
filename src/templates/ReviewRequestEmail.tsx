// src/templates/ReviewRequestEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { OrderLineItem } from '../components/OrderLineItem';

export interface ReviewRequestProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  socials?: { instagram?: string; twitter?: string; facebook?: string; website?: string };
  content: {
    subject: string;
    previewText?: string;
    greeting: string;
    body: string;
    itemsHeading?: string;
    button: string;
    buttonLink?: string;
    outroText?: string;
  };
  items?: Array<{
    image?: string;
    title: string;
    subtitle?: string;
    quantity: number;
    price: string;
  }>;
}

export const ReviewRequestEmail = ({ brandName, logoUrl, company, socials, content, items }: ReviewRequestProps) => (
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

      {items && items.length > 0 && (
        <Section style={{ margin: '24px 0' }}>
          {content.itemsHeading && (
            <ThemeHeading level="h3">{content.itemsHeading}</ThemeHeading>
          )}
          {items.map((item, index) => (
            <OrderLineItem
              key={index}
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              quantity={item.quantity}
              price={item.price}
            />
          ))}
        </Section>
      )}

      <ThemeSpacer size="small" />

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <ThemeButton href={content.buttonLink || '#'}>
          {content.button}
        </ThemeButton>
      </Section>

      {content.outroText && (
        <ThemeText variant="muted">{content.outroText}</ThemeText>
      )}
    </Section>
  </MasterLayout>
);
