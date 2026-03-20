// test-medusa.ts
import { SmartMedusaAdapter } from './src/medusa';

// Hilfsfunktion für Pausen wegen Resend Rate-Limits
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function runMedusaSimulation() {
  console.log("🛸 Starte Medusa-Simulation (Mocking)...");

  // ---------------------------------------------------------
  // 🛒 SZENARIO 1: Ein neuer Kunde registriert sich
  // ---------------------------------------------------------
  const mockCustomerData = {
    email: "guralnikelias390@gmail.com", // Trag hier deine echte Email ein zum Testen!
    first_name: "Elias",
    last_name: "Guralnik",
    metadata: {
      locale: "he-IL" // Medusa speichert die Sprache oft hier
    }
  };

  console.log("\n--- Simuliere Event: customer.created ---");
  await SmartMedusaAdapter.handleEvent('customer.created', mockCustomerData);

  await delay(2000); // 2 Sekunden Pause

  // ---------------------------------------------------------
  // 📦 SZENARIO 2: Jemand kauft etwas im Shop ein
  // ---------------------------------------------------------
  const mockOrderData = {
    id: "order_01H...",
    display_id: "1042",
    email: "guralnikelias390@gmail.com",
    currency_code: "ils",
    total: 15000, // Medusa sendet Beträge in Cents (150.00 ₪)
    shipping_address: {
      first_name: "Elias"
    },
    customer: {
      metadata: { locale: "de-DE" } // Testen wir mal Deutsch für die Order
    }
  };

  console.log("\n--- Simuliere Event: order.placed ---");
  await SmartMedusaAdapter.handleEvent('order.placed', mockOrderData);
}

runMedusaSimulation().catch(console.error);