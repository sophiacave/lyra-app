import { site } from '../../lib/site-config';
import DigClient from './DigClient';

// UNLISTED — no metadata, no robots, no sitemap
export const metadata = {
  robots: { index: false, follow: false },
  title: 'lo-dig — Private',
};

export default function DigPage() {
  return <DigClient site={site} />;
}
