import "./features/voice/engines/aiStreamEngine";
import "./features/voice/engines/ttsEngine";
import "./features/voice/engines/audioOutputEngine";

import voiceEvents from "./features/voice/events/voiceEvents";

console.log("------ HamAI Voice System Test ------");

setTimeout(() => {

  console.log("\n[user] هوا امروز چطوره؟\n");

  voiceEvents.emit("STT_RESULT", "امروز هوا خیلی خوب و آفتابی است");

}, 1000);
