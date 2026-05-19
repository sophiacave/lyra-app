'use client';

import { useId } from 'react';

/**
 * EggShape — pink/purple radial gradient egg with drop shadow.
 *
 * Renders a classic asymmetric egg silhouette (narrower at top, broader at base)
 * filled with a radial gradient (pink core → purple edge) and a soft drop shadow
 * applied via an inline SVG filter so the component is self-contained and CSS-free.
 *
 * Props:
 *   size       — diameter in px for the bounding box (default 240)
 *   colors     — { inner, outer } gradient stops (defaults to pink → purple)
 *   shadow     — { dx, dy, blur, opacity } drop shadow tuning
 *   className  — optional className passthrough
 *   title      — accessibility title (default "Egg")
 *   ...rest    — forwarded to the root <svg>
 */
export default function EggShape({
  size = 240,
  colors = { inner: '#ffb6d9', outer: '#7a3ff2' },
  shadow = { dx: 0, dy: 8, blur: 16, opacity: 0.35 },
  className,
  title = 'Egg',
  ...rest
}) {
  // Stable, collision-free IDs so multiple eggs can render on one page.
  const uid = useId().replace(/:/g, '');
  const gradId = `egg-grad-${uid}`;
  const shadowId = `egg-shadow-${uid}`;
  const titleId = `egg-title-${uid}`;

  // viewBox uses a 100×140 canvas — egg ratio ~5:7 reads as a "real" egg.
  // Path: cubic-bezier silhouette, narrow apex at top, fuller base.
  const eggPath =
    'M50 6 ' +
    'C72 6 92 38 92 78 ' +
    'C92 112 74 134 50 134 ' +
    'C26 134 8 112 8 78 ' +
    'C8 38 28 6 50 6 Z';

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      viewBox="0 0 100 140"
      width={size}
      height={(size * 140) / 100}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title id={titleId}>{title}</title>
      <defs>
        {/* Radial gradient: warm pink core, deep purple edge.
            Offset focal point upward to give the egg a soft highlight. */}
        <radialGradient
          id={gradId}
          cx="50%"
          cy="42%"
          r="60%"
          fx="42%"
          fy="34%"
        >
          <stop offset="0%" stopColor={colors.inner} stopOpacity="1" />
          <stop offset="55%" stopColor={colors.inner} stopOpacity="0.85" />
          <stop offset="100%" stopColor={colors.outer} stopOpacity="1" />
        </radialGradient>

        {/* Drop shadow filter — extra padding so the blur isn't clipped. */}
        <filter
          id={shadowId}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation={shadow.blur / 4} />
          <feOffset dx={shadow.dx / 4} dy={shadow.dy / 4} result="offsetBlur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope={shadow.opacity} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={eggPath}
        fill={`url(#${gradId})`}
        filter={`url(#${shadowId})`}
      />
    </svg>
  );
}
