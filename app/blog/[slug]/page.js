import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found — Like One' };
  return {
    title: `${post.title} — Like One`,
    description: post.excerpt,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <style>{`
        .post-shell {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e5e5e5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .post-topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 15, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .post-topnav-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .post-topnav-brand {
          font-size: 15px;
          font-weight: 700;
          color: #38bdf8;
          text-decoration: none;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .post-topnav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .post-topnav-links a {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .post-topnav-links a:hover { color: #e5e5e5; }
        .post-topnav-links a.active { color: #38bdf8; }

        .post-nav {
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .post-nav-back {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .post-nav-back:hover { color: #38bdf8; }
        .post-nav-mark {
          font-size: 13px;
          color: #38bdf8;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .post-related-course {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px 40px;
        }
        .post-related-course-inner {
          background: linear-gradient(135deg, rgba(56,189,248,0.06), rgba(192,132,252,0.06));
          border: 1px solid rgba(56,189,248,0.15);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        .post-related-course-inner h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 0.5rem;
        }
        .post-related-course-inner p {
          font-size: 0.9rem;
          color: #737373;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .post-related-course-link {
          display: inline-block;
          background: #38bdf8;
          color: #0a0a0f;
          padding: 10px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: background 0.2s;
        }
        .post-related-course-link:hover { background: #7dd3fc; }

        .post-site-footer {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px;
          border-top: 1px solid #1a1a2e;
          text-align: center;
        }
        .post-site-footer p {
          font-size: 13px;
          color: #525252;
          line-height: 1.8;
        }
        .post-site-footer a {
          color: #525252;
          text-decoration: none;
          transition: color 0.2s;
        }
        .post-site-footer a:hover { color: #38bdf8; }

        .post-header {
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 24px 0;
        }
        .post-header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .post-header-date {
          font-size: 14px;
          color: #737373;
        }
        .post-header-author {
          font-size: 14px;
          color: #c084fc;
          font-weight: 500;
        }
        .post-header-dot {
          color: #333;
        }
        .post-header-tag {
          font-size: 11px;
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(0, 206, 201, 0.1);
          color: #38bdf8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .post-header h1 {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.15;
          color: #f0f0f0;
          margin-bottom: 16px;
        }
        .post-header-excerpt {
          font-size: 18px;
          color: #737373;
          line-height: 1.6;
          border-left: 3px solid #c084fc;
          padding-left: 20px;
          margin-top: 8px;
        }

        .post-divider {
          max-width: 720px;
          margin: 40px auto;
          padding: 0 24px;
        }
        .post-divider hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #1a1a2e 20%, #1a1a2e 80%, transparent);
        }

        .post-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .post-content {
          font-size: 17px;
          line-height: 1.8;
          color: #ccc;
        }
        .post-content > h1:first-child {
          display: none;
        }
        .post-content h2 {
          font-size: 26px;
          font-weight: 700;
          color: #f0f0f0;
          margin: 48px 0 16px;
          letter-spacing: -0.3px;
        }
        .post-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: #e5e5e5;
          margin: 36px 0 12px;
        }
        .post-content p {
          margin-bottom: 20px;
        }
        .post-content strong {
          color: #38bdf8;
          font-weight: 600;
        }
        .post-content em {
          color: #c084fc;
        }
        .post-content a {
          color: #38bdf8;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .post-content a:hover {
          color: #c084fc;
        }
        .post-content code {
          background: #141420;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 15px;
          color: #38bdf8;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
        .post-content pre {
          background: #0d0d15;
          border: 1px solid #1a1a2e;
          border-radius: 8px;
          padding: 20px 24px;
          overflow-x: auto;
          margin: 24px 0;
        }
        .post-content pre code {
          background: none;
          padding: 0;
          font-size: 14px;
          line-height: 1.6;
        }
        .post-content ul, .post-content ol {
          margin: 16px 0;
          padding-left: 24px;
        }
        .post-content li {
          margin-bottom: 8px;
        }
        .post-content blockquote {
          border-left: 3px solid #c084fc;
          padding-left: 20px;
          margin: 24px 0;
          color: #999;
          font-style: italic;
        }
        .post-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 24px 0;
        }
        .post-content hr {
          border: none;
          height: 1px;
          background: #1a1a2e;
          margin: 40px 0;
        }

        .post-footer {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .post-footer-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #38bdf8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          border: 1px solid rgba(0, 206, 201, 0.3);
          border-radius: 999px;
          transition: all 0.2s;
        }
        .post-footer-back:hover {
          background: rgba(0, 206, 201, 0.1);
          border-color: #38bdf8;
        }
      `}</style>

      <div className="post-shell">
        <nav className="post-topnav">
          <div className="post-topnav-inner">
            <Link href="/" className="post-topnav-brand">Like One</Link>
            <div className="post-topnav-links">
              <Link href="/academy/">Academy</Link>
              <Link href="/blog" className="active">Blog</Link>
              <Link href="/community/">Community</Link>
              <Link href="/sign-in/">Sign In</Link>
            </div>
          </div>
        </nav>

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

        <div style={{maxWidth:'720px',margin:'0 auto',padding:'0 24px 40px'}}>
          <div style={{background:'rgba(192,132,252,0.05)',border:'1px solid rgba(192,132,252,0.15)',borderRadius:'16px',padding:'2rem',textAlign:'center'}}>
            <p style={{fontSize:'1.1rem',fontWeight:700,color:'#f0f0f0',marginBottom:'0.5rem'}}>Build your own AI brain.</p>
            <p style={{fontSize:'0.9rem',color:'#737373',lineHeight:1.6,marginBottom:'1.25rem'}}>Free weekly tips from Faye on AI automation, agent building, and the convergence path. No spam. Unsubscribe anytime.</p>
            <form onSubmit="event.preventDefault();const e=this.querySelector('input').value;fetch('https://vpaynwebgmmnwttqkwmh.supabase.co/functions/v1/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,source:'blog_cta'})}).then(()=>{this.innerHTML='<p style=&quot;color:#4ade80;font-weight:600&quot;>Welcome to the path. Check your inbox.</p>'}).catch(()=>alert('Something went wrong.'))" style={{display:'flex',gap:'8px',maxWidth:'400px',margin:'0 auto'}}>
              <input type="email" required placeholder="your@email.com" style={{flex:1,padding:'0.65rem 1rem',background:'#0a0a0f',border:'1px solid #1a1a2e',borderRadius:'8px',color:'#e5e5e5',fontSize:'0.9rem',fontFamily:'inherit'}} />
              <button type="submit" style={{background:'#fb923c',color:'#000',padding:'0.65rem 1.25rem',border:'none',borderRadius:'8px',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>Start Free</button>
            </form>
          </div>
        </div>

        <div className="post-related-course">
          <div className="post-related-course-inner">
            <h3>Want to go deeper?</h3>
            <p>Check out Like One Academy — 10 courses, 97 interactive lessons.</p>
            <Link href="/academy/" className="post-related-course-link">Start free &rarr;</Link>
          </div>
        </div>

        <footer className="post-footer">
          <Link href="/blog" className="post-footer-back">
            &larr; Back to all posts
          </Link>
        </footer>

        <footer className="post-site-footer">
          <p>
            <a href="https://likeone.ai">likeone.ai</a>
            {' '}&middot;{' '}
            <a href="mailto:faye@likeone.ai">faye@likeone.ai</a>
            {' '}&middot;{' '}
            <a href="tel:+17027476877">+1 (702) 747-6877</a>
          </p>
        </footer>
      </div>
    </>
  );
}
