"use client"

type Message = {
  role: "user" | "assistant"
  content: string
}

const createUserMessage = (content: string): Message => ({
  role: "user",
  content
})

const createAssistantMessage = (content: string): Message => ({
  role: "assistant",
  content
})



import { useEffect, useRef, useState } from "react"


export default function Home() {

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  // ✅ Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage() {

  if (!input.trim() || loading) return

  const userText = input

  const newMessages = [
    ...messages,
    createUserMessage(userText)
  ]

  setMessages(newMessages)
  setInput("")
  setLoading(true)

  try {

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    let text = ""

    setMessages(prev => [...prev, createAssistantMessage("")])

    while (true) {

      const { done, value } = await reader!.read()

      if (done) break

      text += decoder.decode(value)

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = createAssistantMessage(text)
        return updated
      })

    }

  } catch (err) {

    setMessages([
      ...newMessages,
      {
        role: "assistant",
        content: "خطا در ارتباط با HamAI"
      }
    ])

  } finally {
    setLoading(false)
  }
}
  return (
    <div className="chat-root">

  {/* Sidebar */}
  <aside className="chat-sidebar">
    <div className="sidebar-title">HamAI</div>
    <div className="sidebar-item">گفت‌وگوی جدید</div>
    <div className="sidebar-item">تنظیمات</div>
    <div className="sidebar-item">ابزارها</div>
  </aside>

  {/* Main Chat */}
  <div className="chat-shell">


        <header className="chat-header">
          <div className="chat-header-inner">
            <div className="logo-text">HamAI</div>
          </div>
        </header>

        <main className="chat-main">

          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.role}`}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </main>

        <footer className="chat-footer">

          <div className="input-wrapper">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage()
              }}
            />

            <button onClick={sendMessage}>
              ارسال
            </button>

          </div>

        </footer>

      </div>
    </div>
  )
}


