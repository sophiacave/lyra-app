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
      // Variable speed: pause at punctuation, fast on spaces
      const char = text[i - 1];
      let delay = 16; // base speed (fast)
      if (char === '.' || char === '!' || char === '?') delay = 120;
      else if (char === ',' || char === ';' || char === ':') delay = 60;
      else if (char === '\n') delay = 80;
      else if (char === ' ') delay = 10;
      else delay = 14 + Math.random() * 8; // slight jitter for natural feel
      timer = setTimeout(tick, delay);
    };

    let timer = setTimeout(tick, 30);
    return () => clearTimeout(timer);
  }, [text, isActive]);

  return { displayed, isDone };
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

  const handleSubmit = (e) => {
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

    // If there's an exercise with criteria, use the engine
    if (exercise && exercise.criteria) {
      const result = validatePrompt(userMsg, exercise);
      if (result.pass) {
        setCompletedExercises(prev => new Set([...prev, activeExercise]));
        setCelebrationTrigger(t => t + 1);
        setCurrentResponse(result.feedback);
        setShowResponse(true);
        // Check if all exercises done
        const newCompleted = new Set([...completedExercises, activeExercise]);
        if (exercises.length > 0 && newCompleted.size === exercises.length) {
          setTimeout(() => setAllDoneTrigger(t => t + 1), 1500);
        }
        // Auto-advance
        setTimeout(() => {
          if (activeExercise < exercises.length - 1) {
            setActiveExercise(activeExercise + 1);
          }
        }, 2000);
        return;
      } else {
        // Show diff if exercise has examples and user failed
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

    // Default response
    const response = exercise?.hintResponse
      ? exercise.hintResponse(userMsg)
      : generateResponse(userMsg);
    setCurrentResponse(response);
    setShowResponse(true);
  };

  const handleTryPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
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

      {/* Exercise badge */}
      {exercise && (
        <div className="console-exercise-bar">
          <div className="console-exercise-badge">
            <span className="console-exercise-icon">⚡</span>
            <span className="console-exercise-label">Try it</span>
          </div>
          <p className="console-exercise-prompt">{exercise.instruction}</p>
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
                {msg.role === 'user' ? 'You' : 'Claude'}
              </span>
              <div className="console-msg-text">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isTyping && displayed && (
          <div className="console-msg console-msg-assistant">
            <div className="console-msg-avatar">◆</div>
            <div className="console-msg-content">
              <span className="console-msg-label">Claude</span>
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

      {/* Input */}
      <form className="console-input-bar" onSubmit={handleSubmit}>
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

function generateResponse(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) {
    return "Hello! I'm Claude, made by Anthropic. I'm here to help you learn. Try asking me to do something specific — like drafting an email, summarizing a paragraph, or brainstorming ideas.";
  }
  if (lower.includes('email') || lower.includes('write')) {
    return "Here's a draft:\n\nSubject: Quick follow-up\n\nHi [Name],\n\nJust wanted to circle back on our conversation. I'd love to move forward when you're ready — no rush, just keeping the thread warm.\n\nBest,\n[Your name]\n\nWant me to adjust the tone or add more detail?";
  }
  if (lower.includes('summarize') || lower.includes('summary')) {
    return "I'd be happy to summarize something for you! Paste the text you'd like summarized, and I'll distill it into the key points. I can do bullet points, a one-paragraph summary, or an executive brief — your choice.";
  }
  if (lower.includes('brainstorm') || lower.includes('ideas')) {
    return "Here are 5 ideas to get started:\n\n1. Automate your weekly status reports with a template + AI\n2. Create a prompt library for your most common tasks\n3. Use AI to draft first versions, then edit with your expertise\n4. Build a personal knowledge base that AI can reference\n5. Set up AI-powered email sorting and priority flagging\n\nWant me to go deeper on any of these?";
  }
  return "That's a great prompt! In a real conversation with Claude, you'd get a detailed, thoughtful response here. The key to getting great outputs is being specific about what you want — include context, format preferences, and constraints.\n\nTry being more specific: who is this for? What tone? What format?";
}
