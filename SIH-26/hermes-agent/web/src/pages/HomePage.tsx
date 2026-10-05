import { useEffect } from "react";
import { Link } from "react-router";
import {
  Anchor,
  BarChart2,
  Ship,
  AlertTriangle,
  TrendingUp,
  Bell,
  ChevronRight,
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { usePageHeader } from "@/contexts/usePageHeader";
import { DemoDataBadge, DataNoticeBanner } from "@/components/DemoDataBadge";
import { SailHeroBanner } from "@/components/SailHeroBanner";
import "./home-page.css";

/* ── KPI Cards (Calibrated Demonstration Series) ────────────────── */
const KPIS = [
  {
    label: "Active Vessels (Demo)",
    value: "12",
    delta: "+2 this week",
    deltaPositive: true,
    icon: Ship,
    color: "#1a56db",
    bg: "#eff6ff",
  },
  {
    label: "Forecast Accuracy (Backtest)",
    value: "89.2%",
    delta: "+5.1% vs last month",
    deltaPositive: true,
    icon: TrendingUp,
    color: "#059669",
    bg: "#f0fdf4",
  },
  {
    label: "Cost Savings (Model YTD)",
    value: "₹4.2 Cr",
    delta: "YTD vs spot baseline",
    deltaPositive: true,
    icon: BarChart2,
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    label: "Active Alerts (Sim)",
    value: "3",
    delta: "+ 2 demurrage risks",
    deltaPositive: false,
    icon: AlertTriangle,
    color: "#dc2626",
    bg: "#fef2f2",
  },
] as const;



/* ── Recent Updates ──────────────────────────────────────────── */
const RECENT_UPDATES = [
  { title: "New Capesize charter opportunity (Demo)", time: "2 hours ago", icon: "🚢" },
  { title: "Dhamra port draft update (Verified 18.0m)", time: "5 hours ago", icon: "⚓" },
] as const;

export default function HomePage() {
  const { setAfterTitle, setEnd } = usePageHeader();

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => {
      setAfterTitle(null);
      setEnd(null);
    };
  }, [setAfterTitle, setEnd]);

  return (
    <main className="sail-home" aria-label={`${BRAND.name} overview`}>

      {/* ─── Hero Banner: Crisp Native Component with 100% Vector Typography ── */}
      <section className="sail-hero-banner-section" aria-label="SAIL Raw Material Continuity">
        <SailHeroBanner />
      </section>

      {/* ─── Data Provenance Notice ────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <DataNoticeBanner
          title="SAIL East Coast Demonstration Telemetry & Validated Port Parameters"
          description="Port channel draft limits and berthing parameters are verified against official Indian Major Port Handbooks. Vessel queues, active alerts, and rate sparklines are calibrated demonstration values."
        />
      </div>

      {/* ─── KPI Strip ──────────────────────────────────────── */}
      <section className="sail-kpi-strip" aria-label="Key performance indicators">
        {KPIS.map(({ label, value, delta, deltaPositive, icon: Icon, color, bg }) => (
          <article className="sail-kpi-card" key={label}>
            <div className="sail-kpi-icon-wrap" style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div className="sail-kpi-body">
              <span className="sail-kpi-value">{value}</span>
              <span className="sail-kpi-label">{label}</span>
              <span className={`sail-kpi-delta ${deltaPositive ? "positive" : "negative"}`}>
                {delta}
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* ─── Bottom Charts Row ──────────────────────────────── */}
      <section className="sail-charts-row">

        {/* Freight Rate Trends */}
        <div className="sail-chart-card">
          <div className="sail-chart-header">
            <div className="sail-chart-title">
              <BarChart2 size={16} className="sail-chart-icon" />
              Freight Rate Trends
              <DemoDataBadge type="calibrated" label="Demo Series" />
            </div>
            <div className="sail-chart-controls">
              <span className="sail-legend-dot capesize" /> Capesize
              <span className="sail-legend-dot panamax" /> Panamax
              <span className="sail-legend-dot supramax" /> Supramax
              <button className="sail-period-btn">Last 6 Months ▾</button>
            </div>
          </div>
          <div className="sail-chart-canvas" aria-label="Freight rate trends chart">
            {/* SVG sparkline chart */}
            <svg viewBox="0 0 480 100" preserveAspectRatio="none" className="sail-sparkline">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="480" y2="25" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="50" x2="480" y2="50" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="75" x2="480" y2="75" stroke="#e2e8f0" strokeWidth="1" />
              {/* Y labels */}
              <text x="4" y="22" fontSize="7" fill="#94a3b8">40,000</text>
              <text x="4" y="47" fontSize="7" fill="#94a3b8">30,000</text>
              <text x="4" y="72" fontSize="7" fill="#94a3b8">20,000</text>
              {/* X labels */}
              <text x="30"  y="97" fontSize="7" fill="#94a3b8">Jul</text>
              <text x="110" y="97" fontSize="7" fill="#94a3b8">Aug</text>
              <text x="190" y="97" fontSize="7" fill="#94a3b8">Sep</text>
              <text x="270" y="97" fontSize="7" fill="#94a3b8">Oct</text>
              <text x="350" y="97" fontSize="7" fill="#94a3b8">Nov</text>
              <text x="430" y="97" fontSize="7" fill="#94a3b8">Dec</text>
              {/* Capesize line - blue */}
              <polyline
                points="30,60 110,45 190,30 270,40 350,25 430,35"
                fill="none" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Panamax line - teal */}
              <polyline
                points="30,70 110,65 190,55 270,60 350,50 430,55"
                fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Supramax line - green */}
              <polyline
                points="30,78 110,72 190,68 270,72 350,65 430,68"
                fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Port Throughput & Receivability */}
        <div className="sail-chart-card">
          <div className="sail-chart-header">
            <div className="sail-chart-title">
              <Anchor size={16} className="sail-chart-icon" />
              Port Throughput &amp; Receivability
              <DemoDataBadge type="validated" label="Port Limits Verified" />
            </div>
            <button className="sail-period-btn">East Coast (All Ports) ▾</button>
          </div>
          <div className="sail-chart-canvas" aria-label="Port throughput chart">
            <svg viewBox="0 0 340 100" preserveAspectRatio="none" className="sail-sparkline">
              {/* Grid */}
              <line x1="0" y1="20" x2="340" y2="20" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="50" x2="340" y2="50" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="80" x2="340" y2="80" stroke="#e2e8f0" strokeWidth="1" />
              <text x="2" y="17" fontSize="7" fill="#94a3b8">40</text>
              <text x="2" y="47" fontSize="7" fill="#94a3b8">30</text>
              <text x="2" y="77" fontSize="7" fill="#94a3b8">20</text>
              {/* Bar chart */}
              {[
                { x: 30,  h: 45, label: "Haldia"     },
                { x: 85,  h: 60, label: "Dhamra"     },
                { x: 140, h: 35, label: "Paradip"    },
                { x: 195, h: 55, label: "Gopalpur"   },
                { x: 250, h: 70, label: "Vizag"      },
                { x: 305, h: 50, label: "Gangavaram" },
              ].map(({ x, h, label }) => (
                <g key={label}>
                  <rect x={x} y={80 - h} width="28" height={h} rx="3" fill="#bfdbfe" />
                  <rect x={x} y={80 - h * 0.6} width="28" height={h * 0.6} rx="3" fill="#1a56db" />
                  <text x={x + 14} y="95" fontSize="6" fill="#94a3b8" textAnchor="middle">{label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="sail-updates-card">
          <div className="sail-chart-header">
            <div className="sail-chart-title">
              <Bell size={16} className="sail-chart-icon" />
              Recent Updates
            </div>
            <Link to="/logs" className="sail-view-all">View All <ChevronRight size={12} /></Link>
          </div>
          <div className="sail-updates-list">
            {RECENT_UPDATES.map(({ title, time, icon }) => (
              <div className="sail-update-item" key={title}>
                <span className="sail-update-icon">{icon}</span>
                <div className="sail-update-body">
                  <span className="sail-update-title">{title}</span>
                  <span className="sail-update-time">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
