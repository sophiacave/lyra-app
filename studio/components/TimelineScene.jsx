/**
 * TimelineScene — Vertical timeline with animated entries.
 * Each step appears with a node, connector line, and label.
 * Positioned using golden ratio — timeline at left third, content to right.
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  ACCENT_PURPLE, ACCENT_CYAN,
  TYPE, SPACE, GRID, MOTION, DEPTH, VIDEO_HEIGHT,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';

export function TimelineScene({
  steps = [],
  accentColor = ACCENT_PURPLE,
  delay = 0,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const timelineX = GRID.thirds.left - 60;
  const startY = GRID.margin.outer + 60;
  const stepSpacing = Math.min(120, (VIDEO_HEIGHT - startY * 2) / Math.max(steps.length, 1));

  return (
    <>
      {steps.map((step, i) => {
        const stepDelay = delay + i * 0.25;
        const nodeProgress = spring({
          frame: frame - stepDelay * fps,
          fps,
          config: MOTION.bouncy,
        });

        const lineProgress = spring({
          frame: frame - (stepDelay + 0.1) * fps,
          fps,
          config: MOTION.gentle,
        });

        const textProgress = spring({
          frame: frame - (stepDelay + 0.15) * fps,
          fps,
          config: MOTION.smooth,
        });

        const cy = startY + i * stepSpacing;
        const isLast = i === steps.length - 1;
        const nodeSize = 14;

        return (
          <div key={i}>
            {/* Connector line to next node */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: timelineX - 0.5,
                top: cy + nodeSize / 2,
                width: 1,
                height: (stepSpacing - nodeSize) * lineProgress,
                backgroundColor: `${accentColor}30`,
              }} />
            )}

            {/* Node dot */}
            <div style={{
              position: 'absolute',
              left: timelineX - nodeSize / 2,
              top: cy - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              borderRadius: '50%',
              backgroundColor: accentColor,
              transform: `scale(${nodeProgress})`,
              opacity: nodeProgress,
              boxShadow: DEPTH.glow(accentColor, 15),
            }} />

            {/* Step number */}
            <div style={{
              position: 'absolute',
              left: timelineX - 60,
              top: cy - 10,
              width: 32,
              textAlign: 'right',
              opacity: textProgress * 0.4,
            }}>
              <span style={typeStyle('caption', TEXT_TERTIARY)}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Step content */}
            <div style={{
              position: 'absolute',
              left: timelineX + 40,
              top: cy - 14,
              opacity: textProgress,
              transform: `translateX(${interpolate(textProgress, [0, 1], [20, 0])}px)`,
            }}>
              <span style={typeStyle('headline', TEXT_PRIMARY)}>
                {step.title || step}
              </span>
              {step.description && (
                <p style={{
                  ...typeStyle('body', TEXT_SECONDARY),
                  marginTop: SPACE.xs,
                  maxWidth: 700,
                }}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
