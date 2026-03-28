/**
 * StatReveal — Big number animation with context label.
 * Number counts up dramatically, then context fades in.
 * E.g., "86 billion neurons" — the stat IS the scene.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, ACCENT_PURPLE, ACCENT_WARM,
  TYPE, GRID, MOTION, DEPTH,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { DepthBackground } from './DepthBackground.jsx';
import { SceneTransition } from './SceneTransition.jsx';
import { FocalGlow } from './FocalGlow.jsx';
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';

function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return Math.round(n).toLocaleString();
}

export function StatReveal({
  stat = '86',
  unit = 'billion',
  label = 'neurons in your brain',
  prefix = '',
  suffix = '',
  countUp = true,
  accentColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = accentColor || theme?.primary || ACCENT_WARM;

  // Parse the stat as a number for counting
  const statNum = parseFloat(stat.replace(/,/g, ''));
  const isNumeric = !isNaN(statNum) && countUp;

  // Count-up animation (0.3s to 1.5s)
  const countProgress = interpolate(frame, [fps * 0.3, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const displayStat = isNumeric
    ? formatNumber(statNum * appleEase(countProgress))
    : stat;

  // Scale punch on entry
  const scaleSpring = spring({
    frame: frame - fps * 0.2,
    fps,
    config: { mass: 1.5, damping: 12, stiffness: 200 },
  });

  // Unit appears after number
  const unitProgress = spring({
    frame: frame - fps * 1.3,
    fps,
    config: MOTION.smooth,
  });

  // Context label
  const labelProgress = spring({
    frame: frame - fps * 1.8,
    fps,
    config: MOTION.gentle,
  });

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.5}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={color}
          lightIntensity={0.12}
          gridOpacity={0}
          orbCount={2}
          orbColors={theme?.orbColors || [color, ACCENT_PURPLE]}
        />

        <FocalGlow x="50%" y="45%" size={700} color={color} intensity={0.1} delay={0} />

        {/* Big number */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -60%) scale(${scaleSpring})`,
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
            fontSize: 160,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            color: TEXT_PRIMARY,
            textShadow: `0 0 80px ${color}50, 0 0 160px ${color}20`,
          }}>
            {prefix}{isNumeric && countProgress < 1 ? displayStat : stat}{suffix}
          </span>
        </div>

        {/* Unit */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, 20px)`,
          opacity: unitProgress,
          textAlign: 'center',
        }}>
          <span style={{
            ...typeStyle('title2', color),
            fontWeight: 500,
          }}>
            {unit}
          </span>
        </div>

        {/* Context label */}
        <div style={{
          position: 'absolute',
          bottom: GRID.margin.outer + 100,
          left: '50%',
          transform: `translateX(-50%) translateY(${interpolate(labelProgress, [0, 1], [15, 0])}px)`,
          opacity: labelProgress,
          textAlign: 'center',
          maxWidth: '60%',
        }}>
          <p style={typeStyle('headline', TEXT_SECONDARY)}>
            {label}
          </p>
        </div>

        <Vignette intensity={0.5} radius={65} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
