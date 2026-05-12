// features/voice/events/voiceEvents.ts
export interface EventPayloads {
  WAKE: { power: number };
  VOICE_TEXT: string;
  INTENT: { action: string; confidence: number };
  AI_TOKEN: string;
  AI_DONE: { duration: number };
  SPEECH_CHUNK: Uint8Array;
  SPEECH_START: void;
  SPEECH_END: void;
  CHAT_MESSAGE: { role: "user" | "assistant"; content: string };
  INTERRUPT: void;
  MODE_CHANGED: "voice" | "text" | "idle";
  STT_RESULT: string;
  TTS_STOP: void;
  AI_CANCEL: void;
  USER_SPEECH_START: void;
  CLEAR_BUFFER: void;
}

type EventName = keyof EventPayloads;
type Listener<K extends EventName> = (payload: EventPayloads[K]) => void;

class VoiceEventBus {
  // استفاده از Record برای جلوگیری از ارور generic
  private listeners: Record<string, Set<any>> = {};

  on<K extends EventName>(event: K, fn: Listener<K>) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(fn);
    return () => this.off(event, fn);
  }

  off<K extends EventName>(event: K, fn: Listener<K>) {
    this.listeners[event]?.delete(fn);
  }

  emit<K extends EventName>(event: K, payload?: EventPayloads[K]) {
    this.listeners[event]?.forEach((fn) => fn(payload));
  }
}

console.log("[voiceEvents] singleton loaded");
const voiceEvents = new VoiceEventBus();
export default voiceEvents;
export type { EventName };