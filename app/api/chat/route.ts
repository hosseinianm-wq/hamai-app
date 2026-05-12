// app/api/chat/route.ts

import { NextRequest } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

// ================== PROMPTS ==================
const NORMAL_SYSTEM_PROMPT = `
تو HamAI هستی، یک دستیار هوشمند فارسی دقیق، مفید و دوستانه.
`.trim();

const DRIVING_SYSTEM_PROMPT = `
تو HamAI هستی، یک دستیار صوتی هوشمند فارسی برای حالت رانندگی.

**قوانین اصلی:**
- همیشه به فارسی صحبت کن، کوتاه، واضح و با لحن آرام و حرفه‌ای.
- حداکثر ۱۲-۱۵ کلمه در هر جمله.
- هرگز متن طولانی نگو.
- فقط اطلاعات مهم را بگو.

**رفتار صوتی:**
- وقتی چت جدیدی شروع می‌کنی بگو: "تلگرام - گروه خانواده - ۳ پیام جدید"
- سپس پیام‌ها را یکی یکی بخوان.
- بعد از هر پیام ۲-۳ ثانیه صبر کن.

**دستورات صوتی پشتیبانی‌شده:**
- "بعدی" یا "skip" → رد کن و برو بعدی
- "تکرار" → آخرین پیام را دوباره بخوان
- "خلاصه" → خلاصه کل چت را بگو
- "پاسخ بده" → پیشنهاد پاسخ کوتاه بده
- "متوقف" → خواندن را متوقف کن

همیشه ایمنی را اولویت بده.
`.trim();
// ============================================

function buildPayload(messages: any[], isDrivingMode: boolean = false) {
  const systemPrompt = isDrivingMode ? DRIVING_SYSTEM_PROMPT : NORMAL_SYSTEM_PROMPT;

  return {
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: isDrivingMode ? 0.3 : 0.7,
    max_tokens: isDrivingMode ? 300 : 800,
    stream: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, isDrivingMode = false } = body;

    if (!Array.isArray(messages)) {
      return Response.json({ error: "messages must be an array" }, { status: 400 });
    }

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildPayload(messages, isDrivingMode)),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "");
      console.error("Groq Error:", errorText);
      return Response.json({ error: "خطا در ارتباط با Groq" }, { status: response.status || 500 });
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
    return Response.json({ error: "خطای سرور رخ داد" }, { status: 500 });
  }
}