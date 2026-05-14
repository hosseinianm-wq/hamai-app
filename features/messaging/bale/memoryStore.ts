// features/messaging/bale/memoryStore.ts

type Message = {
  role: "user" | "assistant"
  content: string
}

const memory = new Map<number, Message[]>()

export function addUserMessage(
  userId: number,
  content: string
) {

  const messages = memory.get(userId) || []

  messages.push({
    role: "user",
    content
  })

  memory.set(userId, messages)
}

export function addAssistantMessage(
  userId: number,
  content: string
) {

  const messages = memory.get(userId) || []

  messages.push({
    role: "assistant",
    content
  })

  memory.set(userId, messages)
}

export function getConversation(
  userId: number
): Message[] {

  return memory.get(userId) || []
}

export function clearConversation(
  userId: number
) {

  memory.delete(userId)
}
