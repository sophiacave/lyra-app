import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import SubscribeForm from '@/app/components/SubscribeForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { site, academy } from '@/lib/site-config';

// Revalidate daily so date-gated posts appear on their publish date
export const revalidate = 86400;

export const metadata = {
  title: `AI Blog — Claude Tips, Automation Guides & Honest Comparisons | Like One`,
  description: 'Practical AI guides by Sophia Cave. Claude vs ChatGPT, prompt engineering, AI automation, writing with AI, and building an AI-native business. No hype, just real systems.',
  alternates: { canonical: `${site.url}/blog/` },
  openGraph: {
    title: `AI Blog — Claude Tips, Automation Guides & Honest Comparisons`,
    description: 'Practical AI guides by Sophia Cave. Claude vs ChatGPT, prompt engineering, AI automation, and building an AI-native business.',
    url: `${site.url}/blog/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `AI Blog — Like One`,
    description: 'Practical AI guides. Claude tips, automation, prompt engineering, and honest tool comparisons.',
    images: [site.ogImage],
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="blog-shell">
      <Header variant="blog" activeLink="/blog" />

      <header className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <p className="blog-subtitle">
          Sophia Cave builds in public. AI automation, autonomous agents, and the convergence path.
        </p>
      </header>

      <div className="blog-academy-cta">
        <div className="blog-academy-cta-inner">
          <p className="blog-academy-cta-text">{academy.ctaText} — <span>{academy.ctaDescription}</span></p>
          <Link href="/academy/">Free preview &rarr;</Link>
        </div>
      </div>

      <main className="blog-list">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">&#9998;</div>
            <p>No posts yet. Sophia is writing the first one.</p>
          </div>
        ) : (
          posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
              <div className="post-meta">
                <span className="post-date">{formatDate(post.date)}</span>
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="post-tag">{tag}</span>
                ))}
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
            </Link>
          ))
        )}
      </main>

      <div className="blog-subscribe-section">
        <div className="blog-subscribe-box">
          <p className="blog-subscribe-title">Get weekly AI automation tips from {site.founder}.</p>
          <p className="blog-subscribe-desc">No spam. No fake urgency. Just real systems and real results.</p>
          <SubscribeForm source="blog_listing" buttonText="Subscribe" />
        </div>
      </div>

      <Footer variant="blog" />
    </div>
  );
}
