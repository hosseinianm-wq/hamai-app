import { voiceEvents } from "../../core/events/voiceEvents";

console.log("[InterruptEngine] ready");

voiceEvents.on("USER_SPEECH_START", () => {
  console.log("[Interrupt] user started speaking");

  // stop current speech
  voiceEvents.emit("TTS_STOP");

  // clear AI buffer
  voiceEvents.emit("CLEAR_BUFFER");

  // stop AI streaming
  voiceEvents.emit("AI_CANCEL");
});
