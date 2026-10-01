<p align="center">
  <img src="https://img.shields.io/badge/SIH--2026-Smart%20India%20Hackathon-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Team-CodersbyChance-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Domain-Maritime%20%7C%20AI%20%7C%20Steel-teal?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20LLM-purple?style=for-the-badge" />
</p>

<h1 align="center">🌊 INDRA — Intelligent Naval & Dry-bulk Route Advisor</h1>
<p align="center"><em>A fully autonomous, AI-powered maritime intelligence and freight advisory platform built for SAIL's East Coast raw material procurement operations.</em></p>

---

## 📌 Problem Statement

**SAIL (Steel Authority of India Ltd.)** imports millions of tonnes of raw materials — thermal coal, coking coal, and iron ore — via East Coast Indian ports (Paradip, Vizag, Gangavaram, Haldia, Dhamra). Managing freight procurement, port congestion, vessel selection, route feasibility, and freight market timing across multiple trade lanes is an incredibly complex, manual-intensive process prone to high demurrage costs.

**INDRA** solves this with an end-to-end AI agent that:
- Monitors real-time freight market signals (BDI, route rates, commodity prices)
- Predicts freight cost trends using probabilistic forecasting
- Recommends the optimal vessel class and port for each cargo shipment
- Answers domain-specific advisory queries via an LLM-powered chat interface with full port telemetry RAG

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     INDRA Platform                              │
│                                                                 │
│  ┌─────────────────┐    ┌───────────────────────────────────┐   │
│  │  Hermes Agent   │    │       AI Workbench Backend        │   │
│  │  (Python CLI +  │    │  FastAPI + llama-swap + vLLM +    │   │
│  │   Web UI)       │    │  ONNX + Qdrant RAG + SQLite       │   │
│  └────────┬────────┘    └──────────────┬────────────────────┘   │
│           │                            │                        │
│  ┌────────▼────────────────────────────▼────────────────────┐   │
│  │                React Dashboard (TypeScript)               │   │
│  │  Maritime Intel · Freight Forecasts · Vessel-Port Fit    │   │
│  │  Port Congestion · Multi-Voyage Plan · AI Chat Advisor   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

| Layer | Technology | Role |
|-------|-----------|------|
| **AI Agent Core** | Python + Hermes Framework | Multi-agent orchestration, tool execution, memory |
| **LLM Backend** | llama-swap + vLLM + ONNX | Local model serving (Qwen, Gemma, Hermes) |
| **RAG Engine** | Qdrant + file-based retrieval | Domain knowledge search over port manuals & docs |
| **Web Backend** | FastAPI + SQLite | REST API, streaming inference, model lifecycle |
| **Dashboard** | React + TypeScript + Vite | Maritime analytics UI with real-time data |
| **Freight Advisor** | OpenRouter API + CoT | Streaming LLM chat with live port telemetry context |

---

## 🌟 Key Features

### 🗺️ Maritime Intelligence Dashboard
Real-time freight market overview tailored to SAIL's East Coast operations:
- **Baltic Dry Index (BDI)** live tracking with 13-week sparkline trend
- **Route-specific freight rates** across 8 critical trade lanes (Australia, USA, Mozambique, Indonesia, Russia → Indian East Coast ports)
- **Commodity price board**: Thermal Coal, Coking Coal, Bunker Fuel (VLSFO), Iron Ore
- **AI-extracted market signals** — LLM-parsed news with bullish/bearish/warning sentiment tags
- Filterable by vessel class: Capesize · Panamax · Supramax · Handysize

### ⚓ Vessel–Port Fit Analyser
Instant feasibility check for any vessel class against any East Coast port:
- Checks LOA, beam, and draft constraints against port limits (Paradip, Vizag, Gangavaram, Haldia, Dhamra, Gopalpur)
- Recommends optimal vessel class for a given cargo quantity, origin, and destination
- Flags draft-restricted ports (e.g., Haldia requiring lightering at Sandheads)

### 📈 Freight Forecast Engine
Probabilistic freight rate forecasting (P10 / P50 / P90 bands):
- Short (1–4 weeks), Medium (1–3 months), Long (3–12 months) horizons
- Per-route and per-vessel-class breakdowns
- Time-series chart with actual vs. forecast overlay

