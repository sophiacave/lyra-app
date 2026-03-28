/**
 * GlassPanel — Frosted glass surface.
 * Apple's signature material: translucent, layered, alive.
 * Use for content containers that need to float above the background.
 */
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SURFACE_GLASS, SURFACE_GLASS_BORDER, DEPTH, appleEase } from '../lib/design-tokens.js';

export function GlassPanel({
  children,
  x = 0,
  y = 0,
  width,
  height,
  blur = 40,
  borderRadius = 24,
  padding = 40,
  animateIn = true,
  delay = 0,
  style = {},
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  if (animateIn) {
    const startFrame = delay * fps;
    const progress = interpolate(
      frame,
      [startFrame, startFrame + fps * 0.6],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    const eased = appleEase(progress);
    opacity = eased;
    translateY = interpolate(eased, [0, 1], [20, 0]);
    scale = interpolate(eased, [0, 1], [0.97, 1]);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: SURFACE_GLASS,
        backdropFilter: `blur(${blur}px) saturate(1.5)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.5)`,
        border: `1px solid ${SURFACE_GLASS_BORDER}`,
        borderRadius,
        padding,
        boxShadow: DEPTH.medium,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
