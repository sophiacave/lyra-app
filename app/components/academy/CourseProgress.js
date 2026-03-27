'use client';
import { useState, useEffect } from 'react';

export default function CourseProgress({ courseSlug, lessons }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    try {
      setProgress(JSON.parse(localStorage.getItem('likeone-progress') || '{}'));
    } catch {}
  }, []);

  const completed = lessons.filter(l => progress[`${courseSlug}/${l.slug}`]).length;
  const total = lessons.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (completed === 0) return null;

  return (
    <div className="glass glass-animate-up" style={{
      padding: '20px 24px',
      marginBottom: '24px',
      borderRadius: 'var(--glass-radius)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      {/* Progress ring */}
      <svg width="48" height="48" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="4"
        />
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke={percent === 100 ? '#4ade80' : '#c084fc'}
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 20}`}
          strokeDashoffset={`${2 * Math.PI * 20 * (1 - percent / 100)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: percent === 100 ? '#4ade80' : '#e8e8ec',
          marginBottom: '4px',
        }}>
          {percent === 100 ? 'Course Complete!' : `${percent}% Complete`}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
        }}>
          {completed} of {total} lessons completed
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '120px',
        height: '4px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: percent === 100
            ? 'linear-gradient(90deg, #4ade80, #38bdf8)'
            : 'linear-gradient(90deg, #c084fc, #38bdf8)',
          borderRadius: '2px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
