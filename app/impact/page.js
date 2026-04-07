import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Our Impact — Like One | AI Education Funding HIV Research',
  description: 'Like One donates a growing percentage of all revenue to HIV cure research. See our giving scale, recipients, and mission — from 1% at seed to 50% at abundance.',
  alternates: { canonical: `${site.url}/impact/` },
  openGraph: {
    title: 'Our Impact — Like One',
    description: 'Every course sold moves humanity closer to curing HIV. See our giving scale and where the money goes.',
    url: `${site.url}/impact/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Impact — Like One',
    description: 'Every course sold moves humanity closer to curing HIV. See our giving scale and where the money goes.',
    images: [site.ogImage],
  },
};

const GIVING_TIERS = [
  { range: '$0 – $1K/mo', pct: '1%', label: 'Seed', active: true },
  { range: '$1K – $10K/mo', pct: '5%', label: 'Growth' },
  { range: '$10K – $50K/mo', pct: '10%', label: 'Scale' },
  { range: '$50K – $100K/mo', pct: '15%', label: 'Momentum' },
  { range: '$100K – $500K/mo', pct: '25%', label: 'Impact' },
  { range: '$500K – $1M/mo', pct: '35%', label: 'Abundance' },
  { range: '$1M+/mo', pct: '50%', label: 'Cure', highlight: true },
];

const RECIPIENTS = [
  {
    name: 'amfAR',
    role: 'Primary Research Partner',
    desc: 'The Foundation for AIDS Research — leading the global effort toward an HIV cure since 1985. Funds cutting-edge cure research across 90+ institutions worldwide.',
    emoji: '\uD83E\uDDEC',
  },
  {
    name: 'UCSF',
    role: 'Heart Connection',
    desc: 'University of California, San Francisco — home to world-class HIV/AIDS research. Connected through Sophia\'s UC Berkeley roots and Bay Area community.',
    emoji: '\uD83C\uDFE5',
  },
  {
    name: 'Wistar Institute',
    role: 'Innovation Partner',
    desc: 'America\'s first independent biomedical research institution. Pioneering HIV vaccine and cure research with breakthrough gene therapy approaches.',
    emoji: '\uD83D\uDD2C',
  },
];

export default function ImpactPage() {
  return (
    <div className="site-page">
      <Header variant="site" />

      {/* Hero */}
      <section className="site-section-sm text-center">
        <span className="site-section-tag">OUR IMPACT</span>
        <h1 className="site-hero-title-sm">
          Every course sold<br /><span className="text-purple">cures something.</span>
        </h1>
        <p className="site-hero-desc-sm" style={{ maxWidth: '640px', margin: '0 auto' }}>
          Like One is not just an AI education company. It is a vehicle for healing.
          A growing percentage of all revenue funds HIV cure research — automatically,
          transparently, permanently.
        </p>
      </section>

      {/* Current Status */}
      <section className="site-section-sm">
        <div className="site-container-narrow text-center">
          <div className="impact-status-card">
            <div className="impact-status-row">
              <div className="impact-status-item">
                <div className="impact-status-number">1%</div>
                <div className="impact-status-label">Current Giving Rate</div>
              </div>
              <div className="impact-status-divider" />
              <div className="impact-status-item">
                <div className="impact-status-number">Seed</div>
                <div className="impact-status-label">Current Tier</div>
              </div>
              <div className="impact-status-divider" />
              <div className="impact-status-item">
                <div className="impact-status-number">50%</div>
                <div className="impact-status-label">Goal at Abundance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Giving Scale */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">THE GIVING SCALE</span>
          <h2 className="site-section-title-md">The more we earn, the more we give.</h2>
          <p className="site-story-text">
            This is not charity bolted on. It is structural. Every Stripe payment triggers
            an automatic calculation. Every tier is permanent. The scale only goes up.
          </p>

          <div className="impact-scale-grid">
            {GIVING_TIERS.map(t => (
              <div key={t.label} className={`impact-tier-card${t.active ? ' active' : ''}${t.highlight ? ' highlight' : ''}`}>
                <div className="impact-tier-header">
                  <span className="impact-tier-pct">{t.pct}</span>
                  <span className="impact-tier-label">{t.label}</span>
                </div>
                <div className="impact-tier-range">{t.range}</div>
                {t.active && <div className="impact-tier-badge">Current</div>}
                {t.highlight && <div className="impact-tier-badge goal">Goal</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipients */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">WHERE IT GOES</span>
          <h2 className="site-section-title-md">Research partners curing HIV.</h2>
          <p className="site-story-text">
            Every dollar of giving flows to organizations doing the real work —
            labs, trials, scientists, breakthroughs. Not overhead. Not awareness campaigns. Cures.
          </p>

          <div className="impact-recipients-grid">
            {RECIPIENTS.map(r => (
              <div key={r.name} className="impact-recipient-card">
                <div className="impact-recipient-emoji">{r.emoji}</div>
                <h3 className="impact-recipient-name">{r.name}</h3>
                <div className="impact-recipient-role">{r.role}</div>
                <p className="impact-recipient-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="site-section-sm bg-raised">
        <div className="site-container-narrow">
          <span className="site-section-tag">HOW IT WORKS</span>
          <h2 className="site-section-title-md">Automated. Transparent. Permanent.</h2>

          <div className="impact-steps-grid">
            {[
              { num: '1', title: 'You buy a course', desc: 'Or subscribe. Or donate. Every payment enters the system.' },
              { num: '2', title: 'Stripe webhook fires', desc: 'Automatic calculation based on current monthly revenue tier.' },
              { num: '3', title: 'Giving amount logged', desc: 'Every calculation is recorded in our donation ledger. Full transparency.' },
              { num: '4', title: 'Funds flow to research', desc: 'Monthly transfers to amfAR, UCSF, and Wistar Institute.' },
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

      {/* The Why */}
      <section className="site-section-sm text-center">
        <div className="site-container-narrow">
          <blockquote className="home-quote">
            &ldquo;Like One. Two words. The entire mission. Human and AI working like one.
            Profit and purpose operating like one. Making money and curing disease —
            not in conflict, but in convergence.&rdquo;
          </blockquote>
          <div className="home-founder-name">— Sophia Cave, Founder</div>
          <div className="home-founder-detail">Trans woman &bull; Creative technologist &bull; UC Berkeley</div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <div className="donate-disclosure">
            <h3 className="donate-disclosure-title">Important Disclosure</h3>
            <p className="donate-disclosure-text">
              Like One LLC is a Nevada limited liability company (NV20263555995).
              Like One Foundation is a Nevada nonprofit corporation (NV20263556003), currently
              pursuing 501(c)(3) tax-exempt status with the IRS. Once approved, donations to the
              Foundation will be tax-deductible. Until then, contributions are not tax-deductible.
              The giving scale is a public commitment — tracked transparently and reported here.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-section-sm text-center">
        <h2 className="site-section-title-md">Join the mission.</h2>
        <p className="site-hero-desc-sm" style={{ maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
          Every course you take. Every subscription. Every dollar. It all flows toward the cure.
        </p>
        <div className="site-cta-row">
          <Link href="/academy/" className="site-btn-primary">Start Learning Free</Link>
          <Link href="/support/" className="site-btn-secondary">Support the Mission</Link>
        </div>
      </section>

      <Footer variant="site" />
    </div>
  );
}
