$file = "app/page.tsx"

$content = Get-Content $file -Raw

# اضافه کردن type و helper ها اگر وجود ندارند
$helpers = @"
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
"@

if ($content -notmatch "createUserMessage") {
    $content = $helpers + "`n`n" + $content
}

# اصلاح ساخت پیام کاربر
$content = $content -replace '\{ role: "user", content: input \}', 'createUserMessage(input)'

# اصلاح ساخت پیام AI
$content = $content -replace '\{ role: "assistant", content: data.reply \|\| "\.\.\." \}', 'createAssistantMessage(data.reply || "...")'

# اصلاح پیام خطا
$content = $content -replace '\{ role: "assistant", content: "خطا در ارتباط با HamAI" \}', 'createAssistantMessage("خطا در ارتباط با HamAI")'

Set-Content $file $content -Encoding UTF8

Write-Host "✅ page.tsx fixed successfully"
