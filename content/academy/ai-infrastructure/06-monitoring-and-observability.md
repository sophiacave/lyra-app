---
title: "Monitoring and Observability"
course: "ai-infrastructure"
order: 6
type: "lesson"
---

<div class="wrap">
<nav class="local-nav">
  <a href="/academy/ai-infrastructure/">AI Infrastructure & DevOps</a>
  <span class="badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Tracking AI <span class="accent">System Health</span></h1>
  <p class="section-text">An AI system can be "up" and still be broken — returning hallucinated answers, burning through budget, or degrading silently. Monitoring AI requires watching things traditional observability tools don't track.</p>
</div>

<div class="learn-card">
  <h3>What you'll learn</h3>
  <ul>
    <li>What to monitor in AI systems beyond uptime</li>
    <li>Building dashboards that catch AI-specific failures</li>
    <li>Logging strategies for debugging AI pipelines</li>
    <li>Setting up alerts that actually tell you something useful</li>
  </ul>
</div>

<div class="lesson-section">
  <span class="section-label">Beyond Uptime</span>
  <h2 class="section-title">What Makes AI Monitoring Different</h2>
  <p class="section-text">Traditional monitoring asks: Is the server up? Is latency acceptable? Are error rates normal? AI monitoring asks all of that plus: Are the responses accurate? Is the model behaving as expected? Are we spending more than we should?</p>
  <p class="section-text">A 200 OK response from your AI endpoint might contain complete nonsense. Your monitoring needs to catch that. This is the fundamental difference — in AI systems, "working" and "working correctly" are two very different things.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Metrics</span>
  <h2 class="section-title">What to Track</h2>
  <p class="section-text"><strong>Latency per AI call:</strong> Track p50, p95, and p99 latency for every AI provider call. LLM responses can vary from 500ms to 30 seconds — know your distribution.</p>
  <p class="section-text"><strong>Token usage:</strong> Log input tokens, output tokens, and total tokens for every call. This directly maps to cost and helps you identify expensive prompts or unexpectedly verbose responses.</p>
  <p class="section-text"><strong>Cost per request:</strong> Calculate and log the actual dollar cost of each AI operation. Aggregate by user, feature, and time period.</p>
  <p class="section-text"><strong>Error rates by provider:</strong> Track 4xx and 5xx responses from each AI provider separately. If one provider's error rate spikes, you want to know immediately — especially if you have fallback logic.</p>
  <p class="section-text"><strong>Cache hit rates:</strong> If you're caching AI responses (you should be for common queries), track how often the cache serves a response vs. making a fresh API call. Low cache hit rates mean you're spending more than necessary.</p>
  <p class="section-text"><strong>Response quality signals:</strong> Track user feedback (thumbs up/down), response length anomalies, and any automated quality checks you run on outputs.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Logs</span>
  <h2 class="section-title">Structured Logging for AI Pipelines</h2>
  <p class="section-text">Every AI operation should produce a structured log entry with: timestamp, user ID, function name, provider, model, input token count, output token count, latency in milliseconds, estimated cost, and success/failure status.</p>
  <p class="section-text">For debugging, also log the prompt template used (not the full prompt — that may contain user data) and any retrieval context that was injected (document IDs, similarity scores). When something goes wrong, you need to reconstruct the full pipeline state.</p>
  <p class="section-text">Store logs in a queryable format. Supabase tables work well for this — you get full SQL query power over your AI operation logs. For higher volume, consider a dedicated logging service like Datadog or a simple time-series database.</p>
</div>

<div class="lesson-section">
</div>

<div class="lesson-section">
  <span class="section-label">Implementation</span>
  <h2 class="section-title">Building an AI Monitoring Dashboard</h2>
  <p class="section-text">You don't need expensive observability platforms to monitor AI systems effectively. A Supabase table, a few SQL views, and a cron-triggered edge function give you everything you need.</p>

<div class="code-block"><div class="code-label">SQL — Monitoring Schema and Views</div>
<pre><code class="language-sql">-- Core operations log table
CREATE TABLE ai_operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT now(),
  user_id UUID,
  operation TEXT NOT NULL,     -- 'chat', 'embed', 'search', 'classify'
  provider TEXT NOT NULL,      -- 'anthropic', 'openai', 'huggingface'
  model TEXT,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  latency_ms INT NOT NULL,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  status TEXT DEFAULT 'ok',    -- 'ok', 'error', 'timeout', 'rate_limited'
  cache_hit BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Real-time health dashboard view
