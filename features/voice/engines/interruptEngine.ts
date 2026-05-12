// features/voice/engines/interruptEngine.ts
import voiceEvents from "@features/voice/events/voiceEvents";

class InterruptEngine {
  private active = false;

  interrupt() {
    this.active = true;
    voiceEvents.emit("INTERRUPT", undefined);
  }

  clear() {
    this.active = false;
  }

  isActive() {
    return this.active;
  }
}

const interruptEngine = new InterruptEngine();
export default interruptEngine;
