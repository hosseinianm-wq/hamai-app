import voiceEvents from "@voice/events/voiceEvents"
import interruptEngine from "./interruptEngine"

class SpeechBuffer {

  private buffer = ""

  constructor() {

    console.log("[SpeechBuffer] initialized")

    voiceEvents.on("AI_TOKEN", (token: string) => {

      console.log("[SpeechBuffer] token:", token)

      this.push(token)

    })

    voiceEvents.on("INTERRUPT", () => {

      console.log("[SpeechBuffer] interrupt")

      this.clear()

    })

  }

  push(token: string) {

    if (interruptEngine.isActive()) return

    this.buffer += token

    console.log("[BUFFER]", this.buffer)

    // flush if sentence finished OR buffer too long
    if (/[.!?؟]/.test(token) || this.buffer.length > 80) {
      this.flush()
    }

  }

  flush() {

    const chunk = this.buffer.trim()

    if (!chunk) return

    console.log("[SPEECH CHUNK]", chunk)

    voiceEvents.emit("SPEECH_CHUNK", chunk)

    this.buffer = ""

  }

  clear() {
    this.buffer = ""
  }

}

const speechBuffer = new SpeechBuffer()

export default speechBuffer
