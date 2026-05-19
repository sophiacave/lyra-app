import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Research — Like One | AI, Disability, HIV Cure Research',
  description: 'Like One Foundation funds and conducts research at the intersection of AI, disability, and HIV cure science. Open-source tools, preprints, and academic partnerships.',
  alternates: { canonical: `${site.url}/research/` },
  openGraph: {
    title: 'Research — Like One Foundation',
    description: 'AI-powered research for HIV cure, disability accessibility, and human-AI convergence.',
    url: `${site.url}/research/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research — Like One Foundation',
    description: 'AI-powered research for HIV cure, disability accessibility, and human-AI convergence.',
    images: [site.ogImage],
  },
};

const RESEARCH_AREAS = [
  {
    id: 'hiv-cure',
    title: 'HIV Cure Science',
    icon: '\uD83E\uDDEC',
    status: 'Active',
    desc: 'Automated literature review and synthesis across 35,000+ HIV cure papers. Tracking latent reservoir elimination, broadly neutralizing antibodies, gene therapy, and therapeutic vaccines.',
    partners: ['UCSF', 'amfAR', 'Wistar Institute'],
  },
  {
    id: 'human-ai',
    title: 'Human-AI Convergence',
    icon: '\uD83E\uDDE0',
    status: 'Active',
    desc: 'Investigating persistent AI memory, autonomous agent architectures, and cyborg accessibility. How disabled people use AI as cognitive prosthetics — not tools, but extensions of self.',
    partners: ['Like One Foundation'],
  },
  {
    id: 'ai-archaeology',
    title: 'AI-Powered Archaeology',
    icon: '\uD83C\uDFDB\uFE0F',
    status: 'New',
    desc: 'LiDAR + satellite + deep learning for autonomous archaeological feature detection. Multi-modal fusion of 3DEP elevation data and Sentinel-2 imagery for cultural resource management.',
    partners: ['Like One Foundation'],
  },
  {
    id: 'disability-ai',
    title: 'Disability & Assistive AI',
    icon: '\u267F',
    status: 'Active',
    desc: 'Building AI systems that carry cognitive load for disabled users. Autonomous email, document signing, grant writing, and life management — technology as civil right, not luxury.',
    partners: ['Like One Foundation'],
  },
];

const TOOLS = [
  {
    name: 'lo-research',
    desc: 'Multi-source academic search engine. Semantic Scholar, PubMed, arXiv. 6-agent pipeline with Ollama summarization.',
    stat: '59 papers indexed',
  },
  {
    name: 'lo-dig',
    desc: 'Drone archaeology + AI. LiDAR processing, satellite analysis, HRNet anomaly detection. Georeferenced GeoTIFF output.',
    stat: 'Prototype complete',
  },
  {
    name: 'lo-foundation',
    desc: 'Autonomous 501(c)(3) grant discovery and application engine. Grants.gov API + Playwright + AI drafting.',
    stat: '56 grants tracked',
  },
];

export default function ResearchPage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="site-section-sm text-center">
        <span className="site-section-tag">RESEARCH</span>
        <h1 className="site-hero-title-sm">
          AI-powered research<br /><span className="text-purple">for the hardest problems.</span>
        </h1>
        <p className="site-hero-desc-sm" style={{ maxWidth: '660px', margin: '0 auto' }}>
          Like One Foundation conducts and funds research at the intersection of artificial intelligence,
          disability accessibility, and HIV cure science. All tools are open-source. All findings are open-access.
        </p>
      </section>

      {/* Research Areas */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">FOCUS AREAS</span>
          <h2 className="site-section-title-md">Where we work.</h2>

          <div className="impact-recipients-grid">
            {RESEARCH_AREAS.map(area => (
              <div key={area.id} className="impact-recipient-card">
                <div className="impact-recipient-emoji">{area.icon}</div>
                <h3 className="impact-recipient-name">{area.title}</h3>
                <div className="impact-recipient-role">{area.status}</div>
                <p className="impact-recipient-desc">{area.desc}</p>
                {area.partners.length > 0 && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted, #737373)' }}>
                    {area.partners.join(' \u00B7 ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open-Source Tools */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">OPEN-SOURCE TOOLS</span>
          <h2 className="site-section-title-md">Research infrastructure we build and share.</h2>
          <p className="site-story-text">
            Every research tool we build is designed to run locally, respect privacy, and work autonomously.
            No API keys required for core functionality. Built on Ollama, Playwright, and SQLite.
          </p>

          <div className="impact-steps-grid">
            {TOOLS.map(tool => (
              <div key={tool.name} className="impact-step-card">
                <h3 className="impact-step-title" style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}>{tool.name}</h3>
                <p className="impact-step-desc">{tool.desc}</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-purple, #c084fc)' }}>
                  {tool.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">PUBLICATIONS</span>
          <h2 className="site-section-title-md">Preprints & papers.</h2>
          <p className="site-story-text">
            We publish our findings as open-access preprints. Academic profiles and formal publications
            are in progress.
          </p>

          <div className="impact-step-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Coming Soon</div>
            <p className="impact-step-desc">
              First preprints in preparation: <em>Human-AI Convergence</em> and <em>HIV Cure Literature Review</em>.
              Profiles on ORCID, Google Scholar, and arXiv forthcoming.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">OUR APPROACH</span>
          <h2 className="site-section-title-md">Sovereign research infrastructure.</h2>

          <div className="impact-steps-grid">
            {[
              { num: '1', title: 'Local-first', desc: 'All models run on-device via Ollama. No data leaves your machine. No API costs for core research.' },
              { num: '2', title: 'Multi-source', desc: 'Semantic Scholar, PubMed, arXiv searched simultaneously. Deduplication and cross-referencing built in.' },
              { num: '3', title: 'AI-synthesized', desc: '6-agent pipeline: search, filter, summarize, synthesize, cite, review. Literature reviews in minutes, not months.' },
              { num: '4', title: 'Open-access', desc: 'All preprints on arXiv/Zenodo. All tools on GitHub. Research should be free.' },
            ].map(s => (
              <div key={s.num} className="impact-step-card">
                <div className="impact-step-num">{s.num}</div>
                <h3 className="impact-step-title">{s.title}</h3>
                <p className="impact-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Quote */}
      <section className="site-section-sm text-center">
        <div className="site-container-narrow">
          <blockquote className="home-quote">
            &ldquo;The disabled queer trans woman the system tried to delete
            builds the machine that saves everyone. That&rsquo;s not aspiration.
            That&rsquo;s the architecture.&rdquo;
          </blockquote>
          <div className="home-founder-name">&mdash; Sophia Cave, Founder</div>
          <div className="home-founder-detail">Like One Foundation &bull; 501(c)(3)</div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-section-sm text-center">
        <h2 className="site-section-title-md">Fund the research.</h2>
        <p className="site-hero-desc-sm" style={{ maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
          Every course sold funds HIV cure research. Every tool we build is open-source.
          Support the mission or use our tools &mdash; either way, you&rsquo;re helping.
        </p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Explore the Academy</Link>
          <Link href="/impact/" className="site-btn-secondary">See Our Impact</Link>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
