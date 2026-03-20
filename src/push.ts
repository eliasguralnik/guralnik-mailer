// src/push.ts
export const sendPushAlert = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram Credentials fehlen in der .env");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🚨 *Guralnik Mailer Alert*\n\n${message}`,
        parse_mode: 'Markdown',
      }),
    });

    if (response.ok) {
      console.log("✅ Telegram Alert erfolgreich verschickt!");
    } else {
      console.error("❌ Fehler von Telegram:", await response.text());
    }
  } catch (error) {
    console.error("❌ Fehler beim Senden des Telegram Pushes:", error);
  }
};