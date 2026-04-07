import { site } from '../../lib/site-config';
import CommunityAccessClient from './CommunityAccessClient';

export const metadata = {
  title: 'Free Community Access — AI Education for All | Like One',
  description: "AI skills shouldn't cost you what you don't have. Free access to Like One Academy for anyone facing barriers. 15 spots per week, honor system.",
  alternates: { canonical: `${site.url}/community-access/` },
  openGraph: {
    title: 'Community Access — Like One Academy',
    description: 'Free AI education for anyone facing barriers. 15 spots per week, honor system. No gatekeeping.',
    url: `${site.url}/community-access/`,
    images: [{ url: site.ogImage, ...site.ogImageSize }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Access — Like One Academy',
    description: 'Free AI education for anyone facing barriers. 15 spots per week, honor system.',
    images: [site.ogImage],
  },
};

export default function CommunityAccessPage() {
  return <CommunityAccessClient />;
}
