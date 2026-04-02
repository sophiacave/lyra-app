'use client';
import { useState } from 'react';

/**
 * CompareView — Side-by-Side Comparison with Reveal
 *
 * Research: Analogical Reasoning (Gentner 1983) — comparing structures
 * builds deeper understanding than studying single examples.
 *
 * Props:
 *   items: [{ label: string, content: string, highlight?: string }]
 *   title?: string
 *   instruction?: string
 *   revealMode?: 'all' | 'sequential' — show all at once or one at a time
 *   onXP?: (xp) => void
 */

export default function CompareView({
  items = [],
  title = 'Compare',
  instruction,
  revealMode = 'all',
  onXP,
}) {
  const [revealed, setRevealed] = useState(revealMode === 'all' ? new Set(items.map((_, i) => i)) : new Set());
  const [activeIdx, setActiveIdx] = useState(0);
  const [complete, setComplete] = useState(revealMode === 'all');

  const handleReveal = (idx) => {
    if (revealed.has(idx)) return;
    const next = new Set([...revealed, idx]);
    setRevealed(next);
    if (revealMode === 'sequential') {
      setActiveIdx(Math.min(idx + 1, items.length - 1));
    }
    if (next.size === items.length && !complete) {
      setComplete(true);
      if (onXP) onXP(10);
    }
  };

  if (!items.length) return null;

  return (
    <div className="lo-compare">
      <div className="lo-compare-header">
        <h3 className="lo-compare-title">{title}</h3>
        {instruction && <p className="lo-compare-instruction">{instruction}</p>}
      </div>

      <div className={`lo-compare-grid lo-compare-cols-${Math.min(items.length, 3)}`}>
        {items.map((item, i) => {
          const isRevealed = revealed.has(i);
          const isActive = revealMode === 'sequential' && i === activeIdx && !isRevealed;

          return (
            <div
              key={i}
              className={`lo-compare-card ${isRevealed ? 'compare-revealed' : ''} ${isActive ? 'compare-active' : ''}`}
            >
              <div className="lo-compare-label">{item.label}</div>
              {isRevealed ? (
                <div className="lo-compare-content">
                  <p>{item.content}</p>
                  {item.highlight && (
                    <div className="lo-compare-highlight">{item.highlight}</div>
                  )}
                </div>
              ) : (
                <button
                  className="lo-compare-reveal-btn"
                  onClick={() => handleReveal(i)}
                  disabled={revealMode === 'sequential' && i !== activeIdx}
                >
                  Tap to reveal
                </button>
              )}
            </div>
          );
        })}
      </div>

      {complete && revealMode !== 'all' && (
        <div className="lo-compare-complete">
          ✓ All revealed — compare and contrast!
        </div>
      )}
    </div>
  );
}
