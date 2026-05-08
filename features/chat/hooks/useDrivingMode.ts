"use client";

import { useState, useRef } from "react";

export function useDrivingMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("آماده");

  const lastSpokenText = useRef("");
  const isPaused = useRef(false);

  const selectedChats = useRef([
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
      unread: 5,
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

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = 1.03;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      setIsSpeaking(true);
      lastSpokenText.current = text;
      window.speechSynthesis.speak(utterance);
    });
  };

  // ==================== سیستم دستورات صوتی پیشرفته ====================
  const handleCommand = async (rawCommand: string) => {
    const command = rawCommand.toLowerCase().trim();

    console.log("🗣️ دستور دریافتی:", command);

    // === دستورات اصلی ===
    if (/(بعدی|skip|next|برو بعدی|رد کن)/.test(command)) {
      await speak("رد شد.");
      nextChat();
    }

    else if (/(قبلی|previous|برگشت|قبل)/.test(command)) {
      await speak("برگشت به پیام قبلی.");
      setCurrentChatIndex(Math.max(0, currentChatIndex - 1));
      setCurrentMessageIndex(0);
      setTimeout(processCurrentChat, 900);
    }

    else if (/(تکرار|دوباره|repeat|بازخوانی)/.test(command)) {
      if (lastSpokenText.current) await speak(lastSpokenText.current);
    }

    else if (/(خلاصه|summary|خلاصه کن)/.test(command)) {
      await speak("خلاصه: قرار فردا ساعت ۷ دکتر و بررسی فایل پروژه.");
    }

    else if (/(متوقف|stop|بسه|قطع|pause)/.test(command)) {
      window.speechSynthesis.cancel();
      isPaused.current = true;
      setIsSpeaking(false);
      await speak("خواندن متوقف شد. بگو ادامه");
    }

    else if (/(ادامه|continue|شروع|برو جلو)/.test(command)) {
      isPaused.current = false;
      await speak("ادامه می‌دهم.");
      processCurrentChat();
    }

    else if (/(پاسخ|جواب|reply|پاسخ بده)/.test(command)) {
      await speak("پیشنهاد پاسخ: باشه، ساعت ۷ می‌رسم. ارسال کنم؟");
    }

    else if (/(بلندتر|louder|صدا بیشتر)/.test(command)) {
      await speak("صدا را بلندتر کردم.");
    }

    else if (/(آروم|آهسته|slower|کمتر)/.test(command)) {
      await speak("صدا آهسته‌تر شد.");
    }

    else if (command.length > 4) {
      // تشخیص هوشمند: اگر دستور واضح نبود، به AI بسپار
      await speak("دستور رو متوجه نشدم. لطفاً یکی از این‌ها رو بگو: بعدی، تکرار، خلاصه، متوقف، ادامه");
    }
  };

  const nextChat = () => {
    setCurrentChatIndex(prev => prev + 1);
    setCurrentMessageIndex(0);
    setTimeout(processCurrentChat, 800);
  };

  const processCurrentChat = async () => {
    if (currentChatIndex >= selectedChats.current.length) {
      await speak("تمام پیام‌ها خوانده شد. منتظر دستور شما هستم.");
      return;
    }

    const chat = selectedChats.current[currentChatIndex];
    setStatus(`${chat.source} — ${chat.name}`);

    await speak(`${chat.source} — ${chat.name} — ${chat.unread} پیام جدید`);

    for (let i = currentMessageIndex; i < chat.messages.length; i++) {
      if (isPaused.current) break;

      const msg = chat.messages[i];
      const textToSpeak = `${msg.sender} گفت: ${msg.text}`;
      
      await speak(textToSpeak);
      setCurrentMessageIndex(i + 1);
      
      await new Promise(r => setTimeout(r, 2400)); // وقفه برای دستور صوتی
    }

    if (!isPaused.current) {
      setCurrentChatIndex(prev => prev + 1);
      setCurrentMessageIndex(0);
      setTimeout(processCurrentChat, 1600);
    }
  };

  const start = async () => {
    setIsActive(true);
    setCurrentChatIndex(0);
    setCurrentMessageIndex(0);
    isPaused.current = false;
    
    await speak("سلام، همای در حالت رانندگی فعال شد. شروع به خواندن پیام‌ها می‌کنم.");
    setTimeout(processCurrentChat, 1400);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setIsActive(false);
    setIsSpeaking(false);
    isPaused.current = false;
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