// features/reader/readerService.ts

import { runReaderEngine } from "@/core/engines/reader.engine";

import { summarizeText } from "./summaryService";

export async function processReaderText(
  text: string
) {

  const summary = await summarizeText(
    text
  );

  const result = await runReaderEngine(
    summary
  );

  return {
    original: text,
    summary,
    speech: result.speechReady,
  };
}
