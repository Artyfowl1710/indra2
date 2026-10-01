/**
 * Central brand configuration for the INDRA dashboard.
 *
 * All user-visible product name, tagline, descriptor, organisation, and
 * renamed navigation labels are sourced from here.  Change values in this
 * file to update the visible branding across the entire dashboard.
 *
 * IMPORTANT: Do NOT hardcode "INDRA", the tagline, or "SAIL" in
 * component files.  Import BRAND / BRAND_LABELS from this module instead.
 *
 * Internal/technical identifiers (API paths, localStorage keys, env vars,
 * import names, package names, backend references) remain "hermes" — only
 * user-facing text is controlled here.
 */

export const BRAND = {
  name: "INDRA",
  fullName: "INDRA",
  descriptor: "Raw-Material Intelligence For SAIL",
  tagline: "Secure Supply. Stronger Steel.",
  organisation: "SAIL",
  browserTitle: "INDRA — Intelligence Within Your Perimeter",
  browserDescription:
    "Data-driven chartering and logistics intelligence for SAIL's East Coast operations.",
  userRole: "Port Ops",
  userOrg: "SAIL (East Coast)",
} as const;

export const BRAND_LABELS = {
  commandCenter: "Command Center",
  operations: "Audit & Reports",
  knowledgeVault: "Knowledge Vault",
  modelRegistry: "Model Registry",
  auditTrail: "Audit & Reports",
  automation: "Automation",
  capabilities: "Capabilities",
  extensions: "Extensions",
  toolConnectors: "Tool Connectors",
  integrations: "Integrations",
  eventHooks: "Event Hooks",
  restartRuntime: "Restart Runtime",
  runtimeStatus: "Runtime Status",
  updateProduct: "Update INDRA",
  runtimeConsole: "INDRA Console",
} as const;
