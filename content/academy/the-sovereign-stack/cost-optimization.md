---
title: "Cost Optimization"
course: "the-sovereign-stack"
order: 9
type: "lesson"
free: false
---

<div class="wrap">

<nav class="local-nav">
  <a href="/academy/the-sovereign-stack/">The Sovereign Stack</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Cost Optimization</h1>
  <p><span class="accent">Cut your AI bill by 90%. Local models for routine, cloud only for complex.</span></p>
  <p>Most businesses overspend on AI by 10x because they send every request to expensive cloud APIs. The sovereign stack runs routine tasks locally for free and routes only the hardest work to the cloud. This lesson shows you exactly how to build that routing.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>The task routing framework: which tasks go local vs. cloud</li>
    <li>Measuring cost per task and optimizing the split</li>
    <li>Token reduction techniques that cut costs without cutting quality</li>
    <li>Building a cost dashboard that tracks spending in real time</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Framework</span>
  <h2 class="section-title">The Cost Routing Decision</h2>
  <p class="section-text">Every AI request has a complexity level. Simple tasks (classification, summarization, template filling) run perfectly on local models. Complex tasks (long-form analysis, nuanced writing, multi-step reasoning) benefit from cloud frontier models. The key is routing correctly:</p>
  <p class="section-text"><strong style="color: var(--green);">Local (free):</strong> Email triage, content classification, data extraction, template filling, simple Q&A, code formatting, JSON generation, sentiment analysis. These are pattern-matching tasks that 7B models handle excellently.</p>
  <p class="section-text"><strong style="color: var(--blue);">Cloud (paid):</strong> Long-form blog posts, complex code generation, multi-step reasoning chains, nuanced client communication, strategic planning, creative writing. These need frontier model capabilities.</p>
  <p class="section-text"><strong style="color: var(--purple);">Hybrid:</strong> Draft locally, polish on cloud. Local model generates a rough draft (free), cloud model refines it into final quality (one API call instead of iterating). This cuts cloud usage by 60-80% for content tasks.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">The Smart Router</h2>
  <div class="prompt-box"><code>// Smart model router -- chooses local vs. cloud per request
function routeRequest(task) {
  // Tasks that always go local (free)
  const localTasks = [
    'classify', 'triage', 'summarize_short', 'extract_data',
    'format_json', 'template_fill', 'sentiment', 'translate_simple'
  ];

  // Tasks that always go cloud (quality matters)
  const cloudTasks = [
    'blog_post', 'client_email_complex', 'strategic_plan',
    'code_architecture', 'legal_review', 'creative_writing'
  ];

  if (localTasks.includes(task.type)) {
    return { model: 'ollama/qwen2.5:7b', cost: 0, reason: 'routine task' };
  }

  if (cloudTasks.includes(task.type)) {
    return {
      model: 'claude-sonnet-4-20250514',
      cost: estimateCost(task),
      reason: 'requires frontier quality'
    };
  }

  // Default: try local first, escalate to cloud if quality is poor
  return {
    model: 'ollama/qwen2.5:7b',
    fallback: 'claude-sonnet-4-20250514',
    cost: 0,
    reason: 'try local, escalate if needed'
  };
}

