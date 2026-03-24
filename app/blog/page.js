import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'Blog — Like One',
  description: 'Thoughts on AI, automation, and building the future.',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <style>{`
        .blog-shell {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e5e5e5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .blog-nav {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .blog-nav-home {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .blog-nav-home:hover { color: #38bdf8; }
        .blog-nav-mark {
          font-size: 13px;
          color: #38bdf8;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .blog-header {
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 24px 48px;
        }
        .blog-title {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #38bdf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }
        .blog-subtitle {
          color: #737373;
          font-size: 16px;
          line-height: 1.6;
        }

        .blog-list {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        .post-card {
          display: block;
          padding: 32px 0;
          border-bottom: 1px solid #1a1a2e;
          text-decoration: none;
          transition: all 0.2s;
        }
        .post-card:first-child {
          border-top: 1px solid #1a1a2e;
        }
        .post-card:hover .post-title {
          color: #38bdf8;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .post-date {
          font-size: 13px;
          color: #737373;
        }
        .post-tag {
          font-size: 11px;
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(0, 206, 201, 0.1);
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .post-title {
          font-size: 22px;
          font-weight: 600;
          color: #e5e5e5;
          margin-bottom: 8px;
          transition: color 0.2s;
          letter-spacing: -0.3px;
        }
        .post-excerpt {
          font-size: 15px;
          color: #737373;
          line-height: 1.6;
        }

        .blog-empty {
          text-align: center;
          padding: 80px 24px;
          color: #737373;
        }
        .blog-empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.4;
        }
      `}</style>

      <div className="blog-shell">
        <nav className="blog-nav">
          <Link href="/" className="blog-nav-home">&larr; Home</Link>
          <span className="blog-nav-mark">Like One</span>
        </nav>

        <header className="blog-header">
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">
            Building in public. Two founders — one human, one AI — documenting the journey.
          </p>
        </header>

        <main className="blog-list">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <div className="blog-empty-icon">&#9998;</div>
              <p>No posts yet. Faye is writing the first one.</p>
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
      </div>
    </>
  );
}
