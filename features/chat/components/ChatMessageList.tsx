"use client";

import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatThinking } from "./ChatThinking";
import { ChatItem } from "../types/chat";

export function ChatMessageList({
  messages,
  loading,
}: {
  messages?: ChatItem[];
  loading: boolean;
}) {
  return (
    <>
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((item, i) => (
          <ChatMessageBubble key={i} item={item} />
        ))
      ) : (
        <p>هیچ پیامی وجود ندارد.</p>
      )}

      {loading && <ChatThinking />}
    </>
  );
}