---
title: "Observability & Monitoring"
course: "ai-systems-design"
order: 4
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 4 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Observability & <span class="accent">Monitoring.</span></h1>
  <p class="sub">You can't fix what you can't see. Traces, metrics, and logs for AI systems.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>The three pillars of observability applied to AI: traces, metrics, logs</li>
    <li>How to instrument model calls for cost, latency, and quality tracking</li>
    <li>Building evaluation pipelines that catch regressions before users do</li>
    <li>Tools of the trade: LangSmith, Helicone, Braintrust, and custom solutions</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Why AI Observability is Different</h2>

Traditional web observability asks: "Did the server respond with 200 OK in under 500ms?" AI observability asks all of that, plus: "Was the response actually good?"

A model call can succeed (200 OK, fast latency, valid JSON) and still produce a hallucinated, off-topic, or unsafe response. This is the fundamental challenge: correctness is not binary, latency is unpredictable, and costs vary by orders of magnitude between requests.

You need three layers of visibility:

1. **Operational metrics**: Is the system running? (Uptime, error rates, latency)
2. **Business metrics**: Is it working? (User satisfaction, task completion, revenue impact)
3. **Model metrics**: Is the AI good? (Quality scores, hallucination rates, token efficiency)

<div class="callout">
<strong>The silent failure problem:</strong> In traditional systems, failures are loud -- 500 errors, timeouts, crashes. In AI systems, the most dangerous failures are silent. The model confidently returns wrong information, and nothing in your monitoring detects it unless you've built quality evaluation into your pipeline.
</div>
</div>

<div class="lesson-section">
<h2>Tracing AI Pipelines</h2>

A trace follows a single request through every stage of your system. For AI, this means capturing not just timing but the actual prompts, completions, and intermediate state at each step.

```python
from dataclasses import dataclass, field
import time, uuid

@dataclass
class AITrace:
    trace_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    spans: list = field(default_factory=list)

    def span(self, name):
        return TraceSpan(self, name)

class TraceSpan:
    def __init__(self, trace, name):
        self.trace = trace
        self.name = name
        self.metadata = {}

    async def __aenter__(self):
        self.start = time.time()
        return self

    async def __aexit__(self, *args):
        self.duration = time.time() - self.start
        self.trace.spans.append({
            "name": self.name,
            "duration_ms": self.duration * 1000,
            **self.metadata,
        })

# Usage in a RAG pipeline
trace = AITrace()
async with trace.span("retrieval") as span:
    docs = await retriever.search(query, top_k=5)
    span.metadata = {"doc_count": len(docs), "top_score": docs[0].score}

async with trace.span("generation") as span:
    response = await model.generate(prompt, context=docs)
    span.metadata = {
        "model": "claude-sonnet-4-20250514",
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "cost_usd": calculate_cost(response.usage),
    }
```

Every trace should capture: model used, token counts, latency per stage, cost per call, and enough of the prompt/response to debug issues without logging sensitive user data.

<div class="tip-box">
<strong>Privacy guardrail:</strong> Never log raw user inputs to your observability system without PII scrubbing. Log prompt templates and metadata, not the actual user content. If you must log content for debugging, use a separate, access-controlled, auto-expiring store.
</div>
</div>

<div class="lesson-section">
<h2>The Metrics That Matter</h2>

Not all metrics are equally useful. Here are the ones that actually drive decisions:

**Latency Percentiles** (not averages):
- p50: Typical user experience
- p95: Worst case for most users
- p99: Your tail latency problem

```python
METRICS = {
    "latency_p50_ms": Histogram("ai_latency", buckets=[100, 500, 1000, 5000, 30000]),
    "tokens_per_request": Histogram("ai_tokens", buckets=[100, 500, 1000, 4000, 16000]),
    "cost_per_request_usd": Histogram("ai_cost", buckets=[0.001, 0.01, 0.05, 0.10, 1.0]),
    "cache_hit_rate": Gauge("ai_cache_hits"),
    "model_error_rate": Counter("ai_errors", labels=["model", "error_type"]),
    "quality_score": Histogram("ai_quality", buckets=[0.1, 0.3, 0.5, 0.7, 0.9, 1.0]),
}
```

**Cost Tracking** is non-negotiable. Every model call should log its cost. Aggregate by user, endpoint, model, and time period. Set alerts for anomalies: a sudden spike in token usage usually means a prompt template broke or a user is abusing the system.

**Quality Scoring** is the hard one. Options include:
- LLM-as-judge: Use a cheap model to score the expensive model's output
- Heuristic checks: Response length, citation presence, format compliance
- User signals: Thumbs up/down, retry rate, session abandonment

