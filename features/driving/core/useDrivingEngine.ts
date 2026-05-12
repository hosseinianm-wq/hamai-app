"use client";

import { useCallback, useRef, useState } from "react";

type EngineState =
  | "idle"
  | "loading"
  | "listening"
  | "speaking"
  | "paused"
  | "interrupted";

export function useDrivingEngine() {
  const [state, setState] = useState<EngineState>("idle");

  const queueRef = useRef<string[]>([]);
  const isRunningRef = useRef(false);
  const interruptRef = useRef(false);

  // ======================
  // PUSH EVENT
  // ======================
  const push = useCallback((text: string) => {
    queueRef.current.push(text);
  }, []);

  // ======================
  // INTERRUPT (V5 CORE)
  // ======================
  const interrupt = useCallback(() => {
    interruptRef.current = true;
    window.speechSynthesis.cancel();
    setState("interrupted");
  }, []);

  // ======================
  // RUN LOOP
  // ======================
  const run = useCallback(async () => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    setState("speaking");

    try {
      while (queueRef.current.length > 0) {
        if (interruptRef.current) break;

        const text = queueRef.current.shift();
        if (!text) continue;

        await new Promise<void>((resolve) => {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = "fa-IR";

          u.onend = () => resolve();
          window.speechSynthesis.speak(u);
        });
      }

      setState("idle");
    } finally {
      isRunningRef.current = false;
      interruptRef.current = false;
    }
  }, []);

  return {
    state,
    push,
    run,
    interrupt,
    isRunning: state === "speaking",
  };
}