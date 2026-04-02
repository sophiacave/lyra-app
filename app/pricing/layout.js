export const metadata = {
  title: 'AI Course Pricing — 90% Off Founding Member Deal | Like One Academy',
  description: 'Free tier available — no credit card needed. Pro from $4.90/mo (normally $49). 30 AI courses, 300+ lessons. First 1,000 founding members lock in 90% off forever.',
  alternates: { canonical: 'https://likeone.ai/pricing/' },
  openGraph: {
    title: 'AI Course Pricing — 90% Off Founding Member Deal | Like One',
    description: 'Free tier or Pro from $4.90/mo. 30 AI courses, 300+ lessons. Founding members lock in 90% off forever.',
    url: 'https://likeone.ai/pricing/',
  },
};

const PRICING_FAQ = [
  { q: 'Can I really start for free?', a: 'Yes. Sign up with your email and access the first 3 lessons of every course. No credit card. No tricks. No time limit.' },
  { q: 'What does "founding price forever" mean?', a: 'The first 1,000 members lock in 90% off for life. Your price never increases, even when we raise prices to $49/mo for new members.' },
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
