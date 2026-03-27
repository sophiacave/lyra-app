import { getLesson, getCourse, getAllCourseSlugs, getLessonSlugs } from '../../../../lib/courses';
import { notFound } from 'next/navigation';
import LessonNav from '../../../components/academy/LessonNav';
import LessonComplete from '../../../components/academy/LessonComplete';
import LessonSplitView from '../../../components/console/LessonSplitView';
import { site } from '@/lib/site-config';
import fs from 'fs';
import path from 'path';

function getExercises(courseSlug, lessonSlug) {
  try {
    const filePath = path.join(process.cwd(), 'content/exercises', `${courseSlug}.json`);
    if (!fs.existsSync(filePath)) return [];
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data[lessonSlug] || [];
  } catch { return []; }
}

export async function generateStaticParams() {
  const courseSlugs = getAllCourseSlugs();
  const params = [];

  for (const courseSlug of courseSlugs) {
    const lessonSlugs = getLessonSlugs(courseSlug);
    for (const lessonSlug of lessonSlugs) {
      params.push({ courseSlug, lessonSlug });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLesson(courseSlug, lessonSlug);
  if (!lesson) return {};
  const course = getCourse(courseSlug);
  const courseTitle = course?.title || 'Like One Academy';
  const title = `${lesson.title} — ${courseTitle} — Like One`;
  const description = `Learn ${lesson.title.toLowerCase()} in the ${courseTitle} course. Free AI education from Like One Academy.`;
  const url = `${site.url}/academy/${courseSlug}/${lessonSlug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: 'article',
      images: [{ url: site.ogImage, ...site.ogImageSize }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [site.ogImage],
    },
  };
}

export default async function LessonPage({ params }) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await getLesson(courseSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const course = getCourse(courseSlug);

  // Build the lesson content HTML with breadcrumb, completion, and nav appended
  const breadcrumbHtml = `
    <div class="glass glass-animate-up academy-breadcrumb">
      <a href="/academy/${courseSlug}/" class="academy-breadcrumb-link">
        ${course?.emoji || ''} ${course?.title || ''}
      </a>
      <span class="academy-breadcrumb-sep">›</span>
      <span class="academy-breadcrumb-current">Lesson ${lesson.order}</span>
    </div>
  `;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: `${lesson.title} lesson from ${course?.title || 'Like One Academy'}`,
    provider: { '@type': 'Organization', name: 'Like One', url: site.url },
    isPartOf: {
      '@type': 'Course',
      name: course?.title,
      url: `${site.url}/academy/${courseSlug}/`,
    },
    educationalLevel: course?.difficulty || 'beginner',
    isAccessibleForFree: lesson.free !== false,
    url: `${site.url}/academy/${courseSlug}/${lessonSlug}/`,
  };

  const fullContentHtml = breadcrumbHtml + lesson.contentHtml;
  const exercises = getExercises(courseSlug, lessonSlug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <link rel="stylesheet" href="/academy/shared/academy.css" />

      <LessonSplitView
        contentHtml={fullContentHtml}
        lessonTitle={lesson.title}
        exercises={exercises}
        isFree={lesson.free !== false}
        courseSlug={courseSlug}
      />

      {/* Completion + nav below the split view on mobile */}
      <div className="lo-split-footer">
        <LessonComplete courseSlug={courseSlug} lessonSlug={lessonSlug} />
        <LessonNav
          courseSlug={courseSlug}
          prev={lesson.prev}
          next={lesson.next}
          courseTitle={course?.title}
        />
      </div>
    </>
  );
}
