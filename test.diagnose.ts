/* ================================
   HamAI Voice Debug Script
   ================================ */

import voiceEvents from "./features/voice/events/voiceEvents"
import { EventEmitter } from "events"

// ---------- 1. Runtime identity check ----------
console.log("instanceof EventEmitter:", voiceEvents instanceof EventEmitter)
console.log("constructor name:", voiceEvents.constructor.name)

// ---------- 2. Type-level sanity (forces TS to think) ----------
const _typeCheck: EventEmitter = voiceEvents
console.log("Type assignment OK")

// ---------- 3. Event round-trip ----------
voiceEvents.on("STT_RESULT", (payload) => {
  console.log("[EVENT RECEIVED]", payload)
})

voiceEvents.emit("STT_RESULT", "diagnostic test ✅")

// ---------- 4. Node environment check ----------
console.log("Node version:", process.version)
console.log("Platform:", process.platform)

// ---------- 5. Process.nextTick (Node-only API) ----------
process.nextTick(() => {
  console.log("process.nextTick works ✅")
})
