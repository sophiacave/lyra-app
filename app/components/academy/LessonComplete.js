'use client';
import { useState, useEffect } from 'react';

export default function LessonComplete({ courseSlug, lessonSlug }) {
  const key = `${courseSlug}/${lessonSlug}`;
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('likeone-progress') || '{}');
      setCompleted(!!progress[key]);
    } catch {}
  }, [key]);

  const toggle = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('likeone-progress') || '{}');
      if (completed) {
        delete progress[key];
      } else {
        progress[key] = Date.now();
      }
      localStorage.setItem('likeone-progress', JSON.stringify(progress));
      setCompleted(!completed);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        padding: '14px 24px',
        marginTop: '32px',
        background: completed
          ? 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(56,189,248,0.1))'
          : 'linear-gradient(135deg, rgba(192,132,252,0.15), rgba(56,189,248,0.1))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: completed
          ? '1px solid rgba(74,222,128,0.25)'
          : '1px solid rgba(192,132,252,0.2)',
        borderRadius: '12px',
        color: '#e8e8ec',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        boxShadow: completed
          ? '0 0 24px rgba(74,222,128,0.08)'
          : '0 0 24px rgba(192,132,252,0.08)',
      }}
    >
      {completed ? (
        <>
          <span style={{ fontSize: '18px' }}>✓</span>
          <span>Lesson Completed</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: '18px' }}>○</span>
          <span>Mark as Complete</span>
        </>
      )}
    </button>
  );
}