CREATE VIEW ai_health_dashboard AS
SELECT
  date_trunc('hour', ts) AS hour,
  COUNT(*) AS total_ops,
  COUNT(*) FILTER (WHERE status = 'ok') AS successes,
  COUNT(*) FILTER (WHERE status = 'error') AS errors,
  COUNT(*) FILTER (WHERE cache_hit) AS cache_hits,
  ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit) / COUNT(*), 1) AS cache_rate,
  ROUND(AVG(latency_ms)) AS avg_latency,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_latency,
  SUM(cost_usd)::NUMERIC(10,4) AS total_cost
FROM ai_operations
WHERE ts > now() - interval '24 hours'
GROUP BY 1
ORDER BY 1 DESC;

-- Provider health comparison
CREATE VIEW provider_health AS
SELECT
  provider,
  COUNT(*) AS total_calls,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status != 'ok') / COUNT(*), 2) AS error_rate,
  ROUND(AVG(latency_ms)) AS avg_latency_ms,
  SUM(cost_usd)::NUMERIC(10,4) AS total_cost
FROM ai_operations
WHERE ts > now() - interval '1 hour'
GROUP BY provider;</code></pre>
</div>

  <p class="section-text">These views give you instant answers to the most important questions: How healthy is each provider? What's my cache hit rate? Am I spending more than expected? The <code>p95_latency</code> metric is especially important — it tells you what the slowest 5% of your users experience.</p>
</div>

<div class="lesson-section">
  <span class="section-label">Automation</span>
  <h2 class="section-title">Automated Alert Edge Function</h2>
  <p class="section-text">Monitoring is useless if nobody looks at it. Automated alerts ensure you know about problems within minutes, not hours.</p>

<div class="code-block"><div class="code-label">TypeScript — Alert Edge Function (runs on cron)</div>
<pre><code class="language-typescript">import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const alerts: string[] = [];

  // Check error rate (last 15 minutes)
  const { data: errors } = await supabase
    .from("ai_operations")
    .select("status", { count: "exact" })
    .gte("ts", new Date(Date.now() - 15 * 60_000).toISOString());

  const errorCount = errors?.filter(e => e.status === "error").length ?? 0;
  const totalCount = errors?.length ?? 1;
  const errorRate = errorCount / totalCount;

  if (errorRate > 0.05) {
    alerts.push(`Error rate ${(errorRate * 100).toFixed(1)}% (threshold: 5%)`);
  }

  // Check daily spend vs average
  const { data: costData } = await supabase
    .from("ai_health_dashboard")
    .select("total_cost")
    .limit(24);

  const todayCost = costData?.[0]?.total_cost ?? 0;
  const avgCost = costData?.slice(1)
    .reduce((sum: number, r: any) => sum + (r.total_cost ?? 0), 0)
    / Math.max(costData?.length ?? 1 - 1, 1);

  if (todayCost > avgCost * 2) {
    alerts.push(`Hourly cost $${todayCost} is 2x+ the average $${avgCost.toFixed(4)}`);
  }

  // Send alerts if any triggered
  if (alerts.length > 0) {
    await fetch(Deno.env.get("SLACK_WEBHOOK_URL")!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `AI System Alerts:\n${alerts.map(a => `• ${a}`).join("\n")}`,
      }),
    });
  }

  return new Response(JSON.stringify({ alerts }), { status: 200 });
});</code></pre>
</div>

  <p class="section-text">Schedule this function to run every 5-15 minutes using Supabase's cron extension (<code>pg_cron</code>). It checks error rates and cost anomalies, sending alerts to Slack only when thresholds are breached — keeping alert volume low and signal quality high.</p>
</div>

