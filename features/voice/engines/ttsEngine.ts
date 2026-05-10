// features/voice/engines/ttsEngine.ts
import voiceEvents from "../events/voiceEvents";
import interruptEngine from "./interruptEngine";

class TTSEngine {
  private speaking = false;

  speak(text: string) {
    if (interruptEngine.isActive()) return;

    this.speaking = true;
    voiceEvents.emit("SPEECH_START", text);

    console.log("TTS:", text);

    setTimeout(() => {
      this.speaking = false;
      voiceEvents.emit("SPEECH_END");
    }, Math.max(400, text.length * 25));
  }

  stop() {
    this.speaking = false;
  }
}

const ttsEngine = new TTSEngine();
export default ttsEngine;
