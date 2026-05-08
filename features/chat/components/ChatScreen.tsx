"use client";
import { useChat } from "../hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatTypingBubble } from "./ChatTypingBubble";
import { ChatThinking } from "./ChatThinking";
import { ChatEmptyState } from "./ChatEmptyState";
import { DrivingMode } from "./DrivingMode";   // ← اضافه شد
import { useState } from "react";

export function ChatScreen() {
  const {
    messages,
    input,
    setInput,
    typingText,
    loading,
    bottomRef,
    sendMessage,
  } = useChat();

  const [isDrivingMode, setIsDrivingMode] = useState(false);

  const openDrivingMode = () => setIsDrivingMode(true);
  const closeDrivingMode = () => setIsDrivingMode(false);

  return (
    <div className="chat-root">
      <div className="chat-shell">
        <ChatHeader onDrivingClick={openDrivingMode} />   {/* ← تغییر کرد */}

        <main className="chat-main">
          {messages.length === 0 && !isDrivingMode && <ChatEmptyState onDrivingClick={openDrivingMode} />}
          
          {messages.map((item, i) => (
            <ChatMessageBubble key={i} item={item} />
          ))}
          
          {typingText && <ChatTypingBubble text={typingText} />}
          {loading && !typingText && <ChatThinking />}
          <div ref={bottomRef} />
        </main>

        {!isDrivingMode && (
          <footer className="chat-footer">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSend={sendMessage}
              loading={loading}
            />
          </footer>
        )}

        {/* Driving Mode Overlay */}
        {isDrivingMode && <DrivingMode onClose={closeDrivingMode} />}
      </div>
    </div>
  );
}