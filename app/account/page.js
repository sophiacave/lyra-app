import { site } from '../../lib/site-config';
import AccountClient from './AccountClient';

export const metadata = {
  title: 'My Account — Like One Academy',
  description: 'Manage your Like One Academy subscription, view your courses, and update your account.',
  robots: 'noindex',
  alternates: { canonical: `${site.url}/account/` },
};

export default function AccountPage() {
  return <AccountClient />;
}
