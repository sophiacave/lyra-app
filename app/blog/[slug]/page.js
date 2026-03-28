import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { getAllCourses } from '@/lib/courses';
import SubscribeForm from '@/app/components/SubscribeForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { site, academy } from '@/lib/site-config';
import { notFound } from 'next/navigation';

const TAG_COURSE_MAP = {
  'claude': ['claude-for-beginners', 'claude-mastery'],
  'prompt': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'prompt-engineering': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'automation': ['automation-architect', 'ai-powered-workflows', 'the-automation-lab'],
  'ai-workflow': ['ai-powered-workflows', 'automation-architect'],
  'make-com': ['automation-architect', 'the-automation-lab'],
  'business': ['ai-for-business'],
  'small-business': ['ai-for-business'],
  'marketing': ['ai-for-marketing', 'ai-content-studio'],
  'content': ['ai-content-studio', 'content-generation-pipeline'],
  'creative': ['ai-for-creatives', 'ai-images-and-video'],
  'agent': ['first-ai-agent', 'multi-agent-orchestration'],
  'agents': ['first-ai-agent', 'multi-agent-orchestration'],
  'mcp': ['mcp-masterclass'],
  'rag': ['rag-vector-search'],
  'data': ['ai-for-data-analysis'],
  'sales': ['ai-for-sales'],
  'executive': ['ai-for-executives', 'ai-enterprise-strategy'],
  'productivity': ['ai-for-personal-productivity'],
  'ethics': ['ai-ethics-and-safety'],
  'beginner': ['claude-for-beginners', 'ai-foundations'],
  'ai-tools': ['ai-stack-builder', 'ai-for-business'],
  'comparison': ['ai-stack-builder'],
  'tutorial': ['claude-for-beginners', 'ai-foundations'],
  'images': ['ai-images-and-video'],
  'video': ['ai-images-and-video', 'ai-voice-audio'],
  'audio': ['ai-voice-audio'],
  'project-management': ['ai-project-management'],
  'ai-education': ['claude-for-beginners', 'ai-foundations'],
  'ai-courses': ['claude-for-beginners', 'ai-foundations'],
  'free-courses': ['claude-for-beginners'],
  'academy-launch': ['claude-for-beginners', 'ai-foundations', 'ai-for-business'],
  'solopreneur': ['ai-for-business', 'ai-powered-workflows'],
  'freelancer': ['ai-for-business', 'ai-for-personal-productivity'],
  'governance': ['ai-ethics-and-safety', 'ai-enterprise-strategy'],
  'chatgpt': ['claude-for-beginners', 'claude-mastery'],
  'gemini': ['claude-for-beginners'],
  'onboarding': ['ai-powered-workflows', 'automation-architect'],
  'email': ['ai-for-marketing', 'ai-powered-workflows'],
  'seo': ['ai-for-marketing', 'ai-content-studio'],
  'content-marketing': ['ai-content-studio', 'content-generation-pipeline'],
};

function getRelatedCourses(tags) {
  if (!tags || !tags.length) return [];
  const slugSet = new Set();
  for (const tag of tags) {
    const t = String(tag).toLowerCase().replace(/\s+/g, '-');
    const mapped = TAG_COURSE_MAP[t];
    if (mapped) mapped.forEach(s => slugSet.add(s));
    // Also try the original (with spaces) for direct matches
    const tRaw = String(tag).toLowerCase();
    if (!mapped && TAG_COURSE_MAP[tRaw]) TAG_COURSE_MAP[tRaw].forEach(s => slugSet.add(s));
  }
  if (slugSet.size === 0) return [];
  const allCourses = getAllCourses().filter(c => c.status === 'live');
  return allCourses.filter(c => slugSet.has(c.slug)).slice(0, 3);
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: `Post Not Found — ${site.name}` };
  return {
    title: `${post.title} — ${site.name}`,
    description: post.excerpt,
    alternates: {
      canonical: `${site.url}/blog/${slug}/`,
    },
    openGraph: {
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      url: `${site.url}/blog/${slug}/`,
      type: 'article',
      siteName: site.name,
      images: [{ url: site.ogImage, ...site.ogImageSize, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      images: [site.ogImage],
    },
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function RelatedCourses({ tags }) {
  const courses = getRelatedCourses(tags);
  if (courses.length === 0) {
    return (
      <div className="post-related-course">
        <div className="post-related-course-inner">
          <h3>Want to go deeper?</h3>
          <p>Check out {academy.ctaText} — {academy.ctaDescription}</p>
          <Link href="/academy/" className="post-related-course-link">Start free &rarr;</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="post-related-courses">
      <h3 className="post-related-heading">Related courses</h3>
      <div className="post-related-grid">
        {courses.map(c => (
          <Link key={c.slug} href={`/academy/${c.slug}/`} className="post-related-card">
            <span className="post-related-emoji">{c.emoji}</span>
            <span className="post-related-title">{c.title}</span>
            <span className="post-related-meta">{c.lessonCount} lessons &middot; {c.tierName}</span>
          </Link>
        ))}
      </div>
      <Link href="/academy/" className="post-related-all">Browse all courses &rarr;</Link>
    </div>
  );
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="post-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { '@type': 'Person', name: post.author || 'Sophia Cave' },
          publisher: { '@type': 'Organization', name: 'Like One', url: site.url },
          url: `${site.url}/blog/${slug}/`,
          mainEntityOfPage: `${site.url}/blog/${slug}/`,
        }) }}
      />

      <Header variant="blog" activeLink="/blog" />

      <header className="post-header">
        <div className="post-header-meta">
          <span className="post-header-date">{formatDate(post.date)}</span>
          {post.author && (
            <>
              <span className="post-header-dot">&middot;</span>
              <span className="post-header-author">{post.author}</span>
            </>
          )}
          {post.tags.map(tag => (
            <span key={tag} className="post-header-tag">{tag}</span>
          ))}
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="post-header-excerpt">{post.excerpt}</p>}
      </header>

      <div className="post-divider"><hr /></div>

      <main className="post-body">
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </main>

      <div className="blog-subscribe-section">
        <div className="blog-subscribe-box">
          <p className="blog-subscribe-title">Build your own AI brain.</p>
          <p className="blog-subscribe-desc">Free weekly tips from Sophia on AI automation, agent building, and the convergence path. No spam. Unsubscribe anytime.</p>
          <SubscribeForm source="blog_cta" buttonText="Start Free" />
        </div>
      </div>

      <RelatedCourses tags={post.tags} />

      <footer className="post-footer">
        <Link href="/blog" className="post-footer-back">
          &larr; Back to all posts
        </Link>
      </footer>

      <Footer variant="blog" />
    </div>
  );
}
