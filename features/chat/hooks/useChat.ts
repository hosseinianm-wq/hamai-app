"use client";

import { useEffect, useRef, useState } from "react";

export type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typingText, setTypingText] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ================= SEND MESSAGE =================
  const sendMessage = async (userInput?: string) => {
    const messageToSend = (userInput ?? input).trim();
    if (!messageToSend || loading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: messageToSend },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTypingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text,
          })),
          isDrivingMode: false,
        }),
      });

      if (!res.ok) throw new Error("API Error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed?.choices?.[0]?.delta?.content;

            if (delta) {
              accumulatedText += delta;
              setTypingText(accumulatedText);
            }
          } catch {
            // ignore broken chunks
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: accumulatedText },
      ]);

      setTypingText("");
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "متأسفانه خطایی رخ داد. لطفاً دوباره امتحان کنید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  return {
    messages,
    input,
    setInput,
    typingText,
    loading,
    bottomRef,
    sendMessage,
  };
}