"use client";
import { Car } from "lucide-react";

interface ChatHeaderProps {
  onDrivingClick: () => void;
}

export function ChatHeader({ onDrivingClick }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="chat-header-inner">
        <div>
          <div className="logo-text">HamAI</div>
          <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
            AI Assistant
          </div>
        </div>

        <button
          onClick={onDrivingClick}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl text-sm font-medium transition-colors"
        >
          <Car size={20} />
          حالت رانندگی
        </button>
      </div>
    </header>
  );
}