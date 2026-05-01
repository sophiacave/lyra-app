import Link from 'next/link';
import { topics } from '../../lib/seo-topics';
import { site } from '@/lib/site-config';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Learn AI — Free Courses by Topic | Like One Academy',
  description: 'Explore AI topics: prompt engineering, AI agents, Claude, automation, RAG, MCP, and more. 52 free courses, 520+ hands-on lessons. Start learning now.',
  alternates: { canonical: `${site.url}/learn/` },
  openGraph: {
    title: 'Learn AI — Free Courses by Topic | Like One Academy',
    description: 'Explore AI topics: prompt engineering, AI agents, Claude, automation, RAG, MCP, and more. 52 free courses, 520+ lessons.',
    url: `${site.url}/learn/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
};

export default function LearnIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Learn AI — Like One Academy',
    description: 'Browse AI learning topics. Free courses on prompt engineering, AI agents, automation, and more.',
    url: `${site.url}/learn/`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topics.length,
      itemListElement: topics.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: `${site.url}/learn/${t.slug}/`,
      })),
    },
  };

  return (
    <div className="site-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header variant="site" />

      <main>
        <section className="site-section-sm">
          <div className="site-container">
            <h1 className="learn-index-h1">Learn AI by Topic</h1>
            <p className="learn-index-desc">
              Pick a topic. Every path includes free courses, hands-on projects, and real skills you can use today.
            </p>
            <div className="learn-topic-grid">
              {topics.map(t => (
                <Link key={t.slug} href={`/learn/${t.slug}/`} className="learn-topic-card glass glass-animate-up">
                  <h2 className="learn-topic-title">{t.title}</h2>
                  <p className="learn-topic-desc">{t.description.slice(0, 140)}...</p>
                  <div className="learn-topic-meta">
                    <span>{t.courses.length} courses</span>
                    <span>{t.faq.length} FAQs</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section-sm text-center">
          <div className="site-container">
            <h2 className="learn-cta-title">Or browse the full catalog</h2>
            <p className="learn-cta-desc">52 courses. 520+ lessons. Free to start.</p>
            <Link href="/academy/" className="site-btn-primary">All Courses</Link>
          </div>
        </section>
      </main>

      <Footer variant="site" />
    </div>
  );
}