### 🚢 Port Congestion Monitor
Live port status across SAIL's key discharge ports:
- Vessel queue counts, berth utilization %, average wait days
- Weather conditions and tide windows
- 7-day trend sparklines per port
- Colour-coded risk status: Normal / Moderate / Congested

### 🤖 AI Chat Advisor (SAIL Freight Intelligence)
An LLM-powered advisory assistant with full domain RAG:
- Powered by OpenRouter API with Chain-of-Thought reasoning
- Live East Coast AIS port telemetry injected into context (draft limits, demurrage risk, vessel queue, rail rake turnaround per port)
- Freight scenario analysis: best port routing, demurrage avoidance, contract scenarios
- File attachment support for document Q&A

### 🗓️ Multi-Voyage Planner
Quarterly voyage scheduling across multiple shipments:
- Vessel allocation matrix
- Market entry timing recommendations

---

## 🚀 Quick Setup & Installation

INDRA supports two flexible operating modes:
1. **Cloud API Mode (Recommended & Default)**: Fast, lightweight, zero GPU or model downloads required. Uses cloud APIs (OpenRouter, Gemini, OpenAI, Claude). Ready in 2 minutes.
2. **Sovereign Local Mode (Air-Gapped)**: For air-gapped deployments with dedicated NVIDIA GPUs running local GGUF models via llama-swap.

---

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | ≥ 3.10 | AI Agent backend & CLI |
| **uv** | Latest | Ultra-fast Python package & environment manager (`pip install uv`) |
| **Node.js** | ≥ 20 | Web UI Dashboard |
| **pnpm** | ≥ 9 | Frontend package manager (`npm install -g pnpm`) |
| **Git** | Any | Version control |

---

### ⚡ 1-Click Automated Startup (Windows)

We provide turnkey PowerShell scripts for instant setup and launch:

```powershell
# 1. Run Setup Wizard (API Mode — default, skips heavy GGUF downloads)
.\install-indra.ps1 -Mode api

# 2. Start all services and launch dashboard
.\start-indra.ps1 -Mode api

# To stop all running services at any time:
.\start-indra.ps1 -Stop
```

---

### 🛠️ Manual Step-by-Step Setup

#### Step 1: Clone the Repository
```powershell
git clone https://github.com/Artyfowl1710/indra2.git
cd indra2
```

#### Step 2: Configure Environment & API Keys
```powershell
cd SIH-26/hermes-agent
Copy-Item .env.example .env
```
Open `.env` and set your OpenRouter API key (free tier supported):
```ini
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```
*(Default free model: `dots-studio/dots-3-note-preview:free` is pre-configured in `config.yaml`)*

#### Step 3: Install Python Dependencies (Using `uv`)
`uv` ensures dependency isolation and eliminates virtual environment issues:
```powershell
# From SIH-26/hermes-agent
pip install uv
uv sync
```

#### Step 4: Launch the Hermes AI Backend (Port 9119)
```powershell
uv run hermes dashboard --port 9119 --host 127.0.0.1 --no-open --skip-build
```
> The backend is now alive at `http://127.0.0.1:9119`. You can verify status via `http://127.0.0.1:9119/api/status`.

#### Step 5: Start the Maritime React Web Dashboard (Port 5173)
In a **new terminal**:
```powershell
cd SIH-26/hermes-agent/web
npm install -g pnpm       # if not already installed
pnpm install
pnpm dev
```
> The dashboard will open at **`http://localhost:5173`**, with real-time proxying to the backend at `:9119`.

---

### 🖥️ All Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Maritime Intelligence Dashboard** | `http://localhost:5173` | React TypeScript analytics UI (Vite) |
| **Hermes AI Backend & API** | `http://127.0.0.1:9119` | FastAPI server, WebSocket chat & RAG |
| **AI Advisor Endpoint** | `http://127.0.0.1:9119/api/advisor/chat` | Autonomous East Coast freight forecaster |
| **Llama-Swap Engine (Local Mode Only)** | `http://127.0.0.1:8100/ui/` | Local GGUF model manager |
| **AI Workbench API (Local Mode Only)** | `http://127.0.0.1:8000/docs` | Swagger interactive API docs |

