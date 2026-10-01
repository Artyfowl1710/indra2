import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  DollarSign,
  Shield,
} from "lucide-react";

/* ── Scenario Comparison Data ────────────────────────────────── */
const SCENARIOS = [
  {
    name: "Spot (Baseline)",
    desc: "Fix each cargo individually at prevailing market rate",
    totalCost: 142.5,
    costPerTonne: 19.00,
    riskCVaR: 28.5,
    flexibility: "Maximum",
    commitment: "None",
    pros: ["No upfront commitment", "Full flexibility to shift routes"],
    cons: ["Fully exposed to rate spikes", "No volume discount", "Highest expected cost"],
    color: "#ef4444",
  },
  {
    name: "Short-Term (3-month)",
    desc: "3-month contract with fixed rate, 4 voyages minimum",
    totalCost: 128.3,
    costPerTonne: 17.10,
    riskCVaR: 18.2,
    flexibility: "Limited",
    commitment: "4 voyages",
    pros: ["10% avg savings vs spot", "Rate certainty for Q1", "Reduced admin overhead"],
    cons: ["Must commit minimum 4 voyages", "Less route flexibility", "Early termination penalty"],
    color: "#f59e0b",
  },
  {
    name: "Multi-Voyage (6-month)",
    desc: "Semi-annual contract with 8-12 voyages, volume-based pricing",
    totalCost: 112.8,
    costPerTonne: 15.04,
    riskCVaR: 12.1,
    flexibility: "Moderate",
    commitment: "8-12 voyages",
    pros: ["21% avg savings vs spot", "Volume discount", "Priority berthing at some ports"],
    cons: ["6-month commitment", "Fixed vessel class", "Penalty for under-shipment"],
    color: "#10b981",
  },
];

function CostBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="cs-cost-bar">
      <div className="cs-cost-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  );
}

export default function ContractScenariosPage() {
  const { setAfterTitle, setEnd } = usePageHeader();
  const [cargoQty, setCargoQty] = useState("75000");
  const [voyages, setVoyages] = useState("8");

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  const maxCost = Math.max(...SCENARIOS.map(s => s.totalCost));

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / CHARTER PLANNING / CONTRACT SCENARIOS</span>
          <h2>Contract Strategy Simulator</h2>
          <p>Compare Spot vs Short-Term vs Multi-Voyage contracts on expected cost and risk (CVaR).</p>
        </div>
      </div>

      {/* Parameters */}
      <div className="ff-controls">
        <div className="ff-control-group">
          <label>Cargo per Voyage (MT)</label>
          <input type="number" value={cargoQty} onChange={e => setCargoQty(e.target.value)} className="vp-input" />
        </div>
        <div className="ff-control-group">
          <label>Planned Voyages (annual)</label>
          <input type="number" value={voyages} onChange={e => setVoyages(e.target.value)} className="vp-input" />
        </div>
        <div className="ff-control-group">
          <label>Route</label>
          <div className="ff-select-wrap">
            <select><option>Australia → Paradip (Capesize)</option></select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="cs-scenario-grid">
        {SCENARIOS.map((s, i) => (
          <section key={s.name} className={`mi-card cs-scenario-card ${i === 2 ? "recommended" : ""}`}>
            {i === 2 && <div className="cs-recommended-badge">RECOMMENDED</div>}
            <div className="cs-scenario-header" style={{ borderColor: s.color }}>
              <h4 style={{ color: s.color }}>{s.name}</h4>
              <p>{s.desc}</p>
            </div>

            <div className="cs-scenario-metrics">
              <div className="cs-metric">
                <DollarSign size={14} style={{ color: s.color }} />
                <div>
                  <span className="cs-metric-value">₹{s.totalCost} Cr</span>
                  <span className="cs-metric-label">Total Cost (annual)</span>
                </div>
              </div>
              <CostBar value={s.totalCost} max={maxCost} color={s.color} />

              <div className="cs-metric">
                <TrendingUp size={14} style={{ color: s.color }} />
                <div>
                  <span className="cs-metric-value">${s.costPerTonne}/t</span>
                  <span className="cs-metric-label">Cost per Tonne</span>
                </div>
              </div>

              <div className="cs-metric">
                <Shield size={14} style={{ color: s.color }} />
                <div>
                  <span className="cs-metric-value">₹{s.riskCVaR} Cr</span>
                  <span className="cs-metric-label">CVaR (95% downside)</span>
                </div>
              </div>

              <div className="cs-metric">
                <AlertTriangle size={14} style={{ color: s.color }} />
                <div>
                  <span className="cs-metric-value">{s.commitment}</span>
                  <span className="cs-metric-label">Commitment</span>
                </div>
              </div>
            </div>

            <div className="cs-pros-cons">
              <div className="cs-pros">
                <span className="cs-label">Advantages</span>
                <ul>{s.pros.map(p => <li key={p}>✓ {p}</li>)}</ul>
              </div>
              <div className="cs-cons">
                <span className="cs-label">Trade-offs</span>
                <ul>{s.cons.map(c => <li key={c}>• {c}</li>)}</ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Savings Summary */}
      <section className="mi-card">
        <div className="mi-card-header">
          <BarChart3 size={16} className="mi-icon-cyan" />
          <span>Monte Carlo Simulation Results (10,000 scenarios)</span>
        </div>
        <div className="cs-summary">
          <div className="cs-summary-item">
            <span className="cs-summary-label">Expected Annual Savings (Multi-Voyage vs Spot)</span>
            <span className="cs-summary-value savings">₹29.7 Cr</span>
          </div>
          <div className="cs-summary-item">
            <span className="cs-summary-label">Probability of Multi-Voyage Outperforming Spot</span>
            <span className="cs-summary-value">87.3%</span>
          </div>
          <div className="cs-summary-item">
            <span className="cs-summary-label">Worst-Case Scenario (P5)</span>
            <span className="cs-summary-value warn">₹8.2 Cr saving still realized</span>
          </div>
        </div>
      </section>
    </main>
  );
}
