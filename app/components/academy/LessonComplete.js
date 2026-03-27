'use client';
import { useState, useEffect } from 'react';
import { getProfile, completeLesson, uncompleteLesson } from '../../../lib/progress-engine';

export default function LessonComplete({ courseSlug, lessonSlug }) {
  const key = `${courseSlug}/${lessonSlug}`;
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const profile = getProfile();
    setCompleted(!!profile.lessons[key]);
  }, [key]);

  const toggle = () => {
    if (completed) {
      uncompleteLesson(courseSlug, lessonSlug);
      setCompleted(false);
      setFeedback(null);
    } else {
      const result = completeLesson(courseSlug, lessonSlug);
      setCompleted(true);

      const parts = [`+${result.xpGained} XP`];
      if (result.leveledUp && result.newLevel) {
        parts.push(`Level ${result.newLevel.level}: ${result.newLevel.emoji} ${result.newLevel.name}!`);
      }
      if (result.newAchievements.length > 0) {
        for (const a of result.newAchievements) {
          parts.push(`${a.emoji} ${a.name}`);
        }
      }
      setFeedback(parts.join(' · '));
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="academy-complete-wrap">
      <button
        onClick={toggle}
        className={`academy-complete-btn ${completed ? 'completed' : ''}`}
      >
        <span className="academy-complete-icon">{completed ? '✓' : '○'}</span>
        <span>{completed ? 'Lesson Completed' : 'Mark as Complete'}</span>
      </button>
      {feedback && (
        <div className="lo-xp-feedback">
          {feedback}
        </div>
      )}
    </div>
  );
}
