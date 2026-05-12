"use client"

export default function Controls() {

  return (

    <div className="mt-10 flex gap-4">

      <button
        className="
        px-6 py-3
        bg-zinc-800
        rounded-xl
        hover:bg-zinc-700
        transition"
      >
        🎤
      </button>

      <button
        className="
        px-6 py-3
        bg-red-600
        rounded-xl
        hover:bg-red-500
        transition"
      >
        Stop
      </button>

    </div>

  )
}
