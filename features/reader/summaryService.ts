// features/reader/summaryService.ts
import OpenAI from "openai";

export async function summarizeText(
  text: string
): Promise<string> {

  console.log(
    "[SUMMARY_INPUT]",
    text.length
  );

  if (text.length < 100) {

    console.log(
      "[SUMMARY_SKIPPED]"
    );

    return text;
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  console.log(
    "[SUMMARY_CALLING_GROQ]"
  );

  const response =
    await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "متن را کوتاه، روان، فارسی و حداکثر در ۳ جمله خلاصه کن. فقط نکات اصلی را بگو.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

  console.log(
    "[SUMMARY_DONE]"
  );

  return (
    response.choices?.[0]?.message?.content ||
    text
  );
}
