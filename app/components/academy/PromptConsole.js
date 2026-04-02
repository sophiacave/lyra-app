'use client';
import { useState, useRef, useEffect } from 'react';
import { validatePrompt, gradePrompt } from '../../../lib/exercise-engine';
import QualityGrader from '../console/QualityGrader';
import PromptDiffView from '../console/PromptDiffView';
import CelebrationEffects from '../console/CelebrationEffects';

// Variable-speed typing — faster for common chars, pauses at punctuation
function useTypingEffect(text, isActive) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive || !text) {
      setDisplayed('');
      setIsDone(false);
      return;
    }

    setIsDone(false);
    let i = 0;
    setDisplayed('');

    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setIsDone(true);
        return;
      }
      const char = text[i - 1];
      let delay = 16;
      if (char === '.' || char === '!' || char === '?') delay = 120;
      else if (char === ',' || char === ';' || char === ':') delay = 60;
      else if (char === '\n') delay = 80;
      else if (char === ' ') delay = 10;
      else delay = 14 + Math.random() * 8;
      timer = setTimeout(tick, delay);
    };

    let timer = setTimeout(tick, 30);
    return () => clearTimeout(timer);
  }, [text, isActive]);

  return { displayed, isDone };
}

// Type metadata for exercise badges
const TYPE_META = {
  prompt:   { icon: '⚡', label: 'Write a prompt', color: 'var(--accent-blue)' },
  freeform: { icon: '✦', label: 'Free response', color: 'var(--accent-warm)' },
  rewrite:  { icon: '✏️', label: 'Rewrite this', color: 'var(--status-warning)' },
  debug:    { icon: '🐛', label: 'Debug this', color: 'var(--status-error)' },
  analyze:  { icon: '🔍', label: 'Analyze this', color: 'var(--accent-blue)' },
  compare:  { icon: '⚖️', label: 'Compare', color: 'var(--text-secondary)' },
};

// Parse instruction for scenario-based types: split at double newline
function parseScenario(instruction) {
  const idx = instruction.indexOf('\n\n');
  if (idx === -1) return { intro: instruction, scenario: null };
  return { intro: instruction.slice(0, idx), scenario: instruction.slice(idx + 2) };
}

