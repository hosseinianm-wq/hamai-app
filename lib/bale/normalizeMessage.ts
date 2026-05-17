export function normalizeBaleMessage(body: any) {
  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text;

  if (!chatId || !text) return null;

  return {
    chatId,
    messages: [
      { role: 'user', content: text }
    ]
  };
}
