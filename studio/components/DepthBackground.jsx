/**
 * DepthBackground — Multi-layer parallax background.
 * Creates spatial depth without 3D rendering.
 * Inspired by Apple's layered approach to spatial UI.
 *
 * Layers:
 * 1. Base color (deepest)
 * 2. Soft radial gradient (ambient light source)
 * 3. Subtle grid (spatial reference)
 * 4. Floating gradient orbs (depth cue, out of focus)
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
  SURFACE_BASE, ACCENT_PURPLE, ACCENT_BLUE, ACCENT_INDIGO,
  VIDEO_WIDTH, VIDEO_HEIGHT, appleEase,
} from '../lib/design-tokens.js';

function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function DepthBackground({
  lightPosition = 'center',   // 'center' | 'top-left' | 'top-right' | 'bottom'
  lightColor = ACCENT_PURPLE,
  lightIntensity = 0.08,
  gridOpacity = 0.025,
  gridSize = 80,
  orbCount = 3,
  orbColors = [ACCENT_PURPLE, ACCENT_BLUE, ACCENT_INDIGO],
  orbOpacity = 0.06,
  animate = true,
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Light position mapping
  const lightPos = {
    'center': '50% 45%',
    'top-left': '25% 20%',
    'top-right': '75% 20%',
    'bottom': '50% 85%',
    'left': '20% 50%',
    'right': '80% 50%',
  }[lightPosition] || '50% 45%';

  // Fade in the whole background
  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], { extrapolateRight: 'clamp' });

  // Orbs — large, blurred gradient circles that drift slowly
  const orbs = Array.from({ length: orbCount }, (_, i) => {
    const r = (s) => seededRandom(i * 50 + s);
    const size = 300 + r(1) * 500;
    const baseX = r(2) * VIDEO_WIDTH;
    const baseY = r(3) * VIDEO_HEIGHT;
    const color = orbColors[i % orbColors.length];
    const phase = r(4) * Math.PI * 2;

    const t = animate ? (frame / fps) * 0.15 : 0;
    const x = baseX + Math.sin(t + phase) * 60;
    const y = baseY + Math.cos(t * 0.7 + phase) * 40;

    return { x, y, size, color };
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Layer 1: Base */}
      <AbsoluteFill style={{ backgroundColor: SURFACE_BASE }} />

      {/* Layer 2: Ambient light */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at ${lightPos}, ${lightColor}${Math.round(lightIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />

      {/* Layer 3: Gradient orbs (deep background, heavily blurred) */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: orb.x - orb.size / 2,
            top: orb.y - orb.size / 2,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}${Math.round(orbOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      ))}

      {/* Layer 4: Grid */}
      {gridOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,${gridOpacity}) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,${gridOpacity}) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}
    </AbsoluteFill>
  );
}
