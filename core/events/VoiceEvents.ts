import { EventEmitter } from "events"

export const voiceEvents = new EventEmitter()
voiceEvents.setMaxListeners(50)
