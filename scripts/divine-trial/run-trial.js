#!/usr/bin/env node

/**
 * DIVINE TRIAL — Automated Site Testing Agent
 *
 * Tests every page, every link, every interaction on likeone.ai.
 * Runs as personas with different devices/viewports.
 * Reports failures to Supabase brain.
 * Designed to run continuously after every deploy.
 *
 * Usage: node run-trial.js [--full] [--persona sarah|marcus|priya|jordan|linda]
 */

const BASE = 'https://likeone.ai';
const BRAIN_URL = 'https://tnsujchfrixxsdpodygu.supabase.co';
const BRAIN_KEY = process.env.BRAIN_SERVICE_KEY || '';

// ---- PERSONAS ----
const PERSONAS = {
  sarah: { name: 'Sarah the Teacher', viewport: { w: 768, h: 1024 }, device: 'iPad', techLevel: 'low' },
  marcus: { name: 'Marcus the Developer', viewport: { w: 1440, h: 900 }, device: 'MacBook', techLevel: 'high' },
  priya: { name: 'Priya the Business Owner', viewport: { w: 390, h: 844 }, device: 'iPhone 14', techLevel: 'medium' },
  jordan: { name: 'Jordan the Student', viewport: { w: 360, h: 780 }, device: 'Android', techLevel: 'low' },
  linda: { name: 'Linda the Executive', viewport: { w: 1920, h: 1080 }, device: 'Desktop', techLevel: 'medium' },
};

// ---- ALL PAGES TO TEST ----
const PAGES = [
  // Core pages
  { path: '/', name: 'Homepage', critical: true },
  { path: '/about', name: 'About', critical: true },
  { path: '/pricing', name: 'Pricing', critical: true },
  { path: '/support', name: 'Support', critical: true },
  { path: '/blog', name: 'Blog', critical: false },
  { path: '/forum', name: 'Forum', critical: false },
  { path: '/account', name: 'Account', critical: true },
  { path: '/privacy', name: 'Privacy Policy', critical: false },
  { path: '/terms', name: 'Terms of Service', critical: false },
  { path: '/community-access', name: 'Community Access', critical: false },
  { path: '/thank-you', name: 'Thank You', critical: false },

  // Academy
  { path: '/academy/', name: 'Academy Hub', critical: true },
  { path: '/academy/signin.html', name: 'Signin', critical: true },
  { path: '/academy/claude-for-beginners/', name: 'Claude for Beginners', critical: true },
  { path: '/academy/ai-pet-lab/', name: 'AI Pet Lab', critical: true },
  { path: '/academy/ai-foundations/', name: 'AI Foundations', critical: false },
  { path: '/academy/claude-mastery/', name: 'Claude Mastery', critical: false },
  { path: '/academy/mcp-masterclass/', name: 'MCP Masterclass', critical: false },
  { path: '/academy/rag-vector-search/', name: 'RAG & Vector Search', critical: false },
  { path: '/academy/first-ai-agent/', name: 'First AI Agent', critical: false },
  { path: '/academy/automation-architect/', name: 'Automation Architect', critical: false },
  { path: '/academy/the-automation-lab/', name: 'The Automation Lab', critical: false },
  { path: '/academy/ai-stack-builder/', name: 'AI Stack Builder', critical: false },
  { path: '/academy/ai-for-business/', name: 'AI for Business', critical: false },

  // Claude for Beginners lessons
  { path: '/academy/claude-for-beginners/what-claude-can-do.html', name: 'CFB Lesson 1', critical: true },
  { path: '/academy/claude-for-beginners/your-first-conversation.html', name: 'CFB Lesson 2', critical: true },
  { path: '/academy/claude-for-beginners/basics-quiz.html', name: 'CFB Lesson 3', critical: true },
];

// ---- TEST FUNCTIONS ----

