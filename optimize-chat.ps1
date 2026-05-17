$page="app/page.tsx"
$css="app/globals.css"

Write-Host "Optimizing chat UI..."

# خواندن فایل
$content = Get-Content $page -Raw

# افزودن React import اگر نبود
if ($content -notmatch "import React") {
$content = $content -replace 'import {','import React, {'
}

# افزودن useCallback
$content = $content -replace 'useState }','useState, useCallback }'

# افزودن bottomRef
if ($content -notmatch "bottomRef") {
$content = $content -replace 'const \[messages, setMessages\] = useState','const bottomRef = useRef<HTMLDivElement>(null)

const [messages, setMessages] = useState'
}

# افزودن useEffect برای اسکرول
if ($content -notmatch "scrollIntoView") {
$scroll = @"

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])

"@
$content = $content + $scroll
}

# افزودن MessageBubble
if ($content -notmatch "MessageBubble") {
$bubble=@"

const MessageBubble = React.memo(({ message }: { message: Message }) => {
  return (
    <div className={message.role === "user" ? "user" : "assistant"}>
      {message.content}
    </div>
  )
})

"@
$content = $bubble + $content
}

Set-Content $page $content -Encoding UTF8

Write-Host "page.tsx optimized"


# ---- CSS ----

$cssContent = Get-Content $css -Raw

$mobileCss=@"

html, body {
  height: 100%;
  overscroll-behavior: none;
}

.chat-container {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
}

.input-bar {
  position: sticky;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: #111;
}

"@

if ($cssContent -notmatch "chat-container") {
$cssContent += $mobileCss
Set-Content $css $cssContent
}

Write-Host "globals.css optimized"

Write-Host "✅ Chat performance optimization complete"
