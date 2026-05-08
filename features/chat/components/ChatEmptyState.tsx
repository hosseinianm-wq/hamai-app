interface ChatEmptyStateProps {
  onDrivingClick: () => void;
}

export function ChatEmptyState({ onDrivingClick }: ChatEmptyStateProps) {
  return (
    <div style={styles.empty}>
      <div style={styles.text}>Start chatting with HamAI 👋</div>
      
      <button
        onClick={onDrivingClick}
        style={{
          marginTop: 32,
          padding: "16px 32px",
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        🚗 ورود به حالت رانندگی
      </button>
    </div>
  );
}

const styles = {
  empty: {
    opacity: 0.8,
    textAlign: "center" as const,
    marginTop: 140
  },
  text: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -1
  }
};