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

## 🚀 Quick Setup

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | ≥ 3.11 | Required for agent backend |
| Node.js | ≥ 20 | Required for web dashboard |
| pnpm | ≥ 9 | Package manager for web |
| Git | any | |

### 1. Clone the Repository

```powershell
git clone https://github.com/Artyfowl1710/indra2.git
cd indra2
```

### 2. Set Up the Hermes Agent (Core AI)

```powershell
cd SIH-26/hermes-agent

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -e ".[all]"
```

Copy and configure environment variables:
```powershell
Copy-Item .env.example .env
# Edit .env with your API keys (OpenRouter, etc.)
```

### 3. Set Up the AI Workbench Backend

```powershell
cd SIH-26/hermes-agent/backend

# Install backend dependencies
pip install -r requirements.txt

# Configure backend environment
Copy-Item .env.example .env

# Initialize database
python check_db.py

# Start the backend server
.\start-backend.ps1
```

The backend will be available at: `http://localhost:8000`

### 4. Set Up & Run the Web Dashboard

```powershell
cd SIH-26/hermes-agent/web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dashboard will open at: `http://localhost:5173`

### 5. Launch the Hermes Agent

In a new terminal:
```powershell
cd SIH-26/hermes-agent
.\venv\Scripts\Activate.ps1

# Launch the full Indra dashboard (agent + gateway)
python cli.py dashboard
```

Or use the gateway for background automation:
```powershell
python cli.py gateway
```

---

## 🖥️ All Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Indra Dashboard (Agent UI)** | `http://127.0.0.1:9119` | Main AI agent interface |
| **Maritime Dashboard (Web)** | `http://localhost:5173` | React maritime analytics UI |
| **AI Workbench API** | `http://127.0.0.1:8000/docs` | FastAPI + Swagger docs |
| **Llama-Swap Engine** | `http://127.0.0.1:8100/ui/` | Local model management UI |

---

## ⚡ One-Click Windows Installer (Hackathon Mode)

For judges and evaluators, a fully automated installer is provided:

1. Right-click `install-indra.ps1` → **Run with PowerShell**
2. The script will:
   - Auto-download required GGUF models from HuggingFace
   - Verify SHA-256 signatures
   - Configure model routing matrix
   - Set up backend services
   - Create an **INDRA Dashboard** shortcut on your Desktop
3. Double-click the shortcut to launch everything

> ⚠️ First launch takes ~10 seconds for backend services to initialize.

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
