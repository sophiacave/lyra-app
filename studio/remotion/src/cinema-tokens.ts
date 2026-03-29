/**
 * Cinema Design Tokens — Single source of truth for all Remotion components
 *
 * Reads from design-system-cinema.json (the universal interchange format).
 * All Remotion components import from here instead of hardcoding values.
 *
 * This module provides:
 * - Color palette (foundations, semantic, accents)
 * - Typography scale
 * - Motion/spring configs
 * - Beat-specific rendering presets
 * - Grid/composition helpers
 */

// ─── Colors ────────────────────────────────────────────────────
export const COLORS = {
  // Foundations
  void: "#0B0A10",
  chalk: "#F0EBE3",
  smoke: "#8A8490",
  ash: "#2D2A33",
  // Semantic
  signal: "#D4956B",
  process: "#8BAFC4",
  result: "#8CB89E",
  alert: "#C4616A",
  insight: "#B898C8",
  // McQueen accents
  bone: "#E8DDD0",
  obsidian: "#1A1720",
  blush: "#D4A0A0",
  gold: "#C4A86C",
} as const;

// ─── Beat → Accent Color ──────────────────────────────────────
export const BEAT_ACCENTS: Record<string, string> = {
  hook: COLORS.signal,
  setup: COLORS.process,
  core: COLORS.result,
  breathe: COLORS.insight,
  deepen: COLORS.process,
  peak: COLORS.gold,
  close: COLORS.blush,
};

// ─── Beat → Visual Treatment ──────────────────────────────────
export const BEAT_STYLES: Record<
  string,
  {
    grainIntensity: number;
    vignette: number;
    colorShift: boolean;
    headPad: number;
    tailPause: number;
  }
> = {
  hook: { grainIntensity: 0.02, vignette: 0.25, colorShift: false, headPad: 0.15, tailPause: 0.8 },
  setup: { grainIntensity: 0.03, vignette: 0.30, colorShift: true, headPad: 0.25, tailPause: 0.5 },
  core: { grainIntensity: 0.02, vignette: 0.20, colorShift: false, headPad: 0.15, tailPause: 0.3 },
  breathe: { grainIntensity: 0.04, vignette: 0.35, colorShift: true, headPad: 0.4, tailPause: 1.5 },
  deepen: { grainIntensity: 0.03, vignette: 0.25, colorShift: true, headPad: 0.25, tailPause: 0.5 },
  peak: { grainIntensity: 0.02, vignette: 0.15, colorShift: false, headPad: 0.6, tailPause: 2.0 },
  close: { grainIntensity: 0.04, vignette: 0.40, colorShift: true, headPad: 0.4, tailPause: 1.5 },
};

// ─── Typography Scale ──────────────────────────────────────────
export const TYPE = {
  hero: { size: 96, weight: 700, tracking: -2.5, leading: 1.0 },
  display: { size: 72, weight: 700, tracking: -1.5, leading: 1.05 },
  title1: { size: 56, weight: 600, tracking: -1.0, leading: 1.1 },
  title2: { size: 44, weight: 600, tracking: -0.5, leading: 1.15 },
  title3: { size: 34, weight: 600, tracking: -0.3, leading: 1.2 },
  headline: { size: 28, weight: 600, tracking: 0, leading: 1.3 },
  body: { size: 22, weight: 400, tracking: 0.2, leading: 1.6 },
  callout: { size: 18, weight: 500, tracking: 0.3, leading: 1.5 },
  caption: { size: 15, weight: 400, tracking: 0.5, leading: 1.4 },
  overline: { size: 13, weight: 600, tracking: 2.0, leading: 1.3 },
} as const;

// ─── Font Stacks ───────────────────────────────────────────────
export const FONTS = {
  display: "'SF Pro Display', 'General Sans', 'Inter', system-ui, sans-serif",
  text: "'SF Pro Text', 'Inter', system-ui, sans-serif",
  accent: "'Cormorant Garamond', 'Playfair Display', 'Georgia', serif",
  mono: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
} as const;

// ─── Spring Configs (for Remotion spring()) ────────────────────
export const SPRING = {
  confident: { damping: 15, stiffness: 200, mass: 0.8 },
  smooth: { damping: 20, stiffness: 120, mass: 0.8 },
  bouncy: { damping: 8, stiffness: 180, mass: 0.6 },
  gentle: { damping: 30, stiffness: 60, mass: 1.2 },
  exit: { damping: 25, stiffness: 250, mass: 0.4 },
  dramatic: { damping: 20, stiffness: 80, mass: 2.0 },
} as const;

// ─── Stagger Delays (seconds) ──────────────────────────────────
export const STAGGER = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.15,
  wave: 0.25,
} as const;

