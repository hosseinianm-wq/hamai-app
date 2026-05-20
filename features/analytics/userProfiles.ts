// features/analytics/userProfiles.ts

import {
  kvGet,
  kvSet,
} from "@/lib/kv/kv";

export async function trackUserProfile(
  message: any
) {

  const chatId =
    message?.chat?.id;

  if (!chatId) {
    return;
  }

  const profileKey =
    `profile:${chatId}`;

  const existing =
    await kvGet(profileKey);

  const profile = {
    chatId,
    username:
      message?.from?.username ||
      null,

    firstName:
      message?.from?.first_name ||
      null,

    lastActivity:
      Date.now(),

    totalMessages:
      existing
        ? (
            JSON.parse(existing)
              .totalMessages || 0
          ) + 1
        : 1,
  };

  await kvSet(
    profileKey,
    JSON.stringify(profile)
  );

  console.log(
    "[PROFILE_TRACKED]",
    profile.chatId
  );
}
