import { site } from '../../lib/site-config';

export const metadata = {
  title: 'AI Course Pricing | Like One',
  description: 'Free tier available — no credit card needed. Pro from $49/mo. 36 AI courses, 355+ lessons. Cancel anytime.',
  alternates: { canonical: `${site.url}/pricing/` },
  openGraph: {
    title: 'AI Course Pricing | Like One',
    description: 'Free tier or Pro from $49/mo. 36 AI courses, 355+ lessons. Cancel anytime.',
    url: `${site.url}/pricing/`,
    siteName: site.name,
    type: 'website',
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Course Pricing | Like One',
    description: 'Free tier or Pro from $49/mo. 36 courses, 355+ lessons. Cancel anytime.',
    images: [site.ogImage],
  },
};

const PRICING_FAQ = [
  { q: 'Can I really start for free?', a: 'Yes. Sign up with your email and access the first 3 lessons of every course. No credit card. No tricks. No time limit.' },
  { q: 'Is there a free option?', a: 'Yes. You get the first 3 lessons of every course, all blog posts, and weekly email tips — completely free, forever. No credit card required.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your Stripe billing portal anytime. No questions, no guilt. You keep access until the end of your billing period.' },
  { q: 'Is there a refund policy?', a: '7-day full refund on your first payment. Email hello@likeone.ai and it\'s done.' },
  { q: 'Do I need to be technical?', a: 'No. Courses range from absolute beginner to advanced. The beginner courses assume zero coding experience. You just need curiosity.' },
];

export default function PricingLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: PRICING_FAQ.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }) }}
      />
      {children}
    </>
  );
}
