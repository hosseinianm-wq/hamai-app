// features/voice/engines/speechRecognizer.ts
import voiceEvents from "../events/voiceEvents";
import interruptEngine from "./interruptEngine";

class SpeechRecognizer {
  private listening = false;

  start() {
    this.listening = true;
    console.log("SpeechRecognizer: listening...");
    // TODO: connect to real STT streaming
  }

  stop() {
    this.listening = false;
  }

  fakeResult(text: string) {
    if (!this.listening) return;
    if (interruptEngine.isActive()) return;

    voiceEvents.emit("VOICE_TEXT", text);
  }
}

const speechRecognizer = new SpeechRecognizer();
export default speechRecognizer;
