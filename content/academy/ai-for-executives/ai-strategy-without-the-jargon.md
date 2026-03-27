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

<!-- COMPLETION -->
<button class="complete-btn" id="completeBtn" onclick="completeLesson()">Complete Lesson 2 &#10003;</button>

<div class="lesson-footer">
  <a href="the-executives-ai-reality-check.html" style="color:var(--dim);font-size:.9rem">&larr; Prev: Reality Check</a>
  <a href="leading-ai-transformation.html" style="color:var(--orange);font-weight:600;font-size:.9rem">Next: Leading AI Transformation &rarr;</a>
</div>

</div>

<script>
const SLUG = 'ai-for-executives';
const LESSON_NUM = 2;

window.addEventListener('scroll', function() {
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (scrollPct > 0.6) {
    document.getElementById('completeBtn').classList.add('visible');
  }
});

function completeLesson() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (!completed.includes(LESSON_NUM)) {
    completed.push(LESSON_NUM);
    localStorage.setItem('lo_progress_' + SLUG, JSON.stringify(completed));
  }
  const btn = document.getElementById('completeBtn');
  btn.textContent = 'Completed!';
  btn.style.background = 'var(--green)';
  btn.style.pointerEvents = 'none';
}

(function() {
  const stored = localStorage.getItem('lo_progress_' + SLUG);
  const completed = stored ? JSON.parse(stored) : [];
  if (completed.includes(LESSON_NUM)) {
    const btn = document.getElementById('completeBtn');
    btn.classList.add('visible');
    btn.textContent = 'Completed!';
    btn.style.background = 'var(--green)';
    btn.style.pointerEvents = 'none';
  }
})();
</script>