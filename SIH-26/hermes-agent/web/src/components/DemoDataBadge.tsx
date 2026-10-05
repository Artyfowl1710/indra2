import { Info, ShieldCheck, Database } from "lucide-react";
import "./DemoDataBadge.css";

export interface DemoDataBadgeProps {
  type?: "demo" | "calibrated" | "validated" | "live" | "simulated";
  label?: string;
  tooltip?: string;
  className?: string;
  showIcon?: boolean;
}

export function DemoDataBadge({
  type = "demo",
  label,
  tooltip,
  className = "",
  showIcon = true,
}: DemoDataBadgeProps) {
  const defaultLabel =
    label ||
    (type === "validated"
      ? "Validated Spec"
      : type === "live"
      ? "Live AIS"
      : type === "calibrated"
      ? "Calibrated Benchmark"
      : type === "simulated"
      ? "Simulation Model"
      : "Demo Data");

  const defaultTooltip =
    tooltip ||
    (type === "validated"
      ? "Verified against official Port Authority handbooks (PPA, VPA, DPCL, SMPK)."
      : type === "live"
      ? "Real-time feed active."
      : "Figures are calibrated for demonstration and simulation purposes (not live AIS feed).");

  return (
    <span
      className={`data-badge data-badge-${type} ${className}`}
      title={defaultTooltip}
      role="status"
    >
      {showIcon && (
        <span className="data-badge-icon" aria-hidden="true">
          {type === "validated" ? (
            <ShieldCheck size={11} />
          ) : type === "live" ? (
            <span className="data-badge-dot live" />
          ) : (
            <Database size={10} />
          )}
        </span>
      )}
      <span className="data-badge-text">{defaultLabel}</span>
    </span>
  );
}

export interface DataNoticeBannerProps {
  title?: string;
  description?: string;
  specVerified?: boolean;
  className?: string;
}

export function DataNoticeBanner({
  title = "Demonstration & Simulation Dataset",
  description = "Physical port constraints (draft, LOA, beam, DWT limits) are verified against official Indian Major Port Handbooks. Daily traffic queues, voyage fixtures, and spot rates are calibrated demonstration figures.",
  specVerified = true,
  className = "",
}: DataNoticeBannerProps) {
  return (
    <div className={`data-notice-banner ${className}`} role="note">
      <div className="data-notice-left">
        <div className="data-notice-icon-box">
          <Info size={16} />
        </div>
        <div className="data-notice-content">
          <div className="data-notice-heading">
            <strong>{title}</strong>
            <DemoDataBadge type="demo" label="Demo Dataset" />
            {specVerified && (
              <DemoDataBadge
                type="validated"
                label="Port Specs Verified"
                tooltip="Verified against Ministry of Ports, Shipping & Waterways publications"
              />
            )}
          </div>
          <p className="data-notice-desc">{description}</p>
        </div>
      </div>
    </div>
  );
}
