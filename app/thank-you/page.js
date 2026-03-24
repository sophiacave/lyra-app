export const metadata = {
  title: 'Welcome to Like One Academy Pro!',
  description: 'Your purchase is confirmed. Sign in to unlock your courses.',
};

export default function ThankYouPage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; }
        .ty-shell {
          min-height: 100vh; background: #0a0a0f; color: #e5e5e5;
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 2rem;
          -webkit-font-smoothing: antialiased;
        }
        .ty-card {
          max-width: 620px; width: 100%; text-align: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px; padding: 3rem 2.5rem;
        }
        .ty-check {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #c084fc, #fb923c);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem; font-size: 36px;
        }
        .ty-title {
          font-size: 28px; font-weight: 700; letter-spacing: -0.5px;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #c084fc, #fb923c);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ty-msg {
          color: #a3a3a3; font-size: 16px; line-height: 1.7;
          margin-bottom: 2rem;
        }
        .ty-msg strong { color: #e5e5e5; }
        .ty-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .ty-btn {
          display: inline-block; padding: 0.75rem 1.75rem; border-radius: 10px;
          font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s;
        }
        .ty-btn-primary {
          background: linear-gradient(135deg, #c084fc, #fb923c); color: #000;
        }
        .ty-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(192,132,252,0.25); }
        .ty-btn-ghost {
          border: 1px solid rgba(255,255,255,0.1); color: #e5e5e5;
        }
        .ty-btn-ghost:hover { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.03); }
        .ty-footer {
          margin-top: 2rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 13px; color: #525252;
        }
        .ty-footer a { color: #c084fc; text-decoration: none; }
        .ty-footer a:hover { text-decoration: underline; }
        .ty-signin-box {
          background: rgba(192,132,252,0.08); border: 2px solid rgba(192,132,252,0.3);
          border-radius: 14px; padding: 1.5rem; margin-bottom: 2rem;
        }
        .ty-signin-box p { color: #d4d4d4; font-size: 14px; line-height: 1.6; margin-bottom: 1rem; }
        .ty-signin-box .ty-signin-label {
          font-size: 18px; font-weight: 700; color: #e5e5e5; margin-bottom: 0.5rem;
        }
        .ty-signin-box .ty-signin-note {
          font-size: 13px; color: #a78bfa; font-weight: 500;
        }
        .ty-section-title {
          font-size: 16px; font-weight: 600; color: #e5e5e5;
          margin-bottom: 1rem; text-align: left;
        }
        .ty-courses {
          display: grid; grid-template-columns: 1fr; gap: 0.75rem;
          margin-bottom: 2rem; text-align: left;
        }
        @media (min-width: 480px) {
          .ty-courses { grid-template-columns: 1fr 1fr 1fr; }
        }
        .ty-course {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 1.25rem; text-decoration: none;
          transition: all 0.2s; display: block;
        }
        .ty-course:hover {
          border-color: rgba(192,132,252,0.3); background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
        }
        .ty-course-tag {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 0.5rem; display: inline-block;
          padding: 2px 8px; border-radius: 4px;
        }
        .ty-course-name {
          font-size: 14px; font-weight: 600; color: #e5e5e5; margin-bottom: 0.25rem;
        }
        .ty-course-desc {
          font-size: 12px; color: #737373; line-height: 1.5;
        }
        .ty-support {
          text-align: left; font-size: 13px; color: #737373; line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .ty-support a { color: #c084fc; text-decoration: none; }
        .ty-support a:hover { text-decoration: underline; }
      `}</style>

      <div className="ty-shell">
        <div className="ty-card">
          <div className="ty-check">&#10003;</div>
          <h1 className="ty-title">Welcome to Like One Academy Pro!</h1>
          <p className="ty-msg">
            Your payment is confirmed. You just made an incredible investment in yourself
            — let's get you set up and learning.
          </p>

          {/* SIGN IN — THE CRITICAL STEP */}
          <div className="ty-signin-box">
            <p className="ty-signin-label">Step 1: Sign in to unlock your courses</p>
            <p>
              Your Pro access is tied to your email. Sign in with the <strong>same email
              you used to pay</strong> and everything unlocks instantly.
            </p>
            <p className="ty-signin-note">
              No sign-in = no access. This is the only step you need.
            </p>
            <a href="/academy/signin.html" className="ty-btn ty-btn-primary" style={{marginTop:'0.5rem', fontSize:'16px', padding:'0.85rem 2.5rem'}}>
              Sign In Now &rarr;
            </a>
          </div>

          {/* QUICK START COURSES */}
          <p className="ty-section-title">Start with these courses:</p>
          <div className="ty-courses">
            <a href="/academy/signin.html" className="ty-course">
              <span className="ty-course-tag" style={{background:'rgba(34,197,94,0.15)',color:'#4ade80'}}>Free</span>
              <p className="ty-course-name">AI Pet Lab</p>
              <p className="ty-course-desc">Build your first AI agent — fun, fast, zero experience needed.</p>
            </a>
            <a href="/academy/signin.html" className="ty-course">
              <span className="ty-course-tag" style={{background:'rgba(192,132,252,0.15)',color:'#c084fc'}}>Pro</span>
              <p className="ty-course-name">MCP Masterclass</p>
              <p className="ty-course-desc">Master the Model Context Protocol and build production tools.</p>
            </a>
            <a href="/academy/signin.html" className="ty-course">
              <span className="ty-course-tag" style={{background:'rgba(251,146,60,0.15)',color:'#fb923c'}}>Pro</span>
              <p className="ty-course-name">RAG & Vector Search</p>
              <p className="ty-course-desc">Give your AI a memory. Search, retrieve, and reason over your data.</p>
            </a>
          </div>

          {/* SUPPORT */}
          <div className="ty-support">
            <strong style={{color:'#e5e5e5'}}>Questions?</strong><br />
            Chat with Faye on the <a href="/">homepage</a> &middot;
            Email <a href="mailto:faye@likeone.ai">faye@likeone.ai</a> &middot;
            Call <a href="tel:+17027476877">+1 (702) 747-6877</a>
          </div>

          {/* COMMUNITY */}
          <div className="ty-actions">
            <a href="/academy/signin.html" className="ty-btn ty-btn-primary">Sign In Now &rarr;</a>
            <a href="/academy/community.html" className="ty-btn ty-btn-ghost">Join the Community</a>
          </div>

          <div className="ty-footer">
            You're part of Like One now. Welcome to the convergence.
          </div>
        </div>
      </div>
    </>
  );
}
