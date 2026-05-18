import { askHamaiStream } from "@/core/ai/hamaiClient"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const aiStream = askHamaiStream(message)
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            controller.enqueue(encoder.encode(chunk))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })

  } catch (error: any) {
    console.error("Chat API error:", error)

    return new Response("Error", {
      status: 500,
    })
  }
}
