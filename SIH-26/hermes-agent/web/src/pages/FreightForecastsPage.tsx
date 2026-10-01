import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Info,
} from "lucide-react";

/* ── Synthetic Forecast Data ─────────────────────────────────── */
const VESSEL_CLASSES = ["Capesize", "Panamax", "Supramax", "Handysize"] as const;
const ROUTES = [
  "Australia → Paradip",
  "Australia → Vizag",
  "Australia → Gangavaram",
  "USA (East) → Haldia",
  "Mozambique → Gangavaram",
  "Indonesia → Paradip",
  "Indonesia → Dhamra",
  "Russia → Vizag",
] as const;
const HORIZONS = ["Short (1-4 weeks)", "Medium (1-3 months)", "Long (3-12 months)"] as const;

function generateForecastData(weeks: number) {
  const base = 18 + Math.random() * 8;
  const data = [];
  for (let i = 0; i < weeks; i++) {
    const t = base + Math.sin(i * 0.3) * 3 + (Math.random() - 0.5) * 2 + i * 0.15;
    data.push({
      week: i,
      p10: t - 2.5 - Math.random(),
      p50: t,
      p90: t + 2.5 + Math.random(),
      actual: i < weeks * 0.6 ? t + (Math.random() - 0.5) * 1.5 : null,
    });
  }
  return data;
}

function ForecastChart({ data }: { data: ReturnType<typeof generateForecastData> }) {
  const allVals = data.flatMap(d => [d.p10, d.p50, d.p90, d.actual].filter(Boolean) as number[]);
  const min = Math.min(...allVals) - 1;
  const max = Math.max(...allVals) + 1;
  const range = max - min || 1;
  const W = 700;
  const H = 260;
  const pad = 40;
  const plotW = W - pad * 2;
  const plotH = H - pad * 2;

  const x = (i: number) => pad + (i / (data.length - 1)) * plotW;
  const y = (v: number) => pad + plotH - ((v - min) / range) * plotH;

  const bandPath = data.map((d, i) => `${x(i)},${y(d.p10)}`).join(" ");
  const bandPathRev = [...data].reverse().map((d, i) => `${x(data.length - 1 - i)},${y(d.p90)}`).join(" ");
  const p50Path = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.p50)}`).join(" ");

  const splitIdx = data.findIndex(d => d.actual === null);
  const actualPath = data
    .filter(d => d.actual !== null)
    .map((d, i) => `${i === 0 ? "M" : "L"}${x(d.week)},${y(d.actual!)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ff-chart">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <g key={f}>
          <line x1={pad} x2={W - pad} y1={pad + plotH * f} y2={pad + plotH * f} stroke="rgba(30,58,95,0.1)" />
          <text x={pad - 6} y={pad + plotH * f + 4} textAnchor="end" className="ff-axis-label">
            {(max - f * range).toFixed(1)}
          </text>
        </g>
      ))}

      {/* Forecast split line */}
      {splitIdx > 0 && (
        <line x1={x(splitIdx)} x2={x(splitIdx)} y1={pad} y2={H - pad} stroke="rgba(26,86,219,0.3)" strokeDasharray="4 4" />
      )}
      {splitIdx > 0 && (
        <text x={x(splitIdx) + 4} y={pad + 12} className="ff-forecast-label">FORECAST →</text>
      )}

      {/* P10–P90 band */}
      <polygon points={`${bandPath} ${bandPathRev}`} fill="rgba(26,86,219,0.08)" />

      {/* P10 line */}
      <polyline points={data.map((d, i) => `${x(i)},${y(d.p10)}`).join(" ")} fill="none" stroke="rgba(26,86,219,0.25)" strokeWidth="1" />
      {/* P90 line */}
      <polyline points={data.map((d, i) => `${x(i)},${y(d.p90)}`).join(" ")} fill="none" stroke="rgba(26,86,219,0.25)" strokeWidth="1" />

      {/* P50 median */}
      <path d={p50Path} fill="none" stroke="#1a56db" strokeWidth="2" />

      {/* Actual */}
      {actualPath && <path d={actualPath} fill="none" stroke="#10b981" strokeWidth="2" />}

      {/* Legend */}
      <g transform={`translate(${pad + 8}, ${H - 14})`}>
        <line x1="0" x2="16" y1="0" y2="0" stroke="#10b981" strokeWidth="2" />
        <text x="20" y="4" className="ff-legend-label">Actual</text>
        <line x1="80" x2="96" y1="0" y2="0" stroke="#1a56db" strokeWidth="2" />
        <text x="100" y="4" className="ff-legend-label">P50 (Median)</text>
        <rect x="200" y="-5" width="16" height="10" fill="rgba(26,86,219,0.15)" rx="2" />
        <text x="220" y="4" className="ff-legend-label">P10–P90 Band</text>
      </g>
    </svg>
  );
}

