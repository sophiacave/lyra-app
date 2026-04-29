---
title: "How to Build Apple's Liquid Glass UI with Pure CSS (No Framework Required)"
description: "Step-by-step tutorial for building Apple-inspired frosted glass, refraction, and luminance effects using CSS custom properties and SVG filters. Real code from our production redesign."
date: "2026-05-12"
author: "Sophia Cave"
category: "Technical"
tags: ["css", "ui-design", "liquid-glass", "apple-design", "frontend", "tutorial", "web-development"]
image: "/images/blog/liquid-glass-ui.jpg"
pillar: "AI Implementation"
readTime: "12 min"
seoTitle: "Liquid Glass UI Tutorial: Build Apple-Inspired CSS Effects in 2026"
seoDescription: "Learn how to build Apple's liquid glass design system with pure CSS custom properties and SVG filters. Production-ready code with 30+ design tokens."
---

# How to Build Apple's Liquid Glass UI with Pure CSS

Apple's WWDC 2025 introduced Liquid Glass — a translucent, refractive design language that makes everything before it look flat. Within six months, every SaaS landing page will try to copy it. Most will fail.

We just rebuilt our entire academy UI with a Liquid Glass design system. Not a library. Not a framework dependency. Pure CSS custom properties and SVG filters that work everywhere.

Here's exactly how we did it.

## Why Liquid Glass Matters Beyond Aesthetics

Liquid Glass isn't decoration. It's a functional design pattern that:

- **Creates depth hierarchy** without shadows or borders
- **Reduces visual noise** by letting background context bleed through
- **Signals interactivity** through refraction shifts on hover/focus
- **Improves accessibility** when done right — high contrast text on soft backgrounds

The trap most developers fall into: reaching for `backdrop-filter: blur()` and calling it done. That gives you frosted glass from 2020. Liquid Glass is different. It's refraction, luminance, specular highlights, and chromatic behavior all working together.

## The Design Token Foundation

Start with CSS custom properties. This is the system that makes everything composable:

```css
:root {
  /* Core glass properties */
  --liquid-blur: 24px;
  --liquid-saturation: 1.8;
  --liquid-brightness: 1.15;
  --liquid-opacity: 0.72;

  /* Refraction layer */
  --liquid-refraction-scale: 1.02;
  --liquid-refraction-offset: 0.5px;
  --liquid-chromatic-shift: 0.3px;

  /* Specular highlights */
  --liquid-specular: rgba(255, 255, 255, 0.35);
  --liquid-specular-size: 60%;
  --liquid-specular-angle: 135deg;

  /* Edge behavior */
  --liquid-edge-luminance: rgba(255, 255, 255, 0.18);
  --liquid-edge-width: 1px;
  --liquid-edge-radius: 20px;

  /* Surface tinting */
  --liquid-tint: rgba(255, 255, 255, 0.06);
  --liquid-tint-dark: rgba(0, 0, 0, 0.04);

  /* Motion */
  --liquid-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --liquid-hover-brightness: 1.25;
  --liquid-hover-blur: 28px;
}
```

30+ tokens. Every visual property is tunable. This matters because Liquid Glass on a dark background needs completely different values than on a light one.

## The SVG Filter Stack

CSS `backdrop-filter` gets you halfway. For real refraction and chromatic effects, you need SVG filters embedded in your document:

```html
<svg class="liquid-filters" aria-hidden="true">
  <defs>
    <filter id="liquid-refraction">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015"
        numOctaves="3"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="3"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
    <filter id="liquid-glow">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
</svg>
```

Key insight: `feTurbulence` with `feDisplacementMap` creates the subtle warping effect that makes glass look like glass. Without it, you just have blur. The `baseFrequency` controls how "wavy" the refraction appears — keep it under `0.02` or it looks like a funhouse mirror.

## Building the Base Component

Here's the core `.liquid-card` class that everything else extends:

```css
.liquid-card {
  position: relative;
  background: var(--liquid-tint);
  backdrop-filter:
    blur(var(--liquid-blur))
    saturate(var(--liquid-saturation))
    brightness(var(--liquid-brightness));
  -webkit-backdrop-filter:
    blur(var(--liquid-blur))
    saturate(var(--liquid-saturation))
    brightness(var(--liquid-brightness));
  border: var(--liquid-edge-width) solid var(--liquid-edge-luminance);
  border-radius: var(--liquid-edge-radius);
  transition: all var(--liquid-transition);
  overflow: hidden;
}

/* Specular highlight layer */
.liquid-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--liquid-specular-angle),
    var(--liquid-specular) 0%,
    transparent var(--liquid-specular-size)
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
}

/* Hover state: glass brightens */
.liquid-card:hover {
  backdrop-filter:
    blur(var(--liquid-hover-blur))
    saturate(calc(var(--liquid-saturation) + 0.2))
    brightness(var(--liquid-hover-brightness));
  border-color: rgba(255, 255, 255, 0.28);
}
```

