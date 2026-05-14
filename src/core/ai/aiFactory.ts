import { groqProvider } from "./providers/groqProvider"

export async function askAI(messages: any[]) {
  const provider = process.env.AI_PROVIDER

  switch (provider) {
    case "groq":
      return groqProvider(messages)

    default:
      throw new Error("Unknown AI provider")
  }
}
