import voiceEvents from "../events/voiceEvents";

export async function runOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const json = line.replace("data:", "").trim();

      if (json === "[DONE]") return;

      try {
        const parsed = JSON.parse(json);
        const token = parsed.choices?.[0]?.delta?.content;

        if (token) {
          console.log("[AI TOKEN]", token);
          voiceEvents.emit("AI_TOKEN", token);
        }
      } catch {}
    }
  }
}
