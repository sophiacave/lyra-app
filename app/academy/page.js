'use client';
import { useState } from 'react';
import CourseCard from '../components/academy/CourseCard';
import TierTabs from '../components/academy/TierTabs';

// This component receives courses via a wrapper — but since we need
// client interactivity for tier tabs, we'll fetch from a server component pattern.
// For now, we import the JSON directly (it's static data).
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
  const totalLessons = liveCourses.reduce((sum, c) => {
    // Approximate lesson counts for live courses
    const counts = {
      'claude-for-beginners': 9, 'ai-foundations': 9, 'ai-for-business': 10,
      'claude-mastery': 10, 'automation-architect': 9, 'first-ai-agent': 10,
      'ai-stack-builder': 10, 'mcp-masterclass': 10, 'rag-vector-search': 10,
      'the-automation-lab': 10,
    };
    return sum + (counts[c.slug] || 10);
  }, 0);

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      padding: '48px 24px',
    }}>
      {/* Hero */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          lineHeight: 1.2,
        }}>
          Like One Academy
        </h1>
        <p style={{
          color: '#a0a0a0',
          fontSize: '16px',
          lineHeight: 1.6,
          maxWidth: '560px',
        }}>
          {allCourses.length} courses across 3 levels. From your first AI conversation
          to building autonomous agent systems. Start free.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '20px',
          flexWrap: 'wrap',
        }}>
          {[
            { n: allCourses.length, label: 'Courses' },
            { n: `${totalLessons}+`, label: 'Lessons' },
            { n: '3', label: 'Levels' },
            { n: '$0', label: 'To Start' },
          ].map(s => (
            <div key={s.label}>
              <div style={{
                fontSize: '24px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: '12px', color: '#737373' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Tabs */}
      <TierTabs activeTier={activeTier} onTierChange={setActiveTier} />

      {/* Course Grid */}
      {activeTier === 'all' ? (
        // Show grouped by tier
        coursesData.tiers.map(tier => (
          <div key={tier.slug} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#e5e5e5',
              marginBottom: '16px',
            }}>
              {tier.emoji} {tier.name}
              <span style={{
                fontSize: '13px',
                color: '#737373',
                fontWeight: 400,
                marginLeft: '12px',
              }}>
                {tier.description}
              </span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {tier.courses.map(c => (
                <CourseCard key={c.slug} course={{
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
          {filteredCourses.map(c => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
