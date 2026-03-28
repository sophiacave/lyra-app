/**
 * QuoteCard — Cinematic quote display.
 * Large quotation mark, centered text, attribution below.
 * Apple keynote style — one thought, maximum impact.
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  FONT_FAMILY, TEXT_PRIMARY, TEXT_TERTIARY, ACCENT_PURPLE,
  TYPE, MOTION, SPACE, appleEase, typeStyle,
} from '../lib/design-tokens.js';

export function QuoteCard({
  quote,
  attribution,
  delay = 0,
  accentColor = ACCENT_PURPLE,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay * fps;

  // Giant quotation mark
  const markProgress = spring({
    frame: frame - startFrame,
    fps,
    config: MOTION.gentle,
  });

  // Quote text — word by word
  const textDelay = delay + 0.4;
  const words = quote.split(' ');

  // Attribution
  const attrProgress = spring({
    frame: frame - (textDelay + words.length * MOTION.stagger.normal + 0.3) * fps,
    fps,
    config: MOTION.smooth,
  });

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: SPACE['2xl'],
    }}>
      {/* Giant quotation mark */}
      <div style={{
        fontSize: 200,
        fontWeight: 800,
        fontFamily: 'Georgia, serif',
        color: accentColor,
        opacity: markProgress * 0.15,
        lineHeight: 0.8,
        transform: `scale(${interpolate(markProgress, [0, 1], [0.8, 1])})`,
        userSelect: 'none',
      }}>
        {'\u201C'}
      </div>

      {/* Quote text */}
      <div style={{
        maxWidth: 900,
        textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `0 ${TYPE.title2.size * 0.3}px`,
      }}>
        {words.map((word, wi) => {
          const wordStartFrame = (textDelay + wi * MOTION.stagger.normal) * fps;
          const wordProgress = spring({
            frame: frame - wordStartFrame,
            fps,
            config: MOTION.smooth,
          });

          return (
            <span
              key={wi}
              style={{
                ...typeStyle('title2', TEXT_PRIMARY),
                fontWeight: 500,
                fontStyle: 'italic',
                opacity: wordProgress,
                transform: `translateY(${interpolate(wordProgress, [0, 1], [15, 0])}px)`,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Attribution */}
      {attribution && (
        <div style={{
          opacity: attrProgress,
          transform: `translateY(${interpolate(attrProgress, [0, 1], [10, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: SPACE.md,
        }}>
          <div style={{
            width: 32,
            height: 1.5,
            backgroundColor: accentColor,
            opacity: 0.5,
          }} />
          <span style={typeStyle('callout', TEXT_TERTIARY)}>
            {attribution}
          </span>
        </div>
      )}
    </div>
  );
}
