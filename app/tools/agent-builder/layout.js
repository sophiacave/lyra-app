import { site } from '../../../lib/site-config';

export const metadata = {
  title: `AI Agent Blueprint Builder — Design & Export AI Agents | ${site.name}`,
  description: 'Design AI agents visually. Select capabilities, choose your model, export production-ready code with CLAUDE.md, MCP config, and deployment docs. Pro members only.',
  alternates: { canonical: `${site.url}/tools/agent-builder/` },
  openGraph: {
    title: 'AI Agent Blueprint Builder — Like One Pro',
    description: 'Design and export production-ready AI agents. Claude, OpenAI, Ollama. MCP servers included. Pro only.',
    url: `${site.url}/tools/agent-builder/`,
    siteName: site.name,
    type: 'website',
  },
};

export default function Layout({ children }) {
  return children;
}
