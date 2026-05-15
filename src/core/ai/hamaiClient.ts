type AskHamAIParams = {
  message: string
  userId?: number
  source?: string
  drivingMode?: boolean
  history?: {
    role: string
    content: string
  }[]
}

export async function askHamAI(
  params: AskHamAIParams
): Promise<string> {

  const {
    message,
    drivingMode,
    history = []
  } = params

  /*
   |--------------------------------------------------------------------------
   | Driving Mode
   |--------------------------------------------------------------------------
   */

  if (drivingMode) {

    return `🚗 حالت رانندگی فعال شد.

پیام دریافت شد:
${message}`
  }

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content:
                "You are HamAI, a smart Persian AI assistant for Bale messenger. Reply naturally in Persian.",
            },

            ...history,

            {
              role: "user",
              content: message,
            },
          ],

          temperature: 0.7,
        }),
      }
    )

    if (!response.ok) {

      console.error("Groq API Error:", await response.text())

      return "خطا در ارتباط با هوش مصنوعی."
    }

    const data = await response.json()

    return (
      data?.choices?.[0]?.message?.content ||
      "پاسخی دریافت نشد."
    )

  } catch (error) {

    console.error("askHamAI Error:", error)

    return "خطا در پردازش پیام."
  }
}
