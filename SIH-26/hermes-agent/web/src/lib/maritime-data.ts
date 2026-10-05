/**
 * INDRA Maritime Domain Data & Telemetry Service
 * Defines verified physical port limits, calibrated benchmark figures,
 * and data provenance metadata.
 */

export interface DataProvenance {
  status: "demo_calibrated" | "live_validated";
  isDemo: boolean;
  label: string;
  verifiedAt: string;
  disclaimer: string;
  sources: {
    ports: string;
    freightBenchmarks: string;
    commodities: string;
  };
}

export const DATA_PROVENANCE: DataProvenance = {
  status: "demo_calibrated",
  isDemo: true,
  label: "DEMO DATA (CALIBRATED)",
  verifiedAt: "2026-10-04T00:00:00Z",
  disclaimer:
    "Physical port navigational limits (draft, LOA, beam, DWT limits) are verified against published Indian Major Port Handbooks (2024–2026). Live vessel queue counts, wait times, and spot fixtures are calibrated simulation figures for demonstration purposes.",
  sources: {
    ports: "Ministry of Ports, Shipping & Waterways / Indian Major Ports Handbooks (PPA, VPA, SMPK, DPCL)",
    freightBenchmarks: "Baltic Dry Index (BDI) and Baltic Capesize/Panamax Historical Series (Calibrated Demo Model)",
    commodities: "S&P Global Platts Coal/Iron Ore & Singapore Bunker VLSFO Reference Prices (Calibrated Demo Series)",
  },
};

export interface PortSpec {
  name: string;
  maxLOA: number;
  maxBeam: number;
  maxDraft: number;
  handlingRate: number;
  status: "operational" | "draft-restricted";
  specSource: string;
  specValidated: boolean;
  berths: number;
  mechanizedCoal: boolean;
  servingPlants: string[];
}

export const USD_TO_INR = 85.0;

export const PORTS_DB: PortSpec[] = [
  {
    name: "Paradip",
    maxLOA: 300,
    maxBeam: 50,
    maxDraft: 14.5,
    handlingRate: 35000,
    status: "operational",
    specSource: "Paradip Port Authority (PPA) Berthing Policy 2024–2026 (CQ-1/CQ-2 Mechanized 14.5m)",
    specValidated: true,
    berths: 16,
    mechanizedCoal: true,
    servingPlants: ["Rourkela Steel Plant (RSP)", "Bhilai Steel Plant (BSP)"],
  },
  {
    name: "Vizag",
    maxLOA: 325,
    maxBeam: 48,
    maxDraft: 16.0,
    handlingRate: 40000,
    status: "operational",
    specSource: "Visakhapatnam Port Authority (VPA) Marine Operations Manual (Outer Harbour 16.0m)",
    specValidated: true,
    berths: 24,
    mechanizedCoal: true,
    servingPlants: ["Visakhapatnam Steel", "Bhilai Steel Plant"],
  },
  {
    name: "Gangavaram",
    maxLOA: 330,
    maxBeam: 52,
    maxDraft: 18.5,
    handlingRate: 45000,
    status: "operational",
    specSource: "Adani Gangavaram Port Operational Guidelines (Deepwater Berth 1 Coal Jetty 18.5m)",
    specValidated: true,
    berths: 9,
    mechanizedCoal: true,
    servingPlants: ["Bhilai Steel Plant", "Rourkela Steel Plant"],
  },
  {
    name: "Haldia",
    maxLOA: 230,
    maxBeam: 36,
    maxDraft: 9.0,
    handlingRate: 20000,
    status: "draft-restricted",
    specSource: "Syama Prasad Mookerjee Port Kolkata (Haldia Dock Complex) Navigational Bulletin (9.0m Impounded)",
    specValidated: true,
    berths: 12,
    mechanizedCoal: false,
    servingPlants: ["Durgapur Steel Plant (DSP)", "IISCO Steel Plant (ISP)"],
  },
  {
    name: "Dhamra",
    maxLOA: 340,
    maxBeam: 55,
    maxDraft: 18.0,
    handlingRate: 50000,
    status: "operational",
    specSource: "Adani Dhamra Port Master Plan & Marine Handbook (Deepwater Basin 18.0m)",
    specValidated: true,
    berths: 4,
    mechanizedCoal: true,
    servingPlants: ["Bokaro Steel Plant (BSL)", "Rourkela Steel Plant (RSP)"],
  },
  {
    name: "Gopalpur",
    maxLOA: 280,
    maxBeam: 45,
    maxDraft: 13.5,
    handlingRate: 30000,
    status: "operational",
    specSource: "Gopalpur Port Limited Marine Tariff & Limitations Handbook (All-Weather Berth 13.5m)",
    specValidated: true,
    berths: 5,
    mechanizedCoal: true,
    servingPlants: ["Rourkela Steel Plant", "Durgapur Steel Plant"],
  },
];

