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

        .blog-topnav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 15, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .blog-topnav-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .blog-topnav-brand {
          font-size: 15px;
          font-weight: 700;
          color: #38bdf8;
          text-decoration: none;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .blog-topnav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .blog-topnav-links a {
          color: #737373;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .blog-topnav-links a:hover { color: #e5e5e5; }
        .blog-topnav-links a.active { color: #38bdf8; }

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

        .blog-academy-cta {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .blog-academy-cta-inner {
          background: linear-gradient(135deg, rgba(56,189,248,0.08), rgba(192,132,252,0.08));
          border: 1px solid rgba(56,189,248,0.15);
          border-radius: 12px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .blog-academy-cta-text {
          font-size: 15px;
          color: #e5e5e5;
          font-weight: 500;
        }
        .blog-academy-cta-text span {
          color: #737373;
          font-weight: 400;
        }
        .blog-academy-cta a {
          background: #38bdf8;
          color: #0a0a0f;
          padding: 8px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .blog-academy-cta a:hover { background: #7dd3fc; }

        .blog-site-footer {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px;
          border-top: 1px solid #1a1a2e;
          text-align: center;
        }
        .blog-site-footer p {
          font-size: 13px;
          color: #525252;
          line-height: 1.8;
        }
        .blog-site-footer a {
          color: #525252;
          text-decoration: none;
          transition: color 0.2s;
        }
        .blog-site-footer a:hover { color: #38bdf8; }

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
        <nav className="blog-topnav">
          <div className="blog-topnav-inner">
            <Link href="/" className="blog-topnav-brand">Like One</Link>
            <div className="blog-topnav-links">
              <Link href="/academy/">Academy</Link>
              <Link href="/blog" className="active">Blog</Link>
              <Link href="/community/">Community</Link>
              <Link href="/academy/signin.html">Sign In</Link>
            </div>
          </div>
        </nav>

        <header className="blog-header">
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">
            Faye Cave builds in public. AI automation, autonomous agents, and the convergence path.
          </p>
        </header>

        <div className="blog-academy-cta">
          <div className="blog-academy-cta-inner">
            <p className="blog-academy-cta-text">Like One Academy — <span>10 courses, 97 interactive lessons.</span></p>
            <Link href="/academy/">Free preview &rarr;</Link>
          </div>
        </div>

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

        <div style={{maxWidth:'720px',margin:'0 auto',padding:'0 24px 60px'}}>
          <div style={{background:'rgba(192,132,252,0.05)',border:'1px solid rgba(192,132,252,0.15)',borderRadius:'16px',padding:'2rem',textAlign:'center'}}>
            <p style={{fontSize:'1.1rem',fontWeight:700,color:'#f0f0f0',marginBottom:'0.5rem'}}>Get weekly AI automation tips from Faye.</p>
            <p style={{fontSize:'0.85rem',color:'#737373',lineHeight:1.6,marginBottom:'1rem'}}>No spam. No fake urgency. Just real systems and real results.</p>
            <form onSubmit="event.preventDefault();const e=this.querySelector('input').value;fetch('https://vpaynwebgmmnwttqkwmh.supabase.co/functions/v1/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,source:'blog_listing'})}).then(()=>{this.innerHTML='<p style=&quot;color:#4ade80;font-weight:600&quot;>Welcome. Check your inbox.</p>'}).catch(()=>alert('Try again.'))" style={{display:'flex',gap:'8px',maxWidth:'400px',margin:'0 auto'}}>
              <input type="email" required placeholder="your@email.com" style={{flex:1,padding:'0.65rem 1rem',background:'#0a0a0f',border:'1px solid #1a1a2e',borderRadius:'8px',color:'#e5e5e5',fontSize:'0.9rem',fontFamily:'inherit'}} />
              <button type="submit" style={{background:'#fb923c',color:'#000',padding:'0.65rem 1.25rem',border:'none',borderRadius:'8px',fontWeight:700,fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>Subscribe</button>
            </form>
          </div>
        </div>
        <footer className="blog-site-footer">
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
