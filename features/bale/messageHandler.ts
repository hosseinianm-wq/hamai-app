// features/bale/messageHandler.ts

import { resolveCommand } from "@/features/commands/commandBus";

import { detectMessageType }
from "./typeDetector";

import { extractContent }
from "./contentExtractor";

import {
  getUserMode,
  setUserMode,
  clearUserMode,
} from "@/lib/bale/memory";

import { processReaderText }
from "@/features/reader/readerService";

import { extractUrlContent }
from "@/features/reader/urlReader";

import { trackUser }
from "@/features/analytics/trackUser";

export async function handleMessage(
  message: any
) {

  const chatId =
    message?.chat?.id;

  const type =
    detectMessageType(message);

  const command =
    resolveCommand(
      message?.text || ""
    );;
    if (command) {

  return {
    command,
    type: "command",
    content:
      message?.text || "",
  };
}

  await trackUser(
    message,
    type
  );

  const content =
    await extractContent(
      message,
      type
    );

  if (!content && type !== "voice") {

    return {
      type,
      content: "",
      result: {
        speech:
          "متنی پیدا نکردم.",
      },
    };
  }

  if (type === "voice") {

    setUserMode(
      chatId,
      "voice"
    );

    return {
      type,
      content,
      result: {
        speech:
          "حالت ویس فعال شد. متن بعدی را بفرست.",
      },
    };
  }

  let finalText = content;

  if (type === "url") {

    finalText =
      await extractUrlContent(
        content
      );
  }

  const result =
    await processReaderText(
      finalText
    );

  const mode =
    getUserMode(chatId);

  clearUserMode(chatId);

  return {
    command,
    type,
    content,
    mode,
    result,
  };
}
