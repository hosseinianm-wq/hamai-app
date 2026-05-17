Write-Host ""
Write-Host "===== HamAI Diagnostic =====" -ForegroundColor Cyan

# check env
Write-Host ""
Write-Host "Checking .env file..."

if (Test-Path ".env") {
    Write-Host ".env file found" -ForegroundColor Green
} else {
    Write-Host ".env file NOT found" -ForegroundColor Red
}

# node version
Write-Host ""
Write-Host "Checking Node version..."
node -v

# npm version
Write-Host ""
Write-Host "Checking npm..."
npm -v

# next version
Write-Host ""
Write-Host "Checking Next.js..."
npx next --version

# check api route
Write-Host ""
Write-Host "Checking API folder..."

if (Test-Path "app\api\chat") {
    Write-Host "API route exists: app/api/chat" -ForegroundColor Green
} else {
    Write-Host "API route missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "===== HamAI Diagnostic Finished =====" -ForegroundColor Cyan
