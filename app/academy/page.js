import { getAllCourses } from '../../lib/courses';
import { site } from '@/lib/site-config';
import AcademyCatalogClient from '../components/academy/AcademyCatalogClient';
import coursesData from '../../content/academy/courses.json';

export const metadata = {
  title: 'Free AI Courses — Claude, Prompts & Automation | Like One',
  description: '30 free AI courses with 300+ interactive lessons. Master Claude, prompt engineering, AI agents, RAG, MCP, and automation. Beginner to advanced. No credit card required.',
  alternates: { canonical: `${site.url}/academy/` },
  openGraph: {
    title: 'Free AI Courses — Learn Claude, Prompt Engineering & Automation',
    description: '30 free AI courses, 300+ interactive lessons. Master Claude, prompt engineering, AI agents, and automation. Start free today.',
    url: `${site.url}/academy/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Courses — Like One Academy',
    description: '30 courses, 300+ lessons. Claude, prompt engineering, AI agents, automation. Free to start.',
    images: [site.ogImage],
  },
};

export default function AcademyPage() {
  // Server-side: compute lesson counts from filesystem
  const computedCourses = getAllCourses();

  // Build tier structure with lesson counts included
  const tiers = coursesData.tiers.map(tier => ({
    ...tier,
    courses: tier.courses.map(c => {
      const computed = computedCourses.find(cc => cc.slug === c.slug);
      return {
        ...c,
        lessonCount: computed?.lessonCount || 0,
        lessons: computed?.lessons || [],
      };
    }),
  }));

  // Flat list with tier info for filtering
  const allCourses = tiers.flatMap(tier =>
    tier.courses.map(c => ({
      ...c,
      tierName: tier.name,
      tierSlug: tier.slug,
      tierEmoji: tier.emoji,
    }))
  );

  const liveCourses = allCourses.filter(c => c.status === 'live');
  const totalLessons = liveCourses.reduce((sum, c) => sum + c.lessonCount, 0);

  const courseListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Like One Academy',
    description: `${liveCourses.length} free AI courses, ${totalLessons}+ interactive lessons.`,
    url: `${site.url}/academy/`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'AI Courses',
      numberOfItems: liveCourses.length,
      itemListElement: liveCourses.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        url: `${site.url}/academy/${c.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListJsonLd) }}
      />
      <AcademyCatalogClient
        tiers={tiers}
        allCourses={allCourses}
        totalLessons={totalLessons}
      />
    </>
  );
}
