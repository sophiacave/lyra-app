import { getAllPosts, formatDate } from '../../lib/posts';

export const metadata = {
  title: 'Blog — Like One AI Automation Studio',
  description: 'Insights, stories, and behind-the-scenes from Like One. AI automation, entrepreneurship, and building with agents.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Blog — Like One AI Automation Studio</title>
        <meta name="description" content="Insights, stories, and behind-the-scenes from Like One." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      </head>
      <body>
        <header>
          <div className="c">
            <nav>
              <a href="/home.html" className="logo">Like One</a>
              <button className="mb" id="mb">&#9776;</button>
              <ul id="nm">
                <li><a href="/home.html#services">Services</a></li>
                <li><a href="/home.html#products">Products</a></li>
                <li><a href="/home.html#academy">Academy</a></li>
                <li><a href="/blog" className="active">Blog</a></li>
                <li><a href="/home.html#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <section className="hero">
          <div className="c">
            <div className="hero-badge">✍️ From the Studio</div>
            <h1>The <span className="g">Like One</span> Blog</h1>
            <p>Behind the scenes of building an AI-native company. Real stories, real systems, real results.</p>
          </div>
        </section>

        <section className="posts-section">
          <div className="c">
            {posts.length === 0 ? (
              <div className="empty">
                <p>First post coming soon. Nova is writing.</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map((post, i) => (
                  <article key={post.slug} className={`post-card ${i === 0 ? 'featured' : ''}`}>
                    <div className="post-meta">
                      <span className="post-date">{formatDate(post.date)}</span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="post-tags">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <h2 className="post-title">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-footer">
                      <span className="post-author">By {post.author}</span>
                      <a href={`/blog/${post.slug}`} className="read-more">Read more →</a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer>
          <div className="c">
            <div className="fc">
              <div className="fs">
                <h3>Like One</h3>
                <p>AI Automation Studio helping businesses unlock the power of artificial intelligence.</p>
              </div>
              <div className="fs">
                <h3>Quick Links</h3>
                <p><a href="/home.html#services">Services</a></p>
                <p><a href="/home.html#products">Products</a></p>
                <p><a href="/blog">Blog</a></p>
              </div>
              <div className="fs">
                <h3>Connect</h3>
                <p><a href="mailto:sophiacave.me@gmail.com">sophiacave.me@gmail.com</a></p>
              </div>
            </div>
            <div className="fb">
              <p>© 2026 Like One - AI Automation Studio. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `document.getElementById('mb').addEventListener('click',()=>document.getElementById('nm').classList.toggle('active'));` }} />
      </body>
    </html>
  );
}

const STYLES = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--p:#e84393;--v:#6c5ce7;--t:#00cec9;--bg:#0a0a0a;--cd:#141414;--tx:#fff;--dm:#e0e0e0;--bd:#1f1f1f}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--tx);line-height:1.6;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(108,92,231,.03)0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(0,206,201,.03)0%,transparent 50%);pointer-events:none;z-index:-1}
.c{max-width:1100px;margin:0 auto;padding:0 1.5rem}
header{position:sticky;top:0;z-index:1000;background:rgba(10,10,10,.95);backdrop-filter:blur(10px);border-bottom:1px solid var(--bd);padding:1.25rem 0}
nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:1.5rem;font-weight:800;background:linear-gradient(135deg,var(--p),var(--t));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none}
nav ul{display:flex;list-style:none;gap:2rem}
nav a{color:var(--dm);text-decoration:none;font-size:.95rem;font-weight:500;transition:color .3s}
nav a:hover,nav a.active{color:var(--p)}
.mb{display:none;background:0 0;border:0;color:var(--tx);font-size:1.5rem;cursor:pointer}
.hero{padding:6rem 1.5rem 4rem;text-align:center;background:linear-gradient(135deg,rgba(232,67,147,.05)0%,rgba(108,92,231,.05)100%)}
.hero-badge{display:inline-block;background:rgba(232,67,147,.1);border:1px solid rgba(232,67,147,.3);color:var(--p);padding:.4rem 1rem;border-radius:20px;font-size:.85rem;font-weight:600;margin-bottom:1.5rem}
.hero h1{font-size:clamp(2rem,6vw,3.5rem);font-weight:800;margin-bottom:1rem;line-height:1.2}
.g{background:linear-gradient(135deg,var(--p),var(--t));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:1.1rem;color:var(--dm);max-width:560px;margin:0 auto}
.posts-section{padding:4rem 1.5rem 6rem}
.posts-grid{display:grid;grid-template-columns:1fr;gap:2rem;max-width:800px;margin:0 auto}
.post-card{background:var(--cd);border:1px solid var(--bd);border-radius:12px;padding:2rem;transition:all .3s}
.post-card:hover{border-color:var(--p);transform:translateY(-4px);box-shadow:0 16px 40px rgba(232,67,147,.1)}
.post-card.featured{border-color:rgba(232,67,147,.3);background:linear-gradient(135deg,rgba(232,67,147,.05),var(--cd))}
.post-meta{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
.post-date{color:var(--t);font-size:.85rem;font-weight:600}
.post-tags{display:flex;gap:.5rem;flex-wrap:wrap}
.tag{color:var(--dm);font-size:.75rem;background:rgba(255,255,255,.06);padding:.2rem .6rem;border-radius:20px}
.post-title{font-size:1.5rem;font-weight:700;margin-bottom:.75rem;line-height:1.3}
.post-title a{color:var(--tx);text-decoration:none;transition:color .3s}
.post-title a:hover{color:var(--p)}
.post-excerpt{color:var(--dm);font-size:.97rem;line-height:1.7;margin-bottom:1.5rem}
.post-footer{display:flex;justify-content:space-between;align-items:center}
.post-author{color:var(--dm);font-size:.85rem}
.read-more{color:var(--t);text-decoration:none;font-size:.9rem;font-weight:600;transition:color .3s}
.read-more:hover{color:var(--p)}
.empty{text-align:center;padding:4rem;color:var(--dm)}
footer{background:var(--cd);border-top:1px solid var(--bd);padding:3rem 1.5rem}
.fc{max-width:1100px;margin:0 auto 2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem}
.fs h3{color:var(--p);font-size:1rem;margin-bottom:.75rem}
.fs p,.fs a{color:var(--dm);font-size:.9rem;line-height:2;text-decoration:none;transition:color .3s}
.fs a:hover{color:var(--p)}
.fb{border-top:1px solid var(--bd);padding-top:2rem;text-align:center;color:var(--dm);font-size:.85rem;max-width:1100px;margin:0 auto}
@media(max-width:768px){nav ul{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;background:var(--cd);border-bottom:1px solid var(--bd)}nav ul.active{display:flex}nav a{display:block;padding:1rem 1.5rem;border-bottom:1px solid var(--bd)}.mb{display:block}.hero{padding:4rem 1rem 3rem}.posts-section{padding:2rem 1rem 4rem}}
`;
