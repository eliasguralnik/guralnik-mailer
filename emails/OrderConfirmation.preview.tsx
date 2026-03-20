// emails/OrderConfirmation.preview.tsx
import * as React from 'react';
import { OrderConfirmationEmail } from '../src/templates/OrderConfirmationEmail';
import { themes } from '../src/theme/profiles';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const mockContent = {
  subject: "Deine Bestellung bei Ceramicis",
  previewText: "Wir haben deine Bestellung erhalten!",
  headline: "Vielen Dank für deine Bestellung!",
  introText: "Wir bereiten deine handgemachten Stücke gerade für den Versand vor und melden uns, sobald das Paket auf dem Weg ist.",
  orderIdLabel: "Bestellnummer",
  dateLabel: "Bestelldatum",
  itemsHeading: "Deine Artikel",
  quantityLabel: "Anzahl",
  totalsLabels: {
    subtotal: "Zwischensumme",
    shipping: "Versandkosten",
    tax: "Inkl. MwSt.",
    total: "Gesamtbetrag",
  },
  ctaText: "Bestellung ansehen",
  ctaLink: "https://ceramicis.com/orders/123",
  outroText: "Falls du Fragen hast, antworte einfach auf diese E-Mail.",
};

const mockItems = [
  {
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&q=80", 
    title: "Handgemachter Becher",
    subtitle: "Farbe: Sandbeige",
    quantity: 2,
    price: "80.00 ₪"
  },
  {
    image: "https://images.unsplash.com/photo-1590204128543-c6460e5ba6ea?w=150&q=80", 
    title: "Minimalistischer Teller",
    subtitle: "Größe: 24cm",
    quantity: 1,
    price: "55.00 ₪"
  }
];

const mockTotals = {
  subtotal: "135.00 ₪",
  shipping: "15.00 ₪",
  tax: "0.00 ₪", 
  total: "150.00 ₪"
};

export default function Preview() {
  return (
    <ThemeProvider theme={themes.modern}>
      <OrderConfirmationEmail
        brandName="Ceramicis"
        logoUrl={undefined}
        company={{
          name: 'Ceramicis Studio',
          addressLine1: 'Tiberias, Israel',
          contactEmail: 'hello@ceramicis.com'
        }}
        socials={{ instagram: 'https://instagram.com/ceramicis' }}
        content={mockContent}
        orderId="ORD-1042"
        orderDate="20.03.2026"
        items={mockItems}
        totals={mockTotals}
      />
    </ThemeProvider>
  );
}