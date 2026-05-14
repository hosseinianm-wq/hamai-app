import { redis } from "../../../../lib/redis"
import { MemoryMessage } from "./memoryTypes"

const MAX_MESSAGES = 20

function getMemoryKey(userId: number) {
  return `memory:${userId}`
}

export async function getConversationHistory(
  userId: number
): Promise<MemoryMessage[]> {
  const data = await redis.get(getMemoryKey(userId))

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveMessage(
  userId: number,
  message: MemoryMessage
) {
  const history = await getConversationHistory(userId)

  history.push(message)

  const trimmed = history.slice(-MAX_MESSAGES)

  await redis.set(
    getMemoryKey(userId),
    JSON.stringify(trimmed)
  )
}

export async function clearConversation(
  userId: number
) {
  await redis.del(getMemoryKey(userId))
}