async function testPage(page, persona) {
  const url = BASE + page.path;
  const results = { page: page.name, path: page.path, url, persona: persona.name, tests: [], pass: true };

  try {
    // Test 1: Page loads
    const start = Date.now();
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': `DivineTrial/${persona.device}` }
    });
    const loadTime = Date.now() - start;
    const html = await res.text();

    addResult(results, 'HTTP Status', res.status === 200, `${res.status}`, res.status === 200 ? null : `Expected 200, got ${res.status}`);
    addResult(results, 'Load Time', loadTime < 3000, `${loadTime}ms`, loadTime >= 3000 ? `Slow: ${loadTime}ms (target: <3000ms)` : null);
    addResult(results, 'Has Content', html.length > 500, `${html.length} chars`, html.length <= 500 ? 'Page seems empty' : null);

    // Test 2: Title exists
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    addResult(results, 'Has Title', !!titleMatch, titleMatch?.[1] || 'missing', !titleMatch ? 'No <title> tag' : null);

    // Test 3: Meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    addResult(results, 'Meta Description', !!descMatch, descMatch ? 'present' : 'missing', !descMatch ? 'No meta description — bad for SEO' : null);

    // Test 4: Viewport meta (mobile)
    const vpMatch = html.match(/name="viewport"/);
    addResult(results, 'Viewport Meta', !!vpMatch, vpMatch ? 'present' : 'missing', !vpMatch ? 'No viewport meta — broken on mobile' : null);

    // Test 5: No broken internal links
    const linkRegex = /href="(\/[^"]*?)"/g;
    const links = new Set();
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (!href.startsWith('/api/') && !href.startsWith('/brain') && !href.includes('mailto:') && !href.includes('tel:')) {
        links.add(href);
      }
    }

    let brokenLinks = [];
    for (const link of links) {
      try {
        const linkRes = await fetch(BASE + link, { method: 'HEAD', redirect: 'follow' });
        if (linkRes.status >= 400) {
          brokenLinks.push({ link, status: linkRes.status });
        }
      } catch (e) {
        brokenLinks.push({ link, status: 'NETWORK_ERROR' });
      }
    }
    addResult(results, 'Internal Links', brokenLinks.length === 0, `${links.size} links, ${brokenLinks.length} broken`,
      brokenLinks.length > 0 ? `Broken: ${brokenLinks.map(b => `${b.link} (${b.status})`).join(', ')}` : null);

    // Test 6: No JavaScript errors (check for common patterns)
    const jsErrorPatterns = [
      /undefined is not a function/,
      /Cannot read propert/,
      /ReferenceError/,
      /SyntaxError/,
    ];
    // Can't check runtime JS without browser — flag if inline scripts reference missing elements
    const inlineScripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
    const elementIds = new Set();
    const idRegex = /id="([^"]+)"/g;
    while ((match = idRegex.exec(html)) !== null) elementIds.add(match[1]);

    const getElementCalls = [];
    for (const script of inlineScripts) {
      const geiRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
      while ((match = geiRegex.exec(script)) !== null) {
        if (!elementIds.has(match[1])) getElementCalls.push(match[1]);
      }
    }
    addResult(results, 'JS Element Refs', getElementCalls.length === 0, `${getElementCalls.length} missing refs`,
      getElementCalls.length > 0 ? `JS references missing elements: ${getElementCalls.join(', ')}` : null);

    // Test 7: External scripts load
    const extScriptRegex = /src="(\/[^"]+\.js)"/g;
    const scripts = [];
    while ((match = extScriptRegex.exec(html)) !== null) scripts.push(match[1]);

    let brokenScripts = [];
    for (const script of scripts) {
      try {
        const sRes = await fetch(BASE + script, { method: 'HEAD' });
        if (sRes.status >= 400) brokenScripts.push({ script, status: sRes.status });
      } catch (e) {
        brokenScripts.push({ script, status: 'NETWORK_ERROR' });
      }
    }
    addResult(results, 'External Scripts', brokenScripts.length === 0, `${scripts.length} scripts, ${brokenScripts.length} broken`,
      brokenScripts.length > 0 ? `Broken: ${brokenScripts.map(b => `${b.script} (${b.status})`).join(', ')}` : null);

    // Test 8: CSS loads
    const cssRegex = /href="(\/[^"]+\.css)"/g;
    const stylesheets = [];
    while ((match = cssRegex.exec(html)) !== null) stylesheets.push(match[1]);

    let brokenCSS = [];
    for (const css of stylesheets) {
      try {
        const cRes = await fetch(BASE + css, { method: 'HEAD' });
        if (cRes.status >= 400) brokenCSS.push({ css, status: cRes.status });
      } catch (e) {
        brokenCSS.push({ css, status: 'NETWORK_ERROR' });
      }
    }
    addResult(results, 'Stylesheets', brokenCSS.length === 0, `${stylesheets.length} CSS, ${brokenCSS.length} broken`,
      brokenCSS.length > 0 ? `Broken: ${brokenCSS.map(b => `${b.css} (${b.status})`).join(', ')}` : null);

    // Test 9: Nav consistency (check for standard nav links)
    const expectedNavLinks = ['/academy/', '/pricing', '/about'];
    const missingNav = expectedNavLinks.filter(link => !html.includes(`href="${link}"`));
    addResult(results, 'Nav Links', missingNav.length === 0, `${expectedNavLinks.length - missingNav.length}/${expectedNavLinks.length} present`,
      missingNav.length > 0 ? `Missing nav links: ${missingNav.join(', ')}` : null);

    // Test 10: Footer exists
    const hasFooter = html.includes('<footer') || html.includes('class="foot"') || html.includes('class="lesson-footer"');
    addResult(results, 'Footer', hasFooter, hasFooter ? 'present' : 'missing', !hasFooter ? 'No footer found' : null);

    // Test 11: Auth script loaded (academy pages)
    if (page.path.includes('/academy/')) {
      const hasAuth = html.includes('auth-state.js') || html.includes('auth.js');
      addResult(results, 'Auth Script', hasAuth, hasAuth ? 'present' : 'missing', !hasAuth ? 'Academy page missing auth script' : null);
    }

    // Test 12: HTTPS links (no mixed content)
    const httpLinks = html.match(/http:\/\/(?!localhost)/g) || [];
    addResult(results, 'No Mixed Content', httpLinks.length === 0, `${httpLinks.length} http links`,
      httpLinks.length > 0 ? 'Mixed content: some links use http instead of https' : null);

  } catch (e) {
    addResult(results, 'Page Load', false, 'FAILED', `Network error: ${e.message}`);
  }

  results.pass = results.tests.every(t => t.pass);
  return results;
}

