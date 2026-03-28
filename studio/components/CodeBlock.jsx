/**
 * CodeBlock — Animated syntax display for educational video.
 * Apple-inspired: clean, monospaced, with line-by-line reveal.
 * Sits inside a glass panel with subtle glow.
 */
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  FONT_MONO, SURFACE_ELEVATED, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, TEXT_QUATERNARY,
  ACCENT_PURPLE, ACCENT_BLUE, ACCENT_WARM, ACCENT_CYAN, ACCENT_GREEN,
  BORDER_DEFAULT, MOTION, DEPTH, SPACE, TYPE,
  appleEase, typeStyle,
} from '../lib/design-tokens.js';
import { GlassPanel } from './GlassPanel.jsx';

// Basic token colorizer — maps common patterns to accent colors
function colorizeToken(token) {
  // Keywords
  if (/^(const|let|var|function|return|import|export|from|if|else|for|while|async|await|class|new|this|true|false|null|undefined|def|self|print|None|True|False)$/.test(token)) {
    return ACCENT_PURPLE;
  }
  // Strings
  if (/^['"`]/.test(token) || /['"`]$/.test(token)) {
    return ACCENT_GREEN;
  }
  // Numbers
  if (/^\d+(\.\d+)?$/.test(token)) {
    return ACCENT_WARM;
  }
  // Comments
  if (/^(\/\/|#)/.test(token)) {
    return TEXT_TERTIARY;
  }
  // Functions (followed by parens in context)
  if (/^[a-z_]\w*$/i.test(token)) {
    return TEXT_PRIMARY;
  }
  // Operators and punctuation
  return TEXT_SECONDARY;
}

function colorizeLineSimple(line) {
  // Split preserving whitespace and tokens
  const tokens = line.split(/(\s+|[{}()[\],;:.=+\-*/<>!&|]+|"[^"]*"|'[^']*'|`[^`]*`)/);
  return tokens.map((token, i) => {
    if (/^\s+$/.test(token)) return token;
    const color = colorizeToken(token.trim());
    return { text: token, color };
  });
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  lineDelay = MOTION.stagger.normal,
  startDelay = 0,
  showLineNumbers = true,
  highlightLines = [],
  x,
  y,
  width = 1000,
  style = {},
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = code.split('\n');
  const lineHeight = 32;
  const panelPadding = 32;
  const headerHeight = title ? 48 : 0;
  const codeTopOffset = headerHeight + panelPadding;
  const totalHeight = codeTopOffset + lines.length * lineHeight + panelPadding;

  return (
    <GlassPanel
      x={x}
      y={y}
      width={width}
      height={totalHeight}
      padding={0}
      borderRadius={16}
      delay={startDelay}
      style={{ overflow: 'hidden', ...style }}
    >
      {/* Header bar */}
      {title && (
        <div style={{
          height: headerHeight,
          padding: `0 ${panelPadding}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${BORDER_DEFAULT}`,
        }}>
          {/* Traffic light dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
          </div>
          <span style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 500,
            color: TEXT_TERTIARY,
          }}>
            {title}
          </span>
          <div style={{ width: 52 }} /> {/* Spacer for centering */}
        </div>
      )}

      {/* Code lines */}
      <div style={{ padding: `${panelPadding}px`, fontFamily: FONT_MONO, fontSize: 16, lineHeight: `${lineHeight}px` }}>
        {lines.map((line, li) => {
          const lineStartFrame = (startDelay + 0.3 + li * lineDelay) * fps;
          const lineProgress = spring({
            frame: frame - lineStartFrame,
            fps,
            config: MOTION.snappy,
          });

          const isHighlight = highlightLines.includes(li + 1);
          const colorized = colorizeLineSimple(line);

          return (
            <div
              key={li}
              style={{
                opacity: lineProgress,
                transform: `translateX(${interpolate(lineProgress, [0, 1], [20, 0])}px)`,
                display: 'flex',
                backgroundColor: isHighlight ? 'rgba(191, 90, 242, 0.08)' : undefined,
                borderRadius: 4,
                padding: '0 8px',
                margin: '0 -8px',
              }}
            >
              {showLineNumbers && (
                <span style={{
                  width: 40,
                  flexShrink: 0,
                  color: TEXT_QUATERNARY,
                  textAlign: 'right',
                  paddingRight: 16,
                  userSelect: 'none',
                }}>
                  {li + 1}
                </span>
              )}
              <span style={{ whiteSpace: 'pre' }}>
                {colorized.map((token, ti) => {
                  if (typeof token === 'string') return token;
                  return (
                    <span key={ti} style={{ color: token.color }}>
                      {token.text}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
