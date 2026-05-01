---
title: "The Production AI Checklist"
course: "ai-systems-design"
order: 10
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>The Production <span class="accent">AI Checklist.</span></h1>
  <p class="sub">Everything that must be true before your AI system goes live.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>A comprehensive pre-launch checklist covering all nine domains</li>
    <li>How to run a production readiness review for AI systems</li>
    <li>Common launch failures and how to prevent each one</li>
    <li>Post-launch monitoring and iteration practices</li>
  </ul>
</div>

<div class="lesson-section">
<h2>The Nine Domains</h2>

Production readiness for AI systems spans nine domains. Missing any one of them leads to a specific class of failure. This checklist synthesizes everything from the previous nine lessons into a single actionable reference.

This is not a wish list. Every item exists because a real team learned its importance through a production incident. Treat unchecked items as risks, not aspirations.

<div class="callout">
<strong>How to use this checklist:</strong> Review it before every launch, major model change, or significant architecture update. Each item should have an owner and a verification method (automated test, manual review, or monitoring alert). Items marked [P0] are launch blockers. Items marked [P1] should be resolved within two weeks of launch.
</div>
</div>

<div class="lesson-section">
<h2>Domain 1-3: Foundation</h2>

**1. Architecture**
- [ ] [P0] System decomposed into independent, testable components (Gateway, Router, Pipeline/Orchestrator)
- [ ] [P0] No single points of failure in the critical path
- [ ] [P1] Component boundaries are documented with input/output contracts
- [ ] [P1] Architecture diagram exists and is current

**2. Reliability**
- [ ] [P0] Retry logic with exponential backoff and jitter on all external calls
- [ ] [P0] Circuit breakers on all model API calls
- [ ] [P0] Fallback chain with cross-provider models configured
- [ ] [P0] Timeout budgets allocated across all pipeline stages
- [ ] [P1] Graceful degradation tested: kill each dependency and verify behavior
- [ ] [P1] Local model fallback available as last resort

**3. Security**
- [ ] [P0] Input guardrails: injection pattern detection active
- [ ] [P0] Output guardrails: PII detection, system prompt leak prevention
- [ ] [P0] API keys in secret manager, not in code or prompts
- [ ] [P0] Rate limiting per user/API key
- [ ] [P1] Sandwich defense in prompt architecture
- [ ] [P1] AI-generated code runs in sandbox with no network access
- [ ] [P1] Red team exercise completed within last 30 days
</div>

<div class="lesson-section">
<h2>Domain 4-6: Operations</h2>

**4. Observability**
- [ ] [P0] Traces capture every stage: retrieval, generation, validation
- [ ] [P0] Metrics: latency (p50/p95/p99), error rate, token usage, cost per request
- [ ] [P0] Alerts configured: error rate > 5%, p99 > 30s, cost spike > 3x
- [ ] [P1] Dashboard showing cost attribution by feature, user tier, and model
- [ ] [P1] Quality scoring pipeline running on production traffic sample

**5. Cost Management**
- [ ] [P0] Token budgets enforced at request, session, and user level
- [ ] [P0] Model routing active: cheap models for simple tasks
- [ ] [P0] Budget alerts at 80% and 100% of monthly target
- [ ] [P1] Cost per successful request tracked (including retries)
- [ ] [P1] Prompt engineering reviewed for token efficiency

**6. Scaling**
- [ ] [P0] Queue-based architecture for tasks > 5 seconds
- [ ] [P0] Provider rate limits mapped and enforced in application layer
- [ ] [P1] Auto-scaling signals include queue depth and provider headroom
- [ ] [P1] Load tested at 3x expected peak traffic
- [ ] [P1] Caching layer active with measured hit rates
</div>

<div class="lesson-section">
<h2>Domain 7-9: Quality & Operations</h2>

**7. Quality Assurance**
- [ ] [P0] Evaluation dataset: 50+ test cases covering core use cases and edge cases
- [ ] [P0] Eval pipeline runs before every prompt change and model update
- [ ] [P0] Quality gate: changes that reduce eval scores do not ship
- [ ] [P1] LLM-as-judge scoring active for relevance, factuality, safety
- [ ] [P1] Human review workflow for flagged outputs

**8. Data & Privacy**
- [ ] [P0] PII scrubbed from logs, traces, and cached responses
- [ ] [P0] Data retention policy defined and enforced
- [ ] [P0] User consent collected for AI processing where required
- [ ] [P1] Model provider data usage policies reviewed (training opt-out confirmed)
- [ ] [P1] GDPR/CCPA deletion workflow tested

