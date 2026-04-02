---
title: "Advanced Patterns"
course: "rag-vector-search"
order: 9
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 9 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Advanced RAG Patterns</h1>
  <p class="sub">Basic RAG handles straightforward questions. But real-world queries are messy — vague, multi-step, requiring calculations, or spanning multiple knowledge bases. Four advanced patterns handle these cases: Multi-Step RAG, Self-RAG, RAG+Tools, and Agentic RAG. This lesson teaches you when to use each and how to implement them.</p>
</div>

  <div class="section">
    <h2>When Basic RAG Is Not Enough</h2>
    <p>Basic RAG works beautifully for direct questions with clear answers in your knowledge base: "What is the refund policy?" retrieves the policy chunk and generates a grounded answer. But consider these harder cases:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">"What causes that disease where you forget things?"</strong> → The query is too vague for precise retrieval. Basic RAG might return general cognitive decline articles instead of targeted Alzheimer's content.<br><br>
      <strong style="color:#e5e5e5">"What is 2 + 2?"</strong> → This does not need retrieval at all. Fetching documents wastes time and money.<br><br>
      <strong style="color:#e5e5e5">"How much did we spend on marketing last quarter?"</strong> → The answer requires a calculation on retrieved data, not just a summary.<br><br>
      <strong style="color:#e5e5e5">"Compare our 2023 and 2024 product roadmaps"</strong> → The answer spans multiple document collections and requires synthesis.
    </div>

    <p>Each of these scenarios needs a different pattern. Here is when to use each:</p>

    <div style="background:rgba(192,132,252,.06);border:1px solid rgba(192,132,252,.12);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;font-size:.88rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#e5e5e5">Decision Guide:</strong><br>
      Is the query vague or uses informal language? → <strong style="color:#34d399">Multi-Step RAG</strong><br>
      Does the query even need retrieval? → <strong style="color:#8b5cf6">Self-RAG</strong><br>
      Does the answer need math, API calls, or live data? → <strong style="color:#fb923c">RAG + Tools</strong><br>
      Does the question span multiple databases or need planning? → <strong style="color:#ef4444">Agentic RAG</strong><br>
      None of the above? → <strong style="color:#71717a">Basic RAG is fine.</strong>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 1: Multi-Step RAG</h2>
    <p>Like asking follow-up questions. The first retrieval finds relevant documents, the LLM extracts better keywords from those documents, and a second retrieval uses those refined terms for precise results.</p>

    <p><strong>Best for:</strong> Vague, colloquial queries that need technical vocabulary. Multi-hop questions requiring information from different sections.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">multi_step_rag</span>(question, rag_search, generate):
    <span style="color:#fb923c">"""Refine the query using first-round retrieval, then search again."""</span>

    <span style="color:#71717a"># Step 1: Initial retrieval with the vague query</span>
    initial_chunks = rag_search(question, top_k=<span style="color:#fbbf24">3</span>)
    initial_context = <span style="color:#fbbf24">"\n"</span>.join([c[<span style="color:#fbbf24">"content"</span>] <span style="color:#c084fc">for</span> c <span style="color:#c084fc">in</span> initial_chunks])

    <span style="color:#71717a"># Step 2: Ask the LLM to refine the query</span>
    refined = generate(
        system=<span style="color:#fbbf24">"Based on the context below, rewrite the user's question "
               "using precise technical terms found in the documents. "
               "Return ONLY the refined query, nothing else."</span>,
        user=<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Context:\n{initial_context}\n\nOriginal query: {question}"</span>
    )

    <span style="color:#71717a"># Step 3: Second retrieval with the refined query</span>
    final_chunks = rag_search(refined, top_k=<span style="color:#fbbf24">5</span>)

    <span style="color:#71717a"># Step 4: Generate answer from better context</span>
    <span style="color:#c084fc">return</span> generate_grounded_answer(question, final_chunks)

