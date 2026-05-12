"use client";

import { useCallback, useEffect, useRef } from "react";

export function useWakeWord(onWake: () => void) {
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "fa-IR";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text =
        event.results[event.results.length - 1][0].transcript;

      const normalized = text.toLowerCase();

      if (
        normalized.includes("هَم ای آی") ||
        normalized.includes("هم ای آی") ||
        normalized.includes("ham ai")
      ) {
        onWake();
      }
    };

    recognition.onerror = () => {
      recognition.stop();
      setTimeout(start, 1000); // auto-restart
    };

    recognition.onend = () => {
      if (isActiveRef.current) {
        setTimeout(start, 500);
      }
    };

    recognitionRef.current = recognition;
    isActiveRef.current = true;

    recognition.start();
  }, [onWake]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return { stop };
}