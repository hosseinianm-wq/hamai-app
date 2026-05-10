// features/voice/engines/interruptEngine.ts
import voiceEvents from "../events/voiceEvents";

class InterruptEngine {
  private active = false;

  interrupt() {
    this.active = true;
    voiceEvents.emit("INTERRUPT");
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
