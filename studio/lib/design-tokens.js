/**
 * Like One Studio — Design Tokens
 * Inspired by Apple HIG: clarity, deference, depth.
 * Every value is intentional. Every ratio is considered.
 */

// ── Surfaces (Apple-inspired depth layers) ──
export const SURFACE_BASE = '#08080a';
export const SURFACE_RAISED = '#0e0e12';
export const SURFACE_OVERLAY = '#111116';
export const SURFACE_ELEVATED = '#16161c';
export const SURFACE_GLASS = 'rgba(255, 255, 255, 0.04)';
export const SURFACE_GLASS_BORDER = 'rgba(255, 255, 255, 0.08)';

// ── Text (Apple-style contrast hierarchy) ──
export const TEXT_PRIMARY = '#f5f5f7';       // Apple's signature off-white
export const TEXT_SECONDARY = '#a1a1a6';     // Apple's secondary gray
export const TEXT_TERTIARY = '#6e6e73';       // Apple's tertiary
export const TEXT_QUATERNARY = '#48484a';
export const TEXT_INVERSE = '#08080a';

// ── Accents (restrained — one accent per scene, max two) ──
export const ACCENT_PURPLE = '#bf5af2';      // Apple's purple
export const ACCENT_BLUE = '#0a84ff';        // Apple's blue
export const ACCENT_CYAN = '#64d2ff';        // Apple's cyan
export const ACCENT_PINK = '#ff375f';        // Apple's pink
export const ACCENT_WARM = '#ff9f0a';        // Apple's orange
export const ACCENT_GREEN = '#30d158';       // Apple's green
export const ACCENT_INDIGO = '#5e5ce6';      // Apple's indigo

// ── Status ──
export const STATUS_SUCCESS = '#30d158';
export const STATUS_ERROR = '#ff453a';
export const STATUS_WARNING = '#ffd60a';

// ── Borders ──
export const BORDER_DEFAULT = 'rgba(255, 255, 255, 0.06)';
export const BORDER_LIGHT = 'rgba(255, 255, 255, 0.10)';
export const BORDER_ACCENT = 'rgba(191, 90, 242, 0.3)';

// ── Typography (Apple-inspired type scale — golden ratio 1.25) ──
export const FONT_FAMILY = "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
export const FONT_TEXT = "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
export const FONT_MONO = "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace";

// Type scale — each step is ~1.25x (major third)
export const TYPE = {
  hero:     { size: 96, weight: 700, tracking: -2.5, leading: 1.0 },
  display:  { size: 72, weight: 700, tracking: -1.5, leading: 1.05 },
  title1:   { size: 56, weight: 600, tracking: -1.0, leading: 1.1 },
  title2:   { size: 44, weight: 600, tracking: -0.5, leading: 1.15 },
  title3:   { size: 34, weight: 600, tracking: -0.3, leading: 1.2 },
  headline: { size: 28, weight: 600, tracking: 0,    leading: 1.3 },
  body:     { size: 22, weight: 400, tracking: 0.2,  leading: 1.6 },
  callout:  { size: 18, weight: 500, tracking: 0.3,  leading: 1.5 },
  caption:  { size: 15, weight: 400, tracking: 0.5,  leading: 1.4 },
  overline: { size: 13, weight: 600, tracking: 2.0,  leading: 1.3 },
};

// ── Spacing (8pt grid, Apple standard) ──
export const SPACE = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  '5xl': 128,
  '6xl': 192,
};

// ── Video ──
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

// ── Composition Grid (rule of thirds + golden ratio) ──
export const GRID = {
  // Rule of thirds intersections (proportional to frame)
  thirds: {
    left:   VIDEO_WIDTH / 3,          // 640
    right:  (VIDEO_WIDTH * 2) / 3,    // 1280
    top:    VIDEO_HEIGHT / 3,         // 360
    bottom: (VIDEO_HEIGHT * 2) / 3,   // 720
  },
  // Golden ratio points
  phi: 1.618033988749895,
  golden: {
    left:   VIDEO_WIDTH / 1.618,      // ~1187
    right:  VIDEO_WIDTH - VIDEO_WIDTH / 1.618,  // ~733
    top:    VIDEO_HEIGHT / 1.618,     // ~667
    bottom: VIDEO_HEIGHT - VIDEO_HEIGHT / 1.618, // ~413
  },
  // Safe margins (Apple-style generous padding)
  margin: {
    outer: 120,   // Minimum distance from edge
    inner: 80,    // Padding inside containers
    content: 200, // Content inset for text-heavy scenes
  },
};

// ── Motion (spring physics — Apple-style natural movement) ──
export const MOTION = {
  // Spring configs for Remotion's spring()
  snappy:  { mass: 1, damping: 28, stiffness: 380 },  // Quick, decisive
  smooth:  { mass: 1, damping: 26, stiffness: 170 },  // Default Apple feel
  gentle:  { mass: 1, damping: 30, stiffness: 100 },  // Slow, deliberate
  bouncy:  { mass: 1, damping: 14, stiffness: 200 },  // Playful bounce
  heavy:   { mass: 2, damping: 30, stiffness: 120 },  // Weighty, important

  // Duration guides (in seconds) for interpolate-based animations
  duration: {
    instant: 0.15,
    fast:    0.25,
    normal:  0.4,
    slow:    0.7,
    glacial: 1.2,
  },

  // Stagger delay between sequential element entries (in seconds)
  stagger: {
    tight:  0.04,
    normal: 0.08,
    loose:  0.15,
    wave:   0.25,
  },
};

// ── Depth (shadow + blur system for layered feel) ──
export const DEPTH = {
  glow: (color, radius = 40) => `0 0 ${radius}px ${color}20, 0 0 ${radius * 2}px ${color}10`,
  soft: '0 2px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
  medium: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
  heavy: '0 16px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)',
  floating: '0 24px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)',
};

// ── Gradient helpers ──
export function accentGradient(angle = 135) {
  return `linear-gradient(${angle}deg, ${ACCENT_PURPLE} 0%, ${ACCENT_BLUE} 100%)`;
}

export function warmGradient(angle = 135) {
  return `linear-gradient(${angle}deg, ${ACCENT_WARM} 0%, ${ACCENT_PINK} 100%)`;
}

export function subtleGradient(angle = 180) {
  return `linear-gradient(${angle}deg, ${SURFACE_BASE} 0%, ${SURFACE_RAISED} 100%)`;
}

// ── Easing functions (for interpolate-based animations) ──
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

// Apple's custom bezier approximation — smooth start, crisp stop
export function appleEase(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ── Style helpers ──
export function typeStyle(scale, color = TEXT_PRIMARY) {
  const t = TYPE[scale];
  return {
    fontFamily: FONT_FAMILY,
    fontSize: t.size,
    fontWeight: t.weight,
    letterSpacing: t.tracking,
    lineHeight: t.leading,
    color,
    margin: 0,
  };
}

export function glassStyle(blur = 40) {
  return {
    backgroundColor: SURFACE_GLASS,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${SURFACE_GLASS_BORDER}`,
    borderRadius: 20,
  };
}
