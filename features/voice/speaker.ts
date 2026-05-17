export function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fa-IR";
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
}
