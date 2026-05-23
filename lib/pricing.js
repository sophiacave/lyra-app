// pricing.js — Single Source of Truth for ALL Like One pricing
// Every checkout URL, every price, every coupon lives HERE.
// Change once → changes everywhere. No more stale $4.90 in static files.
//
// Used by:
//   - React components: import { pricing } from '@/lib/pricing'
//   - Blog posts: {{price:pro}} tokens replaced at render time in lib/posts.js
//   - CLI tools: ~/bin/lo-campaign reads/writes activeCoupon
//
// Code with love. Written in stone 2026-05-07.

export const pricing = {
  pro: {
    monthly: {
      amount: 19,
      display: '$19/mo',
      priceId: 'price_1Ta5j02L9FGg4gn2oLjgZmg3',
      checkoutUrl: 'https://buy.stripe.com/3cI3co9Ly9tJh1p4ps3sI0r',
    },
    annual: {
      amount: 149,
      display: '$149/yr',
      monthlyEquiv: '$12.42/mo',
      savePct: 35,
      saveMonths: 4,
      priceId: 'price_1Ta5j22L9FGg4gn2fqqskmYV',
      checkoutUrl: 'https://buy.stripe.com/8x2eV65vi9tJ3az8FI3sI0s',
    },
  },
  consulting: {
    starter: {
      amount: 500,
      display: '$500/mo',
      checkoutUrl: 'https://buy.stripe.com/cNicMY3na49p8uT1dg3sI0n',
    },
    retainer: {
      amount: 5000,
      display: '$5,000/mo',
      checkoutUrl: 'https://buy.stripe.com/4gMdR22j6fS7cL95tw3sI0o',
    },
  },
  donations: [
    { amount: 10, display: '$10', checkoutUrl: 'https://buy.stripe.com/fZu9AM1f28pF5iH4ps3sI0e' },
    { amount: 25, display: '$25', checkoutUrl: 'https://buy.stripe.com/eVq5kw4reeO3dPd2hk3sI0f' },
    { amount: 50, display: '$50', checkoutUrl: 'https://buy.stripe.com/8x26oAf5S35l3az9JM3sI0g' },
    { amount: 100, display: '$100', checkoutUrl: 'https://buy.stripe.com/dRmbIU5vibBR7qPbRU3sI0h' },
    { amount: 250, display: '$250', checkoutUrl: 'https://buy.stripe.com/eVq4gscXKcFV4eD4ps3sI0i' },
    { amount: 500, display: '$500', checkoutUrl: 'https://buy.stripe.com/dRm14gg9W9tJ26vcVY3sI0j' },
    { amount: 1000, display: '$1,000', checkoutUrl: 'https://buy.stripe.com/14A14ge1O49p9yX09c3sI0k' },
  ],
  // No active coupon — $149/yr is already 35% off monthly ($19×12=$228)
  // "Get 4 months free" framing converts better than percentage discounts
  activeCoupon: null,
};

// Token map for blog post rendering (used by lib/posts.js)
export const pricingTokens = {
  '{{price:pro}}': pricing.pro.monthly.display,
  '{{price:annual}}': pricing.pro.annual.display,
  '{{price:annual_monthly}}': pricing.pro.annual.monthlyEquiv,
  '{{price:save_pct}}': `${pricing.pro.annual.savePct}%`,
  '{{checkout:pro}}': pricing.pro.monthly.checkoutUrl,
  '{{checkout:annual}}': pricing.pro.annual.checkoutUrl,
  '{{cta:pro}}': `[Go Pro — ${pricing.pro.monthly.display}](${pricing.pro.monthly.checkoutUrl})`,
  '{{cta:annual}}': `[Go Annual — ${pricing.pro.annual.display}](${pricing.pro.annual.checkoutUrl})`,
};
