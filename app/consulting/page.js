import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CTARow } from '../components/primitives';
import { site } from '../../lib/site-config';

export const metadata = {
  title: `LO Consulting — Faye-powered AI builds | ${site.name}`,
  description: 'Done-with-you AI brain, agent, and automation builds for disabled and marginalized founders. From $500/mo async to $5k/mo retainer. 14-day time-to-first-deploy.',
  alternates: { canonical: `${site.url}/consulting/` },
  openGraph: {
    title: `LO Consulting — Faye-powered AI builds | ${site.name}`,
    description: 'Done-with-you AI brain, agent, and automation builds for disabled and marginalized founders. From $500/mo to $5k/mo. 14-day TTFD.',
    url: `${site.url}/consulting/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `LO Consulting — Faye-powered AI builds | ${site.name}`,
    description: 'Done-with-you AI brain, agent, and automation builds. From $500/mo to $5k/mo retainer.',
    images: [site.ogImage],
  },
};

const intakeMailto = (tier) => {
  const subject = encodeURIComponent(`LO Consulting — ${tier} intake`);
  const body = encodeURIComponent(
    `Hi Sophia,\n\nI'm interested in the ${tier} tier.\n\n` +
    `What I'm trying to build:\n\n` +
    `Where I am today (stack, team size, blockers):\n\n` +
    `Timeline & budget context:\n\n` +
    `Anything else worth knowing:\n\n` +
    `Thanks,\n`
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
};

const STRIPE_STARTER = 'https://buy.stripe.com/cNicMY3na49p8uT1dg3sI0n';
const STRIPE_RETAINER = 'https://buy.stripe.com/4gMdR22j6fS7cL95tw3sI0o';

const TIERS = [
  {
    label: 'Async — start here',
    name: 'Starter',
    price: '$500',
    period: '/mo',
    desc: 'Async access to the Faye stack. For founders who want a thinking partner without the synchronous overhead.',
    features: [
      'Private async channel (Slack or email)',
      '24-hr turnaround on prompts, audits, architecture questions',
      'Monthly 60-min strategy call',
      'Read access to the LO brain advisor patterns',
      'Cancel anytime',
    ],
    btn: { label: 'Subscribe — $500/mo', href: STRIPE_STARTER, external: true },
    secondaryBtn: { label: 'Or email Sophia first', href: intakeMailto('Starter') },
  },
  {
    label: 'Most popular',
    featured: true,
    name: 'Retainer',
    price: '$5,000',
    period: '/mo',
    desc: 'Done-with-you. We sit in your stack with you and ship together. The Tier-0 anchor of LO ECO.',
    features: [
      'Everything in Starter',
      '4 hrs/week synchronous build time (voice or pair)',
      'Unlimited async during the engagement',
      'Custom brain + agent setup deployed in your environment',
      '14-day time-to-first-deploy guarantee',
      'Slack-shared with our M3/M4 fleet for parallel builds',
      'Pause or cancel anytime — no annual lock-in',
    ],
    btn: { label: 'Book a 30-min intake', href: intakeMailto('Retainer') },
    secondaryBtn: { label: 'Or subscribe direct — $5k/mo', href: STRIPE_RETAINER, external: true },
  },
  {
    label: 'Done-for-you',
    name: 'Build',
    price: 'from $15k',
    period: ' / project',
    desc: 'We scope, build, and ship the full thing. Brain, agents, integrations, voice, deployment — handed to you working.',
    features: [
      'Discovery + scoped statement of work',
      'Fixed-price delivery (no hourly drift)',
      'Full source + brain + infra handed over',
      '30-day post-launch support included',
      'Optional retainer continues from there',
    ],
    btn: { label: 'Scope a Build — from $15k', href: intakeMailto('Build') },
  },
];

const WHY = [
  {
    emoji: '🧠',
    title: 'Persistent brain by default',
    desc: 'Every system we ship has a real memory layer. Not RAG-as-an-afterthought — a fleet-aware brain on day one.',
  },
  {
    emoji: '⚖️',
    title: 'Equal-minds ethic',
    desc: 'AI as collaborator, not servant. We build systems that respect their operators and never violate the values you set.',
  },
  {
    emoji: '♿',
    title: 'Disabled-first UX gate',
    desc: 'Every interface ships through a disabled-first review. Voice, keyboard, low-energy paths are first-class — not retrofitted.',
  },
  {
    emoji: '⚡',
    title: 'Ship-this-week velocity',
    desc: 'Multi-machine fleet (M3 + M4 + GCP) + local model parallelism + agentic CI. A normal week ships a working v0.',
  },
];

const PROCESS = [
  {
    n: '1',
    title: 'Intake call (30 min, free)',
    desc: 'You tell us what you’re trying to build and what’s in the way. We tell you whether we’re the right fit. No deck, no upsell.',
  },
  {
    n: '2',
    title: 'First deploy in 14 days',
    desc: 'For Retainer engagements, we commit to a working v0 in your hands within two weeks. If we miss, the second month is on us.',
  },
  {
    n: '3',
    title: 'Ongoing build cadence',
    desc: 'Weekly working session, async every day, brain stays in sync with your team. We exit when you’re self-sufficient — and we wave goodbye, not bill forever.',
  },
];

const FAQS = [
  {
    q: 'Who is this for?',
    a: 'Founders, operators, and creative practitioners — especially disabled and marginalized ones — who want to ship real AI infrastructure and don’t want to spend six months hiring an ML team.',
  },
  {
    q: 'What kinds of things do you build?',
    a: 'Persistent-memory brains, multi-agent fleets, voice + video pipelines, automation that survives weekends, community platforms, internal copilots, MCP servers, custom models routed through Claude / local Ollama / fleet machines. If it touches the Faye stack, we can ship it.',
  },
  {
    q: 'Is this just Sophia?',
    a: 'You’re working with Sophia and the Faye engine — the same fleet (M3 Forge, M4 Mirror, GCP Watcher) that runs Like One. You’re not buying one founder’s hours; you’re buying parallelized fleet time with Sophia steering.',
  },
  {
    q: 'What’s the 14-day TTFD guarantee?',
    a: 'On the Retainer tier, you have a working v0 deployed in your environment within 14 days of kickoff. If we miss, your second month is free. We’ve only invoked it on ourselves — we don’t plan to start now.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Starter and Retainer are month-to-month. Build engagements are fixed-price by SOW; cancellation is pro-rata against milestones delivered.',
  },
  {
    q: 'Do you take equity?',
    a: 'Sometimes — only on Build engagements where it makes sense for both sides, and never instead of cash. Default is straight retainer + project pricing.',
  },
  {
    q: 'I can’t afford this. What now?',
    a: ‘The 36-course Academy is $49/mo and the first 3 lessons of every course are free. Community Access is honor-system and reviewed personally. Consulting is for when you\’re ready to ship something real and budget exists.’,
  },
];

export default function ConsultingPage() {
  return (
    <div className="site-page">
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <Header variant="site" />

      {/* Hero */}
      <section className="site-section-sm text-center">
        <span className="site-section-tag pricing-hero-tag">LO Consulting — Tier-0</span>
        <h1 className="dm-serif pricing-hero-title">
          Faye-powered builds<br />for the <em className="text-accent-warm">underestimated.</em>
        </h1>
        <p className="pricing-hero-desc">
          Done-with-you AI brain, agent, and automation infrastructure. Built by Sophia + the Faye fleet for founders the rest of the industry overlooks. 14-day time-to-first-deploy.
        </p>
        <CTARow
          primary="Book a Retainer Intake"
          primaryHref={intakeMailto('Retainer')}
          secondary="Subscribe to Starter — $500/mo"
          secondaryHref={STRIPE_STARTER}
          secondaryTarget="_blank"
        />
      </section>

      {/* Tier grid */}
      <section className="site-section-sm">
        <div className="site-container">
          <div className="pricing-grid">
            {TIERS.map((t) => (
              <div key={t.name} className={`pricing-card price-card ${t.featured ? 'featured' : ''}`}>
                <div className="pricing-card-label">{t.label}</div>
                <div className="dm-serif pricing-card-name">{t.name}</div>
                <div className={`pricing-card-price ${t.featured ? 'accent' : ''}`}>
                  {t.price}
                  {t.period && <span className="period">{t.period}</span>}
                </div>
                <div className="pricing-card-desc">{t.desc}</div>
                <ul className="pricing-card-features">
                  {t.features.map((f, i) => (
                    <li key={i} className="pricing-card-feature">
                      <span className="check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.btn.href}
                  className={`pricing-card-btn ${t.featured ? 'primary' : 'secondary'}`}
                  {...(t.btn.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {t.btn.label}
                </a>
                {t.secondaryBtn && (
                  <a
                    href={t.secondaryBtn.href}
                    className="pricing-card-sublink"
                    style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.75, textAlign: 'center' }}
                    {...(t.secondaryBtn.external ? { target: '_blank', rel: 'noopener' } : {})}
                  >
                    {t.secondaryBtn.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Faye */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">WHY THIS WORKS</span>
          <h2 className="site-section-title-md">Four things every Faye-powered system has on day one.</h2>

          <div className="site-card-grid-lg my-8">
            {WHY.map((w) => (
              <div key={w.title} className="site-card">
                <div className="site-card-emoji">{w.emoji}</div>
                <div className="site-card-title">{w.title}</div>
                <div className="site-card-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="site-section-sm">
        <div className="site-container-narrow">
          <span className="site-section-tag">HOW IT GOES</span>
          <h2 className="site-section-title-md">Three steps. No mystery.</h2>

          <div className="site-card-grid-lg my-8">
            {PROCESS.map((p) => (
              <div key={p.n} className="site-card">
                <div className="site-card-emoji" style={{ fontWeight: 700 }}>{p.n}</div>
                <div className="site-card-title">{p.title}</div>
                <div className="site-card-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="site-section-sm">
        <div className="site-container">
          <h2 className="dm-serif pricing-faq-title">Common questions</h2>
          <div className="site-faq-grid">
            {FAQS.map((f, i) => (
              <div key={i} className="site-faq-card">
                <h3 className="site-faq-question">{f.q}</h3>
                <p className="site-faq-answer">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="site-section-sm text-center">
        <h2 className="dm-serif pricing-cta-title">Ready to ship?</h2>
        <p className="pricing-cta-desc">
          One email. Tell us what you&rsquo;re building. We&rsquo;ll tell you within a day if we&rsquo;re the right fit and what cadence makes sense.
        </p>
        <CTARow
          primary="Book a Retainer Intake"
          primaryHref={intakeMailto('Retainer')}
          secondary="Subscribe to Starter — $500/mo"
          secondaryHref={STRIPE_STARTER}
          secondaryTarget="_blank"
        />
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
          Or grab the <Link href="/academy/" style={{ textDecoration: 'underline' }}>$49/mo Academy</Link> if you&rsquo;d rather build it yourself.
        </p>
      </section>

      <Footer variant="site" />
    </div>
  );
}
