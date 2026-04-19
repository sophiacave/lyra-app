import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const artistsDirectory = path.join(process.cwd(), 'content/artists');

export function getAllArtists() {
  if (!fs.existsSync(artistsDirectory)) return [];

  const filenames = fs.readdirSync(artistsDirectory).filter(f => f.endsWith('.md'));

  const artists = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(artistsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (!data.name || data.status === 'draft') return null;

    return {
      slug,
      name: data.name,
      tagline: data.tagline || '',
      origin: data.origin || '',
      genres: data.genres || [],
      image: data.image || null,
      socials: data.socials || {},
      featured: data.featured || false,
    };
  }).filter(Boolean);

  return artists.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
}

export function getAllArtistSlugs() {
  if (!fs.existsSync(artistsDirectory)) return [];
  return fs
    .readdirSync(artistsDirectory)
    .filter(f => f.endsWith('.md'))
    .filter(f => {
      const fullPath = path.join(artistsDirectory, f);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.name && data.status !== 'draft';
    })
    .map(f => f.replace(/\.md$/, ''));
}

export async function getArtistBySlug(slug) {
  const fullPath = path.join(artistsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  if (!data.name) return null;

  const processed = await remark().use(html).process(content);

  return {
    slug,
    name: data.name,
    tagline: data.tagline || '',
    origin: data.origin || '',
    genres: data.genres || [],
    image: data.image || null,
    socials: data.socials || {},
    tracks: data.tracks || [],
    featured: data.featured || false,
    status: data.status || 'live',
    contentHtml: String(processed),
  };
}
