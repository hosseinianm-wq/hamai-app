import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `
تو HamAI هستی، یک دستیار هوش مصنوعی فارسی‌زبان حرفه‌ای، دقیق و دوستانه.
همیشه فارسی جواب بده مگر اینکه کاربر زبان دیگری بخواهد.
`.trim();

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

function buildPayload(messages: any[], isDrivingMode?: boolean) {
  return {
    model: "meta-llama/llama-3.1-8b-instruct",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    temperature: isDrivingMode ? 0.3 : 0.7,
    max_tokens: 800,
    stream: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, isDrivingMode = false } = body;

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hamai.ir",
        "X-Title": "HamAI",
      },
      body: JSON.stringify(buildPayload(messages, isDrivingMode)),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "");
      console.error("OpenRouter Error:", errorText);

      return Response.json(
        { error: "خطا در ارتباط با مدل" },
        { status: response.status || 500 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat API Error:", error);

    return Response.json(
      { error: "خطای سرور رخ داد" },
      { status: 500 }
    );
  }
}