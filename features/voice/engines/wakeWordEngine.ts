// features/voice/engines/wakeWordEngine.ts
import voiceEvents from "@features/voice/events/voiceEvents";
import interruptEngine from "./interruptEngine";

class WakeWordEngine {
  private enabled = false;

  start() {
    this.enabled = true;
    console.log("WakeWordEngine: started");
    // TODO: integrate Porcupine / Silero / custom model
  }

  stop() {
    this.enabled = false;
  }

  // test trigger
  fakeTrigger() {
    if (!this.enabled) return;
    interruptEngine.clear();
    voiceEvents.emit("WAKE", { power: 0.8 });
  }
}

const wakeWordEngine = new WakeWordEngine();
export default wakeWordEngine;
