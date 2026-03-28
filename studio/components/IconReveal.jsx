/**
 * IconReveal — Large animated SVG icon with label.
 * Icon draws itself stroke-by-stroke, then label fades in.
 * Kurzgesagt-inspired: one bold visual, one clear idea.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import {
  TEXT_PRIMARY, ACCENT_PURPLE, FONT_FAMILY,
  TYPE, SPACE, GRID, MOTION, DEPTH,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { DepthBackground } from './DepthBackground.jsx';
import { SceneTransition } from './SceneTransition.jsx';
import { AmbientParticles } from './AmbientParticles.jsx';
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';
import { FocalGlow } from './FocalGlow.jsx';
import { getIcon } from './icons.jsx';

export function IconReveal({
  icon = 'brain',
  label = '',
  subtitle = '',
  iconSize = 280,
  iconColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const color = iconColor || theme?.primary || ACCENT_PURPLE;
  const IconComponent = getIcon(icon);

  // Icon draws over 1.2s
  const drawProgress = interpolate(frame, [fps * 0.3, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Icon scale bounce
  const scaleSpring = spring({
    frame: frame - fps * 0.2,
    fps,
    config: MOTION.confident,
  });

  // Label appears after icon is drawn
  const labelProgress = spring({
    frame: frame - fps * 1.4,
    fps,
    config: MOTION.smooth,
  });

  // Subtitle
  const subProgress = spring({
    frame: frame - fps * 1.8,
    fps,
    config: MOTION.gentle,
  });

  // Glow pulse
  const glowPulse = 0.08 + Math.sin(frame / fps * 1.5) * 0.02;

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.5}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={color}
          lightIntensity={0.1}
          gridOpacity={0.015}
          orbCount={2}
          orbColors={theme?.orbColors || [color, ACCENT_PURPLE]}
        />

        <FocalGlow x="50%" y="40%" size={500} color={color} intensity={glowPulse} delay={0} />

        {/* Icon — centered, large */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -55%) scale(${scaleSpring})`,
          filter: `drop-shadow(0 0 40px ${color}30)`,
        }}>
          <IconComponent
            size={iconSize}
            color={color}
            strokeWidth={1.5}
            progress={appleEase(drawProgress)}
          />
        </div>

        {/* Label */}
        <div style={{
          position: 'absolute',
          bottom: GRID.margin.outer + 120,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(labelProgress, [0, 1], [20, 0])}px)`,
          opacity: labelProgress,
          textAlign: 'center',
        }}>
          <h2 style={{
            ...typeStyle('title1', TEXT_PRIMARY),
            textShadow: `0 0 40px ${color}40`,
          }}>
            {label}
          </h2>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div style={{
            position: 'absolute',
            bottom: GRID.margin.outer + 60,
            left: '50%',
            transform: `translateX(-50%) translateY(${interpolate(subProgress, [0, 1], [10, 0])}px)`,
            opacity: subProgress,
            textAlign: 'center',
            maxWidth: '60%',
          }}>
            <p style={typeStyle('body', theme?.secondary || TEXT_PRIMARY)}>
              {subtitle}
            </p>
          </div>
        )}

        <AmbientParticles count={6} opacity={0.08} speed={0.2} />
        <Vignette intensity={0.5} radius={70} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
