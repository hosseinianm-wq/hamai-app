import { streamAI } from "./useStreamingAI";
export async function streamAIEngine({
  messages,
  onToken,
}: {
  messages: any[];
  onToken: (t: string) => void;
}) {
  let buffer = "";
  let last = Date.now();

  await streamAI({
    messages,

    onToken: (token: string) => {
      buffer += token;

      const now = Date.now();

      const shouldFlush =
        buffer.length > 40 ||
        now - last > 1200 ||
        token.includes(".") ||
        token.includes("؟") ||
        token.includes("!");

      if (shouldFlush) {
        onToken(buffer.trim());
        buffer = "";
        last = now;
      }
    },
  });

  if (buffer) onToken(buffer);
}
