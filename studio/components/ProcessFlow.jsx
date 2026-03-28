/**
 * ProcessFlow — Animated flowchart with sequential arrow connections.
 * Boxes draw themselves, arrows animate between them.
 * Better than dot diagrams for showing processes and sequences.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, ACCENT_PURPLE, ACCENT_CYAN,
  SURFACE_GLASS, SURFACE_GLASS_BORDER,
  TYPE, SPACE, GRID, MOTION, DEPTH, VIDEO_WIDTH, VIDEO_HEIGHT,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { DepthBackground } from './DepthBackground.jsx';
import { SceneTransition } from './SceneTransition.jsx';
import { AmbientParticles } from './AmbientParticles.jsx';
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';

export function ProcessFlow({
  title = '',
  steps = [],
  layout = 'horizontal',  // 'horizontal' | 'vertical' | 'grid'
  accentColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = accentColor || theme?.primary || ACCENT_PURPLE;
  const n = steps.length;

  // Title
  const titleProgress = spring({ frame, fps, config: MOTION.smooth });

  // Layout calculation
  const isHorizontal = layout === 'horizontal';
  const boxW = isHorizontal ? Math.min(220, (VIDEO_WIDTH - 400) / n) : 400;
  const boxH = isHorizontal ? 120 : 70;
  const gap = isHorizontal ? 60 : 40;

  function getBoxPos(i) {
    if (isHorizontal) {
      const totalW = n * boxW + (n - 1) * gap;
      const startX = (VIDEO_WIDTH - totalW) / 2;
      return { x: startX + i * (boxW + gap), y: VIDEO_HEIGHT / 2 - boxH / 2 + 30 };
    }
    const totalH = n * boxH + (n - 1) * gap;
    const startY = (VIDEO_HEIGHT - totalH) / 2 + 40;
    return { x: VIDEO_WIDTH / 2 - boxW / 2, y: startY + i * (boxH + gap) };
  }

  const timePerStep = (durationInFrames * 0.6) / Math.max(n, 1);

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition={isHorizontal ? 'center' : 'left'}
          lightColor={color}
          lightIntensity={0.07}
          gridOpacity={0.02}
          orbCount={2}
          orbColors={theme?.orbColors || [color, ACCENT_CYAN]}
        />

        {/* Title */}
        {title && (
          <div style={{
            position: 'absolute',
            top: GRID.margin.outer,
            left: '50%',
            transform: `translateX(-50%) translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
            opacity: titleProgress,
          }}>
            <h2 style={typeStyle('title2', color)}>{title}</h2>
          </div>
        )}

        {/* Arrows between boxes */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {steps.slice(0, -1).map((_, i) => {
            const from = getBoxPos(i);
            const to = getBoxPos(i + 1);
            const arrowDelay = fps * 0.5 + (i + 0.5) * timePerStep;
            const arrowProgress = interpolate(frame, [arrowDelay, arrowDelay + fps * 0.4], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            const x1 = isHorizontal ? from.x + boxW + 8 : from.x + boxW / 2;
            const y1 = isHorizontal ? from.y + boxH / 2 : from.y + boxH + 8;
            const x2 = isHorizontal ? to.x - 8 : to.x + boxW / 2;
            const y2 = isHorizontal ? to.y + boxH / 2 : to.y - 8;

            const cx = x1 + (x2 - x1) * appleEase(arrowProgress);
            const cy = y1 + (y2 - y1) * appleEase(arrowProgress);

            return (
              <g key={`arrow-${i}`}>
                <line x1={x1} y1={y1} x2={cx} y2={cy}
                  stroke={color} strokeWidth={2} opacity={0.5 * arrowProgress}
                  strokeLinecap="round" />
                {arrowProgress > 0.9 && (
                  <polygon
                    points={isHorizontal
                      ? `${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`
                      : `${x2},${y2} ${x2-5},${y2-8} ${x2+5},${y2-8}`}
                    fill={color} opacity={0.6}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Step boxes */}
        {steps.map((step, i) => {
          const pos = getBoxPos(i);
          const boxDelay = fps * 0.3 + i * timePerStep;
          const boxSpring = spring({
            frame: frame - boxDelay,
            fps,
            config: MOTION.confident,
          });

          const labelDelay = boxDelay + fps * 0.15;
          const labelProgress = spring({
            frame: frame - labelDelay,
            fps,
            config: MOTION.smooth,
          });

          return (
            <div key={i} style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: boxW,
              height: boxH,
              transform: `scale(${boxSpring})`,
              opacity: boxSpring,
            }}>
              {/* Glass box */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                backgroundColor: SURFACE_GLASS,
                border: `1px solid ${color}30`,
                boxShadow: DEPTH.glow(color, 20),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: SPACE.md,
              }}>
                {/* Step number */}
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: isHorizontal ? '50%' : -12,
                  transform: isHorizontal ? 'translateX(-50%)' : 'none',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: boxSpring,
                }}>
                  <span style={{ ...typeStyle('caption', '#fff'), fontWeight: 700 }}>{i + 1}</span>
                </div>

                {/* Label */}
                <span style={{
                  ...typeStyle(isHorizontal ? 'callout' : 'headline', TEXT_PRIMARY),
                  textAlign: 'center',
                  opacity: labelProgress,
                }}>
                  {step.label || step}
                </span>

                {/* Description (if provided) */}
                {step.desc && (
                  <span style={{
                    ...typeStyle('caption', TEXT_SECONDARY),
                    textAlign: 'center',
                    marginTop: 4,
                    opacity: labelProgress * 0.7,
                  }}>
                    {step.desc}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <AmbientParticles count={5} opacity={0.06} speed={0.2} />
        <Vignette intensity={0.4} radius={80} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
