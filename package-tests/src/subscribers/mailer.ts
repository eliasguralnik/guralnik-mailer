import { SmartMedusaAdapter } from "guralnik-mailer";

const adapter = new SmartMedusaAdapter();

export default async function mailerSubscriber({ data, eventName }: any) {
  await adapter.handleEvent(eventName, data);
}

export const config = {
  event: SmartMedusaAdapter.getSupportedEvents(),
  context: { subscriberId: "guralnik-mailer" }
};
