'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProgressRing from './ProgressRing';

export default function AcademySidebar({ courses, currentCourseSlug, currentLessonSlug }) {
  const pathname = usePathname();
  const [expandedCourse, setExpandedCourse] = useState(currentCourseSlug || null);
  const [isOpen, setIsOpen] = useState(false);

  const liveCourses = courses.filter(c => c.status === 'live');

  // Group by tier
  const tiers = {};
  for (const course of liveCourses) {
    if (!tiers[course.tierSlug]) {
      tiers[course.tierSlug] = { name: course.tierName, emoji: course.tierEmoji, courses: [] };
    }
    tiers[course.tierSlug].courses.push(course);
  }

  const toggleCourse = (slug) => {
    setExpandedCourse(expandedCourse === slug ? null : slug);
  };

  const sidebarContent = (
    <div style={{
      padding: '20px 16px',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <Link href="/academy/" style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
        padding: '0 4px',
      }}>
        <span style={{
          fontSize: '20px',
          background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
        }}>
          Like One
        </span>
        <span style={{ color: '#737373', fontSize: '13px' }}>Academy</span>
      </Link>

      {/* Tier sections */}
      {Object.entries(tiers).map(([tierSlug, tier]) => (
        <div key={tierSlug} style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#737373',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '0 4px',
            marginBottom: '8px',
          }}>
            {tier.emoji} {tier.name}
          </div>

          {tier.courses.map(course => {
            const isExpanded = expandedCourse === course.slug;
            const isCurrent = currentCourseSlug === course.slug;

            return (
              <div key={course.slug} style={{ marginBottom: '4px' }}>
                {/* Course header */}
                <button
                  onClick={() => toggleCourse(course.slug)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 8px',
                    background: isCurrent ? 'rgba(192,132,252,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isCurrent ? '#e5e5e5' : '#a0a0a0',
                    fontSize: '13px',
                    fontWeight: isCurrent ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{course.emoji}</span>
                  <span style={{ flex: 1, lineHeight: 1.3 }}>{course.title}</span>
                  <span style={{
                    fontSize: '10px',
                    color: '#525252',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                  }}>
                    ▶
                  </span>
                </button>

                {/* Lesson list */}
                {isExpanded && (
                  <div style={{
                    paddingLeft: '20px',
                    marginTop: '4px',
                  }}>
                    {course.lessons.map(lesson => {
                      const isActive = currentLessonSlug === lesson.slug;
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/academy/${course.slug}/${lesson.slug}/`}
                          style={{
                            display: 'block',
                            padding: '6px 12px',
                            fontSize: '12px',
                            color: isActive ? '#c084fc' : '#737373',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            background: isActive ? 'rgba(192,132,252,0.08)' : 'transparent',
                            borderLeft: isActive ? '2px solid #c084fc' : '2px solid transparent',
                            transition: 'all 0.15s ease',
                            lineHeight: 1.4,
                          }}
                        >
                          {lesson.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1001,
          background: 'linear-gradient(135deg, #c084fc, #38bdf8)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          color: '#08080a',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(192,132,252,0.3)',
        }}
        className="sidebar-toggle"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#0a0a0f',
          borderRight: '1px solid #1e1e28',
          overflowY: 'auto',
        }}
        className={`academy-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; align-items: center; justify-content: center; }
          .academy-sidebar {
            position: fixed !important;
            left: -280px;
            z-index: 1000;
            transition: left 0.3s ease;
          }
          .academy-sidebar.sidebar-open {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
