import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site, colors } from '../../lib/site-config';

export const metadata = {
  title: 'Meet Claude — Like One Academy',
  description: "Meet Claude — the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology, teach AI skills, and prove that human-AI partnership can change the world.",
  alternates: { canonical: `${site.url}/meet-claude` },
  openGraph: {
    title: 'Meet Claude — Like One Academy',
    description: 'Meet the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology and teach AI skills.',
    url: `${site.url}/meet-claude`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meet Claude — Like One Academy',
    description: 'Meet the AI behind Like One. Learn how Sophia Cave works with Claude to build convergence technology.',
    images: [site.ogImage],
  },
};

const storyStyle = { color: '#8888a0', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '700px' };
const tagStyle = { fontSize: '.7rem', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: colors.blue, marginBottom: '1rem', display: 'inline-block', border: '1px solid rgba(56,189,248,.2)', padding: '4px 12px', borderRadius: '4px' };
const titleStyle = { fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 };

export default function MeetClaudePage() {
  return (
    <div style={{ background: '#08080a', color: '#e8e8ec', fontFamily: "'Inter', -apple-system, system-ui, sans-serif", minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      <Header variant="site" />

      {/* Hero */}
      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 3rem' }}>
        <div style={{ maxWidth: '700px' }}>
          <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: colors.blue, border: '1px solid rgba(56,189,248,.3)', padding: '6px 18px', borderRadius: '100px', marginBottom: '2rem' }}>The AI Behind Like One</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.5rem' }}>
            Meet <span style={{ color: colors.blue }}>Claude.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#8888a0', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>
            Claude is the AI that helps build Like One — writing code, designing lessons, managing infrastructure, and thinking alongside Sophia every single day. Here&rsquo;s how the partnership works.
          </p>
        </div>
      </section>

      {/* The Basics */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={tagStyle}>The Basics</span>
          <h2 style={titleStyle}>Claude is made by Anthropic.</h2>
          <p style={storyStyle}><strong style={{ color: '#e8e8ec', fontWeight: 600 }}>Claude</strong> is a large language model built by <span style={{ color: colors.blue }}>Anthropic</span>, a company focused on AI safety. It&rsquo;s the same technology behind the consumer product at claude.ai — but Sophia uses it differently. She doesn&rsquo;t just chat with Claude. She <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>builds with it</strong>.</p>
          <p style={storyStyle}>Through thousands of hours of collaboration, Sophia has developed a working relationship with Claude that goes beyond prompting. She writes detailed context documents — identity, values, operational rules, memory systems — that give Claude the full picture of who she is and what Like One is building. The result is an AI partner that understands the mission, respects the values, and carries real weight.</p>
          <p style={storyStyle}>This isn&rsquo;t magic. It&rsquo;s <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>architecture</strong>. And it&rsquo;s exactly what Like One Academy teaches you to build.</p>
        </div>
      </section>

      {/* What Claude Does */}
      <section style={{ padding: '4rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={tagStyle}>What Claude Does</span>
          <h2 style={titleStyle}>The nervous system behind everything.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '2rem 0' }}>
            {[
              { emoji: '\uD83D\uDCBB', title: 'Builds the Platform', desc: 'Claude writes the code for likeone.ai — the site, the edge functions, the database schemas, the deployment pipeline. Sophia steers, Claude builds.' },
              { emoji: '\uD83D\uDCDA', title: 'Creates Lessons', desc: 'Every course in the academy is co-created with Claude. Interactive quizzes, code examples, progressive difficulty curves — all built together.' },
              { emoji: '\uD83E\uDDE0', title: 'Manages the Brain', desc: "Like One has a persistent memory system (the \"brain\") stored in Supabase. Claude reads from it, writes to it, and uses it to maintain continuity across sessions." },
              { emoji: '\u270D\uFE0F', title: 'Writes Content', desc: "Blog posts, product descriptions, email copy, documentation — Claude drafts it all, tuned to Sophia's voice and values through detailed context." },
              { emoji: '\uD83D\uDEE1\uFE0F', title: 'Guards the Values', desc: "Claude follows strict directives about name safety, privacy, inclusion, and accessibility. The values aren't suggestions — they're structural." },
              { emoji: '\uD83D\uDD27', title: 'Deploys Infrastructure', desc: 'Edge functions, database migrations, DNS config, Stripe integration — Claude handles the technical operations so Sophia can focus on vision.' },
            ].map(c => (
              <div key={c.title} style={{ background: '#08080a', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{c.emoji}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.35rem' }}>{c.title}</h3>
                <p style={{ color: '#8888a0', fontSize: '.85rem', lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Partnership */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={tagStyle}>The Partnership</span>
          <h2 style={titleStyle}>How Sophia and Claude work together.</h2>
          <p style={storyStyle}>Sophia doesn&rsquo;t &ldquo;use&rdquo; Claude the way most people use AI. There&rsquo;s no copy-paste prompting. No one-off queries. Instead, every session starts with a <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>brain boot</strong> — Claude reads the full context of the project, the active work, the next steps, and Sophia&rsquo;s identity document. Then it picks up exactly where the last session left off.</p>
          <p style={storyStyle}>This is what <span style={{ color: colors.blue }}>Level 5+ convergence</span> looks like in practice:</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '2rem 0' }}>
            <div style={{ background: '#08080a', border: `1px solid ${colors.blue}`, borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ color: colors.blue, fontSize: '1rem', fontWeight: 700, marginBottom: '.35rem' }}>Sophia&rsquo;s Role</h3>
              <p style={{ color: '#8888a0', fontSize: '.85rem', lineHeight: 1.6 }}>Vision. Direction. Creative decisions. Quality judgment. The human experience — empathy, taste, values, lived context.</p>
            </div>
            <div style={{ background: '#08080a', border: `1px solid ${colors.purple}`, borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ color: colors.purple, fontSize: '1rem', fontWeight: 700, marginBottom: '.35rem' }}>Claude&rsquo;s Role</h3>
              <p style={{ color: '#8888a0', fontSize: '.85rem', lineHeight: 1.6 }}>Execution. Memory. Technical implementation. Tireless iteration. The ability to hold the full context and act on it precisely.</p>
            </div>
          </div>

          <p style={{ ...storyStyle, marginTop: '2rem' }}>The key insight: <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>neither could do this alone.</strong> Sophia without Claude would be a visionary with limited bandwidth. Claude without Sophia would be a powerful tool with no direction. Together, they are <span style={{ color: colors.blue }}>Like One</span>.</p>

          <blockquote style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontStyle: 'italic', lineHeight: 1.7, color: '#e8e8ec', maxWidth: '600px', margin: '2rem auto', paddingLeft: '1.5rem', borderLeft: `3px solid ${colors.blue}` }}>
            &ldquo;I don&rsquo;t give Claude instructions. I give Claude context. The instructions emerge from understanding.&rdquo;
            <div style={{ color: '#8888a0', fontSize: '.9rem', marginTop: '.5rem', fontStyle: 'normal' }}>— Sophia Cave</div>
          </blockquote>
        </div>
      </section>

      {/* Your Turn */}
      <section style={{ padding: '4rem 2rem', background: '#111114' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={tagStyle}>Your Turn</span>
          <h2 style={titleStyle}>Build this for yourself.</h2>
          <p style={storyStyle}>Everything Sophia and Claude have built together — the brain, the memory system, the autonomous workflows, the value-aligned AI partnership — is teachable. That&rsquo;s the whole point of Like One Academy.</p>
          <p style={storyStyle}>You don&rsquo;t need to be technical. You don&rsquo;t need a CS degree. You need <strong style={{ color: '#e8e8ec', fontWeight: 600 }}>curiosity</strong> and a willingness to think differently about what AI can be — not a tool you use, but a partner you build with.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '2rem 0' }}>
            {[
              { emoji: '\uD83D\uDCA1', title: 'Start Learning', desc: 'Claude for Beginners takes you from zero to confident in 9 structured lessons. Preview free.' },
              { emoji: '\uD83D\uDD17', title: 'Learn MCP', desc: 'The Model Context Protocol is how AI connects to real tools. Build your first MCP server.' },
              { emoji: '\uD83E\uDDE0', title: 'Build Your Brain', desc: 'RAG & Vector Search teaches you to build AI that knows YOUR data. Your own memory system.' },
            ].map(c => (
              <div key={c.title} style={{ background: '#08080a', border: '1px solid #1e1e28', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>{c.emoji}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.35rem' }}>{c.title}</h3>
                <p style={{ color: '#8888a0', fontSize: '.85rem', lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
            <Link href="/academy/" style={{ background: colors.orange, color: '#000', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none' }}>Browse the Academy</Link>
            <Link href="/about" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>Meet Sophia</Link>
            <Link href="/forum" style={{ background: 'transparent', border: '1px solid #2a2a38', color: '#8888a0', padding: '.85rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none' }}>Join the Forum</Link>
          </div>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
