// features/admin/adminCommands.ts

import { getStats }
from "@/features/analytics/statsMemory";

export async function handleAdminCommand(
  text: string
) {

  if (text !== "/stats") {
    return null;
  }

  const stats =
    await getStats();

  return [
    "📊 HamAI Stats",
    "",
    `👥 Users: ${stats.totalUsers}`,
    `💬 Messages: ${stats.totalMessages}`,
    `🎤 Voice: ${stats.voiceRequests}`,
    `🔗 URLs: ${stats.urlRequests}`,
  ].join("\n");
}
