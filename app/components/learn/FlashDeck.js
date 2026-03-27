'use client';
import { useState, useCallback, useEffect } from 'react';

/**
 * FlashDeck — Spaced Repetition Card Component
 *
 * Research: Spaced Repetition (Ebbinghaus 1885, Cepeda et al 2006) —
 * reviewing at optimal intervals produces the strongest long-term retention.
 * The Testing Effect (Roediger & Butler 2011) — retrieval practice causes learning.
 *
 * Props:
 *   cards: [{ front: string, back: string }]
 *   onComplete?: (mastered, total) => void
 *   onXP?: (xp) => void
 *   title?: string
 */

export default function FlashDeck({
  cards = [],
  onComplete,
  onXP,
  title = 'Flash Cards',
}) {
  const [deck, setDeck] = useState([]); // { ...card, box: 0 } — box 0=unseen, 1=learning, 2=mastered
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [swipeClass, setSwipeClass] = useState('');
  const [mastered, setMastered] = useState(0);
  const [round, setRound] = useState(1);

  // Initialize deck
  useEffect(() => {
    if (!cards.length) return;
    setDeck(cards.map((c, i) => ({ ...c, id: i, box: 0 })));
  }, [cards]);

  const activeDeck = deck.filter(c => c.box < 2);
  const current = activeDeck[currentIdx % activeDeck.length];
  const total = cards.length;
  const masteredCount = deck.filter(c => c.box >= 2).length;
  const progressPct = total > 0 ? (masteredCount / total) * 100 : 0;
  const circumference = 2 * Math.PI * 9; // radius 9 for the ring

  const advance = useCallback((direction) => {
    if (!current) return;

    setSwipeClass(direction === 'right' ? 'swipe-right' : 'swipe-left');

    setTimeout(() => {
      setDeck(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(c => c.id === current.id);
        if (direction === 'right') {
          // Got it — advance box
          updated[idx] = { ...updated[idx], box: Math.min(updated[idx].box + 1, 2) };
        } else {
          // Review again — reset to box 0
          updated[idx] = { ...updated[idx], box: 0 };
        }
        return updated;
      });

      setFlipped(false);
      setSwipeClass('');

      // Move to next card
      const remaining = deck.filter(c => c.id !== current.id && c.box < 2);
      if (direction === 'right' && current.box + 1 >= 2) {
        const newMastered = masteredCount + 1;
        setMastered(newMastered);
        if (newMastered >= total) {
          if (onComplete) onComplete(total, total);
          if (onXP) onXP(10);
        }
      }

      if (remaining.length === 0 && direction === 'right' && current.box + 1 >= 2) {
        // All mastered
        return;
      }

      setCurrentIdx(0);
      setRound(r => r + 1);
    }, 350);
  }, [current, deck, masteredCount, total, onComplete, onXP]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (e.key === 'ArrowLeft' && flipped) advance('left');
      if (e.key === 'ArrowRight' && flipped) advance('right');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flipped, advance]);

  if (!deck.length) return null;

  // All mastered
  if (masteredCount >= total) {
    return (
      <div className="lo-flash">
        <div className="lo-quiz-results" style={{ padding: '2rem 0' }}>
          <div className="lo-quiz-results-emoji">🧠</div>
          <div className="lo-quiz-results-score">{total} / {total}</div>
          <p className="lo-quiz-results-msg">All cards mastered! Your brain just leveled up.</p>
          <button
            className="lo-quiz-btn-retry"
            onClick={() => {
              setDeck(cards.map((c, i) => ({ ...c, id: i, box: 0 })));
              setCurrentIdx(0);
              setMastered(0);
              setFlipped(false);
              setRound(1);
            }}
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="lo-flash">
      {/* Meta */}
      <div className="lo-flash-meta">
        <span className="lo-flash-counter">
          {activeDeck.length} card{activeDeck.length !== 1 ? 's' : ''} remaining
        </span>
        <div className="lo-flash-mastery">
          <svg className="lo-flash-mastery-ring" viewBox="0 0 24 24">
            <circle className="lo-flash-mastery-bg" cx="12" cy="12" r="9" />
            <circle
              className="lo-flash-mastery-fill"
              cx="12" cy="12" r="9"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progressPct / 100)}
            />
          </svg>
          <span>{masteredCount}/{total}</span>
        </div>
      </div>

      {/* Card */}
      <div className="lo-flash-stack">
        <div
          className={`lo-flash-card ${flipped ? 'flipped' : ''} ${swipeClass}`}
          onClick={() => !flipped && setFlipped(true)}
        >
          <div className="lo-flash-card-face lo-flash-front">
            <div className="lo-flash-card-q">{current.front}</div>
            <span className="lo-flash-tap-hint">tap to reveal</span>
          </div>
          <div className="lo-flash-card-face lo-flash-back">
            <div className="lo-flash-card-a">{current.back}</div>
          </div>
        </div>
      </div>

      {/* Actions — only show when flipped */}
      {flipped && (
        <div className="lo-flash-actions">
          <button className="lo-flash-btn lo-flash-btn-again" onClick={() => advance('left')}>
            <span className="lo-flash-btn-icon">←</span>
            Review again
          </button>
          <button className="lo-flash-btn lo-flash-btn-got" onClick={() => advance('right')}>
            Got it
            <span className="lo-flash-btn-icon">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
