import { Link } from "react-router";
import { ArrowRight, BarChart2, Anchor, CheckCircle2 } from "lucide-react";
import "./sail-hero-banner.css";

const PORTS = [
  { name: "Haldia", draft: "Draft 9.0 m", top: 12, left: 32 },
  { name: "Dhamra", draft: "Draft 18.0 m", top: 27, left: 36 },
  { name: "Paradip", draft: "Draft 14.5 m", top: 43, left: 28 },
  { name: "Gopalpur", draft: "Draft 14.0 m", top: 60, left: 20 },
  { name: "Vizag", draft: "Draft 16.0 m", top: 76, left: 14 },
  { name: "Gangavaram", draft: "Draft 18.0 m", top: 88, left: 34 },
];

export function SailHeroBanner() {
  return (
    <section className="sail-native-hero" aria-label="SAIL Raw Material Continuity">
      {/* High-res background image on right half */}
      <div className="sail-hero-bg-photo" aria-hidden="true">
        <img
          src="/sail_hero_harbor_bg.jpg"
          alt=""
          className="sail-hero-bg-img"
          loading="eager"
        />
      </div>

      {/* Main content grid */}
      <div className="sail-hero-content-grid">
        {/* Left column: Text, tags, features, and action buttons */}
        <div className="sail-hero-left">
          {/* Tag */}
          <div className="sail-hero-tag">
            <span className="sail-hero-tag-dot" />
            <span className="sail-hero-tag-text">SAIL Raw-Material Continuity</span>
          </div>

          {/* Heading */}
          <div className="sail-hero-title-block">
            <h1 className="sail-hero-heading">
              Secure Supply.
              <br />
              <span className="sail-hero-heading-accent">Stronger Steel.</span>
            </h1>
            <p className="sail-hero-subtitle">
              Data-driven chartering and logistics intelligence for SAIL&apos;s East Coast operations.
            </p>
          </div>

          {/* 3 Value propositions */}
          <div className="sail-hero-features">
            <div className="sail-hero-feature-item">
              <div className="sail-hero-feature-icon">
                <BarChart2 size={15} />
              </div>
              <span className="sail-hero-feature-text">
                Freight &amp; market<br />intelligence
              </span>
            </div>

            <div className="sail-hero-feature-item">
              <div className="sail-hero-feature-icon">
                <Anchor size={15} />
              </div>
              <span className="sail-hero-feature-text">
                Vessel-port<br />optimization
              </span>
            </div>

            <div className="sail-hero-feature-item">
              <div className="sail-hero-feature-icon">
                <CheckCircle2 size={15} />
              </div>
              <span className="sail-hero-feature-text">
                Production-aware<br />decision support
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="sail-hero-buttons">
            <Link
              to="/freight-forecasts"
              className="sail-hero-btn-primary"
              aria-label="Explore Dashboard"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/charter-planning/scenarios"
              className="sail-hero-btn-secondary"
              aria-label="Run a Scenario"
            >
              <BarChart2 size={15} color="#024282" />
              <span>Run a Scenario</span>
            </Link>
          </div>
        </div>

        {/* Center / right-center: East Coast maritime corridor track */}
        <div className="sail-hero-ports-track" aria-label="East Coast Ports Network Map">
          {/* Subtle SVG Coastline Path */}
          <svg
            className="sail-hero-ports-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 32 12 Q 38 20 36 27 Q 34 35 28 43 Q 22 52 20 60 Q 16 68 14 76 Q 22 84 34 88"
              fill="none"
              stroke="#034b95"
              strokeWidth="1.8"
              strokeDasharray="2.5 2"
              opacity="0.75"
            />
          </svg>

          {/* Interactive Port Waypoint Nodes */}
          {PORTS.map((p) => (
            <Link
              key={p.name}
              to={`/port-congestion?port=${encodeURIComponent(p.name)}`}
              className="sail-hero-port-node"
              style={{
                position: "absolute",
                top: `${p.top}%`,
                left: `${p.left}%`,
                display: "flex",
                alignItems: "center",
                transform: "translate(-11px, -11px)",
              }}
              title={`${p.name} Port • ${p.draft} • View Berth Congestion`}
            >
              <div className="sail-hero-port-pin">
                <Anchor size={11} strokeWidth={2.5} />
              </div>
              <div className="sail-hero-port-label">
                <span className="sail-hero-port-name">{p.name}</span>
                <span className="sail-hero-port-draft">{p.draft}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Top-Right Floating Card: East Coast Port Network metrics */}
        <aside className="sail-hero-right-card" aria-label="East Coast Port Network Statistics">
          <div className="sail-hero-card-title">East Coast Port Network</div>
          <div className="sail-hero-card-metrics">
            <div className="sail-hero-metric-item">
              <span className="sail-hero-metric-val">6</span>
              <span className="sail-hero-metric-lbl">Major Ports</span>
            </div>
            <div className="sail-hero-metric-item">
              <span className="sail-hero-metric-val">40+</span>
              <span className="sail-hero-metric-lbl">MTPA Capacity</span>
            </div>
            <div className="sail-hero-metric-item">
              <span className="sail-hero-metric-val">3</span>
              <span className="sail-hero-metric-lbl">Integrated Plants</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
