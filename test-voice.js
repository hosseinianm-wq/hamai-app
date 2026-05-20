// test-voice.js

import {
  sendVoiceMessage,
} from "./features/bale/voiceSender.js";

async function main() {

  const file =
    await sendVoiceMessage(
      "سلام. این تست صدای واقعی HamAI است."
    );

  console.log(
    "\n[VOICE_FILE]",
    file
  );
}

main();