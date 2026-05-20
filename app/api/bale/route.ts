// app/api/bale/route.ts

import { NextRequest }
from "next/server";

import { sendToBale }
from "@/lib/bale/sendToBale";

export async function POST(
  req: NextRequest
) {

  const body =
    await req.json();

  const message =
    body?.message;

  await sendToBale(
    message.chat.id,
    "ROUTE_OK"
  );

  return Response.json({
    ok: true,
  });
}
