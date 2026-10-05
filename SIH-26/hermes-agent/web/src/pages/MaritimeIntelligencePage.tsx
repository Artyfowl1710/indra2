import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import { DemoDataBadge, DataNoticeBanner } from "@/components/DemoDataBadge";
import {
  Activity,
  BarChart3,
  Globe,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/* ── Calibrated Benchmark Market Data (Demo Dataset) ─────────────────── */
const BDI_HISTORY = [1820, 1795, 1810, 1845, 1832, 1878, 1912, 1895, 1920, 1935, 1958, 1942, 1970];
const RATE_ROUTES = [
  { origin: "Australia", dest: "Paradip", vessel: "Capesize", rate: 18.45, change: +2.3, unit: "$/t", benchmark: "Baltic C5 Route" },
  { origin: "Australia", dest: "Vizag", vessel: "Panamax", rate: 22.10, change: -0.8, unit: "$/t", benchmark: "Baltic P1A Route" },
  { origin: "USA (East)", dest: "Haldia", vessel: "Panamax", rate: 28.75, change: +1.5, unit: "$/t", benchmark: "Hampton Roads - Haldia" },
  { origin: "Mozambique", dest: "Gangavaram", vessel: "Supramax", rate: 19.80, change: +3.1, unit: "$/t", benchmark: "Maputo - Gangavaram" },
  { origin: "Indonesia", dest: "Paradip", vessel: "Supramax", rate: 14.20, change: -1.2, unit: "$/t", benchmark: "Muara Pantai - Paradip" },
  { origin: "Russia", dest: "Vizag", vessel: "Panamax", rate: 25.50, change: +0.5, unit: "$/t", benchmark: "Taman - Vizag" },
  { origin: "Indonesia", dest: "Dhamra", vessel: "Handysize", rate: 16.90, change: +2.8, unit: "$/t", benchmark: "South Kalimantan - Dhamra" },
  { origin: "Australia", dest: "Gangavaram", vessel: "Capesize", rate: 17.20, change: +1.9, unit: "$/t", benchmark: "Hay Point - Gangavaram" },
];

const COMMODITIES = [
  { name: "Thermal Coal (Newcastle)", price: 142.50, change: +1.8, unit: "$/t", source: "Platts Newcastle 6000 kcal" },
  { name: "Coking Coal (PLV)", price: 218.30, change: -2.1, unit: "$/t", source: "Platts Premium Low Vol" },
  { name: "Bunker Fuel (VLSFO)", price: 612.00, change: +0.6, unit: "$/t", source: "Singapore 0.5% Marine Fuel" },
  { name: "Iron Ore (62% Fe)", price: 108.40, change: +3.2, unit: "$/t", source: "IODEX 62% Fe CFR China" },
];

const MARKET_NEWS = [
  { headline: "Cape rates firm on Australian iron ore demand surge", sentiment: "bullish", time: "2h ago", lane: "Australia → East India" },
  { headline: "Monsoon delays expected at Paradip; draft restrictions possible", sentiment: "warning", time: "4h ago", lane: "East Coast India" },
  { headline: "Indonesian coal export quotas tightened for Q4", sentiment: "bearish", time: "6h ago", lane: "Indonesia → India" },
  { headline: "Panama Canal transit delays easing; US Gulf rates stabilizing", sentiment: "neutral", time: "8h ago", lane: "US → India" },
  { headline: "Panamax FFA Q1 curve backwardation deepening", sentiment: "bearish", time: "12h ago", lane: "Global" },
];

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) return <span className="mi-change positive"><ArrowUpRight size={12} /> +{value}%</span>;
  if (value < 0) return <span className="mi-change negative"><ArrowDownRight size={12} /> {value}%</span>;
  return <span className="mi-change neutral"><Minus size={12} /> 0%</span>;
}

function MiniSparkline({ data, color = "#1a56db" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mi-sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={color} />
    </svg>
  );
}

