import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import SubscribeForm from '@/app/components/SubscribeForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { site, academy } from '@/lib/site-config';
import { notFound } from 'next/navigation';

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

      <div className="post-related-course">
        <div className="post-related-course-inner">
          <h3>Want to go deeper?</h3>
          <p>Check out {academy.ctaText} — {academy.ctaDescription}</p>
          <Link href="/academy/" className="post-related-course-link">Start free &rarr;</Link>
        </div>
      </div>

      <footer className="post-footer">
        <Link href="/blog" className="post-footer-back">
          &larr; Back to all posts
        </Link>
      </footer>

      <Footer variant="blog" />
    </div>
  );
}
