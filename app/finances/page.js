import { site } from '../../lib/site-config';
import FinancesClient from './FinancesClient';

export const metadata = {
  title: 'Finances — Like One',
  description: 'Financial dashboard for Like One.',
  robots: 'noindex',
  alternates: { canonical: `${site.url}/finances/` },
};

export default function FinancesPage() {
  return <FinancesClient />;
}
