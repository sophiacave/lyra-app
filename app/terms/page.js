import SiteLayout from '../components/SiteLayout';
import { site } from '../../lib/site-config';

export const metadata = {
  title: 'Terms of Service — Like One',
  description: "Like One's terms of service. Your agreement with Like One when using our platform and courses.",
  robots: 'noindex',
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <SiteLayout>
      <h1 style={styles.h1}>Terms of Service</h1>
      <p style={styles.updated}>Last updated: March 24, 2026</p>

      <h2 style={styles.h2}>The Basics</h2>
      <p style={styles.p}>Like One Academy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an online AI education platform operated by Sophia Cave. By using our site, you agree to these terms.</p>

      <h2 style={styles.h2}>Accounts</h2>
      <p style={styles.p}>You sign in via magic link (email-based, no password). You&rsquo;re responsible for keeping your email account secure. One subscription per person.</p>

      <h2 style={styles.h2}>Subscriptions &amp; Payments</h2>
      <ul style={styles.ul}>
        <li style={styles.li}><strong>Pro Monthly:</strong> $4.90/month (Founding Member rate, first 1,000 members — locked in forever), billed monthly via Stripe</li>
        <li style={styles.li}><strong>Pro Annual:</strong> $39/year (Founding Member rate, first 1,000 members — locked in forever), billed annually via Stripe</li>
        <li style={styles.li}>Subscriptions auto-renew unless you cancel</li>
        <li style={styles.li}>You can cancel anytime from your Stripe billing portal</li>
      </ul>

      <h2 style={styles.h2}>Refund Policy</h2>
      <p style={styles.p}>We offer a <strong>7-day refund policy</strong>. If you&rsquo;re not satisfied with Pro within 7 days of your first payment, email <a href="mailto:hello@likeone.ai" style={styles.a}>hello@likeone.ai</a> and we&rsquo;ll refund you in full. After 7 days, no refunds for the current billing period, but you can cancel future billing anytime.</p>

      <h2 style={styles.h2}>Free Content</h2>
      <p style={styles.p}>The first 3 lessons of each course are free to preview. No credit card required. Free content may change over time.</p>

      <h2 style={styles.h2}>Content Ownership</h2>
      <p style={styles.p}>All course content, code examples, and materials are owned by Like One. You may use code examples in your own projects. You may not redistribute, resell, or share course content.</p>

      <h2 style={styles.h2}>Community Guidelines</h2>
      <p style={styles.p}>Our forum is a respectful space. No harassment, spam, or hate speech. We reserve the right to remove content and ban accounts that violate community standards.</p>

      <h2 style={styles.h2}>Limitation of Liability</h2>
      <p style={styles.p}>Like One Academy provides educational content. We don&rsquo;t guarantee specific outcomes, employment, or revenue from applying what you learn. Use the knowledge at your own discretion.</p>

      <h2 style={styles.h2}>Changes</h2>
      <p style={styles.p}>We may update these terms. Continued use after changes means you accept the new terms.</p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>Questions? Email <a href="mailto:hello@likeone.ai" style={styles.a}>hello@likeone.ai</a> or call <a href="tel:+17027476877" style={styles.a}>+1 (702) 747-6877</a></p>
    </SiteLayout>
  );
}

const styles = {
  h1: { fontSize: '32px', fontWeight: 700, color: '#f0f0f0', margin: '40px 0 24px', letterSpacing: '-0.5px' },
  h2: { fontSize: '20px', fontWeight: 600, color: '#e5e5e5', margin: '36px 0 12px' },
  p: { fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' },
  li: { fontSize: '16px', lineHeight: 1.8, marginBottom: '16px' },
  ul: { paddingLeft: '24px', marginBottom: '16px' },
  updated: { fontSize: '14px', color: '#555', marginBottom: '32px' },
  a: { color: '#38bdf8' },
};
