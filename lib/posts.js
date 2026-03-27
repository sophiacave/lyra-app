import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

function normalizeDate(d) {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString().split('T')[0];
  return String(d);
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Skip posts with no valid frontmatter title
    if (!data.title) return null;

    return {
      slug,
      title: data.title,
      date: normalizeDate(data.date),
      excerpt: data.excerpt || data.description || '',
      author: data.author || '',
      tags: data.tags || [],
    };
  }).filter(Boolean);

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  if (!data.title) return null;

  const processed = await remark().use(html).process(content);
  // Strip the first H1 from rendered HTML — the page template already renders <h1>
  const contentHtml = processed.toString().replace(/^<h1[^>]*>.*?<\/h1>\s*/i, '');

  return {
    slug,
    title: data.title,
    date: normalizeDate(data.date),
    excerpt: data.excerpt || data.description || '',
    author: data.author || '',
    tags: data.tags || [],
    contentHtml,
  };
}

export function getAllSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter(f => f.endsWith('.md'))
    .filter(f => {
      const fullPath = path.join(postsDirectory, f);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return !!data.title;
    })
    .map(f => f.replace(/\.md$/, ''));
}
