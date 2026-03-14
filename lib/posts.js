import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'content/posts');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content };
  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let val = rest.join(':').trim().replace(/^["']|["']$/g, '');
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      frontmatter[key.trim()] = val;
    }
  });
  return { data: frontmatter, content: match[2] };
}

function markdownToHtml(md) {
  return md
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/(^[\*\-] .+\n?)+/gm, match => {
      const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[\*\-] /, '')}</li>`).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/(^\d+\. .+\n?)+/gm, match => {
      const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
      return `<ol>${items}</ol>`;
    })
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')
    .replace(/\n{3,}/g, '\n\n');
}

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const { data } = parseFrontmatter(raw);
      return {
        slug: data.slug || filename.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        author: data.author || 'Like One',
        excerpt: data.excerpt || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  if (!fs.existsSync(postsDir)) return null;
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data, content } = parseFrontmatter(raw);
    const postSlug = data.slug || filename.replace('.md', '');
    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title || 'Untitled',
        date: data.date || '',
        author: data.author || 'Like One',
        excerpt: data.excerpt || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        html: markdownToHtml(content),
      };
    }
  }
  return null;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
