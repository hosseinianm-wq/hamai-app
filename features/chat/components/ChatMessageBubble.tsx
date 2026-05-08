"use client";

import { ChatItem } from "../types/chat";

export function ChatMessageBubble({
  item,
}: {
  item: ChatItem;
}) {
  const isUser = item.role === "user";

  return (
    <div
      style={{
        ...styles.row,
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
      }}
    >
      <div
        style={
          isUser
            ? styles.userBubble
            : styles.aiBubble
        }
      >
        {item.text}
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    marginBottom: 18,
    width: "100%",
  },

  userBubble: {
    marginLeft: "auto",

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    padding: "16px 18px",

    borderRadius: 24,

    maxWidth: "78%",

    wordBreak: "break-word" as const,

    lineHeight: 1.9,

    color: "#fff",

    boxShadow:
      "0 10px 35px rgba(37,99,235,0.28)",
  },

  aiBubble: {
    marginRight: "auto",

    background:
      "rgba(255,255,255,0.06)",

    backdropFilter: "blur(18px)",

    border:
      "1px solid rgba(255,255,255,0.07)",

    padding: "16px 18px",

    borderRadius: 24,

    maxWidth: "78%",

    wordBreak: "break-word" as const,

    lineHeight: 1.9,

    color: "#f3f4f6",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.18)",
  },
};