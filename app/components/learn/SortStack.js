'use client';
import { useState, useRef, useCallback } from 'react';

/**
 * SortStack — Drag to Reorder Component
 *
 * Research: Generation Effect (Slamecka & Graf 1978) — reconstructing sequences
 * forces deeper processing. Interleaving (Rohrer & Taylor 2007) — mixing problem
 * types during practice produces 43% higher test scores.
 *
 * Props:
 *   items: string[]  — correct order (will be shuffled)
 *   title?: string
 *   instruction?: string
 *   onComplete?: () => void
 *   onXP?: (xp) => void
 */

function shuffleArray(arr) {
  const a = [...arr];
  // Ensure shuffled order is different from correct
  for (let attempts = 0; attempts < 10; attempts++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // Check if any items are in the same position
    const allSame = a.every((item, i) => item === arr[i]);
    if (!allSame) break;
  }
  return a;
}

export default function SortStack({
  items = [],
  title = 'Put these in order',
  instruction = 'Drag items to arrange them in the correct sequence.',
  onComplete,
  onXP,
}) {
  const [order, setOrder] = useState(() => shuffleArray(items));
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [showCorrect, setShowCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleDragStart = useCallback((idx) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    if (idx !== dragIdx) setOverIdx(idx);
  }, [dragIdx]);

  const handleDrop = useCallback((idx) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    setOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setOverIdx(null);
    setResult(null);
  }, [dragIdx]);

  // Touch support — tap two items to swap
  const [tapIdx, setTapIdx] = useState(null);

  const handleTap = useCallback((idx) => {
    // On touch devices, tap to select then tap to swap
    if (tapIdx === null) {
      setTapIdx(idx);
      return;
    }
    if (tapIdx === idx) {
      setTapIdx(null);
      return;
    }
    // Swap
    setOrder(prev => {
      const next = [...prev];
      [next[tapIdx], next[idx]] = [next[idx], next[tapIdx]];
      return next;
    });
    setTapIdx(null);
    setResult(null);
  }, [tapIdx]);

  const checkOrder = useCallback(() => {
    setAttempts(a => a + 1);
    const isCorrect = order.every((item, i) => item === items[i]);
    if (isCorrect) {
      setResult('correct');
      setShowCorrect(true);
      if (onComplete) onComplete();
      if (onXP) onXP(15);
    } else {
      setResult('wrong');
      // Brief shake then clear
      setTimeout(() => setResult(null), 1500);
    }
  }, [order, items, onComplete, onXP]);

  const reset = useCallback(() => {
    setOrder(shuffleArray(items));
    setResult(null);
    setShowCorrect(false);
    setTapIdx(null);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="lo-sort">
      <div className="lo-sort-header">
        <h3 className="lo-sort-title">{title}</h3>
        <p className="lo-sort-sub">{instruction}</p>
      </div>

      <div className="lo-sort-list">
        {order.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className={`lo-sort-item ${
              dragIdx === idx ? 'sort-dragging' : ''
            } ${overIdx === idx ? 'sort-over' : ''} ${
              showCorrect ? 'sort-correct' : ''
            } ${tapIdx === idx ? 'match-selected' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            onClick={() => handleTap(idx)}
          >
            <span className="lo-sort-handle">⠿</span>
            <span className="lo-sort-num">{idx + 1}</span>
            <span className="lo-sort-text">{item}</span>
          </div>
        ))}
      </div>

      {!showCorrect && (
        <button className="lo-sort-check" onClick={checkOrder}>
          Check Order
        </button>
      )}

      {result === 'correct' && (
        <div className="lo-sort-result sort-success">
          ✓ {attempts === 1 ? 'Perfect — first try!' : `Correct! Got it in ${attempts} attempts.`}
        </div>
      )}
      {result === 'wrong' && (
        <div className="lo-sort-result sort-tryagain">
          Not quite — some items are out of order. Keep trying!
        </div>
      )}

      {showCorrect && (
        <button className="lo-sort-check" onClick={reset} style={{ marginTop: '0.75rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