// Cost estimation based on token count
function estimateCost(task) {
  const inputTokens = Math.ceil(task.prompt.length / 4);
  const outputTokens = task.maxTokens || 1000;
  // Claude Sonnet pricing (approximate)
  return ((inputTokens * 0.003) + (outputTokens * 0.015)) / 1000;
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Strategy</span>
  <h2 class="section-title">Token Reduction Techniques</h2>
  <p class="section-text">Even when you must use cloud APIs, you can reduce how many tokens each request consumes:</p>
  <p class="section-text"><strong style="color: var(--blue);">Prompt compression.</strong> Rewrite system prompts to be concise. A 2000-token system prompt that could be 500 tokens wastes 1500 tokens on every request. Over 100 requests/day, that is 150,000 wasted tokens.</p>
  <p class="section-text"><strong style="color: var(--purple);">Context windowing.</strong> Do not send the entire conversation history with every request. Send the last 5-10 messages plus a summary of earlier context. This keeps input tokens manageable as conversations grow.</p>
  <p class="section-text"><strong style="color: var(--green);">Output capping.</strong> Set max_tokens to the minimum needed. A classification task needs 50 tokens, not 4000. A summary needs 200, not 2000. Over-allocating output tokens does not cost more (you pay for actual output), but constraining encourages concise responses.</p>
  <p class="section-text"><strong style="color: var(--orange);">Caching responses.</strong> If the same question is asked repeatedly (FAQ, standard classification), cache the response. Subsequent requests return the cached answer at zero cost. Invalidate the cache when the underlying data changes.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Advanced</span>
  <h2 class="section-title">Cost Dashboard</h2>
  <p class="section-text">You cannot optimize what you do not measure. Build a cost dashboard that tracks every AI request:</p>
  <div class="prompt-box"><code>// Log every AI request with cost data
async function logRequest(model, inputTokens, outputTokens, taskType) {
  const cost = calculateCost(model, inputTokens, outputTokens);
  const entry = {
    timestamp: new Date().toISOString(),
    model: model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    task_type: taskType,
    cost_usd: cost,
    routed_to: model.startsWith('ollama') ? 'local' : 'cloud'
  };

  brain.write(
    `cost.request.${Date.now()}`,
    JSON.stringify(entry),
    'cost'
  );
}

// Daily cost summary
function dailyCostSummary() {
  const today = new Date().toISOString().split('T')[0];
  const requests = brain.search(`cost.request`)
    .filter(r => r.value.includes(today))
    .map(r => JSON.parse(r.value));

  const totalCost = requests.reduce((sum, r) => sum + r.cost_usd, 0);
  const localCount = requests.filter(r => r.routed_to === 'local').length;
  const cloudCount = requests.filter(r => r.routed_to === 'cloud').length;
  const localPercent = (localCount / requests.length * 100).toFixed(1);

  return {
    date: today,
    total_requests: requests.length,
    local_requests: localCount,
    cloud_requests: cloudCount,
    local_percent: `${localPercent}%`,
    total_cost: `$${totalCost.toFixed(4)}`,
    savings_vs_all_cloud: `$${(requests.length * 0.01 - totalCost).toFixed(2)}`
  };
}</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Comparison</span>
  <h2 class="section-title">Real Cost Comparison</h2>
  <p class="section-text">Here is a real-world comparison for a business running 500 AI requests per day:</p>
  <div class="prompt-box"><code>Scenario A: All Cloud (no sovereignty)
  500 requests x $0.01 avg = $5.00/day = $150/month

Scenario B: 80/20 Split (sovereign + cloud)
  400 local requests x $0.00 = $0.00
  100 cloud requests x $0.015 avg = $1.50/day = $45/month
  Hardware amortized: $600 / 36 months = $16.67/month
  Total: $61.67/month

Scenario C: 95/5 Split (aggressive sovereignty)
  475 local requests x $0.00 = $0.00
  25 cloud requests x $0.02 avg = $0.50/day = $15/month
  Hardware: $16.67/month
  Total: $31.67/month

Monthly savings:
  A vs B: $88.33/month (59% reduction)
  A vs C: $118.33/month (79% reduction)

Annual savings:
  A vs C: $1,420/year -- and growing with usage</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Anti-Patterns</span>
  <h2 class="section-title">Cost Optimization Mistakes</h2>
  <p class="section-text"><strong style="color: var(--red);">Optimizing too early.</strong> Spending a week building a cost optimization system before you even know your usage patterns. Run on cloud for a week first. Measure. See where the money goes. Then optimize the expensive categories.</p>
  <p class="section-text"><strong style="color: var(--red);">Sacrificing quality for cost.</strong> Routing everything to local models even when quality suffers visibly. A terrible client email saves $0.02 but costs you the client. Route quality-critical tasks to cloud without guilt.</p>
  <p class="section-text"><strong style="color: var(--red);">No spending alerts.</strong> Running without a daily cost cap. A bug that generates 10,000 cloud requests in an hour can cost hundreds of dollars. Set a daily maximum and halt cloud requests when the limit is reached.</p>
</div>

<div class="try-it-box">
  <h3>Try It Yourself</h3>
  <p>Build your cost optimization system:</p>
  <div class="prompt-box"><code>1. Log your current AI usage for one week (which tasks, how many)
2. Classify each task: local-capable or cloud-required?
3. Build a smart router that routes local vs. cloud
4. Implement cost logging for every request
5. Run for one week with routing active
6. Compare: what did you spend vs. what you would have spent?
7. Set a daily spending cap with automatic cloud shutoff

Target: 80% of requests routed locally.
Measure the savings. Adjust the routing thresholds.
Every percentage point moved from cloud to local saves money forever.</code></div>
</div>

<div class="lesson-section">
  <span class="section-label">Review</span>
  <h2 class="section-title">Key concepts.</h2>
  <div data-learn="FlashDeck" data-props='{"title":"Cost Optimization","cards":[{"front":"Cost Routing Framework","back":"Local (free): classification, triage, extraction, templates. Cloud (paid): long-form writing, complex reasoning, creative work. Hybrid: draft locally, polish on cloud. Route by task complexity."},{"front":"Token Reduction Techniques","back":"Prompt compression (concise system prompts), context windowing (last 5-10 messages + summary), output capping (min needed tokens), response caching (reuse repeated answers)."},{"front":"The 80/20 Split","back":"80% of requests go to local models (free). 20% go to cloud APIs (paid). Typical savings: 60-80% reduction in AI costs compared to all-cloud. Hardware pays for itself in 2 months."},{"front":"Cost Dashboard","back":"Log every request: model, tokens, task type, cost, routing destination. Daily summaries show total spend, local/cloud split, and savings vs. all-cloud baseline."},{"front":"Daily Spending Cap","back":"Set a maximum daily cloud spend. When the limit is reached, halt cloud requests and route everything to local models. Prevents runaway costs from bugs or traffic spikes."},{"front":"Quality vs. Cost Balance","back":"Never sacrifice visible quality for cost savings. A bad client email saves $0.02 but costs you the client. Route quality-critical tasks to cloud without guilt. Optimize the routine tasks."}]}'></div>
</div>

<div class="lesson-section">
  <span class="section-label">Check Your Understanding</span>
  <h2 class="section-title">Cost optimization quiz.</h2>
  <div data-learn="QuizMC" data-props='{"title":"Cost Optimization","questions":[{"q":"What is the hybrid draft-and-polish approach?","options":["Using two cloud models for the same task","Generate a rough draft on a local model (free), then refine it with a cloud model (one API call) -- cutting cloud usage by 60-80% for content tasks","Running the same prompt on local and cloud and choosing the better output","Using a local model to check cloud model outputs"],"correct":1,"explanation":"The local model handles the heavy lifting of generating the initial draft (free). The cloud model only needs to refine and polish (one API call instead of iterating). For a blog post that might take 3-4 cloud iterations, you reduce it to 1 local draft + 1 cloud polish."},{"q":"Why is a daily spending cap essential for cost optimization?","options":["It makes the AI produce better outputs","A bug that generates thousands of cloud requests in an hour can cost hundreds of dollars -- a daily cap halts cloud requests when the limit is reached, preventing runaway costs","Spending caps are required by cloud API providers","Spending caps improve response times"],"correct":1,"explanation":"Without a cap, a single bug -- an infinite loop, a retry storm, a traffic spike -- can burn through your entire budget in minutes. A daily cap is a circuit breaker: when you hit $X, cloud requests stop and everything routes to local models. The business keeps running, just on local."},{"q":"When should you NOT route a task to a local model for cost savings?","options":["Never -- local models should always be used","When the task is quality-critical (client communication, strategic plans, creative writing) and local model output would be visibly worse -- saving $0.02 on a bad client email costs you the client","When the local model is busy","When the task requires more than 100 tokens"],"correct":1,"explanation":"Cost optimization is about routing ROUTINE tasks locally. Quality-critical tasks -- anything client-facing, strategic, or creative -- should go to the best available model regardless of cost. The savings come from the 80% of tasks that are routine, not from cheapening the 20% that matter most."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/the-sovereign-stack/monitoring-self-healing/" class="prev">&larr; Previous: Monitoring & Self-Healing</a>
  <a href="/academy/the-sovereign-stack/the-fully-autonomous-business/" class="next">Next: The Fully Autonomous Business &rarr;</a>
</nav>

</div>
