// features/messaging/bale/baleMessageProcessor.ts

import { BaleMessage } from "./types"

import { askHamAI } from "../../../src/core/ai/hamaiClient"


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

  const userId = msg.from?.id || msg.chat_id

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

    clearConversation(userId)

    return await resetCommand()
  }

  /*
   |--------------------------------------------------------------------------
   | Get OLD History
   |--------------------------------------------------------------------------
   */

  const history = getConversation(userId)

  /*
   |--------------------------------------------------------------------------
   | AI Response
   |--------------------------------------------------------------------------
   */

  const response = await askHamAI({
    message: text,
    userId,
    source: "bale",
    history
  })

  /*
   |--------------------------------------------------------------------------
   | Save NEW Messages
   |--------------------------------------------------------------------------
   */

  addUserMessage(userId, text)

  addAssistantMessage(userId, response)

  return response
}