<span style="color:#71717a"># Example: "that disease where you forget things"</span>
<span style="color:#71717a"># Step 1 retrieves general cognitive decline articles</span>
<span style="color:#71717a"># Step 2 refines to "Alzheimer's disease amyloid plaques tau proteins"</span>
<span style="color:#71717a"># Step 3 retrieves precise Alzheimer's research papers</span></code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 2: Self-RAG</h2>
    <p>The LLM decides <em>whether</em> it needs to retrieve at all, then self-evaluates the quality of its answer after generating. This saves retrieval costs for simple questions and catches hallucinations through self-critique.</p>

    <p><strong>Best for:</strong> High-volume systems where many queries are simple and do not need retrieval.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">self_rag</span>(question, rag_search, generate):
    <span style="color:#fb923c">"""Let the LLM decide if retrieval is needed, then self-evaluate."""</span>

    <span style="color:#71717a"># Step 1: Should we retrieve?</span>
    needs_retrieval = generate(
        system=<span style="color:#fbbf24">"Does this question require looking up specific information "
               "from a knowledge base? Answer YES or NO only."</span>,
        user=question
    ).strip().upper()

    <span style="color:#c084fc">if</span> needs_retrieval == <span style="color:#fbbf24">"YES"</span>:
        chunks = rag_search(question, top_k=<span style="color:#fbbf24">5</span>)
        answer = generate_grounded_answer(question, chunks)
    <span style="color:#c084fc">else</span>:
        answer = generate(system=<span style="color:#fbbf24">"Answer directly."</span>, user=question)

    <span style="color:#71717a"># Step 2: Self-evaluate</span>
    evaluation = generate(
        system=<span style="color:#fbbf24">"Rate the answer's quality 1-5. If below 3, say RETRY."</span>,
        user=<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Q: {question}\nA: {answer}"</span>
    )

    <span style="color:#c084fc">if</span> <span style="color:#fbbf24">"RETRY"</span> <span style="color:#c084fc">in</span> evaluation:
        <span style="color:#71717a"># Force retrieval on retry</span>
        chunks = rag_search(question, top_k=<span style="color:#fbbf24">8</span>)
        answer = generate_grounded_answer(question, chunks)

    <span style="color:#c084fc">return</span> answer</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 3: RAG + Tools</h2>
    <p>Retrieval alone is not always enough. Sometimes the answer requires a calculation on retrieved data, an API call for live information, or a database query. RAG+Tools gives the LLM access to executable functions alongside document retrieval.</p>

    <p><strong>Best for:</strong> Financial queries requiring math, questions needing live data, data transformation tasks.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

claude = anthropic.Anthropic()

tools = [
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"search_knowledge_base"</span>,
        <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Search the knowledge base for relevant documents"</span>,
        <span style="color:#fbbf24">"input_schema"</span>: {
            <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"object"</span>,
            <span style="color:#fbbf24">"properties"</span>: {
                <span style="color:#fbbf24">"query"</span>: {<span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>, <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Search query"</span>}
            },
            <span style="color:#fbbf24">"required"</span>: [<span style="color:#fbbf24">"query"</span>]
        }
    },
    {
        <span style="color:#fbbf24">"name"</span>: <span style="color:#fbbf24">"calculate"</span>,
        <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Perform a mathematical calculation"</span>,
        <span style="color:#fbbf24">"input_schema"</span>: {
            <span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"object"</span>,
            <span style="color:#fbbf24">"properties"</span>: {
                <span style="color:#fbbf24">"expression"</span>: {<span style="color:#fbbf24">"type"</span>: <span style="color:#fbbf24">"string"</span>, <span style="color:#fbbf24">"description"</span>: <span style="color:#fbbf24">"Math expression"</span>}
            },
            <span style="color:#fbbf24">"required"</span>: [<span style="color:#fbbf24">"expression"</span>]
        }
    }
]

