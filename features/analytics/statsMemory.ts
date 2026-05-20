// features/analytics/statsMemory.ts

import {
  kvGet,
  kvSet,
} from "@/lib/kv/kv";

const STATS_KEY =
  "hamai-global-stats";

export async function getStats() {

  const raw =
    await kvGet(STATS_KEY);

  if (!raw) {

    return {
      totalMessages: 0,
      totalUsers: 0,
      voiceRequests: 0,
      urlRequests: 0,
    };
  }

  return JSON.parse(raw);
}

export async function trackStats(
  payload: {
    chatId: number;
    type: string;
  }
) {

  const stats =
    await getStats();

  stats.totalMessages++;

  if (
    payload.type === "voice"
  ) {
    stats.voiceRequests++;
  }

  if (
    payload.type === "url"
  ) {
    stats.urlRequests++;
  }

  const userKey =
    `user:${payload.chatId}`;

  const existingUser =
    await kvGet(userKey);

  if (!existingUser) {

    stats.totalUsers++;

    await kvSet(
      userKey,
      "1"
    );
  }

  await kvSet(
    STATS_KEY,
    JSON.stringify(stats)
  );
}