export default function MaritimeIntelligencePage() {
  const { setAfterTitle, setEnd } = usePageHeader();
  const [selectedVessel, setSelectedVessel] = useState("All");

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  const filteredRoutes = selectedVessel === "All"
    ? RATE_ROUTES
    : RATE_ROUTES.filter(r => r.vessel === selectedVessel);

  return (
    <main className="mi-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / MARITIME INTELLIGENCE</span>
          <h2>Market Overview</h2>
          <p>Freight market benchmarks and commodity prices across key trade lanes for SAIL's East Coast operations.</p>
        </div>
        <div className="mi-header-meta">
          <DemoDataBadge type="calibrated" label="Demo Dataset (Calibrated)" />
          <span className="mi-timestamp">Source: Baltic & Platts Benchmarks</span>
        </div>
      </div>

      {/* Notice Banner */}
      <DataNoticeBanner
        title="Calibrated Market Benchmark Dataset"
        description="Figures shown in this dashboard are calibrated historical benchmarks based on the Baltic Dry Index (BDI), Platts coking coal indices, and Indian port tariffs. Live commercial API feeds require an active Baltic/S&P enterprise key."
      />

      {/* BDI + Commodities Row */}
      <div className="mi-top-row">
        <section className="mi-card mi-bdi-card">
          <div className="mi-card-header">
            <Activity size={16} className="mi-icon-cyan" />
            <span>Baltic Dry Index (BDI)</span>
            <DemoDataBadge type="calibrated" label="Benchmark" />
          </div>
          <div className="mi-bdi-value">
            <span className="mi-big-number">{BDI_HISTORY[BDI_HISTORY.length - 1].toLocaleString()}</span>
            <ChangeIndicator value={1.4} />
          </div>
          <MiniSparkline data={BDI_HISTORY} />
          <span className="mi-card-note">13-week trend · Calibrated Baltic series</span>
        </section>

        <section className="mi-card mi-commodities-card">
          <div className="mi-card-header">
            <BarChart3 size={16} className="mi-icon-cyan" />
            <span>Commodity Prices</span>
            <DemoDataBadge type="demo" label="Demo Reference" />
          </div>
          <div className="mi-commodity-grid">
            {COMMODITIES.map(c => (
              <div key={c.name} className="mi-commodity-row">
                <span className="mi-commodity-name" title={c.source}>{c.name}</span>
                <span className="mi-commodity-price">{c.price.toFixed(2)} {c.unit}</span>
                <ChangeIndicator value={c.change} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Rate Routes Table */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Globe size={16} className="mi-icon-cyan" />
          <span>Route-Specific Freight Rates</span>
          <DemoDataBadge type="calibrated" label="Calibrated Model" />
          <div className="mi-vessel-filter">
            {["All", "Capesize", "Panamax", "Supramax", "Handysize"].map(v => (
              <button
                key={v}
                className={`mi-filter-btn ${selectedVessel === v ? "active" : ""}`}
                onClick={() => setSelectedVessel(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="mi-table-wrap">
          <table className="mi-table">
            <thead>
              <tr>
                <th>Origin</th>
                <th>Destination</th>
                <th>Vessel Class</th>
                <th>Current Rate</th>
                <th>Change (7d)</th>
                <th>Benchmark Basis</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((r, i) => (
                <tr key={i}>
                  <td>{r.origin}</td>
                  <td>{r.dest}</td>
                  <td><span className={`mi-vessel-badge ${r.vessel.toLowerCase()}`}>{r.vessel}</span></td>
                  <td className="mi-rate">{r.rate.toFixed(2)} {r.unit}</td>
                  <td><ChangeIndicator value={r.change} /></td>
                  <td style={{ color: "#64748b", fontSize: "0.75rem" }}>{r.benchmark} (Demo)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "0.8rem", fontSize: "0.7rem", color: "#94a3b8" }}>
          * Rates ($/t) are calibrated demonstration figures benchmarked against Baltic Capesize/Panamax time-charter equivalents.
        </div>
      </section>

      {/* Market News */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Newspaper size={16} className="mi-icon-cyan" />
          <span>Market Signals (AI-Extracted)</span>
          <DemoDataBadge type="simulated" label="Simulated Signals" />
          <span className="mi-badge">LLM-parsed demo feed</span>
        </div>
        <div className="mi-news-list">
          {MARKET_NEWS.map((n, i) => (
            <article key={i} className="mi-news-item">
              <div className={`mi-sentiment-dot ${n.sentiment}`} />
              <div className="mi-news-content">
                <p>{n.headline}</p>
                <div className="mi-news-meta">
                  <span className="mi-news-lane">{n.lane}</span>
                  <span>{n.time} · Simulated feed</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
