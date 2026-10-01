import type { DashboardTheme, ThemeTypography, ThemeLayout } from "./types";

/**
 * Built-in dashboard themes.
 *
 * Each theme defines its own palette, typography, and layout so switching
 * themes produces visible changes beyond just color — fonts, density, and
 * corner-radius all shift to match the theme's personality.
 *
 * Theme names must stay in sync with the backend's
 * `_BUILTIN_DASHBOARD_THEMES` list in `hermes_cli/web_server.py`.
 */

// ---------------------------------------------------------------------------
// Shared typography / layout presets
// ---------------------------------------------------------------------------

/** Default system stack — neutral, safe fallback for every platform. */
const SYSTEM_SANS =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const SYSTEM_MONO =
  'ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace';

const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  fontSans: SYSTEM_SANS,
  fontMono: SYSTEM_MONO,
  baseSize: "15px",
  lineHeight: "1.55",
  letterSpacing: "0",
};

const DEFAULT_LAYOUT: ThemeLayout = {
  radius: "0.5rem",
  density: "comfortable",
};

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export const defaultTheme: DashboardTheme = {
  name: "default",
  label: "INDRA SAIL Light",
  description: "Light maritime blue — data-driven chartering and logistics intelligence for SAIL",
  palette: {
    background: { hex: "#EEF2F8", alpha: 1 },
    midground:  { hex: "#1e3a5f", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow:   "rgba(30, 58, 95, 0.08)",
    noiseOpacity: 0,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"Inter", ${SYSTEM_SANS}`,
    fontMono: `"JetBrains Mono", ${SYSTEM_MONO}`,
    fontDisplay: `"Inter", ${SYSTEM_SANS}`,
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
    letterSpacing: "-0.01em",
  },
  layout: { radius: "0.75rem", density: "comfortable" },
  colorOverrides: {
    primary: "#1a56db", primaryForeground: "#ffffff", ring: "#1a56db",
    card: "#ffffff", cardForeground: "#1e293b",
    secondary: "#f1f5f9", secondaryForeground: "#1e293b",
    muted: "#f1f5f9", mutedForeground: "#64748b",
    accent: "rgba(26, 86, 219, 0.08)", accentForeground: "#1e293b",
    border: "rgba(30, 58, 95, 0.12)", input: "#ffffff",
    destructive: "#ef4444", destructiveForeground: "#FFFFFF",
    success: "#10b981", warning: "#f59e0b",
  },
  seriesColors: { inputTokenAccent: "#1a56db", outputTokenAccent: "#10b981" },
  swatchColors: ["#EEF2F8", "#1e3a5f", "#1a56db"],
  terminalBackground: "#0f172a",
  terminalForeground: "#e2e8f0",
  customCSS: `
    /* INDRA SAIL Light theme overrides */
    #app-sidebar {
      background: #ffffff !important;
      border-right: 1px solid rgba(30, 58, 95, 0.1) !important;
      box-shadow: 2px 0 8px rgba(0,0,0,0.06) !important;
    }
    #app-sidebar .neu-raised, #app-sidebar .neu-raised-sm { box-shadow: none !important; background: transparent !important; }
    #app-sidebar .neu-inset-sm { box-shadow: none !important; background: rgba(26, 86, 219, 0.06) !important; }

    [data-neu="true"] { background: #EEF2F8 !important; }

    /* Sidebar nav links */
    #app-sidebar a, #app-sidebar button { color: #64748b !important; }
    #app-sidebar a:hover, #app-sidebar button:hover { color: #1e3a5f !important; background: rgba(26, 86, 219, 0.06) !important; }
    #app-sidebar a.active, #app-sidebar [aria-current="page"] {
      color: #1a56db !important;
      background: rgba(26, 86, 219, 0.1) !important;
      border-left: 3px solid #1a56db !important;
      font-weight: 600 !important;
    }

    /* Brand text in sidebar */
    #app-sidebar .font-display, #app-sidebar .font-extrabold { color: #1e3a5f !important; }

    /* Main content area background */
    .flex.min-h-0.min-w-0.flex-1 > .flex-1:not(#app-sidebar):not(aside) {
      background: #f1f5fb !important;
    }

    /* Mobile header */
    header.lg\\:hidden { background: #ffffff !important; border-bottom: 1px solid rgba(30, 58, 95, 0.1) !important; box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important; }
    header.lg\\:hidden .font-bold { color: #1e3a5f !important; }

    /* Tooltip */
    .fixed.z-\\[100\\] { background: #1e3a5f !important; color: #ffffff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; }

    /* Card/page backgrounds */
    .bg-card { background: #ffffff !important; }
    .bg-background { background: #EEF2F8 !important; }
  `,
};


/** Swiss International Typographic Style — white canvas, black ink, Swiss Red accent. */
export const swissTheme: DashboardTheme = {
  name:  "swiss",
  label: "Swiss International",
  description: "Swiss International Typographic Style — white/black/red, zero radius, Inter",
  palette: {
    background: { hex: "#FFFFFF", alpha: 1 },
    midground:  { hex: "#000000", alpha: 1 },
    foreground: { hex: "#FF3000", alpha: 0 },
    warmGlow:   "rgba(255, 48, 0, 0.08)",
    noiseOpacity: 0,
  },
  typography: {
    fontSans:    `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    fontMono:    `"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace`,
    fontDisplay: `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap",
    baseSize:      "15px",
    lineHeight:    "1.5",
    letterSpacing: "0",
  },
  layout: {
    radius:  "0px",
    density: "comfortable",
  },
  colorOverrides: {
    card:                  "#FFFFFF",
    cardForeground:        "#000000",
    primary:               "#FF3000",
    primaryForeground:     "#FFFFFF",
    secondary:             "#F2F2F2",
    secondaryForeground:   "#000000",
    muted:                 "#F2F2F2",
    mutedForeground:       "#555555",
    accent:                "#FFEEE9",
    accentForeground:      "#000000",
    destructive:           "#FF3000",
    destructiveForeground: "#FFFFFF",
    success:               "#1A7A1A",
    warning:               "#996600",
    border:                "#000000",
    input:                 "#FFFFFF",
    ring:                  "#FF3000",
  },
  seriesColors: {
    inputTokenAccent:  "#FF3000",
    outputTokenAccent: "#000000",
  },
  swatchColors: ["#FFFFFF", "#000000", "#FF3000"],
  terminalBackground: "#000000",
  terminalForeground: "#FFFFFF",
};

export const midnightTheme: DashboardTheme = {
  name: "midnight",
  label: "Midnight",
  description: "Deep blue-violet with cool accents",
  palette: {
    background: { hex: "#0a0a1f", alpha: 1 },
    midground: { hex: "#d4c8ff", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow: "rgba(167, 139, 250, 0.32)",
    noiseOpacity: 0.8,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"Inter", ${SYSTEM_SANS}`,
    fontMono: `"JetBrains Mono", ${SYSTEM_MONO}`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
    letterSpacing: "-0.005em",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    radius: "0.75rem",
  },
};

export const emberTheme: DashboardTheme = {
  name: "ember",
  label: "Ember",
  description: "Warm crimson and bronze — forge vibes",
  palette: {
    background: { hex: "#1a0a06", alpha: 1 },
    midground: { hex: "#ffd8b0", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow: "rgba(249, 115, 22, 0.38)",
    noiseOpacity: 1,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"Spectral", Georgia, "Times New Roman", serif`,
    fontMono: `"IBM Plex Mono", ${SYSTEM_MONO}`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    radius: "0.25rem",
  },
  colorOverrides: {
    destructive: "#c92d0f",
    warning: "#f97316",
  },
};

export const monoTheme: DashboardTheme = {
  name: "mono",
  label: "Mono",
  description: "Clean grayscale — minimal and focused",
  palette: {
    background: { hex: "#0e0e0e", alpha: 1 },
    midground: { hex: "#eaeaea", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow: "rgba(255, 255, 255, 0.1)",
    noiseOpacity: 0.6,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"IBM Plex Sans", ${SYSTEM_SANS}`,
    fontMono: `"IBM Plex Mono", ${SYSTEM_MONO}`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    radius: "0",
  },
};

export const cyberpunkTheme: DashboardTheme = {
  name: "cyberpunk",
  label: "Cyberpunk",
  description: "Neon green on black — matrix terminal",
  palette: {
    background: { hex: "#040608", alpha: 1 },
    midground: { hex: "#9bffcf", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow: "rgba(0, 255, 136, 0.22)",
    noiseOpacity: 1.2,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"Share Tech Mono", "JetBrains Mono", ${SYSTEM_MONO}`,
    fontMono: `"Share Tech Mono", "JetBrains Mono", ${SYSTEM_MONO}`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;700&display=swap",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    radius: "0",
  },
  colorOverrides: {
    success: "#00ff88",
    warning: "#ffd700",
    destructive: "#ff0055",
  },
};

export const roseTheme: DashboardTheme = {
  name: "rose",
  label: "Rosé",
  description: "Soft pink and warm ivory — easy on the eyes",
  palette: {
    background: { hex: "#1a0f15", alpha: 1 },
    midground: { hex: "#ffd4e1", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow: "rgba(249, 168, 212, 0.3)",
    noiseOpacity: 0.9,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    fontSans: `"Fraunces", Georgia, serif`,
    fontMono: `"DM Mono", ${SYSTEM_MONO}`,
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Mono:wght@400;500&display=swap",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    radius: "1rem",
  },
};

/** Light mode — vivid Nous-blue accents on a cream canvas. */
export const nousBlueTheme: DashboardTheme = {
  name: "nous-blue",
  label: "Nous Blue",
  description: "Light mode — vivid Nous-blue accents on cream canvas",
  palette: {
    background: { hex: "#E8F2FD", alpha: 1 },
    midground: { hex: "#0053FD", alpha: 1 },
    foreground: { hex: "#170d02", alpha: 0 },
    warmGlow: "rgba(0, 83, 253, 0.12)",
    noiseOpacity: 0,
  },
  typography: DEFAULT_TYPOGRAPHY,
  layout: DEFAULT_LAYOUT,
  terminalBackground: "#f5f8fc",
  terminalForeground: "#170d02",
  seriesColors: {
    inputTokenAccent: "#001934",
    outputTokenAccent: "#0053fd",
  },
  swatchColors: ["#170d02", "#0053FD", "#E8F2FD"],
};

/**
 * Same look as ``defaultTheme`` (Hermes Teal) but with a larger root font
 * size, looser line-height, and ``spacious`` density so every rem-based
 * size in the dashboard scales up. For users who find the default 15px UI
 * too dense.
 */
export const defaultLargeTheme: DashboardTheme = {
  name: "default-large",
  label: "Hermes Teal (Large)",
  description: "Hermes Teal with bigger fonts and roomier spacing",
  palette: {
    background: { hex: "#041c1c", alpha: 1 },
    midground:  { hex: "#ffe6cb", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow:   "rgba(255, 189, 56, 0.35)",
    noiseOpacity: 1,
  },
  typography: {
    ...DEFAULT_TYPOGRAPHY,
    baseSize: "18px",
    lineHeight: "1.65",
  },
  layout: {
    ...DEFAULT_LAYOUT,
    density: "spacious",
  },
};

export const industrialTheme: DashboardTheme = {
  name: "industrial",
  label: "Industrial",
  description: "Tactile neumorphism — safety-orange controls, mechanical precision",
  palette: {
    /* Light neumorphic chassis — same #E0E5EC base as the INDRA surface so
     * the existing neu-raised / neu-inset classes keep working correctly.
     * background → chassis colour; midground → dark charcoal text. */
    background: { hex: "#E0E5EC", alpha: 1 },
    midground:  { hex: "#2d3436", alpha: 1 },
    foreground: { hex: "#ffffff", alpha: 0 },
    warmGlow:   "rgba(255, 71, 87, 0.15)",
    noiseOpacity: 0,
  },
  typography: {
    fontSans:    `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    fontMono:    `"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace`,
    fontDisplay: `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif`,
    fontUrl:     "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap",
    baseSize:    "15px",
    lineHeight:  "1.55",
    letterSpacing: "-0.01em",
  },
  layout: {
    radius: "1rem",       /* 16px — matches --neu-radius-base */
    density: "comfortable",
  },
  colorOverrides: {
    /* Safety-orange / Braun red — the "emergency-stop button" of the palette */
    primary:             "#ff4757",
    primaryForeground:   "#ffffff",
    ring:                "#ff4757",
    /* Card surface = chassis colour; depth comes from shadows only */
    card:                "#e0e5ec",
    cardForeground:      "#1e2228",
    /* Recessed surface for secondary controls */
    secondary:           "#d1d9e6",
    secondaryForeground: "#1e2228",
    muted:               "#d1d9e6",
    mutedForeground:     "#4a5568",   /* 6:1 contrast — WCAG AA */
    /* Accent wash — very subtle orange tint on hover surfaces */
    accent:              "color-mix(in srgb, #ff4757 8%, #e0e5ec)",
    accentForeground:    "#1e2228",
    /* Neumorphic borders — visible light groove separators */
    border:              "rgba(163, 177, 198, 0.45)",
    input:               "#e0e5ec",
    /* Keep semantic states dark enough for light background */
    destructive:         "#c53030",
    destructiveForeground: "#ffffff",
    success:             "#15803d",
    warning:             "#92400e",
  },
  seriesColors: {
    inputTokenAccent:  "#ff4757",
    outputTokenAccent: "#2d3436",
  },
  swatchColors: ["#e0e5ec", "#2d3436", "#ff4757"],
  terminalBackground: "#1a1a2e",
  terminalForeground: "#e0e5ec",
  /* All Industrial chrome is in industrial.css; customCSS holds only
   * selector-level rules that require the live theme name guard. */
  customCSS: "",
};

export const BUILTIN_THEMES: Record<string, DashboardTheme> = {
  default: defaultTheme,
  swiss: swissTheme,
  "default-large": defaultLargeTheme,
  "nous-blue": nousBlueTheme,
  midnight: midnightTheme,
  ember: emberTheme,
  mono: monoTheme,
  cyberpunk: cyberpunkTheme,
  rose: roseTheme,
  industrial: industrialTheme,
};