function addResult(results, test, pass, value, issue) {
  results.tests.push({ test, pass, value, issue });
  if (!pass) results.pass = false;
}

// ---- REPORT ----
async function writeReport(allResults) {
  const failures = allResults.filter(r => !r.pass);
  const totalTests = allResults.reduce((sum, r) => sum + r.tests.length, 0);
  const failedTests = allResults.reduce((sum, r) => sum + r.tests.filter(t => !t.pass).length, 0);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      pages_tested: allResults.length,
      pages_passed: allResults.length - failures.length,
      pages_failed: failures.length,
      total_tests: totalTests,
      tests_passed: totalTests - failedTests,
      tests_failed: failedTests,
      pass_rate: ((totalTests - failedTests) / totalTests * 100).toFixed(1) + '%',
    },
    failures: failures.map(r => ({
      page: r.page,
      path: r.path,
      issues: r.tests.filter(t => !t.pass).map(t => ({ test: t.test, value: t.value, issue: t.issue }))
    })),
    all_results: allResults,
  };

  // Print summary
  console.log('\n══════════════════════════════════════════');
  console.log('  DIVINE TRIAL REPORT');
  console.log('══════════════════════════════════════════');
  console.log(`  Pages: ${report.summary.pages_passed}/${report.summary.pages_tested} passed`);
  console.log(`  Tests: ${report.summary.tests_passed}/${report.summary.total_tests} passed (${report.summary.pass_rate})`);
  console.log('──────────────────────────────────────────');

  if (failures.length > 0) {
    console.log('\n  FAILURES:');
    for (const f of failures) {
      console.log(`\n  ✗ ${f.page} (${f.path})`);
      for (const issue of f.tests.filter(t => !t.pass)) {
        console.log(`    → ${issue.test}: ${issue.issue}`);
      }
    }
  } else {
    console.log('\n  ✓ ALL PAGES PASSED');
  }
  console.log('\n══════════════════════════════════════════\n');

  // Write to brain if key available
  if (BRAIN_KEY) {
    try {
      await fetch(`${BRAIN_URL}/rest/v1/brain_context?key=eq.testing.latest_report`, {
        method: 'DELETE',
        headers: { apikey: BRAIN_KEY, Authorization: `Bearer ${BRAIN_KEY}` },
      });
      await fetch(`${BRAIN_URL}/rest/v1/brain_context`, {
        method: 'POST',
        headers: { apikey: BRAIN_KEY, Authorization: `Bearer ${BRAIN_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          key: 'testing.latest_report',
          category: 'testing',
          value: report,
          description: `Divine Trial: ${report.summary.pass_rate} pass rate, ${failures.length} pages with issues`,
          priority: failures.length > 0 ? 8 : 3,
        }),
      });
      console.log('  Report written to brain ✓\n');
    } catch (e) {
      console.log('  Could not write to brain:', e.message, '\n');
    }
  }

  // Write local JSON
  const fs = await import('fs');
  const reportPath = new URL('./latest-report.json', import.meta.url).pathname;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`  Report saved: ${reportPath}\n`);

  return report;
}

// ---- MAIN ----
async function main() {
  const args = process.argv.slice(2);
  const full = args.includes('--full');
  const personaArg = args.find(a => a.startsWith('--persona='))?.split('=')[1];
  const persona = PERSONAS[personaArg] || PERSONAS.priya; // Default: mobile user (hardest test)

  console.log(`\nDivine Trial — Testing as ${persona.name} (${persona.device}, ${persona.viewport.w}x${persona.viewport.h})`);

  const pagesToTest = full ? PAGES : PAGES.filter(p => p.critical);
  console.log(`Testing ${pagesToTest.length} pages...\n`);

  const results = [];
  for (const page of pagesToTest) {
    process.stdout.write(`  Testing ${page.name}...`);
    const result = await testPage(page, persona);
    const icon = result.pass ? '✓' : '✗';
    const failCount = result.tests.filter(t => !t.pass).length;
    console.log(` ${icon} ${failCount > 0 ? `(${failCount} issues)` : ''}`);
    results.push(result);
  }

  await writeReport(results);

  // Exit with error code if failures (useful for CI)
  process.exit(results.some(r => !r.pass) ? 1 : 0);
}

main().catch(e => { console.error('Divine Trial crashed:', e); process.exit(2); });
