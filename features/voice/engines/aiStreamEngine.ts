// features/voice/engines/aiStreamEngine.ts
import voiceEvents from "../events/voiceEvents";
import interruptEngine from "./interruptEngine";

// pseudo request simulation
async function fakeStream(text: string, cb: (t: string) => void) {
  const tokens = text.split(" ");
  for (const t of tokens) {
    if (interruptEngine.isActive()) return;
    cb(t + " ");
    await new Promise(res => setTimeout(res, 120));
  }
}

class AIStreamEngine {
  streaming = false;

  async stream(text: string) {
    this.streaming = true;

    await fakeStream(text, (token) => {
      voiceEvents.emit("AI_TOKEN", token);
    });

    if (!interruptEngine.isActive()) {
      voiceEvents.emit("AI_DONE");
    }

    this.streaming = false;
  }

  cancel() {
    interruptEngine.interrupt();
  }
}

const aiStreamEngine = new AIStreamEngine();
export default aiStreamEngine;
