"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
};

export function ChatComposer({
  value = "",
  onChange,
  onSend,
  loading,
}: Props) {
  return (
    <div style={styles.wrap}>
      <input
        style={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="پیام خود را بنویسید..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSend();
          }
        }}
      />

      <button
        style={styles.btn}
        disabled={!value.trim() || loading}
        onClick={onSend}
      >
        ارسال
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  input: {
    flex: 1,

    padding: "16px 20px",

    borderRadius: 22,

    border: "1px solid rgba(255,255,255,0.08)",

    background: "rgba(255,255,255,0.07)",

    backdropFilter: "blur(20px)",

    color: "#fff",

    outline: "none",

    direction: "rtl" as const,

    fontSize: 15,

    transition: "0.2s",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)",
  },

  btn: {
    padding: "15px 24px",

    borderRadius: 20,

    background:
      "linear-gradient(135deg,#2563eb,#60a5fa)",

    color: "#fff",

    border: "none",

    cursor: "pointer",

    fontWeight: 700,

    fontSize: 14,

    boxShadow:
      "0 12px 30px rgba(37,99,235,0.35)",

    transition: "0.2s",
  },
};