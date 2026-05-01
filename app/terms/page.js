import SiteLayout from '../components/SiteLayout';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Terms of Service — Like One',
  description: "Like One's terms of service. Your agreement with Like One when using our platform and courses.",
  robots: 'noindex',
  alternates: { canonical: `${site.url}/terms/` },
};

export default function TermsPage() {
  return (
    <SiteLayout>
      <h1 className="legal-h1">Terms of Service</h1>
      <p className="legal-updated">Last updated: April 5, 2026</p>

      <h2 className="legal-h2">The Basics</h2>
      <p className="legal-p">Like One Academy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an online AI education platform operated by Sophia Cave. By using our site, you agree to these terms.</p>

      <h2 className="legal-h2">Accounts</h2>
      <p className="legal-p">You sign in via magic link (email-based, no password). You&rsquo;re responsible for keeping your email account secure. One subscription per person.</p>

      <h2 className="legal-h2">Subscriptions &amp; Payments</h2>
      <ul className="legal-ul">
        <li className="legal-li"><strong>Pro Monthly:</strong> $49/month, billed monthly via Stripe</li>
        <li className="legal-li"><strong>Pro Annual:</strong> $390/year, billed annually via Stripe</li>
        <li className="legal-li">Subscriptions auto-renew unless you cancel</li>
        <li className="legal-li">You can cancel anytime from your Stripe billing portal</li>
      </ul>

      <h2 id="refunds" className="legal-h2">Refund Policy</h2>
      <p className="legal-p">We offer a <strong>7-day refund policy</strong>. If you&rsquo;re not satisfied with Pro within 7 days of your first payment, email <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a> and we&rsquo;ll refund you in full. After 7 days, no refunds for the current billing period, but you can cancel future billing anytime.</p>

      <h2 className="legal-h2">Free Content</h2>
      <p className="legal-p">The first 3 lessons of each course are free to preview. No credit card required. Free content may change over time.</p>

      <h2 className="legal-h2">Content Ownership</h2>
      <p className="legal-p">All course content, code examples, and materials are owned by Like One. You may use code examples in your own projects. You may not redistribute, resell, or share course content.</p>

      <h2 className="legal-h2">Community Guidelines</h2>
      <p className="legal-p">Our forum is a respectful space. No harassment, spam, or hate speech. We reserve the right to remove content and ban accounts that violate community standards.</p>

      <h2 className="legal-h2">Limitation of Liability</h2>
      <p className="legal-p">Like One Academy provides educational content. We don&rsquo;t guarantee specific outcomes, employment, or revenue from applying what you learn. Use the knowledge at your own discretion.</p>

      <h2 className="legal-h2">Termination &amp; Account Suspension</h2>
      <p className="legal-p">You may close your account at any time by canceling your subscription and emailing <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a>. We may suspend or terminate your account if you violate these terms, engage in fraudulent activity, or abuse the platform. If we terminate your account for cause, no refund will be issued for the current billing period. If we terminate without cause, we&rsquo;ll refund any prepaid amounts on a prorated basis.</p>

      <h2 className="legal-h2">Dispute Resolution</h2>
      <p className="legal-p">If a dispute arises, we encourage you to contact us first at <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a> so we can try to resolve it informally. If we can&rsquo;t reach a resolution within 30 days, either party may pursue binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. Arbitration will take place in Clark County, Nevada. Both parties waive the right to participate in a class action lawsuit or class-wide arbitration. Small claims court actions in Clark County, Nevada are exempt from this arbitration requirement.</p>

      <h2 className="legal-h2">Governing Law &amp; Jurisdiction</h2>
      <p className="legal-p">These terms are governed by the laws of the State of Nevada, without regard to conflict of law principles. Like One LLC is registered in the State of Nevada. Any legal proceedings not subject to the arbitration clause above shall be brought exclusively in the state or federal courts located in Clark County, Nevada, and you consent to the personal jurisdiction of those courts.</p>

      <h2 className="legal-h2">Changes</h2>
      <p className="legal-p">We may update these terms. Continued use after changes means you accept the new terms.</p>

      <h2 className="legal-h2">Contact</h2>
      <p className="legal-p">Questions? Email <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a> or call <a href="tel:+17027476877" className="legal-link">+1 (702) 747-6877</a></p>
    </SiteLayout>
  );
}
