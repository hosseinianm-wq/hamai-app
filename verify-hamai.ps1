Write-Host "===== HAMAI VERIFY ====="

Write-Host "`n--- TypeScript Check ---"
npx tsc --noEmit

Write-Host "`n--- Next Build ---"
npm run build

Write-Host "`n--- Broken Imports Check ---"
Select-String -Path "**/*.ts*" -Pattern "src/" -ErrorAction SilentlyContinue

Write-Host "`n--- Bale Module Files ---"
Get-ChildItem features\messaging\bale -Recurse

Write-Host "`n--- Bale Service Preview ---"
Get-Content features\messaging\bale\baleService.ts

Write-Host "`n--- Memory Store Preview ---"
Get-Content features\messaging\bale\memoryStore.ts

Write-Host "`n===== VERIFY COMPLETE ====="
