import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function routeIntent(input: string) {
  const res = await client.chat.completions.create({
    model: "meta-llama/llama-3.1-8b-instruct",
    messages: [
      {
        role: "system",
        content: `
تو یک AI Agent هستی.
اگر کار نیاز به انجام داشت، خروجی JSON بده:

{
  "type": "action",
  "tool": "snap | ticket | telegram | web",
  "params": {}
}

اگر فقط چت بود:
{
  "type": "chat",
  "response": "..."
}
        `,
      },
      { role: "user", content: input },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(res.choices[0].message.content!);
}
