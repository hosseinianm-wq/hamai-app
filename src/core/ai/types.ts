export type AIMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export interface AIProvider {
  chat(messages: AIMessage[]): Promise<string>
}
