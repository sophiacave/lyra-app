/**
 * OutroScene — End card with CTA.
 * Clean, centered, brand-forward. Like Apple's "shot on iPhone" end cards.
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  TEXT_PRIMARY, TEXT_TERTIARY, ACCENT_PURPLE, ACCENT_BLUE,
  TYPE, SPACE, MOTION, typeStyle, appleEase,
} from '../lib/design-tokens.js';
import { AccentLine } from './AccentLine.jsx';

export function OutroScene({
  heading = 'Keep learning.',
  subtext = 'likeone.ai',
  ctaText,
  delay = 0,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;

  // Brand mark
  const brandProgress = spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.gentle,
  });

  // Heading
  const headingProgress = spring({
    frame: frame - (delay + 0.4) * fps,
    fps,
    config: MOTION.smooth,
  });

  // Subtext
  const subProgress = spring({
    frame: frame - (delay + 0.7) * fps,
    fps,
    config: MOTION.smooth,
  });

  // CTA
  const ctaProgress = spring({
    frame: frame - (delay + 1.0) * fps,
    fps,
    config: MOTION.smooth,
  });

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACE['2xl'],
    }}>
      {/* Brand */}
      <div style={{
        opacity: brandProgress,
        transform: `scale(${interpolate(brandProgress, [0, 1], [0.9, 1])})`,
      }}>
        <span style={{
          ...typeStyle('title3', TEXT_TERTIARY),
          fontWeight: 700,
        }}>
          like <span style={{ color: ACCENT_PURPLE }}>one</span>
        </span>
      </div>

      {/* Accent line */}
      <AccentLine width={200} height={2} x="50%" y="50%" delay={delay + 0.2} />

      {/* Heading */}
      <div style={{
        opacity: headingProgress,
        transform: `translateY(${interpolate(headingProgress, [0, 1], [20, 0])}px)`,
      }}>
        <h2 style={typeStyle('display', TEXT_PRIMARY)}>{heading}</h2>
      </div>

      {/* Subtext / URL */}
      <div style={{
        opacity: subProgress,
        transform: `translateY(${interpolate(subProgress, [0, 1], [10, 0])}px)`,
      }}>
        <span style={typeStyle('callout', TEXT_TERTIARY)}>{subtext}</span>
      </div>

      {/* CTA button (optional) */}
      {ctaText && (
        <div style={{
          opacity: ctaProgress,
          transform: `translateY(${interpolate(ctaProgress, [0, 1], [10, 0])}px)`,
          marginTop: SPACE.lg,
          padding: `${SPACE.md}px ${SPACE.xl}px`,
          background: `linear-gradient(135deg, ${ACCENT_PURPLE}, ${ACCENT_BLUE})`,
          borderRadius: 12,
        }}>
          <span style={typeStyle('callout', TEXT_PRIMARY)}>{ctaText}</span>
        </div>
      )}
    </div>
  );
}
