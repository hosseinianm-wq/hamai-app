"use client";

import { useState, useRef } from "react";

export type DrivingChat = {
  id: number;
  source: string;
  name: string;
  unread: number;
  messages: Array<{ sender: string; text: string }>;
};

export function useDrivingMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("آماده");

  const lastSpokenText = useRef("");

  const selectedChats = useRef<DrivingChat[]>([
    {
      id: 1,
      source: "تلگرام",
      name: "گروه خانواده",
      unread: 8,
      messages: [
        { sender: "مامان", text: "شام چی درست کنم امشب؟" },
        { sender: "بابا", text: "فردا ساعت ۷ قرار داریم پیش دکتر" },
      ]
    },
    {
      id: 2,
      source: "واتساپ",
      name: "همکاران",
      unread: 4,
      messages: [
        { sender: "علی", text: "فایل پروژه رو چک کردی؟" },
        { sender: "سارا", text: "جلسه فردا ساعت ۱۰ صبح" },
      ]
    },
  ]);

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.log("TTS:", text);
        lastSpokenText.current = text;
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // قطع صحبت قبلی

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      setIsSpeaking(true);
      lastSpokenText.current = text;
      window.speechSynthesis.speak(utterance);
    });
  };

  // ==================== بهبود یافته دستورات صوتی ====================
  const handleCommand = async (command: string) => {
    const lower = command.toLowerCase().trim();

    // --- دستورات اصلی ---
    if (["بعدی", "next", "skip", "برو بعدی"].some(k => lower.includes(k))) {
      await speak("رد شد.");
      nextChat();
    }

    else if (["قبلی", "previous", "قبل"].some(k => lower.includes(k))) {
      await speak("برگشت به قبلی.");
      setCurrentChatIndex(prev => Math.max(0, prev - 1));
      setCurrentMessageIndex(0);
      setTimeout(processCurrentChat, 800);
    }

    else if (["تکرار", "دوباره", "repeat"].some(k => lower.includes(k))) {
      if (lastSpokenText.current) {
        await speak(lastSpokenText.current);
      }
    }

    else if (["خلاصه", "summary"].some(k => lower.includes(k))) {
      await speak("خلاصه: قرار فردا ساعت ۷ پیش دکتر و بررسی فایل پروژه.");
    }

    else if (["متوقف", "stop", "بسه", "کافیه"].some(k => lower.includes(k))) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setStatus("متوقف شد. بگو ادامه یا شروع");
    }

    else if (["ادامه", "continue", "شروع"].some(k => lower.includes(k))) {
      processCurrentChat();
    }

    else if (["پاسخ", "جواب", "reply"].some(k => lower.includes(k))) {
      await speak("پیشنهاد پاسخ: باشه، ساعت ۷ می‌رسم.");
    }

    else if (["بلندتر", "louder"].some(k => lower.includes(k))) {
      // فعلاً فقط اطلاع‌رسانی
      await speak("صدای خواندن را بلندتر کردم.");
    }

    else if (["آروم", "آرومتر", "slower"].some(k => lower.includes(k))) {
      await speak("صدای خواندن آهسته‌تر شد.");
    }

    else {
      // تشخیص هوشمند اگر دستور واضح نبود
      if (lower.length > 3) {
        await speak("دستور را متوجه نشدم. بگو بعدی، تکرار، خلاصه یا متوقف.");
      }
    }
  };

  const nextChat = () => {
    setCurrentChatIndex(prev => prev + 1);
    setCurrentMessageIndex(0);
    setTimeout(processCurrentChat, 700);
  };

  const processCurrentChat = async () => {
    if (currentChatIndex >= selectedChats.current.length) {
      await speak("تمام پیام‌ها خوانده شد. حالت رانندگی فعال است.");
      return;
    }

    const chat = selectedChats.current[currentChatIndex];
    
    setStatus(`${chat.source} — ${chat.name}`);
    await speak(`${chat.source} — ${chat.name} — ${chat.unread} پیام جدید`);

    for (let i = currentMessageIndex; i < chat.messages.length; i++) {
      const msg = chat.messages[i];
      const textToSpeak = `${msg.sender} گفت: ${msg.text}`;
      
      await speak(textToSpeak);
      setCurrentMessageIndex(i + 1);
      
      // وقفه برای شنیدن دستور کاربر
      await new Promise(r => setTimeout(r, 2200));
    }

    // بعد از تمام پیام‌های چت فعلی
    setCurrentChatIndex(prev => prev + 1);
    setCurrentMessageIndex(0);
    setTimeout(processCurrentChat, 1500);
  };

  const start = async () => {
    setIsActive(true);
    setCurrentChatIndex(0);
    setCurrentMessageIndex(0);
    await speak("سلام، همای در حالت رانندگی فعال شد. شروع به خواندن پیام‌ها می‌کنم.");
    setTimeout(processCurrentChat, 1200);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsActive(false);
    setIsSpeaking(false);
  };

  return {
    isActive,
    start,
    stop,
    handleCommand,
    status,
    isSpeaking,
    currentChatIndex,
  };
}