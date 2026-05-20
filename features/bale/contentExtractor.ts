import type { MessageType } from "./typeDetector";

export async function extractContent(
  message: any,
  type: MessageType
): Promise<string> {

  if (type === "reply") {
    return (
      message?.reply_to_message?.text?.trim() || ""
    );
  }

  if (type === "url") {
    return message?.text?.trim() || "";
  }

  return message?.text?.trim() || "";
}
