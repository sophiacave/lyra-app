# Building the Business Case

**Course:** AI for Enterprise Strategy
**Order:** 2
**Type:** lesson
**Access:** Free

---
[← AI for Enterprise Strategy](/academy/ai-enterprise-strategy/)
  Lesson 2 of 10


  # Building the Business Case

  Every AI initiative lives or dies on the business case. Not the technology demo. Not the vendor pitch. The clear, compelling story of why this investment will return more value than the alternatives.


## Why Most AI Business Cases Fail

The graveyard of enterprise AI is full of technically brilliant projects that never got funded — or got funded once and never got funded again. The pattern is always the same: the team built a demo that impressed engineers but could not answer the CFO's only question: **"What does this do for us financially, and how do you know?"**

A business case is not a technology proposal. It is a financial argument supported by evidence. It translates "we can use machine learning to classify support tickets" into "we can reduce average ticket resolution time from 4.2 hours to 2.5 hours, saving $1.8M annually in support labor costs, with a 90-day pilot to validate the 20% improvement threshold."

The difference between an AI project that gets killed after the pilot and one that scales across the organization is almost never the quality of the model. It is the quality of the business case.


## The ROI Framework: Honest Math, Not Vendor Fantasy

Vendor ROI projections are fiction. They assume perfect implementation, instant adoption, and zero organizational friction. Your business case needs honest numbers — the kind that survive a skeptical CFO's cross-examination.

The framework has three steps:


1

**Quantify the Problem**
Start with the cost of the problem you are solving — not the value of the solution you are buying. Quantify the current cost: labor hours, error rates, customer churn, missed opportunities, compliance risk. If you cannot put a dollar figure on the pain, you do not have a business case yet.
**Example:** "Our support team spends 12,000 hours/year manually categorizing tickets. At $45/hour fully loaded, that is $540,000/year in classification labor alone — before counting the downstream cost of mis-routed tickets (estimated $280,000 in delayed resolution and customer churn)."


2

**Estimate Conservative Impact**
Estimate what a **20% improvement** would save. Not 80%. Not 50%. Twenty percent. If the investment pays off at 20% improvement, you have a robust case. Everything above that is upside. This is the single most important discipline in AI business cases — it builds credibility and survives reality.
**Example:** "At 20% automation of ticket classification (conservative), we save $108,000/year in labor and $56,000 in reduced mis-routing — $164,000 annual savings. Realistic upside at 60% automation: $492,000."


3

**Calculate Total Cost of Ownership**
Include the full picture: licensing, infrastructure, integration, training, ongoing maintenance, model monitoring, and the opportunity cost of the team building it. AI projects that look cheap on day one get expensive by month six if you have not accounted for everything.
**Example:** "Year 1 TCO: $85,000 (API costs $24K, integration engineering $40K, training $12K, monitoring tooling $9K). Payback at 20% threshold: 6.2 months. Payback at realistic 40%: 3.1 months."


**Common mistake:** Comparing "AI solution cost" to "current process cost" without accounting for transition costs, parallel running period, accuracy validation, edge case handling, and the human-in-the-loop supervision most AI systems need in their first 6 months. These hidden costs typically add 30-50% to the initial estimate.


## Stakeholder Mapping: Four Audiences, Four Stories

Every AI business case has four audiences — and each needs a different story told in their language. This is not manipulation. It is communication. The same initiative looks completely different depending on what you are responsible for.


**CEO / Board**
Wants: competitive advantage, market position, growth story
Tell them: "This positions us ahead of competitors X and Y, who are already investing in AI. The 90-day pilot validates the thesis before we commit at scale."


**COO / Operations**
Wants: efficiency, throughput, reduced burden on teams
Tell them: "Your team currently spends 40% of their time on X. This reduces it to 15%, freeing them for higher-value work that directly impacts customer retention."


**CTO / IT**
Wants: architectural fit, security, maintainability
Tell them: "This integrates via REST API with our existing stack, runs on our cloud infrastructure, and we have a rollback plan. No vendor lock-in."


**CFO / Finance**
Wants: payback period, risk-adjusted return, budget predictability
Tell them: "Conservative payback in 6.2 months. Year 1 TCO is $85K against $164K minimum savings. We are limiting pilot spend to $25K with a kill switch at day 45 if metrics are not trending."


**Pro tip:** Map each stakeholder's concerns *before* you present. Talk to them individually. Understand their objections. Address concerns proactively in the business case. A business case that anticipates objections before they are raised signals competence and builds immediate credibility.


## Pilot Design: Small Bets, Big Lessons

The best AI pilots share three characteristics: a **clearly defined problem**, a **measurable success metric**, and a **90-day timeline**. Anything longer and you lose momentum. Anything vaguer and you cannot prove value.


**Good Pilot Candidates**

