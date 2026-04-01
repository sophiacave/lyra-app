---
title: "Advanced Patterns"
course: "rag-vector-search"
order: 9
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Animated</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~60 min</span>
    </div>
    <h1>Advanced RAG Patterns</h1>
    <p>Four powerful patterns that take RAG from demo to production: multi-step, self-RAG, RAG+tools, and agentic RAG.</p>
  </div>

  <div class="narration">
    <strong>Beyond basic RAG:</strong> Simple query-retrieve-generate works for straightforward questions. But real-world queries often need multiple retrieval steps, conditional logic, external tools, or autonomous agents. These four patterns handle those cases.
  </div>

  <div style="background:rgba(251,146,40,.06);border:1px solid rgba(251,146,40,.15);border-radius:12px;padding:1.5rem;margin-bottom:2rem">
    <h3 style="color:#fb923c;font-size:1.1rem;margin-bottom:1rem">Which pattern should you use?</h3>
    <div style="font-size:.88rem;line-height:1.8;color:#ccc">
      <p style="margin-bottom:.75rem"><strong style="color:#e5e5e5">Start here and follow the logic:</strong></p>
      <p style="margin-bottom:.5rem;padding-left:1rem">1. Is the user's question vague or uses informal language?<br>
      <span style="color:#10b981;padding-left:1.5rem">&rarr; Yes: Use <strong>Multi-Step RAG</strong> (refine the query, then search again)</span></p>
      <p style="margin-bottom:.5rem;padding-left:1rem">2. Do some queries NOT need a database search at all?<br>
      <span style="color:#10b981;padding-left:1.5rem">&rarr; Yes: Use <strong>Self-RAG</strong> (let the AI decide if retrieval is even needed)</span></p>
      <p style="margin-bottom:.5rem;padding-left:1rem">3. Does the answer require math, API calls, or live data?<br>
      <span style="color:#10b981;padding-left:1.5rem">&rarr; Yes: Use <strong>RAG + Tools</strong> (combine retrieval with executable actions)</span></p>
      <p style="margin-bottom:.5rem;padding-left:1rem">4. Does the question span multiple databases or need a multi-step plan?<br>
      <span style="color:#10b981;padding-left:1.5rem">&rarr; Yes: Use <strong>Agentic RAG</strong> (let an agent plan and execute autonomously)</span></p>
      <p style="margin-bottom:0;padding-left:1rem;color:#a1a1aa">If none of the above apply, basic RAG (from the previous lessons) is probably all you need.</p>
    </div>
  </div>

  <div class="narration">
    <strong>Multi-Step RAG:</strong> Like asking follow-up questions. You Google something, learn the right words, then Google again with better keywords. The AI does this automatically. Query, retrieve, refine the query based on what you found, then retrieve again. Best for vague or colloquial queries that need technical vocabulary, and multi-hop questions requiring info from different document sections.
  </div>

  <div class="narration">
    <strong>Self-RAG:</strong> Like checking your own work. Before answering, you ask yourself "Do I actually need to look this up?" and after answering, "Am I sure about this?" The LLM decides whether it even needs to retrieve. Some questions can be answered directly. For others, it retrieves, then self-evaluates whether the retrieved context is sufficient. Best for high-volume systems where not every query needs retrieval.
  </div>

  <div class="narration">
    <strong>RAG + Tools:</strong> Like a researcher with a calculator and a phone. They look up data in documents, but when they need to crunch numbers or check live info, they use tools. Retrieval alone is not always enough — sometimes the answer requires calculation, API calls, or data transformation. Best for financial questions requiring calculations on retrieved data.
  </div>

  <div class="narration">
    <strong>Agentic RAG:</strong> Like a research assistant who plans their own investigation. You give them a complex question, and they decide which libraries to visit, what to look up, and when they have enough info to write a complete answer. An autonomous agent that plans its own retrieval strategy, executes multiple searches, reasons about results, and iterates. Best for enterprise knowledge bases spanning multiple document collections.
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Advanced RAG Patterns Quiz","questions":[{"q":"A user asks: \"What causes that disease where you forget things?\" Which pattern is most appropriate?","options":["Basic RAG — just search for the query as-is","Multi-Step RAG — first retrieve with the vague query, then refine to technical terminology","Self-RAG — the model likely knows this without retrieval","Agentic RAG — deploy an agent to plan the search"],"correct":1,"explanation":"Multi-Step RAG is designed for vague, colloquial queries. The first retrieval finds documents mentioning memory loss and cognitive decline. The LLM uses those terms to refine the query to \"Alzheimer\u0027s disease amyloid plaques\" — then the second retrieval finds precise medical literature."},{"q":"What is the key cost-saving benefit of Self-RAG?","options":["It uses a cheaper embedding model","It skips retrieval for queries that don\u0027t need it, saving vector DB calls and context tokens","It compresses chunk sizes automatically","It caches all previous query results"],"correct":1,"explanation":"Self-RAG lets the LLM decide whether retrieval is needed. Simple factual questions (\"What is 2+2?\") can be answered directly without a vector search. This reduces latency and cost for high-volume applications where many queries are simple."},{"q":"When should you NOT use Agentic RAG?","options":["When the question spans multiple knowledge bases","When complex synthesis across sources is needed","When a simple single-source query would work with basic RAG","When the user needs a comprehensive research-style answer"],"correct":2,"explanation":"Agentic RAG is the most powerful but also the slowest and most expensive pattern. For simple questions with a single knowledge source, basic RAG works better — faster, cheaper, and easier to debug. Only use agentic patterns when queries genuinely require multi-source planning."}]}'></div>


  <div data-learn="FlashDeck" data-props='{"title":"Advanced Pattern Vocabulary","cards":[{"front":"Multi-Step RAG","back":"Query → retrieve → refine query using found terminology → retrieve again. Handles vague or colloquial input by iteratively improving the search."},{"front":"Self-RAG","back":"LLM first decides \"do I need to retrieve?\" then after answering, self-evaluates \"is my answer grounded?\". Reduces unnecessary retrieval calls."},{"front":"RAG + Tools","back":"Combines document retrieval with executable tools (calculator, API calls, database queries) for questions requiring more than text lookup."},{"front":"Agentic RAG","back":"An autonomous agent that plans its own multi-source retrieval strategy, executes searches, evaluates sufficiency, and iterates until it has a complete answer."},{"front":"Query Refinement","back":"Using the LLM to rewrite a user\u0027s vague query into precise technical vocabulary based on terms found in the first retrieval round."}]}'></div>

</div>
