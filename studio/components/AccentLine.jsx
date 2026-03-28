/**
 * AccentLine — Animated gradient line.
 * A signature Like One visual element.
 * Grows from center with precise Apple-style timing.
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ACCENT_PURPLE, ACCENT_BLUE, MOTION, appleEase } from '../lib/design-tokens.js';

export function AccentLine({
  width = 400,
  height = 2,
  x = '50%',
  y = '50%',
  colors = [ACCENT_PURPLE, ACCENT_BLUE],
  delay = 0,
  direction = 'horizontal', // 'horizontal' | 'vertical'
  glow = true,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.smooth,
  });

  const currentWidth = direction === 'horizontal' ? width * progress : height;
  const currentHeight = direction === 'vertical' ? width * progress : height;

  const gradient = `linear-gradient(${direction === 'horizontal' ? '90deg' : '180deg'}, ${colors.join(', ')})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: currentWidth,
        height: currentHeight,
        background: gradient,
        borderRadius: height,
        opacity: Math.min(progress * 3, 1),
        boxShadow: glow ? `0 0 20px ${colors[0]}30, 0 0 40px ${colors[0]}15` : undefined,
      }}
    />
  );
}
