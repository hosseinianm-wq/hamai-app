export function prepareForSpeech(text: string): string {
  if (!text) return ""

  let processed = text

  // مکث طبیعی بعد از نقطه
  processed = processed.replace(/\./g, ". ")

  // مکث بعد از ویرگول فارسی
  processed = processed.replace(/،/g, "، ")

  return processed.trim()
}
