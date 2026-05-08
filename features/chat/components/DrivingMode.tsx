"use client";

import { useState, useEffect } from "react";
import { X, Mic, Volume2, Pause, Play } from "lucide-react";
import { useDrivingMode } from "../hooks/useDrivingMode";

interface DrivingModeProps {
  onClose: () => void;
}

export function DrivingMode({ onClose }: DrivingModeProps) {
  const {
    isActive,
    start,
    stop,
    handleCommand,
    status,
    isSpeaking,
    currentChatIndex,
  } = useDrivingMode();

  const [isListening, setIsListening] = useState(false);

  // تشخیص گفتار
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند. لطفاً از Chrome استفاده کنید.");
      return;
    }

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleCommand(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // شروع خودکار وقتی کامپوننت لود شد
  useEffect(() => {
    if (!isActive) {
      start();
    }
  }, [isActive, start]);

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">HamAI Driving</div>
            <div className="text-emerald-400 text-sm flex items-center gap-1.5">
              ● در حال رانندگی
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            stop();
            onClose();
          }}
          className="p-3 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <div className="text-3xl font-semibold min-h-[120px] flex items-center justify-center leading-relaxed">
              {status}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="text-sm text-white/60 mb-8">
            چت {currentChatIndex + 1} از { /* تعداد کل چت‌ها */}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="flex gap-4">
          <button
            onClick={startVoiceRecognition}
            disabled={isListening}
            className="flex-1 bg-white text-black py-6 rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Mic size={28} />
            {isListening ? "در حال شنیدن..." : "صحبت کن"}
          </button>

          {isSpeaking && (
            <button
              onClick={() => window.speechSynthesis.cancel()}
              className="px-8 bg-red-600/90 hover:bg-red-600 py-6 rounded-3xl transition-all"
            >
              <Pause size={28} />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          دستورات: بعدی • تکرار • خلاصه • متوقف
        </p>
      </div>
    </div>
  );
}