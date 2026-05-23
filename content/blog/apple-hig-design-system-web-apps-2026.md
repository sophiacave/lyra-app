---
title: "Stealing Apple's Design Language for Your Web App (Without the Dogma)"
slug: "apple-hig-design-system-web-apps-2026"
date: "2026-05-19"
author: "Sophie Cave"
excerpt: "Apple's Human Interface Guidelines are the best design system ever written. Most web developers ignore them. Here's how we extracted the principles that matter — glass effects, spatial hierarchy, motion — and built a production component library in plain CSS."
tags: ["Design Systems", "Apple HIG", "CSS", "Frontend", "Web Performance", "UI Components"]
image: "/blog/apple-hig-web.webp"
published: false
---

# Stealing Apple's Design Language for Your Web App

Every time you open a native Apple app, something feels *right*. The blur behind a modal. The weight of a button. The way content fades in instead of popping.

Then you open most web apps and it feels like switching from a Porsche to a shopping cart.

The difference isn't budget. It's principles. Apple publishes their entire design philosophy for free in the [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/). Most web developers have never read them.

We did. Then we extracted what actually works on the web and built a production component library around it. No Tailwind. No component framework. Just CSS custom properties and semantic HTML.

Here's what we took, what we left behind, and why your web app probably needs this.

## The Three Principles Worth Stealing

Apple's HIG is massive. Hundreds of pages covering everything from watchOS complications to visionOS spatial layouts. Most of it doesn't apply to web. But three principles translate perfectly:

### 1. Depth Through Translucency

Native macOS uses `NSVisualEffectView` to create frosted glass behind panels. It's not decoration — it communicates layer hierarchy. When you can *see through* a surface, your brain automatically understands it's floating above content.

CSS `backdrop-filter` gives you this for free:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
}

@media (prefers-color-scheme: dark) {
  .glass-panel {
    background: rgba(30, 30, 30, 0.72);
    border-color: rgba(255, 255, 255, 0.08);
  }
}
```

The `saturate(1.8)` is the part most people miss. Apple's glass doesn't just blur — it *enriches* the colors underneath. Without saturation boost, glass panels look washed out.

**Browser support:** `backdrop-filter` works in every modern browser. Safari had it first. Firefox caught up in 2022. If you need a fallback, use a solid background with reduced opacity — the experience degrades gracefully.

### 2. Spatial Consistency Through Spacing Scales

Apple doesn't use arbitrary spacing. Every element is placed on a 4pt/8pt grid. This creates visual rhythm that your eye follows without thinking about it.

We implemented this as CSS custom properties:

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}
```

Every margin, padding, and gap in the application uses these tokens. No magic numbers. When everything snaps to the same grid, the whole interface feels *intentional* — even if users can't articulate why.

**The rule:** If you're typing a pixel value that isn't in your scale, you're probably wrong. Add it to the scale or pick the nearest value.

### 3. Motion as Communication

Apple's animations aren't aesthetic choices. They're *information*. A modal sliding up tells you it's covering content temporarily. A sidebar sliding in tells you it's revealing something that was always there.

Most web animations are wrong because they're decorative. They bounce, they spin, they fade for no reason. Apple's approach: motion should answer "where did this come from?" and "where is it going?"

```css
:root {
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

The `prefers-reduced-motion` override isn't optional. It's an accessibility requirement. Vestibular disorders are more common than color blindness. If your animation framework doesn't respect this media query, fix it today.

## Building the Component Library

With those three principles as constraints, we built five primitives that cover 90% of UI needs:

### Button

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 0.9375rem;
  line-height: 1.4;
  transition: all var(--duration-fast) var(--ease-default);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.btn-primary:active {
  filter: brightness(0.95);
  transform: translateY(0);
}
```

The `translateY(-1px)` on hover is subtle but critical. Apple buttons lift slightly when you hover — it communicates "this is pressable." The `:active` state pushes back down. Physical metaphor. No gratuitous animation.

