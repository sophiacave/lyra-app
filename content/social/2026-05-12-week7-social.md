# Week 7 Social Drafts (May 12-15, 2026)
## Nova Content Agent — Like One

---

## POST 1: Liquid Glass UI Tutorial (May 12)

### X/Twitter Thread (4 posts)

**1/4**
We rebuilt our entire academy UI with Apple's Liquid Glass design language.

No library. No framework. Pure CSS + SVG filters.

Here's the exact system (30+ design tokens, ~120 lines of CSS): 🧵

**2/4**
The mistake everyone makes: `backdrop-filter: blur()` and done.

That's frosted glass from 2020.

Real Liquid Glass = refraction + luminance + specular highlights + chromatic behavior.

You need SVG feTurbulence + feDisplacementMap. That's the secret.

**3/4**
The system:
→ 30+ CSS custom properties (blur, saturation, specular, edge luminance)
→ SVG filter stack for refraction
→ 5 component variants (card, panel, button, input, badge)
→ Dark mode with inverted physics
→ prefers-reduced-motion fallback

All composable. All tunable.

**4/4**
Full tutorial with production code:
[link]

No dependencies. No build step changes. Just CSS doing what CSS was meant to do.

### LinkedIn

We just rebuilt the Like One Academy interface using Apple's Liquid Glass design system.

Not with a UI library. With 30 CSS custom properties and an SVG filter block.

The entire system is ~120 lines of CSS. It's theme-aware, responsive, and accessible.

Key insight that most tutorials miss: Liquid Glass isn't just backdrop-filter blur. It's refraction via SVG displacement maps, specular highlights via pseudo-element gradients, and inverted luminance physics for dark mode.

Full tutorial with production code → [link]

#CSS #WebDevelopment #UIDesign #Frontend #LiquidGlass

### Instagram/Threads

Apple introduced Liquid Glass. Everyone wants it. Most implementations look like a smudged window.

We built the real thing for our academy. Pure CSS. No frameworks.

The secret: SVG displacement maps for refraction + CSS custom properties for everything else.

30 tokens. 120 lines. Full dark mode. Accessible.

Tutorial link in bio.

---

## POST 2: AI for Nonprofits Guide (May 14)

### X/Twitter Thread (4 posts)

**1/4**
We filed our 501(c)(3) in one day using AI.

The IRS approved it.

Here's the complete playbook for nonprofits automating with AI (spoiler: the whole stack costs $20/month): 🧵

**2/4**
The 5 workflows every nonprofit should automate first:

1. Grant writing (40hrs → 6hrs per application)
2. Donor thank-yous (same-day, personalized)
3. Impact reporting (one data pull → 3 report formats)
4. Volunteer matching & event logistics
5. Financial operations (990 prep, budget variance, forecasting)

**3/4**
The $20/month nonprofit AI stack:

→ Claude Pro: $20
→ Make.com (free tier): $0
→ Google Workspace (nonprofit): $0
→ Airtable (free tier): $0
→ Canva (nonprofit): $0
→ Mailchimp (free tier): $0

If you have a 501(c)(3) letter, most platforms give you free access. Use it.

**4/4**
The nonprofits adopting AI now won't just save time.

They'll serve more people, write stronger grants, and retain more donors — with the same team.

Full guide with prompt templates and workflows → [link]

### LinkedIn

We built Like One Foundation's entire 501(c)(3) infrastructure in a single day using AI.

Bylaws. Articles of incorporation. Conflict of interest policies. Grant research. Fundraising copy. All filed. IRS approved.

Traditional timeline for the same work: 3-6 months.

That's not a marginal improvement. That's a category shift in what a small nonprofit can accomplish.

I wrote the complete guide for nonprofits ready to automate: grant writing, donor management, impact reporting, and operations.

The entire stack costs $20/month. Everything else is free for registered nonprofits.

Your mission is too important for manual processes.

Full guide → [link]

#Nonprofit #AIAutomation #GrantWriting #501c3 #SocialImpact #NonprofitTech

### Instagram/Threads

The average grant application takes 40 hours.

With AI: 6 hours for the first draft.

We filed our entire 501(c)(3) — bylaws, articles, policies, application — in ONE DAY.

The IRS approved it.

Wrote a complete guide for nonprofits: 5 workflows to automate, prompt templates, and a $20/month tech stack.

Link in bio.

---

## EMAIL NEWSLETTER (May 12 — covers both posts)

**Subject:** We rebuilt everything in glass (+ the nonprofit AI playbook)

**Preview:** Liquid Glass CSS tutorial + how we filed 501(c)(3) in one day

**Body:**

Two new posts this week:

**1. Liquid Glass UI with Pure CSS**
Apple's new design language, built from scratch. No frameworks. 30 CSS tokens, SVG filters, and dark mode with inverted luminance physics. Full production code included.
→ Read the tutorial

**2. AI for Nonprofits: The Complete Guide**
We filed our 501(c)(3) in a day. Now here's the playbook: grant writing automation, donor management, impact reporting, and a $20/month stack. Prompt templates included.
→ Read the guide

Both posts are packed with code and workflows you can steal today.

— Sophia
Like One
