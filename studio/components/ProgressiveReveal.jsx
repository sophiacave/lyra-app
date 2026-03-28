/**
 * ProgressiveReveal — 3Blue1Brown-style step-by-step diagram build.
 * Each step adds to the diagram, previous steps dim.
 * The concept CONSTRUCTS itself visually.
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
import { FocalGlow } from './FocalGlow.jsx';
import { getIcon } from './icons.jsx';

export function ProgressiveReveal({
  title = '',
  steps = [],
  accentColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = accentColor || theme?.primary || ACCENT_PURPLE;
  const n = steps.length;

  const titleProgress = spring({ frame, fps, config: MOTION.smooth });
  const timePerStep = (durationInFrames * 0.7) / Math.max(n, 1);

  // Diagram area
  const diagramLeft = GRID.margin.content;
  const diagramTop = GRID.margin.outer + 100;
  const diagramW = VIDEO_WIDTH - GRID.margin.content * 2;
  const diagramH = VIDEO_HEIGHT - GRID.margin.outer * 2 - 140;

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
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

        {/* Steps — laid out vertically with progressive reveal */}
        {steps.map((step, i) => {
          const stepDelay = fps * 0.5 + i * timePerStep;
          const stepSpring = spring({
            frame: frame - stepDelay,
            fps,
            config: MOTION.confident,
          });

          // 3B1B dimming: active step is bright, previous steps dim
          const isLatest = frame >= stepDelay && (i === n - 1 || frame < fps * 0.5 + (i + 1) * timePerStep);
          const dimOpacity = stepSpring <= 0.01 ? 0 : (isLatest ? 1.0 : 0.4);

          // Layout: center vertically, spread steps
          const stepH = 80;
          const stepGap = 20;
          const totalH = n * stepH + (n - 1) * stepGap;
          const startY = diagramTop + (diagramH - totalH) / 2;
          const yPos = startY + i * (stepH + stepGap);

          // Connection line to previous step
          const showLine = i > 0 && stepSpring > 0.01;

          // Icon for this step
          const StepIcon = step.icon ? getIcon(step.icon) : null;

          return (
            <div key={i}>
              {/* Connection line */}
              {showLine && (
                <div style={{
                  position: 'absolute',
                  left: diagramLeft + 40,
                  top: yPos - stepGap,
                  width: 2,
                  height: stepGap,
                  background: `linear-gradient(to bottom, ${color}20, ${color}60)`,
                  opacity: stepSpring,
                }} />
              )}

              {/* Step row */}
              <div style={{
                position: 'absolute',
                left: diagramLeft,
                top: yPos,
                width: diagramW,
                height: stepH,
                display: 'flex',
                alignItems: 'center',
                gap: SPACE.lg,
                opacity: dimOpacity,
                transform: `translateX(${interpolate(stepSpring, [0, 1], [30, 0])}px)`,
                transition: 'opacity 0.3s',
              }}>
                {/* Step indicator */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: isLatest ? `${color}20` : SURFACE_GLASS,
                  border: `1px solid ${isLatest ? color + '50' : SURFACE_GLASS_BORDER}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isLatest ? DEPTH.glow(color, 20) : 'none',
                }}>
                  {StepIcon ? (
                    <StepIcon size={40} color={color} progress={appleEase(stepSpring)} />
                  ) : (
                    <span style={{
                      ...typeStyle('title3', isLatest ? color : TEXT_SECONDARY),
                      fontWeight: 700,
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    ...typeStyle('headline', TEXT_PRIMARY),
                    margin: 0,
                  }}>
                    {step.label || step}
                  </p>
                  {step.detail && (
                    <p style={{
                      ...typeStyle('body', TEXT_SECONDARY),
                      margin: 0, marginTop: 4,
                    }}>
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <FocalGlow x="20%" y="50%" size={400} color={color} intensity={0.05} delay={0.3} />
        <AmbientParticles count={5} opacity={0.06} speed={0.2} />
        <Vignette intensity={0.4} radius={80} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
