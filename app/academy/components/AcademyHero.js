'use client';

import React from 'react';
import { AnimatedHeroBackground } from './AcademyVisuals';

export default function AcademyHero({ courseCount, lessonCount, totalXP }) {
  return (
    <header className="acad-hero" style={{ position: 'relative' }}>
      <AnimatedHeroBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="acad-badge">Now Open</div>
        <h1>Learn AI by doing.</h1>
        <p className="acad-hero-sub">
          Interactive courses that teach AI and automation through animations,
          live code, and hands-on experiments. Not lectures — experiences.
        </p>
        <div className="acad-stats">
          <div className="acad-stat">
            <div className="acad-stat-value">{courseCount}</div>
            <div className="acad-stat-label">Courses</div>
          </div>
          <div className="acad-stat">
            <div className="acad-stat-value">{lessonCount}</div>
            <div className="acad-stat-label">Lessons</div>
          </div>
          <div className="acad-stat">
            <div className="acad-stat-value">{totalXP.toLocaleString()}</div>
            <div className="acad-stat-label">Total XP</div>
          </div>
        </div>
      </div>
    </header>
  );
}