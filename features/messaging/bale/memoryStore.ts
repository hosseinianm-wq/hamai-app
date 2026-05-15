// features/messaging/bale/memoryStore.ts

export type Message = {
  role: "user" | "assistant"
  content: string
}

const MAX_HISTORY = 20

const memory = new Map<string, Message[]>()

function trimMessages(messages: Message[]): Message[] {
  if (messages.length <= MAX_HISTORY) {
    return messages
  }

  return messages.slice(-MAX_HISTORY)
}

export function addUserMessage(
  sessionId: string,
  content: string
) {

  const messages = memory.get(sessionId) || []

  messages.push({
    role: "user",
    content
  })

  memory.set(
    sessionId,
    trimMessages(messages)
  )
}

export function addAssistantMessage(
  sessionId: string,
  content: string
) {

  const messages = memory.get(sessionId) || []

  messages.push({
    role: "assistant",
    content
  })

  memory.set(
    sessionId,
    trimMessages(messages)
  )
}

export function getConversation(
  sessionId: string
): Message[] {

  return memory.get(sessionId) || []
}

export function clearConversation(
  sessionId: string
) {

  memory.delete(sessionId)
}
