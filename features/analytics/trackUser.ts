// features/analytics/trackUser.ts

import { trackStats }
from "./statsMemory";

export async function trackUser(
  message: any,
  type: string
) {

  const chatId =
    message?.chat?.id;

  if (!chatId) {
    return;
  }

  await trackStats({
    chatId,
    type,
  });

  console.log(
    "[USER_TRACKED]",
    chatId,
    type
  );
}
