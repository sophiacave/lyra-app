'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AcademySidebar({ courses, currentCourseSlug, currentLessonSlug }) {
  const pathname = usePathname();
  const [expandedCourse, setExpandedCourse] = useState(currentCourseSlug || null);
  const [isOpen, setIsOpen] = useState(false);

  const liveCourses = courses.filter(c => c.status === 'live');

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
    <div className="glass-scroll academy-sidebar-content">
      {/* Logo */}
      <Link href="/academy/" className="academy-sidebar-logo">
        <span className="academy-sidebar-logo-text">Like One</span>
        <span className="academy-sidebar-logo-sub">Academy</span>
      </Link>

      {/* Tier sections */}
      {Object.entries(tiers).map(([tierSlug, tier]) => (
        <div key={tierSlug} className="academy-tier-section">
          <div className="academy-tier-label">
            {tier.emoji} {tier.name}
          </div>

          {tier.courses.map(course => {
            const isExpanded = expandedCourse === course.slug;
            const isCurrent = currentCourseSlug === course.slug;

            return (
              <div key={course.slug}>
                <button
                  onClick={() => toggleCourse(course.slug)}
                  className={`academy-nav-btn ${isCurrent ? 'current' : ''}`}
                >
                  <span className="academy-nav-emoji">{course.emoji}</span>
                  <span className="academy-nav-title">{course.title}</span>
                  <span className={`academy-nav-chevron ${isExpanded ? 'expanded' : ''}`}>
                    ▶
                  </span>
                </button>

                {isExpanded && (
                  <div className="academy-nav-lessons">
                    {course.lessons.map(lesson => {
                      const isActive = currentLessonSlug === lesson.slug;
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/academy/${course.slug}/${lesson.slug}/`}
                          className={`academy-nav-lesson glass-animate-in ${isActive ? 'active' : ''}`}
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
        className="glass-sidebar-toggle academy-mobile-toggle"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="glass-mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`glass-sidebar glass-sidebar-mobile academy-sidebar-aside ${isOpen ? 'sidebar-open' : ''}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
