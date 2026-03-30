'use client';
import { useState, useEffect } from 'react';
import CourseCard from '../components/academy/CourseCard';
import TierTabs from '../components/academy/TierTabs';
import VideoThumbnail from '../components/academy/VideoThumbnail';
import coursesData from '../../content/academy/courses.json';
import { getProfile, getLevel } from '../../lib/progress-engine';

// Featured video — The Convergence Lab intro (the capstone, the flagship)
const FEATURED_VIDEO = {
  videoId: '1f0b6854-fe3d-4f77-ab97-674b1486fa1b',
  title: 'What Is Convergence?',
  course: 'The Convergence Lab',
  courseSlug: 'the-convergence-lab',
};

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
  const videoCourses = allCourses.filter(c => c.introVideoId);

  return (
    <div className="academy-container-wide">

      {/* ═══ CINEMATIC HERO ═══ */}
      <div className="academy-v2-hero">
        <div className="academy-v2-hero__bg" />

        <div className="academy-v2-hero__content">
          <div className="academy-v2-hero__text">
            <span className="academy-v2-hero__overline">LIKE ONE ACADEMY</span>
            <h1 className="academy-v2-hero__title">
              Learn by <span className="academy-v2-hero__accent">watching.</span>
            </h1>
            <p className="academy-v2-hero__desc">
              {allCourses.length} courses. Cinema-grade video lessons.
              From your first AI conversation to building autonomous systems.
            </p>

            {/* Stats */}
            <div className="academy-v2-hero__stats">
              {[
                { n: allCourses.length, label: 'Courses' },
                { n: `${totalLessons}+`, label: 'Lessons' },
                { n: `${videoCourses.length}`, label: 'Video Courses' },
                { n: '$0', label: 'To Start' },
              ].map(s => (
                <div key={s.label} className="academy-v2-stat">
                  <div className="academy-v2-stat__value">{s.n}</div>
                  <div className="academy-v2-stat__label">{s.label}</div>
                </div>
              ))}

              {completedLessons > 0 && (
                <div className="academy-v2-stat academy-v2-stat--accent">
                  <div className="academy-v2-stat__value">{progressPercent}%</div>
                  <div className="academy-v2-stat__label">{completedLessons} done</div>
                </div>
              )}

              {profile && profile.xp > 0 && (() => {
                const level = getLevel(profile.xp);
                return (
                  <div className="academy-v2-stat academy-v2-stat--accent">
                    <div className="academy-v2-stat__value">{level.emoji} Lv{level.level}</div>
                    <div className="academy-v2-stat__label">{profile.xp} XP</div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Featured Video */}
          <div className="academy-v2-hero__video">
            <a href={`/academy/${FEATURED_VIDEO.courseSlug}/`} className="academy-v2-hero__video-link">
              <VideoThumbnail
                videoId={FEATURED_VIDEO.videoId}
                title={FEATURED_VIDEO.title}
                size="hero"
              />
              <div className="academy-v2-hero__video-caption">
                <span className="academy-v2-hero__video-course">{FEATURED_VIDEO.course}</span>
                <span className="academy-v2-hero__video-title">{FEATURED_VIDEO.title}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ═══ PRICING HINT ═══ */}
      <div className="academy-v2-pricing">
        <span>First 3 lessons of every course — free. Full access from <strong>$4.90/mo</strong>.</span>
        <a href="/pricing/" className="academy-v2-pricing__link">See plans</a>
      </div>

      {/* ═══ SEARCH + TABS ═══ */}
      <div className="academy-v2-controls">
        <div className="academy-v2-search">
          <svg className="academy-v2-search__icon" viewBox="0 0 20 20" fill="none" width="16" height="16">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="academy-v2-search__input"
          />
        </div>
        <TierTabs activeTier={activeTier} onTierChange={setActiveTier} />
      </div>

      {/* Search results indicator */}
      {search.trim() && (
        <div className="academy-v2-results">
          {courses.length} result{courses.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
          <button onClick={() => setSearch('')} className="academy-v2-results__clear">Clear</button>
        </div>
      )}

      {/* ═══ COURSE GRID ═══ */}
      {!search.trim() && activeTier === 'all' ? (
        coursesData.tiers.map(tier => (
          <div key={tier.slug} className="academy-v2-tier">
            <div className="academy-v2-tier__header">
              <div className="academy-v2-tier__line" />
              <h2 className="academy-v2-tier__title">
                <span className="academy-v2-tier__emoji">{tier.emoji}</span>
                {tier.name}
              </h2>
              <p className="academy-v2-tier__desc">{tier.description}</p>
            </div>
            <div className="academy-v2-grid">
              {tier.courses.map((c, i) => (
                <CourseCard key={c.slug} index={i} course={{
                  ...c,
                  tierName: tier.name,
                  tierSlug: tier.slug,
                  tierEmoji: tier.emoji,
                }} progress={progress} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="academy-v2-grid">
          {courses.map((c, i) => (
            <CourseCard key={c.slug} index={i} course={c} progress={progress} />
          ))}
        </div>
      )}

      {courses.length === 0 && (
        <div className="academy-v2-empty">
          <div className="academy-v2-empty__icon">
            <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="academy-v2-empty__text">
            No courses found. Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
