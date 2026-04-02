'use client';
import { useState } from 'react';

/**
 * Timeline — Interactive Chronological Explorer
 *
 * Research: Temporal Scaffolding — placing concepts in chronological
 * context improves retention by creating a narrative structure.
 *
 * Props:
 *   events: [{ year: string, title: string, description: string, icon?: string }]
 *   title?: string
 *   instruction?: string
 *   interactive?: boolean — if true, events reveal on click
 *   onXP?: (xp) => void
 */

export default function Timeline({
  events = [],
  title = 'Timeline',
  instruction,
  interactive = true,
  onXP,
}) {
  const [revealedSet, setRevealedSet] = useState(
    interactive ? new Set() : new Set(events.map((_, i) => i))
  );
  const [complete, setComplete] = useState(!interactive);

  const handleReveal = (idx) => {
    if (!interactive || revealedSet.has(idx)) return;
    const next = new Set([...revealedSet, idx]);
    setRevealedSet(next);
    if (next.size === events.length && !complete) {
      setComplete(true);
      if (onXP) onXP(10);
    }
  };

  if (!events.length) return null;

  return (
    <div className="lo-timeline">
      <div className="lo-timeline-header">
        <h3 className="lo-timeline-title">{title}</h3>
        {instruction && <p className="lo-timeline-instruction">{instruction}</p>}
        {interactive && !complete && (
          <p className="lo-timeline-hint">
            Tap each event to explore — {revealedSet.size}/{events.length} discovered
          </p>
        )}
      </div>

      <div className="lo-timeline-track">
        <div className="lo-timeline-line" aria-hidden="true" />
        {events.map((event, i) => {
          const isRevealed = revealedSet.has(i);
          return (
            <div
              key={i}
              className={`lo-timeline-event ${isRevealed ? 'event-revealed' : 'event-hidden'} ${i % 2 === 0 ? 'event-left' : 'event-right'}`}
            >
              <button
                className="lo-timeline-dot"
                onClick={() => handleReveal(i)}
                aria-label={`Reveal: ${event.title}`}
                disabled={!interactive || isRevealed}
              >
                {event.icon || (isRevealed ? '◆' : '◇')}
              </button>
              <div className="lo-timeline-card">
                <span className="lo-timeline-year">{event.year}</span>
                <h4 className="lo-timeline-event-title">{event.title}</h4>
                {isRevealed && (
                  <p className="lo-timeline-desc">{event.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {complete && interactive && (
        <div className="lo-timeline-complete">
          ✓ Full timeline explored!
        </div>
      )}
    </div>
  );
}
