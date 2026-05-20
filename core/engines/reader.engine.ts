import { cleanText } from "../ai/textCleaner"
import { prepareForSpeech } from "../../features/voice/speechPreprocessor"

export interface ReaderResult {
  original: string
  cleaned: string
  speechReady: string
}

export async function runReaderEngine(input: string): Promise<ReaderResult> {
  const cleaned = cleanText(input)
  const speechReady = prepareForSpeech(cleaned)

  return {
    original: input,
    cleaned,
    speechReady,
  }
}
