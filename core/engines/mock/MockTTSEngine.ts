import { VoiceEventBus } from "../../runtime/VoiceEventBus"
import { VoiceEvents } from "../../runtime/VoiceEvents"

export class MockTTSEngine {

 constructor(private bus: VoiceEventBus) {

   this.bus.on(
     VoiceEvents.SPEECH_CHUNK,
     (chunk) => {

       this.speak(chunk)

     }
   )

 }

 async speak(text: string) {

   console.log("[TTS] start")

   this.bus.emit(VoiceEvents.SPEECH_START)

   console.log("[TTS CHUNK]", text)

   await new Promise(r => setTimeout(r, 1000))

   this.bus.emit(VoiceEvents.SPEECH_END)

 }

}
