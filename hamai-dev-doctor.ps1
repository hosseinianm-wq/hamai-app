Write-Host ""
Write-Host "HamAI Dev Doctor" -ForegroundColor Cyan
Write-Host "Scanning project..."
Write-Host ""

# -----------------------------
# Check critical files
# -----------------------------

$critical = @(
"app/api/chat/route.ts",
"features/messaging/bale/baleMessageProcessor.ts",
"features/messaging/bale/baleService.ts"
)

Write-Host "Checking critical files..."

foreach ($file in $critical) {
    if (Test-Path $file) {
        Write-Host "OK $file"
    } else {
        Write-Host "Missing $file" -ForegroundColor Red
    }
}

# -----------------------------
# Check HamAI core
# -----------------------------

Write-Host ""
Write-Host "Checking HamAI core..."

$core = Get-ChildItem -Recurse -Filter hamaiClient.ts

if ($core) {
    Write-Host "OK hamaiClient.ts found"
} else {
    Write-Host "Missing hamaiClient.ts" -ForegroundColor Red
}

# -----------------------------
# Check agent tools
# -----------------------------

Write-Host ""
Write-Host "Checking Agent tools..."

$tools = @(
"features/agent/tools/snapTool.ts",
"features/agent/tools/telegramTool.ts"
)

foreach ($tool in $tools) {
    if (Test-Path $tool) {
        Write-Host "OK $tool"
    } else {
        Write-Host "Missing tool $tool" -ForegroundColor Red
    }
}

# -----------------------------
# TypeScript check
# -----------------------------

Write-Host ""
Write-Host "Running TypeScript diagnostics..."

$tsc = npx tsc --noEmit 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK No TypeScript errors"
} else {
    Write-Host "TypeScript errors detected:" -ForegroundColor Red
    Write-Host $tsc
}

# -----------------------------
# Chat component check
# -----------------------------

Write-Host ""
Write-Host "Checking chat components..."

if (Test-Path "features/chat/components/ChatMessageBubble.tsx") {
    Write-Host "OK ChatMessageBubble exists"
} else {
    Write-Host "Missing ChatMessageBubble" -ForegroundColor Red
}

# -----------------------------
# API test
# -----------------------------

Write-Host ""
Write-Host "Testing API /api/chat ..."

try {

$response = Invoke-WebRequest `
-Uri "http://localhost:3000/api/chat" `
-Method POST `
-Body '{"message":"doctor test"}' `
-ContentType "application/json" `
-TimeoutSec 5

Write-Host "OK API responded"

}
catch {

Write-Host "API test failed" -ForegroundColor Red

}

# -----------------------------
# AI connectivity
# -----------------------------

Write-Host ""
Write-Host "Testing AI endpoints..."

$targets = @(
"openrouter.ai",
"api.groq.com"
)

foreach ($t in $targets) {

try {

Test-Connection $t -Count 1 -ErrorAction Stop | Out-Null
Write-Host "OK $t reachable"

}
catch {

Write-Host "Cannot reach $t" -ForegroundColor Red

}

}

Write-Host ""
Write-Host "HamAI Dev Doctor finished."