// ─── Video Constants ───────────────────────────────────────────
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// ─── Grid & Composition ────────────────────────────────────────
export const GRID = {
  thirds: { left: 640, right: 1280, top: 360, bottom: 720 },
  golden: { left: 1187, right: 733, top: 667, bottom: 413 },
  margin: { outer: 120, inner: 80, content: 200 },
} as const;

// ─── Cinema Grade ──────────────────────────────────────────────
export const CINEMA_GRADE = {
  grainAmount: 4,
  vignette: {
    default: 0.4,
    titleCard: 0.5,
    sectionHeader: 0.45,
    diagram: 0.35,
  },
  glow: {
    titleCard: { radius: 300, opacity: 0.06 },
    sectionHeader: { radius: 200, opacity: 0.05 },
    diagram: { radius: 350, opacity: 0.04 },
  },
} as const;

// ─── Rendering Presets ─────────────────────────────────────────
// Complete visual recipes for each scene type
export const PRESETS = {
  titleCardCinematic: {
    type: "title" as const,
    typography: { title: "display", subtitle: "overline" },
    motion: { enter: "dramatic", exit: "exit" },
    vignette: 0.5,
    grain: 0.035,
    letterbox: true,
    glowRadius: 300,
    glowOpacity: 0.06,
  },
  explainerScene: {
    type: "diagram" as const,
    typography: { heading: "title2", body: "body", label: "caption" },
    motion: { enter: "confident", exit: "exit" },
    vignette: 0.35,
    grain: 0.025,
    letterbox: false,
    glowRadius: 350,
    glowOpacity: 0.04,
  },
  quoteCard: {
    type: "title" as const,
    typography: { quote: "title2", attribution: "callout" },
    motion: { enter: "gentle", exit: "exit" },
    vignette: 0.45,
    grain: 0.04,
    letterbox: true,
    glowRadius: 250,
    glowOpacity: 0.05,
  },
  sectionHeader: {
    type: "title" as const,
    typography: { overline: "overline", title: "title1" },
    motion: { enter: "smooth", exit: "exit" },
    vignette: 0.45,
    grain: 0.03,
    letterbox: true,
    glowRadius: 200,
    glowOpacity: 0.05,
  },
  lowerThird: {
    type: "broll" as const,
    typography: { name: "headline", label: "caption" },
    motion: { enter: "confident", exit: "exit" },
    vignette: 0,
    grain: 0,
    letterbox: false,
    glowRadius: 0,
    glowOpacity: 0,
  },
} as const;

// ─── Course Theme Palettes ─────────────────────────────────────
export const COURSE_THEMES: Record<
  string,
  { accent: string; mood: string; gradient: [string, string] }
> = {
  "ai-foundations": { accent: COLORS.process, mood: "trust", gradient: ["#0B0A10", "#1a2535"] },
  "how-ai-works": { accent: COLORS.insight, mood: "wonder", gradient: ["#0B0A10", "#1a1525"] },
  "rag-vectors": { accent: COLORS.insight, mood: "depth", gradient: ["#0B0A10", "#1a1828"] },
  "prompt-craft": { accent: COLORS.signal, mood: "craft", gradient: ["#0B0A10", "#1a1510"] },
  "prompt-writing": { accent: COLORS.signal, mood: "craft", gradient: ["#0B0A10", "#1a1510"] },
  "ethics-safety": { accent: COLORS.result, mood: "care", gradient: ["#0B0A10", "#101a15"] },
  creatives: { accent: COLORS.blush, mood: "expression", gradient: ["#0B0A10", "#1a1015"] },
  business: { accent: COLORS.gold, mood: "authority", gradient: ["#0B0A10", "#1a1810"] },
  "claude-beginners": { accent: COLORS.insight, mood: "wonder", gradient: ["#0B0A10", "#1a1525"] },
};

// ─── Style Helpers ─────────────────────────────────────────────

/** Get a complete CSS type style object for a given scale level */
export function typeStyle(
  scale: keyof typeof TYPE,
  color: string = COLORS.chalk,
  fontStack: keyof typeof FONTS = "display"
): React.CSSProperties {
  const t = TYPE[scale];
  return {
    fontFamily: FONTS[fontStack],
    fontSize: t.size,
    fontWeight: t.weight,
    letterSpacing: t.tracking,
    lineHeight: t.leading,
    color,
    margin: 0,
  };
}

/** Film grain SVG data URL — changes per frame for organic texture */
export function grainUrl(frame: number): string {
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
}

/** Vignette radial gradient */
export function vignetteGradient(intensity: number = 0.4, color: string = COLORS.void): string {
  return `radial-gradient(ellipse at center, transparent 40%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 100%)`;
}
