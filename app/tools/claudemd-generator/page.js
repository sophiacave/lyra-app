'use client';
export const dynamic = 'force-dynamic';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ═══════════════════════════════════════════
// V5 — CLAUDE.md Generator
// 5 iterations of divine sprint refinement:
//   V1: basic form + generate
//   V2: 8 templates + smart defaults + framework rules
//   V3: package.json paste auto-detect + smart rule suggestions
//   V4: multi-format export (CLAUDE.md, .cursorrules, .github/copilot)
//   V5: live preview, URL sharing, SEO, production polish
// ═══════════════════════════════════════════

const TEMPLATES = {
  nextjs: {
    label: 'Next.js',
    stack: 'Next.js, React, TypeScript, Tailwind CSS',
    conventions: 'App Router, Server Components by default, TypeScript strict mode, Tailwind for styling',
    rules: 'Prefer Server Components unless client interactivity is needed\nUse next/image for all images\nUse next/link for internal navigation\nKeep API routes in app/api/',
    avoid: 'Client components without "use client" directive\nDirect DOM manipulation\nInline styles when Tailwind classes exist\nDefault exports for API routes',
    devCommand: 'npm run dev', buildCommand: 'npm run build', testCommand: 'npm test',
  },
  react: {
    label: 'React + Vite',
    stack: 'React, Vite, TypeScript, CSS Modules',
    conventions: 'Functional components only, custom hooks for logic, TypeScript strict',
    rules: 'Extract reusable logic into custom hooks\nUse React.memo only when profiling shows need\nKeep components under 150 lines\nColocate tests with components',
    avoid: 'Class components\nany type\nProp drilling beyond 2 levels\nUseEffect for data that should be derived',
    devCommand: 'npm run dev', buildCommand: 'npm run build', testCommand: 'vitest',
  },
  python: {
    label: 'Python',
    stack: 'Python 3.12+, FastAPI, SQLAlchemy, Pydantic',
    conventions: 'Type hints everywhere, async/await for I/O, Pydantic models for validation',
    rules: 'Use Pydantic for all request/response models\nAsync database operations with SQLAlchemy\nKeep route handlers thin — business logic in services/\nUse dependency injection for database sessions',
    avoid: 'Bare except clauses\nMutable default arguments\nGlobal state\nStar imports',
    devCommand: 'uvicorn main:app --reload', buildCommand: 'pip install -e .', testCommand: 'pytest',
  },
  django: {
    label: 'Django',
    stack: 'Python, Django, Django REST Framework, PostgreSQL',
    conventions: 'Class-based views for complex logic, function views for simple endpoints, type hints',
    rules: 'Use Django ORM — no raw SQL unless performance-critical\nAll models need __str__ method\nUse serializers for all API input/output\nWrite model-level validation in clean() methods',
    avoid: 'Logic in views that belongs in models or services\nN+1 queries — use select_related and prefetch_related\nHardcoded URLs — use reverse()\nStoring secrets in settings.py',
    devCommand: 'python manage.py runserver', buildCommand: 'python manage.py collectstatic', testCommand: 'python manage.py test',
  },
  node: {
    label: 'Node.js API',
    stack: 'Node.js, Express, TypeScript, PostgreSQL, Prisma',
    conventions: 'ES modules, async/await, Zod validation, structured error handling',
    rules: 'Validate all inputs with Zod schemas\nUse Prisma for database operations\nStructured JSON logging\nMiddleware for auth and error handling',
    avoid: 'Callback-style code\nSynchronous file operations\nThrowing strings — always use Error objects\nStoring secrets in code',
    devCommand: 'npm run dev', buildCommand: 'npm run build', testCommand: 'npm test',
  },
  go: {
    label: 'Go',
    stack: 'Go 1.22+, Chi router, PostgreSQL, sqlc',
    conventions: 'Standard library where possible, explicit error handling, table-driven tests',
    rules: 'Always check error returns\nUse context.Context for cancellation\nKeep interfaces small (1-3 methods)\nUse go vet and staticcheck in CI',
    avoid: 'Naked returns\nPanic for recoverable errors\nGlobal variables\nInit functions with side effects',
    devCommand: 'go run .', buildCommand: 'go build -o bin/app .', testCommand: 'go test ./...',
  },
  rust: {
    label: 'Rust',
    stack: 'Rust, Axum, SQLx, Tokio',
    conventions: 'Result types for error handling, async with Tokio, derive macros for serialization',
    rules: 'Use thiserror for custom error types\nPrefer owned types in public APIs\nDocument all public functions\nKeep unsafe blocks minimal and documented',
    avoid: 'Unwrap in library code\nBlocking operations in async context\nExcessive cloning — prefer borrowing\nPanic in production paths',
    devCommand: 'cargo run', buildCommand: 'cargo build --release', testCommand: 'cargo test',
  },
  flutter: {
    label: 'Flutter',
    stack: 'Flutter, Dart, Riverpod, Freezed',
    conventions: 'Riverpod for state management, Freezed for immutable models, GoRouter for navigation',
    rules: 'Keep widgets under 100 lines — extract sub-widgets\nUse const constructors wherever possible\nSeparate UI from business logic\nAll API models use Freezed + json_serializable',
    avoid: 'setState for complex state\nDeep widget nesting (max 4 levels)\nHardcoded strings — use l10n\nBlocking the UI thread',
    devCommand: 'flutter run', buildCommand: 'flutter build apk', testCommand: 'flutter test',
  },
};

