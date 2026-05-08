export type ChatRole = "user" | "ai";

export interface ChatItem {
  role: ChatRole;
  text: string;
}
