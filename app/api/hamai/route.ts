import voiceEvents from "@/features/voice/events/voiceEvents"

export async function POST(req: Request) {

  const body = await req.json()
  const text = body.text

  voiceEvents.emit("STT_RESULT", text)

  return Response.json({
    ok: true,
    input: text
  })
}
