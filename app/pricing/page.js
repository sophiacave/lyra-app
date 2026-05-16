import Link from 'next/link';
import { DM_Serif_Display } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CTARow } from '../components/primitives';
import { site } from '../../lib/site-config';
import { pricing } from '../../lib/pricing';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-dm-serif',
});

export const metadata = {
  title: `Pricing — Like One Academy | ${site.name}`,
  description: `52 AI courses, 520+ lessons from ${pricing.pro.monthly.display}. Free tier available. Cancel anytime.`,
  alternates: { canonical: `${site.url}/pricing/` },
  openGraph: {
    title: `Pricing — Like One Academy | ${site.name}`,
    description: `52 AI courses, 520+ lessons from ${pricing.pro.monthly.display}. Free tier available. Cancel anytime.`,
    url: `${site.url}/pricing/`,
    siteName: site.name,
    type: 'website',
  },
};

const PLANS = [
  {
    label: 'Always available', name: 'Free', price: '$0', desc: 'Start learning AI right now. No credit card. No tricks.',
    features: ['First 3 lessons of every course', 'All blog posts', 'Weekly convergence tips email', 'Community forum access'],
    btn: { label: 'Start Free', href: '/academy/', style: 'secondary' },
  },
  {
    label: 'Most popular', name: 'Pro', price: `$${pricing.pro.monthly.amount}`, period: '/mo',
    desc: 'Full access to everything. Learn AI by building real systems.', featured: !pricing.activeCoupon,
    features: ['All 520+ interactive lessons', '52 courses (RAG, Agents, MCP & more)', 'All download products included', 'Completion certificates', 'New content added regularly', 'Priority email support', { text: 'Cancel or pause anytime', highlight: true }],
    btn: { label: `Go Pro — ${pricing.pro.monthly.display}`, href: pricing.pro.monthly.checkoutUrl, style: 'primary', external: true },
  },
  {
    label: pricing.activeCoupon ? `${pricing.activeCoupon.percentOff}% OFF` : `Best value — save ${pricing.pro.annual.savePct}%`,
    name: 'Annual',
    price: pricing.activeCoupon ? pricing.activeCoupon.salePriceDisplay : `$${pricing.pro.annual.amount}`,
    was: pricing.activeCoupon ? `$${pricing.pro.annual.amount}/yr` : null,
    period: pricing.activeCoupon ? '' : '/yr',
    desc: pricing.activeCoupon
      ? `Everything in Pro at ${pricing.activeCoupon.saleMonthlyEquiv}. That's ${pricing.activeCoupon.percentOff}% off the annual plan.`
      : `Everything in Pro. That's ${pricing.pro.annual.monthlyEquiv} — save ${pricing.pro.annual.savePct}% vs monthly.`,
    featured: true,
    features: [
      'Everything in Pro',
      pricing.activeCoupon
        ? { text: `${pricing.activeCoupon.percentOff}% off — ${pricing.activeCoupon.saleMonthlyEquiv} (was ${pricing.pro.annual.monthlyEquiv})`, highlight: true }
        : { text: `Save ${pricing.pro.annual.savePct}% vs monthly (${pricing.pro.annual.monthlyEquiv})`, highlight: true },
      '12 months of new content',
      'All future content included',
      { text: 'Cancel or pause anytime', highlight: true },
    ],
    btn: { label: pricing.activeCoupon ? `Go Annual — ${pricing.activeCoupon.salePriceDisplay}` : `Go Annual — ${pricing.pro.annual.display}`, href: pricing.pro.annual.checkoutUrl, style: 'primary', external: true },
  },
  {
    label: 'Done-with-you', name: 'Consulting', price: `from ${pricing.consulting.starter.display}`, period: '',
    desc: 'Faye-powered builds for disabled & marginalized founders. Tier-0 anchor of LO ECO.',
    features: [`${pricing.consulting.starter.display} async (Starter)`, `${pricing.consulting.retainer.display} retainer — 14-day TTFD`, '$15k+ done-for-you builds', 'Brain + agents + voice + deploy', '3 months Academy Pro included', 'Cancel anytime'],
    btn: { label: 'See Consulting Tiers', href: '/consulting/', style: 'secondary' },
  },
];

const FAQS = [
  { q: 'Can I really start for free?', a: 'Yes. Sign up with your email and access the first 3 lessons of every course. No credit card. No tricks. No time limit.' },
  { q: 'Is there a free option?', a: "Yes. You get the first 3 lessons of every course, all blog posts, and weekly email tips — completely free, forever. No credit card required." },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel or pause anytime from your Stripe billing portal — one click from your account page. No questions, no guilt. You keep access until the end of your billing period.' },
  { q: 'Can I pause my subscription?', a: "Yes. If you need a break, you can pause your subscription from your account settings. Your progress is saved. Resume whenever you're ready." },
  { q: 'Is there a refund policy?', a: "7-day full refund on your first payment. Email hello@likeone.ai and it's done. We're human first." },
  { q: "What's Community Access?", a: "If you genuinely can't afford Pro, apply for Community Access. Full access, no cost, honor system. Sophia reviews every application personally." },
  { q: 'Do I need to be technical?', a: 'No. Courses range from absolute beginner to advanced. The beginner courses assume zero coding experience. You just need curiosity.' },
];

