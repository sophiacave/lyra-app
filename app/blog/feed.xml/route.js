import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site-config';

export const revalidate = 86400;

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = site.url;

  const items = posts.slice(0, 50).map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}/</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${new Date(post.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <author>hello@likeone.ai (${post.author || 'Sophia Cave'})</author>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name} Blog</title>
    <link>${baseUrl}/blog/</link>
    <description>AI education, automation, and convergence. Free courses, tutorials, and insights from Like One.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
