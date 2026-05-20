// app/api/bale/route.ts

import { NextRequest } from "next/server";

import { handleMessage } from "@/features/bale/messageHandler";
import { buildReaderReply } from "@/features/bale/replyBuilder";

import { sendToBale } from "@/lib/bale/sendToBale";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const message = body?.message;

    if (!message) {
      return Response.json({
        ok: false,
      });
    }

    const result = await handleMessage(
      message
    );

    const reply = buildReaderReply(
      result.result
    );

    await sendToBale(
      message.chat.id,
      reply
    );

    return Response.json({
      ok: true,
    });

  } catch (error) {

    console.error(
      "[BALE_ROUTE_ERROR]",
      error
    );

    return Response.json(
      {
        ok: false,
      },
      {
        status: 500,
      }
    );
  }
}
