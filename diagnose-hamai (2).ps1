param(
    [string]$ProjectPath = "."
)

Write-Host "`n===== HamAI Smart Diagnostic Tester =====`n" -ForegroundColor Cyan

# 1) Check .env keys
Write-Host "→ Checking .env ..." -ForegroundColor Yellow
$envFile = Join-Path $ProjectPath ".env"

if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $requiredKeys = @(
        "OPENROUTER_API_KEY",
        "GROQ_API_KEY",
        "BALE_API_KEY",
        "BALE_WEBHOOK_SECRET"
    )

    foreach ($key in $requiredKeys) {
        if ($envContent -match $key) {
            Write-Host " ✓ $key found"
        } else {
            Write-Host " ✗ Missing $key" -ForegroundColor Red
        }
    }
} else {
    Write-Host " ✗ .env file NOT FOUND" -ForegroundColor Red
}


# 2) Check tsconfig paths + broken imports
Write-Host "`n→ Scanning TypeScript files for broken imports..." -ForegroundColor Yellow

$tsFiles = Get-ChildItem -Path $ProjectPath -Recurse -Include *.ts, *.tsx

$importIssues = @()

foreach ($file in $tsFiles) {
    $content = Get-Content $file.FullName

    foreach ($line in $content) {
        if ($line -match "from\s+['`"](.*)['`"]") {
            $import = $Matches[1]
            if ($import.StartsWith(".") -or $import.StartsWith("@")) {

                # Build full path
                try {
                    $resolved = Resolve-Path -Path (Join-Path $file.DirectoryName $import) -ErrorAction Stop
                } catch {
                    $importIssues += "Import issue → $import in file: $($file.FullName)"
                }
            }
        }
    }
}

if ($importIssues.Count -gt 0) {
    Write-Host " ✗ Broken imports found:" -ForegroundColor Red
    $importIssues | ForEach-Object { Write-Host "   $_" }
} else {
    Write-Host " ✓ No broken imports detected"
}


# 3) Check if hamaiClient.ts exists
Write-Host "`n→ Checking HamAI core files..." -ForegroundColor Yellow

$hamaiClient = Get-ChildItem -Path $ProjectPath -Recurse -Filter "hamaiClient.ts" | Select-Object -First 1

if ($hamaiClient) {
    Write-Host " ✓ hamaiClient.ts found at: $($hamaiClient.FullName)"
} else {
    Write-Host " ✗ hamaiClient.ts NOT FOUND" -ForegroundColor Red
}


# 4) Run TypeScript compiler test
Write-Host "`n→ Running TypeScript compile test..." -ForegroundColor Yellow
$tsc = npx tsc --noEmit 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host " ✓ No TypeScript errors"
} else {
    Write-Host " ✗ TypeScript issues detected:" -ForegroundColor Red
    Write-Host $tsc
}


# 5) Simulate server request to /api/chat
Write-Host "`n→ Testing API /api/chat ..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" -Method POST -Body '{"message":"hello"}' -ContentType "application/json" -TimeoutSec 5 -ErrorAction Stop
    Write-Host " ✓ API reachable (HTTP $($response.StatusCode))"
} catch {
    Write-Host " ✗ API NOT reachable" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)"
}


# 6) Check internet connectivity to AI endpoints
Write-Host "`n→ Testing AI endpoints..." -ForegroundColor Yellow

$endpoints = @(
    "https://openrouter.ai/api/v1/chat/completions",
    "https://api.groq.com/openai/v1/chat/completions"
)

foreach ($ep in $endpoints) {
    try {
        $res = Invoke-WebRequest -Uri $ep -Method HEAD -TimeoutSec 5 -ErrorAction Stop
        Write-Host " ✓ Online: $ep"
    } catch {
        Write-Host " ✗ Offline: $ep" -ForegroundColor Red
    }
}

Write-Host "`n===== Done. =====" -ForegroundColor Green
