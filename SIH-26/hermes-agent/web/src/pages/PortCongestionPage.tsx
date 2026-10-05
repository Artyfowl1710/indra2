import { useEffect, useState } from "react";
import "./maritime-pages.css";
import { usePageHeader } from "@/contexts/usePageHeader";
import { DemoDataBadge, DataNoticeBanner } from "@/components/DemoDataBadge";
import { PORTS_CONGESTION as DEFAULT_CONGESTION, fetchMaritimeTelemetry } from "@/lib/maritime-data";
import {
  Activity,
  AlertTriangle,
  Clock,
  Ship,
  Waves,
  Cloud,
  Anchor,
} from "lucide-react";

const ALERTS = [
  { port: "Gangavaram", type: "congestion", message: "Wait time exceeds 5 days (Demo simulation) — consider Dhamra as alternative", severity: "high", time: "1h ago" },
  { port: "Vizag", type: "weather", message: "Cyclone warning: IMD tracking depression in Bay of Bengal", severity: "medium", time: "3h ago" },
  { port: "Haldia", type: "draft", message: "Neap tide period — max draft restricted to 7.8m until Oct 5 (Validated constraint)", severity: "medium", time: "6h ago" },
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
  const [portsData, setPortsData] = useState(DEFAULT_CONGESTION);

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => { setAfterTitle(null); setEnd(null); };
  }, [setAfterTitle, setEnd]);

  useEffect(() => {
    fetchMaritimeTelemetry().then(telemetry => {
      if (telemetry?.ports && typeof telemetry.ports === "object") {
        // Enriched with live/backend data if available
        const ports = telemetry.ports as Record<string, { avg_wait_days?: number; queue_vessels?: number; spec_source?: string }>;
        setPortsData(prev => prev.map(p => {
          const remote = ports[p.name];
          if (remote) {
            return {
              ...p,
              waitDays: remote.avg_wait_days ?? p.waitDays,
              vessels: remote.queue_vessels ?? p.vessels,
              specSource: remote.spec_source ?? p.specSource,
            };
          }
          return p;
        }));
      }
    });
  }, []);

  return (
    <main className="ff-page">
      <div className="mi-header">
        <div>
          <span className="mi-overline">INDRA / PORT CONGESTION</span>
          <h2>Congestion Radar</h2>
          <p>East Coast Indian port queue modeling, berth utilization, and disruption alerts (Demo Simulation).</p>
        </div>
        <div className="mi-header-meta">
          <DemoDataBadge type="simulated" label="Simulated AIS Telemetry" />
          <DemoDataBadge type="validated" label="Port Limits Verified" />
        </div>
      </div>

      {/* Notice Banner */}
      <DataNoticeBanner
        title="Simulated Port Telemetry & Verified Constraints"
        description="Physical port specifications (draft ceilings, max DWT, berth handling facilities) are verified against official Indian Major Port Authority handbooks. Daily vessel queues and wait days are simulated demonstration figures."
      />

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <section className="mi-card pc-alerts-card">
          <div className="mi-card-header">
            <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
            <span>Active Disruption Alerts</span>
            <DemoDataBadge type="demo" label="Demo Scenarios" />
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
        {portsData.map(port => (
          <section key={port.name} className={`mi-card pc-port-card ${port.status}`}>
            <div className="pc-port-header">
              <div className="pc-port-name">
                <Anchor size={16} />
                <h4>{port.name}</h4>
                <span className={`pc-status-badge ${port.status}`}>
                  {port.status === "congested" ? "CONGESTED" : port.status === "moderate" ? "MODERATE" : "NORMAL"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <DemoDataBadge type="validated" label="Verified Limits" showIcon={false} />
                <DemoDataBadge type="simulated" label="Demo Queue" showIcon={false} />
              </div>
            </div>

            <div className="pc-port-stats">
              <div className="pc-stat">
                <Clock size={14} />
                <div>
                  <span className="pc-stat-value">{port.waitDays}d</span>
                  <span className="pc-stat-label">Avg Wait (Sim)</span>
                </div>
              </div>
              <div className="pc-stat">
                <Ship size={14} />
                <div>
                  <span className="pc-stat-value">{port.vessels}</span>
                  <span className="pc-stat-label">Vessels (Sim)</span>
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
              <span className="pc-trend-label">7-day wait time trend (Simulated)</span>
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

            <div style={{ marginTop: "0.8rem", paddingTop: "0.6rem", borderTop: "1px solid #f1f5f9", fontSize: "0.68rem", color: "#94a3b8" }}>
              Limits: {port.specSource}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
