import { getLesson, getCourse, getAllCourseSlugs, getLessonSlugs } from '../../../../lib/courses';
import { notFound } from 'next/navigation';
import LessonNav from '../../../components/academy/LessonNav';
import LessonComplete from '../../../components/academy/LessonComplete';
import ImmersiveLesson from '../../../components/console/ImmersiveLesson';
import VideoPlayer from '../../../components/academy/VideoPlayer';
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

  const exercises = getExercises(courseSlug, lessonSlug);

  // For paid lessons, only ship a preview — full content loads client-side after auth
  // Exception: quiz/assessment lessons need full HTML (including scripts) — gate handles access
  const isPaid = lesson.free === false;
  const isInteractive = lesson.type === 'quiz' || lesson.type === 'assessment';
  let fullContentHtml;
  if (isPaid && !isInteractive) {
    // Smart truncation: cut at complete section boundaries, never mid-tag
    const html = lesson.contentHtml;
    // Find all h2/h3 heading positions in the raw HTML
    const headingRegex = /<h[23][^>]*>/g;
    const headingPositions = [];
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      headingPositions.push(match.index);
    }

    let preview;
    if (headingPositions.length <= 1) {
      // No section structure — take content up to first <script> or 40% of chars
      const scriptIdx = html.indexOf('<script');
      const cutPoint = scriptIdx > 0 ? scriptIdx : Math.floor(html.length * 0.4);
      preview = html.slice(0, cutPoint);
    } else {
      // Take first ~40% of sections (at least 2 headings worth)
      const targetIdx = Math.max(2, Math.ceil(headingPositions.length * 0.4));
      let cutAt = headingPositions[Math.min(targetIdx, headingPositions.length - 1)];
      // Back up to the nearest opening <div before the heading to avoid orphaned labels
      const searchRegion = html.slice(Math.max(0, cutAt - 200), cutAt);
      const lastDivOpen = searchRegion.lastIndexOf('<div');
      if (lastDivOpen >= 0) {
        cutAt = Math.max(0, cutAt - 200) + lastDivOpen;
      }
      preview = html.slice(0, cutAt);
    }

    // Strip any trailing incomplete tags (e.g. "<div class=")
    preview = preview.replace(/<[^>]*$/, '');
    // Never include partial <script> blocks
    const lastScriptOpen = preview.lastIndexOf('<script');
    const lastScriptClose = preview.lastIndexOf('</script>');
    if (lastScriptOpen > lastScriptClose) {
      preview = preview.slice(0, lastScriptOpen);
    }

    fullContentHtml = breadcrumbHtml + preview;
  } else {
    fullContentHtml = breadcrumbHtml + lesson.contentHtml;
  }

  // Convert <script> to <script type="text/x-lesson"> to prevent browser execution
  // during SSR HTML parse. ImmersiveLesson's useEffect will re-activate them client-side.
  fullContentHtml = fullContentHtml.replace(/<script(?=[\s>])/g, '<script type="text/x-lesson"');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <link rel="stylesheet" href="/academy/shared/academy.css" />
      <link rel="stylesheet" href="/academy/shared/learn-components.css" />

      <ImmersiveLesson
        contentHtml={fullContentHtml}
        lessonTitle={lesson.title}
        exercises={exercises}
        isFree={lesson.free !== false}
        courseSlug={courseSlug}
        lessonSlug={lessonSlug}
        prev={lesson.prev}
        next={lesson.next}
        courseTitle={course?.title}
        videoNode={lesson.videoId ? (
          <VideoPlayer videoId={lesson.videoId} title={lesson.title} />
        ) : null}
        completionNode={
          <LessonComplete courseSlug={courseSlug} lessonSlug={lessonSlug} />
        }
        navNode={
          <LessonNav
            courseSlug={courseSlug}
            prev={lesson.prev}
            next={lesson.next}
            courseTitle={course?.title}
          />
        }
      />
    </>
  );
}