→ Customer service ticket classification (measurable accuracy, clear baseline)
→ Invoice matching and processing (quantifiable time savings, low risk)
→ Demand forecasting for a single product line (contained scope, fast feedback)
→ Internal document search and retrieval (high pain, easy to measure improvement)
→ Email triage and routing (volume data available, automation potential clear)


**Bad Pilot Candidates**

→ "Build an AI strategy assistant for the C-suite" (too vague, no baseline metric)
→ "Automate our entire customer journey" (too broad, too many dependencies)
→ "Replace our recommendation engine" (too complex for a first pilot)
→ "Use AI to predict employee attrition" (politically sensitive, hard to validate)
→ Anything that requires data you do not have yet


**The 90-Day Pilot Structure:**

**Weeks 1-2:** Define scope, success criteria, and data requirements. Get stakeholder sign-off on what "success" means.

**Weeks 3-6:** Build MVP. Use existing tools and APIs where possible (Claude, GPT, Gemini). Do not build from scratch.

**Weeks 7-10:** Test with real users on real data. Collect metrics. Document failure modes and edge cases.

**Weeks 11-12:** Analyze results against success criteria. Build the case for scale — or kill it and redirect investment.

**Kill switch at day 45:** If metrics are flat or trending wrong after 6 weeks, do not wait 12 weeks to know. Cut losses, learn, redirect.


## The One-Page Business Case Template

Executives do not read 30-page decks. They read one page. Then they ask questions. Here is the format that gets approvals:


AI Business Case: [Use Case Name]
**PROBLEM:** [1-2 sentences. What is the pain? What does it cost?]
**SOLUTION:** [1-2 sentences. What does AI do specifically? How?]
**IMPACT:** [Conservative estimate at 20% improvement. Upside at 50%.]
**COST:** [Year 1 TCO. Pilot cost. Payback period.]
**RISK:** [Top 3 risks + mitigation for each.]
**PILOT:** [Scope, timeline, success metric, kill criteria.]
**ASK:** [$X for 90-day pilot. Go/no-go review at day 45 and day 90.]


Everything else goes in an appendix. If the one-pager does not compel action on its own, more pages will not help.


## Honesty Is Strategy

The most powerful thing you can do in an AI business case is **be honest about what you do not know**. Executives are tired of hype. Every vendor promises transformation. Every consulting firm has "AI-powered insights." The signal that cuts through the noise is intellectual honesty.

A business case that says "here is what we expect, here is what we are uncertain about, and here is how we will learn" earns more trust than one promising the moon. Acknowledge the unknowns. Show a learning plan. Build in kill criteria that demonstrate you are protecting the organization's investment, not just advocating for your project.

Credibility is your greatest asset in enterprise AI. Guard it with honest projections, conservative assumptions, and the willingness to kill your own project if the data says it is not working. Executives will fund your next three projects based on how you handle this one.


## Common Business Case Mistakes

Even experienced teams sabotage their own AI business cases. These are the patterns that kill funding — not because the technology was wrong, but because the argument was flawed. Avoid every one of these.


1

**Leading With Technology Instead of the Problem**
The business case opens with "We want to implement a large language model" instead of "We are losing $540K/year to manual ticket classification." Executives do not fund technology. They fund solutions to expensive problems. Start with the pain, not the tool.


2

**Using Vendor ROI Numbers as Your Own**
Vendor case studies assume ideal conditions that do not exist in your organization. Copying their "300% ROI" into your business case destroys credibility the moment a skeptical CFO asks how you derived the numbers. Build your own math from your own data — even if the numbers are smaller, they are yours and they are defensible.


3

**Skipping the Change Management Cost**
The model works perfectly in testing. Then it ships and nobody uses it. Training, workflow redesign, user resistance, and the parallel-running period where old and new systems overlap — these are real costs that most business cases ignore entirely. Change management typically accounts for 20-40% of total project cost in enterprise AI.


4

**No Kill Criteria**
A business case without a clear "when to stop" threshold signals that you are advocating, not analyzing. Executives want to know you will protect their investment. Define specific metrics that trigger a go/no-go decision at day 45 and day 90. Projects without kill criteria become zombie initiatives that drain budget for months after they should have been shut down.


5

**Treating the Pilot as a Proof of Concept**
A proof of concept proves the technology works. A pilot proves the *business value* works. Too many teams run a POC, declare success because the model hit 92% accuracy, and then cannot explain why the business should care. Design your pilot around business metrics — dollars saved, hours recovered, customer satisfaction improved — not model performance metrics.


## Try It Now: Draft Your Business Case


Help me build an AI business case for my organization.

Context:
- Use case: [what you want AI to do — be specific]
- Current process: [how this is done today, by whom, how long it takes]
- Current cost: [labor hours, error rate, customer impact — any numbers you have]
- Audience: [who needs to approve this — CEO, CFO, VP Engineering, etc.]

