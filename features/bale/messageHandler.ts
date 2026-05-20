// features/bale/messageHandler.ts

import { detectMessageType } from "./typeDetector";
import { extractContent } from "./contentExtractor";

import { processReaderText } from "@/features/reader/readerService";
import { extractUrlContent } from "@/features/reader/urlReader";

export async function handleMessage(
  message: any
) {

  const type = detectMessageType(
    message
  );

  const content = await extractContent(
    message,
    type
  );

  if (!content) {

    return {
      type,
      content: "",
      result: {
        speech:
          "متنی برای خواندن پیدا نکردم.",
      },
    };
  }

  let finalText = content;

  if (type === "url") {

    finalText =
      await extractUrlContent(content);
  }

  const result = await processReaderText(
    finalText
  );

  return {
    type,
    content,
    result,
  };
}
