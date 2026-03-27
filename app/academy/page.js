'use client';
import { useState } from 'react';
import CourseCard from '../components/academy/CourseCard';
import TierTabs from '../components/academy/TierTabs';
import coursesData from '../../content/academy/courses.json';

export default function AcademyCatalog() {
  const [activeTier, setActiveTier] = useState('all');

  const allCourses = coursesData.tiers.flatMap(tier =>
    tier.courses.map(c => ({
      ...c,
      tierName: tier.name,
      tierSlug: tier.slug,
      tierEmoji: tier.emoji,
    }))
  );

  const filteredCourses = activeTier === 'all'
    ? allCourses
    : allCourses.filter(c => c.tierSlug === activeTier);

  const liveCourses = allCourses.filter(c => c.status === 'live');
  const totalLessons = liveCourses.reduce((sum, c) => sum + (c.lessonCount || 10), 0);

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
        {/* Subtle gradient orb behind hero */}
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
        </div>
      </div>

      {/* Tier Tabs */}
      <TierTabs activeTier={activeTier} onTierChange={setActiveTier} />

      {/* Course Grid */}
      {activeTier === 'all' ? (
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
                }} />
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
          {filteredCourses.map((c, i) => (
            <CourseCard key={c.slug} index={i} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
