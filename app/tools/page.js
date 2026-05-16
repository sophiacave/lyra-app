'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Badge } from '../components/ui';

const TOOLS = [
  {
    title: 'CLAUDE.md Generator',
    desc: 'Generate production-ready AI coding instructions for Claude, Cursor, and Copilot. 8 framework templates.',
    href: '/tools/claudemd-generator/',
    tag: 'Free',
    tagVariant: 'success',
    icon: '\u2728',
  },
  {
    title: 'Resume Builder',
    desc: 'Build a clean, ATS-optimized resume with live preview. Print to PDF. No signup required.',
    href: '/tools/resume-builder/',
    tag: 'Free',
    tagVariant: 'success',
    icon: '\uD83D\uDCC4',
  },
  {
    title: 'AI Agent Blueprint Builder',
    desc: 'Design AI agents visually. Select capabilities, choose your model, export complete codebases.',
    href: '/tools/agent-builder/',
    tag: 'Pro',
    tagVariant: 'pro',
    icon: '\uD83E\uDD16',
  },
];

export default function ToolsIndex() {
  return (
    <div className="site-page">
      <Header variant="site" />
      <main id="main-content" className="tool-main">
        <section className="site-section-sm text-center">
          <Badge>AI Tools</Badge>
          <h1 className="tool-title">Build Faster with AI</h1>
          <p className="tool-desc">
            Free tools for developers. Generate configs, build resumes, design agents.
            No signup. No API key. Just results.
          </p>
        </section>

        <section className="site-section-sm">
          <div className="site-container tool-container">
            <div className="tools-index-grid">
              {TOOLS.map(tool => (
                <Card key={tool.href} href={tool.href} hover className="tools-index-card">
                  <div className="tools-index-card-icon">{tool.icon}</div>
                  <div className="tools-index-card-content">
                    <div className="tools-index-card-header">
                      <h2 className="tools-index-card-title">{tool.title}</h2>
                      <Badge variant={tool.tagVariant}>{tool.tag}</Badge>
                    </div>
                    <p className="tools-index-card-desc">{tool.desc}</p>
                  </div>
                  <span className="tools-index-card-arrow">{'\u2192'}</span>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer variant="site" />
    </div>
  );
}
