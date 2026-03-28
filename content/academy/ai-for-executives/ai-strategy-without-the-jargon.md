---
title: "AI Strategy Without the Jargon"
course: "ai-for-executives"
order: 2
type: "lesson"
free: true
css: "ai-executives.css"
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-for-executives/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 5</span>
</nav>

<!-- HERO -->
<div class="lesson-hero">
  <h1>AI Strategy Without the <span class="accent">Jargon.</span></h1>
  <p class="sub">Frameworks for deciding what to build, what to buy, and who to trust.</p>
</div>

<!-- LEARNING GOALS -->
<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>A clear framework for prioritizing AI initiatives by impact and feasibility</li>
    <li>When to build custom AI vs. buy off-the-shelf vs. wait</li>
    <li>How to evaluate AI vendors when you're not a technical person</li>
    <li>The 5 questions that expose weak AI vendor pitches instantly</li>
  </ul>
</div>

<!-- SECTION 1: THE PRIORITIZATION FRAMEWORK -->
<div class="lesson-section">
  <span class="section-label">Prioritization</span>
  <h2 class="section-title">The AI Opportunity Matrix.</h2>
  <p class="section-text">Every organization has dozens of places where AI <em>could</em> be applied. The question isn't where AI fits. It's where AI fits <strong>first</strong>. You need a prioritization framework that any leadership team can use without a data science degree.</p>
  <p class="section-text">Plot every potential AI initiative on two axes: <strong>Business Impact</strong> (revenue, cost, risk reduction, customer experience) and <strong>Data Readiness</strong> (is the data clean, accessible, and sufficient?).</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div style="padding:1rem;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:10px">
        <div style="font-size:.75rem;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem">Quadrant 1: Do Now</div>
        <div style="font-size:.85rem;color:var(--dim)"><strong>High impact + data ready.</strong> These are your quick wins. Customer support automation, document processing, internal search. Start here. Prove value. Build organizational confidence.</div>
      </div>
      <div style="padding:1rem;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:10px">
        <div style="font-size:.75rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem">Quadrant 2: Prepare</div>
        <div style="font-size:.85rem;color:var(--dim)"><strong>High impact + data not ready.</strong> These are your strategic plays. Worth the investment in data infrastructure now so you can deploy AI in 6-12 months. Don't rush these.</div>
      </div>
      <div style="padding:1rem;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);border-radius:10px">
        <div style="font-size:.75rem;font-weight:700;color:var(--blue,#3b82f6);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem">Quadrant 3: Experiment</div>
        <div style="font-size:.85rem;color:var(--dim)"><strong>Lower impact + data ready.</strong> Good for pilots and learning. Let teams experiment here to build AI muscle without bet-the-company stakes. Cap investment tightly.</div>
      </div>
      <div style="padding:1rem;background:rgba(107,114,128,.06);border:1px solid rgba(107,114,128,.15);border-radius:10px">
        <div style="font-size:.75rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-bottom:.5rem">Quadrant 4: Defer</div>
        <div style="font-size:.85rem;color:var(--dim)"><strong>Lower impact + data not ready.</strong> Deprioritize. Revisit in 12 months. The AI landscape moves fast enough that waiting here costs you nothing and saves you from expensive dead ends.</div>
      </div>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Run This In Your Next Leadership Meeting</div>
    <p>Bring your top 10 AI ideas to the table. Give each leader 2 minutes to place each one in a quadrant. Where there's disagreement, that's where the real conversation is. Usually it's because people disagree on data readiness, not impact. That tells you exactly where to invest in data infrastructure.</p>
  </div>
</div>

