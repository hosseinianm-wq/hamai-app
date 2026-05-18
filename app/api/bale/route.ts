import { NextRequest, NextResponse } from 'next/server';
import { sendToBale } from '@/lib/bale/sendToBale';
import { askHamAIBale } from '@/lib/bale/askHamAI.bale';
import { normalizeBaleMessage } from '@/lib/bale/normalizeMessage';
import { getBaleMemory, saveBaleMemory } from '@/lib/bale/memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const normalized = normalizeBaleMessage(body);

    if (!normalized) return NextResponse.json({ ok: true });

    const { chatId, messages } = normalized;
    const history = getBaleMemory(chatId);
    const fullMessages = [...history, ...messages];

    const reply = await askHamAIBale(fullMessages);

    const updatedHistory = [...fullMessages, { role: 'assistant' as const, content: reply }];
    type Message = {
  role: "user" | "assistant" | "system";
  content: any;
};

const mergedHistory: Message[] = [
  ...fullMessages.map((m) => ({
    role: m.role as Message["role"],
    content: m.content,
  })),
  { role: "assistant", content: reply },
];

saveBaleMemory(chatId, mergedHistory);


saveBaleMemory(chatId, mergedHistory);


    await sendToBale(chatId, reply);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Bale error:', err);
    return NextResponse.json({ ok: true });
  }
}
