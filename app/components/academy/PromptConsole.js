'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { validatePrompt, gradePrompt } from '../../../lib/exercise-engine';
import QualityGrader from '../console/QualityGrader';
import PromptDiffView from '../console/PromptDiffView';
import CelebrationEffects from '../console/CelebrationEffects';

/**
 * PromptConsole V2 — Zero-Keystroke Learning
 *
 * Core UX change: exercises can be completed with 1 CLICK via quick-answer
 * buttons. Typing is still available for advanced users. Reduces decision
 * fatigue by providing curated response options.
 */

// Type metadata for exercise badges
const TYPE_META = {
  prompt:   { icon: '⚡', label: 'Write a prompt', color: 'var(--accent-blue)' },
  freeform: { icon: '✦', label: 'Free response', color: 'var(--accent-warm)' },
  rewrite:  { icon: '✏️', label: 'Rewrite this', color: 'var(--status-warning)' },
  debug:    { icon: '🐛', label: 'Debug this', color: 'var(--status-error)' },
  analyze:  { icon: '🔍', label: 'Analyze this', color: 'var(--accent-blue)' },
  compare:  { icon: '⚖️', label: 'Compare', color: 'var(--text-secondary)' },
};

// Generate quick-answer options from exercise data
function getQuickAnswers(exercise) {
  if (!exercise) return [];
  const answers = [];

  // Good example is the gold standard — always offer if available
  if (exercise.goodExample) {
    answers.push({
      label: '✓ Try the strong version',
      value: exercise.goodExample,
      type: 'good',
    });
  }

  // Hint is a guided path — offer as primary if no goodExample
  if (exercise.hint && exercise.hint !== exercise.goodExample) {
    answers.push({
      label: '💡 Use hint',
      value: exercise.hint,
      type: 'hint',
    });
  }

  // Generate a starter from criteria keywords if we have them
  if (exercise.criteria?.requiredKeywords?.length > 0 && answers.length < 2) {
    const kws = exercise.criteria.requiredKeywords;
    const starter = `I need help with ${kws.slice(0, 3).join(', ')}. Please provide a detailed, step-by-step approach.`;
    answers.push({
      label: '🚀 Quick start',
      value: starter,
      type: 'starter',
    });
  }

  return answers;
}

// Parse instruction for scenario-based types: split at double newline
function parseScenario(instruction) {
  const idx = instruction.indexOf('\n\n');
  if (idx === -1) return { intro: instruction, scenario: null };
  return { intro: instruction.slice(0, idx), scenario: instruction.slice(idx + 2) };
}

