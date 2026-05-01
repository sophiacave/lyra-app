import { getLesson, getCourse, getAllCourseSlugs, getLessonSlugs } from '../../../../lib/courses';
import { notFound } from 'next/navigation';
import LessonNav from '../../../components/academy/LessonNav';
import LessonComplete from '../../../components/academy/LessonComplete';
import ImmersiveLesson from '../../../components/console/ImmersiveLesson';
import VideoPlayer from '../../../components/academy/VideoPlayer';
import { site } from '@/lib/site-config';

export const revalidate = 3600;

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
  const description = lesson.description || `Learn ${lesson.title.toLowerCase()} in the ${courseTitle} course. Free AI education from Like One Academy.`;
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Academy', item: `${site.url}/academy/` },
      { '@type': 'ListItem', position: 3, name: course?.title || 'Course', item: `${site.url}/academy/${courseSlug}/` },
      { '@type': 'ListItem', position: 4, name: lesson.title, item: `${site.url}/academy/${courseSlug}/${lessonSlug}/` },
    ],
  };

  // For paid lessons, ship a preview for SEO but preserve interactive components
  // (quizzes, flash cards) — the client-side gate handles access control
  const isPaid = lesson.free === false;
  const isInteractive = lesson.type === 'quiz' || lesson.type === 'assessment';
  let fullContentHtml;
  if (isPaid && !isInteractive) {
    const html = lesson.contentHtml;

    // Extract data-learn components (quizzes, flash cards) before truncation
    const learnComponentRe = /<div\s+data-learn="[^"]*"(?:\s+data-props='[^']*')?\s*>\s*<\/div>/g;
    const learnComponents = [];
    let learnMatch;
    while ((learnMatch = learnComponentRe.exec(html)) !== null) {
      learnComponents.push(learnMatch[0]);
    }

    // Smart truncation: cut at complete section boundaries, never mid-tag
    const headingRegex = /<h[23][^>]*>/g;
    const headingPositions = [];
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      headingPositions.push(match.index);
    }

    let preview;
    if (headingPositions.length <= 1) {
      const scriptIdx = html.indexOf('<script');
      const cutPoint = scriptIdx > 0 ? scriptIdx : Math.floor(html.length * 0.4);
      preview = html.slice(0, cutPoint);
    } else {
      const targetIdx = Math.max(2, Math.ceil(headingPositions.length * 0.4));
      let cutAt = headingPositions[Math.min(targetIdx, headingPositions.length - 1)];
      const searchRegion = html.slice(Math.max(0, cutAt - 200), cutAt);
      const lastDivOpen = searchRegion.lastIndexOf('<div');
      if (lastDivOpen >= 0) {
        cutAt = Math.max(0, cutAt - 200) + lastDivOpen;
      }
      preview = html.slice(0, cutAt);
    }

    // Strip any trailing incomplete tags
    preview = preview.replace(/<[^>]*$/, '');
    const lastScriptOpen = preview.lastIndexOf('<script');
    const lastScriptClose = preview.lastIndexOf('</script>');
    if (lastScriptOpen > lastScriptClose) {
      preview = preview.slice(0, lastScriptOpen);
    }

    // Remove any learn components already in the preview (avoid duplicates)
    learnComponents.forEach(lc => {
      preview = preview.replace(lc, '');
    });

    // Re-append all learn components after the preview
    fullContentHtml = breadcrumbHtml + preview + '\n' + learnComponents.join('\n');
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <link rel="stylesheet" href="/academy/shared/academy.css" />
      <link rel="stylesheet" href="/academy/shared/learn-components.css" />

      <ImmersiveLesson
        contentHtml={fullContentHtml}
        lessonTitle={lesson.title}
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