const METRICS = [
  { label: "MAE", value: "1.24 $/t", desc: "Mean Absolute Error" },
  { label: "MAPE", value: "5.8%", desc: "Mean Absolute Percentage Error" },
  { label: "Dir. Accuracy", value: "78.3%", desc: "Directional accuracy" },
  { label: "Pinball (P50)", value: "0.62", desc: "Quantile loss at median" },
];

export default function FreightForecastsPage() {
  const { setAfterTitle, setEnd } = usePageHeader();
  const [vessel, setVessel] = useState<string>("Capesize");
  const [route, setRoute] = useState<string>("Australia → Paradip");
  const [horizon, setHorizon] = useState<string>("Medium (1-3 months)");
  const [data, setData] = useState(() => generateForecastData(26));

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  useEffect(() => {
    const weeks = horizon.includes("Short") ? 8 : horizon.includes("Medium") ? 26 : 52;
    setData(generateForecastData(weeks));
  }, [vessel, route, horizon]);

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / FREIGHT FORECASTS</span>
          <h2>Rate Forecasting Engine</h2>
          <p>Multi-horizon freight rate predictions with probabilistic confidence bands (P10/P50/P90).</p>
        </div>
      </div>

      {/* Controls */}
      <div className="ff-controls">
        <div className="ff-control-group">
          <label>Vessel Class</label>
          <div className="ff-select-wrap">
            <select value={vessel} onChange={e => setVessel(e.target.value)}>
              {VESSEL_CLASSES.map(v => <option key={v}>{v}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="ff-control-group">
          <label>Trade Route</label>
          <div className="ff-select-wrap">
            <select value={route} onChange={e => setRoute(e.target.value)}>
              {ROUTES.map(r => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="ff-control-group">
          <label>Horizon</label>
          <div className="ff-select-wrap">
            <select value={horizon} onChange={e => setHorizon(e.target.value)}>
              {HORIZONS.map(h => <option key={h}>{h}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <section className="mi-card">
        <div className="mi-card-header">
          <TrendingUp size={16} className="mi-icon-cyan" />
          <span>Freight Rate Forecast — {vessel} — {route}</span>
        </div>
        <ForecastChart data={data} />
        <div className="ff-chart-footer">
          <span>Horizon: {horizon}</span>
          <span>Ensemble: SARIMAX + LightGBM + TFT</span>
          <span>Retrained: 2 days ago</span>
        </div>
      </section>

      {/* Metrics */}
      <div className="ff-metrics-grid">
        {METRICS.map(m => (
          <div key={m.label} className="ff-metric-card">
            <div className="ff-metric-label">
              {m.label}
              <Info size={12} className="ff-metric-info" title={m.desc} />
            </div>
            <div className="ff-metric-value">{m.value}</div>
            <div className="ff-metric-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Backtest */}
      <section className="mi-card">
        <div className="mi-card-header">
          <BarChart3 size={16} className="mi-icon-cyan" />
          <span>Backtest Performance vs Spot Baseline</span>
        </div>
        <div className="ff-backtest-grid">
          <div className="ff-backtest-item">
            <span className="ff-backtest-label">Strategy</span>
            <span className="ff-backtest-value">Model-Timed Entry</span>
          </div>
          <div className="ff-backtest-item">
            <span className="ff-backtest-label">Period</span>
            <span className="ff-backtest-value">Jan 2024 – Sep 2026</span>
          </div>
          <div className="ff-backtest-item highlight">
            <span className="ff-backtest-label">Savings vs Spot</span>
            <span className="ff-backtest-value savings">₹3.8 Cr / year</span>
          </div>
          <div className="ff-backtest-item">
            <span className="ff-backtest-label">Win Rate</span>
            <span className="ff-backtest-value">72% of entries</span>
          </div>
        </div>
      </section>
    </main>
  );
}
