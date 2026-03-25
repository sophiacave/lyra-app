/**
 * LIKE ONE ACADEMY — Shared Navigation v1.0
 * Injects a consistent nav bar + footer on every academy page.
 * Knows which course/lesson you're on and provides clear wayfinding.
 */
(function() {
  const path = location.pathname;
  const parts = path.split('/').filter(Boolean);
  // parts: ['academy'] or ['academy','course-slug'] or ['academy','course-slug','lesson.html']
  const isHub = parts.length <= 1 || (parts.length === 2 && parts[1] === 'index.html');
  const courseSlug = parts.length >= 2 ? parts[1] : '';
  const lessonFile = parts.length >= 3 ? parts[2] : '';
  const isLesson = lessonFile && lessonFile !== 'index.html';
  const isSpecialPage = ['signin.html', 'community.html'].includes(lessonFile || parts[1]);

  // Don't inject on hub or special pages that have their own nav
  if (isHub || isSpecialPage) return;

  // Course display names
  const COURSE_NAMES = {
    'ai-pet-lab': 'AI Pet Lab',
    'ai-foundations': 'AI Foundations',
    'automation-architect': 'Automation Architect',
    'claude-mastery': 'Claude Mastery',
    'ai-stack-builder': 'AI Stack Builder',
    'the-automation-lab': 'The Automation Lab',
    'rag-vector-search': 'RAG & Vector Search',
    'ai-for-business': 'AI for Business',
    'first-ai-agent': 'First AI Agent',
    'mcp-masterclass': 'MCP Masterclass'
  };

  const courseName = COURSE_NAMES[courseSlug] || courseSlug;

  // Create nav bar
  const nav = document.createElement('div');
  nav.id = 'lo-nav';
  nav.innerHTML = `
    <style>
      #lo-nav { position: sticky; top: 0; z-index: 999; background: rgba(10,10,15,.95); backdrop-filter: blur(12px); border-bottom: 1px solid #1e1e28; padding: 0 1.5rem; font-family: Inter, sans-serif; }
      #lo-nav .lo-nav-inner { max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 48px; }
      #lo-nav a { color: #737373; text-decoration: none; font-size: .8rem; font-weight: 500; transition: color .2s; }
      #lo-nav a:hover { color: #e5e5e5; }
      #lo-nav .lo-nav-brand { color: #c084fc; font-weight: 700; font-size: .75rem; letter-spacing: 1px; text-transform: uppercase; }
      #lo-nav .lo-nav-crumb { display: flex; align-items: center; gap: 6px; font-size: .8rem; }
      #lo-nav .lo-nav-crumb .sep { color: #333; }
      #lo-nav .lo-nav-right { display: flex; align-items: center; gap: 12px; }
      #lo-nav .lo-nav-signin { color: #fb923c; font-weight: 600; font-size: .75rem; }
      @media (max-width: 600px) { #lo-nav .lo-nav-inner { height: 44px; } #lo-nav a { font-size: .75rem; } }
    </style>
    <div class="lo-nav-inner">
      <div class="lo-nav-crumb">
        <a href="/academy/">Academy</a>
        ${courseSlug ? `<span class="sep">›</span><a href="/academy/${courseSlug}/">${courseName}</a>` : ''}
      </div>
      <div class="lo-nav-right">
        <a href="/forum">Forum</a>
        <a href="/academy/community.html">Community</a>
        <a href="/academy/signin.html" class="lo-nav-signin">Sign In</a>
      </div>
    </div>
  `;

  // Insert at the very top of body
  document.body.insertBefore(nav, document.body.firstChild);

  // Also check if the existing nav in the page is redundant and hide it
  const existingNavs = document.querySelectorAll('.nav, .top-bar, nav:not(#lo-nav)');
  existingNavs.forEach(n => {
    // Only hide if it looks like a duplicate academy nav (has "Back" or "LIKE ONE" text)
    if (n.textContent.includes('Back to') || n.textContent.includes('LIKE ONE') || n.textContent.includes('← ')) {
      n.style.display = 'none';
    }
  });
})();
