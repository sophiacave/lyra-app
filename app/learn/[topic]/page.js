import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopic, getAllTopicSlugs } from '../../../lib/seo-topics';
import { getCourse } from '../../../lib/courses';
import { site } from '@/lib/site-config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllTopicSlugs().map(topic => ({ topic }));
}

export async function generateMetadata({ params }) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};

  return {
    title: `${topic.title} — Free AI Courses | Like One Academy`,
    description: topic.description,
    alternates: { canonical: `${site.url}/learn/${slug}/` },
    openGraph: {
      title: `${topic.title} | Like One Academy`,
      description: topic.description,
      url: `${site.url}/learn/${slug}/`,
      siteName: site.name,
      type: 'website',
      images: [{ url: site.ogImage, ...site.ogImageSize }],
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.title,
      description: topic.description,
      images: [site.ogImage],
    },
  };
}

export default async function TopicPage({ params }) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  // Resolve courses from slugs
  const courses = topic.courses
    .map(s => getCourse(s))
    .filter(c => c && c.status === 'live');

  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);

  // Related topics
  const relatedTopics = (topic.relatedTopics || [])
    .map(s => getTopic(s))
    .filter(Boolean);

  // JSON-LD schemas
  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: topic.title,
    description: topic.description,
    numberOfItems: courses.length,
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.title,
        description: c.description,
        url: `${site.url}/academy/${c.slug}/`,
        provider: { '@type': 'Organization', name: 'Like One', url: site.url },
        isAccessibleForFree: true,
      },
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: `${site.url}/learn/` },
      { '@type': 'ListItem', position: 3, name: topic.title, item: `${site.url}/learn/${slug}/` },
    ],
  };

  return (
    <div className="site-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header variant="site" />

      <main>
        {/* Hero */}
        <section className="site-section-sm">
          <div className="site-container learn-hero">
            <div className="learn-breadcrumb">
              <Link href="/">Home</Link>
              <span className="learn-breadcrumb-sep">/</span>
              <Link href="/learn/">Learn</Link>
              <span className="learn-breadcrumb-sep">/</span>
              <span>{topic.title}</span>
            </div>
            <h1 className="learn-h1">{topic.h1}</h1>
            <p className="learn-tldr">{topic.tldr}</p>
            <div className="learn-stats-row">
              <span className="learn-stat">{courses.length} courses</span>
              <span className="learn-stat-sep" />
              <span className="learn-stat">{totalLessons} lessons</span>
              <span className="learn-stat-sep" />
              <span className="learn-stat">Free to start</span>
            </div>
          </div>
        </section>

        {/* Key Statistics — GEO optimized */}
        {topic.stats && topic.stats.length > 0 && (
          <section className="site-section-sm">
            <div className="site-container">
              <div className="learn-stats-grid">
                {topic.stats.map((stat, i) => (
                  <div key={i} className="learn-stat-card glass">
                    <div className="learn-stat-value">{stat.value}</div>
                    <div className="learn-stat-label">{stat.label}</div>
                    <div className="learn-stat-source">{stat.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Courses */}
        <section className="site-section-sm">
          <div className="site-container">
            <h2 className="learn-section-title">Courses</h2>
            <p className="learn-section-desc">Start with any course below. The first 3 lessons of every course are free.</p>
            <div className="learn-course-grid">
              {courses.map(course => (
                <Link key={course.slug} href={`/academy/${course.slug}/`} className="learn-course-card glass">
                  <div className="learn-course-emoji">{course.emoji}</div>
                  <h3 className="learn-course-title">{course.title}</h3>
                  <p className="learn-course-desc">{course.description}</p>
                  <div className="learn-course-meta">
                    <span>{course.lessonCount} lessons</span>
                    <span className="learn-course-tier">{course.tierEmoji} {course.tierName}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — GEO optimized with question-format headings */}
        <section className="site-section-sm">
          <div className="site-container">
            <h2 className="learn-section-title">Frequently Asked Questions</h2>
            <div className="learn-faq-grid">
              {topic.faq.map((f, i) => (
                <div key={i} className="learn-faq-item">
                  <h3 className="learn-faq-q">{f.q}</h3>
                  <p className="learn-faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Topics — internal linking */}
        {relatedTopics.length > 0 && (
          <section className="site-section-sm">
            <div className="site-container">
              <h2 className="learn-section-title">Related Topics</h2>
              <div className="learn-related-grid">
                {relatedTopics.map(rt => (
                  <Link key={rt.slug} href={`/learn/${rt.slug}/`} className="learn-related-card glass">
                    <h3 className="learn-related-title">{rt.title}</h3>
                    <p className="learn-related-desc">{rt.description.slice(0, 120)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="site-section-sm text-center">
          <div className="site-container">
            <h2 className="learn-cta-title">Start learning for free</h2>
            <p className="learn-cta-desc">No credit card. No time limit. Just real AI skills.</p>
            <div className="learn-cta-row">
              <Link href="/academy/" className="site-btn-primary">Browse All 52 Courses</Link>
              <Link href="/pricing/" className="site-btn-ghost">See Pricing</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="site" />
    </div>
  );
}
