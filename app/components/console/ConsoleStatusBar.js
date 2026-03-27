'use client';
import { useState, useEffect } from 'react';
import { getProfile, getLevel, getLevelProgress, getNextLevel } from '../../../lib/progress-engine';

export default function ConsoleStatusBar({ appName = 'Academy', activity = 'idle' }) {
  const [profile, setProfile] = useState(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    setProfile(getProfile());
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    const handleProgress = () => setProfile(getProfile());
    window.addEventListener('likeone-progress', handleProgress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('likeone-progress', handleProgress);
    };
  }, []);

  const pulseClass = activity === 'typing' ? 'lo-pulse-typing'
    : activity === 'responding' ? 'lo-pulse-active'
    : activity === 'celebrating' ? 'lo-pulse-celebrating'
    : '';

  const activityLabel = activity === 'typing' ? 'composing...'
    : activity === 'responding' ? 'thinking...'
    : activity === 'celebrating' ? 'nice work!'
    : null;

  const level = profile ? getLevel(profile.xp) : null;
  const levelPct = profile ? getLevelProgress(profile.xp) : 0;
  const nextLevel = profile ? getNextLevel(profile.xp) : null;
  const lessonCount = profile ? Object.keys(profile.lessons).length : 0;

  return (
    <div className="lo-statusbar">
      <div className="lo-statusbar-left">
        <span className="lo-statusbar-app">
          <span className={`lo-statusbar-pulse ${pulseClass}`} />
          {appName}
        </span>
        {level && (
          <span className="lo-statusbar-level" title={`${level.name} — ${profile.xp} XP${nextLevel ? ` (${nextLevel.xp - profile.xp} to ${nextLevel.name})` : ''}`}>
            <span className="lo-statusbar-level-emoji">{level.emoji}</span>
            <span className="lo-statusbar-level-name">Lv{level.level}</span>
            {nextLevel && (
              <span className="lo-statusbar-level-bar">
                <span className="lo-statusbar-level-fill" style={{ width: `${levelPct}%` }} />
              </span>
            )}
          </span>
        )}
        {profile && profile.xp > 0 && (
          <span className="lo-statusbar-xp">
            ✦ {profile.xp} XP
          </span>
        )}
        {profile && profile.streak.current > 1 && (
          <span className="lo-statusbar-streak">
            🔥 {profile.streak.current}d
          </span>
        )}
        {activityLabel && (
          <span className="lo-statusbar-activity">{activityLabel}</span>
        )}
      </div>
      <div className="lo-statusbar-center">
        <span className="lo-statusbar-hint">
          {lessonCount > 0 ? `${lessonCount} lessons complete` : 'Built with soul — likeone.ai'}
        </span>
      </div>
      <div className="lo-statusbar-right">
        <span className="lo-statusbar-time">{time}</span>
      </div>
    </div>
  );
}
