import { createServer } from "http"
const { Server } = require("socket.io")
import { voiceEvents } from "../../core/events/voiceEvents"

const httpServer = createServer()

export const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

httpServer.listen(3001, () => {
  console.log("[Socket] server started on 3001")
})

voiceEvents.on("AI_TOKEN", (token: string) => {
  io.emit("AI_TOKEN", token)
})

voiceEvents.on("STT_RESULT", (text: string) => {
  io.emit("USER_TEXT", text)
})
