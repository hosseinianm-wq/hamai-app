"use client"

interface Props {
  state: "listening" | "thinking" | "speaking"
}

export default function VoiceOrb({ state }: Props) {

  const color = {
    listening: "bg-blue-500",
    thinking: "bg-purple-500",
    speaking: "bg-green-500"
  }[state]

  return (
    <div className="flex items-center justify-center">

      <div className={`w-44 h-44 rounded-full ${color}
      animate-pulse shadow-[0_0_80px_20px_rgba(59,130,246,0.5)]`}>
      
      </div>

    </div>
  )
}
