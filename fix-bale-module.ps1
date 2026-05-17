Write-Host "===== HAMAI BALE AUTO FIX ====="

# -------------------------------------------------
# Fix memoryStore.ts
# -------------------------------------------------

Write-Host "Fixing memoryStore..."

$memory = @"
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
"@

Set-Content features\messaging\bale\memoryStore.ts $memory

# -------------------------------------------------
# Fix baleService.ts
# -------------------------------------------------

Write-Host "Fixing baleService..."

$service = @"
import { BaleSendMessagePayload } from "./types"

const BALE_TOKEN = process.env.BALE_BOT_TOKEN
const BALE_API = "https://tapi.bale.ai/bot"

export async function sendBaleMessage(
  data: BaleSendMessagePayload
) {

  if (!BALE_TOKEN) {
    throw new Error("BALE_BOT_TOKEN not set")
  }

  const url = `${BALE_API}${BALE_TOKEN}/sendMessage`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: data.chat_id,
      text: data.text
    })
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(text)
  }

  return text
}
"@

Set-Content features\messaging\bale\baleService.ts $service

# -------------------------------------------------
# Fix driveCommand.ts
# -------------------------------------------------

Write-Host "Fixing driveCommand..."

$drive = @"
import { askHamAI } from "@/core/ai/hamaiClient"

export async function driveCommand(
  text: string
): Promise<string> {

  const cleanText = text
    .replace("/drive", "")
    .trim()

  if (!cleanText) {
    return "بعد از /drive پیام خود را بنویس."
  }

  const response = await askHamAI({
    message: cleanText,
    drivingMode: true,
    source: "bale"
  })

  return response
}
"@

Set-Content features\messaging\bale\commands\driveCommand.ts $drive

# -------------------------------------------------
# Fix types.ts
# -------------------------------------------------

Write-Host "Fixing types..."

$types = @"
export interface BaleMessage {
  chat_id: number
  text?: string
  from?: {
    id: number
  }
}

export interface BaleSendMessagePayload {
  chat_id: number
  text: string
}

export interface BaleWebhookBody {
  message?: {
    chat?: {
      id: number
    }
    from?: {
      id: number
    }
    text?: string
  }
}
"@

Set-Content features\messaging\bale\types.ts $types

# -------------------------------------------------
# Fix broken imports from src
# -------------------------------------------------

Write-Host "Fixing broken imports..."

Get-ChildItem -Recurse -Filter *.ts | ForEach-Object {

  (Get-Content $_.FullName) `
  -replace "src/core/ai/hamaiClient", "core/ai/hamaiClient" |
  Set-Content $_.FullName

}

# -------------------------------------------------
# Remove useless python file
# -------------------------------------------------

if (Test-Path features\messaging\bale\app.py) {
  Remove-Item features\messaging\bale\app.py
  Write-Host "Removed legacy app.py"
}

Write-Host "===== BALE MODULE FIX COMPLETE ====="
