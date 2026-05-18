import voiceEvents from "../events/voiceEvents";


voiceEvents.on("STT_RESULT", async (text: string) => {
  console.log("[AI] received:", text)

  const reply = "کدوم شهر؟"

  for (const char of reply) {
    voiceEvents.emit("AI_TOKEN", char)
  }

voiceEvents.emit("AI_DONE", { duration: 0 });
})
