// features/voice/router/intentRouter.ts
import voiceEvents from "@features/voice/events/voiceEvents";

function detectIntent(text: string) {
  const t = text.toLowerCase();

  if (t.startsWith("send")) return "SEND_MESSAGE";
  if (t.includes("read") && t.includes("messages")) return "READ_MESSAGES";
  return "CHAT";
}

export function routeIntent(text: string) {
  const intent = detectIntent(text);
voiceEvents.emit("INTENT", { action: intent, confidence: 0.9 });
}