export default function PromptConsole({ exercises = [], lessonTitle = '', onActivity }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeExercise, setActiveExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [allDoneTrigger, setAllDoneTrigger] = useState(0);

  const { displayed, isDone } = useTypingEffect(currentResponse, showResponse);

  // Emit activity state to parent (console glow + status bar)
  useEffect(() => {
    if (!onActivity) return;
    if (isTyping && displayed) onActivity('responding');
    else if (isTyping && !displayed) onActivity('responding');
    else if (input.length > 0) onActivity('typing');
    else onActivity('idle');
  }, [isTyping, displayed, input, onActivity]);

  // Emit celebration state
  useEffect(() => {
    if (!onActivity || celebrationTrigger === 0) return;
    onActivity('celebrating');
    const t = setTimeout(() => onActivity('idle'), 2000);
    return () => clearTimeout(t);
  }, [celebrationTrigger, onActivity]);

  useEffect(() => {
    if (isDone && currentResponse) {
      setHistory(prev => [...prev, { role: 'assistant', content: currentResponse }]);
      setCurrentResponse('');
      setShowResponse(false);
      setIsTyping(false);
    }
  }, [isDone, currentResponse]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history, displayed]);

  const exercise = exercises[activeExercise] || null;
  const exType = exercise?.type || 'freeform';
  const meta = TYPE_META[exType] || TYPE_META.freeform;
  const usesTextarea = ['debug', 'analyze', 'rewrite', 'freeform', 'compare'].includes(exType);
  const { intro, scenario } = exercise ? parseScenario(exercise.instruction) : { intro: '', scenario: null };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    setShowDiff(false);
    // Grade every prompt for quality feedback
    const grade = gradePrompt(userMsg);
    setGradeResult(grade);

    // If there's an exercise with criteria, use the engine first
    if (exercise && exercise.criteria) {
      const result = validatePrompt(userMsg, exercise);
      if (result.pass) {
        setCompletedExercises(prev => new Set([...prev, activeExercise]));
        setCelebrationTrigger(t => t + 1);
        setCurrentResponse(result.feedback);
        setShowResponse(true);
        const newCompleted = new Set([...completedExercises, activeExercise]);
        if (exercises.length > 0 && newCompleted.size === exercises.length) {
          setTimeout(() => setAllDoneTrigger(t => t + 1), 1500);
        }
        setTimeout(() => {
          if (activeExercise < exercises.length - 1) {
            setActiveExercise(activeExercise + 1);
          }
        }, 2000);
        return;
      } else {
        if (exercise.badExample && exercise.goodExample) {
          setShowDiff(true);
        }
        setCurrentResponse(result.feedback);
        setShowResponse(true);
        return;
      }
    }

    // Legacy: exercise with validate function
    if (exercise && exercise.validate) {
      const isCorrect = exercise.validate(userMsg);
      if (isCorrect) {
        setCompletedExercises(prev => new Set([...prev, activeExercise]));
        setCelebrationTrigger(t => t + 1);
        setCurrentResponse(exercise.successResponse || 'Great job! That prompt works perfectly.');
        setShowResponse(true);
        setTimeout(() => {
          if (activeExercise < exercises.length - 1) {
            setActiveExercise(activeExercise + 1);
          }
        }, 2000);
        return;
      }
    }

    // All exercises have criteria — if we reach here, it's freeform chat after exercises.
    // Check if AI backend is available before streaming.
    setIsTyping(false);
    setHistory(prev => [...prev, {
      role: 'assistant',
      content: exercise
        ? 'Try rephrasing your response to match the exercise criteria. Check the hint for guidance!'
        : 'Nice work completing the exercises! AI chat is coming soon — for now, head to claude.ai to keep practicing.',
    }]);
  };

  const handleTryPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  // Handle textarea Enter (submit) vs Shift+Enter (newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && usesTextarea) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="console-panel">
      {/* Console header */}
      <div className="console-header">
        <div className="console-dots">
          <span className="console-dot dot-red" />
          <span className="console-dot dot-yellow" />
          <span className="console-dot dot-green" />
        </div>
        <span className="console-title">
          {lessonTitle ? `${lessonTitle} — Console` : 'Like One Console'}
        </span>
      </div>

      {/* Exercise badge — type-aware */}
      {exercise && (
        <div className="console-exercise-bar">
          <div className="console-exercise-badge" style={{ borderColor: meta.color }}>
            <span className="console-exercise-icon">{meta.icon}</span>
            <span className="console-exercise-label" style={{ color: meta.color }}>{meta.label}</span>
          </div>
          <p className="console-exercise-prompt">{scenario ? intro : exercise.instruction}</p>

          {/* Scenario block for debug/analyze/rewrite/compare */}
          {scenario && (
            <div className={`console-scenario console-scenario-${exType}`}>
              <pre className="console-scenario-text">{scenario}</pre>
            </div>
          )}

          {exercise.hint && (
            <button
              className="console-hint-btn"
              onClick={() => handleTryPrompt(exercise.hint)}
            >
              Show hint
            </button>
          )}
          <div className="console-exercise-progress">
            {exercises.map((_, i) => (
              <span
                key={i}
                className={`console-exercise-pip ${
                  completedExercises.has(i) ? 'pip-done' : i === activeExercise ? 'pip-active' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message history */}
      <div className="console-history" ref={historyRef}>
        {history.length === 0 && !isTyping && (
          <div className="console-empty">
            <div className="console-empty-icon">▸</div>
            <p>Type a prompt below to get started.</p>
            {exercise && (
              <p className="console-empty-hint">
                Try: <button className="console-inline-prompt" onClick={() => handleTryPrompt(exercise.hint || exercise.instruction)}>
                  {exercise.hint || exercise.instruction}
                </button>
              </p>
            )}
          </div>
        )}

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

        {/* Typing effect for exercise validation responses */}
        {isTyping && displayed && (
          <div className="console-msg console-msg-assistant">
            <div className="console-msg-avatar">◆</div>
            <div className="console-msg-content">
              <span className="console-msg-label">Faye</span>
              <div className="console-msg-text">
                {displayed}
                <span className="console-cursor">▊</span>
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && !displayed && (
          <div className="console-typing">
            <span className="console-typing-dot" />
            <span className="console-typing-dot" />
            <span className="console-typing-dot" />
          </div>
        )}
      </div>

      {/* Input — textarea for long-form types, input for prompt type */}
      <form className="console-input-bar" onSubmit={handleSubmit}>
        {usesTextarea ? (
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={exercise ? exercise.placeholder || 'Type your response...' : 'Type a prompt...'}
            className="console-input console-textarea"
            disabled={isTyping}
            autoComplete="off"
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={exercise ? exercise.placeholder || 'Type your prompt...' : 'Type a prompt...'}
            className="console-input"
            disabled={isTyping}
            autoComplete="off"
          />
        )}
        <button
          type="submit"
          className="console-send-btn"
          disabled={isTyping || !input.trim()}
        >
          ▸
        </button>
      </form>

      {/* Quality grader */}
      {gradeResult && gradeResult.overall > 0 && (
        <QualityGrader result={gradeResult} />
      )}

      {/* Prompt diff view */}
      {showDiff && exercise?.badExample && exercise?.goodExample && (
        <PromptDiffView
          badPrompt={exercise.badExample}
          goodPrompt={exercise.goodExample}
          onTryGood={() => handleTryPrompt(exercise.goodExample)}
        />
      )}

      {/* Completion */}
      {exercises.length > 0 && completedExercises.size === exercises.length && (
        <div className="console-complete">
          <span className="console-complete-icon">✦</span>
          All exercises complete
        </div>
      )}

      {/* Celebration effects */}
      <CelebrationEffects trigger={celebrationTrigger} type="exercise" />
      <CelebrationEffects trigger={allDoneTrigger} type="course" />
    </div>
  );
}

