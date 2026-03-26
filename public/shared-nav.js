// shared-nav.js — Canonical nav + footer for all static pages
// Single source of truth. Change once, change everywhere.
// Add to any static HTML: <script src="/shared-nav.js"></script>

(function () {
  const NAV_LINKS = [
    { label: 'Academy', href: '/academy/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Forum', href: '/forum' },
    { label: 'Sign In', href: '/account' },
    { label: 'Support', href: '/support' },
  ];

  const FOOTER = {
    builtBy: 'Sophia Cave',
    email: 'hello@likeone.ai',
    phone: '+1 (702) 747-6877',
    phoneRaw: '+17027476877',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  // Detect active page from pathname
  function isActive(href) {
    var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    var linkPath = href.replace(/\.html$/, '').replace(/\/$/, '');
    if (path === '' && linkPath === '') return true;
    if (linkPath === '') return false;
    return path === linkPath || path.startsWith(linkPath + '/');
  }

  // Build nav HTML
  function buildNav() {
    var linksHtml = NAV_LINKS.map(function (link) {
      var cls = isActive(link.href) ? ' class="nav-active"' : '';
      return '<li><a href="' + link.href + '"' + cls + '>' + link.label + '</a></li>';
    }).join('\n        ');

    return '<nav>\n' +
      '      <div><a href="/" class="logo">like<span>one</span></a></div>\n' +
      '      <button class="mobile-toggle" aria-label="Toggle menu">&#9776;</button>\n' +
      '      <ul class="nav-links">\n        ' + linksHtml + '\n      </ul>\n' +
      '    </nav>';
  }

  // Build footer HTML
  function buildFooter() {
    var footerLinks = FOOTER.links.map(function (link) {
      return '<a href="' + link.href + '">' + link.label + '</a>';
    }).join(' &bull; ');

    return '<div style="max-width:1100px;margin:0 auto;">\n' +
      '    <div class="logo-sm">like<span>one</span></div>\n' +
      '    <p style="margin-bottom:.5rem;">Built by ' + FOOTER.builtBy + '. Powered by convergence.</p>\n' +
      '    <p>&copy; 2026 Like One. All rights reserved. &bull; ' +
      '<a href="mailto:' + FOOTER.email + '">' + FOOTER.email + '</a> &bull; ' +
      '<a href="tel:' + FOOTER.phoneRaw + '">' + FOOTER.phone + '</a></p>\n' +
      '    <p style="margin-top:8px">' + footerLinks + '</p>\n' +
      '  </div>';
  }

  // Inject nav into first <header> with class site-header (or first <header>)
  function injectNav() {
    var header = document.querySelector('header.site-header') || document.querySelector('header');
    if (!header) return;
    header.classList.add('site-header');
    header.innerHTML = buildNav();

    // Mobile toggle
    var toggle = header.querySelector('.mobile-toggle');
    var links = header.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('active');
      });
    }
  }

  // Inject footer into last <footer> with class site-footer (or last <footer>)
  function injectFooter() {
    var footers = document.querySelectorAll('footer');
    var footer = document.querySelector('footer.site-footer') || footers[footers.length - 1];
    if (!footer) return;
    footer.classList.add('site-footer');
    footer.innerHTML = buildFooter();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectNav();
      injectFooter();
    });
  } else {
    injectNav();
    injectFooter();
  }
})();
