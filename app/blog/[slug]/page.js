import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { getAllCourses } from '@/lib/courses';
import SubscribeForm from '@/app/components/SubscribeForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { site, academy } from '@/lib/site-config';
import { notFound } from 'next/navigation';

// Revalidate daily so date-gated posts appear on their publish date
export const revalidate = 86400;

const TAG_COURSE_MAP = {
  '2026': ['ai-foundations', 'ai-for-business'],
  'academy-launch': ['claude-for-beginners', 'ai-foundations', 'ai-for-business'],
  'advanced': ['advanced-prompt-engineering', 'claude-mastery'],
  'agent': ['first-ai-agent', 'multi-agent-orchestration'],
  'agents': ['first-ai-agent', 'multi-agent-orchestration'],
  'ai': ['ai-foundations', 'claude-for-beginners'],
  'ai-accessibility': ['ai-foundations', 'ai-ethics-and-safety'],
  'ai-adoption': ['ai-for-business', 'ai-for-executives'],
  'ai-agents': ['first-ai-agent', 'multi-agent-orchestration'],
  'ai-automation': ['automation-architect', 'ai-powered-workflows'],
  'ai-business': ['ai-for-business', 'ai-for-sales'],
  'ai-comparison': ['ai-stack-builder', 'ai-foundations'],
  'ai-content': ['ai-content-studio', 'content-generation-pipeline'],
  'ai-courses': ['claude-for-beginners', 'ai-foundations'],
  'ai-education': ['claude-for-beginners', 'ai-foundations'],
  'ai-fluency': ['ai-foundations', 'claude-for-beginners'],
  'ai-literacy': ['ai-foundations', 'claude-for-beginners'],
  'ai-memory': ['rag-vector-search', 'the-convergence-lab'],
  'ai-productivity': ['ai-for-personal-productivity', 'ai-powered-workflows'],
  'ai-strategy': ['ai-for-executives', 'ai-enterprise-strategy'],
  'ai-tools': ['ai-stack-builder', 'ai-for-business'],
  'ai-workflow': ['ai-powered-workflows', 'automation-architect'],
  'ai-workflows': ['ai-powered-workflows', 'automation-architect'],
  'ai-writing': ['ai-content-studio', 'prompt-writing-101'],
  'announcement': ['ai-foundations', 'claude-for-beginners'],
  'audio': ['ai-voice-audio'],
  'automation': ['automation-architect', 'ai-powered-workflows', 'the-automation-lab'],
  'beginner': ['claude-for-beginners', 'ai-foundations'],
  'beginners': ['claude-for-beginners', 'ai-foundations'],
  'behind-the-scenes': ['the-convergence-lab', 'ai-infrastructure'],
  'budget': ['ai-for-business', 'ai-stack-builder'],
  'business': ['ai-for-business'],
  'business-analysis': ['ai-for-data-analysis', 'ai-for-business'],
  'business-automation': ['automation-architect', 'ai-powered-workflows'],
  'business-costs': ['ai-for-business', 'ai-for-executives'],
  'business-transformation': ['ai-for-executives', 'ai-enterprise-strategy'],
  'career-development': ['ai-for-personal-productivity', 'ai-foundations'],
  'ceo': ['ai-for-executives', 'ai-enterprise-strategy'],
  'chatgpt': ['claude-for-beginners', 'claude-mastery'],
  'claude': ['claude-for-beginners', 'claude-mastery'],
  'claude-code': ['claude-mastery', 'claude-for-beginners'],
  'client-experience': ['ai-for-sales', 'ai-powered-workflows'],
  'company-culture': ['ai-for-executives', 'ai-enterprise-strategy'],
  'comparison': ['ai-stack-builder'],
  'competitive-advantage': ['ai-for-business', 'ai-enterprise-strategy'],
  'compliance': ['ai-ethics-and-safety', 'ai-enterprise-strategy'],
  'content': ['ai-content-studio', 'content-generation-pipeline'],
  'content-business': ['ai-content-studio', 'building-ai-products'],
  'content-marketing': ['ai-content-studio', 'content-generation-pipeline'],
  'conversion': ['ai-for-sales', 'ai-for-marketing'],
  'cost-cutting': ['ai-for-business', 'ai-for-executives'],
  'cost-savings': ['ai-for-business', 'ai-for-executives'],
  'craft-framework': ['advanced-prompt-engineering', 'prompt-writing-101'],
  'creative': ['ai-for-creatives', 'ai-images-and-video'],
  'data': ['ai-for-data-analysis'],
  'decision-making': ['ai-for-executives', 'ai-for-data-analysis'],
  'developer-tools': ['ai-stack-builder', 'ai-infrastructure'],
  'email': ['ai-for-marketing', 'ai-powered-workflows'],
  'entrepreneurship': ['ai-for-business', 'building-ai-products'],
  'ethics': ['ai-ethics-and-safety'],
  'executive': ['ai-for-executives', 'ai-enterprise-strategy'],
  'founder-story': ['building-ai-products', 'ai-for-business'],
  'frameworks': ['advanced-prompt-engineering', 'prompt-writing-101'],
  'free-courses': ['claude-for-beginners'],
  'freelancer': ['ai-for-business', 'ai-for-personal-productivity'],
  'freelancing': ['ai-for-business', 'ai-for-personal-productivity'],
  'future-of-work': ['ai-for-executives', 'ai-foundations'],
  'gemini': ['claude-for-beginners'],
  'governance': ['ai-ethics-and-safety', 'ai-enterprise-strategy'],
  'guide': ['claude-for-beginners', 'ai-foundations'],
  'images': ['ai-images-and-video'],
  'inclusion': ['ai-ethics-and-safety', 'ai-foundations'],
  'leadership': ['ai-for-executives', 'ai-enterprise-strategy'],
  'make-com': ['automation-architect', 'the-automation-lab'],
  'make.com': ['automation-architect', 'the-automation-lab'],
  'marketing': ['ai-for-marketing', 'ai-content-studio'],
  'mcp': ['mcp-masterclass'],
  'meetings': ['ai-for-personal-productivity', 'ai-project-management'],
  'no-code': ['automation-architect', 'ai-powered-workflows'],
  'onboarding': ['ai-powered-workflows', 'automation-architect'],
  'passive-income': ['building-ai-products', 'content-generation-pipeline'],
  'persistent-ai': ['rag-vector-search', 'the-convergence-lab'],
  'personal': ['ai-for-personal-productivity'],
  'personal-brand': ['ai-content-studio', 'ai-for-marketing'],
  'productivity': ['ai-for-personal-productivity'],
  'project-management': ['ai-project-management'],
  'projects': ['claude-mastery', 'ai-project-management'],
  'prompt': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'prompt-engineering': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'prompting': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'prompts': ['prompt-writing-101', 'advanced-prompt-engineering'],
  'quick-start': ['claude-for-beginners', 'ai-foundations'],
  'rag': ['rag-vector-search'],
  'revenue': ['ai-for-sales', 'building-ai-products'],
  'roadmap': ['ai-for-business', 'ai-for-executives'],
  'roi': ['ai-for-business', 'ai-for-executives'],
  'sales': ['ai-for-sales'],
  'scaling': ['ai-enterprise-strategy', 'building-ai-products'],
  'second-brain': ['rag-vector-search', 'the-convergence-lab'],
  'seo': ['ai-for-marketing', 'ai-content-studio'],
  'small-business': ['ai-for-business'],
  'solopreneur': ['ai-for-business', 'ai-powered-workflows'],
  'strategy': ['ai-for-executives', 'ai-enterprise-strategy'],
  'supabase': ['ai-stack-builder', 'ai-infrastructure'],
  'tdov': ['ai-ethics-and-safety'],
  'team-building': ['ai-for-executives', 'ai-project-management'],
  'team-productivity': ['ai-project-management', 'ai-for-personal-productivity'],
  'tech-stack': ['ai-stack-builder', 'ai-infrastructure'],
  'templates': ['prompt-writing-101', 'ai-powered-workflows'],
  'tools': ['ai-stack-builder', 'ai-for-business'],
  'trans-visibility': ['ai-ethics-and-safety'],
  'transformation': ['ai-for-executives', 'ai-enterprise-strategy'],
  'tutorial': ['claude-for-beginners', 'ai-foundations'],
  'video': ['ai-images-and-video', 'ai-voice-audio'],
  'virtual-assistant': ['first-ai-agent', 'ai-powered-workflows'],
  'vision': ['ai-foundations', 'the-convergence-lab'],
  'workflow': ['ai-powered-workflows', 'automation-architect'],
  'workflows': ['ai-powered-workflows', 'automation-architect'],
  'writing': ['ai-content-studio', 'prompt-writing-101'],
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

function estimateReadTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 238));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readTime = estimateReadTime(post.contentHtml);

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
          author: {
            '@type': 'Person',
            name: post.author || 'Sophia Cave',
            url: `${site.url}/about/`,
          },
          publisher: { '@type': 'Organization', name: 'Like One', url: site.url },
          url: `${site.url}/blog/${slug}/`,
          mainEntityOfPage: `${site.url}/blog/${slug}/`,
          wordCount: post.contentHtml ? post.contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0,
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog/` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${site.url}/blog/${slug}/` },
          ],
        }) }}
      />
      {post.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faq.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }) }}
        />
      )}

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
          <span className="post-header-dot">&middot;</span>
          <span className="post-header-readtime">{readTime} min read</span>
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
        <Link href="/blog/" className="post-footer-back">
          &larr; Back to all posts
        </Link>
      </footer>

      <Footer variant="blog" />
    </div>
  );
}
