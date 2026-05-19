'use client';

import { useId } from 'react';
import EggShape from './EggShape';

/**
 * TamagotchiShell — egg-shaped device wrapper with a screen viewport and
 * three bottom buttons (classic A / B / C tamagotchi layout).
 *
 * Renders an <EggShape /> as the device body, overlays a recessed rounded-rect
 * "screen" cutout in the upper interior (with overflow:hidden so callers can
 * render any UI inside via `children`), and three circular buttons along the
 * lower curve. Everything is positioned in percentage units relative to the
 * egg's intrinsic 5:7 aspect ratio so the shell scales cleanly with `size`.
 *
 * Idle motion: when `idle` is true (default), the whole shell gently bobs
 * (translateY) and breathes (scale) on independent timing loops so the cycle
 * never feels mechanical. Both loops respect `prefers-reduced-motion`.
 *
 * Props:
 *   size       — egg width in px (default 320). Total height is size * 1.4.
 *   colors     — { inner, outer } passed to EggShape (defaults to pink → purple)
 *   screen     — { bg, border } screen panel colors (defaults to soft mint LCD)
 *   buttons    — array of up to 3 button defs:
 *                  { label: string, onClick: fn, color?: string, ariaLabel?: string }
 *                Falsy entries render an empty slot. Extras past 3 are ignored.
 *   idle       — enable idle bounce + breathing loops (default true)
 *   idleMotion — fine tune the loops:
 *                  { bounce: px, breathe: scaleDelta,
 *                    bounceDuration: sec, breatheDuration: sec }
 *   children   — rendered inside the screen viewport (overflow hidden, centered)
 *   className  — passthrough on the outer wrapper
 *   ...rest    — forwarded to outer wrapper
 */
