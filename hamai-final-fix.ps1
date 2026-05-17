Write-Host ""
Write-Host "HamAI Final Fix" -ForegroundColor Cyan
Write-Host ""

$file = "features/chat/components/ChatMessageBubble.tsx"

if (Test-Path $file) {

Write-Host "Fixing ChatMessageBubble..."

$code = @'
import { ChatItem } from "../types/chat"

type Props = {
  item: ChatItem
}

export function ChatMessageBubble({ item }: Props) {

  return (
    <div className={item.role === "user" ? "user-bubble" : "assistant-bubble"}>
      {item.text}
    </div>
  )

}
'@

Set-Content $file $code

}

Write-Host ""
Write-Host "Final fix applied."
Write-Host "Run: npx tsc --noEmit"
Write-Host ""
