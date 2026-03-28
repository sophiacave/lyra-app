/**
 * FocalGlow — Soft light bloom for emphasis.
 * Draws the viewer's eye to a specific point.
 * Apple uses this in product hero shots — a soft halo behind the subject.
 */
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ACCENT_PURPLE, appleEase } from '../lib/design-tokens.js';

export function FocalGlow({
  x = '50%',
  y = '50%',
  size = 400,
  color = ACCENT_PURPLE,
  intensity = 0.12,
  animateIn = true,
  delay = 0,
  pulse = false,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = intensity;

  if (animateIn) {
    const startFrame = delay * fps;
    const progress = interpolate(
      frame,
      [startFrame, startFrame + fps * 1.2],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    opacity = intensity * appleEase(progress);
  }

  if (pulse) {
    const pulseAmount = Math.sin((frame / fps) * 1.5) * 0.3 + 0.7;
    opacity *= pulseAmount;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: typeof x === 'number' ? x - size / 2 : undefined,
        top: typeof y === 'number' ? y - size / 2 : undefined,
        ...(typeof x === 'string' ? { left: x, transform: 'translate(-50%, -50%)' } : {}),
        ...(typeof y === 'string' && typeof x === 'string' ? { top: y } : {}),
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}
    />
  );
}
