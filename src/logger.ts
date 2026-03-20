import pino from "pino";
import { sendPushAlert } from "./push"; // 🔥 NEU: Unser Telegram-Sender

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: isDev ? "debug" : "silent",
  name: "guralnik-mailer", 
  redact: ['apiKey', 'senderEmail', 'to'],

  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { 
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname,name,module', 
        messageFormat: '\x1b[36m[{module}]\x1b[0m {msg}', 
        singleLine: true, 
      },
    },
  }),
});

// 🔥 NEU: Diese Funktion rufst du ab sofort bei echten Abstürzen auf
export const Alert = async (moduleName: string, msg: string, errorObj?: any) => {
  // 1. Normal in die Konsole loggen (mit deinem schönen roten FATAL-Tag)
  logger.fatal({ module: moduleName, error: errorObj }, msg);
  
  // 2. Sofort den Push an dein Handy abfeuern! 🚀
  await sendPushAlert(`[${moduleName}] ${msg}`);
};