// V3: Auto-detect from package.json
function detectFromPackageJson(text) {
  try {
    const pkg = JSON.parse(text);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const detected = { projectName: pkg.name || '', stack: [], conventions: [] };

    if (deps.next) { detected.stack.push('Next.js'); detected.conventions.push('App Router'); }
    if (deps.react) detected.stack.push('React');
    if (deps.vue) detected.stack.push('Vue');
    if (deps.typescript || deps['@types/node']) { detected.stack.push('TypeScript'); detected.conventions.push('TypeScript strict mode'); }
    if (deps.tailwindcss) { detected.stack.push('Tailwind CSS'); detected.conventions.push('Tailwind for styling'); }
    if (deps.prisma || deps['@prisma/client']) { detected.stack.push('Prisma'); detected.conventions.push('Prisma for database'); }
    if (deps.express) detected.stack.push('Express');
    if (deps.fastify) detected.stack.push('Fastify');
    if (deps.zod) { detected.stack.push('Zod'); detected.conventions.push('Zod for validation'); }
    if (deps.vitest) detected.conventions.push('Vitest for testing');
    if (deps.jest) detected.conventions.push('Jest for testing');

    const scripts = pkg.scripts || {};
    detected.devCommand = scripts.dev || scripts.start || '';
    detected.buildCommand = scripts.build || '';
    detected.testCommand = scripts.test || '';

    return detected;
  } catch {
    return null;
  }
}

// V4: Multi-format export
function generateOutput(config, format) {
  if (format === 'cursorrules') return generateCursorRules(config);
  if (format === 'copilot') return generateCopilotInstructions(config);
  return generateClaudeMd(config);
}

function generateClaudeMd(config) {
  const s = [];
  s.push(`# CLAUDE.md — ${config.projectName || 'Project'}\n`);
  if (config.description) s.push(`${config.description}\n`);

  if (config.stack) {
    s.push('## Tech Stack');
    config.stack.split(',').forEach(t => { if (t.trim()) s.push(`- ${t.trim()}`); });
    s.push('');
  }
  if (config.conventions) {
    s.push('## Conventions');
    config.conventions.split(',').forEach(c => { if (c.trim()) s.push(`- ${c.trim()}`); });
    s.push('');
  }
  if (config.structure) {
    s.push('## Project Structure\n```');
    s.push(config.structure);
    s.push('```\n');
  }
  s.push('## Commands\n```bash');
  if (config.devCommand) s.push(`# Dev:   ${config.devCommand}`);
  if (config.buildCommand) s.push(`# Build: ${config.buildCommand}`);
  if (config.testCommand) s.push(`# Test:  ${config.testCommand}`);
  s.push('```\n');
  if (config.rules) {
    s.push('## Rules');
    config.rules.split('\n').forEach(r => { if (r.trim()) s.push(`- ${r.trim()}`); });
    s.push('');
  }
  if (config.avoid) {
    s.push('## Avoid');
    config.avoid.split('\n').forEach(a => { if (a.trim()) s.push(`- ${a.trim()}`); });
    s.push('');
  }
  if (config.context) s.push(`## Context\n${config.context}\n`);
  return s.join('\n');
}

