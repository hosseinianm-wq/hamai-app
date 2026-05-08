"use client";

export function ChatTypingBubble({ text }: { text: string }) {
  return (
    <div style={styles.row}>
      <div style={styles.bubble}>
        {text}
        <span style={styles.cursor}>|</span>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  bubble: {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "12px 16px",
  borderRadius: 18,
  maxWidth: "75%",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word" as const,
  backdropFilter: "blur(14px)",
},
  cursor: {
    marginLeft: 4,
    opacity: 0.7,
    animation: "blink 1s infinite",
  },
};