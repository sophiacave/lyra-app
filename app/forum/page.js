import { site } from '../../lib/site-config';
import ForumClient from './ForumClient';

export const metadata = {
  title: 'Community Forum — Like One Academy',
  description: 'Join the Like One community. Ask questions, share wins, and connect with fellow learners on the convergence path.',
  alternates: { canonical: `${site.url}/forum/` },
  openGraph: {
    title: 'Community Forum — Like One Academy',
    description: 'Ask questions, share wins, and connect with fellow learners building AI systems with soul.',
    url: `${site.url}/forum/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Forum — Like One Academy',
    description: 'Ask questions, share wins, and connect with fellow learners building AI systems with soul.',
    images: [site.ogImage],
  },
};

export default function ForumPage() {
  return <ForumClient />;
}