---

### 🔧 Troubleshooting & Known Issues

#### 1. `ModuleNotFoundError: No module named 'prompt_toolkit'`
- **Cause**: Running `python cli.py` directly with your global system Python instead of the isolated environment.
- **Fix**: Always run commands using `uv run`:
  ```powershell
  uv run hermes dashboard --port 9119 --host 127.0.0.1 --no-open --skip-build
  ```
  Or activate the virtualenv first:
  ```powershell
  .\.venv\Scripts\Activate.ps1
  hermes dashboard
  ```

#### 2. `ERR_PNPM_IGNORED_BUILDS` or `pnpm approve-builds` prompt
- **Cause**: pnpm v10+ requires explicit authorization for packages with build scripts (e.g. `unicode-animations`).
- **Fix**: The repository already includes `pnpm-workspace.yaml` with `allowBuilds: unicode-animations: true`. If prompted, simply run:
  ```powershell
  pnpm approve-builds --all
  pnpm install
  ```

#### 3. Port Conflicts (`EADDRINUSE` / Port 9119 or 5173 already running)
- **Fix**: Stop any existing Hermes or Vite processes cleanly:
  ```powershell
  .\start-indra.ps1 -Stop
  # Or via CLI:
  uv run hermes dashboard --stop
  ```

#### 4. "Do I need to download 15+ GB of local models?"
- **Answer**: **No!** By default, INDRA operates in **Cloud API Mode**. It connects to OpenRouter (or OpenAI / Gemini / Claude) directly via API. Local model downloads are only required if you explicitly choose `-Mode local` for an air-gapped system.

---

## 🤖 LLM Model Routing

INDRA uses dynamic model routing — different tasks are sent to the best local model:

| Model | Role | Use Case |
|-------|------|----------|
| `indra-auto` (Qwen) | Primary reasoning | Tool execution, freight analysis, RAG |
| `indra-writer` (Gemma) | Creative/report generation | Summaries, reports |
| `indra-hermes` | Instruction following | Complex multi-step tasks |

Switch models via CLI:
```
/model indra-auto
```

---

## 📁 Project Structure

```
indra/
├── README.md                    ← You are here
├── install-indra.ps1            ← One-click Windows installer
├── start-indra.ps1              ← Quick-start script
├── download_models.py           ← GGUF model downloader
│
└── SIH-26/
    ├── config.yaml              ← Main Hermes config
    ├── SOUL.md                  ← Agent persona & behaviour
    │
    └── hermes-agent/            ← Core AI agent codebase
        ├── cli.py               ← Main CLI entry point
        ├── hermes_cli/          ← Web routers & API handlers
        │   └── web_routers/
        │       ├── advisor.py   ← AI Freight Advisor (RAG + LLM)
        │       └── ...
        ├── agent/               ← Multi-agent orchestration
        ├── web/                 ← React TypeScript dashboard
        │   └── src/pages/
        │       ├── MaritimeIntelligencePage.tsx
        │       ├── FreightForecastsPage.tsx
        │       ├── VesselPortFitPage.tsx
        │       ├── PortCongestionPage.tsx
        │       ├── MultiVoyagePlanPage.tsx
        │       └── ChatAdvisorPage.tsx
        ├── backend/             ← AI Workbench (FastAPI + local LLMs)
        ├── gateway/             ← Multi-agent gateway service
        └── tools/               ← Agent tool implementations
```

---

## 🛠️ Useful CLI Commands

```powershell
# Switch active model
/model indra-auto

# Spawn parallel sub-agents for a task
/trick-delegate [task description]

# Run background gateway for cron automation
python cli.py gateway

# Start full dashboard
python cli.py dashboard
```

---

## 🏆 Built For

**Smart India Hackathon 2026 (SIH-26)**
- **Team:** CodersbyChance
- **Problem Domain:** Maritime Logistics & AI-Driven Freight Intelligence
- **Beneficiary:** SAIL (Steel Authority of India Ltd.) — East Coast Operations

---

## 📄 License

MIT License — see [`SIH-26/hermes-agent/LICENSE`](SIH-26/hermes-agent/LICENSE) for details.
