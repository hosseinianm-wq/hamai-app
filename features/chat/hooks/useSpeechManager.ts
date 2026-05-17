"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface QueueItem {
  id: string;
  text: string;
}

export function useSpeechManager() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const queueRef = useRef<QueueItem[]>([]);
  const utteranceRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  const lastTextRef = useRef("");
  const processingRef = useRef(false);
  const cancelledRef = useRef(false);

  // =========================
  // PROCESS QUEUE
  // =========================
  const processQueue = useCallback(async () => {
    if (processingRef.current) return;

    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis unsupported");
      return;
    }

    const next = queueRef.current.shift();

    if (!next) {
      setIsSpeaking(false);
      return;
    }

    processingRef.current = true;
    cancelledRef.current = false;

    setIsSpeaking(true);

    lastTextRef.current = next.text;

    const utterance =
      new SpeechSynthesisUtterance(next.text);

    utteranceRef.current = utterance;

    utterance.lang = "fa-IR";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      processingRef.current = false;

      if (cancelledRef.current) return;

      processQueue();
    };

    utterance.onerror = () => {
      processingRef.current = false;

      processQueue();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // =========================
  // SPEAK
  // =========================
  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      queueRef.current.push({
        id: crypto.randomUUID(),
        text,
      });

      processQueue();
    },
    [processQueue]
  );

  // =========================
  // STOP
  // =========================
  const stop = useCallback(() => {
    cancelledRef.current = true;

    queueRef.current = [];

    processingRef.current = false;

    utteranceRef.current = null;

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
  }, []);

  // =========================
  // REPLAY
  // =========================
  const replay = useCallback(async () => {
    if (!lastTextRef.current) return;

    stop();

    await speak(lastTextRef.current);
  }, [speak, stop]);

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    speak,
    stop,
    replay,
    isSpeaking,
  };
}
