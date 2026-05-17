// core/ai/hamaiClient.ts
export async function askHamAI(messages: any[]) {
console.log("API endpoint:", "https://openrouter.ai/api/v1/chat/completions")
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages,
      stream: false
    }),
  })

  const data = await res.json()

  return data.choices?.[0]?.message?.content ?? "No response"
}

// ساده برای پیام تکی
export async function askHamai(message: string): Promise<string> {
  return askHamAI([
    {
      role: "user",
      content: message,
    },
  ])
}


// نسخه streaming برای UI
export async function* askHamaiStream(message: string) {
  const response = await askHamai(message)

  const words = response.split(" ")

  for (const word of words) {
    yield word + " "
    await new Promise((r) => setTimeout(r, 20))
  }
}
