// core/ai/hamaiClient.ts

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function askHamAI(messages: any[]) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    console.error("Missing GROQ_API_KEY")
    return "Server misconfigured: GROQ_API_KEY not found"
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile", // مدل پیشنهادی Groq
      messages,
      stream: false,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Groq API error:", res.status, text)
    return `AI error: ${res.status}`
  }

  const data = await res.json()

  return (
    data.choices?.[0]?.message?.content ??
    "Groq returned no response"
  )
}

// Simple wrapper
export async function askHamai(message: string): Promise<string> {
  return askHamAI([
    {
      role: "user",
      content: message,
    },
  ])
}

// Fake streaming for UI animation
export async function* askHamaiStream(message: string) {
  const response = await askHamai(message)

  const words = response.split(" ")

  for (const word of words) {
    yield word + " "
    await new Promise((r) => setTimeout(r, 12))
  }
}
