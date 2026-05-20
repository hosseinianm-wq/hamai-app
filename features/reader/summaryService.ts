// features/reader/summaryService.ts

export async function summarizeText(
  text: string
): Promise<string> {

  if (text.length < 400) {
    return text;
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "متن را به کوتاهترین شکل ممکن خلاصه کن. بازنویسی نکن. فقط نکات اصلی را در حداکثر ۲ جمله فارسی بگو.", 
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  const data = await response.json();

  return (
    data?.choices?.[0]?.message?.content ||
    text
  );
}
