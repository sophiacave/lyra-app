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
      <p className="legal-updated">Last updated: March 24, 2026</p>

      <h2 className="legal-h2">The Basics</h2>
      <p className="legal-p">Like One Academy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an online AI education platform operated by Sophia Cave. By using our site, you agree to these terms.</p>

      <h2 className="legal-h2">Accounts</h2>
      <p className="legal-p">You sign in via magic link (email-based, no password). You&rsquo;re responsible for keeping your email account secure. One subscription per person.</p>

      <h2 className="legal-h2">Subscriptions &amp; Payments</h2>
      <ul className="legal-ul">
        <li className="legal-li"><strong>Pro Monthly:</strong> $4.90/month (Founding Member rate, first 1,000 members — locked in forever), billed monthly via Stripe</li>
        <li className="legal-li"><strong>Pro Annual:</strong> $39/year (Founding Member rate, first 1,000 members — locked in forever), billed annually via Stripe</li>
        <li className="legal-li">Subscriptions auto-renew unless you cancel</li>
        <li className="legal-li">You can cancel anytime from your Stripe billing portal</li>
      </ul>

      <h2 className="legal-h2">Refund Policy</h2>
      <p className="legal-p">We offer a <strong>7-day refund policy</strong>. If you&rsquo;re not satisfied with Pro within 7 days of your first payment, email <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a> and we&rsquo;ll refund you in full. After 7 days, no refunds for the current billing period, but you can cancel future billing anytime.</p>

      <h2 className="legal-h2">Free Content</h2>
      <p className="legal-p">The first 3 lessons of each course are free to preview. No credit card required. Free content may change over time.</p>

      <h2 className="legal-h2">Content Ownership</h2>
      <p className="legal-p">All course content, code examples, and materials are owned by Like One. You may use code examples in your own projects. You may not redistribute, resell, or share course content.</p>

      <h2 className="legal-h2">Community Guidelines</h2>
      <p className="legal-p">Our forum is a respectful space. No harassment, spam, or hate speech. We reserve the right to remove content and ban accounts that violate community standards.</p>

      <h2 className="legal-h2">Limitation of Liability</h2>
      <p className="legal-p">Like One Academy provides educational content. We don&rsquo;t guarantee specific outcomes, employment, or revenue from applying what you learn. Use the knowledge at your own discretion.</p>

      <h2 className="legal-h2">Changes</h2>
      <p className="legal-p">We may update these terms. Continued use after changes means you accept the new terms.</p>

      <h2 className="legal-h2">Contact</h2>
      <p className="legal-p">Questions? Email <a href="mailto:hello@likeone.ai" className="legal-link">hello@likeone.ai</a> or call <a href="tel:+17027476877" className="legal-link">+1 (702) 747-6877</a></p>
    </SiteLayout>
  );
}