Build me:
1. A one-page business case using this format: Problem → Solution → Impact → Cost → Risk → Pilot → Ask
2. Conservative ROI at 20% improvement and realistic ROI at 50%
3. A 90-day pilot plan with weekly milestones and a day-45 kill switch criteria
4. Stakeholder-specific talking points for each executive audience (CEO, COO, CTO, CFO)
5. Top 3 objections I will face and pre-built responses for each


### Building the Business Case

**Card 1:**
Front: Conservative ROI Threshold
Back: Calculate ROI at a 20% improvement, not 80%. If the investment pays off at 20%, you have a robust case. Everything above that is upside. This single discipline builds more credibility than any other.

**Card 2:**
Front: Total Cost of Ownership
Back: Licensing + infrastructure + integration + training + ongoing maintenance + monitoring + opportunity cost of the team. AI projects that look cheap on day one get expensive by month six without full accounting.

**Card 3:**
Front: The Four Stakeholder Audiences
Back: CEO wants competitive advantage. COO wants efficiency. CTO wants architectural fit. CFO wants payback period. Same initiative, four narratives, four languages.

**Card 4:**
Front: Good Pilot Characteristics
Back: Clearly defined problem, measurable success metric, 90-day timeline. The problem is painful enough to matter but contained enough to manage. Kill switch at day 45.

**Card 5:**
Front: Hidden Cost Warning
Back: Transition costs, parallel running period, accuracy validation, edge case handling, and human-in-the-loop supervision typically add 30-50% to initial estimates. Account for them upfront.

**Card 6:**
Front: Credibility as Strategy
Back: Being honest about what you do not know earns more executive trust than promising the moon. Executives will fund your next three projects based on how you handle this one.


### Quiz

**Q1: Your AI vendor projects 80% automation and 400% ROI in year one. What should you do?**
    A. Present these numbers to your CFO — the vendor has case studies
  ✓ B. Calculate your own ROI at 20% improvement and use the vendor numbers as optimistic upside only
    C. Ask the vendor for even more optimistic numbers to make the case stronger
    D. Reject the vendor — those numbers are clearly fake
  *Vendor projections assume perfect conditions. Calculate your own ROI at a conservative 20% improvement. If it pays off there, present that as the base case and the vendor numbers as optimistic upside. This builds credibility — your CFO will trust you more when you show conservative math that still makes the case.*

**Q2: You are presenting your AI business case. The CFO asks: What happens if this fails? Which response builds the most trust?**
    A. It will not fail — the technology is proven
  ✓ B. We have built in a kill switch at day 45. If metrics are not trending toward our 20% threshold, we stop the pilot and redirect the $25K remaining budget. Here is what we would learn even from a failed pilot.
    C. We should discuss that offline
    D. The pilot is only $50K so the downside is limited
  *Showing you have a kill switch, a specific evaluation point, and a plan for what happens if it fails demonstrates that you are protecting the organization is investment. This builds more trust than confidence claims. The CFO is thinking about downside risk — answer that question directly.*

**Q3: Which is a better AI pilot candidate?**
    A. Build an AI-powered strategic planning assistant for the C-suite
  ✓ B. Automate classification of 50,000 monthly customer support tickets
    C. Replace the entire recommendation engine with AI
    D. Predict which employees will quit in the next 6 months
  *Support ticket classification is ideal: clearly defined problem, measurable baseline (current accuracy and time), high volume (50K/month gives statistical significance), low political sensitivity, and contained scope. The other options are either too vague, too complex, or too politically sensitive for a first pilot.*

**Q4: Why does the one-page business case template work better than a 30-page deck?**
    A. Executives have short attention spans
  ✓ B. If the core argument does not compel action in one page, more pages will not help — the one-pager forces clarity and the appendix holds supporting detail
    C. One page is cheaper to print
    D. It is faster to write
  *The one-page format forces you to distill your argument to its essential components: problem, solution, impact, cost, risk, pilot plan, and ask. If those elements do not compel action on their own, adding 29 more pages of supporting detail will not save the case. Details go in the appendix for those who want to dig deeper.*

**Q5: You mapped four stakeholders for your AI business case. The CTO is concerned about vendor lock-in. How should you address this in the business case?**
    A. Ignore it — vendor lock-in is a technical detail
    B. Promise there is no lock-in even if there is
  ✓ C. Address it directly in the CTO-specific narrative: show the integration architecture, API-based approach, data portability plan, and rollback strategy
    D. Tell the CTO to talk to the vendor directly
  *Each stakeholder has different concerns that must be addressed in their language. The CTO cares about architectural fit, maintainability, and avoiding lock-in. Address it head-on with specific technical evidence: API-based integration, standard data formats, no proprietary dependencies, and a documented rollback plan.*


  [← Previous: The AI Strategy Landscape](/academy/ai-enterprise-strategy/ai-strategy-landscape/)
  [Next: AI Readiness Assessment →](/academy/ai-enterprise-strategy/ai-readiness-assessment/)
