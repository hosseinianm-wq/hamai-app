import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function groqProvider(messages: any[]) {
  const completion = await groq.chat.completions.create({
    model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
    messages
  })

  return completion.choices[0]?.message?.content || "No response"
}
