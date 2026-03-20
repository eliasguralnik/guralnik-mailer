// src/templates/OrderConfirmationEmail.tsx
import * as React from 'react';
import { Section } from '@react-email/components';
import { MasterLayout } from '../layouts/MasterLayout';
import { ThemeHeading, ThemeText } from '../components/ThemeTypography';
import { ThemeButton } from '../components/Button';
import { ThemeDivider } from '../components/ThemeDivider';
import { OrderLineItem } from '../components/OrderLineItem';
import { ReceiptTotals } from '../components/ReceiptTotals';
import { DataRow } from '../components/DataRow';
import { ThemeSpacer } from '../components/ThemeSpacer';
import { AddressBlock, AddressData } from '../components/AddressBlock';
import { ProgressTracker } from '../components/ProgressTracker';
import { AlertBox } from '../components/AlertBox';

export interface OrderConfirmationProps {
  brandName: string;
  logoUrl?: string;
  company?: { name: string; addressLine1: string; contactEmail: string };
  socials?: { instagram?: string; twitter?: string; facebook?: string; website?: string };
  content: {
    subject: string;
    previewText: string;
    headline: string;
    introText: string;
    orderIdLabel: string;
    dateLabel: string;
    itemsHeading?: string;
    shippingAddressTitle?: string;
    ctaText: string;
    ctaLink: string;
    outroText: string;
    quantityLabel?: string;
    totalsLabels?: {
      subtotal?: string;
      shipping?: string;
      tax?: string;
      total?: string;
    };
    progressSteps?: Array<{ label: string; completed: boolean; active?: boolean }>;
    paymentNote?: string;
  };
  orderId: string;
  orderDate?: string;
  items: Array<{
    image?: string;
    title: string;
    subtitle?: string;
    quantity: number;
    price: string;
  }>;
  totals: {
    subtotal: string;
    shipping: string;
    tax?: string;
    total: string;
  };
  shippingAddress?: AddressData;
}

export const OrderConfirmationEmail = ({ 
  brandName, logoUrl, company, socials, content, orderId, orderDate, items, totals, shippingAddress 
}: OrderConfirmationProps) => {
  return (
    <MasterLayout 
      previewText={content.previewText} 
      brandName={brandName}
      logoUrl={logoUrl}
      company={company}
      socials={socials}
    >
      <Section>
        <ThemeHeading level="h1">
          {content.headline}
        </ThemeHeading>

        <ThemeText>
          {content.introText}
        </ThemeText>

        {/* Progress Tracker */}
        {content.progressSteps && content.progressSteps.length > 0 && (
          <ProgressTracker steps={content.progressSteps} />
        )}

        {/* Order Meta */}
        <Section style={{ margin: '16px 0' }}>
          <DataRow label={content.orderIdLabel} value={orderId} />
          {orderDate && <DataRow label={content.dateLabel} value={orderDate} />}
        </Section>

        <ThemeDivider />

        {/* Product List */}
        <Section style={{ margin: '24px 0' }}>
          <ThemeHeading level="h2">{content.itemsHeading || 'Items'}</ThemeHeading>
          
          {items.map((item, index) => (
            <OrderLineItem
              key={index}
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              quantity={item.quantity}
              price={item.price}
              quantityLabel={content.quantityLabel}
            />
          ))}
        </Section>

        {/* Totals */}
        <ReceiptTotals 
          subtotal={totals.subtotal}
          shipping={totals.shipping}
          tax={totals.tax}
          total={totals.total}
          labels={content.totalsLabels}
        />

        {/* Shipping Address */}
        {shippingAddress && (
          <>
            <ThemeSpacer size="medium" />
            <AddressBlock 
              title={content.shippingAddressTitle || 'Shipping Address'} 
              address={shippingAddress} 
            />
          </>
        )}

        {/* Payment Note */}
        {content.paymentNote && (
          <AlertBox variant="info" title="Payment">
            {content.paymentNote}
          </AlertBox>
        )}

        <ThemeSpacer size="medium" />

        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <ThemeButton href={content.ctaLink}>
            {content.ctaText}
          </ThemeButton>
        </Section>

        <ThemeText variant="muted">
          {content.outroText}
        </ThemeText>
      </Section>
    </MasterLayout>
  );
};