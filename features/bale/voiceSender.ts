// features/bale/voiceSender.ts

import path from "path";

import { ttsSave }
from "edge-tts";

export async function sendVoiceMessage(
  text: string
) {

  const fileName =
    `voice-${Date.now()}.mp3`;

  const output =
    path.join(
      "temp",
      fileName
    );

  await ttsSave(
    text,
    output,
    {
      voice:
        "fa-IR-DilaraNeural",
      rate: "+0%",
      pitch: "+0Hz",
      volume: "+0%",
    }
  );

  console.log(
    "[VOICE_CREATED]",
    output
  );

  return output;
}