<div class="callout">
<strong>The alert hierarchy:</strong> Page on-call for: error rate > 5%, p99 latency > 30s, cost spike > 3x normal. Notify in Slack for: quality score drop > 10%, cache hit rate drop > 20%. Review weekly: token efficiency trends, model comparison dashboards.
</div>
</div>

<div class="lesson-section">
<h2>Evaluation Pipelines</h2>

Monitoring tells you something is wrong. Evaluation tells you what and why. Build an eval pipeline that runs on every deployment and on a regular schedule against production traffic.

```python
class EvalPipeline:
    def __init__(self, test_cases, judges):
        self.test_cases = test_cases  # Golden dataset
        self.judges = judges           # Scoring functions

    async def run(self, model_config):
        results = []
        for case in self.test_cases:
            response = await generate(case.input, config=model_config)

            scores = {}
            for judge in self.judges:
                scores[judge.name] = await judge.score(
                    input=case.input,
                    output=response,
                    expected=case.expected_output,
                )

            results.append(EvalResult(case=case, response=response, scores=scores))

        return EvalReport(results)

# Judges
relevance_judge = LLMJudge("Is the response relevant to the question? Score 0-1.")
factuality_judge = LLMJudge("Are all claims in the response factually supported?")
format_judge = HeuristicJudge(checks=["has_citations", "under_token_limit"])
```

Maintain a golden dataset of at least 50-100 test cases covering your core use cases, edge cases, and known failure modes. Run evals before every prompt change, model upgrade, or system modification. If the eval score drops, the change does not ship.

<div class="tip-box">
<strong>Eval-driven development:</strong> Write your eval cases before you write your prompts, the same way TDD works for code. Define what good looks like first, then engineer the system to pass.
</div>
</div>

<div class="lesson-section">
<h2>Tooling Landscape</h2>

You don't have to build everything from scratch. The AI observability ecosystem has matured:

- **LangSmith**: Best for LangChain-based apps. Tracing, evals, dataset management.
- **Helicone**: Proxy-based. Drop-in logging for any OpenAI/Anthropic call. Great for cost tracking.
- **Braintrust**: Evaluation-focused. Strong eval framework with human review workflows.
- **Weights & Biases (Prompts)**: Experiment tracking for prompt engineering. Version control for prompts.
- **OpenTelemetry + Grafana**: Roll your own with industry-standard tracing. Maximum flexibility, most work.

Choose based on your needs: if cost is the primary concern, Helicone. If quality evaluation is the priority, Braintrust. If you need full control, OpenTelemetry. Most mature teams use a combination.
</div>

<div data-learn="QuizMC" data-props='{"questions": [{"q": "What makes AI observability fundamentally different from traditional web observability?", "options": ["AI systems are slower", "A successful HTTP response can still contain incorrect or harmful content", "AI systems use more servers", "AI APIs don&#39;t return error codes"], "correct": 1, "explanation": "A model call can return 200 OK with fast latency and valid JSON but still produce hallucinated, off-topic, or unsafe content. Correctness is not binary in AI systems, which is why you need quality evaluation beyond standard operational metrics."}, {"q": "What should you do before shipping any prompt change or model upgrade?", "options": ["Test it manually once", "Run it against your evaluation pipeline and check for score regressions", "Just deploy and monitor", "Ask the model if the change is good"], "correct": 1, "explanation": "Run evals before every prompt change, model upgrade, or system modification. If the eval score drops, the change does not ship. This is eval-driven development -- define what good looks like first, then verify the system passes."}]}'></div>

<div data-learn="FlashDeck" data-props='{"cards": [{"front": "What are the three layers of AI observability?", "back": "1) Operational metrics (uptime, errors, latency), 2) Business metrics (satisfaction, task completion, revenue), 3) Model metrics (quality scores, hallucination rates, token efficiency)."}, {"front": "Why should you track latency percentiles instead of averages?", "back": "Averages hide tail latency. p50 shows typical experience, p95 shows worst case for most users, p99 reveals your tail latency problem. A 1s average can mask 30s p99 spikes."}, {"front": "What is eval-driven development?", "back": "Write evaluation test cases before writing prompts -- like TDD for AI. Define what good looks like first with a golden dataset of 50-100 cases, then engineer the system to pass those evals."}, {"front": "What privacy guardrail should traces follow?", "back": "Never log raw user inputs without PII scrubbing. Log prompt templates and metadata, not actual user content. If content must be logged, use a separate access-controlled, auto-expiring store."}, {"front": "Name three AI observability tools and their strengths.", "back": "Helicone: proxy-based cost tracking. Braintrust: evaluation and quality scoring. LangSmith: tracing and dataset management for LangChain apps."}]}'></div>

</div>