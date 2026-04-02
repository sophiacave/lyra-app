'use client';

import { useState, useEffect } from 'react';

/**
 * LessonComplete — Completion tracking for academy progress
 *
 * Persists lesson completion state to localStorage, enabling students to
 * track their progress across sessions. Awards XP on first completion.
 *
 * @param {Object} props
 * @param {string} props.courseSlug - URL slug for the course
 * @param {number} props.lessonNum - Lesson number within the course
 * @param {Function} props.onXP - Callback to award XP points
 */
export default function LessonComplete({ courseSlug, lessonNum, onXP }) {
  const [completed, setCompleted] = useState(false);
  const [visible, setVisible] = useState(false);

  const storageKey = `lo_progress_${courseSlug}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const progress = raw ? JSON.parse(raw) : [];
      if (Array.isArray(progress) && progress.includes(lessonNum)) {
        setCompleted(true);
        setVisible(true);
        return;
      }
    } catch {
      // Corrupted localStorage — treat as not completed
    }

    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, [storageKey, lessonNum]);

  const handleComplete = () => {
    if (completed) return;

    let progress = [];
    try {
      const raw = localStorage.getItem(storageKey);
      progress = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(progress)) progress = [];
    } catch {
      progress = [];
    }

    if (!progress.includes(lessonNum)) {
      progress.push(lessonNum);
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }

    setCompleted(true);
    if (onXP) onXP(25);
  };

  const buttonStyle = {
    padding: '12px 32px',
    backgroundColor: completed ? '#22c55e' : '#fb923c',
    color: completed ? '#fff' : '#000',
    fontWeight: 700,
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: completed ? 'default' : 'pointer',
    pointerEvents: completed ? 'none' : 'auto',
    transition: 'background-color 0.3s ease, opacity 0.3s ease',
    opacity: visible ? 1 : 0,
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      margin: '1.5rem 0',
    }}>
      <button onClick={handleComplete} style={buttonStyle}>
        {completed
          ? 'Completed! \u2728'
          : `Complete Lesson ${lessonNum} \u2713`}
      </button>
    </div>
  );
}
