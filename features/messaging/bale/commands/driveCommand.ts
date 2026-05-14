// features/messaging/bale/commands/driveCommand.ts

import { askHamAI } from "../../../../src/core/ai/hamaiClient"

export async function driveCommand(
  text: string
): Promise<string> {

  const cleanText = text
    .replace("/drive", "")
    .trim()

  if (!cleanText) {
    return "بعد از /drive پیام خود را بنویس."
  }

  const response = await askHamAI({
    message: cleanText,
    drivingMode: true,
    source: "bale"
  })

  return response
}
