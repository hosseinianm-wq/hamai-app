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
    throw new Error(`Bale API error ${res.status}: ${text}`)
  }

  return text
}
