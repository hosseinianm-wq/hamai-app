// lib/bale/memory.ts

const userModes =
  new Map<number, string>();

export function setUserMode(
  chatId: number,
  mode: string
) {

  userModes.set(
    chatId,
    mode
  );
}

export function getUserMode(
  chatId: number
) {

  return (
    userModes.get(chatId) ||
    "text"
  );
}

export function clearUserMode(
  chatId: number
) {

  userModes.delete(chatId);
}