**9. Incident Response**
- [ ] [P0] On-call rotation established with AI-specific runbooks
- [ ] [P0] Kill switch: ability to disable AI features without full deployment
- [ ] [P1] Incident response playbook for: model outage, quality degradation, security breach, cost spike
- [ ] [P1] Post-incident review process defined

<div class="tip-box">
<strong>The kill switch is non-negotiable.</strong> You need the ability to disable AI features instantly -- via feature flag, not deployment -- when things go wrong. A model hallucinating harmful content at scale cannot wait for a 15-minute deploy cycle. Feature flags give you instant rollback.
</div>
</div>

<div class="lesson-section">
<h2>The Production Readiness Review</h2>

Schedule a formal review with your team before launch. Walk through each domain with the checklist. For every unchecked [P0] item, the question is not "can we launch without it?" but "what is the blast radius if this fails?"

```
Production Readiness Review Template
=====================================
Date:           _______________
System:         _______________
Reviewer(s):    _______________

For each domain:
  [ ] All P0 items checked and verified
  [ ] P1 items have owners and deadlines
  [ ] Risk accepted for any unchecked items (documented)

Launch decision:
  [ ] GO - All P0 complete
  [ ] CONDITIONAL GO - P0 complete, P1 gaps accepted with timeline
  [ ] NO GO - P0 gaps identified, must resolve before launch
```

Three common launch failures this review prevents:

1. **The prompt regression**: New system prompt deployed without eval pipeline. Quality drops 30%. Users churn. Prevention: Quality gate (Domain 7, P0).
2. **The cost explosion**: Retry storm on rate-limited API doubles monthly bill in 48 hours. Prevention: Budget alerts + circuit breakers (Domains 2 & 5, P0).
3. **The silent data leak**: Model returns user A's data in user B's response due to context contamination. Prevention: Output guardrails + PII scrubbing (Domains 3 & 8, P0).
</div>

<div class="lesson-section">
<h2>Post-Launch: The First 30 Days</h2>

Launch is not the finish line. The first 30 days are your validation period.

**Week 1**: Monitor everything. Watch dashboards daily. Expect surprises. Keep the team on high alert with fast response times.

**Week 2**: Analyze patterns. Which queries fail most? Where is cost concentrated? What does user feedback say about quality? Prioritize fixes.

**Week 3**: Optimize. Tune cache thresholds, adjust model routing based on real data, refine prompts based on eval results.

**Week 4**: Stabilize. Document operational patterns. Set up recurring reviews. Transition from launch mode to steady-state operations.

After 30 days, you should have a system that runs predictably, costs what you expected, and has clear paths for improvement. If you don't, something on this checklist was missed. Go back and find it.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What is the most critical operational safeguard for a production AI system?", "options": ["Comprehensive logging", "A kill switch via feature flag for instant AI feature disable", "Multiple model providers", "Automated scaling"], "correct": 1, "explanation": "A kill switch (feature flag) lets you disable AI features instantly without a deployment cycle. When a model is hallucinating harmful content at scale, you cannot wait 15 minutes for a deploy. Feature flags give you instant rollback."}, {"q": "When should the evaluation pipeline run?", "options": ["Only before the initial launch", "Weekly on a schedule", "Before every prompt change, model update, or significant system modification", "Only when users report issues"], "correct": 2, "explanation": "The eval pipeline is your quality gate. It should run before every prompt change, model update, or system modification. Changes that reduce eval scores do not ship. This prevents silent quality regressions."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the nine domains of the production AI checklist?", "back": "1) Architecture, 2) Reliability, 3) Security, 4) Observability, 5) Cost Management, 6) Scaling, 7) Quality Assurance, 8) Data & Privacy, 9) Incident Response."}, {"front": "What is the difference between P0 and P1 items?", "back": "P0 items are launch blockers -- the system should not go live without them. P1 items should be resolved within two weeks of launch. Unchecked P0 items require documented risk acceptance."}, {"front": "What are three common launch failures?", "back": "1) Prompt regression: new prompt without eval, quality drops 30%. 2) Cost explosion: retry storm doubles monthly bill in 48 hours. 3) Silent data leak: context contamination returns wrong user&#39;s data."}, {"front": "What should happen during the first 30 days post-launch?", "back": "Week 1: Monitor everything daily. Week 2: Analyze failure patterns and cost concentration. Week 3: Optimize caching, routing, and prompts. Week 4: Stabilize and document operational patterns."}, {"front": "What makes a production readiness review effective?", "back": "Walk through all nine domains with the team. Every unchecked P0 needs blast radius analysis. P1 items get owners and deadlines. Launch decision is GO, CONDITIONAL GO, or NO GO based on P0 completion."}]}'></div>

</div>