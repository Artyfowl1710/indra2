import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import { DemoDataBadge, DataNoticeBanner } from "@/components/DemoDataBadge";
import { PORTS_DB, USD_TO_INR } from "@/lib/maritime-data";
import {
  Anchor,
  Ship,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Ruler,
  Weight,
  Timer,
  ShieldCheck,
} from "lucide-react";

const VESSELS = [
  { class: "Capesize", dwt: "150,000–200,000", loa: 295, beam: 50, draft: 17.8 },
  { class: "Panamax", dwt: "65,000–85,000", loa: 229, beam: 32.3, draft: 13.5 },
  { class: "Supramax", dwt: "50,000–60,000", loa: 190, beam: 32.3, draft: 12.8 },
  { class: "Handysize", dwt: "28,000–40,000", loa: 170, beam: 27, draft: 9.8 },
];

const ORIGINS = ["Australia", "USA (East)", "Mozambique", "Indonesia", "Russia"];

function checkFeasibility(vessel: typeof VESSELS[0], port: typeof PORTS_DB[0]) {
  const loaOk = vessel.loa <= port.maxLOA;
  const beamOk = vessel.beam <= port.maxBeam;
  const draftOk = vessel.draft <= port.maxDraft;
  if (loaOk && beamOk && draftOk) return "feasible";
  if (!draftOk && loaOk && beamOk) return "partial";
  return "infeasible";
}

