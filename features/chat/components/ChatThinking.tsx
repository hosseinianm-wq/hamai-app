export function ChatThinking() {
  return (
    <div style={styles.row}>
      <div style={styles.bubble}>
        <span style={styles.dot}></span>
        <span style={styles.dot}></span>
        <span style={styles.dot}></span>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: 4
  },
  bubble: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "12px 16px",
    borderRadius: 18,
    display: "flex",
    gap: 6,
    backdropFilter: "blur(14px)",
  },
  dot: {
    width: 6,
    height: 6,
    background: "#666",
    borderRadius: "50%",
    animation: "blink 1s infinite"
  }
};
