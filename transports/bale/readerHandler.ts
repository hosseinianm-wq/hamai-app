import { runReaderEngine } from "@/core/engines/reader.engine"

export async function handleReaderMessage(text: string) {
  if (!text) return "متنی برای خواندن ارسال نشده است."

  const result = await runReaderEngine(text)

  return result.speechReady
}
