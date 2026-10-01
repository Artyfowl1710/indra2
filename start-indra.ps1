<#
.SYNOPSIS
Single command to start or stop the INDRA Maritime Intelligence Platform.

.DESCRIPTION
Starts all necessary services depending on selected mode:
  -Mode api    (Default) Cloud API Mode. Starts Hermes FastAPI backend (:9119) and Vite React Dashboard (:5173). Zero local GPU needed.
  -Mode local  Local GGUF Mode. Starts llama-swap (:8100), AI Workbench (:8000), and Hermes Dashboard (:9119).
  -Stop        Stops all running INDRA background processes.
#>

param(
    [ValidateSet("api", "local")]
    [string]$Mode = "api",
    [switch]$Stop
)

$ErrorActionPreference = 'Continue'
$rootDir = $PSScriptRoot
$agentDir = "$rootDir\SIH-26\hermes-agent"
$backendDir = "$rootDir\SIH-26\hermes-agent\backend"
$webDir = "$rootDir\SIH-26\hermes-agent\web"

if ($Stop) {
    Write-Host "Stopping INDRA processes..." -ForegroundColor Yellow
    Set-Location "$agentDir"
    if (Get-Command uv -ErrorAction SilentlyContinue) {
        uv run hermes dashboard --stop 2>$null
    }
    # Stop node/vite processes if running
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "INDRA services stopped." -ForegroundColor Green
    exit 0
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "           STARTING INDRA SYSTEM          " -ForegroundColor Cyan
Write-Host "           Mode: $($Mode.ToUpper())       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Local Mode backend initiation (if applicable)
if ($Mode -eq "local") {
    Write-Host "`n[1/3] Local GPU Mode: Configuring models & starting llama-swap..." -ForegroundColor Yellow
    if (Test-Path "$backendDir\auto-configure-models.py") {
        if (Test-Path "$backendDir\venv\Scripts\python.exe") {
            & "$backendDir\venv\Scripts\python.exe" "$backendDir\auto-configure-models.py"
        } else {
            python "$backendDir\auto-configure-models.py"
        }
    }
    if (Test-Path "$backendDir\start-backend.ps1") {
        & "$backendDir\start-backend.ps1"
    }
} else {
    Write-Host "`n[1/3] Mode: API-Only (Cloud LLM via OpenRouter). No local GPU or GGUF files needed." -ForegroundColor Green
}

# 2. Start Hermes Dashboard Backend on port 9119
Write-Host "`n[2/3] Starting Hermes Backend on port 9119..." -ForegroundColor Yellow
Set-Location "$agentDir"

# Ensure dependencies are ready
if (!(Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "uv not found. Attempting to install uv..." -ForegroundColor Yellow
    python -m pip install uv
}

$backendReady = $false
try {
    $testProbe = Invoke-RestMethod -Uri "http://127.0.0.1:9119/api/status" -TimeoutSec 1 -ErrorAction SilentlyContinue
    if ($testProbe) {
        Write-Host "Hermes Backend is already running on http://127.0.0.1:9119" -ForegroundColor Green
        $backendReady = $true
    }
} catch {}

if (!$backendReady) {
    Write-Host "Launching Hermes Backend (port 9119)..." -ForegroundColor Cyan
    Start-Process -FilePath "powershell.exe" -ArgumentList "-WindowStyle Hidden -Command `"Set-Location '$agentDir'; uv run hermes dashboard --port 9119 --host 127.0.0.1 --no-open --skip-build`"" -WindowStyle Hidden
    
    # Wait up to 10 seconds for backend port 9119 to respond
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Seconds 1
        try {
            $probe = Invoke-RestMethod -Uri "http://127.0.0.1:9119/api/status" -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($probe) {
                $backendReady = $true
                break
            }
        } catch {}
    }
    if ($backendReady) {
        Write-Host "Hermes Backend is LIVE on http://127.0.0.1:9119" -ForegroundColor Green
    } else {
        Write-Host "Hermes Backend launch initiated (starting up in background)..." -ForegroundColor Yellow
    }
}

# 3. Start Web Dashboard (Vite dev server) on port 5173
Write-Host "`n[3/3] Starting Maritime Web Dashboard..." -ForegroundColor Yellow
$frontendReady = $false
try {
    $probeWeb = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
    if ($probeWeb.StatusCode -eq 200) {
        Write-Host "Vite dev server is already running on http://localhost:5173" -ForegroundColor Green
        $frontendReady = $true
    }
} catch {}

if (!$frontendReady -and (Test-Path "$webDir")) {
    Set-Location "$webDir"
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        Write-Host "Launching Vite development server (port 5173)..." -ForegroundColor Cyan
        Start-Process -FilePath "powershell.exe" -ArgumentList "-WindowStyle Hidden -Command `"Set-Location '$webDir'; pnpm dev`"" -WindowStyle Hidden
        Start-Sleep -Seconds 2
        $frontendReady = $true
    }
}

Set-Location "$rootDir"
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "       INDRA IS RUNNING!                  " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

if ($frontendReady) {
    Write-Host "Opening Maritime Dashboard: http://localhost:5173" -ForegroundColor Cyan
    Start-Process "http://localhost:5173"
} else {
    Write-Host "Opening Hermes Dashboard: http://127.0.0.1:9119" -ForegroundColor Cyan
    Start-Process "http://127.0.0.1:9119"
}

Write-Host "`nTo stop all INDRA processes at any time, run:" -ForegroundColor DarkGray
Write-Host "  .\start-indra.ps1 -Stop`n" -ForegroundColor White
