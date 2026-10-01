<#
.SYNOPSIS
Master Setup Wizard for INDRA (Smart India Hackathon SIH-26)

.DESCRIPTION
Sets up virtual environments, installs all dependencies, configures environment keys,
and creates a Desktop shortcut for easy 1-click startup.

Modes:
  -Mode api    (Default) Fast Cloud API Mode — OpenRouter / cloud LLMs. No heavy GPU or GGUF downloads needed.
  -Mode local  Full Sovereign Offline Mode — downloads ~15GB local GGUF models and sets up llama-swap GPU backend.
#>

param(
    [ValidateSet("api", "local")]
    [string]$Mode = "api"
)

$ErrorActionPreference = 'Stop'
$rootDir = $PSScriptRoot
$backendDir = "$rootDir\SIH-26\hermes-agent\backend"
$agentDir = "$rootDir\SIH-26\hermes-agent"
$webDir = "$rootDir\SIH-26\hermes-agent\web"
$envFile = "$agentDir\.env"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       INDRA 2.0 INSTALLATION WIZARD      " -ForegroundColor Cyan
Write-Host "       Target Mode: $($Mode.ToUpper())    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Python
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Yellow
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python 3.10+ is required but not found in PATH." -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/ or Microsoft Store." -ForegroundColor Red
    exit 1
}
$pythonVer = python --version
Write-Host "Found $pythonVer" -ForegroundColor Green

# 2. Check / Install uv (blazing fast Python environment & dependency manager)
Write-Host "`n[2/5] Setting up Python dependencies with uv..." -ForegroundColor Yellow
if (!(Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "Installing uv via pip..." -ForegroundColor Cyan
    python -m pip install --upgrade pip uv
}
Set-Location "$agentDir"
Write-Host "Syncing hermes-agent dependencies..." -ForegroundColor Cyan
uv sync
Write-Host "Python environment configured successfully." -ForegroundColor Green

# 3. Setup Web Dashboard & pnpm
Write-Host "`n[3/5] Setting up Web Dashboard dependencies..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
        Write-Host "Installing pnpm globally via npm..." -ForegroundColor Cyan
        npm install -g pnpm
    }
    if (Test-Path "$webDir") {
        Set-Location "$webDir"
        Write-Host "Installing web UI packages via pnpm..." -ForegroundColor Cyan
        pnpm install
        Write-Host "Web packages installed cleanly." -ForegroundColor Green
    }
} else {
    Write-Host "[WARN] Node.js/npm not found. Web UI dev server won't be runnable, but prebuilt UI will be served on port 9119." -ForegroundColor DarkYellow
}

# 4. Configure Environment & API Keys
Write-Host "`n[4/5] Configuring Environment..." -ForegroundColor Yellow
if (!(Test-Path "$envFile")) {
    if (Test-Path "$agentDir\.env.example") {
        Copy-Item "$agentDir\.env.example" "$envFile"
        Write-Host "Created .env from .env.example" -ForegroundColor Green
    }
} else {
    Write-Host ".env already exists." -ForegroundColor Green
}

# Ensure root .env has workbench config
$rootEnvFile = "$rootDir\.env"
if (!(Test-Path $rootEnvFile)) {
    $vaultPath = "$rootDir\MyVault"
    if (!(Test-Path $vaultPath)) {
        New-Item -ItemType Directory -Path $vaultPath | Out-Null
    }
    @"
WORKBENCH_API_KEY=wb_live_1234567890abcdef1234567890abcdef
TERMINAL_ENV=local
OBSIDIAN_VAULT_PATH=$vaultPath
"@ | Set-Content -Path $rootEnvFile
}

# 5. Local Mode Only: Model Downloader & Backend Setup
if ($Mode -eq "local") {
    Write-Host "`n[5/5] LOCAL MODE: Setting up backend and downloading GGUF models..." -ForegroundColor Yellow
    if (!(Test-Path "$backendDir\venv")) {
        python -m venv "$backendDir\venv"
    }
    if (Test-Path "$backendDir\requirements.txt") {
        & "$backendDir\venv\Scripts\python.exe" -m pip install -r "$backendDir\requirements.txt"
    }
    Write-Host "Running Model Downloader & SHA-256 verifier..." -ForegroundColor Cyan
    python "$rootDir\download_models.py"
} else {
    Write-Host "`n[5/5] API MODE: Skipping local GGUF downloads (cloud API mode active)." -ForegroundColor Green
}

# 6. Create Desktop Shortcut
Write-Host "`nCreating Desktop Shortcut..." -ForegroundColor Yellow
try {
    $wshShell = New-Object -ComObject WScript.Shell
    $desktopPath = [System.Environment]::GetFolderPath('Desktop')
    $shortcut = $wshShell.CreateShortcut("$desktopPath\INDRA Dashboard.lnk")
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-ExecutionPolicy Bypass -NoExit -File `"$rootDir\start-indra.ps1`" -Mode $Mode"
    $shortcut.WorkingDirectory = $rootDir
    $shortcut.Save()
    Write-Host "Created 'INDRA Dashboard' shortcut on your Desktop." -ForegroundColor Green
} catch {
    Write-Host "Could not create Desktop shortcut automatically: $_" -ForegroundColor DarkYellow
}

Set-Location "$rootDir"
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "       INSTALLATION COMPLETE!             " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Start INDRA anytime by running:" -ForegroundColor Cyan
Write-Host "  .\start-indra.ps1 -Mode $Mode" -ForegroundColor White
Write-Host "Or by double-clicking the 'INDRA Dashboard' Desktop shortcut.`n" -ForegroundColor Cyan
