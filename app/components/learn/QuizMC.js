'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * QuizMC — Multiple Choice Quiz Component
 *
 * Research-backed: Testing Effect (Roediger & Butler 2011) — frequent low-stakes
 * quizzing causes learning, not just measures it. Active Recall (Karpicke & Blunt 2011)
 * produces 50% more retention than passive study.
 *
 * Props:
 *   questions: [{ q: string, options: string[], correct: number, explanation?: string }]
 *   onComplete?: (score, total) => void
 *   onXP?: (xp) => void
 *   title?: string
 *   shuffleOptions?: boolean (default true)
 */

// Fisher-Yates shuffle that tracks original indices
function shuffleWithIndex(arr) {
  const indices = arr.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    items: indices.map(i => arr[i]),
    correctNew: (origCorrect) => indices.indexOf(origCorrect),
  };
}

export default function QuizMC({
  questions = [],
  onComplete,
  onXP,
  title = 'Quiz',
  shuffleOptions = true,
}) {
  const [shuffled, setShuffled] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('answering'); // answering | feedback | results
  const [answers, setAnswers] = useState([]); // track all answers for review

  // Shuffle on mount
  useEffect(() => {
    if (!questions.length) return;
    const prepared = questions.map((q) => {
      if (!shuffleOptions) return { ...q };
      const s = shuffleWithIndex(q.options);
      return { ...q, options: s.items, correct: s.correctNew(q.correct) };
    });
    setShuffled(prepared);
  }, [questions, shuffleOptions]);

  const q = shuffled[current];
  const total = shuffled.length;
  const progress = total > 0 ? ((current) / total) * 100 : 0;

  const handleAnswer = useCallback((idx) => {
    if (phase !== 'answering' || selected !== null) return;
    setSelected(idx);
    setPhase('feedback');

    const isCorrect = idx === q.correct;
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [...prev, { questionIdx: current, selected: idx, correct: q.correct, isCorrect }]);
  }, [phase, selected, q, current]);

  // Advance to next question — user controls the pace
  const handleNext = useCallback(() => {
    if (phase !== 'feedback') return;

    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase('answering');
    } else {
      setPhase('results');
      const finalScore = answers.length > 0
        ? answers.filter(a => a.isCorrect).length + (selected === q?.correct ? 1 : 0)
        : (selected === q?.correct ? 1 : 0);
      // Recalculate from answers array for accuracy
      const allAnswers = [...answers, { questionIdx: current, selected, correct: q?.correct, isCorrect: selected === q?.correct }];
      const correctCount = allAnswers.filter(a => a.isCorrect).length;
      if (onComplete) onComplete(correctCount, total);
      if (onXP) {
        const xp = correctCount === total ? 25 : 10;
        onXP(xp);
      }
    }
  }, [phase, current, total, answers, selected, q, onComplete, onXP, score]);

  // Keyboard support — number keys to answer, Enter/Space to advance
  useEffect(() => {
    if (!q) return;
    const handler = (e) => {
      if (phase === 'answering') {
        const num = parseInt(e.key);
        if (num >= 1 && num <= q.options.length) {
          handleAnswer(num - 1);
        }
      } else if (phase === 'feedback') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, q, handleAnswer, handleNext]);

  const retry = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setPhase('answering');
    setAnswers([]);
    // Re-shuffle
    const prepared = questions.map((q) => {
      if (!shuffleOptions) return { ...q };
      const s = shuffleWithIndex(q.options);
      return { ...q, options: s.items, correct: s.correctNew(q.correct) };
    });
    setShuffled(prepared);
  };

  if (!shuffled.length) return null;

  // ── Results Screen ──
  if (phase === 'results') {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? '🎯' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '📚';
    const msg = pct === 100
      ? "Perfect score! You've nailed it."
      : pct >= 80
      ? "Great work! The fundamentals are solid."
      : pct >= 60
      ? "Good start — review the explanations below to fill any gaps."
      : "Worth another pass — the concepts will click with practice.";

    return (
      <div className="lo-quiz">
        <div className="lo-quiz-results">
          <div className="lo-quiz-results-emoji">{emoji}</div>
          <div className="lo-quiz-results-score">{score} / {total}</div>
          <p className="lo-quiz-results-msg">{msg}</p>

          {/* Answer review */}
          <div className="lo-quiz-review">
            {answers.map((a, i) => (
              <div key={i} className={`lo-quiz-review-item ${a.isCorrect ? 'correct' : 'wrong'}`}>
                <span className="lo-quiz-review-icon">{a.isCorrect ? '✓' : '✗'}</span>
                <span className="lo-quiz-review-q">{shuffled[a.questionIdx]?.q}</span>
                {!a.isCorrect && shuffled[a.questionIdx]?.explanation && (
                  <p className="lo-quiz-review-explain">{shuffled[a.questionIdx].explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div className="lo-quiz-results-actions">
            <button className="lo-quiz-btn-retry" onClick={retry}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question Screen ──
  return (
    <div className="lo-quiz">
      {/* Progress bar */}
      <div className="lo-quiz-progress">
        <div className="lo-quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="lo-quiz-meta">
        <span className="lo-quiz-counter">{current + 1} / {total}</span>
        {/* Progress dots */}
        <div className="lo-quiz-dots">
          {shuffled.map((_, i) => (
            <span
              key={i}
              className={`lo-quiz-dot ${
                i < answers.length
                  ? answers[i]?.isCorrect ? 'dot-correct' : 'dot-wrong'
                  : i === current ? 'dot-active' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="lo-quiz-question">
        <h3 className="lo-quiz-q">{q.q}</h3>
      </div>

      {/* Options */}
      <div className="lo-quiz-options">
        {q.options.map((opt, i) => {
          let cls = 'lo-quiz-option';
          if (phase === 'feedback') {
            if (i === q.correct) cls += ' option-correct';
            else if (i === selected && i !== q.correct) cls += ' option-wrong';
            else cls += ' option-dimmed';
          }
          if (i === selected && phase === 'answering') cls += ' option-selected';

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleAnswer(i)}
              disabled={phase === 'feedback'}
            >
              <span className="lo-quiz-option-key">{String.fromCharCode(65 + i)}</span>
              <span className="lo-quiz-option-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className={`lo-quiz-feedback ${selected === q.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="lo-quiz-feedback-content">
            <span className="lo-quiz-feedback-icon">
              {selected === q.correct ? '✓' : '✗'}
            </span>
            <p>
              {selected === q.correct ? 'Correct!' : `Incorrect — the answer is ${q.options[q.correct]}.`}
              {q.explanation ? ` ${q.explanation}` : ''}
            </p>
          </div>
          <button
            className="lo-quiz-btn-next"
            onClick={handleNext}
            autoFocus
          >
            {current + 1 < total ? 'Next Question →' : 'See Results →'}
          </button>
        </div>
      )}
    </div>
  );
}
