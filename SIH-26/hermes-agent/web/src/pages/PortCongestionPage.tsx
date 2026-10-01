import { useEffect } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import {
  Activity,
  AlertTriangle,
  Clock,
  Ship,
  Waves,
  Cloud,
  Anchor,
} from "lucide-react";

/* ── Port Congestion Data ────────────────────────────────────── */
const PORTS_CONGESTION = [
  {
    name: "Paradip", waitDays: 2.1, vessels: 8, berths: 12, utilization: 67,
    status: "normal", weather: "Clear", tide: "High tide at 14:30",
    trend: [1.8, 2.0, 2.5, 2.3, 2.1, 1.9, 2.1],
  },
  {
    name: "Vizag", waitDays: 3.4, vessels: 14, berths: 16, utilization: 88,
    status: "moderate", weather: "Partly cloudy", tide: "Low tide at 11:00",
    trend: [2.1, 2.8, 3.0, 3.2, 3.5, 3.3, 3.4],
  },
  {
    name: "Gangavaram", waitDays: 5.2, vessels: 11, berths: 8, utilization: 95,
    status: "congested", weather: "Rain expected", tide: "High tide at 16:45",
    trend: [3.5, 4.0, 4.2, 4.8, 5.0, 5.1, 5.2],
  },
  {
    name: "Haldia", waitDays: 4.0, vessels: 6, berths: 8, utilization: 75,
    status: "moderate", weather: "Hazy", tide: "Draft-restricted until 08:00",
    trend: [3.2, 3.5, 3.8, 4.2, 4.0, 3.8, 4.0],
  },
  {
    name: "Dhamra", waitDays: 1.2, vessels: 4, berths: 6, utilization: 50,
    status: "normal", weather: "Clear", tide: "No restrictions",
    trend: [1.5, 1.3, 1.4, 1.2, 1.0, 1.1, 1.2],
  },
  {
    name: "Gopalpur", waitDays: 1.8, vessels: 3, berths: 4, utilization: 55,
    status: "normal", weather: "Clear", tide: "High tide at 09:15",
    trend: [2.0, 1.8, 1.9, 2.1, 1.8, 1.7, 1.8],
  },
];

const ALERTS = [
  { port: "Gangavaram", type: "congestion", message: "Wait time exceeds 5 days — consider Dhamra as alternative", severity: "high", time: "1h ago" },
  { port: "Vizag", type: "weather", message: "Cyclone warning: IMD tracking depression in Bay of Bengal", severity: "medium", time: "3h ago" },
  { port: "Haldia", type: "draft", message: "Neap tide period — max draft restricted to 7.8m until Oct 5", severity: "medium", time: "6h ago" },
  { port: "Paradip", type: "operational", message: "Berth 7 under maintenance — reduced capacity until Oct 15", severity: "low", time: "12h ago" },
];

function WaitTrend({ data, status }: { data: number[]; status: string }) {
  const max = Math.max(...data) + 1;
  const barW = 10;
  const gap = 3;
  const w = data.length * (barW + gap);
  const h = 40;
  const color = status === "congested" ? "#ef4444" : status === "moderate" ? "#f59e0b" : "#10b981";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="pc-trend">
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * (barW + gap)}
          y={h - (v / max) * h}
          width={barW}
          height={(v / max) * h}
          rx={2}
          fill={i === data.length - 1 ? color : `${color}66`}
        />
      ))}
    </svg>
  );
}

export default function PortCongestionPage() {
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
          <span className="mi-overline">INDRA / PORT CONGESTION</span>
          <h2>Congestion Radar</h2>
          <p>Real-time port congestion monitoring, weather conditions, and disruption alerts for East Coast India.</p>
        </div>
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <section className="mi-card pc-alerts-card">
          <div className="mi-card-header">
            <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
            <span>Active Disruption Alerts</span>
            <span className="mi-badge warn">{ALERTS.length} active</span>
          </div>
          <div className="pc-alerts">
            {ALERTS.map((a, i) => (
              <div key={i} className={`pc-alert ${a.severity}`}>
                <div className="pc-alert-dot" />
                <div className="pc-alert-content">
                  <div className="pc-alert-header">
                    <strong>{a.port}</strong>
                    <span className="pc-alert-type">{a.type}</span>
                    <span className="pc-alert-time">{a.time}</span>
                  </div>
                  <p>{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Port Cards Grid */}
      <div className="pc-grid">
        {PORTS_CONGESTION.map(port => (
          <section key={port.name} className={`mi-card pc-port-card ${port.status}`}>
            <div className="pc-port-header">
              <div className="pc-port-name">
                <Anchor size={16} />
                <h4>{port.name}</h4>
                <span className={`pc-status-badge ${port.status}`}>
                  {port.status === "congested" ? "CONGESTED" : port.status === "moderate" ? "MODERATE" : "NORMAL"}
                </span>
              </div>
            </div>

            <div className="pc-port-stats">
              <div className="pc-stat">
                <Clock size={14} />
                <div>
                  <span className="pc-stat-value">{port.waitDays}d</span>
                  <span className="pc-stat-label">Avg Wait</span>
                </div>
              </div>
              <div className="pc-stat">
                <Ship size={14} />
                <div>
                  <span className="pc-stat-value">{port.vessels}</span>
                  <span className="pc-stat-label">Vessels</span>
                </div>
              </div>
              <div className="pc-stat">
                <Activity size={14} />
                <div>
                  <span className="pc-stat-value">{port.utilization}%</span>
                  <span className="pc-stat-label">Utilization</span>
                </div>
              </div>
            </div>

            <div className="pc-port-trend">
              <span className="pc-trend-label">7-day wait time trend</span>
              <WaitTrend data={port.trend} status={port.status} />
            </div>

            <div className="pc-port-conditions">
              <div className="pc-condition">
                <Cloud size={12} />
                <span>{port.weather}</span>
              </div>
              <div className="pc-condition">
                <Waves size={12} />
                <span>{port.tide}</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
