---
title: "AI Architecture Patterns"
course: "ai-systems-design"
order: 2
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-systems-design/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 2 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>AI Architecture <span class="accent">Patterns.</span></h1>
  <p class="sub">Four foundational patterns that power every serious AI deployment.</p>
</div>

<div class="learn-card">
  <h3>After this lesson you'll know</h3>
  <ul>
    <li>How to implement Gateway, Router, Orchestrator, and Pipeline patterns</li>
    <li>When to use each pattern and how to combine them</li>
    <li>Trade-offs between simplicity, flexibility, and operational cost</li>
    <li>Real-world examples from production systems at scale</li>
  </ul>
</div>

<div class="lesson-section">
<h2>Pattern 1: The Gateway</h2>

The Gateway pattern is your front door. Every request enters through a single point that handles authentication, rate limiting, input validation, and request normalization before anything touches a model.

```python
class AIGateway:
    def __init__(self, rate_limiter, validator, auth):
        self.rate_limiter = rate_limiter
        self.validator = validator
        self.auth = auth

    async def handle(self, request):
        # Step 1: Authenticate
        user = self.auth.verify(request.token)

        # Step 2: Rate limit per user tier
        if not self.rate_limiter.allow(user.tier, user.id):
            raise RateLimitError(retry_after=self.rate_limiter.retry_after(user.id))

        # Step 3: Validate and sanitize input
        clean_input = self.validator.sanitize(request.body)
        if len(clean_input.tokens) > user.tier.max_tokens:
            raise TokenLimitError(max=user.tier.max_tokens)

        # Step 4: Forward to processing layer
        return await self.processor.process(clean_input, user)
```

The Gateway never makes AI decisions. It protects the system, normalizes inputs, and enforces contracts. Think of it as the bouncer -- it decides who gets in, not what happens inside.

<div class="tip-box">
<strong>Production tip:</strong> Always validate token counts at the gateway, not at the model call. By the time you hit an API token limit, you've already consumed compute for preprocessing. Fail fast, fail cheap.
</div>
</div>

<div class="lesson-section">
<h2>Pattern 2: The Router</h2>

The Router pattern directs requests to the right handler based on intent, complexity, or content type. This is where you stop paying GPT-4 prices for GPT-3.5 work.

```python
class ModelRouter:
    ROUTES = {
        "simple_faq": {"model": "gpt-4o-mini", "max_tokens": 200},
        "technical":  {"model": "claude-sonnet-4-20250514", "max_tokens": 2000},
        "complex":    {"model": "claude-opus-4-20250514", "max_tokens": 4000},
        "code_gen":   {"model": "claude-sonnet-4-20250514", "max_tokens": 8000},
    }

    async def route(self, request):
        # Classify with a fast, cheap model
        intent = await self.classifier.classify(request.text)

        # Select configuration
        config = self.ROUTES.get(intent, self.ROUTES["complex"])

        # Check cache before calling model
        cached = await self.cache.get(request.text, intent)
        if cached:
            return cached

        return await self.call_model(request, config)
```

The classifier itself is typically a fine-tuned small model or even a rules-based system. You do not need AI to decide which AI to use -- a regex or keyword match handles 70% of routing decisions.

<div class="callout">
<strong>Cost impact:</strong> Proper routing typically reduces API costs by 40-60%. A team at a Series B startup reported dropping from $12K/month to $4.8K/month by routing simple queries to GPT-4o-mini instead of sending everything through Claude Opus.
</div>
</div>

<div class="lesson-section">
<h2>Pattern 3: The Orchestrator</h2>

The Orchestrator pattern coordinates multiple AI calls and tools to complete complex tasks. Unlike a simple chain, the orchestrator makes dynamic decisions about what to do next based on intermediate results.

```python
class TaskOrchestrator:
    async def execute(self, task):
        plan = await self.planner.create_plan(task)

        results = []
        for step in plan.steps:
            # Execute step with appropriate tool
            if step.type == "retrieval":
                result = await self.retriever.search(step.query)
            elif step.type == "analysis":
                result = await self.analyzer.analyze(step.data, results)
            elif step.type == "generation":
                result = await self.generator.generate(step.prompt, context=results)

            results.append(result)

            # Dynamic replanning based on results
            if result.confidence < 0.7:
                plan = await self.planner.replan(task, results)

        return await self.synthesizer.combine(results)
```

