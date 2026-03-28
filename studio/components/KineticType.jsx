/**
 * KineticType — Character-level text animation.
 * Each character enters individually with spring physics.
 * Apple-inspired: crisp, purposeful, never gratuitous.
 *
 * Modes:
 * - 'fade-up': Characters fade up from below (default, Apple keynote style)
 * - 'reveal': Characters reveal left-to-right like a typewriter
 * - 'scale': Characters scale from 0 with slight bounce
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { MOTION, FONT_FAMILY, TEXT_PRIMARY, appleEase } from '../lib/design-tokens.js';

export function KineticType({
  text,
  mode = 'fade-up',
  style = {},
  charDelay = MOTION.stagger.tight,
  startDelay = 0,
  color = TEXT_PRIMARY,
  fontSize = 72,
  fontWeight = 700,
  letterSpacing = -1.5,
  lineHeight = 1.1,
  highlightWords = [],
  highlightColor,
  align = 'left',
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');
  let globalCharIndex = 0;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
        color,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        gap: `0 ${fontSize * 0.28}px`,
        ...style,
      }}
    >
      {words.map((word, wi) => {
        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().replace(/[^a-z]/g, '') === hw.toLowerCase()
        );
        const wordColor = isHighlight && highlightColor ? highlightColor : color;

        const chars = word.split('').map((char, ci) => {
          const charIdx = globalCharIndex++;
          const charStartFrame = (startDelay + charIdx * charDelay) * fps;

          let charStyle = {};

          if (mode === 'fade-up') {
            const progress = spring({
              frame: frame - charStartFrame,
              fps,
              config: MOTION.smooth,
            });
            charStyle = {
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [fontSize * 0.3, 0])}px)`,
              display: 'inline-block',
            };
          } else if (mode === 'reveal') {
            const progress = interpolate(
              frame,
              [charStartFrame, charStartFrame + fps * 0.15],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            charStyle = {
              opacity: appleEase(progress),
              display: 'inline-block',
            };
          } else if (mode === 'scale') {
            const progress = spring({
              frame: frame - charStartFrame,
              fps,
              config: MOTION.bouncy,
            });
            charStyle = {
              opacity: Math.min(progress * 2, 1),
              transform: `scale(${progress})`,
              display: 'inline-block',
            };
          }

          return (
            <span key={`${wi}-${ci}`} style={{ ...charStyle, color: wordColor }}>
              {char}
            </span>
          );
        });

        // Account for space after word
        globalCharIndex++;

        return (
          <span key={wi} style={{ display: 'inline-flex', whiteSpace: 'pre' }}>
            {chars}
          </span>
        );
      })}
    </div>
  );
}

/**
 * WordReveal — Word-level animation (faster than character-level for body text).
 * Better for longer narration text where character animation would be too slow.
 */
export function WordReveal({
  text,
  style = {},
  wordDelay = MOTION.stagger.normal,
  startDelay = 0,
  color = TEXT_PRIMARY,
  fontSize = 22,
  fontWeight = 400,
  lineHeight = 1.6,
  highlightWords = [],
  highlightColor,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        lineHeight,
        color,
        display: 'flex',
        flexWrap: 'wrap',
        gap: `0 ${fontSize * 0.3}px`,
        ...style,
      }}
    >
      {words.map((word, wi) => {
        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().replace(/[^a-z]/g, '') === hw.toLowerCase()
        );
        const wordColor = isHighlight && highlightColor ? highlightColor : color;

        const wordStartFrame = (startDelay + wi * wordDelay) * fps;
        const progress = spring({
          frame: frame - wordStartFrame,
          fps,
          config: MOTION.smooth,
        });

        return (
          <span
            key={wi}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
              display: 'inline-block',
              color: wordColor,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
