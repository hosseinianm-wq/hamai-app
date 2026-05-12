// features/voice/engines/aiStreamEngine.ts

import voiceEvents from "@features/voice/events/voiceEvents";

class AIStreamEngine {

  constructor() {

    voiceEvents.on("STT_RESULT", async (text) => {

      console.log("[AI] received:", text);

      const tokens = text.split(" ");

      for (const token of tokens) {

        voiceEvents.emit("AI_TOKEN", token + " ");

        await new Promise((r) => setTimeout(r, 120));

      }

      voiceEvents.emit("AI_DONE", { duration: 200 });

    });

    console.log("[aiStreamEngine] initialized");

  }

}

const aiStreamEngine = new AIStreamEngine();

export default aiStreamEngine;
