import voiceEvents from "../events/voiceEvents";

class TTSEngine {

  constructor() {

    voiceEvents.on("AI_TOKEN", (token) => {

      const chunk = new TextEncoder().encode(token);

      voiceEvents.emit("SPEECH_CHUNK", chunk);

    });

    voiceEvents.on("AI_DONE", () => {

      voiceEvents.emit("SPEECH_END", undefined);

    });

    console.log("[ttsEngine] initialized");

  }

}

const ttsEngine = new TTSEngine();

export default ttsEngine;
