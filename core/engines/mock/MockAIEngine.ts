import voiceEvents from "@voice/events/voiceEvents"

export class MockAIEngine {

  constructor() {

    voiceEvents.on("VOICE_TEXT", () => {
      this.stream()
    })

  }

  async stream() {

    console.log("[AI] streaming...")

    const tokens = [
      "امروز ",
      "هوا ",
      "آفتابی ",
      "است."
    ]

    for (const token of tokens) {

      await new Promise(r => setTimeout(r, 400))

      console.log("[AI TOKEN]", token)

      voiceEvents.emit("AI_TOKEN", token)

    }

    voiceEvents.emit("AI_DONE")

  }

}
