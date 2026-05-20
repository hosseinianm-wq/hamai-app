// features/reader/summaryService.ts

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function summarizeText(
  text: string
): Promise<string> {

  if (text.length < 400) {
    return text;
  }

  const response =
    await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "متن را کوتاه روان فارسی و حداکثر در ۳ جمله خلاصه کن. فقط نکات اصلی را بگو.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

  return (
    response.choices?.[0]?.message?.content ||
    text
  );
}
