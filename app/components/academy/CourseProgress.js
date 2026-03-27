'use client';
import { useState, useEffect } from 'react';
import { getProfile } from '../../../lib/progress-engine';

export default function CourseProgress({ courseSlug, lessons }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(getProfile());

    const handleProgress = () => setProfile(getProfile());
    window.addEventListener('likeone-progress', handleProgress);
    return () => window.removeEventListener('likeone-progress', handleProgress);
  }, []);

  if (!profile) return null;

  const completed = lessons.filter(l => profile.lessons[`${courseSlug}/${l.slug}`]).length;
  const total = lessons.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (completed === 0) return null;

  const ringRadius = 20;
  const circumference = 2 * Math.PI * ringRadius;

  return (
    <div className="glass glass-animate-up academy-progress-panel">
      {/* Progress ring */}
      <svg width="48" height="48" className="academy-progress-ring">
        <circle
          cx="24" cy="24" r={ringRadius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="4"
        />
        <circle
          cx="24" cy="24" r={ringRadius}
          fill="none"
          stroke={percent === 100 ? 'var(--status-success)' : 'var(--accent-purple)'}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          strokeLinecap="round"
          className="svg-transition-stroke"
        />
      </svg>

      <div className="academy-progress-info">
        <div className={`academy-progress-label ${percent === 100 ? 'complete' : ''}`}>
          {percent === 100 ? 'Course Complete!' : `${percent}% Complete`}
        </div>
        <div className="academy-progress-sub">
          {completed} of {total} lessons completed
        </div>
      </div>

      {/* Progress bar */}
      <div className="academy-progress-bar-wrap">
        <div className="glass-progress">
          <div
            className={`glass-progress-fill ${percent === 100 ? 'complete' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