### Card

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  transition: transform var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
```

### Loading Skeleton

Most loading states are spinners. Spinners tell users "wait" without telling them "for what." Skeleton screens show the *shape* of incoming content:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-skeleton) 25%,
    var(--color-skeleton-highlight) 50%,
    var(--color-skeleton) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

This is the Apple approach: show structure before content. The shimmer animation communicates activity without demanding attention.

## The Performance Win You Didn't Expect

Here's the part nobody talks about when discussing design systems: **performance**.

When we rebuilt our component library with HIG principles, we also eliminated every external dependency:

- **Fonts:** Switched from Google Fonts CDN to `next/font` with self-hosted Inter and DM Serif Display. Zero external font requests. No layout shift from font loading. ~200ms faster First Contentful Paint.
- **CSS Framework:** No Tailwind, no Bootstrap, no Chakra. Custom properties + semantic classes. Total CSS: ~8KB gzipped.
- **Icon Library:** No Font Awesome, no icon font. Inline SVGs only.
- **Animation Library:** No Framer Motion, no GSAP. CSS transitions and `@keyframes` only.

The result: our Lighthouse performance score went from 82 to 97 after the design system migration. Not because we optimized — because we *subtracted*.

**The lesson:** Every dependency you add to make your UI "better" is fighting against the browser's native rendering pipeline. The browser already knows how to animate transforms on the GPU. It already has a font rendering engine. It already handles `backdrop-filter` in the compositor thread. Use what's there.

## Error Boundaries: The UX Nobody Designs

Apple apps rarely crash visibly. When something goes wrong, you get a gentle empty state — not a white screen of death.

We implemented error boundaries that follow this pattern:

```jsx
// Simplified — the real component handles more edge cases
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
        Something didn't load right.
      </p>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-sm)' }}>
        This section hit an error. The rest of the app is fine.
      </p>
      <button className="btn btn-primary" onClick={resetErrorBoundary}
              style={{ marginTop: 'var(--space-md)' }}>
        Try Again
      </button>
    </div>
  )
}
```

The key phrase: "The rest of the app is fine." Partial failure is normal. Users understand it when you communicate it clearly. A full-page error screen is a design failure, not a code failure.

## What We Left Behind

Not everything in Apple's HIG works for web:

- **SF Symbols.** Apple's icon system is incredible but platform-locked. We use inline SVGs instead. They're more accessible and they scale without a font rendering engine.
- **Haptic feedback.** Obviously. Although the Vibration API exists on mobile, using it for UI feedback on web feels alien.
- **Navigation patterns.** Tab bars, sidebars, and split views are deeply tied to Apple's platform conventions. Web users expect different navigation patterns. We didn't try to make our web app feel like a Mac app — we took the *visual* language and applied it to *web* interaction patterns.
- **System fonts only.** Apple uses San Francisco everywhere. We chose to self-host Inter (a font explicitly designed to work at small sizes on screens) and DM Serif Display (for editorial contrast). The HIG says "use the system font" — but the principle behind that advice is "use a font optimized for screens," which Inter absolutely is.

## How to Start

You don't need to rebuild everything. Start with three changes:

**1. Add the spacing scale.** Replace every pixel value in your CSS with custom properties from a 4/8pt grid. This alone will make your interface feel more coherent.

**2. Audit your transitions.** Every `transition` in your CSS should have a purpose. If you can't explain what information the animation communicates, remove it. Add `prefers-reduced-motion` support.

**3. Kill one dependency.** Pick your heaviest UI dependency — the icon font, the CSS framework, the animation library — and replace it with native browser features. Measure the performance difference. You'll be surprised.

The best design systems aren't the most comprehensive. They're the most constrained. Apple figured this out decades ago. The web is finally catching up.

---

*We're building Like One's entire infrastructure in public — from the AI brain to the design system to the autonomous agents. Follow the build at [likeone.ai](https://likeone.ai).*
