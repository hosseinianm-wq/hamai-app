import { VoiceEventBus } from "./VoiceEventBus"
import { VoiceStateMachine } from "./VoiceStateMachine"
import { VoiceEvents } from "./VoiceEvents"

export class VoiceOrchestrator {

 constructor(
   private bus: VoiceEventBus,
   private state: VoiceStateMachine
 ) {}

 start() {

   this.bindEvents()

   this.state.setState("WAKE_LISTEN")

 }

 private bindEvents() {

   this.bus.on(VoiceEvents.WAKE_DETECTED, () => {

     this.state.setState("LISTENING")

   })

   this.bus.on(VoiceEvents.VOICE_TEXT, () => {

     this.state.setState("PROCESSING")

   })

   this.bus.on(VoiceEvents.SPEECH_START, () => {

     this.state.setState("SPEAKING")

   })

   this.bus.on(VoiceEvents.SPEECH_END, () => {

     this.state.setState("WAKE_LISTEN")

   })

 }

}
