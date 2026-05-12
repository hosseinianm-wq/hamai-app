import { VoiceEventBus } from "../../runtime/VoiceEventBus"
import { VoiceEvents } from "../../runtime/VoiceEvents"

export class MockSpeechEngine {

 constructor(private bus: VoiceEventBus) {

   this.bus.on(VoiceEvents.WAKE_DETECTED, () => {

     this.listen()

   })

 }

 listen() {

   console.log("[STT] listening...")

   setTimeout(() => {

     const text = "هوا امروز چطوره"

     console.log("[STT] result:", text)

     this.bus.emit(VoiceEvents.VOICE_TEXT, text)

   }, 1500)

 }

}
