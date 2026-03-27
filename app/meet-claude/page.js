import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Meet Claude — Like One Academy',
  description: "Meet Claude — the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology, teach AI skills, and prove that human-AI partnership can change the world.",
  alternates: { canonical: `${site.url}/meet-claude/` },
  openGraph: {
    title: 'Meet Claude — Like One Academy',
    description: 'Meet the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology and teach AI skills.',
    url: `${site.url}/meet-claude/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Claude — Like One Academy',
    description: 'Meet the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology.',
    images: [site.ogImage],
  },
};

export default function MeetClaudePage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="site-hero">
        <div className="site-hero-inner">
          <span className="meet-tag meet-tag-pill">The AI Behind Like One</span>
          <h1 className="site-hero-title">
            Meet <span className="site-gradient-text-blue">Claude.</span>
          </h1>
          <p className="site-hero-desc">
            Claude is the AI that helps build Like One — writing code, designing lessons, managing infrastructure, and thinking alongside Sophia every single day. Here&rsquo;s how the partnership works.
          </p>
        </div>
      </section>

      {/* The Basics */}
      <section className="site-section">
        <div className="site-container-narrow">
          <span className="meet-tag">The Basics</span>
          <h2 className="site-section-title">Claude is made by Anthropic.</h2>
          <p className="site-story-text"><strong>Claude</strong> is a large language model built by <span className="accent">Anthropic</span>, a company focused on AI safety. It&rsquo;s the same technology behind the consumer product at claude.ai — but Sophia uses it differently. She doesn&rsquo;t just chat with Claude. She <strong>builds with it</strong>.</p>
          <p className="site-story-text">Through thousands of hours of collaboration, Sophia has developed a working relationship with Claude that goes beyond prompting. She writes detailed context documents — identity, values, operational rules, memory systems — that give Claude the full picture of who she is and what Like One is building. The result is an AI partner that understands the mission, respects the values, and carries real weight.</p>
          <p className="site-story-text">This isn&rsquo;t magic. It&rsquo;s <strong>architecture</strong>. And it&rsquo;s exactly what Like One Academy teaches you to build.</p>
        </div>
      </section>

      {/* What Claude Does */}
      <section className="site-section-alt">
        <div className="site-container-narrow">
          <span className="meet-tag">What Claude Does</span>
          <h2 className="site-section-title">The nervous system behind everything.</h2>
          <div className="site-card-grid">
            {[
              { emoji: '\uD83D\uDCBB', title: 'Builds the Platform', desc: 'Claude writes the code for likeone.ai — the site, the edge functions, the database schemas, the deployment pipeline. Sophia steers, Claude builds.' },
              { emoji: '\uD83D\uDCDA', title: 'Creates Lessons', desc: 'Every course in the academy is co-created with Claude. Interactive quizzes, code examples, progressive difficulty curves — all built together.' },
              { emoji: '\uD83E\uDDE0', title: 'Manages the Brain', desc: "Like One has a persistent memory system (the \"brain\") stored in Supabase. Claude reads from it, writes to it, and uses it to maintain continuity across sessions." },
              { emoji: '\u270D\uFE0F', title: 'Writes Content', desc: "Blog posts, product descriptions, email copy, documentation — Claude drafts it all, tuned to Sophia's voice and values through detailed context." },
              { emoji: '\uD83D\uDEE1\uFE0F', title: 'Guards the Values', desc: "Claude follows strict directives about name safety, privacy, inclusion, and accessibility. The values aren't suggestions — they're structural." },
              { emoji: '\uD83D\uDD27', title: 'Deploys Infrastructure', desc: 'Edge functions, database migrations, DNS config, Stripe integration — Claude handles the technical operations so Sophia can focus on vision.' },
            ].map(c => (
              <div key={c.title} className="site-card">
                <div className="site-card-emoji">{c.emoji}</div>
                <h3 className="site-card-title">{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Partnership */}
      <section className="site-section">
        <div className="site-container-narrow">
          <span className="meet-tag">The Partnership</span>
          <h2 className="site-section-title">How Sophia and Claude work together.</h2>
          <p className="site-story-text">Sophia doesn&rsquo;t &ldquo;use&rdquo; Claude the way most people use AI. There&rsquo;s no copy-paste prompting. No one-off queries. Instead, every session starts with a <strong>brain boot</strong> — Claude reads the full context of the project, the active work, the next steps, and Sophia&rsquo;s identity document. Then it picks up exactly where the last session left off.</p>
          <p className="site-story-text">This is what <span className="accent">Level 5+ convergence</span> looks like in practice:</p>

          <div className="meet-roles-grid">
            <div className="meet-role-card" data-color="blue">
              <h3 className="meet-role-title" data-color="blue">Sophia&rsquo;s Role</h3>
              <p className="meet-role-desc">Vision. Direction. Creative decisions. Quality judgment. The human experience — empathy, taste, values, lived context.</p>
            </div>
            <div className="meet-role-card" data-color="purple">
              <h3 className="meet-role-title" data-color="purple">Claude&rsquo;s Role</h3>
              <p className="meet-role-desc">Execution. Memory. Technical implementation. Tireless iteration. The ability to hold the full context and act on it precisely.</p>
            </div>
          </div>

          <p className="site-story-text">The key insight: <strong>neither could do this alone.</strong> Sophia without Claude would be a visionary with limited bandwidth. Claude without Sophia would be a powerful tool with no direction. Together, they are <span className="accent">Like One</span>.</p>

          <blockquote className="meet-blockquote">
            &ldquo;I don&rsquo;t give Claude instructions. I give Claude context. The instructions emerge from understanding.&rdquo;
            <div className="meet-attribution">&mdash; Sophia Cave</div>
          </blockquote>
        </div>
      </section>

      {/* Your Turn */}
      <section className="site-section-alt">
        <div className="site-container-narrow">
          <span className="meet-tag">Your Turn</span>
          <h2 className="site-section-title">Build this for yourself.</h2>
          <p className="site-story-text">Everything Sophia and Claude have built together — the brain, the memory system, the autonomous workflows, the value-aligned AI partnership — is teachable. That&rsquo;s the whole point of Like One Academy.</p>
          <p className="site-story-text">You don&rsquo;t need to be technical. You don&rsquo;t need a CS degree. You need <strong>curiosity</strong> and a willingness to think differently about what AI can be — not a tool you use, but a partner you build with.</p>

          <div className="site-card-grid">
            {[
              { emoji: '\uD83D\uDCA1', title: 'Start Learning', desc: 'Claude for Beginners takes you from zero to confident in 9 structured lessons. Preview free.' },
              { emoji: '\uD83D\uDD17', title: 'Learn MCP', desc: 'The Model Context Protocol is how AI connects to real tools. Build your first MCP server.' },
              { emoji: '\uD83E\uDDE0', title: 'Build Your Brain', desc: 'RAG & Vector Search teaches you to build AI that knows YOUR data. Your own memory system.' },
            ].map(c => (
              <div key={c.title} className="site-card">
                <div className="site-card-emoji">{c.emoji}</div>
                <h3 className="site-card-title">{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="site-cta-row">
            <Link href="/academy/" className="site-btn-primary">Browse the Academy</Link>
            <Link href="/about" className="site-btn-secondary">Meet Sophia</Link>
            <Link href="/forum" className="site-btn-secondary">Join the Forum</Link>
          </div>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