export default function TamagotchiShell({
  size = 320,
  colors,
  screen = { bg: '#cfe9d8', border: '#3a2a52' },
  buttons = [],
  idle = true,
  idleMotion,
  children,
  className,
  style,
  ...rest
}) {
  const uid = useId().replace(/:/g, '');
  const screenClipId = `tama-screen-clip-${uid}`;

  // Idle motion tuning — kept gentle so screen content stays legible.
  // bounce: vertical travel in px (peak-to-rest).
  // breathe: scale delta added at the breath peak (e.g. 0.018 → 1.018x).
  // Coprime-ish durations so bounce + breathe drift apart and the loop
  // never lands on the same beat twice in a row (feels alive, not robotic).
  const motion = {
    bounce: 4,
    breathe: 0.018,
    bounceDuration: 2.4,
    breatheDuration: 3.6,
    ...(idleMotion || {}),
  };

  const bounceKeyframes = `tama-bounce-${uid}`;
  const breatheKeyframes = `tama-breathe-${uid}`;

  const width = size;
  const height = (size * 140) / 100;

  // Slot 3 buttons; pad with nulls so layout stays consistent.
  const slots = [0, 1, 2].map((i) => buttons[i] || null);

  // Default button palette if a button doesn't specify a color.
  const defaultButtonColors = ['#ff5d8f', '#ffd166', '#5dc8ff'];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        // The egg already paints its own drop shadow — no extra needed here.
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {/* Scoped keyframes — unique names per instance so multiple shells
          on the same page don't fight over the same @keyframes rule.
          Reduced-motion users get no animation at all. */}
      <style>{`
        @keyframes ${bounceKeyframes} {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -${motion.bounce}px, 0); }
        }
        @keyframes ${breatheKeyframes} {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(${(1 + motion.breathe).toFixed(4)}); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-tama-stage="${uid}"] { animation: none !important; }
        }
      `}</style>

      {/* Idle motion stage — wraps the whole device (egg + screen + buttons)
          so they move as one unit. Two animations stack on the same element
          and the browser composites them, but because both target `transform`
          we let the bounce ride on the outer stage and the breathe on the
          inner stage to avoid them clobbering each other. */}
      <div
        data-tama-stage={uid}
        style={{
          position: 'absolute',
          inset: 0,
          animation: idle
            ? `${bounceKeyframes} ${motion.bounceDuration}s ease-in-out infinite`
            : 'none',
          willChange: idle ? 'transform' : 'auto',
        }}
      >
        <div
          data-tama-stage={uid}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 90%',
            animation: idle
              ? `${breatheKeyframes} ${motion.breatheDuration}s ease-in-out infinite`
              : 'none',
            willChange: idle ? 'transform' : 'auto',
          }}
        >
      {/* Egg body — fills the wrapper. EggShape draws into a 100×140 viewBox. */}
      <EggShape
        size={width}
        colors={colors}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        title="Tamagotchi shell"
        aria-hidden="true"
      />

      {/* Screen viewport.
          Positioned in the upper interior of the egg. Width/top/height tuned
          so the rounded-rect sits inside the egg silhouette with a thick
          purple bezel and an inner shadow that reads as recessed glass. */}
      <div
        id={screenClipId}
        role="group"
        aria-label="Device screen"
        style={{
          position: 'absolute',
          left: '22%',
          top: '20%',
          width: '56%',
          height: '38%',
          background: screen.bg,
          border: `4px solid ${screen.border}`,
          borderRadius: '14%',
          overflow: 'hidden',
          // Inset shadow for the recessed-glass look + subtle scanline tint.
          boxShadow:
            'inset 0 6px 14px rgba(0,0,0,0.35), inset 0 -2px 4px rgba(255,255,255,0.4), 0 2px 0 rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>

      {/* Button row. Placed along the lower curve of the egg.
          Three circular buttons evenly spaced; each is a real <button> so
          callers get keyboard focus + click semantics for free. */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          top: '72%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6%',
        }}
      >
        {slots.map((btn, i) => {
          const color = btn?.color || defaultButtonColors[i];
          const label = btn?.label ?? '';
          const ariaLabel = btn?.ariaLabel || (typeof label === 'string' ? label : `Button ${i + 1}`);
          const disabled = !btn;
          // Button diameter relative to egg width — keeps shell scalable.
          const btnSize = width * 0.16;

          return (
            <button
              key={i}
              type="button"
              onClick={btn?.onClick}
              disabled={disabled}
              aria-label={ariaLabel}
              style={{
                width: btnSize,
                height: btnSize,
                borderRadius: '50%',
                border: 'none',
                background: disabled
                  ? 'rgba(255,255,255,0.18)'
                  : `radial-gradient(circle at 35% 30%, ${lighten(color, 0.35)}, ${color} 65%, ${darken(color, 0.25)})`,
                color: '#3a2a52',
                fontWeight: 700,
                fontSize: btnSize * 0.42,
                fontFamily:
                  '"Press Start 2P", ui-monospace, SFMono-Regular, Menlo, monospace',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                boxShadow: disabled
                  ? 'inset 0 -2px 4px rgba(0,0,0,0.2)'
                  : '0 4px 0 rgba(0,0,0,0.25), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.5)',
                transition: 'transform 80ms ease, box-shadow 80ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
              onMouseDown={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow =
                  '0 1px 0 rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4)';
              }}
              onMouseUp={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow =
                  '0 4px 0 rgba(0,0,0,0.25), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                if (disabled) return;
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow =
                  '0 4px 0 rgba(0,0,0,0.25), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.5)';
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
}

// --- color helpers --------------------------------------------------------
// Tiny inline lighten/darken so the component stays dependency-free.
// Accepts #rgb / #rrggbb. Falls back to the input on unknown formats.

function parseHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex({ r, g, b }) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function lighten(hex, amt) {
  const p = parseHex(hex);
  if (!p) return hex;
  return toHex({
    r: p.r + (255 - p.r) * amt,
    g: p.g + (255 - p.g) * amt,
    b: p.b + (255 - p.b) * amt,
  });
}

function darken(hex, amt) {
  const p = parseHex(hex);
  if (!p) return hex;
  return toHex({ r: p.r * (1 - amt), g: p.g * (1 - amt), b: p.b * (1 - amt) });
}
