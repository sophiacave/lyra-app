/**
 * GradientArt — Abstract gradient backgrounds with floating shapes.
 * For breathing/transition moments and atmospheric scenes.
 * Apple-inspired: negative space, calm, purposeful emptiness.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, ACCENT_PURPLE, ACCENT_BLUE,
  TYPE, GRID, MOTION, VIDEO_WIDTH, VIDEO_HEIGHT,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { SceneTransition } from './SceneTransition.jsx';
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';

function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function GradientArt({
  text = '',
  subtext = '',
  colors,
  theme,
  shapeCount = 5,
  mood = 'calm',   // 'calm' | 'energy' | 'dramatic'
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = colors || theme?.orbColors || [ACCENT_PURPLE, ACCENT_BLUE, '#818cf8'];

  const moodConfig = {
    calm:     { speed: 0.08, sizeRange: [200, 500], blur: 80, opacity: 0.06 },
    energy:   { speed: 0.2,  sizeRange: [100, 400], blur: 50, opacity: 0.1 },
    dramatic: { speed: 0.12, sizeRange: [300, 700], blur: 100, opacity: 0.08 },
  }[mood] || { speed: 0.08, sizeRange: [200, 500], blur: 80, opacity: 0.06 };

  // Floating gradient shapes
  const shapes = Array.from({ length: shapeCount }, (_, i) => {
    const r = (s) => seededRandom(i * 73 + s);
    const size = moodConfig.sizeRange[0] + r(1) * (moodConfig.sizeRange[1] - moodConfig.sizeRange[0]);
    const baseX = r(2) * VIDEO_WIDTH;
    const baseY = r(3) * VIDEO_HEIGHT;
    const color = palette[i % palette.length];
    const phase = r(4) * Math.PI * 2;
    const t = (frame / fps) * moodConfig.speed;

    return {
      x: baseX + Math.sin(t + phase) * 80,
      y: baseY + Math.cos(t * 0.7 + phase) * 60,
      size,
      color,
      rotation: t * 20 + i * 45,
    };
  });

  // Text animations
  const textProgress = spring({
    frame: frame - fps * 0.5,
    fps,
    config: MOTION.gentle,
  });

  const subProgress = spring({
    frame: frame - fps * 1.0,
    fps,
    config: MOTION.gentle,
  });

  // Overall fade in
  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <SceneTransition fadeInDuration={0.8} fadeOutDuration={0.6}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {/* Deep base */}
        <AbsoluteFill style={{
          backgroundColor: theme?.bg || '#08080a',
        }} />

        {/* Gradient shapes */}
        {shapes.map((shape, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: shape.x - shape.size / 2,
              top: shape.y - shape.size / 2,
              width: shape.size,
              height: shape.size,
              borderRadius: i % 2 === 0 ? '50%' : '30%',
              background: `radial-gradient(circle, ${shape.color}${Math.round(moodConfig.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: `blur(${moodConfig.blur}px)`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        ))}

        {/* Center text (optional — for atmosphere scenes with a message) */}
        {text && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
            opacity: textProgress,
            textAlign: 'center',
            maxWidth: '70%',
          }}>
            <h2 style={{
              ...typeStyle('title1', TEXT_PRIMARY),
              textShadow: `0 0 60px ${palette[0]}30`,
            }}>
              {text}
            </h2>
          </div>
        )}

        {subtext && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, 40px)`,
            opacity: subProgress,
            textAlign: 'center',
            maxWidth: '60%',
          }}>
            <p style={typeStyle('body', TEXT_SECONDARY)}>
              {subtext}
            </p>
          </div>
        )}

        <Vignette intensity={0.6} radius={65} />
        <FilmGrain intensity={0.025} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
