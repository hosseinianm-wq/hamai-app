export function startVoiceInput(onText: (t: string) => void) {
  const rec = new (window as any).SpeechRecognition();
  rec.lang = "fa-IR";
  rec.continuous = false;

  rec.onresult = (e: any) => {
    const text = e.results[0][0].transcript;
    onText(text);
  };

  rec.start();
}
