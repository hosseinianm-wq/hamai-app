import { askHamAI } from "@/core/ai/hamaiClient"

export async function driveCommand(
  text: string
): Promise<string> {

  const cleanText = text
    .replace("/drive", "")
    .trim()

  if (!cleanText) {
    return "بعد از /drive پیام خود را بنویس."
  }

  const response = await askHamAI([{ role: "user", content: cleanText }])

  return response
}


