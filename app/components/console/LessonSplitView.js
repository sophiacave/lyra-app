'use client';
import { useState, useCallback } from 'react';
import PromptConsole from '../academy/PromptConsole';

export default function LessonSplitView({ contentHtml, lessonTitle, exercises = [], showConsole = true }) {
  const [consoleOpen, setConsoleOpen] = useState(showConsole);
  const [consoleState, setConsoleState] = useState('idle');

  const handleActivity = useCallback((state) => {
    setConsoleState(state);
  }, []);

  const consoleClasses = [
    'lo-split-console',
    consoleState !== 'idle' ? 'lo-console-active' : '',
    consoleState === 'typing' ? 'lo-console-typing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="lo-splitview">
      {/* Instruction pane */}
      <div className="lo-split-content">
        <div
          className="lesson-content glass-animate-up"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      {/* Console toggle (visible when console is closed) */}
      {!consoleOpen && (
        <button
          className="lo-console-toggle"
          onClick={() => setConsoleOpen(true)}
          title="Open console"
        >
          <span className="lo-console-toggle-icon">▸</span>
        </button>
      )}

      {/* Console pane */}
      {consoleOpen && (
        <div className={consoleClasses}>
          <div className="lo-console-close-row">
            <button
              className="lo-console-close"
              onClick={() => setConsoleOpen(false)}
              title="Close console"
            >
              ✕
            </button>
          </div>
          <PromptConsole
            exercises={exercises}
            lessonTitle={lessonTitle}
            onActivity={handleActivity}
          />
        </div>
      )}
    </div>
  );
}
