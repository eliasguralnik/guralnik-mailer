#!/usr/bin/env node

import prompts from 'prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';

// ─── Subcommand: preview ───

async function runPreview(args: string[]) {
  let port = 4321;
  const portFlagIndex = args.findIndex((arg) => arg === '--port' || arg === '-p');
  if (portFlagIndex !== -1 && args[portFlagIndex + 1]) {
    const parsed = parseInt(args[portFlagIndex + 1], 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
      console.error(pc.red(`Invalid port: ${args[portFlagIndex + 1]}`));
      process.exit(1);
    }
    port = parsed;
  }
  const noOpen = args.includes('--no-open');

  const { startPreviewServer } = await import('./preview/server');
  await startPreviewServer({ port, openBrowser: !noOpen });
}

// ─── Setup Wizard ───

const onCancel = () => {
  console.log(pc.red('Setup canceled.'));
  process.exit(0);
};

async function promptProviderConfig(provider: string): Promise<Record<string, any>> {
  switch (provider) {
    case 'resend':
    case 'sendgrid': {
      const response = await prompts([
        {
          type: 'text',
          name: 'apiKey',
          message: 'Enter your API Key (or leave blank for later):',
        },
      ], { onCancel });
      return {
        apiKey: response.apiKey || (provider === 'resend' ? 're_your_api_key' : 'SG.your_api_key'),
      };
    }

    case 'smtp': {
      const response = await prompts([
        {
          type: 'text',
          name: 'host',
          message: 'Enter your SMTP host:',
          initial: 'smtp.example.com',
        },
        {
          type: 'number',
          name: 'port',
          message: 'Enter your SMTP port:',
          initial: 587,
        },
        {
          type: 'text',
          name: 'user',
          message: 'Enter your SMTP username:',
        },
        {
          type: 'password',
          name: 'pass',
          message: 'Enter your SMTP password (or leave blank for later):',
        },
      ], { onCancel });
      return {
        smtp: {
          host: response.host || 'smtp.example.com',
          port: response.port || 587,
          user: response.user || 'user',
          pass: response.pass || 'pass',
        },
      };
    }

    case 'ses': {
      const response = await prompts([
        {
          type: 'text',
          name: 'region',
          message: 'Which AWS region is your SES in? (e.g. eu-central-1):',
          initial: 'us-east-1',
        },
        {
          type: 'text',
          name: 'accessKeyId',
          message: 'Enter your AWS Access Key ID (leave blank to use the AWS default credential chain):',
        },
        {
          type: (prev: string) => (prev ? 'password' : null),
          name: 'secretAccessKey',
          message: 'Enter your AWS Secret Access Key:',
        },
      ], { onCancel });
      const config: Record<string, any> = { region: response.region || 'us-east-1' };
      if (response.accessKeyId) {
        config.accessKeyId = response.accessKeyId;
        config.secretAccessKey = response.secretAccessKey || '';
      }
      return config;
    }

    case 'mailgun': {
      const response = await prompts([
        {
          type: 'text',
          name: 'apiKey',
          message: 'Enter your Mailgun API Key (or leave blank for later):',
        },
        {
          type: 'text',
          name: 'domain',
          message: 'Enter your Mailgun sending domain (e.g. mg.example.com):',
          initial: 'mg.example.com',
        },
        {
          type: 'select',
          name: 'region',
          message: 'Which Mailgun region do you use?',
          choices: [
            { title: 'US (api.mailgun.net)', value: 'us' },
            { title: 'EU (api.eu.mailgun.net)', value: 'eu' },
          ],
        },
      ], { onCancel });
      return {
        apiKey: response.apiKey || 'key-your_api_key',
        domain: response.domain || 'mg.example.com',
        region: response.region || 'us',
      };
    }

    default:
      return {};
  }
}

async function runWizard() {
  console.log("");
  console.log(pc.bgCyan(pc.white(' ✉️  Guralnik Mailer Setup ')));
  console.log(pc.gray('Let\'s set up your zero-code email experience.'));
  console.log("");

  const { provider } = await prompts({
    type: 'select',
    name: 'provider',
    message: 'Which email provider do you use?',
    choices: [
      { title: 'Resend', value: 'resend' },
      { title: 'SendGrid', value: 'sendgrid' },
      { title: 'SMTP (Own Server)', value: 'smtp' },
      { title: 'AWS SES', value: 'ses' },
      { title: 'Mailgun', value: 'mailgun' },
    ],
  }, { onCancel });

  const providerConfig = await promptProviderConfig(provider);

  const response = await prompts([
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
  ], { onCancel });

  const configPath = path.join(process.cwd(), 'mailer.config.json');

  const configObj: any = {
    provider,
    ...providerConfig,
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

  console.log("\n" + pc.bgGreen(pc.black(' SUCCESS ')) + " Setup completed perfectly! 🎉");
  console.log(pc.gray(`Tip: Run ${pc.bold('npx guralnik-mailer preview')} to browse all templates in your browser.`) + "\n");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'preview') {
    await runPreview(args.slice(1));
    return;
  }

  if (command && command !== 'setup') {
    console.error(pc.red(`Unknown command: ${command}`));
    console.log(`\nUsage:\n  ${pc.bold('npx guralnik-mailer')}          Run the interactive setup wizard`);
    console.log(`  ${pc.bold('npx guralnik-mailer preview')}  Start the local template preview server (--port <n>, --no-open)`);
    process.exit(1);
  }

  await runWizard();
}

main().catch(err => {
  console.error(pc.red('Fatal Error:'), err);
  process.exit(1);
});
