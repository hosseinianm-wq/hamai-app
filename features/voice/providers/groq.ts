import { voiceEvents } from "../../../core/events/voiceEvents";

const systemPrompt = {
  role: "system",
  content: `
تو HamAI هستی، یک دستیار صوتی فارسی.

قوانین مهم:
- پاسخ‌ها خیلی کوتاه باشند (حداکثر ۱ جمله)
- لحن کاملاً محاوره‌ای باشد
- طبیعی مثل یک انسان حرف بزن
- توضیح اضافی نده
- اگر سوال درباره هوا شد فقط بپرس: "کدوم شهر؟"
- هیچ وقت متن طولانی تولید نکن
`,
};

let controller: AbortController | null = null;

// گوش دادن برای cancel
voiceEvents.on("AI_CANCEL", () => {
  if (controller) {
    controller.abort();
    controller = null;
    console.log("[Groq] stream cancelled");
  }
});

export async function runGroq(prompt: string) {
  console.log("[Groq] request:", prompt);

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("[Groq ERROR] Missing GROQ_API_KEY");
    return;
  }

  controller = new AbortController();

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        stream: true,
        temperature: 0.7,
        messages: [
          systemPrompt,
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("[Groq ERROR]", err);
    return;
  }

  const reader = response.body?.getReader();

  if (!reader) {
    console.error("[Groq ERROR] No response body");
    return;
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = line.replace("data:", "").trim();

        if (!json || json === "[DONE]") continue;

        try {
          const parsed = JSON.parse(json);

          const token = parsed.choices?.[0]?.delta?.content;

          if (!token) continue;

          console.log("[AI TOKEN]", token);

          voiceEvents.emit("AI_TOKEN", token);
        } catch (err) {
          console.error("[Groq PARSE ERROR]", err);
        }
      }
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("[Groq] stream aborted");
    } else {
      console.error("[Groq STREAM ERROR]", err);
    }
  }
}
