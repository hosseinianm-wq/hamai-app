type EventName =
  | "WAKE"
  | "VOICE_TEXT"
  | "INTENT"
  | "AI_TOKEN"
  | "AI_DONE"
  | "SPEECH_CHUNK"
  | "SPEECH_START"
  | "SPEECH_END"
  | "CHAT_MESSAGE"
  | "INTERRUPT"
  | "MODE_CHANGED";

type Listener = (payload?: any) => void;

class VoiceEventBus {

  private listeners: Map<EventName, Set<Listener>> = new Map();

  on(event: EventName, fn: Listener) {

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(fn);

    return () => this.off(event, fn);
  }

  off(event: EventName, fn: Listener) {
    this.listeners.get(event)?.delete(fn);
  }

  emit(event: EventName, payload?: any) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }

}

console.log("[voiceEvents] singleton loaded")

const voiceEvents = new VoiceEventBus()

export default voiceEvents
export type { EventName }