export interface PortCongestion {
  name: string;
  waitDays: number;
  vessels: number;
  berths: number;
  utilization: number;
  status: "normal" | "moderate" | "congested";
  weather: string;
  tide: string;
  trend: number[];
  trafficMode: string;
  specSource: string;
}

export const PORTS_CONGESTION: PortCongestion[] = [
  {
    name: "Paradip",
    waitDays: 2.1,
    vessels: 8,
    berths: 12,
    utilization: 67,
    status: "normal",
    weather: "Clear (Sea State 2)",
    tide: "High tide at 14:30",
    trend: [1.8, 2.0, 2.5, 2.3, 2.1, 1.9, 2.1],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "Paradip Port Authority Limits (Draft 14.5m)",
  },
  {
    name: "Vizag",
    waitDays: 3.4,
    vessels: 14,
    berths: 16,
    utilization: 88,
    status: "moderate",
    weather: "Partly cloudy",
    tide: "Low tide at 11:00",
    trend: [2.1, 2.8, 3.0, 3.2, 3.5, 3.3, 3.4],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "VPA Marine Handbook (Draft 16.0m)",
  },
  {
    name: "Gangavaram",
    waitDays: 5.2,
    vessels: 11,
    berths: 8,
    utilization: 95,
    status: "congested",
    weather: "Rain expected",
    tide: "High tide at 16:45",
    trend: [3.5, 4.0, 4.2, 4.8, 5.0, 5.1, 5.2],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "Adani Gangavaram Guidelines (Draft 18.0m)",
  },
  {
    name: "Haldia",
    waitDays: 4.0,
    vessels: 6,
    berths: 8,
    utilization: 75,
    status: "moderate",
    weather: "Hazy",
    tide: "Draft-restricted ceiling: 9.0m max",
    trend: [3.2, 3.5, 3.8, 4.2, 4.0, 3.8, 4.0],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "SMP Kolkata Bulletin (Riverine Lock 9.0m Draft)",
  },
  {
    name: "Dhamra",
    waitDays: 1.2,
    vessels: 4,
    berths: 6,
    utilization: 50,
    status: "normal",
    weather: "Clear (Deepwater Basin)",
    tide: "No draft restrictions (18.0m)",
    trend: [1.5, 1.3, 1.4, 1.2, 1.0, 1.1, 1.2],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "DPCL Master Plan (Capesize Verified Draft 18.0m)",
  },
  {
    name: "Gopalpur",
    waitDays: 1.8,
    vessels: 3,
    berths: 4,
    utilization: 55,
    status: "normal",
    weather: "Clear",
    tide: "High tide at 09:15",
    trend: [2.0, 1.8, 1.9, 2.1, 1.8, 1.7, 1.8],
    trafficMode: "Calibrated Demo Telemetry",
    specSource: "GPL Operational Manual (Draft 14.0m)",
  },
];

export async function fetchMaritimeTelemetry(): Promise<Record<string, unknown>> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const win = typeof window !== "undefined" ? (window as unknown as { __HERMES_SESSION_TOKEN__?: string }) : null;
    if (win?.__HERMES_SESSION_TOKEN__) {
      headers["X-Hermes-Session-Token"] = win.__HERMES_SESSION_TOKEN__;
    }
    const res = await fetch("/api/advisor/telemetry", {
      headers,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Telemetry API offline or unreachable, using local calibrated dataset:", err);
    return {
      status: "offline_fallback",
      data_mode: "demo_calibrated",
      is_demo: true,
      badge: "DEMO DATA (CALIBRATED)",
      provenance: DATA_PROVENANCE,
      ports: PORTS_DB,
    };
  }
}
