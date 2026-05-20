// features/bale/messageHandler.ts

import { detectMessageType } from "./typeDetector";
import { extractContent } from "./contentExtractor";

import { processReaderText } from "@/features/reader/readerService";

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

  const result = await processReaderText(
    content
  );

  return {
    type,
    content,
    result,
  };
}
