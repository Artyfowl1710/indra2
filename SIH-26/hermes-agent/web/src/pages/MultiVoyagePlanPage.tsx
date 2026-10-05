import { useEffect } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import { DemoDataBadge, DataNoticeBanner } from "@/components/DemoDataBadge";
import {
  Ship,
  Calendar,
  MapPin,
  Clock,
  Anchor,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

/* ── Multi-Voyage Plan Data (Demo Fixture Schedule) ──────────── */
const VOYAGES = [
  {
    id: "MV-001",
    origin: "Newcastle, AU",
    dest: "Dhamra",
    vessel: "Capesize",
    cargo: "Coking Coal",
    qty: "165,000 MT",
    etl: "Oct 12",
    eta: "Nov 2",
    status: "loading",
    rate: "17.50 $/t",
    draftNote: "18.0m Verified Basin",
  },
  {
    id: "MV-002",
    origin: "Gladstone, AU",
    dest: "Gangavaram",
    vessel: "Capesize",
    cargo: "Coking Coal",
    qty: "170,000 MT",
    etl: "Oct 28",
    eta: "Nov 18",
    status: "scheduled",
    rate: "17.80 $/t",
    draftNote: "18.5m Deep Berth 1",
  },
  {
    id: "MV-003",
    origin: "Hay Point, AU",
    dest: "Vizag",
    vessel: "Panamax",
    cargo: "Coking Coal",
    qty: "75,000 MT",
    etl: "Nov 15",
    eta: "Dec 5",
    status: "planned",
    rate: "21.20 $/t",
    draftNote: "16.0m Outer Harbour",
  },
  {
    id: "MV-004",
    origin: "Newcastle, AU",
    dest: "Paradip",
    vessel: "Panamax",
    cargo: "Thermal Coal",
    qty: "75,000 MT",
    etl: "Dec 1",
    eta: "Dec 21",
    status: "planned",
    rate: "20.40 $/t",
    draftNote: "14.5m CQ Berth Limit",
  },
  {
    id: "MV-005",
    origin: "Hay Point, AU",
    dest: "Dhamra",
    vessel: "Capesize",
    cargo: "Coking Coal",
    qty: "165,000 MT",
    etl: "Dec 18",
    eta: "Jan 7",
    status: "planned",
    rate: "17.50 $/t",
    draftNote: "18.0m Deepwater Basin",
  },
];

const IDLE_INSIGHTS = [
  {
    period: "Nov 5–14",
    desc: "Vessel repositioning from Paradip to Hay Point. Consider ballast leg optimization via Singapore bunker stop.",
    saving: "~$45,000 bunker savings",
    type: "positioning",
  },
  {
    period: "Dec 8–17",
    desc: "Low-demand window. Vessel idle for 9 days between MV-003 discharge and MV-004 load.",
    saving: "Consider short coastal run (Vizag → Gangavaram limestone) to offset idle cost",
    type: "idle",
  },
];

export default function MultiVoyagePlanPage() {
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
          <span className="mi-overline">INDRA / CHARTER PLANNING / MULTI-VOYAGE PLAN</span>
          <h2>Multi-Voyage Contract Planner</h2>
          <p>6-month voyage schedule with idle-time optimization and fleet positioning strategy (Demo Schedule).</p>
        </div>
        <div className="mi-header-meta">
          <DemoDataBadge type="demo" label="Demo Schedule" />
          <DemoDataBadge type="calibrated" label="Spot Calibrated" />
        </div>
      </div>

      {/* Notice Banner */}
      <DataNoticeBanner
        title="Demonstration Multi-Voyage Schedule"
        description="Shipment itineraries, laycan windows, and vessel repositioning insights are demonstration planning models calibrated for SAIL's East Coast intake."
      />

      {/* Contract Summary */}
      <div className="mv-summary-strip">
        <div className="mv-summary-item">
          <span className="mv-summary-label">Contract Period</span>
          <span className="mv-summary-value">Oct 2026 – Mar 2027</span>
        </div>
        <div className="mv-summary-item">
          <span className="mv-summary-label">Total Voyages</span>
          <span className="mv-summary-value">{VOYAGES.length} (Demo)</span>
        </div>
        <div className="mv-summary-item">
          <span className="mv-summary-label">Total Cargo</span>
          <span className="mv-summary-value">810,000 MT</span>
        </div>
        <div className="mv-summary-item">
          <span className="mv-summary-label">Contracted Rate</span>
          <span className="mv-summary-value">16.80–17.20 $/t</span>
        </div>
        <div className="mv-summary-item highlight">
          <span className="mv-summary-label">Est. Savings vs Spot (Demo)</span>
          <span className="mv-summary-value savings">₹4.8 Cr</span>
        </div>
      </div>

      {/* Voyage Timeline */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Calendar size={16} className="mi-icon-cyan" />
          <span>Voyage Schedule</span>
          <DemoDataBadge type="demo" label="Demo Fixtures" />
        </div>
        <div className="mv-timeline">
          {VOYAGES.map((v, i) => (
            <div key={v.id} className={`mv-voyage ${v.status}`}>
              <div className="mv-voyage-line">
                <div className={`mv-voyage-dot ${v.status}`} />
                {i < VOYAGES.length - 1 && <div className="mv-voyage-connector" />}
              </div>
              <div className="mv-voyage-card">
                <div className="mv-voyage-header">
                  <span className="mv-voyage-id">{v.id}</span>
                  <span className={`mv-status-badge ${v.status}`}>
                    {v.status === "loading" ? "LOADING" : v.status === "scheduled" ? "SCHEDULED" : "PLANNED"}
                  </span>
                </div>
                <div className="mv-voyage-route">
                  <div className="mv-route-point">
                    <MapPin size={12} />
                    <span>{v.origin}</span>
                    <span className="mv-date">{v.etl}</span>
                  </div>
                  <ArrowRight size={14} className="mv-arrow" />
                  <div className="mv-route-point">
                    <Anchor size={12} />
                    <span>{v.dest}</span>
                    <span className="mv-date">{v.eta}</span>
                  </div>
                </div>
                <div className="mv-voyage-details">
                  <span><Ship size={12} /> {v.vessel}</span>
                  <span>{v.cargo} · {v.qty}</span>
                  <span>{v.rate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Idle Time Insights */}
      <section className="mi-card">
        <div className="mi-card-header">
          <Clock size={16} className="mi-icon-cyan" />
          <span>Idle Time & Positioning Insights (Demo Optimization)</span>
          <DemoDataBadge type="simulated" label="Simulated Insights" />
        </div>
        <div className="mv-idle-list">
          {IDLE_INSIGHTS.map((ins, i) => (
            <div key={i} className={`mv-idle-item ${ins.type}`}>
              <div className="mv-idle-icon">
                {ins.type === "positioning" ? <Ship size={16} /> : <AlertTriangle size={16} />}
              </div>
              <div className="mv-idle-content">
                <div className="mv-idle-header">
                  <strong>{ins.period}</strong>
                  <span className="mv-idle-type">{ins.type}</span>
                </div>
                <p>{ins.desc}</p>
                <span className="mv-idle-saving"><CheckCircle2 size={12} /> {ins.saving}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