<div class="lesson-section">
  <span class="section-label">The Alerts</span>
  <h2 class="section-title">Alerting That Matters</h2>
  <p class="section-text"><strong>Cost alerts:</strong> Daily spend exceeds 2x the average. This catches runaway usage before the monthly bill arrives.</p>
  <p class="section-text"><strong>Latency alerts:</strong> P95 latency exceeds your SLA threshold. Users won't wait 30 seconds for an AI response — if your system is consistently slow, something is wrong.</p>
  <p class="section-text"><strong>Error rate alerts:</strong> Provider error rate exceeds 5% over a 15-minute window. Transient errors are normal; sustained errors mean an outage or misconfiguration.</p>
  <p class="section-text"><strong>Quality alerts:</strong> Negative user feedback rate exceeds baseline by 2x. This catches model regressions or bad prompt changes that automated checks might miss.</p>
  <p class="section-text">Keep alert volume low. If you're getting more than 2-3 alerts per day, your thresholds are too sensitive and you'll start ignoring them — which is worse than having no alerts at all.</p>
</div>

<div class="demo-container">
  <h3>AI Monitoring Stack (Budget-Friendly)</h3>
  <p class="section-text"><strong>Logs:</strong> Supabase table with structured JSON entries</p>
  <p class="section-text"><strong>Metrics:</strong> Aggregated from logs via scheduled SQL queries</p>
  <p class="section-text"><strong>Dashboard:</strong> Simple web page querying your metrics table</p>
  <p class="section-text"><strong>Alerts:</strong> Supabase edge function on a cron schedule, sends to Slack/email</p>
</div>

<div class="try-it-box">
  <h3>Try it yourself</h3>
  <div class="prompt-box"><code>Create a Supabase table called ai_operation_logs with columns for timestamp, user_id, provider, model, input_tokens, output_tokens, latency_ms, estimated_cost, and status. Write an edge function that inserts a log entry after every AI API call. Then write a SQL query that shows daily cost by provider for the last 7 days.</code></div>
</div>

<div class="lesson-section">
  <div data-learn="FlashDeck" data-props='{"title":"AI Monitoring Essentials","cards":[{"front":"Why AI Monitoring Is Different","back":"A 200 OK response can contain complete nonsense. Working and working correctly are two very different things in AI systems."},{"front":"Structured Log Fields","back":"Every AI operation logs: timestamp, user ID, provider, model, input/output tokens, latency ms, estimated cost, and status."},{"front":"Cost Alerts","back":"Daily spend exceeds 2x average = alert. Catches runaway usage before the monthly bill arrives."},{"front":"Cache Hit Rate","back":"Tracks how often cached responses serve users vs. fresh API calls. Low rates mean you\\\'re overspending on redundant LLM calls."},{"front":"Alert Volume Discipline","back":"More than 2-3 alerts per day means thresholds are too sensitive. You\\\'ll start ignoring them — worse than no alerts at all."}]}'></div>
</div>

<div class="lesson-section">
  <div data-learn="QuizMC" data-props='{"title":"Monitoring and Observability Quiz","questions":[{"q":"Why is AI monitoring fundamentally different from traditional monitoring?","options":["AI apps are slower","A 200 OK response from an AI endpoint can contain complete nonsense — working and working correctly are two different things","AI apps are more expensive","AI logs are harder to parse"],"correct":1,"explanation":"Traditional monitoring checks if your server is up and responding. AI monitoring must also check if the responses are accurate, appropriate, and high quality — a technically successful call can still return harmful or useless output."},{"q":"What structured log fields should every AI operation produce?","options":["Just timestamp and user ID","Timestamp, user ID, provider, model, input tokens, output tokens, latency, estimated cost, and success/failure status","Only error messages","Only the prompt and response"],"correct":1,"explanation":"This structured log gives you everything needed to reconstruct pipeline state when debugging, audit costs per user and feature, and build meaningful dashboards for operational visibility."},{"q":"What is the risk of having too many alerts?","options":["It costs too much storage","Alert fatigue — if you get more than 2-3 alerts per day, you start ignoring them, which is worse than having no alerts at all","It slows down the application","Alerts cause the AI to behave differently"],"correct":1,"explanation":"Alert volume discipline is critical. Overly sensitive thresholds train your team to ignore alerts — meaning the one real critical alert gets missed. Keep thresholds meaningful and alert volume low."}]}'></div>
</div>

<nav class="lesson-nav">
  <a href="/academy/ai-infrastructure/05-deployment-strategies/">← Previous: Deployment Strategies</a>
  <a href="/academy/ai-infrastructure/07-cost-optimization/">Next: Cost Optimization →</a>
</nav>
</div>
