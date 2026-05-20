import { runReaderEngine } from "@/core/engines/reader.engine";

export async function processReaderText(text: string) {

  const result = await runReaderEngine(text);

  return {
    original: text,
    speech: result.speechReady,
  };
}