export default function PromptConsole({ exercises = [], lessonTitle = '', onActivity }) {
  const [history, setHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeExercise, setActiveExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const [gradeResult, setGradeResult] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [allDoneTrigger, setAllDoneTrigger] = useState(0);

  const exercise = exercises[activeExercise] || null;
  const exType = exercise?.type || 'freeform';
  const meta = TYPE_META[exType] || TYPE_META.freeform;
  const quickAnswers = exercise ? getQuickAnswers(exercise) : [];
  const { intro, scenario } = exercise ? parseScenario(exercise.instruction) : { intro: '', scenario: null };

  // Emit activity state to parent
  useEffect(() => {
    if (!onActivity) return;
    if (isProcessing) onActivity('responding');
    else if (input.length > 0) onActivity('typing');
    else onActivity('idle');
  }, [isProcessing, input, onActivity]);

  // Emit celebration state
  useEffect(() => {
    if (!onActivity || celebrationTrigger === 0) return;
    onActivity('celebrating');
    const t = setTimeout(() => onActivity('idle'), 2000);
    return () => clearTimeout(t);
  }, [celebrationTrigger, onActivity]);

  // Auto-scroll history
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Core submit logic — shared between quick answers and custom input
  const submitAnswer = useCallback((text) => {
    if (!text.trim() || isProcessing) return;

    const userMsg = text.trim();
    setInput('');
    setShowCustomInput(false);
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);
    setShowDiff(false);

    const grade = gradePrompt(userMsg);
    setGradeResult(grade);

    // Validate against exercise criteria
    if (exercise?.criteria) {
      const result = validatePrompt(userMsg, exercise);
      if (result.pass) {
        const newCompleted = new Set([...completedExercises, activeExercise]);
        setCompletedExercises(newCompleted);
        setCelebrationTrigger(t => t + 1);
        setHistory(prev => [...prev, { role: 'assistant', content: result.feedback }]);

        if (exercises.length > 0 && newCompleted.size === exercises.length) {
          setTimeout(() => setAllDoneTrigger(t => t + 1), 1200);
        }

        // Auto-advance to next exercise
        setTimeout(() => {
          if (activeExercise < exercises.length - 1) {
            setActiveExercise(prev => prev + 1);
          }
          setIsProcessing(false);
        }, 1200);
        return;
      } else {
        if (exercise.badExample && exercise.goodExample) {
          setShowDiff(true);
        }
        setHistory(prev => [...prev, { role: 'assistant', content: result.feedback }]);
        setIsProcessing(false);
        return;
      }
    }

    // Fallback for exercises without criteria
    setHistory(prev => [...prev, {
      role: 'assistant',
      content: exercise
        ? 'Try including more specific details. Check the hint for guidance!'
        : 'Nice work! Head to claude.ai to keep practicing.',
    }]);
    setIsProcessing(false);
  }, [exercise, exercises, activeExercise, completedExercises, isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAnswer(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer(input);
    }
  };

  const handleSkip = () => {
    if (activeExercise < exercises.length - 1) {
      setActiveExercise(prev => prev + 1);
      setShowDiff(false);
      setGradeResult(null);
    }
  };

  return (
    <div className="console-panel">
      {/* Compact header */}
      <div className="console-header">
        <div className="console-dots">
          <span className="console-dot dot-red" />
          <span className="console-dot dot-yellow" />
          <span className="console-dot dot-green" />
        </div>
        <span className="console-title">
          Practice Console
        </span>
        {exercises.length > 0 && (
          <span className="console-progress-label">
            {completedExercises.size}/{exercises.length}
          </span>
        )}
      </div>

      {/* Exercise card — clean, action-focused */}
      {exercise && !completedExercises.has(activeExercise) && (
        <div className="console-exercise-card">
          <div className="console-exercise-meta">
            <span className="console-exercise-badge-mini" style={{ color: meta.color }}>
              {meta.icon} {meta.label}
            </span>
            <span className="console-exercise-counter">
              {activeExercise + 1} of {exercises.length}
            </span>
          </div>

          <p className="console-exercise-instruction">
            {scenario ? intro : exercise.instruction}
          </p>

          {scenario && (
            <pre className="console-scenario-block">{scenario}</pre>
          )}

          {/* Quick answer buttons — zero keystrokes */}
          {quickAnswers.length > 0 && !isProcessing && (
            <div className="console-quick-answers">
              {quickAnswers.map((qa, i) => (
                <button
                  key={i}
                  className={`console-quick-btn console-quick-${qa.type}`}
                  onClick={() => submitAnswer(qa.value)}
                >
                  {qa.label}
                </button>
              ))}
              <button
                className="console-quick-btn console-quick-custom"
                onClick={() => { setShowCustomInput(true); setTimeout(() => inputRef.current?.focus(), 100); }}
              >
                ✍️ Write my own
              </button>
            </div>
          )}

          {/* Progress pips */}
          <div className="console-exercise-pips">
            {exercises.map((_, i) => (
              <span
                key={i}
                className={`console-pip ${
                  completedExercises.has(i) ? 'pip-done' : i === activeExercise ? 'pip-active' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* All complete state */}
      {exercises.length > 0 && completedExercises.size === exercises.length && (
        <div className="console-all-done">
          <span className="console-all-done-icon">✦</span>
          <span>All {exercises.length} exercises complete!</span>
        </div>
      )}

      {/* Conversation history — compact */}
      {history.length > 0 && (
        <div className="console-history console-history-compact" ref={historyRef}>
          {history.map((msg, i) => (
            <div key={i} className={`console-msg console-msg-${msg.role}`}>
              <div className="console-msg-avatar">
                {msg.role === 'user' ? '→' : '◆'}
              </div>
              <div className="console-msg-content">
                <span className="console-msg-label">
                  {msg.role === 'user' ? 'You' : 'Faye'}
                </span>
                <div className="console-msg-text">{msg.content}</div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="console-typing">
              <span className="console-typing-dot" />
              <span className="console-typing-dot" />
              <span className="console-typing-dot" />
            </div>
          )}
        </div>
      )}

      {/* Custom input — only shown when user opts in */}
      {showCustomInput && (
        <form className="console-input-bar" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={exercise?.placeholder || 'Write your response...'}
            className="console-input console-textarea"
            disabled={isProcessing}
            autoComplete="off"
            rows={3}
          />
          <div className="console-input-actions">
            <button type="submit" className="console-send-btn" disabled={isProcessing || !input.trim()}>
              Submit ▸
            </button>
            <button type="button" className="console-cancel-btn" onClick={() => setShowCustomInput(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Skip button for non-completed exercises */}
      {exercise && !completedExercises.has(activeExercise) && !isProcessing && activeExercise < exercises.length - 1 && (
        <button className="console-skip-btn" onClick={handleSkip}>
          Skip →
        </button>
      )}

      {/* Quality grader — shown after custom input */}
      {gradeResult && gradeResult.overall > 0 && showCustomInput && (
        <QualityGrader result={gradeResult} />
      )}

      {/* Prompt diff view */}
      {showDiff && exercise?.badExample && exercise?.goodExample && (
        <PromptDiffView
          badPrompt={exercise.badExample}
          goodPrompt={exercise.goodExample}
          onTryGood={() => submitAnswer(exercise.goodExample)}
        />
      )}

      {/* Celebration effects */}
      <CelebrationEffects trigger={celebrationTrigger} type="exercise" />
      <CelebrationEffects trigger={allDoneTrigger} type="course" />
    </div>
  );
}
