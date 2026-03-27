'use client';
import { useState, useEffect } from 'react';

function getProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('likeone-progress') || '{}');
  } catch { return {}; }
}

export default function ConsoleStatusBar({ appName = 'Academy', activity = 'idle' }) {
  const [progress, setProgress] = useState({});
  const [time, setTime] = useState('');

  useEffect(() => {
    setProgress(getProgress());
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    // Listen for progress updates from PromptConsole
    const handleProgress = () => setProgress(getProgress());
    window.addEventListener('likeone-progress', handleProgress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('likeone-progress', handleProgress);
    };
  }, []);

  const completedCount = Object.keys(progress).length;

  const pulseClass = activity === 'typing' ? 'lo-pulse-typing'
    : activity === 'responding' ? 'lo-pulse-active'
    : activity === 'celebrating' ? 'lo-pulse-celebrating'
    : '';

  const activityLabel = activity === 'typing' ? 'composing...'
    : activity === 'responding' ? 'thinking...'
    : activity === 'celebrating' ? 'nice work!'
    : null;

  return (
    <div className="lo-statusbar">
      <div className="lo-statusbar-left">
        <span className="lo-statusbar-app">
          <span className={`lo-statusbar-pulse ${pulseClass}`} />
          {appName}
        </span>
        {completedCount > 0 && (
          <span className="lo-statusbar-xp">
            ✦ {completedCount} lessons
          </span>
        )}
        {activityLabel && (
          <span className="lo-statusbar-activity">{activityLabel}</span>
        )}
      </div>
      <div className="lo-statusbar-center">
        <span className="lo-statusbar-hint">
          Built with soul — likeone.ai
        </span>
      </div>
      <div className="lo-statusbar-right">
        <span className="lo-statusbar-time">{time}</span>
      </div>
    </div>
  );
}
