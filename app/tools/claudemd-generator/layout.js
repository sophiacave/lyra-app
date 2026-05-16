import { site } from '../../../lib/site-config';

export const metadata = {
  title: `Free CLAUDE.md Generator — Create Project Instructions for Claude Code | ${site.name}`,
  description: 'Generate a production-ready CLAUDE.md file in seconds. 8 frameworks, package.json auto-detect, export to .cursorrules and GitHub Copilot. Free, no signup.',
  alternates: { canonical: `${site.url}/tools/claudemd-generator/` },
  openGraph: {
    title: 'Free CLAUDE.md Generator — Like One',
    description: 'Generate project instructions for Claude Code, Cursor, and GitHub Copilot. 8 framework templates. 100% free.',
    url: `${site.url}/tools/claudemd-generator/`,
    siteName: site.name,
    type: 'website',
  },
};

export default function Layout({ children }) {
  return children;
}