<!-- SECTION 2: BUILD VS BUY -->
<div class="lesson-section">
  <span class="section-label">The Decision</span>
  <h2 class="section-title">Build, buy, or partner?</h2>
  <p class="section-text">This is the question that burns the most executive time and budget. The answer depends on three factors: how unique your problem is, how central AI is to your competitive advantage, and how fast you need results.</p>

  <div class="prompt-grid">
    <div class="prompt-card">
      <div class="emoji">&#128722;</div>
      <h4>Buy Off-the-Shelf</h4>
      <p><strong>When:</strong> The problem is common across industries. Customer support, content generation, document analysis, meeting transcription. Dozens of proven tools exist. Your competitive advantage isn't in how you do this task, it's in what you do with the results.</p>
      <p style="margin-top:.5rem;font-size:.8rem;color:var(--green)"><strong>Timeline:</strong> Days to weeks. <strong>Cost:</strong> $50-500/mo per seat.</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">&#128295;</div>
      <h4>Build Custom</h4>
      <p><strong>When:</strong> The AI capability IS your product or your core competitive moat. You have proprietary data that makes your model better than anything on the market. You need full control over the model, the data pipeline, and the output.</p>
      <p style="margin-top:.5rem;font-size:.8rem;color:var(--orange)"><strong>Timeline:</strong> 3-12 months. <strong>Cost:</strong> $100K-$2M+ depending on complexity.</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">&#129309;</div>
      <h4>Partner / Customize</h4>
      <p><strong>When:</strong> Your problem is industry-specific but not unique to your company. A vendor has a platform you can customize with your data. You get 80% of the benefit of custom at 20% of the cost. This is the right answer more often than most executives realize.</p>
      <p style="margin-top:.5rem;font-size:.8rem;color:var(--blue,#3b82f6)"><strong>Timeline:</strong> 4-12 weeks. <strong>Cost:</strong> $10K-$200K.</p>
    </div>
  </div>

  <div class="callout">
    <p><strong>The trap:</strong> Building custom when you should be buying. It feels more strategic, it's more exciting to pitch to the board, and it's also how organizations burn $500K learning what a $200/month SaaS tool already does. Ask: "Is this problem unique enough that no existing tool solves it?" If the honest answer is no, buy.</p>
  </div>
</div>

<!-- SECTION 3: VENDOR EVALUATION -->
<div class="lesson-section">
  <span class="section-label">Due Diligence</span>
  <h2 class="section-title">Evaluating AI vendors when you're not technical.</h2>
  <p class="section-text">You don't need to understand transformer architectures or fine-tuning methodologies to evaluate an AI vendor. You need to ask the right questions and know what good answers sound like. Here are five questions that separate serious vendors from demo-ware merchants:</p>

  <div class="prompt-grid">
    <div class="prompt-card">
      <div class="emoji">1&#65039;&#8419;</div>
      <h4>"Show me a failure case."</h4>
      <p>Every AI system fails. A vendor who can't show you where their product breaks, how often, and what happens when it does is either lying or hasn't tested properly. <strong>Good answer:</strong> specific failure modes, error rates, and human escalation paths. <strong>Bad answer:</strong> "Our AI is 99% accurate."</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">2&#65039;&#8419;</div>
      <h4>"Where does my data go?"</h4>
      <p>This isn't a technical question. It's a legal and competitive one. Is your data used to train their model? Who has access? Where is it stored? Can you delete it? <strong>Good answer:</strong> clear data processing agreement, SOC 2 certification, data residency options. <strong>Bad answer:</strong> vague reassurances.</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">3&#65039;&#8419;</div>
      <h4>"What happens if you go out of business?"</h4>
      <p>70% of AI startups won't exist in 5 years. That's not pessimism, it's venture capital math. Are your workflows trapped in their platform? Can you export? Is there an open-source fallback? <strong>Good answer:</strong> data portability, standard APIs, no lock-in. <strong>Bad answer:</strong> "We just raised $50M."</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">4&#65039;&#8419;</div>
      <h4>"Can I talk to a customer in my industry?"</h4>
      <p>Reference checks for AI vendors are non-negotiable. Not curated case studies. Real conversations with real customers. Ask them about implementation timeline, actual vs. promised results, and ongoing support quality. <strong>Red flag:</strong> any vendor who can't produce references.</p>
    </div>
    <div class="prompt-card">
      <div class="emoji">5&#65039;&#8419;</div>
      <h4>"What does implementation actually look like?"</h4>
      <p>The demo is always beautiful. Implementation is where deals die. Ask about data integration requirements, change management support, timeline to first value, and what internal resources you'll need. <strong>Good answer:</strong> detailed implementation plan with milestones. <strong>Bad answer:</strong> "It's plug and play."</p>
    </div>
  </div>

  <div class="tip-box">
    <div class="tip-label">Vendor Meeting Prompt</div>
    <p>Before your next AI vendor meeting, send this in advance: <em>"Please come prepared to show us: (1) a live demo using data similar to ours, not a canned presentation, (2) your three most common failure modes and how you handle them, and (3) a realistic implementation timeline with resource requirements on our side."</em> How they respond to this request tells you more than the meeting itself.</p>
  </div>
