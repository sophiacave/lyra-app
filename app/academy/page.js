'use client';
import { useState, useEffect } from 'react';
import CourseCard from '../components/academy/CourseCard';
import TierTabs from '../components/academy/TierTabs';
import coursesData from '../../content/academy/courses.json';
import { getProfile, getLevel } from '../../lib/progress-engine';

export default function AcademyCatalog() {
  const [activeTier, setActiveTier] = useState('all');
  const [search, setSearch] = useState('');
  const [progress, setProgress] = useState({});
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setProgress(p.lessons);
  }, []);

  const allCourses = coursesData.tiers.flatMap(tier =>
    tier.courses.map(c => ({
      ...c,
      tierName: tier.name,
      tierSlug: tier.slug,
      tierEmoji: tier.emoji,
    }))
  );

  let courses = activeTier === 'all'
    ? allCourses
    : allCourses.filter(c => c.tierSlug === activeTier);

  if (search.trim()) {
    const q = search.toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.audience?.some(a => a.toLowerCase().includes(q))
    );
  }

  const liveCourses = allCourses.filter(c => c.status === 'live');
  const totalLessons = liveCourses.reduce((sum, c) => sum + (c.lessonCount || 10), 0);
  const completedLessons = Object.keys(progress).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="academy-container-wide">
      {/* Hero */}
      <div className="glass glass-animate-up academy-hero">
        <div className="academy-hero-glow" />

        <h1 className="academy-hero-title">Like One Academy</h1>
        <p className="academy-hero-desc">
          {allCourses.length} courses across 3 levels. From your first AI conversation
          to building autonomous agent systems. Start free.
        </p>

        {/* Stats bar */}
        <div className="academy-stats-bar">
          {[
            { n: allCourses.length, label: 'Courses' },
            { n: `${totalLessons}+`, label: 'Lessons' },
            { n: '3', label: 'Levels' },
            { n: '$0', label: 'To Start' },
          ].map(s => (
            <div key={s.label} className="glass-stat">
              <div className="glass-stat-value">{s.n}</div>
              <div className="glass-stat-label">{s.label}</div>
            </div>
          ))}

          {completedLessons > 0 && (
            <div className="glass-stat academy-stat-progress">
              <div className="glass-stat-value">{progressPercent}%</div>
              <div className="glass-stat-label">{completedLessons} completed</div>
            </div>
          )}

          {profile && profile.xp > 0 && (() => {
            const level = getLevel(profile.xp);
            return (
              <div className="glass-stat academy-stat-level">
                <div className="glass-stat-value">{level.emoji} Lv{level.level}</div>
                <div className="glass-stat-label">{profile.xp} XP · {level.name}</div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Pricing hint */}
      <div className="academy-pricing-hint glass glass-animate-up">
        <span>First 3 lessons of every course — free. Full access from <strong>$4.90/mo</strong>.</span>
        <a href="/pricing/" className="academy-pricing-hint-link">See plans →</a>
      </div>

      {/* Search + Tier Tabs */}
      <div className="academy-search-row">
        <div className="glass-search-wrap academy-search-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="glass-input academy-search-input"
          />
          <span className="academy-search-icon">🔍</span>
        </div>
        <TierTabs activeTier={activeTier} onTierChange={setActiveTier} />
      </div>

      {/* Search results indicator */}
      {search.trim() && (
        <div className="academy-search-results">
          {courses.length} result{courses.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
          <button onClick={() => setSearch('')} className="academy-search-clear">
            Clear
          </button>
        </div>
      )}

      {/* Course Grid */}
      {!search.trim() && activeTier === 'all' ? (
        coursesData.tiers.map(tier => (
          <div key={tier.slug} className="academy-tier-group">
            <h2 className="academy-tier-heading">
              <span>{tier.emoji} {tier.name}</span>
              <span className="academy-tier-heading-desc">{tier.description}</span>
            </h2>
            <div className="academy-course-grid">
              {tier.courses.map((c, i) => (
                <CourseCard key={c.slug} index={i} course={{
                  ...c,
                  tierName: tier.name,
                  tierSlug: tier.slug,
                }} progress={progress} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="academy-course-grid">
          {courses.map((c, i) => (
            <CourseCard key={c.slug} index={i} course={c} progress={progress} />
          ))}
        </div>
      )}

      {courses.length === 0 && (
        <div className="glass academy-empty">
          <div className="academy-empty-emoji">🔍</div>
          <p className="academy-empty-text">
            No courses found. Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
