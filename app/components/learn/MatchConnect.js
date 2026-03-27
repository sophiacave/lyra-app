'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * MatchConnect — Drag & Drop Matching Component
 *
 * Research: Elaborative Interrogation (Pressley et al 1987) — generating "why"
 * connections doubles retention. Forcing associations strengthens neural pathways.
 *
 * Props:
 *   pairs: [{ left: string, right: string }]  — correct pairings
 *   title?: string
 *   instruction?: string
 *   onComplete?: (score, total) => void
 *   onXP?: (xp) => void
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchConnect({
  pairs = [],
  title = 'Match the pairs',
  instruction = 'Tap one item on the left, then its match on the right.',
  onComplete,
  onXP,
}) {
  const [leftOrder] = useState(() => shuffle(pairs.map((_, i) => i)));
  const [rightOrder] = useState(() => shuffle(pairs.map((_, i) => i)));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matched, setMatched] = useState(new Set()); // indices of matched pairs
  const [wrongPair, setWrongPair] = useState(null); // { left, right } for shake
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [complete, setComplete] = useState(false);
  const boardRef = useRef(null);
  const [lines, setLines] = useState([]); // { leftIdx, rightIdx, status }

  // Check match when both sides selected
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;

    setAttempts(a => a + 1);
    const isMatch = selectedLeft === selectedRight; // same pair index = correct

    if (isMatch) {
      setMatched(prev => new Set([...prev, selectedLeft]));
      setScore(s => s + 1);
      setLines(prev => [...prev, { leftIdx: selectedLeft, rightIdx: selectedRight, status: 'correct' }]);

      // Check if all matched
      if (matched.size + 1 === pairs.length) {
        setTimeout(() => {
          setComplete(true);
          if (onComplete) onComplete(score + 1, pairs.length);
          if (onXP) onXP(15);
        }, 500);
      }
    } else {
      setWrongPair({ left: selectedLeft, right: selectedRight });
      setTimeout(() => setWrongPair(null), 600);
    }

    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, isMatch ? 300 : 500);
  }, [selectedLeft, selectedRight]);

  const handleLeftClick = useCallback((pairIdx) => {
    if (matched.has(pairIdx)) return;
    setSelectedLeft(pairIdx);
    if (selectedRight !== null) return; // wait for effect
  }, [matched, selectedRight]);

  const handleRightClick = useCallback((pairIdx) => {
    if (matched.has(pairIdx)) return;
    setSelectedRight(pairIdx);
    if (selectedLeft !== null) return; // wait for effect
  }, [matched, selectedLeft]);

  const getLeftClass = (pairIdx) => {
    let cls = 'lo-match-item';
    if (matched.has(pairIdx)) cls += ' match-done';
    else if (selectedLeft === pairIdx) cls += ' match-selected';
    if (wrongPair?.left === pairIdx) cls += ' match-wrong';
    return cls;
  };

  const getRightClass = (pairIdx) => {
    let cls = 'lo-match-item';
    if (matched.has(pairIdx)) cls += ' match-done';
    else if (selectedRight === pairIdx) cls += ' match-selected';
    if (wrongPair?.right === pairIdx) cls += ' match-wrong';
    return cls;
  };

  if (!pairs.length) return null;

  return (
    <div className="lo-match" ref={boardRef}>
      <div className="lo-match-header">
        <h3 className="lo-match-title">{title}</h3>
        <p className="lo-match-sub">{instruction}</p>
      </div>

      {complete ? (
        <div className="lo-match-result">
          <p className="lo-match-result-text">
            ✓ All matched! {attempts === pairs.length ? 'Perfect — no mistakes!' : `${score}/${pairs.length} in ${attempts} attempts.`}
          </p>
        </div>
      ) : (
        <div className="lo-match-board">
          {/* Left column */}
          <div className="lo-match-col">
            {leftOrder.map((pairIdx) => (
              <button
                key={`l-${pairIdx}`}
                className={getLeftClass(pairIdx)}
                onClick={() => handleLeftClick(pairIdx)}
              >
                {pairs[pairIdx].left}
              </button>
            ))}
          </div>

          {/* Center lines */}
          <div className="lo-match-lines">
            <svg viewBox="0 0 60 400" preserveAspectRatio="none">
              {lines.map((line, i) => {
                const leftPos = leftOrder.indexOf(line.leftIdx);
                const rightPos = rightOrder.indexOf(line.rightIdx);
                const y1 = (leftPos + 0.5) * (400 / pairs.length);
                const y2 = (rightPos + 0.5) * (400 / pairs.length);
                return (
                  <line
                    key={i}
                    x1="0" y1={y1}
                    x2="60" y2={y2}
                    className={`lo-match-line line-${line.status}`}
                  />
                );
              })}
            </svg>
          </div>

          {/* Right column */}
          <div className="lo-match-col">
            {rightOrder.map((pairIdx) => (
              <button
                key={`r-${pairIdx}`}
                className={getRightClass(pairIdx)}
                onClick={() => handleRightClick(pairIdx)}
              >
                {pairs[pairIdx].right}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
