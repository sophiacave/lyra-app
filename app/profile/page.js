'use client';
import { useState, useEffect } from 'react';
import LevelProgress from '../components/academy/LevelProgress';
import StreakDisplay from '../components/academy/StreakDisplay';
import BadgeGrid from '../components/academy/BadgeGrid';

const STORAGE_KEY = 'likeone-profile';

function loadProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getEarnedBadges(profile) {
  if (!profile) return [];
  const earned = [];
  const lessons = Object.keys(profile.lessons || {}).length;
  const courses = profile.coursesCompleted || 0;
  const streak = profile.streak?.best || 0;
  const xp = profile.xp || 0;

  if (lessons >= 1) earned.push('first-lesson');
  if (lessons >= 10) earned.push('lessons-10');
  if (lessons >= 50) earned.push('lessons-50');
  if (lessons >= 100) earned.push('lessons-100');
  if (courses >= 1) earned.push('first-course');
  if (courses >= 5) earned.push('courses-5');
  if (courses >= 10) earned.push('courses-10');
  if (streak >= 3) earned.push('streak-3');
  if (streak >= 7) earned.push('streak-7');
  if (streak >= 30) earned.push('streak-30');

  // Early adopter — everyone in 2026
  const created = profile.createdAt || profile.joinedAt;
  if (created && new Date(created).getFullYear() === 2026) {
    earned.push('rare-early');
  } else {
    earned.push('rare-early'); // Default for MVP
  }

  return earned;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const xp = profile?.xp || 0;
  const streak = profile?.streak?.current || 0;
  const bestStreak = profile?.streak?.best || 0;
  const lessonsCompleted = Object.keys(profile?.lessons || {}).length;
  const coursesCompleted = profile?.coursesCompleted || 0;
  const earned = getEarnedBadges(profile);

  return (
    <main className="profile-page">
      <div className="profile-hero liquid-panel liquid-hero">
        <h1>Your Progress</h1>
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{lessonsCompleted}</span>
            <span className="stat-label">Lessons</span>
          </div>
          <div className="stat">
            <span className="stat-value">{coursesCompleted}</span>
            <span className="stat-label">Courses</span>
          </div>
          <div className="stat">
            <span className="stat-value">{xp.toLocaleString()}</span>
            <span className="stat-label">XP</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <LevelProgress xp={xp} />
        <StreakDisplay current={streak} best={bestStreak} />
      </div>

      <BadgeGrid earnedBadges={earned} />

      {!profile && (
        <div className="profile-empty liquid-card">
          <p>Start learning to track your progress!</p>
          <a href="/academy/" className="btn-primary">Browse Courses →</a>
        </div>
      )}
    </main>
  );
}

// metadata must go in layout.js for client components
