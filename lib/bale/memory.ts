type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const baleMemory = new Map<number, Message[]>();

export function getBaleMemory(chatId: number): Message[] {
  return baleMemory.get(chatId) || [];
}

export function saveBaleMemory(chatId: number, messages: Message[]) {
  baleMemory.set(chatId, messages.slice(-10));
}
