// features/chat/lib/config/messaging.ts

export const MESSAGING_CONFIG = {
  bale: {
    enabled: true,
    botToken: process.env.BALE_BOT_TOKEN || "",
    baseUrl: "https://tapi.bale.ai",
    pollingInterval: 1600,     // میلی‌ثانیه
    maxRetries: 3,
    timeout: 5000,             // timeout برای درخواست‌ها
  },

  telegram: {
    enabled: false,
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    baseUrl: "https://api.telegram.org",
    pollingInterval: 1500,
    maxRetries: 3,
    timeout: 5000,
  },
} as const;

export type MessengerType = keyof typeof MESSAGING_CONFIG;
export type MessengerConfig = (typeof MESSAGING_CONFIG)[MessengerType];
