import { NextRequest, NextResponse } from "next/server"

import {
  processBaleMessage,
  sendBaleMessage,
  BaleWebhookBody
} from "@/features/messaging/bale"

export async function POST(req: NextRequest) {

  try {

    const body: BaleWebhookBody = await req.json()

    const message = body?.message

    if (!message?.chat?.id || !message?.text) {
      return NextResponse.json({ ok: true })
    }

    const chat_id = message.chat.id
    const text = message.text
    const user_id = message.from?.id

    console.log("Bale message:", text)

    const reply = await processBaleMessage({
      chat_id,
      text,
    })

    await sendBaleMessage({
      chat_id,
      text: reply
    })

    return NextResponse.json({ ok: true })

  } catch (error) {

    console.error("Webhook error:", error)

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    )
  }
}
