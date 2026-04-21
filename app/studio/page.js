import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Like One Studio — AI Cinema Pipeline | Pre-Alpha',
  description: 'One command, cinema-grade video. Like One Studio is an AI-powered video generation pipeline that rivals Netflix educational content. Currently in pre-alpha development.',
  alternates: { canonical: `${site.url}/studio/` },
  openGraph: {
    title: 'Like One Studio — AI Cinema Pipeline',
    description: 'One command, cinema-grade video. AI-powered cinema pipeline in pre-alpha.',
    url: `${site.url}/studio/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Like One Studio — AI Cinema Pipeline',
    description: 'One command, cinema-grade video. AI-powered cinema pipeline in pre-alpha.',
    images: [site.ogImage],
  },
};

const capabilities = [
  { icon: '\uD83C\uDFAC', title: 'AI Video Generation', desc: 'Cinema-grade visuals from text and image prompts. Dual-keyframe motion for fluid storytelling.' },
  { icon: '\uD83C\uDF99\uFE0F', title: 'Voice Synthesis', desc: 'Professional narration powered by Fish Speech. Natural, expressive, production-ready.' },
  { icon: '\uD83C\uDFB5', title: 'Audio Design', desc: 'AI-generated music and sound effects. ACE-Step composition, AudioLDM atmospherics.' },
  { icon: '\uD83D\uDDBC\uFE0F', title: 'Visual Pipeline', desc: 'Three-tier image generation. Hero shots, exploration frames, and turbo drafts \u2014 all AI-native.' },
  { icon: '\uD83E\uDDE0', title: 'Brain-Powered', desc: 'Render queue, asset registry, quality scoring. The brain orchestrates every frame.' },
  { icon: '\u2699\uFE0F', title: 'Distributed Compute', desc: 'M3 Max for primary rendering. M4 Pro for parallel ops. Cloud for scale. One nervous system.' },
];

export default function StudioPage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <div className="site-section-sm text-center">
        <div className="studio-status-badge">PRE-ALPHA</div>
        <h1 className="timbre-hero-title">
          One command.<br /><span className="text-gradient-brand">Cinema-grade video.</span>
        </h1>
        <p className="site-hero-desc-sm">
          Like One Studio is an AI-powered video generation pipeline. Text in, Netflix-quality educational content out. No human intervention. Perfect every time.
        </p>
        <p className="studio-dev-note">
          Currently in active development. Building the machine before we turn it on.
        </p>
      </div>

      {/* Capabilities */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">THE PIPELINE</span>
          <h2 className="site-section-title-md">Six systems. One cinema machine.</h2>
          <p className="site-story-text">Every component is purpose-built. Visual generation, voice synthesis, audio design, and brain orchestration \u2014 unified into a single command interface.</p>

          <div className="site-card-grid-lg my-8">
            {capabilities.map(c => (
              <div key={c.title} className="site-card">
                <div className="about-emoji-sm">{c.icon}</div>
                <h3 className="site-card-title text-base">{c.title}</h3>
                <p className="site-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">ARCHITECTURE</span>
          <h2 className="site-section-title-md">Built for $2\u20135 per video at scale.</h2>

          <div className="timbre-tech-grid">
            {[
              { label: 'Visual Engine', value: 'Kling O1 + FLUX.1-dev' },
              { label: 'Voice Engine', value: 'Fish Speech S2 Pro' },
              { label: 'Music Engine', value: 'ACE-Step 1.5' },
              { label: 'Sound Design', value: 'AudioLDM' },
              { label: 'Orchestration', value: 'Supabase Brain v2' },
              { label: 'Target Cost', value: '$2\u20135 per finished video' },
            ].map(t => (
              <div key={t.label} className="timbre-tech-item">
                <div className="timbre-tech-label">{t.label}</div>
                <div className="timbre-tech-value">{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status */}
      <div className="site-section-sm text-center">
        <h2 className="site-section-title-md">The machine is being built.</h2>
        <p className="about-cta-desc">Studio is in pre-alpha. No rendering at scale until every gap is closed. Perfect machine first.</p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Explore Academy</Link>
          <Link href="/blog/" className="site-btn-secondary">Read the Blog</Link>
        </div>
      </div>

      <Footer variant="site" />

    </div>
  );
}
