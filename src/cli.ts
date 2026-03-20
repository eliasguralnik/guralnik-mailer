#!/usr/bin/env node

import prompts from 'prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("");
  console.log(pc.bgCyan(pc.white(' ✉️  Guralnik Mailer Setup ')));
  console.log(pc.gray('Let\'s set up your zero-code email experience.'));
  console.log("");

  const response = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: 'Which email provider do you use?',
      choices: [
        { title: 'Resend', value: 'resend' },
        { title: 'SendGrid', value: 'sendgrid' },
        { title: 'SMTP (Own Server)', value: 'smtp' },
      ],
    },
    {
      type: 'text',
      name: 'apiKey',
      message: (prev) => prev === 'smtp' ? 'Enter SMTP Connection URI (or leave blank for later):' : 'Enter your API Key (or leave blank for later):',
    },
    {
      type: 'text',
      name: 'brandName',
      message: 'What is the name of your brand?',
      initial: 'My Store'
    },
    {
      type: 'text',
      name: 'fromEmail',
      message: 'From what email address should emails be sent?',
      initial: prev => `${prev} <hello@example.com>`
    },
    {
      type: 'text',
      name: 'storeUrl',
      message: 'What is the URL of your store?',
      initial: 'https://example.com'
    },
    {
      type: 'select',
      name: 'designType',
      message: 'Which design theme do you want to use?',
      choices: [
        { title: 'Modern (Clean & Rounded)', value: 'modern' },
        { title: 'Minimal (Pure Whitespace)', value: 'minimal' },
        { title: 'Elegant (Sophisticated)', value: 'elegant' },
        { title: 'Midnight (Dark Mode)', value: 'midnight' },
        { title: 'Monochrome (Black & White)', value: 'monochrome' },
        { title: 'Nature (Earthy & Soft)', value: 'nature' },
        { title: 'Playful (Vibrant)', value: 'playful' },
        { title: 'Futuristic (Cyber)', value: 'futuristic' },
        { title: 'Bold (High Contrast)', value: 'bold' },
        { title: 'Classic (Traditional)', value: 'classic' },
      ]
    },
    {
      type: 'confirm',
      name: 'isMedusa',
      message: 'Are you using Medusa JS?',
      initial: false
    }
  ], {
    onCancel: () => {
      console.log(pc.red('Setup canceled.'));
      process.exit(0);
    }
  });

  const configPath = path.join(process.cwd(), 'mailer.config.json');

  const configObj: any = {
    provider: response.provider,
    apiKey: response.apiKey || (response.provider === 'resend' ? 're_your_api_key' : 'SG.your_api_key'),
    from: response.fromEmail,
    storeUrl: response.storeUrl,
    defaultLanguage: "en",
    theme: {
      designType: response.designType,
      brandName: response.brandName,
      colors: {
        primary: "#000000",
        background: "#F9FAFB",
        text: "#111827"
      },
      company: {
        name: response.brandName,
        addressLine1: "123 Commerce St",
        contactEmail: "support@example.com"
      },
      socials: {}
    }
  };

  if (response.provider === 'smtp') {
    delete configObj.apiKey;
    configObj.smtp = {
      host: response.apiKey || "smtp.example.com",
      port: 587,
      user: "user",
      pass: "pass"
    };
  }

  // Write mailer.config.json
  fs.writeFileSync(configPath, JSON.stringify(configObj, null, 2));
  console.log("\n" + pc.green('✔') + ` Created ${pc.bold('mailer.config.json')} in your project root.`);

  // Handle Medusa Subscriber
  if (response.isMedusa) {
    const isMedusaV2 = fs.existsSync(path.join(process.cwd(), 'medusa-config.ts'));
    let subDir = path.join(process.cwd(), 'src', 'subscribers');
    
    // Create dir if needed
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    const subPath = path.join(subDir, 'mailer.ts');
    
    const subscriberContent = `import { SmartMedusaAdapter } from "guralnik-mailer";

const adapter = new SmartMedusaAdapter();

export default async function mailerSubscriber({ data, eventName }: any) {
  await adapter.handleEvent(eventName, data);
}

export const config = {
  event: SmartMedusaAdapter.getSupportedEvents(),
  context: { subscriberId: "guralnik-mailer" }
};
`;

    fs.writeFileSync(subPath, subscriberContent);
    console.log(pc.green('✔') + ` Created Medusa subscriber at ${pc.bold('src/subscribers/mailer.ts')}`);
    console.log(pc.blue('ℹ') + ` Zero-Code integration is now active. Medusa events will automatically trigger emails!`);
  }

  // Auto-install the package
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgContent = fs.readFileSync(pkgJsonPath, 'utf-8');
    if (!pkgContent.includes('"guralnik-mailer"')) {
      console.log("\n" + pc.cyan('📦') + " Installing " + pc.bold('guralnik-mailer') + " into your project...");
      try {
        const { execSync } = require('child_process');
        execSync('npm install guralnik-mailer', { stdio: 'inherit' });
        console.log(pc.green('✔') + " Successfully installed guralnik-mailer!");
      } catch (err) {
        console.log(pc.yellow('⚠') + " Could not auto-install. Please run `npm install guralnik-mailer` manually.");
      }
    }
  }

  console.log("\n" + pc.bgGreen(pc.black(' SUCCESS ')) + " Setup completed perfectly! 🎉\n");
}

main().catch(err => {
  console.error(pc.red('Fatal Error during setup:'), err);
  process.exit(1);
});
