import voiceEvents from "../events/voiceEvents";
class AudioOutputEngine {

  constructor() {

    voiceEvents.on("SPEECH_CHUNK", (chunk) => {

      const text = new TextDecoder().decode(chunk);

      process.stdout.write(text);

    });

    voiceEvents.on("SPEECH_END", () => {

      console.log("\n[audioOutput] speech finished");

    });

    console.log("[audioOutputEngine] initialized");

  }

}

const audioOutputEngine = new AudioOutputEngine();

export default audioOutputEngine;