The `::before` pseudo-element creates the specular highlight — that bright streak across the top-left of Apple's glass panels. It's just a gradient, but positioned correctly it sells the illusion completely.

## Dark Mode: Invert the Physics

Liquid Glass on dark backgrounds needs inverted luminance logic:

```css
[data-theme="dark"] {
  --liquid-opacity: 0.65;
  --liquid-brightness: 0.85;
  --liquid-saturation: 2.0;
  --liquid-specular: rgba(255, 255, 255, 0.12);
  --liquid-edge-luminance: rgba(255, 255, 255, 0.08);
  --liquid-tint: rgba(255, 255, 255, 0.03);
  --liquid-tint-dark: rgba(0, 0, 0, 0.15);
}
```

The critical difference: on dark backgrounds, you **decrease** brightness and **increase** saturation. On light backgrounds, the opposite. This mimics how real glass behaves — a glass panel over a dark surface absorbs light, while one over a bright surface refracts it.

## Component Variants

From the base card, extend into your full system:

```css
/* Navigation panel — wider blur, subtler highlight */
.liquid-panel {
  --liquid-blur: 32px;
  --liquid-specular: rgba(255, 255, 255, 0.2);
  --liquid-edge-radius: 16px;
  padding: 1rem 1.5rem;
}

/* Interactive button — tighter radius, stronger response */
.liquid-btn {
  --liquid-blur: 16px;
  --liquid-edge-radius: 12px;
  --liquid-specular-size: 80%;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  font-weight: 600;
}

.liquid-btn:active {
  transform: scale(0.97);
  backdrop-filter: blur(12px) saturate(1.5) brightness(0.95);
}

/* Input field — inset glass effect */
.liquid-input {
  --liquid-blur: 12px;
  --liquid-tint: rgba(0, 0, 0, 0.03);
  --liquid-specular: rgba(255, 255, 255, 0.08);
  --liquid-edge-luminance: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 0.75rem 1rem;
}

/* Status badge — compact, high-contrast */
.liquid-badge {
  --liquid-blur: 8px;
  --liquid-edge-radius: 8px;
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Performance Considerations

`backdrop-filter` is expensive. It triggers compositing on every frame. Here's how to keep it performant:

1. **Limit glass surfaces to 3-5 per viewport.** Every glass element is a separate compositing layer.
2. **Use `will-change: backdrop-filter` sparingly.** Only on elements that actually animate.
3. **Reduce blur radius on mobile.** `24px` on desktop, `16px` on mobile. Users won't notice, but their GPU will.
4. **Skip SVG filters on low-power devices.** Use `prefers-reduced-motion` as a proxy:

```css
@media (prefers-reduced-motion: reduce) {
  .liquid-card {
    backdrop-filter: blur(12px);
    transition: none;
  }
  .liquid-card::before {
    display: none;
  }
}
```

5. **Test on real devices.** `backdrop-filter` renders differently across browsers. Safari (ironically) handles it best. Firefox still has edge cases with `saturate()`.

## The Result

Our academy went from flat cards on a gradient to a fully refractive glass interface in one session. No dependencies added. No build step changes. Just CSS custom properties and an SVG filter block.

The entire system is ~120 lines of CSS and ~15 lines of SVG. It's theme-aware, responsive, accessible, and performs well on mid-range devices.

## Steal This

Copy the token block. Paste it into your `globals.css`. Add the SVG filter to your layout. Start with `.liquid-card` and extend from there.

The tokens are the leverage. Change `--liquid-blur` from `24px` to `40px` and your entire UI shifts personality. Change `--liquid-specular-angle` and the light source moves. That's the power of a token-driven system — you're designing with physics, not pixels.

---

**Want to see it in action?** Our [Academy](https://likeone.ai/academy) runs entirely on this system. Every card, panel, button, and badge is Liquid Glass — no framework, no library, just CSS doing what CSS was always meant to do.
