export type VoiceState =
 | "IDLE"
 | "WAKE_LISTEN"
 | "LISTENING"
 | "PROCESSING"
 | "SPEAKING"
 | "DRIVING"
 | "INTERRUPTED"
 | "ERROR"

export class VoiceStateMachine {

 private state: VoiceState = "IDLE"

 getState() {
   return this.state
 }

 setState(next: VoiceState) {

   if (this.state === next) return

   console.log("[STATE]", this.state, "→", next)

   this.state = next
 }

}
