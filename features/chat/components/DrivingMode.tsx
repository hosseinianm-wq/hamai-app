"use client";

import { useEffect, useState } from "react";
import { X, Mic, Volume2, Pause, RefreshCw } from "lucide-react";
import { useDrivingMode } from "../hooks/useDrivingMode";

interface DrivingModeProps {
  onClose: () => void;
}

export function DrivingMode({ onClose }: DrivingModeProps) {
  const {
    start,
    stop,
    handleCommand,
    status,
    isSpeaking,
    currentChatIndex,
    isLoading,
    connectionStatus,
    state,
  } = useDrivingMode();

  const [isListening, setIsListening] = useState(false);

  const isActive = state !== "idle";

  // ======================
  // Voice Recognition
  // ======================
  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("مرورگر شما پشتیبانی نمی‌کند");
      return;
    }

    setIsListening(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "fa-IR";
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

  // ======================
  // Auto Start
  // ======================
  useEffect(() => {
    if (isActive) return;

    const t = setTimeout(() => {
      start();
    }, 0);

    return () => clearTimeout(t);
  }, [isActive, start]);

  const handleRefresh = () => {
    handleCommand("بروزرسانی");
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Volume2 className="text-white w-8 h-8" />
          <div>
            <div className="text-2xl text-white font-bold">HamAI</div>
            <div className="text-sm text-emerald-400">Driving Mode</div>
          </div>
        </div>

        <button onClick={() => { stop(); onClose(); }}>
          <X className="text-white" />
        </button>
      </div>

      {/* Status */}
      <div className="flex-1 flex items-center justify-center text-center">
        <div className="text-white text-3xl">
          {isLoading ? "در حال دریافت..." : status}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">

        <button
          onClick={startVoiceRecognition}
          disabled={isListening}
          className="w-full bg-cyan-500 text-black py-6 rounded-2xl font-bold flex justify-center gap-3"
        >
          <Mic />
          {isListening ? "در حال شنیدن..." : "صحبت کنید"}
        </button>

        <button
          onClick={handleRefresh}
          className="w-full bg-white/10 text-white py-4 rounded-2xl flex justify-center gap-3"
        >
          <RefreshCw />
          بروزرسانی
        </button>

        {isSpeaking && (
          <button
            onClick={handleStopSpeaking}
            className="w-full bg-red-600 text-white py-4 rounded-2xl flex justify-center gap-3"
          >
            <Pause />
            توقف صدا
          </button>
        )}
      </div>
    </div>
  );
}