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
      className={`academy-complete-btn ${completed ? 'completed' : ''}`}
    >
      <span className="academy-complete-icon">{completed ? '✓' : '○'}</span>
      <span>{completed ? 'Lesson Completed' : 'Mark as Complete'}</span>
    </button>
  );
}
