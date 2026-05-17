export async function sendToBale(chatId: number, text: string) {
  const token = process.env.BALE_BOT_TOKEN;
  await fetch("https://tapi.bale.ai/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