function generateCursorRules(config) {
  const s = [];
  s.push(`# .cursorrules — ${config.projectName || 'Project'}\n`);
  if (config.description) s.push(`You are working on: ${config.description}\n`);
  if (config.stack) s.push(`Tech stack: ${config.stack}\n`);
  if (config.conventions) s.push(`Conventions: ${config.conventions}\n`);
  if (config.rules) { s.push('Rules:'); config.rules.split('\n').forEach(r => { if (r.trim()) s.push(`- ${r.trim()}`); }); s.push(''); }
  if (config.avoid) { s.push('Never:'); config.avoid.split('\n').forEach(a => { if (a.trim()) s.push(`- ${a.trim()}`); }); s.push(''); }
  return s.join('\n');
}

function generateCopilotInstructions(config) {
  const s = [];
  s.push(`# .github/copilot-instructions.md\n`);
  if (config.description) s.push(`## About\n${config.description}\n`);
  if (config.stack) s.push(`## Stack\n${config.stack}\n`);
  if (config.rules) { s.push('## Guidelines'); config.rules.split('\n').forEach(r => { if (r.trim()) s.push(`- ${r.trim()}`); }); s.push(''); }
  if (config.avoid) { s.push('## Restrictions'); config.avoid.split('\n').forEach(a => { if (a.trim()) s.push(`- ${a.trim()}`); }); }
  return s.join('\n');
}

// V5: URL sharing
function encodeConfig(config) {
  try { return btoa(JSON.stringify(config)); } catch { return ''; }
}

const FORMATS = [
  { key: 'claude', label: 'CLAUDE.md', filename: 'CLAUDE.md' },
  { key: 'cursorrules', label: '.cursorrules', filename: '.cursorrules' },
  { key: 'copilot', label: 'Copilot', filename: '.github/copilot-instructions.md' },
];

