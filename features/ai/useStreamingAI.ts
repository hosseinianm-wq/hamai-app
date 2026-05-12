export async function streamAI({
  messages,
  onToken,
}: {
  messages: any[];
  onToken: (text: string) => void;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages,
      stream: true,
    }),
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const jsonStr = line.replace("data:", "").trim();

      if (jsonStr === "[DONE]") return;

      try {
        const json = JSON.parse(jsonStr);
        const token = json.choices?.[0]?.delta?.content;

        if (token) {
          onToken(token);
        }
      } catch {}
    }
  }
}