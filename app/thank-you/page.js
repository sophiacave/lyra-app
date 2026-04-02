import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Welcome to Like One Academy Pro — You Are In!',
  description: 'Your purchase is confirmed. Sign in to unlock your courses.',
  alternates: { canonical: `${site.url}/thank-you/` },
  openGraph: {
    title: 'Welcome to Like One Academy Pro — You Are In!',
    description: 'Your purchase is confirmed. Sign in to unlock all your Pro courses.',
    url: `${site.url}/thank-you/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Like One Academy Pro — You Are In!',
    description: 'Your purchase is confirmed. Sign in to unlock all your Pro courses.',
    images: [site.ogImage],
  },
};

export default function ThankYouPage() {
  return (
    <div className="ty-shell">
      <div className="ty-card">
        <div className="ty-check">&#10003;</div>
        <h1 className="ty-title">Welcome to Like One Academy Pro!</h1>
        <p className="ty-msg">
          Your payment is confirmed. You just made an incredible investment in yourself
          — let&rsquo;s get you set up and learning.
        </p>

        <div className="ty-signin-box">
          <p className="ty-signin-label">Step 1: Sign in to unlock your courses</p>
          <p>
            Your Pro access is tied to your email. Sign in with the <strong>same email
            you used to pay</strong> and everything unlocks instantly.
          </p>
          <p className="ty-signin-note">
            No sign-in = no access. This is the only step you need.
          </p>
          <a href="/academy/signin.html" className="ty-btn ty-btn-primary ty-btn-lg">
            Sign In Now &rarr;
          </a>
        </div>

        <p className="ty-section-title">Start with these courses:</p>
        <div className="ty-courses">
          <a href="/academy/signin.html" className="ty-course">
            <span className="ty-course-tag" data-color="blue">Pro</span>
            <p className="ty-course-name">Claude for Beginners</p>
            <p className="ty-course-desc">Start here. Learn Claude from zero to confident in 9 lessons.</p>
          </a>
          <a href="/academy/signin.html" className="ty-course">
            <span className="ty-course-tag" data-color="purple">Pro</span>
            <p className="ty-course-name">MCP Masterclass</p>
            <p className="ty-course-desc">Master the Model Context Protocol and build production tools.</p>
          </a>
          <a href="/academy/signin.html" className="ty-course">
            <span className="ty-course-tag" data-color="warm">Pro</span>
            <p className="ty-course-name">RAG & Vector Search</p>
            <p className="ty-course-desc">Give your AI a memory. Search, retrieve, and reason over your data.</p>
          </a>
        </div>

        <div className="ty-support">
          <strong>Questions?</strong><br />
          Chat with Faye on the <a href="/">homepage</a> &middot;
          Email <a href="mailto:faye@likeone.ai">faye@likeone.ai</a> &middot;
          Call <a href="tel:+17027476877">+1 (702) 747-6877</a>
        </div>

        <div className="ty-actions">
          <a href="/academy/signin.html" className="ty-btn ty-btn-primary">Sign In Now &rarr;</a>
          <a href="/academy/community.html" className="ty-btn ty-btn-ghost">Join the Community</a>
        </div>

        <div className="ty-footer">
          You&rsquo;re part of Like One now. Welcome to the convergence.
        </div>
      </div>
    </div>
  );
}