const COMPARE = [
  ['First 3 lessons of every course', true, true],
  ['All 520+ interactive lessons', false, true],
  ['52 courses (MCP, RAG, Agents & more)', false, true],
  ['Download products (playbooks, templates)', false, true],
  ['Completion certificates', false, true],
  ['New content as it ships', false, true],
  ['Priority email support', false, true],
  ['Blog posts', true, true],
  ['Community forum', true, true],
  ['Weekly email tips', true, true],
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function PricingPage() {

  return (
    <div className={`site-page ${dmSerif.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <a href="#main-content" className="skip-link">Skip to content</a>

      <Header variant="site" />

      {/* Hero */}
      <main id="main-content">
      <section className="site-section-sm text-center">
        <span className="site-section-tag pricing-hero-tag">Academy Pricing</span>
        <h1 className="dm-serif pricing-hero-title">
          Convergence is not<br />a <em className="text-accent-warm">luxury.</em>
        </h1>
        <p className="pricing-hero-desc">
          There is always a free path. Always. 1% of all revenue goes to HIV research — growing as we grow. The rest keeps AI accessible to everyone.
        </p>
      </section>

      {/* Value Banner */}
      <div className="site-container">
        <div className="pricing-banner">
          <div className="pricing-banner-bar" />
          <div className="pricing-banner-badge">52 COURSES — 520+ LESSONS</div>
          <div className="dm-serif pricing-banner-title">Learn AI by <span className="accent">building</span> real systems.</div>
          <div className="pricing-banner-desc">RAG, agents, MCP, Claude mastery, automation — hands-on courses that teach you to build, not just watch. Start free, go Pro when you&rsquo;re ready.</div>
        </div>
      </div>

      {/* Pricing Grid */}
      <section className="site-section-sm">
        <div className="site-container">
          <div className="pricing-grid">
            {PLANS.map(plan => (
              <div key={plan.name} className={`pricing-card price-card ${plan.featured ? 'featured' : ''}`}>
                <div className="pricing-card-label">{plan.label}</div>
                <div className="dm-serif pricing-card-name">{plan.name}</div>
                <div className={`pricing-card-price ${plan.featured ? 'accent' : ''}`}>
                  {plan.was && <span className="was">{plan.was}</span>}
                  {plan.price}{plan.period && <span className="period">{plan.period}</span>}
                </div>
                <div className="pricing-card-desc">{plan.desc}</div>
                <ul className="pricing-card-features">
                  {plan.features.map((f, i) => {
                    const text = typeof f === 'string' ? f : f.text;
                    const highlight = typeof f === 'object' && f.highlight;
                    return (
                      <li key={i} className={`pricing-card-feature ${highlight ? 'highlight' : ''}`}>
                        <span className="check">✓</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
                {plan.btn.external ? (
                  <a href={plan.btn.href} target="_blank" rel="noopener" className={`pricing-card-btn ${plan.btn.style}`}>{plan.btn.label}</a>
                ) : (
                  <Link href={plan.btn.href} className={`pricing-card-btn ${plan.btn.style}`}>{plan.btn.label}</Link>
                )}
              </div>
            ))}
          </div>

          {/* Why Go Pro — Outcome-driven */}
          <div className="pricing-outcomes">
            <h2 className="pricing-outcomes-title">What Pro members build:</h2>
            <div className="pricing-outcomes-grid">
              {[
                { icon: '🤖', text: 'AI agents that run your workflows autonomously' },
                { icon: '🧠', text: 'Persistent memory systems that never forget' },
                { icon: '⚡', text: 'Automations that save 10-40 hours per week' },
                { icon: '🔗', text: 'MCP integrations connecting AI to every tool you use' },
              ].map(o => (
                <div key={o.text} className="pricing-outcome-item">
                  <span className="pricing-outcome-icon">{o.icon}</span>
                  <span>{o.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pricing-community-note">
            <p>Can&rsquo;t afford it right now? <Link href="/community-access">Apply for Community Access</Link> — full access, no cost, honor system. Because AI education should reach everyone.</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="site-section-sm">
        <div className="site-container">
          <h2 className="dm-serif pricing-compare-title">Free vs Pro — side by side</h2>
          <p className="pricing-compare-desc">See exactly what you get at each level.</p>
          <table className="site-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th className="accent">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([feature, free, pro], i) => (
                <tr key={i}>
                  <td>{feature}</td>
                  <td className={free ? 'site-compare-check' : 'site-compare-dash'}>{free ? '✓' : '—'}</td>
                  <td className="site-compare-check">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <h2 className="dm-serif pricing-cta-title">Ready to start?</h2>
        <p className="pricing-cta-desc">Preview any course free. Upgrade when you&rsquo;re ready. No pressure. No countdown timers. Just warmth and knowledge.</p>
        <CTARow
          primary="Browse Courses" primaryHref="/academy/"
          secondary={`Go Pro — ${pricing.pro.monthly.display}`} secondaryHref={pricing.pro.monthly.checkoutUrl} secondaryTarget="_blank"
        />
      </section>
      </main>

      <Footer variant="site" />
    </div>
  );
}