<span style="color:#71717a"># The LLM decides which tools to call and in what order</span>
response = claude.messages.create(
    model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
    max_tokens=<span style="color:#fbbf24">1024</span>,
    tools=tools,
    messages=[{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"How much did marketing spend last quarter and what % of total budget was that?"</span>
    }]
)
<span style="color:#71717a"># LLM calls search_knowledge_base → gets spending data → calls calculate → returns answer</span></code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Pattern 4: Agentic RAG</h2>
    <p>The most powerful pattern — an autonomous agent that plans its own retrieval strategy. Given a complex question, it decides which knowledge bases to search, in what order, evaluates whether it has enough information, and iterates until it can give a complete answer.</p>

    <p><strong>Best for:</strong> Enterprise knowledge bases spanning multiple collections. Research-style queries requiring synthesis from diverse sources. Questions that require a multi-step investigation.</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">class</span> <span style="color:#34d399">AgenticRAG</span>:
    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">__init__</span>(self, knowledge_bases):
        self.kbs = knowledge_bases  <span style="color:#71717a"># {"hr": hr_search, "finance": finance_search, ...}</span>
        self.context = []
        self.max_iterations = <span style="color:#fbbf24">5</span>

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">plan</span>(self, question):
        <span style="color:#fb923c">"""Ask the LLM to create a retrieval plan."""</span>
        <span style="color:#c084fc">return</span> generate(
            system=<span style="color:#fbbf24">f</span><span style="color:#fbbf24">"Available knowledge bases: {list(self.kbs.keys())}. "
                   "Create a step-by-step plan to answer this question. "
                   "For each step, specify which KB to search and what query."</span>,
            user=question
        )

    <span style="color:#c084fc">def</span> <span style="color:#38bdf8">execute</span>(self, question):
        <span style="color:#fb923c">"""Run the agentic loop: plan → search → evaluate → iterate."""</span>
        plan = self.plan(question)

        <span style="color:#c084fc">for</span> iteration <span style="color:#c084fc">in</span> <span style="color:#34d399">range</span>(self.max_iterations):
            <span style="color:#71717a"># Execute next step in the plan</span>
            kb_name, query = self.parse_next_step(plan)
            chunks = self.kbs[kb_name](query, top_k=<span style="color:#fbbf24">5</span>)
            self.context.extend(chunks)

            <span style="color:#71717a"># Evaluate: do we have enough info?</span>
            sufficient = generate(
                system=<span style="color:#fbbf24">"Given this context, can you fully answer the question? "
                       "YES or NO with reason."</span>,
                user=<span style="color:#c084fc">f</span><span style="color:#fbbf24">"Q: {question}\nContext: {self.format_context()}"</span>
            )

            <span style="color:#c084fc">if</span> <span style="color:#fbbf24">"YES"</span> <span style="color:#c084fc">in</span> sufficient:
                <span style="color:#c084fc">break</span>

        <span style="color:#c084fc">return</span> generate_grounded_answer(question, self.context)</code></pre>
    </div>

    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">When NOT to use Agentic RAG:</strong> Simple questions with a single knowledge source. Agentic RAG is the most powerful but also the slowest and most expensive pattern — multiple LLM calls, multiple searches, planning overhead. For straightforward queries, basic RAG is faster, cheaper, and easier to debug.
    </div>
  </div>

  <div class="section">
    <h2>Choosing the Right Pattern</h2>
    <p>Start simple and upgrade only when needed:</p>

    <div style="font-size:.85rem;color:#a1a1aa;line-height:1.8;margin:1rem 0">
      <strong style="color:#e5e5e5">80% of queries:</strong> Basic RAG handles them perfectly. Do not over-engineer.<br>
      <strong style="color:#e5e5e5">10% of queries:</strong> Multi-Step or Self-RAG improves quality for vague or simple queries.<br>
      <strong style="color:#e5e5e5">8% of queries:</strong> RAG+Tools handles queries needing calculation or live data.<br>
      <strong style="color:#e5e5e5">2% of queries:</strong> Agentic RAG handles complex, multi-source research queries.<br><br>
      Build basic RAG first. Measure where it fails. Add advanced patterns only for the failure cases.
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Advanced RAG Patterns Quiz","questions":[{"q":"A user asks: \"What causes that disease where you forget things?\" Which pattern is most appropriate?","options":["Basic RAG — just search for the query as-is","Multi-Step RAG — first retrieve with the vague query, then refine to technical terminology","Self-RAG — the model likely knows this without retrieval","Agentic RAG — deploy an agent to plan the search"],"correct":1,"explanation":"Multi-Step RAG is designed for vague, colloquial queries. The first retrieval finds documents mentioning memory loss and cognitive decline. The LLM uses those terms to refine the query to precise medical terminology, then the second retrieval finds targeted results."},{"q":"What is the key cost-saving benefit of Self-RAG?","options":["It uses a cheaper embedding model","It skips retrieval for queries that don\u0027t need it, saving vector DB calls and context tokens","It compresses chunk sizes automatically","It caches all previous query results"],"correct":1,"explanation":"Self-RAG lets the LLM decide whether retrieval is needed. Simple factual questions can be answered directly without a vector search. This reduces latency and cost for high-volume applications where many queries are simple."},{"q":"When should you NOT use Agentic RAG?","options":["When the question spans multiple knowledge bases","When complex synthesis across sources is needed","When a simple single-source query would work with basic RAG","When the user needs a comprehensive research-style answer"],"correct":2,"explanation":"Agentic RAG is the most powerful but also the slowest and most expensive pattern. For simple questions with a single knowledge source, basic RAG works better — faster, cheaper, and easier to debug."},{"q":"A user asks \"How much revenue did we make in Q3 and what was the growth rate vs Q2?\" Which pattern?","options":["Basic RAG — it can find the numbers","Multi-Step RAG — the query needs refinement","RAG + Tools — retrieval finds the data, a calculator computes the growth rate","Self-RAG — no retrieval needed"],"correct":2,"explanation":"This query requires two things: (1) retrieving revenue figures from the knowledge base, and (2) calculating a growth rate — a mathematical operation that RAG alone cannot do. RAG+Tools combines document retrieval with a calculator tool."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Advanced Pattern Vocabulary","cards":[{"front":"Multi-Step RAG","back":"Query → retrieve → refine query using terminology from results → retrieve again. Handles vague input by iteratively improving the search."},{"front":"Self-RAG","back":"LLM first decides \"do I need to retrieve?\" then after answering, self-evaluates quality. Saves cost on simple queries, catches hallucinations."},{"front":"RAG + Tools","back":"Combines document retrieval with executable tools (calculator, API calls, database queries) for questions requiring more than text lookup."},{"front":"Agentic RAG","back":"An autonomous agent that plans its own multi-source retrieval strategy, executes searches, evaluates sufficiency, and iterates until complete."},{"front":"Query Refinement","back":"Using the LLM to rewrite a vague query into precise technical vocabulary based on terms found in first-round retrieval results."},{"front":"Tool Use (Function Calling)","back":"The LLM decides which tools to call and with what parameters. In RAG+Tools, the knowledge base search is one tool among several."}]}'></div>

</div>