</div>

<!-- SECTION 4: THE STRATEGIC ROADMAP -->
<div class="lesson-section">
  <span class="section-label">The Roadmap</span>
  <h2 class="section-title">Building your 12-month AI roadmap.</h2>
  <p class="section-text">Strategy without a timeline is a wish list. Here's a practical 12-month framework that balances quick wins with strategic positioning:</p>

  <div class="demo-container" style="padding:1.5rem">
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="padding:1rem;border-left:3px solid var(--green);background:var(--bg);border-radius:0 10px 10px 0">
        <div style="font-weight:700;font-size:.85rem;color:var(--green)">Months 1-3: Foundation</div>
        <div style="color:var(--dim);font-size:.85rem;margin-top:4px">Audit your data assets. Deploy 1-2 off-the-shelf tools in Quadrant 1 use cases. Establish an AI governance framework (covered in Lesson 4). Designate an AI point person on the leadership team. Measure baseline metrics you'll compare against later.</div>
      </div>
      <div style="padding:1rem;border-left:3px solid var(--orange);background:var(--bg);border-radius:0 10px 10px 0">
        <div style="font-weight:700;font-size:.85rem;color:var(--orange)">Months 4-6: Expansion</div>
        <div style="color:var(--dim);font-size:.85rem;margin-top:4px">Review early results. If Quadrant 1 projects are delivering, expand to more teams. Begin data infrastructure work for Quadrant 2 opportunities. Run one or two low-stakes experiments in Quadrant 3. Share early wins internally to build momentum.</div>
      </div>
      <div style="padding:1rem;border-left:3px solid var(--blue,#3b82f6);background:var(--bg);border-radius:0 10px 10px 0">
        <div style="font-weight:700;font-size:.85rem;color:var(--blue,#3b82f6)">Months 7-9: Integration</div>
        <div style="color:var(--dim);font-size:.85rem;margin-top:4px">Move from point solutions to integrated workflows. Begin Quadrant 2 deployments where data is now ready. Formalize AI training for key teams. Evaluate build vs. buy for any strategic AI capabilities.</div>
      </div>
      <div style="padding:1rem;border-left:3px solid var(--purple,#8b5cf6);background:var(--bg);border-radius:0 10px 10px 0">
        <div style="font-weight:700;font-size:.85rem;color:var(--purple,#8b5cf6)">Months 10-12: Scale & Assess</div>
        <div style="color:var(--dim);font-size:.85rem;margin-top:4px">Comprehensive ROI review across all AI initiatives (Lesson 5 covers this). Kill underperformers without mercy. Double down on what's working. Plan next year's roadmap from a position of evidence, not hope.</div>
      </div>
    </div>
  </div>

  <div class="callout">
    <p><strong>The discipline that matters:</strong> a 12-month roadmap is a living document, not a commitment. Review it quarterly. The AI market will change, your data readiness will improve, and your team's capability will grow. The roadmap gives you direction. Quarterly reviews give you agility.</p>
  </div>
</div>

<!-- KEY TAKEAWAY -->
<div class="callout purple">
  <p><strong>The strategic takeaway:</strong> AI strategy is business strategy with an AI component, not the other way around. Prioritize by impact and data readiness. Buy before you build unless the capability is your competitive moat. Evaluate vendors like you'd evaluate any critical supplier. And give yourself 12 months to build real, evidence-based momentum.</p>
</div>

