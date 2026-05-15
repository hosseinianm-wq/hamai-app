export async function askGroq(message: string) {
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
            role: "user",
            content: message,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Groq API failed");
  }

  const data = await response.json();

  return (
    data.choices?.[0]?.message?.content ||
    "پاسخی دریافت نشد"
  );
}
