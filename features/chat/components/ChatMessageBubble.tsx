import { ChatItem } from "../types/chat"

type Props = {
  item: ChatItem
}

export function ChatMessageBubble({ item }: Props) {

  return (
    <div className={item.role === "user" ? "user-bubble" : "assistant-bubble"}>
      {item.text}
    </div>
  )

}
