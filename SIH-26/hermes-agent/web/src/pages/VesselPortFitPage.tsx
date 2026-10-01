import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
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
} from "lucide-react";

/* ── Port Constraints Database ───────────────────────────────── */
const PORTS_DB = [
  { name: "Paradip", maxLOA: 300, maxBeam: 50, maxDraft: 14.0, handlingRate: 35000, status: "operational" },
  { name: "Vizag", maxLOA: 325, maxBeam: 48, maxDraft: 16.0, handlingRate: 40000, status: "operational" },
  { name: "Gangavaram", maxLOA: 330, maxBeam: 52, maxDraft: 18.0, handlingRate: 45000, status: "operational" },
  { name: "Haldia", maxLOA: 230, maxBeam: 36, maxDraft: 8.5, handlingRate: 20000, status: "draft-restricted" },
  { name: "Dhamra", maxLOA: 340, maxBeam: 55, maxDraft: 18.0, handlingRate: 50000, status: "operational" },
  { name: "Gopalpur", maxLOA: 280, maxBeam: 45, maxDraft: 14.5, handlingRate: 30000, status: "operational" },
];

const VESSELS = [
  { class: "Capesize", dwt: "150,000–200,000", loa: 295, beam: 50, draft: 18.2 },
  { class: "Panamax", dwt: "65,000–85,000", loa: 229, beam: 32.3, draft: 13.5 },
  { class: "Supramax", dwt: "50,000–60,000", loa: 190, beam: 32.3, draft: 12.8 },
  { class: "Handysize", dwt: "28,000–40,000", loa: 170, beam: 27, draft: 10.0 },
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

  const selectedPort = PORTS_DB.find(p => p.name === destPort)!;
  const qtyNum = parseInt(quantity) || 75000;

  const recommendations = VESSELS.map(v => {
    const feasibility = checkFeasibility(v, selectedPort);
    const dwtMin = parseInt(v.dwt.replace(/,/g, "").split("–")[0]);
    const dwtMax = parseInt(v.dwt.replace(/,/g, "").split("–")[1]);
    const loadFactor = Math.min(1, qtyNum / dwtMax);
    const portDays = Math.ceil(qtyNum / selectedPort.handlingRate) + 1;
    const freightRate = 15 + Math.random() * 12;
    const totalCost = freightRate * qtyNum / 1000;
    const demurrageCost = portDays > 5 ? (portDays - 5) * 15000 : 0;

    return {
      ...v,
      feasibility,
      loadFactor,
      portDays,
      freightRate: freightRate.toFixed(2),
      totalCost: totalCost.toFixed(0),
      demurrageCost,
      score: feasibility === "feasible" ? 100 - (demurrageCost / 1000) - (1 - loadFactor) * 20 : feasibility === "partial" ? 40 : 0,
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / VESSEL & PORT FIT</span>
          <h2>Constraint-Aware Vessel Selection</h2>
          <p>Enter cargo details to get feasibility-checked vessel recommendations with cost ranking.</p>
        </div>
      </div>

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
      </section>

      {/* Vessel Feasibility Matrix */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Ship size={16} className="mi-icon-cyan" />
          <span>Vessel Recommendations (Ranked by Landed Cost)</span>
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
                <th>Rate ($/t)</th>
                <th>Est. Cost (₹L)</th>
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
                  <td>{r.freightRate}</td>
                  <td>{r.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
