// features/bale/responseRouter.ts

import { buildReaderReply }
from "./replyBuilder";

import { getStats }
from "@/features/analytics/statsMemory";

export async function routeResponse(
  payload: any
) {

  if (
    payload?.command?.name ===
    "stats"
  ) {

    const stats =
      await getStats();

    return {
      type: "text",
      reply: [
        "📊 HamAI Stats",
        "",
        `👥 Users: ${stats.totalUsers}`,
        `💬 Messages: ${stats.totalMessages}`,
        `🎤 Voice: ${stats.voiceRequests}`,
        `🔗 URLs: ${stats.urlRequests}`,
      ].join("\n"),
    };
  }

  const mode =
    payload?.mode || "text";

  if (mode === "voice") {

    return {
      type: "voice",
      reply:
        "🎤 حالت ویس هنوز کامل نشده.",
    };
  }

  return {
    type: "text",
    reply:
      buildReaderReply(
        payload.result
      ),
  };
}
