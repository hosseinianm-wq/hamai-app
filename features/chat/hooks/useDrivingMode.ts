"use client";

import { sendBaleMessage } from "../../messaging/bale/baleService";
export async function getUpdates(offset = 0) {
  const token = process.env.NEXT_PUBLIC_BALE_TOKEN;

  const url =
    `https://tapi.bale.ai/bot${token}/getUpdates?offset=${offset}`;

  const res = await fetch(url);

  const data = await res.json();

  return data.result || [];
}

import { useCallback, useRef, useState } from "react";
import { askHamAI } from "../../../src/core/ai/hamaiClient"
import { useSpeechManager } from "./useSpeechManager";
import { streamAI } from "@/features/ai/useStreamingAI";

type State =
  | "idle"
  | "loading"
  | "running"
  | "paused"
  | "stopped";

type Mode = {
  silent: boolean;
  batterySaver: boolean;
};

export interface DrivingChat {
  id: number;
  source: "Bale";
  name: string;
  unread: number;
  messages: Array<{
    sender: string;
    text: string;
  }>;
  priority?: number;
  summary?: string;
}

export function useDrivingMode() {
  // ======================
  // UI STATE
  // ======================
  const [state, setState] =
    useState<State>("idle");

  const [status, setStatus] =
    useState("آماده");

  const [currentChatIndex, setCurrentChatIndex] =
    useState(0);

  // ======================
  // COMPUTED STATE
  // ======================
  const isRunning = state === "running";

  const isPaused = state === "paused";

  const isLoading = state === "loading";

  // ======================
  // MODE CONTROL
  // ======================
  const modeRef = useRef<Mode>({
    silent: false,
    batterySaver: false,
  });

  const isSilent =
    modeRef.current.silent;

  // ======================
  // SPEECH
  // ======================
  const {
    speak,
    stop: stopSpeech,
    replay,
    isSpeaking,
  } = useSpeechManager();

  const [connectionStatus, setConnectionStatus] =
    useState<"connected" | "error" | "connecting">(
      "connecting"
    );

  // ======================
  // INTERRUPTION
  // ======================
  const interruptRef = useRef(false);

  const interrupt = useCallback(() => {
    interruptRef.current = true;

    stopSpeech();
  }, [stopSpeech]);

  const clearInterrupt = () => {
    interruptRef.current = false;
  };

  // ======================
  // SAFE SPEAK
  // ======================
  const safeSpeak = useCallback(
    async (text: string) => {
      if (!text?.trim()) return;

      if (modeRef.current.silent) return;

      if (interruptRef.current) return;

      await speak(text);
    },
    [speak]
  );

  // ======================
  // ENGINE STATE
  // ======================
  const chatsRef =
    useRef<DrivingChat[]>([]);

  const chatIndexRef = useRef(0);

  const messageIndexRef = useRef(0);

  const runningRef = useRef(false);

  const pausedRef = useRef(false);

  const stoppedRef = useRef(false);

  // ======================
  // PRIORITY ENGINE
  // ======================
  const calculatePriority = (
    chat: DrivingChat
  ) => {
    const keywords = [
      "فوری",
      "urgent",
      "مهم",
      "call",
      "الان",
    ];

    let score = chat.unread;

    chat.messages.forEach((m) => {
      if (
        keywords.some((k) =>
          m.text.includes(k)
        )
      ) {
        score += 10;
      }
    });

    return score;
  };

  const sortChats = (
    chats: DrivingChat[]
  ) => {
    return chats.sort(
      (a, b) =>
        (b.priority ?? 0) -
        (a.priority ?? 0)
    );
  };

  // ======================
  // SUMMARY
  // ======================
  const generateSummary = async (
    chat: DrivingChat
  ) => {
    const text = chat.messages
      .map((m) => m.text)
      .join(" ");

    return text.slice(0, 80) + "...";
  };

  // ======================
  // LOAD CHATS
  // ======================
  const loadChats = useCallback(
    async () => {
      setState("loading");

      setStatus(
        "در حال دریافت پیام‌ها..."
      );

      try {
        let updates = [];

        try {
          updates = await getUpdates(40);

          setConnectionStatus("connected");
        } catch (error) {

          console.error(error);

          setConnectionStatus("error");

          setStatus("خطا در اتصال");

          return [];
        }

        const map = new Map<
          number,
          DrivingChat
        >();

        for (const u of updates) {
          const msg = u.message;

          if (!msg?.text) continue;

          const id = msg.chat.id;

          if (!map.has(id)) {
            map.set(id, {
              id,
              source: "Bale",
              name:
                msg.chat.title ||
                msg.chat.first_name ||
                `چت ${id}`,
              unread: 0,
              messages: [],
            });
          }

          const chat = map.get(id)!;

          chat.messages.push({
            sender:
              msg.from?.first_name ||
              "کاربر",
            text: msg.text,
          });

          chat.unread++;
        }

        let chats = Array.from(
          map.values()
        );

        chats = chats.map((c) => ({
          ...c,
          priority:
            calculatePriority(c),
        }));

        chats = sortChats(chats);

        // ======================
        // GENERATE SUMMARIES
        // ======================
        for (const chat of chats) {
          chat.summary =
            await generateSummary(
              chat
            );
        }

        chatsRef.current = chats;

        chatIndexRef.current = 0;

        messageIndexRef.current = 0;

        return chats;
      } catch (error) {
        console.error(error);

        setStatus(
          "خطا در دریافت پیام‌ها"
        );

        return [];
      }
    },
    []
  );

  // ======================
  // STREAM AI RESPONSE
  // ======================
  const streamChatResponse =
    useCallback(
      async (messages: any[]) => {
        let speakBuffer = "";

        let lastSpeakTime =
          Date.now();

        await streamAI({
          messages,

          onToken: (
            token: string
          ) => {
            if (
              interruptRef.current
            ) {
              return;
            }

            speakBuffer += token;

            const now =
              Date.now();

            const shouldSpeak =
              speakBuffer.length >
                40 ||
              now -
                lastSpeakTime >
                1200 ||
              /[.!؟]/.test(token);

            if (shouldSpeak) {
              safeSpeak(
                speakBuffer.trim()
              );

              speakBuffer = "";

              lastSpeakTime =
                now;
            }
          },
        });

        // flush
        if (
          speakBuffer.trim() &&
          !interruptRef.current
        ) {
          await safeSpeak(
            speakBuffer.trim()
          );
        }
      },
      [safeSpeak]
    );

  // ======================
  // ENGINE LOOP
  // ======================
  const runEngine = useCallback(
    async () => {
      if (runningRef.current)
        return;

      runningRef.current = true;

      stoppedRef.current = false;

      clearInterrupt();

      setState("running");

      try {
        while (
          chatIndexRef.current <
          chatsRef.current.length
        ) {
          // ======================
          // GLOBAL STOP CHECK
          // ======================
          if (
            pausedRef.current ||
            stoppedRef.current
          ) {
            break;
          }

          const chat =
            chatsRef.current[
              chatIndexRef.current
            ];

          setCurrentChatIndex(
            chatIndexRef.current
          );

          setStatus(chat.name);

          // ======================
          // SUMMARY
          // ======================
          if (
            chat.summary &&
            !modeRef.current.silent
          ) {
            await safeSpeak(
              `خلاصه: ${chat.summary}`
            );
          }

          // ======================
          // CHAT HEADER
          // ======================
          await safeSpeak(
            `${chat.name} — ${chat.unread} پیام`
          );

          // ======================
          // MESSAGE LOOP
          // ======================
          while (
            messageIndexRef.current <
            chat.messages.length
          ) {
            // ======================
            // LOOP BREAKS
            // ======================
            if (
              pausedRef.current ||
              stoppedRef.current
            ) {
              break;
            }

            const msg =
              chat.messages[
                messageIndexRef.current
              ];

            setStatus(
              `${msg.sender}`
            );

            // ======================
            // ANNOUNCE MESSAGE
            // ======================
            await safeSpeak(
              `${msg.sender} گفت`
            );

            // ======================
            // STREAM AI
            // ======================
            await streamChatResponse(
              [
                {
                  role: "system",
                  content: `
تو دستیار رانندگی HamAI هستی.
پیام را کوتاه، طبیعی و قابل خواندن با صدا خلاصه کن.
`,
                },
                {
                  role: "user",
                  content: msg.text,
                },
              ]
            );

            messageIndexRef.current += 1;

            // ======================
            // BATTERY MODE
            // ======================
            const delay =
              modeRef.current
                .batterySaver
                ? 400
                : 150;

            await new Promise(
              (r) =>
                setTimeout(
                  r,
                  delay
                )
            );

            // ======================
            // INTERRUPTION
            // ======================
            if (
              interruptRef.current
            ) {
              break;
            }
          }

          // reset message index
          messageIndexRef.current = 0;

          // next chat
          chatIndexRef.current += 1;
        }

        // ======================
        // FINISHED
        // ======================
        if (
          !stoppedRef.current
        ) {
          setState("idle");

          setStatus(
            "پایان پیام‌ها"
          );

          await safeSpeak(
            "تمام پیام‌ها خوانده شد"
          );
        }
      } finally {
        runningRef.current = false;
      }
    },
    [
      safeSpeak,
      streamChatResponse,
    ]
  );

  // ======================
  // START
  // ======================
  const start = useCallback(
    async () => {
      pausedRef.current = false;

      stoppedRef.current = false;

      const chats =
        await loadChats();

      if (!chats.length) {
        setStatus(
          "هیچ پیامی وجود ندارد"
        );

        setState("idle");

        return;
      }

      await safeSpeak(
        `${chats.length} چت جدید`
      );

      runEngine();
    },
    [
      loadChats,
      runEngine,
      safeSpeak,
    ]
  );

  // ======================
  // PAUSE
  // ======================
  const pause = useCallback(() => {
    pausedRef.current = true;

    setState("paused");

    interrupt();
  }, [interrupt]);

  // ======================
  // RESUME
  // ======================
  const resume = useCallback(() => {
    pausedRef.current = false;

    clearInterrupt();

    setState("running");

    runEngine();
  }, [runEngine]);

  // ======================
  // STOP
  // ======================
  const stop = useCallback(() => {
    stoppedRef.current = true;

    pausedRef.current = false;

    runningRef.current = false;

    interruptRef.current = true;

    chatIndexRef.current = 0;

    messageIndexRef.current = 0;

    chatsRef.current = [];

    stopSpeech();

    setCurrentChatIndex(0);

    setStatus("آماده");

    setState("stopped");
  }, [stopSpeech]);

  // ======================
  // MODES
  // ======================
  const setSilentMode = (
    v: boolean
  ) => {
    modeRef.current.silent = v;
  };

  const setBatterySaver = (
    v: boolean
  ) => {
    modeRef.current.batterySaver =
      v;
  };

  // ======================
  // COMMANDS
  // ======================
  const handleCommand =
    useCallback(
      async (cmd: string) => {
        const c =
          cmd.toLowerCase();

        // STOP
        if (
          /(بس کن|stop talking|stop|قطع)/.test(
            c
          )
        ) {
          interrupt();

          pause();

          return;
        }

        // RESUME
        if (
          /(ادامه|continue)/.test(
            c
          )
        ) {
          resume();

          return;
        }

        // START
        if (
          /(شروع|start)/.test(c)
        ) {
          start();

          return;
        }

        // PAUSE
        if (
          /(توقف|pause)/.test(c)
        ) {
          pause();

          return;
        }

        // REPEAT
        if (
          /(تکرار|repeat)/.test(c)
        ) {
          replay();

          return;
        }

        // REFRESH
        if (
          /(بروزرسانی|refresh|reload)/.test(
            c
          )
        ) {
          stop();

          await start();

          return;
        }

        // SILENT
        if (
          /(silent|بی صدا)/.test(
            c
          )
        ) {
          setSilentMode(true);

          return;
        }

        // SOUND
        if (
          /(sound|صدا)/.test(c)
        ) {
          setSilentMode(false);

          return;
        }

        // BATTERY
        if (
          /(battery)/.test(c)
        ) {
          setBatterySaver(true);

          return;
        }

        // FULL MODE
        if (
          /(full)/.test(c)
        ) {
          setBatterySaver(false);

          return;
        }
      },
      [
        interrupt,
        pause,
        resume,
        replay,
        start,
        stop,
      ]
    );

  // ======================
  // RETURN
  // ======================
  return {
    state,
    status,

    isRunning,
    isPaused,
    isLoading,
    isSilent,
    isSpeaking,

    currentChatIndex,
    totalChats: chatsRef.current.length,

    start,
    pause,
    resume,
    stop,

    handleCommand,
    interrupt,

    setSilentMode,
    setBatterySaver,

    // ✅ اضافه کن اینو:
    connectionStatus: "connected", // یا فعلاً fake
  };
}