The key differentiator is dynamic replanning. A pipeline always executes the same steps. An orchestrator adapts based on what it learns at each stage. This is the pattern behind AI agents, coding assistants, and research tools.

<div class="tip-box">
<strong>Guard rail:</strong> Always set a maximum iteration count on orchestrators. Without it, a confused planner can loop indefinitely, burning tokens and time. Most production systems cap at 5-10 iterations.
</div>
</div>

<div class="lesson-section">
<h2>Pattern 4: The Pipeline</h2>

The Pipeline pattern chains deterministic stages in a fixed sequence. Each stage transforms the data and passes it forward. Unlike the orchestrator, there is no branching or replanning.

```python
class DocumentPipeline:
    stages = [
        ChunkStage(max_tokens=500, overlap=50),
        EmbedStage(model="text-embedding-3-small"),
        RetrieveStage(top_k=5, threshold=0.75),
        AugmentStage(template="answer_with_sources"),
        GenerateStage(model="claude-sonnet-4-20250514", max_tokens=2000),
        ValidateStage(checks=["no_hallucination", "has_citations"]),
    ]

    async def run(self, document, query):
        context = {"document": document, "query": query}
        for stage in self.stages:
            context = await stage.process(context)
            if context.get("abort"):
                return context["abort_reason"]
        return context["response"]
```

Pipelines are ideal for RAG, document processing, and any workflow where the steps are known in advance. They are simpler to debug, test, and monitor than orchestrators because each stage has a fixed input/output contract.

<div class="callout">
<strong>Combining patterns:</strong> Most production systems combine all four. A Gateway fronts the system, a Router dispatches to different Pipelines, and complex requests get an Orchestrator. The patterns are composable, not competing.
</div>
</div>

<div class="lesson-section">
<h2>Choosing the Right Pattern</h2>

| Pattern | Best For | Complexity | Debuggability |
|---------|----------|------------|---------------|
| Gateway | All systems (mandatory) | Low | High |
| Router | Multi-model, cost optimization | Medium | High |
| Pipeline | RAG, document processing, ETL | Medium | High |
| Orchestrator | Agents, complex reasoning, multi-step tasks | High | Medium |

Start with Gateway + Pipeline. Add Router when costs matter. Add Orchestrator only when tasks require dynamic decision-making. Over-engineering early is the second most common failure mode after under-engineering.
</div>

<QuizMC
  question="What is the primary difference between a Pipeline and an Orchestrator?"
  options={["Pipelines are faster", "Orchestrators use more expensive models", "Pipelines follow fixed stages while Orchestrators dynamically replan based on results", "There is no meaningful difference"]}
  correct={2}
  explanation="The key difference is dynamic replanning. Pipelines always execute the same fixed sequence of stages. Orchestrators evaluate intermediate results and can change their plan, add steps, or retry with different approaches."
/>

<QuizMC
  question="Why should token counts be validated at the Gateway rather than at the model call?"
  options={["Gateways are faster", "To fail fast before consuming compute on preprocessing", "Models can't count tokens accurately", "It's a security requirement"]}
  correct={1}
  explanation="By the time you hit a token limit at the model API, you've already spent compute on preprocessing, embedding, retrieval, and prompt construction. Validating at the gateway lets you reject oversized requests immediately -- fail fast, fail cheap."
/>

<FlashDeck cards={[
  { front: "What does the Gateway pattern handle?", back: "Authentication, rate limiting, input validation, token count enforcement, and request normalization. It protects the system and enforces contracts without making AI decisions." },
  { front: "How much can proper model routing reduce API costs?", back: "Typically 40-60%. By routing simple queries to cheaper models (e.g., GPT-4o-mini instead of Opus), you avoid overpaying for tasks that don't need frontier intelligence." },
  { front: "What safeguard is essential for Orchestrator patterns?", back: "A maximum iteration count. Without it, a confused planner can loop indefinitely, burning tokens and time. Production systems typically cap at 5-10 iterations." },
  { front: "When should you use a Pipeline vs. an Orchestrator?", back: "Use Pipelines when steps are known in advance (RAG, document processing). Use Orchestrators when the task requires dynamic decision-making based on intermediate results (agents, complex reasoning)." },
  { front: "How do the four patterns compose in production?", back: "Gateway fronts the system (mandatory). Router dispatches to different Pipelines. Complex requests get an Orchestrator. The patterns are composable layers, not competing alternatives." }
]} />

</div>