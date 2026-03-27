'use client';
import { useState, useEffect } from 'react';
import CourseCard from '../components/academy/CourseCard';
import TierTabs from '../components/academy/TierTabs';
import coursesData from '../../content/academy/courses.json';

function getProgress() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('likeone-progress') || '{}');
  } catch { return {}; }
}

export default function AcademyCatalog() {
  const [activeTier, setActiveTier] = useState('all');
  const [search, setSearch] = useState('');
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const allCourses = coursesData.tiers.flatMap(tier =>
    tier.courses.map(c => ({
      ...c,
      tierName: tier.name,
      tierSlug: tier.slug,
      tierEmoji: tier.emoji,
    }))
  );

  // Filter by tier
  let courses = activeTier === 'all'
    ? allCourses
    : allCourses.filter(c => c.tierSlug === activeTier);

  // Filter by search
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

  // Calculate overall progress
  const completedLessons = Object.keys(progress).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '48px 32px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Hero — Glass Console Header */}
      <div className="glass glass-animate-up" style={{
        padding: '36px 32px',
        marginBottom: '36px',
        borderRadius: 'var(--glass-radius-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <h1 style={{
          fontSize: '38px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #c084fc 0%, #38bdf8 50%, #e879f9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}>
          Like One Academy
        </h1>
        <p style={{
          color: '#8888a0',
          fontSize: '15px',
          lineHeight: 1.6,
          maxWidth: '520px',
        }}>
          {allCourses.length} courses across 3 levels. From your first AI conversation
          to building autonomous agent systems. Start free.
        </p>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginTop: '24px',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}>
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
            <div className="glass-stat" style={{ marginLeft: 'auto' }}>
              <div className="glass-stat-value" style={{
                background: 'linear-gradient(135deg, #4ade80, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {progressPercent}%
              </div>
              <div className="glass-stat-label">{completedLessons} completed</div>
            </div>
          )}
        </div>
      </div>

      {/* Search + Tier Tabs row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div className="glass-search-wrap" style={{ flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="glass-input"
            style={{ paddingLeft: '36px' }}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '14px',
            pointerEvents: 'none',
          }}>
            🔍
          </span>
        </div>
        <TierTabs activeTier={activeTier} onTierChange={setActiveTier} />
      </div>

      {/* Search results indicator */}
      {search.trim() && (
        <div style={{
          marginBottom: '20px',
          fontSize: '13px',
          color: '#8888a0',
        }}>
          {courses.length} result{courses.length !== 1 ? 's' : ''} for "{search}"
          <button
            onClick={() => setSearch('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#c084fc',
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '13px',
              fontFamily: 'inherit',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Course Grid */}
      {!search.trim() && activeTier === 'all' ? (
        coursesData.tiers.map(tier => (
          <div key={tier.slug} style={{ marginBottom: '44px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#e8e8ec',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span>{tier.emoji} {tier.name}</span>
              <span style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.2)',
                fontWeight: 400,
              }}>
                {tier.description}
              </span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {courses.map((c, i) => (
            <CourseCard key={c.slug} index={i} course={c} progress={progress} />
          ))}
        </div>
      )}

      {courses.length === 0 && (
        <div className="glass" style={{
          padding: '48px 32px',
          textAlign: 'center',
          borderRadius: 'var(--glass-radius-lg)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ color: '#8888a0', fontSize: '15px' }}>
            No courses found. Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
