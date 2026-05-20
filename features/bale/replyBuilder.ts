// features/bale/replyBuilder.ts
export function buildReaderReply(
  result: any
): string {

  return [
    "📖 آماده خواندن:",
    "",
    result?.speech || "",
  ].join("\n");
}
