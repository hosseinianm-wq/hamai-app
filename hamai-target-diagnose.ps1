Write-Host ""
Write-Host "HamAI Target Diagnostic" -ForegroundColor Cyan
Write-Host ""

# -----------------------------
# Files to inspect
# -----------------------------

$files = @(
"features/agent/executor.ts",
"features/chat/components/ChatMessageBubble.tsx",
"features/messaging/bale/baleMessageProcessor.ts",
"features/messaging/bale/commands/driveCommand.ts"
)

foreach ($file in $files) {

Write-Host ""
Write-Host "----------------------------------"
Write-Host "Checking $file"
Write-Host "----------------------------------"

if (Test-Path $file) {

Write-Host "File exists" -ForegroundColor Green
Write-Host ""

$content = Get-Content $file

Write-Host "Imports:"
$content | Select-String "import "

Write-Host ""
Write-Host "Exports:"
$content | Select-String "export "

Write-Host ""
Write-Host "HamAI calls:"
$content | Select-String "askHamAI"

Write-Host ""
Write-Host "Message fields:"
$content | Select-String "message"

}
else {

Write-Host "File missing" -ForegroundColor Red

}

}

Write-Host ""
Write-Host "Diagnostic finished."
