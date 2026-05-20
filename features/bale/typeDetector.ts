export type MessageType =
  | "text"
  | "url"
  | "command"
  | "reply";

export function detectMessageType(message: any): MessageType {
  const text = message?.text?.trim() || "";

  if (message?.reply_to_message) {
    return "reply";
  }

  if (
    text.startsWith("http://") ||
    text.startsWith("https://")
  ) {
    return "url";
  }

  if (text.startsWith("/")) {
    return "command";
  }

  return "text";
}
