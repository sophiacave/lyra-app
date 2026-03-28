/**
 * Vignette — Soft edge darkening.
 * Draws the eye to center. A fundamental of cinematic composition.
 * Apple uses this subtly in their keynote visuals.
 */
import { AbsoluteFill } from 'remotion';

export function Vignette({ intensity = 0.6, radius = 70 }) {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(ellipse ${radius}% ${radius}% at 50% 50%, transparent 0%, rgba(0, 0, 0, ${intensity}) 100%)`,
      }}
    />
  );
}
