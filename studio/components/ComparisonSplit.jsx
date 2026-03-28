/**
 * ComparisonSplit — Side-by-side comparison layout.
 * Left vs right with a center divider.
 * Great for before/after, pros/cons, concept A vs concept B.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY,
  ACCENT_PURPLE, ACCENT_BLUE, ACCENT_WARM,
  FONT_FAMILY, TYPE, SPACE, GRID, MOTION, DEPTH,
  VIDEO_WIDTH, VIDEO_HEIGHT,
  typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { GlassPanel } from './GlassPanel.jsx';

export function ComparisonSplit({
  leftTitle,
  rightTitle,
  leftItems = [],
  rightItems = [],
  leftColor = ACCENT_BLUE,
  rightColor = ACCENT_PURPLE,
  delay = 0,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;
  const centerX = VIDEO_WIDTH / 2;

  // Center divider grows from middle
  const dividerProgress = spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.smooth,
  });
  const dividerHeight = VIDEO_HEIGHT * 0.5 * dividerProgress;

  // Titles
  const leftTitleProgress = spring({
    frame: frame - (delay + 0.2) * fps,
    fps,
    config: MOTION.smooth,
  });
  const rightTitleProgress = spring({
    frame: frame - (delay + 0.3) * fps,
    fps,
    config: MOTION.smooth,
  });

  const panelTop = GRID.margin.outer + 100;
  const panelWidth = (VIDEO_WIDTH - GRID.margin.outer * 2 - SPACE['3xl']) / 2;

  return (
    <>
      {/* Center divider */}
      <div style={{
        position: 'absolute',
        left: centerX - 0.5,
        top: VIDEO_HEIGHT / 2 - dividerHeight / 2,
        width: 1,
        height: dividerHeight,
        background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)`,
      }} />

      {/* Left side */}
      <div style={{
        position: 'absolute',
        left: GRID.margin.outer,
        top: panelTop,
        width: panelWidth,
      }}>
        {/* Left title */}
        <div style={{
          opacity: leftTitleProgress,
          transform: `translateX(${interpolate(leftTitleProgress, [0, 1], [-20, 0])}px)`,
          marginBottom: SPACE.xl,
          display: 'flex',
          alignItems: 'center',
          gap: SPACE.md,
        }}>
          <div style={{
            width: 4,
            height: 28,
            backgroundColor: leftColor,
            borderRadius: 2,
          }} />
          <span style={typeStyle('title3', leftColor)}>{leftTitle}</span>
        </div>

        {/* Left items */}
        {leftItems.map((item, i) => {
          const itemProgress = spring({
            frame: frame - (delay + 0.5 + i * 0.15) * fps,
            fps,
            config: MOTION.smooth,
          });

          return (
            <div
              key={i}
              style={{
                opacity: itemProgress,
                transform: `translateX(${interpolate(itemProgress, [0, 1], [-15, 0])}px)`,
                marginBottom: SPACE.lg,
                paddingLeft: SPACE.lg,
              }}
            >
              <span style={typeStyle('body', TEXT_PRIMARY)}>{item}</span>
            </div>
          );
        })}
      </div>

      {/* Right side */}
      <div style={{
        position: 'absolute',
        right: GRID.margin.outer,
        top: panelTop,
        width: panelWidth,
      }}>
        {/* Right title */}
        <div style={{
          opacity: rightTitleProgress,
          transform: `translateX(${interpolate(rightTitleProgress, [0, 1], [20, 0])}px)`,
          marginBottom: SPACE.xl,
          display: 'flex',
          alignItems: 'center',
          gap: SPACE.md,
        }}>
          <div style={{
            width: 4,
            height: 28,
            backgroundColor: rightColor,
            borderRadius: 2,
          }} />
          <span style={typeStyle('title3', rightColor)}>{rightTitle}</span>
        </div>

        {/* Right items */}
        {rightItems.map((item, i) => {
          const itemProgress = spring({
            frame: frame - (delay + 0.6 + i * 0.15) * fps,
            fps,
            config: MOTION.smooth,
          });

          return (
            <div
              key={i}
              style={{
                opacity: itemProgress,
                transform: `translateX(${interpolate(itemProgress, [0, 1], [15, 0])}px)`,
                marginBottom: SPACE.lg,
                paddingLeft: SPACE.lg,
              }}
            >
              <span style={typeStyle('body', TEXT_PRIMARY)}>{item}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
