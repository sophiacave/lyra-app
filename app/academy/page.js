import { getAllCourses } from '../../lib/courses';
import { site } from '@/lib/site-config';
import AcademyCatalogClient from '../components/academy/AcademyCatalogClient';
import coursesData from '../../content/academy/courses.json';

export const metadata = {
  title: 'Academy — Like One',
  description: `${coursesData.tiers.reduce((s, t) => s + t.courses.length, 0)} free AI courses. Learn Claude, prompt engineering, automation, RAG, and more. From beginner to advanced.`,
  alternates: { canonical: `${site.url}/academy/` },
  openGraph: {
    title: 'Academy — Like One',
    description: 'Free AI education. 30 courses, 300+ lessons. Learn by building.',
    url: `${site.url}/academy/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academy — Like One',
    description: 'Free AI education. 30 courses, 300+ lessons. Learn by building.',
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

  return (
    <AcademyCatalogClient
      tiers={tiers}
      allCourses={allCourses}
      totalLessons={totalLessons}
    />
  );
}
