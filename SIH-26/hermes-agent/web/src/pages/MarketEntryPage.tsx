import { useEffect } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import {
  Calendar,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";

/* ── Entry Windows Data ──────────────────────────────────────── */
const WINDOWS = [
  {
    period: "Oct 7–14, 2026",
    route: "Australia → Paradip",
    vessel: "Capesize",
    signal: "strong-buy",
    rateForecast: "16.80 $/t",
    reason: "Seasonal demand trough + forecast P50 at 3-month low. P90 still below current spot.",
    savings: "~₹0.8 Cr vs current spot",
    confidence: 82,
  },
  {
    period: "Oct 21–28, 2026",
    route: "Indonesia → Dhamra",
    vessel: "Supramax",
    signal: "moderate-buy",
    rateForecast: "13.50 $/t",
    reason: "Indonesian export quotas tightening Q4 — rates expected to rise after Nov. Lock in before.",
    savings: "~₹0.4 Cr vs Q4 forecast",
    confidence: 71,
  },
  {
    period: "Nov 1–10, 2026",
    route: "USA (East) → Haldia",
    vessel: "Panamax",
    signal: "wait",
    rateForecast: "27.20 $/t",
    reason: "Panama Canal delays creating temporary premium. Expected to normalize by mid-November.",
    savings: "Wait for ~₹0.6 Cr saving",
    confidence: 65,
  },
  {
    period: "Nov 15–30, 2026",
    route: "Mozambique → Gangavaram",
    vessel: "Supramax",
    signal: "strong-buy",
    rateForecast: "18.10 $/t",
    reason: "Post-monsoon clearing + new berth at Gangavaram reducing congestion surcharge.",
    savings: "~₹1.1 Cr vs H1 average",
    confidence: 78,
  },
];

const LADDER_STRATEGY = [
  { tranche: "T1 (30%)", timing: "Week 1", rate: "17.20", status: "recommended" },
  { tranche: "T2 (30%)", timing: "Week 3", rate: "16.80", status: "recommended" },
  { tranche: "T3 (20%)", timing: "Week 5", rate: "16.50", status: "conditional" },
  { tranche: "T4 (20%)", timing: "Week 7", rate: "TBD", status: "hold" },
];

export default function MarketEntryPage() {
  const { setAfterTitle, setEnd } = usePageHeader();

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / CHARTER PLANNING / MARKET ENTRY</span>
          <h2>Market Entry Timing</h2>
          <p>Forecast-driven windows to secure charters at optimal rates. Laddered commitment strategies.</p>
        </div>
      </div>

      {/* Entry Windows */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Calendar size={16} className="mi-icon-cyan" />
          <span>Recommended Entry Windows (Next 60 Days)</span>
        </div>
        <div className="me-windows">
          {WINDOWS.map((w, i) => (
            <article key={i} className={`me-window ${w.signal}`}>
              <div className="me-window-signal">
                {w.signal === "strong-buy" && <Target size={18} />}
                {w.signal === "moderate-buy" && <TrendingDown size={18} />}
                {w.signal === "wait" && <Clock size={18} />}
                <span>{w.signal.replace("-", " ").toUpperCase()}</span>
              </div>
              <div className="me-window-body">
                <div className="me-window-top">
                  <h4>{w.period}</h4>
                  <span className="me-route">{w.route} · {w.vessel}</span>
                </div>
                <p className="me-reason">{w.reason}</p>
                <div className="me-window-metrics">
                  <div className="me-metric">
                    <span className="me-metric-label">Forecast Rate</span>
                    <span className="me-metric-value">{w.rateForecast}</span>
                  </div>
                  <div className="me-metric">
                    <span className="me-metric-label">Est. Savings</span>
                    <span className="me-metric-value savings">{w.savings}</span>
                  </div>
                  <div className="me-metric">
                    <span className="me-metric-label">Confidence</span>
                    <div className="me-confidence-bar">
                      <div className="me-confidence-fill" style={{ width: `${w.confidence}%` }} />
                      <span>{w.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Laddered Strategy */}
      <section className="mi-card">
        <div className="mi-card-header">
          <ArrowRight size={16} className="mi-icon-cyan" />
          <span>Laddered Commitment Strategy (Australia → Paradip · Capesize)</span>
        </div>
        <p className="me-strategy-desc">
          Instead of a single lump commitment, split the cargo volume across tranches timed to the forecast curve.
          Each tranche locks a portion at progressively lower expected rates.
        </p>
        <div className="me-ladder">
          {LADDER_STRATEGY.map((s, i) => (
            <div key={i} className={`me-ladder-step ${s.status}`}>
              <div className="me-ladder-index">{i + 1}</div>
              <div className="me-ladder-info">
                <strong>{s.tranche}</strong>
                <span>{s.timing}</span>
              </div>
              <div className="me-ladder-rate">
                <span className="me-metric-label">Target Rate</span>
                <span>{s.rate} $/t</span>
              </div>
              <div className="me-ladder-status">
                {s.status === "recommended" && <CheckCircle2 size={14} className="me-status-ok" />}
                {s.status === "conditional" && <Clock size={14} className="me-status-warn" />}
                {s.status === "hold" && <span className="me-status-hold">HOLD</span>}
                <span>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
