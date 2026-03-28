// site-config.js — Single Source of Truth for Like One
// Every page imports from here. Change once, change everywhere.

export const site = {
  name: 'Like One',
  domain: 'likeone.ai',
  url: 'https://likeone.ai',
  tagline: 'Human-AI Collaboration Platform',
  description: "What happens when human creativity meets AI intelligence? Like One is the platform proving that human-AI collaboration isn't the future — it's now. Built by Sophia Cave.",
  founder: 'Sophia Cave',
  email: 'hello@likeone.ai',
  phone: '+1 (702) 747-6877',
  phoneRaw: '+17027476877',
  copyright: '2026 Like One',
  ogImage: 'https://likeone.ai/og-image.png',
  ogImageSize: { width: 1200, height: 630 },
};

export const colors = {
  // Backgrounds
  pageBg: '#08080a',
  cardBg: '#111114',
  inputBg: '#0a0a0a',
  surfaceBg: '#0a0a0f',
  // Borders
  border: '#1e1e28',
  borderLight: '#2a2a2a',
  // Text
  textPrimary: '#e5e5e5',
  textSecondary: '#a0a0a0',
  textMuted: '#737373',
  textDim: '#525252',
  textBright: '#f0f0f0',
  textBody: '#cccccc',
  // Brand
  purple: '#c084fc',
  blue: '#38bdf8',
  pink: '#d93280',
  violet: '#6c5ce7',
  lavender: '#a78bfa',
  fuschia: '#f0abfc',
  teal: '#00b894',
  orange: '#fb923c',
  // Gradients (CSS strings)
  gradientBrand: 'linear-gradient(135deg, #c084fc, #38bdf8)',
  gradientCta: 'linear-gradient(135deg, #c084fc, #d93280)',
  gradientTeal: 'linear-gradient(135deg, #38bdf8, #00b8b0)',
  gradientViolet: 'linear-gradient(135deg, #6c5ce7, #c084fc)',
  gradientWarm: 'linear-gradient(135deg, #c084fc, #fb923c)',
  // Nav
  navBg: 'rgba(10,10,10,.95)',
  navBgBlog: 'rgba(10, 10, 15, 0.75)',
  navBgSite: 'rgba(8,8,10,.92)',
};

export const fonts = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
  googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
};

export const nav = {
  // Core nav links — consistent across all variants
  core: [
    { label: 'Academy', href: '/academy/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
  ],
  // Main nav used on products, calculator pages
  main: [
    { label: 'Academy', href: '/academy/' },
    { label: 'Products', href: '/products' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'Sign In', href: '/account/' },
  ],
  // Blog/academy nav
  blog: [
    { label: 'Academy', href: '/academy/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Forum', href: '/forum/' },
    { label: 'Sign In', href: '/account/' },
  ],
  // Site-wide nav (static pages: about, pricing, support, etc.)
  site: [
    { label: 'Academy', href: '/academy/' },
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Forum', href: '/forum/' },
    { label: 'Sign In', href: '/account/' },
    { label: 'Support', href: '/support/' },
  ],
};

// Academy stats — keep in sync with content/academy/courses.json
export const academy = {
  courseCount: 30,
  liveCourseCount: 30,
  lessonCount: 297,
  exerciseCount: 582,
  monthlyPrice: '$4.90/mo',
  annualPrice: '$39/yr',
  monthlyLabel: 'Founding Member',
  ctaText: 'Like One Academy',
  ctaDescription: '30 courses, 300+ interactive lessons.',
};

export const footer = {
  text: `\u00A9 ${site.copyright} \u2014 Built by ${site.founder}.`,
  blogText: `${site.url} \u00B7 ${site.email} \u00B7 ${site.phone}`,
  links: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' },
    { label: 'Refund Policy', href: '/terms/#refunds' },
  ],
};