<!-- FLASH DECK: KEY STRATEGY CONCEPTS -->
<div data-learn="FlashDeck" data-props='{"title":"AI Strategy Key Concepts","cards":[{"front":"AI Opportunity Matrix","back":"A 2x2 framework for prioritizing AI initiatives by plotting Business Impact against Data Readiness. Produces four quadrants: Do Now, Prepare, Experiment, and Defer."},{"front":"Quadrant 2: Prepare","back":"High-impact AI initiatives where your data isn\\u0027t ready yet. Invest in data infrastructure now so you can deploy AI in 6-12 months. Don\\u0027t rush these — the payoff is worth the groundwork."},{"front":"Build vs. Buy vs. Partner","back":"Build custom when AI is your competitive moat. Buy off-the-shelf when the problem is common. Partner when you need industry-specific customization at a fraction of custom cost."},{"front":"The $500K Trap","back":"Building custom AI when you should be buying. It feels more strategic and impresses the board, but many organizations burn $500K learning what a $200/month SaaS tool already does."},{"front":"12-Month AI Roadmap","back":"A living plan with four phases: Foundation (months 1-3), Expansion (4-6), Integration (7-9), and Scale & Assess (10-12). Reviewed quarterly — direction with agility."}]}'></div>

<!-- MATCH CONNECT: STRATEGY CONCEPTS TO PLAIN-ENGLISH MEANINGS -->
<div data-learn="MatchConnect" data-props='{"title":"Strategy Terms in Plain English","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Quadrant 1 initiative","right":"High impact, data already ready — do it now"},{"left":"Data readiness","right":"Whether your data is clean, accessible, and sufficient for AI"},{"left":"Build custom AI","right":"Create a proprietary model when AI is your competitive moat"},{"left":"Buy off-the-shelf","right":"Use an existing tool when the problem is common across industries"},{"left":"Partner and customize","right":"Use a vendor platform tailored with your own data"},{"left":"12-month AI roadmap","right":"A living plan reviewed quarterly, not a fixed commitment"}]}'>
</div>

<!-- SORT STACK: STRATEGY DEVELOPMENT STEPS -->
<div data-learn="SortStack" data-props='{"title":"Build Your AI Strategy: Steps in Order","instruction":"Arrange these strategy development steps in the correct sequence","items":["Audit your data assets and identify what is clean and accessible","Map potential initiatives on the AI Opportunity Matrix","Identify Quadrant 1 quick wins and deploy 1-2 off-the-shelf tools","Measure baseline metrics before any AI is introduced","Expand to more teams after early results validate the approach","Begin data infrastructure investment for Quadrant 2 opportunities","Conduct comprehensive ROI review and kill underperformers"]}'>
</div>

<!-- QUIZ: AI STRATEGY QUESTIONS -->
<div data-learn="QuizMC" data-props='{"title":"AI Strategy Knowledge Check","questions":[{"q":"An initiative has high business impact but your data is scattered across 15 systems and largely ungoverned. Which quadrant does it belong in?","options":["Quadrant 1: Do Now","Quadrant 2: Prepare","Quadrant 3: Experiment","Quadrant 4: Defer"],"correct":1,"explanation":"High impact plus data not ready belongs in Quadrant 2: Prepare. The right move is to invest in data infrastructure now so you can deploy AI in 6-12 months — not to rush the deployment before your data is ready."},{"q":"Your competitor analysis tool is something dozens of companies in your industry use. You need it running within two weeks. What is the right build-buy-partner decision?","options":["Build custom for full control","Partner and customize for industry fit","Buy off-the-shelf — the problem is common and speed matters","Wait until a better tool emerges"],"correct":2,"explanation":"If the problem is common across industries and you need speed, buying off-the-shelf is the right call. Building custom when a proven tool exists is how organizations waste $500K and months of time."},{"q":"A vendor pitches their AI as 99% accurate and says implementation is plug and play. What is the appropriate response?","options":["Accept their claims — they have enterprise clients","Ask to see a failure case and a realistic implementation plan with milestones","Request a price discount before proceeding","Ask about their company valuation and funding"],"correct":1,"explanation":"99% accuracy and plug-and-play implementation are classic hype signals. Ask for specific failure modes and a detailed implementation plan. How a vendor responds to these questions reveals more than any polished demo."},{"q":"What is the primary purpose of reviewing your AI roadmap quarterly?","options":["To justify AI spend to the board","To give the AI team performance reviews","To adapt the plan as data readiness improves, the market changes, and team capability grows","To reset the roadmap completely each quarter"],"correct":2,"explanation":"A 12-month AI roadmap is a living document. Quarterly reviews allow you to adapt as conditions change — not to rebuild from scratch, but to course-correct so the roadmap stays grounded in evidence rather than original assumptions."}]}'>
</div>

</div>
