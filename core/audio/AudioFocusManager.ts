type AudioChannel =
 | "tts"
 | "music"
 | "notification"
 | "call"
 | "system"

type FocusRequest = {

 channel: AudioChannel
 priority: number

 onPause?: () => void
 onResume?: () => void
 onStop?: () => void

}

export class AudioFocusManager {

 private stack: FocusRequest[] = []

 request(req: FocusRequest) {

   const current = this.stack[this.stack.length - 1]

   if (!current) {

     this.stack.push(req)
     return true

   }

   if (req.priority > current.priority) {

     current.onPause?.()

     this.stack.push(req)

     return true
   }

   return false
 }

 release(channel: AudioChannel) {

   const index = this.stack.findIndex(f => f.channel === channel)

   if (index === -1) return

   const wasTop = index === this.stack.length - 1

   this.stack.splice(index, 1)

   if (wasTop) {

     const prev = this.stack[this.stack.length - 1]

     prev?.onResume?.()

   }

 }

}
