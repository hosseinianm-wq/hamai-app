import { VoiceEventBus } from "../../runtime/VoiceEventBus"
import { VoiceEvents } from "../../runtime/VoiceEvents"

export class MockWakeEngine {

 constructor(private bus: VoiceEventBus) {}

 start() {

   setTimeout(() => {

     console.log("[WAKE] detected")

     this.bus.emit(VoiceEvents.WAKE_DETECTED)

   }, 1000)

 }

}
