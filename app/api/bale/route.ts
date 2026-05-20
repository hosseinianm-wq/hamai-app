// app/api/bale/route.ts

import { NextRequest } from "next/server";

import { routeResponse } from "@/features/bale/responseRouter";

import { sendToBale } from "@/lib/bale/sendToBale";

export async function POST(
  req: NextRequest
) {

  const body =
    await req.json();

  const message =
    body?.message;

  const response =
    await routeResponse({
      command: {
        name: "stats",
      },
    });

  await sendToBale(
    message.chat.id,
    response.reply
  );

  return Response.json({
    ok: true,
  });
}
