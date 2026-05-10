"use client"

import { useEffect, useState } from "react"
import VoiceOrb from "@/components/VoiceOrb"
import Transcript from "@/components/Transcript"
import Controls from "@/components/Controls"
import { socket } from "@/lib/socket"

type VoiceState = "listening" | "thinking" | "speaking"

export default function Home() {

  const [state, setState] = useState<VoiceState>("listening")

  const [userText, setUserText] = useState<string>("")
  const [aiText, setAiText] = useState<string>("")

  useEffect(() => {

    const handleUser = (text: string) => {
      setUserText(text)
      setAiText("")
      setState("thinking")
    }

    const handleToken = (token: string) => {
      setAiText(prev => prev + token)
      setState("speaking")
    }

    const handleDone = () => {
      setState("listening")
    }

    socket.on("USER_TEXT", handleUser)
    socket.on("AI_TOKEN", handleToken)
    socket.on("AI_DONE", handleDone)

    return () => {
      socket.off("USER_TEXT", handleUser)
      socket.off("AI_TOKEN", handleToken)
      socket.off("AI_DONE", handleDone)
    }

  }, [])

  return (

    <main
      className="
      h-screen
      flex
      flex-col
      items-center
      justify-center
      bg-gradient-to-b
      from-black
      via-zinc-900
      to-black
      text-white"
    >

      <h1 className="text-3xl font-bold mb-6">
        HamAI
      </h1>

      <VoiceOrb state={state} />

      <Transcript
        user={userText}
        ai={aiText}
      />

      <Controls />

    </main>

  )
}
