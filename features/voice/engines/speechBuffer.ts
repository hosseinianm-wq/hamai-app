import { voiceEvents } from "../../../core/events/voiceEvents";


let buffer = "";

console.log("[SpeechBuffer] initialized");

voiceEvents.on("AI_TOKEN", (token: string) => {
  buffer += token;

  // تمیز کردن فاصله‌ها
  buffer = buffer
    .replace(/\s+/g, " ")
    .replace(" ،", "،")
    .replace(" .", ".")
    .replace(" ؟", "؟");

  const sentenceRegex = /(.+?[.!؟])/g;

  let match;

  while ((match = sentenceRegex.exec(buffer)) !== null) {
    const sentence = match[1].trim();

    console.log("[SpeechBuffer] sentence:", sentence);

    voiceEvents.emit("TTS_SPEAK", sentence);
  }

  // حذف جمله‌های پردازش شده از buffer
  const lastMatch = buffer.match(/(.+?[.!؟])/g);

  if (lastMatch) {
    const lastSentence = lastMatch[lastMatch.length - 1];
    const index = buffer.lastIndexOf(lastSentence) + lastSentence.length;
    buffer = buffer.slice(index);
  }
});

// برای interrupt
voiceEvents.on("CLEAR_BUFFER", () => {
  buffer = "";
  console.log("[SpeechBuffer] cleared");
});

