import { site } from '../../../lib/site-config';

export const metadata = {
  title: `Free AI Resume Builder — ATS-Optimized Templates | ${site.name}`,
  description: 'Build a clean, ATS-optimized resume in minutes. 4 professional templates. Export to PDF. Free, no signup required.',
  alternates: { canonical: `${site.url}/tools/resume-builder/` },
  openGraph: {
    title: 'Free AI Resume Builder — Like One',
    description: 'Professional resume templates optimized for ATS. Fill in your details, export to PDF. 100% free.',
    url: `${site.url}/tools/resume-builder/`,
    siteName: site.name,
    type: 'website',
  },
};

export default function Layout({ children }) {
  return children;
}
