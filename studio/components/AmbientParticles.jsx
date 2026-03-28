/**
 * AmbientParticles — Floating orbs that make the frame feel alive.
 * Inspired by Apple's spatial computing visuals.
 * Each particle drifts on a unique sine wave path.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate } from 'remotion';
import { VIDEO_WIDTH, VIDEO_HEIGHT, ACCENT_PURPLE, ACCENT_BLUE, ACCENT_CYAN } from '../lib/design-tokens.js';

// Deterministic pseudo-random from seed
function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function AmbientParticles({
  count = 12,
  colors = [ACCENT_PURPLE, ACCENT_BLUE, ACCENT_CYAN],
  minSize = 2,
  maxSize = 6,
  opacity = 0.15,
  speed = 0.3,
  blur = true,
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const r = (seed) => seededRandom(i * 100 + seed);
    const baseX = r(1) * VIDEO_WIDTH;
    const baseY = r(2) * VIDEO_HEIGHT;
    const size = minSize + r(3) * (maxSize - minSize);
    const color = colors[Math.floor(r(4) * colors.length)];
    const phaseX = r(5) * Math.PI * 2;
    const phaseY = r(6) * Math.PI * 2;
    const amplitudeX = 30 + r(7) * 80;
    const amplitudeY = 20 + r(8) * 60;
    const freqX = 0.3 + r(9) * 0.7;
    const freqY = 0.4 + r(10) * 0.6;
    const particleOpacity = (0.4 + r(11) * 0.6) * opacity;
    const blurAmount = blur ? 1 + r(12) * 3 : 0;

    const t = (frame / fps) * speed;
    const x = baseX + Math.sin(t * freqX + phaseX) * amplitudeX;
    const y = baseY + Math.cos(t * freqY + phaseY) * amplitudeY;

    // Fade in at start, fade out at end
    const fadeIn = interpolate(frame, [0, fps * 1.5], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(frame, [durationInFrames - fps * 1, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
    const finalOpacity = particleOpacity * fadeIn * fadeOut;

    return { x, y, size, color, finalOpacity, blurAmount };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x - p.size,
            top: p.y - p.size,
            width: p.size * 2,
            height: p.size * 2,
            borderRadius: '50%',
            backgroundColor: p.color,
            opacity: p.finalOpacity,
            filter: p.blurAmount > 0 ? `blur(${p.blurAmount}px)` : undefined,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}40`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}
