'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * TokenViz — Interactive Tokenizer + Temperature Slider Demo
 *
 * Research: Dual Coding Theory (Paivio 1971) — presenting information through
 * both verbal (token text) and visual (colored chips, slider position) channels
 * creates redundant memory traces, improving retention and transfer. Learners
 * who manipulate tokenization and temperature visually outperform those who
 * only read definitions.
 *
 * Props:
 *   onXP?:         (xp) => void — award XP on sustained interaction
 *   initialText?:  string — seed text for the tokenizer
 */

/* ── Tokenizer ────────────────────────────────────────── */

const TOKEN_COLORS = [
  '#c084fc', '#fb923c', '#38bdf8', '#34d399', '#f472b6',
  '#facc15', '#a78bfa', '#fb7185', '#2dd4bf', '#fbbf24',
];

function simpleTokenize(text) {
  if (!text.trim()) return [];
  const tokens = [];
  const regex = /(\s+|[.,!?;:'"()\[\]{}]|n't|'s|'re|'ve|'ll|'d|[A-Z][a-z]*|[a-z]+|[0-9]+|.)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const t = match[0];
    if (t.length > 6) {
      const chunkSize = Math.ceil(t.length / Math.ceil(t.length / 4));
      for (let i = 0; i < t.length; i += chunkSize) tokens.push(t.slice(i, i + chunkSize));
    } else {
      tokens.push(t);
    }
  }
  return tokens.filter(Boolean);
}

/* ── Temperature responses ────────────────────────────── */

const TEMP_RESPONSES = {
  low: [
    "a question philosophers have debated for millennia. According to research in positive psychology, it involves finding purpose, building meaningful relationships, and contributing to something larger than oneself.",
    "fundamentally about connection and growth. Studies show that people who report the highest life satisfaction prioritize relationships, personal development, and service to others.",
  ],
  mid: [
    "a beautiful paradox — we search for it endlessly, yet often find it in the quiet moments we weren't looking. Purpose, love, and a really good cup of coffee.",
    "something each person must discover through experience. Some find it in creation, others in connection. The search itself might be the point.",
  ],
  high: [
    "a jazz improvisation played on a quantum harmonica while riding a bicycle made of frozen laughter through a tunnel of recursive dreams!",
    "actually 42, but only if you measure it in units of sunset-colored existential wonder divided by the square root of a grandmother's cookie recipe.",
  ],
};

/* ── Component ────────────────────────────────────────── */

export default function TokenViz({
  onXP,
  initialText = 'Write a haiku about artificial intelligence learning to dream',
  mode, // 'tokenizer' | 'temperature' | undefined (both)
}) {
  const [text, setText] = useState(initialText);
  const [tempValue, setTempValue] = useState(70);
  const [responseFade, setResponseFade] = useState(1);

  const interactionCount = useRef(0);
  const xpAwarded = useRef(false);

  /* ── XP tracking ── */
  const recordInteraction = useCallback(() => {
    interactionCount.current += 1;
    if (interactionCount.current >= 5 && !xpAwarded.current) {
      xpAwarded.current = true;
      if (typeof onXP === 'function') onXP(15);
    }
  }, [onXP]);

  /* ── Tokenizer derived state ── */
  const tokens = simpleTokenize(text);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const pct = Math.min((tokens.length / 200000) * 100, 100);

  /* ── Temperature derived state ── */
  const v = tempValue / 100;
  const tempBucket = v < 0.3 ? 'low' : v < 0.7 ? 'mid' : 'high';
  const responseIndex = useRef(0);
  const [currentResponse, setCurrentResponse] = useState(
    TEMP_RESPONSES[tempBucket][0]
  );

  /* Pick a random response and trigger fade on slider change */
  useEffect(() => {
    setResponseFade(0);
    const bucket = v < 0.3 ? 'low' : v < 0.7 ? 'mid' : 'high';
    const opts = TEMP_RESPONSES[bucket];
    responseIndex.current = Math.floor(Math.random() * opts.length);
    const timer = setTimeout(() => {
      setCurrentResponse(opts[responseIndex.current]);
      setResponseFade(1);
    }, 120);
    return () => clearTimeout(timer);
  }, [tempValue, v]);

  /* ── Handlers ── */
  const handleTextChange = useCallback(
    (e) => {
      setText(e.target.value);
      recordInteraction();
    },
    [recordInteraction]
  );

  const handleTempChange = useCallback(
    (e) => {
      setTempValue(Number(e.target.value));
      recordInteraction();
    },
    [recordInteraction]
  );

  /* ── Styles ── */
  const s = {
    root: {
      background: '#0a0a0a',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#e5e5e5',
    },
    heading: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      color: '#a3a3a3',
      margin: 0,
    },
    textarea: {
      width: '100%',
      minHeight: 80,
      padding: 12,
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 8,
      color: '#e5e5e5',
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
    },
    statsRow: {
      display: 'flex',
      gap: 20,
      fontSize: 13,
      color: '#a3a3a3',
    },
    statNum: {
      fontWeight: 600,
      color: '#e5e5e5',
      marginRight: 4,
    },
    barOuter: {
      width: '100%',
      height: 4,
      borderRadius: 2,
      background: 'rgba(255,255,255,.06)',
      overflow: 'hidden',
    },
    barInner: {
      height: '100%',
      borderRadius: 2,
      background: 'linear-gradient(90deg, #c084fc, #38bdf8)',
      transition: 'width .3s ease',
    },
    tokenGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
    },
    slider: {
      width: '100%',
      accentColor: '#c084fc',
      cursor: 'pointer',
    },
    responseBox: {
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.06)',
      borderRadius: 8,
      padding: 16,
      fontSize: 14,
      lineHeight: 1.6,
      minHeight: 60,
      transition: 'opacity .2s ease',
    },
  };

  return (
    <div style={s.root}>
      {/* ── SECTION 1: TOKENIZER ── */}
      {(!mode || mode === 'tokenizer') && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={s.heading}>Live Tokenizer</h3>

        <textarea
          style={s.textarea}
          value={text}
          onChange={handleTextChange}
          placeholder="Type something to see how AI breaks text into tokens..."
          spellCheck={false}
        />

        {/* Stats */}
        <div style={s.statsRow}>
          <span>
            <span style={s.statNum}>{tokens.length}</span>Tokens
          </span>
          <span>
            <span style={s.statNum}>{charCount}</span>Characters
          </span>
          <span>
            <span style={s.statNum}>{wordCount}</span>Words
          </span>
        </div>

        {/* Context window bar */}
        <div style={s.barOuter}>
          <div style={{ ...s.barInner, width: `${Math.max(pct, 0.5)}%` }} />
        </div>

        {/* Token chips */}
        <div style={s.tokenGrid}>
          {tokens.map((tok, i) => {
            const color = TOKEN_COLORS[i % TOKEN_COLORS.length];
            const isWhitespace = /^\s+$/.test(tok);
            return (
              <span
                key={`${i}-${tok}`}
                style={{
                  display: 'inline-block',
                  padding: isWhitespace ? '2px 6px' : '2px 8px',
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  background: color + '20',
                  color: color,
                  border: '1px solid ' + color + '30',
                  whiteSpace: 'pre',
                  lineHeight: 1.6,
                }}
              >
                {isWhitespace ? '⎵' : tok}
              </span>
            );
          })}
        </div>
      </div>

      )}

      {/* ── SECTION 2: TEMPERATURE SLIDER ── */}
      {(!mode || mode === 'temperature') && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <h3 style={s.heading}>Temperature</h3>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 14,
              color: '#c084fc',
              fontWeight: 600,
            }}
          >
            {v.toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={tempValue}
          onChange={handleTempChange}
          style={s.slider}
        />

        <div style={{ ...s.responseBox, opacity: responseFade }}>
          <span style={{ color: '#a3a3a3' }}>
            The meaning of life is...{' '}
          </span>
          {currentResponse}
        </div>
      </div>
      )}
    </div>
  );
}
