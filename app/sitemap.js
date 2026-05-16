import { getAllPosts } from '../lib/posts';
import { getAllCourses } from '../lib/courses';
import { getAllTopicSlugs } from '../lib/seo-topics';

export const revalidate = 86400;

export default function sitemap() {
  const baseUrl = 'https://likeone.ai';

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog/`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/academy/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/learn/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/meet-claude/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/support/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/forum/`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/community-access/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/checklist/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resources/student-loan-rights-checklist/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/calculator/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/impact/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/research/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/claudemd-generator/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/resume-builder/`, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Blog posts
  const posts = getAllPosts();
  const blogPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.date || undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Academy courses and lessons
  const today = new Date().toISOString().split('T')[0];
  const courses = getAllCourses().filter(c => c.status === 'live');
  const coursePages = courses.map(course => ({
    url: `${baseUrl}/academy/${course.slug}/`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const lessonPages = courses.flatMap(course =>
    course.lessons.map(lesson => ({
      url: `${baseUrl}/academy/${course.slug}/${lesson.slug}/`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  );

  // Learn topic pages (programmatic SEO)
  const topicSlugs = getAllTopicSlugs();
  const topicPages = topicSlugs.map(slug => ({
    url: `${baseUrl}/learn/${slug}/`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticPages, ...blogPages, ...coursePages, ...lessonPages, ...topicPages];
}
