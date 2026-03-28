/**
 * FilmGrain — Cinematic noise overlay.
 * Adds organic texture that separates video from "PowerPoint."
 * Subtle by default. Intensity 0.03–0.06 is the sweet spot.
 */
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export function FilmGrain({ intensity = 0.04, speed = 1 }) {
  const frame = useCurrentFrame();
  // Shift the noise pattern every few frames for organic movement
  const seed = Math.floor(frame * speed) * 1000;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <svg width="100%" height="100%" style={{ opacity: intensity }}>
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
}
