let isListening = false;

export function startWakeWord(onWake: () => void) {
  const SpeechRecognition =
    (window as any).webkitSpeechRecognition ||
    (window as any).SpeechRecognition;

  const rec = new SpeechRecognition();
  rec.lang = "fa-IR";
  rec.continuous = true;

  rec.onresult = (e: any) => {
    const text = e.results[e.results.length - 1][0].transcript;

    if (text.includes("هَم ای آی")) {
      onWake();
    }
  };

  rec.start();
  isListening = true;

  return () => rec.stop();
}