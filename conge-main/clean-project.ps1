# Safe Project Cleanup Script (PowerShell)
# Dry-run first, then delete non-essential files/folders

param([switch]$dryrun = $true)

$toRemove = @(
  'node_modules',
  'dist',
  'build', 
  '.cache',
  '*.log',
  '__pycache__',
  'bun.lockb',
  'package-lock.json'
)

Write-Host "=== PROJECT CLEANUP ===" -ForegroundColor Green
Write-Host "Dry-run mode: $dryrun" -ForegroundColor Yellow

foreach ($item in $toRemove) {
  $matches = Get-ChildItem -Path . -Recurse -Include $item -ErrorAction SilentlyContinue
  if ($matches) {
    Write-Host "Found ($($matches.Count)): $item" -ForegroundColor Cyan
    foreach ($match in $matches) {
      Write-Host "  - $($match.FullName)" -ForegroundColor Gray
    }
  }
}

if (-not $dryrun) {
  Write-Host "`nExecuting cleanup..." -ForegroundColor Red
  foreach ($item in $toRemove) {
    Remove-Item -Recurse -Force $item -ErrorAction SilentlyContinue
  }
  Write-Host "Cleanup complete!" -ForegroundColor Green
} else {
  Write-Host "`nRun with -dryrun `$false to execute deletions." -ForegroundColor Yellow
  Write-Host "Example: .\clean-project.ps1 -dryrun `$false" -ForegroundColor Yellow
}

Write-Host "`nSafe to delete: locks/caches/builds. Source code/config protected." -ForegroundColor Green

