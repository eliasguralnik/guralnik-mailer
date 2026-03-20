import { mailer } from './src/engine/index';

// import { mailer } from 'guralnik-mailer';

// Das war's – mailer.config.json wird automatisch geladen
async function main() {
  await mailer.send("Welcome", "guralnikelias390@gmail.com", { name: "Max", locale: "de" });
}

main().catch(err => console.error("❌ Error:", err));
