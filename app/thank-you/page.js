export const metadata = {
  title: 'Thank You — Like One',
  description: 'Welcome to Like One. Your purchase is confirmed.',
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
          max-width: 560px; width: 100%; text-align: center;
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
      `}</style>

      <div className="ty-shell">
        <div className="ty-card">
          <div className="ty-check">&#10003;</div>
          <h1 className="ty-title">You're In.</h1>
          <p className="ty-msg">
            Your purchase is confirmed. <strong>Check your email</strong> for
            access details and next steps.<br /><br />
            Welcome to the convergence. We build different here.
          </p>
          <div className="ty-actions">
            <a href="/" className="ty-btn ty-btn-primary">Back to Like One</a>
            <a href="/blog" className="ty-btn ty-btn-ghost">Read the Blog</a>
          </div>
          <div className="ty-footer">
            Questions? Reach out at <a href="mailto:faye@likeone.ai">faye@likeone.ai</a>
          </div>
        </div>
      </div>
    </>
  );
}
