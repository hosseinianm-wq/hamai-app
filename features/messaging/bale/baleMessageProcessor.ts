// features/messaging/bale/baleMessageProcessor.ts

import { BaleMessage } from "./types"

import { askHamAI } from "../../../core/ai/hamaiClient"

import {
  addUserMessage,
  addAssistantMessage,
  getConversation,
  clearConversation
} from "./memoryStore"

import { startCommand } from "./commands/startCommand"
import { helpCommand } from "./commands/helpCommand"
import { driveCommand } from "./commands/driveCommand"
import { resetCommand } from "./commands/resetCommand"

export async function processBaleMessage(
  msg: BaleMessage
): Promise<string> {

  if (!msg.text) {
    return "پیام خالی دریافت شد."
  }

  const text = msg.text.trim()

  const userId = msg.from?.id
  const chatId = msg.chat_id

  /*
   |--------------------------------------------------------------------------
   | Unique Session ID
   |--------------------------------------------------------------------------
   */

  const sessionId = `bale:${chatId}:${userId ?? "anonymous"}`

  /*
   |--------------------------------------------------------------------------
   | Commands
   |--------------------------------------------------------------------------
   */

  if (text === "/start") {
    return await startCommand()
  }

  if (text === "/help") {
    return await helpCommand()
  }

  if (text.startsWith("/drive")) {
    return await driveCommand(text)
  }

  if (text === "/reset") {

    clearConversation(sessionId)

    return await resetCommand()
  }

  /*
   |--------------------------------------------------------------------------
   | Get OLD History
   |--------------------------------------------------------------------------
   */

  const history = getConversation(sessionId)

  /*
   |--------------------------------------------------------------------------
   | AI Response
   |--------------------------------------------------------------------------
   */

  const response = await askHamAI([{ role: "user", content: text }])

  /*
   |--------------------------------------------------------------------------
   | Save NEW Messages
   |--------------------------------------------------------------------------
   */

  addUserMessage(sessionId, text)

  addAssistantMessage(sessionId, response)

  return response
}