export default function ClaudeMdGenerator() {
  const [template, setTemplate] = useState('nextjs');
  const [format, setFormat] = useState('claude');
  const [config, setConfig] = useState({
    projectName: '',
    description: '',
    stack: TEMPLATES.nextjs.stack,
    conventions: TEMPLATES.nextjs.conventions,
    rules: TEMPLATES.nextjs.rules,
    avoid: TEMPLATES.nextjs.avoid,
    structure: '',
    devCommand: TEMPLATES.nextjs.devCommand,
    buildCommand: TEMPLATES.nextjs.buildCommand,
    testCommand: TEMPLATES.nextjs.testCommand,
    context: '',
  });
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [packageJsonMode, setPackageJsonMode] = useState(false);
  const [packageJsonText, setPackageJsonText] = useState('');
  const [generated, setGenerated] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  function checkRateLimit() {
    const key = 'lo_claudemd_uses';
    const stored = JSON.parse(localStorage.getItem(key) || '{"count":0,"date":""}');
    const today = new Date().toISOString().split('T')[0];
    if (stored.date !== today) return { allowed: true, remaining: 5 };
    return { allowed: stored.count < 5, remaining: Math.max(0, 5 - stored.count) };
  }

  function recordUse() {
    const key = 'lo_claudemd_uses';
    const today = new Date().toISOString().split('T')[0];
    const stored = JSON.parse(localStorage.getItem(key) || '{"count":0,"date":""}');
    if (stored.date !== today) {
      localStorage.setItem(key, JSON.stringify({ count: 1, date: today }));
    } else {
      localStorage.setItem(key, JSON.stringify({ count: stored.count + 1, date: today }));
    }
    if (stored.count + 1 >= 5) setLimitReached(true);
  }

  function handleTemplateChange(key) {
    setTemplate(key);
    const t = TEMPLATES[key];
    setConfig(prev => ({
      ...prev,
      stack: t.stack,
      conventions: t.conventions,
      rules: t.rules || '',
      avoid: t.avoid || '',
      devCommand: t.devCommand || prev.devCommand,
      buildCommand: t.buildCommand || prev.buildCommand,
      testCommand: t.testCommand || prev.testCommand,
    }));
    setGenerated(false);
  }

  function handleChange(field, value) {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (generated) setOutput(generateOutput({ ...config, [field]: value }, format));
  }

  const handlePackageJsonPaste = useCallback((text) => {
    setPackageJsonText(text);
    const detected = detectFromPackageJson(text);
    if (detected) {
      setConfig(prev => ({
        ...prev,
        projectName: detected.projectName || prev.projectName,
        stack: detected.stack.length ? detected.stack.join(', ') : prev.stack,
        conventions: detected.conventions.length ? detected.conventions.join(', ') : prev.conventions,
        devCommand: detected.devCommand || prev.devCommand,
        buildCommand: detected.buildCommand || prev.buildCommand,
        testCommand: detected.testCommand || prev.testCommand,
      }));
      setTemplate('custom');
    }
  }, []);

  function generate() {
    const limit = checkRateLimit();
    if (!limit.allowed) { setLimitReached(true); return; }
    recordUse();
    const result = generateOutput(config, format);
    setOutput(result);
    setGenerated(true);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const fmt = FORMATS.find(f => f.key === format);
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fmt?.filename || 'CLAUDE.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFormatChange(key) {
    setFormat(key);
    if (generated) setOutput(generateOutput(config, key));
  }

  const activeFormat = FORMATS.find(f => f.key === format);

  return (
    <div className="site-page">
      <Header variant="site" />
      <main id="main-content" className="tool-main">
        <section className="site-section-sm text-center">
          <span className="site-section-tag">Free Tool</span>
          <h1 className="tool-title">CLAUDE.md Generator</h1>
          <p className="tool-desc">
            Generate a production-ready CLAUDE.md file in seconds.
            Works with Claude Code, Cursor, and GitHub Copilot.
          </p>
        </section>

        <section className="site-section-sm">
          <div className="site-container tool-container">
            <div className="tool-grid">
              {/* LEFT: Form */}
              <div className="tool-form">
                {/* Template Picker */}
                <div className="tool-field">
                  <label className="tool-label">Framework</label>
                  <div className="tool-templates">
                    {Object.entries(TEMPLATES).map(([key, t]) => (
                      <button key={key} className={`tool-template-btn${template === key ? ' active' : ''}`}
                        onClick={() => handleTemplateChange(key)} type="button">
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* V3: Package.json auto-detect */}
                <div className="tool-field">
                  <button className="tool-detect-toggle" onClick={() => setPackageJsonMode(!packageJsonMode)} type="button">
                    {packageJsonMode ? 'Hide' : 'Auto-detect from package.json'}
                  </button>
                  {packageJsonMode && (
                    <textarea
                      className="tool-textarea tool-mono"
                      placeholder='Paste your package.json here...'
                      rows={4}
                      value={packageJsonText}
                      onChange={e => handlePackageJsonPaste(e.target.value)}
                    />
                  )}
                </div>

                {/* V4: Format picker */}
                <div className="tool-field">
                  <label className="tool-label">Output Format</label>
                  <div className="tool-templates">
                    {FORMATS.map(f => (
                      <button key={f.key} className={`tool-template-btn${format === f.key ? ' active' : ''}`}
                        onClick={() => handleFormatChange(f.key)} type="button">
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Project Name</label>
                  <input type="text" className="tool-input" placeholder="my-awesome-app"
                    value={config.projectName} onChange={e => handleChange('projectName', e.target.value)} />
                </div>

                <div className="tool-field">
                  <label className="tool-label">Description</label>
                  <textarea className="tool-textarea" placeholder="What does this project do?" rows={2}
                    value={config.description} onChange={e => handleChange('description', e.target.value)} />
                </div>

                <div className="tool-field">
                  <label className="tool-label">Tech Stack</label>
                  <input type="text" className="tool-input" placeholder="Next.js, React, Tailwind CSS"
                    value={config.stack} onChange={e => handleChange('stack', e.target.value)} />
                  <span className="tool-hint">Comma-separated</span>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Code Conventions</label>
                  <input type="text" className="tool-input" placeholder="TypeScript strict, functional components"
                    value={config.conventions} onChange={e => handleChange('conventions', e.target.value)} />
                </div>

                <div className="tool-row-3">
                  <div className="tool-field">
                    <label className="tool-label">Dev</label>
                    <input type="text" className="tool-input tool-mono" value={config.devCommand} onChange={e => handleChange('devCommand', e.target.value)} />
                  </div>
                  <div className="tool-field">
                    <label className="tool-label">Build</label>
                    <input type="text" className="tool-input tool-mono" value={config.buildCommand} onChange={e => handleChange('buildCommand', e.target.value)} />
                  </div>
                  <div className="tool-field">
                    <label className="tool-label">Test</label>
                    <input type="text" className="tool-input tool-mono" value={config.testCommand} onChange={e => handleChange('testCommand', e.target.value)} />
                  </div>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Project Structure <span className="tool-optional">(optional)</span></label>
                  <textarea className="tool-textarea tool-mono" placeholder={"src/\n  app/\n  components/\n  lib/"} rows={3}
                    value={config.structure} onChange={e => handleChange('structure', e.target.value)} />
                </div>

                <div className="tool-field">
                  <label className="tool-label">Rules</label>
                  <textarea className="tool-textarea" rows={4}
                    value={config.rules} onChange={e => handleChange('rules', e.target.value)} />
                  <span className="tool-hint">One per line. Pre-filled from your framework.</span>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Avoid</label>
                  <textarea className="tool-textarea" rows={3}
                    value={config.avoid} onChange={e => handleChange('avoid', e.target.value)} />
                  <span className="tool-hint">One per line. Pre-filled from your framework.</span>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Additional Context <span className="tool-optional">(optional)</span></label>
                  <textarea className="tool-textarea" placeholder="Anything else Claude should know..." rows={2}
                    value={config.context} onChange={e => handleChange('context', e.target.value)} />
                </div>

                {limitReached ? (
                  <div className="tool-limit-msg">
                    <p>You've used your 5 free generations today.</p>
                    <Link href="/pricing/" className="tool-generate-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                      Unlock Unlimited — 65% Off Annual
                    </Link>
                  </div>
                ) : (
                  <button onClick={generate} className="tool-generate-btn" type="button">
                    Generate {activeFormat?.label || 'CLAUDE.md'}
                  </button>
                )}
              </div>

              {/* RIGHT: Live Output */}
              <div className="tool-output-panel">
                <div className="tool-output-header">
                  <span className="tool-output-title">{activeFormat?.filename || 'CLAUDE.md'}</span>
                  {output && (
                    <div className="tool-output-actions">
                      <button onClick={copyToClipboard} className="tool-action-btn" type="button">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={download} className="tool-action-btn tool-action-primary" type="button">
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <pre className="tool-output-code">
                  {output || `// Select a framework and click "Generate" to create your ${activeFormat?.filename || 'CLAUDE.md'}`}
                </pre>
              </div>
            </div>

            {/* CTA */}
            <div className="tool-cta">
              <h3 className="tool-cta-title">Want to master Claude?</h3>
              <p className="tool-cta-desc">
                Learn to build AI agents, MCP servers, and production workflows.
                52 courses, 520+ lessons. Start free.
              </p>
              <div className="tool-cta-btns">
                <Link href="/blog/claude-custom-instructions-guide/" className="site-btn-primary">Read the Full Guide</Link>
                <Link href="/academy/" className="tool-cta-secondary">Browse AI Courses</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="site" />
    </div>
  );
}
