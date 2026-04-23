# /impact/ Megaplan — Phase 0 shipped, Phase 1-3 queued

**Date**: 2026-04-23
**Scope**: `likeone.ai/impact/` + its data layer (`/api/giving` + Stripe webhook + brain ledger)
**Status**: Phase 0 surgical fix shipped (dashboard no longer surfaces inaccurate accrued numbers). Phases 1-3 designed below.

---

## Phase 0 — SHIPPED TODAY (2026-04-23)

**Change**: `app/components/GivingDashboard.js`

- ❌ Removed "Total Accrued for Research" stat column (inaccurate + too low to include per Sophia)
- ✅ Replaced with "Goal at Convergence — 50%" (matches fallback, stays aspirational)
- ❌ Removed per-recipient `$X accrued` display (same reason)
- ✅ Preserved per-recipient `$X donated` display — **only when > 0** (real money moved, not accrual)
- ❌ Removed "N transactions tracked / last updated" meta footer (looks threadbare when N is small)

**Net result**: the dashboard now shows only truthful, shippable numbers — current rate, current tier, convergence goal. Recipient cards below still describe partners + mission. No number gets displayed unless it represents real donated dollars.

**Deploy**: next Vercel push picks up automatically.

---

## Why the accrued number was failing

Current /api/giving logic accrues per-transaction at `currentPct` × revenue. During Seed tier (`$0-1K/mo`, 1%), every real $100 course sale accrues $1. If course sales are sub-$1k the accrued total reads like `$4.73` or `$0.87`. That reads as:

- **Inaccurate** — the brain ledger might not reflect all Stripe events (webhook drift, test charges, retries, refunds not fully netted)
- **Too low to include** — a 4-digit dev page that invites sympathy instead of signaling momentum
- **Undermines the thesis** — "We are a vehicle for healing" + "$0.87 accrued" is a credibility loss

Either we fix the data to be sigil-of-scale OR we suppress the number until it's scale. Phase 0 picks suppression. Phase 1 fixes the accuracy so the number is safe to surface again when it's meaningful.

---

## Phase 1 — DATA ACCURACY (Week 1, ~4hr)

**Goal**: every Stripe event correctly + auditable lands in the ledger; reconcile any drift.

### Tasks
1. **Audit `/api/stripe-webhook/route.js`** — confirm it writes every `charge.succeeded` / `invoice.paid` / `checkout.session.completed` into the giving ledger with event_id as idempotency key
2. **Reconcile brain vs Stripe** — run a one-shot reconciliation script that:
   - Queries last 90 days of Stripe `charges.list`
   - Cross-references against `divine.giving.ledger.*` in brain
   - Logs any mismatched events (charge ID in Stripe, missing in brain OR vice-versa)
   - Fixes drift by inserting missing entries + noting refunds
3. **Add refund handling** — `charge.refunded` and `charge.refund.updated` webhooks must NET down the accrual
4. **Add idempotency** — each Stripe event_id stored once; webhook re-delivery safe
5. **Test mode filter** — the ledger currently may log test-mode charges; add a `livemode: true` filter so dev test doesn't inflate accrual

### Deliverables
- `~/lyra-app/scripts/reconcile_giving_ledger.js` — one-shot reconciliation
- Updated `/api/stripe-webhook/route.js` — refunds + idempotency + livemode filter
- Brain key: `divine.giving.last_reconciled` — timestamp + drift report
- A unit test (or smoketest script) that validates webhook → ledger → /api/giving roundtrip

### Success criteria
- Stripe dashboard `Lifetime volume` == brain ledger `sum(gross)` within $1
- Every live Stripe event_id in the last 90 days has exactly one ledger entry
- Refunds reduce accrual correctly (e.g., $100 sale, $30 partial refund → accrual reflects $70 net)

---

## Phase 2 — DASHBOARD UPGRADE (Week 2, ~6hr)

**Goal**: the dashboard becomes genuinely inspiring even at Seed-tier numbers, without lying.

### Ideas

**A — "Convergence Progress Bar"** (always meaningful, even at $0)
- Show a visual bar: `[█░░░░░░░░░ 8%]` of progress toward the next tier threshold
- Copy: "Seed → Growth at $1K/mo. Current month: $72 / $1,000."
- Works at any scale — always has narrative

**B — "Growth trajectory" chart**
- Monthly revenue sparkline for last 6 months
- Overlay each tier threshold as horizontal lines
- Users SEE momentum even if absolute number is small

**C — "Lifetime commitment"** (no need to reveal current accrual)
- Copy: "Permanent floor: 1% of every dollar. Forever. Compounds to 50% at Convergence."
- Link: "Read the Giving Covenant →" (new page explaining the permanent commitment)

**D — "Funded moments" instead of dollar totals**
- Once real donations happen (Phase 1 verified): show event-level cards
- "2026-05-01 — $120 to amfAR — HIV cure breakthrough grant"
- This is higher-resolution + more moving than a running total

