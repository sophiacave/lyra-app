/**
 * SplitScreen — Before/after or concept/reality side-by-side.
 * Animated reveal: left side slides in, divider draws, right side follows.
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
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';
import { getIcon } from './icons.jsx';

export function SplitScreen({
  leftTitle = 'Before',
  rightTitle = 'After',
  leftItems = [],
  rightItems = [],
  leftIcon,
  rightIcon,
  leftColor,
  rightColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lColor = leftColor || theme?.secondary || ACCENT_CYAN;
  const rColor = rightColor || theme?.primary || ACCENT_PURPLE;

  // Left side slides in
  const leftProgress = spring({
    frame: frame - fps * 0.3,
    fps,
    config: MOTION.confident,
  });

  // Divider draws
  const dividerProgress = interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Right side slides in
  const rightProgress = spring({
    frame: frame - fps * 0.8,
    fps,
    config: MOTION.confident,
  });

  const LeftIcon = leftIcon ? getIcon(leftIcon) : null;
  const RightIcon = rightIcon ? getIcon(rightIcon) : null;

  const panelW = VIDEO_WIDTH / 2 - GRID.margin.outer - 30;
  const panelH = VIDEO_HEIGHT - GRID.margin.outer * 2 - 40;

  function renderSide(title, items, color, progress, IconComp, side) {
    const x = side === 'left' ? GRID.margin.outer : VIDEO_WIDTH / 2 + 30;
    return (
      <div style={{
        position: 'absolute',
        left: x,
        top: GRID.margin.outer + 20,
        width: panelW,
        height: panelH,
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [side === 'left' ? -40 : 40, 0])}px)`,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACE.md,
          marginBottom: SPACE.xl,
        }}>
          {IconComp && <IconComp size={36} color={color} progress={progress} />}
          <h3 style={typeStyle('title3', color)}>{title}</h3>
        </div>

        {/* Items */}
        {items.map((item, i) => {
          const itemDelay = 0.15 * i;
          const itemProgress = interpolate(
            progress, [0.3 + itemDelay, 0.6 + itemDelay], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div key={i} style={{
              padding: `${SPACE.md}px ${SPACE.lg}px`,
              marginBottom: SPACE.sm,
              borderRadius: 12,
              backgroundColor: SURFACE_GLASS,
              border: `1px solid ${color}20`,
              opacity: itemProgress,
              transform: `translateY(${interpolate(itemProgress, [0, 1], [10, 0])}px)`,
            }}>
              <span style={typeStyle('body', TEXT_PRIMARY)}>
                {typeof item === 'string' ? item : item.label || item.text}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={theme?.primary || ACCENT_PURPLE}
          lightIntensity={0.06}
          gridOpacity={0.015}
          orbCount={2}
        />

        {renderSide(leftTitle, leftItems, lColor, leftProgress, LeftIcon, 'left')}

        {/* Center divider */}
        <div style={{
          position: 'absolute',
          left: VIDEO_WIDTH / 2 - 1,
          top: GRID.margin.outer + 20,
          width: 2,
          height: panelH * appleEase(dividerProgress),
          background: `linear-gradient(to bottom, transparent, ${ACCENT_PURPLE}40, transparent)`,
        }} />

        {renderSide(rightTitle, rightItems, rColor, rightProgress, RightIcon, 'right')}

        <Vignette intensity={0.4} radius={80} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