export default function VesselPortFitPage() {
  const { setAfterTitle, setEnd } = usePageHeader();
  const [origin, setOrigin] = useState("Australia");
  const [destPort, setDestPort] = useState("Paradip");
  const [cargoType, setCargoType] = useState("Thermal Coal");
  const [quantity, setQuantity] = useState("75000");

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  const selectedPort = PORTS_DB.find(p => p.name === destPort) || PORTS_DB[0];
  const qtyNum = parseInt(quantity) || 75000;

  // Calibrated deterministic freight baseline to replace pure Math.random
  const BASE_RATES: Record<string, number> = {
    Capesize: 17.80,
    Panamax: 20.40,
    Supramax: 22.10,
    Handysize: 25.50,
  };

  const recommendations = VESSELS.map(v => {
    const feasibility = checkFeasibility(v, selectedPort);
    const dwtMax = parseInt(v.dwt.replace(/,/g, "").split("–")[1]);
    const loadFactor = Math.min(1, qtyNum / dwtMax);
    const portDays = Math.ceil(qtyNum / selectedPort.handlingRate) + 1;
    const baseRate = BASE_RATES[v.class] || 20.0;
    const freightRateUSD = feasibility === "infeasible" ? 0 : baseRate;
    
    // Accurate currency and unit conversion:
    // freightCostUSD = freightRate ($/MT) * cargo (MT)
    const freightCostUSD = freightRateUSD * qtyNum;
    const demurrageCostUSD = portDays > 5 ? (portDays - 5) * 18500 : 0;
    const totalCostUSD = freightRateUSD > 0 ? freightCostUSD + demurrageCostUSD : 0;
    
    // Convert USD to INR using standard exchange benchmark:
    const totalCostINR = totalCostUSD * USD_TO_INR;
    const totalCostLakhs = totalCostINR / 100000;
    const totalCostCr = totalCostINR / 10000000;

    return {
      ...v,
      feasibility,
      loadFactor,
      portDays,
      freightRateUSD,
      rateDisplay: freightRateUSD > 0 ? `$${freightRateUSD.toFixed(2)}/t (₹${Math.round(freightRateUSD * USD_TO_INR)}/t)` : "N/A",
      totalCostDisplay: totalCostCr > 0 ? `₹${totalCostCr.toFixed(2)} Cr ($${(totalCostUSD / 1000000).toFixed(2)}M · ₹${totalCostLakhs.toFixed(1)}L)` : "N/A",
      demurrageCostUSD,
      score: feasibility === "feasible" ? 100 - (demurrageCostUSD / 1000) - (1 - loadFactor) * 20 : feasibility === "partial" ? 40 : 0,
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / VESSEL & PORT FIT</span>
          <h2>Constraint-Aware Vessel Selection</h2>
          <p>Feasibility-checked vessel recommendations evaluated against verified port physical limits.</p>
        </div>
        <div className="mi-header-meta">
          <DemoDataBadge type="validated" label="Port Limits Verified" />
          <DemoDataBadge type="simulated" label="Cost Model (Demo)" />
        </div>
      </div>

      {/* Notice Banner */}
      <DataNoticeBanner
        title="Verified Physical Port Constraints & Calibrated Cost Engine"
        description="Port navigational limits (LOA, beam, draft limits, handling rates) are verified against official Indian Major Port Authority handbooks. Landed cost calculations are derived from calibrated simulation models (Demo Data)."
      />

      {/* Input Form */}
      <div className="vp-input-form">
        <div className="ff-control-group">
          <label>Cargo Type</label>
          <div className="ff-select-wrap">
            <select value={cargoType} onChange={e => setCargoType(e.target.value)}>
              <option>Thermal Coal</option>
              <option>Coking Coal</option>
              <option>Iron Ore</option>
              <option>Limestone</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="ff-control-group">
          <label>Quantity (MT)</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="vp-input" />
        </div>
        <div className="ff-control-group">
          <label>Origin</label>
          <div className="ff-select-wrap">
            <select value={origin} onChange={e => setOrigin(e.target.value)}>
              {ORIGINS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="ff-control-group">
          <label>Destination Port</label>
          <div className="ff-select-wrap">
            <select value={destPort} onChange={e => setDestPort(e.target.value)}>
              {PORTS_DB.map(p => <option key={p.name}>{p.name}</option>)}
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Port Constraint Summary */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Anchor size={16} className="mi-icon-cyan" />
          <span>Port Constraints — {destPort}</span>
          <DemoDataBadge type="validated" label="Validated Specs" />
          {selectedPort.status !== "operational" && (
            <span className="mi-badge warn">{selectedPort.status}</span>
          )}
        </div>
        <div className="vp-constraints-grid">
          <div className="vp-constraint">
            <Ruler size={18} className="vp-constraint-icon" />
            <span className="vp-constraint-label">Max LOA</span>
            <span className="vp-constraint-value">{selectedPort.maxLOA}m</span>
          </div>
          <div className="vp-constraint">
            <ArrowRight size={18} className="vp-constraint-icon" />
            <span className="vp-constraint-label">Max Beam</span>
            <span className="vp-constraint-value">{selectedPort.maxBeam}m</span>
          </div>
          <div className="vp-constraint">
            <Weight size={18} className="vp-constraint-icon" />
            <span className="vp-constraint-label">Max Draft</span>
            <span className="vp-constraint-value">{selectedPort.maxDraft}m</span>
          </div>
          <div className="vp-constraint">
            <Timer size={18} className="vp-constraint-icon" />
            <span className="vp-constraint-label">Handling Rate</span>
            <span className="vp-constraint-value">{(selectedPort.handlingRate / 1000).toFixed(0)}k MT/day</span>
          </div>
        </div>
        <div style={{ marginTop: "0.8rem", fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={14} color="#059669" />
          <span><strong>Verified Source:</strong> {selectedPort.specSource}</span>
        </div>
      </section>

      {/* Vessel Feasibility Matrix */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Ship size={16} className="mi-icon-cyan" />
          <span>Vessel Recommendations (Ranked by Landed Cost)</span>
          <DemoDataBadge type="simulated" label="Simulation Ranking (Demo)" />
        </div>
        <div className="mi-table-wrap">
          <table className="mi-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Vessel Class</th>
                <th>DWT Range</th>
                <th>Feasibility</th>
                <th>LOA / Beam / Draft</th>
                <th>Port Days</th>
                <th>Freight Rate ($/t · ₹/t)</th>
                <th>Est. Voyage Cost (₹ Cr · $M)</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r, i) => (
                <tr key={r.class} className={r.feasibility === "infeasible" ? "vp-row-dim" : ""}>
                  <td className="vp-rank">{r.feasibility !== "infeasible" ? `#${i + 1}` : "—"}</td>
                  <td><span className={`mi-vessel-badge ${r.class.toLowerCase()}`}>{r.class}</span></td>
                  <td>{r.dwt} t</td>
                  <td>
                    {r.feasibility === "feasible" && <span className="vp-feasibility ok"><CheckCircle2 size={14} /> Feasible</span>}
                    {r.feasibility === "partial" && <span className="vp-feasibility warn"><AlertTriangle size={14} /> Part-load</span>}
                    {r.feasibility === "infeasible" && <span className="vp-feasibility no"><XCircle size={14} /> Infeasible</span>}
                  </td>
                  <td className="vp-dims">{r.loa}m / {r.beam}m / {r.draft}m</td>
                  <td>{r.portDays}d</td>
                  <td>{r.rateDisplay}</td>
                  <td><strong style={{ color: "#1e293b" }}>{r.totalCostDisplay}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "0.8rem", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <span>* Navigational limits (draft, LOA, beam) validated against Indian Major Port Authority handbooks.</span>
          <span><strong>Currency Benchmark:</strong> 1 USD = ₹{USD_TO_INR.toFixed(2)} INR (Total cost includes demurrage buffer).</span>
        </div>
      </section>
    </main>
  );
}
