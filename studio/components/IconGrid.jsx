/**
 * IconGrid — Grid of icons appearing with stagger animation.
 * Shows a category of items. Each icon pops in with a label.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_SECONDARY, ACCENT_PURPLE,
  SURFACE_GLASS, SURFACE_GLASS_BORDER,
  TYPE, SPACE, GRID, MOTION, DEPTH, VIDEO_WIDTH, VIDEO_HEIGHT,
  typeStyle,
} from '../lib/design-tokens.js';
import { DepthBackground } from './DepthBackground.jsx';
import { SceneTransition } from './SceneTransition.jsx';
import { AmbientParticles } from './AmbientParticles.jsx';
import { Vignette } from './Vignette.jsx';
import { FilmGrain } from './FilmGrain.jsx';
import { getIcon } from './icons.jsx';

export function IconGrid({
  title = '',
  items = [],
  columns = 0,
  iconSize = 48,
  accentColor,
  theme,
  durationInFrames,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = accentColor || theme?.primary || ACCENT_PURPLE;
  const n = items.length;

  // Auto columns: 3 for ≤6, 4 for ≤12, 5 for more
  const cols = columns || (n <= 6 ? 3 : n <= 12 ? 4 : 5);
  const rows = Math.ceil(n / cols);

  const cellW = 180;
  const cellH = 140;
  const gapX = 30;
  const gapY = 24;
  const totalW = cols * cellW + (cols - 1) * gapX;
  const totalH = rows * cellH + (rows - 1) * gapY;
  const startX = (VIDEO_WIDTH - totalW) / 2;
  const startY = (VIDEO_HEIGHT - totalH) / 2 + (title ? 40 : 0);

  const titleProgress = spring({ frame, fps, config: MOTION.smooth });

  return (
    <SceneTransition fadeInDuration={0.5} fadeOutDuration={0.4}>
      <AbsoluteFill>
        <DepthBackground
          lightPosition="center"
          lightColor={color}
          lightIntensity={0.06}
          gridOpacity={0.015}
          orbCount={2}
          orbColors={theme?.orbColors || [color, ACCENT_PURPLE]}
        />

        {/* Title */}
        {title && (
          <div style={{
            position: 'absolute',
            top: GRID.margin.outer,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: titleProgress,
          }}>
            <h2 style={typeStyle('title2', color)}>{title}</h2>
          </div>
        )}

        {/* Grid items */}
        {items.map((item, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * (cellW + gapX);
          const y = startY + row * (cellH + gapY);

          // Stagger: top-left to bottom-right
          const staggerDelay = fps * 0.4 + (row * cols + col) * fps * MOTION.stagger.normal;
          const itemSpring = spring({
            frame: frame - staggerDelay,
            fps,
            config: MOTION.bouncy,
          });

          const IconComp = getIcon(item.icon || 'sparkle');

          return (
            <div key={i} style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cellW,
              height: cellH,
              transform: `scale(${itemSpring})`,
              opacity: itemSpring,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: SPACE.sm,
            }}>
              <div style={{
                width: iconSize + 24,
                height: iconSize + 24,
                borderRadius: 16,
                backgroundColor: SURFACE_GLASS,
                border: `1px solid ${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: DEPTH.glow(color, 15),
              }}>
                <IconComp size={iconSize} color={color} progress={1} />
              </div>
              <span style={{
                ...typeStyle('callout', TEXT_PRIMARY),
                textAlign: 'center',
              }}>
                {item.label || item}
              </span>
            </div>
          );
        })}

        <AmbientParticles count={5} opacity={0.05} speed={0.2} />
        <Vignette intensity={0.4} radius={80} />
        <FilmGrain intensity={0.03} />
      </AbsoluteFill>
    </SceneTransition>
  );
}
