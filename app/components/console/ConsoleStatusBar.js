'use client';
import { useState, useEffect } from 'react';

function getProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('likeone-progress') || '{}');
  } catch { return {}; }
}

export default function ConsoleStatusBar({ appName = 'Academy' }) {
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
    return () => clearInterval(interval);
  }, []);

  const completedCount = Object.keys(progress).length;

  return (
    <div className="lo-statusbar">
      <div className="lo-statusbar-left">
        <span className="lo-statusbar-app">
          <span className="lo-statusbar-pulse" />
          {appName}
        </span>
        {completedCount > 0 && (
          <span className="lo-statusbar-xp">
            ✦ {completedCount} lessons
          </span>
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