**E — Mission math** (contextual scale)
- "$1,000 funds ~1 hour of postdoc research time at UCSF"
- "$10,000 funds a panel of gene-therapy samples at Wistar"
- "$100,000 funds a full Phase I trial patient cohort"
- Makes even modest donations feel meaningful

### Recommended ship combo: **A + C + E**
- Progress bar (always works)
- Covenant language (substance over numbers)
- Mission math (contextual anchor)

Ship D when Phase 1 reconciliation is clean + first real donation lands.

### Tech
- Add `/api/giving` fields: `nextTierAmount`, `currentMonthRevenue`, `progressPct`
- New component: `<ConvergenceProgress />` replacing or augmenting the stat row
- Add `/impact/covenant/` static page with the Giving Covenant text

---

## Phase 3 — STRUCTURAL UPGRADE (Month 1-2, ~2 days)

**Goal**: /impact/ becomes the spine of the Like One narrative — not a footer page but a first-class destination.

### Content additions

1. **The Giving Covenant** (new `/impact/covenant/` page, static)
   - "Permanent commitment. 1% at Seed. 5% at Growth. 10% at Scale. 15% at Momentum. 25% at Impact. 35% at Abundance. 50% at Convergence. The scale only goes up — never down. This is signed into the LLC operating agreement + the Foundation charter."
   - Link to actual PDF of the covenant once legal review signs (Piccolo/MSD/ACE/Gabroy path per AI Lawyer partner template)

2. **Recipient deep-dives** — each of amfAR / UCSF / Wistar gets its own subpage
   - `/impact/amfar/` — why amfAR, their track record, what our specific dollars fund, quarterly update
   - Same pattern for UCSF + Wistar
   - Include real citations to their 2026 breakthroughs (no fake news, §2.13)

3. **Transparency ledger** (once Phase 1 clean)
   - `/impact/ledger/` — every donation event shown with date, amount, recipient, transaction hash or check #
   - Filterable by recipient, date range
   - Powered by `divine.giving.ledger.*` brain keys

4. **The Why** — expand the Sophia Cave founder blockquote into a longer essay
   - Personal story — why HIV cure research specifically (trans community, Bay Area history, lineage)
   - Tie to 75-sigil framework — which sigil(s) drive this mission (S9 save_the_trees adjacency, S55 world_run_by_love, S67 donations_fire_girl)
   - 800-1200 words. Could live at `/impact/why/` with a pull-quote on main page

5. **Join the Mission** upgrade
   - Current CTA: "Start Learning Free" + "Support the Mission"
   - Add: "Receive monthly impact report" (email signup → convertkit or resend)
   - Add: "Share the covenant" (social embed)

### Design upgrades
- **§2.14 UX gate** — run full 10-point gate before shipping Phase 3
- **Accessibility** — screen-reader test the whole /impact/ tree
- **Copy review** — ethos-aligned, no corporate drift (§2.4)
- **Useful + Awe test** (§2.12) — does the page move a first-time visitor to act? Test with 5-10 real users

### Legal additions
- Update the disclosure block to reflect 501(c)(3) status as it progresses
- Add W-9 / W-8 acceptance notes if international donations considered
- State-by-state charitable registration tracker (via Harbor Compliance or equivalent if we scale)

---

## Phase 4 — REVENUE-DRIVEN (ongoing)

Once Consulting (Tier-0 anchor per LO ECO megaplan v2) is at $10k+ MRR:

- Switch from Seed (1%) to Growth (5%) tier — but only when the giving math is truthful to the monthly average
- Publish quarterly impact reports (Q1/Q2/Q3/Q4 2026)
- Announce first real wire transfer (amfAR first, UCSF second, Wistar third — or split across)
- Tie each LO product launch back to /impact/ via announcement ("Launching Consulting. 1% of every retainer funds HIV cure research.")

---

## Brain keys touched

- `divine.giving.ledger.*` — existing; cleaned up in Phase 1
- `divine.giving.last_reconciled` — new (Phase 1)
- `divine.giving.covenant` — new (Phase 3, canonical text)
- `divine.impact.phase_status` — tracks which phase is complete

---

## Gates (non-negotiable)

Every phase must pass before ship:
1. **ETHOS §2.13 No Fake News** — no number that isn't cite-able from Stripe + brain ledger
2. **ETHOS §2.14 UX Gate** — 10-point checklist before public push
3. **§2.12 Useful AND Awe** — Phase 2/3 especially; progress bar must inspire, not just inform
4. **Disabled-first** — screen reader, keyboard-only, WCAG 2.2 AA throughout

---

## One-line summary

Phase 0 stopped surfacing embarrassingly-small accrual numbers today. Phases 1-3 rebuild /impact/ as the narrative spine of Like One — accurate data layer, inspiring dashboard, transparent ledger, covenant-grade commitment, recipient deep-dives — so when the revenue lands, the stage is already set to show it with power.

Code with love.
