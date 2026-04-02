---
title: "Prompt Augmentation"
course: "rag-vector-search"
order: 6
type: "lesson"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/rag-vector-search/">RAG &amp; Vector Search</a>
  <span class="lesson-badge">Lesson 6 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Prompt Augmentation</h1>
  <p class="sub">The "A" in RAG. You have retrieved the right documents — now you need to hand them to the LLM in a way that produces accurate, grounded answers instead of confident hallucinations. Prompt engineering for RAG is a discipline of its own. This lesson teaches you the templates, the rules, and the code to get it right.</p>
</div>

  <div class="section">
    <h2>The Critical Moment</h2>
    <p>You have retrieved your top-K chunks. They contain the information the user needs. But the answer quality now depends entirely on <strong>how you present that context to the LLM</strong>. A poorly constructed prompt can produce hallucinations even with perfect retrieval. A well-constructed prompt produces grounded, citable answers every time.</p>

    <p>There are three elements to get right: <strong>grounding instructions</strong> (tell the LLM to use only the context), <strong>context formatting</strong> (make the context easy to parse), and <strong>fallback handling</strong> (what to do when the context does not contain the answer).</p>
  </div>

  <div class="section">
    <h2>Same Question, Dramatically Different Answers</h2>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <h4 style="color:#ef4444;margin-bottom:.75rem">Without RAG Context</h4>
        <p style="font-size:.82rem;color:#71717a;margin-bottom:.5rem"><em>"What is the refund policy for the Pro plan?"</em></p>
        <p style="font-size:.85rem;color:#a1a1aa;line-height:1.6">Based on industry standards, most SaaS companies offer a <span style="color:#ef4444;text-decoration:line-through">30-day money-back guarantee</span> for their Pro plans. You can typically <span style="color:#ef4444;text-decoration:line-through">request a refund through the settings page</span> or by <span style="color:#ef4444;text-decoration:line-through">emailing support@company.com</span>.</p>
        <p style="font-size:.75rem;color:#ef4444;font-weight:600;margin-top:.75rem">3 hallucinations. Sounds confident but completely fabricated.</p>
      </div>
      <div style="padding:1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <h4 style="color:#34d399;margin-bottom:.75rem">With RAG Context</h4>
        <p style="font-size:.82rem;color:#71717a;margin-bottom:.5rem"><em>"What is the refund policy for the Pro plan?"</em></p>
        <p style="font-size:.85rem;color:#a1a1aa;line-height:1.6">According to the billing documentation, the Pro plan has a <span style="color:#34d399">14-day refund window</span> from the date of purchase. To request a refund, <span style="color:#34d399">contact billing@acme.io</span> with your order number. After 14 days, refunds are handled <span style="color:#34d399">on a case-by-case basis</span>.</p>
        <p style="font-size:.75rem;color:#34d399;font-weight:600;margin-top:.75rem">0 hallucinations. Every claim traced to retrieved context.</p>
      </div>
    </div>

    <p>The difference is not the LLM — it is the prompt. The grounded answer uses a template that forces the model to answer from context, not from its training data.</p>
  </div>

  <div class="section">
    <h2>The RAG Prompt Template</h2>
    <p>Here is the production-grade template that prevents hallucination:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">import</span> anthropic

claude = anthropic.Anthropic()

SYSTEM_PROMPT = <span style="color:#fbbf24">"""You are a knowledgeable assistant. Follow these rules strictly:

1. Answer based ONLY on the provided context documents.
2. If the context does not contain enough information to answer,
   say "I don't have that information in my knowledge base."
3. Cite the source document for each claim using [Source: filename].
4. If multiple sources agree, mention all of them.
5. If sources contradict each other, note the discrepancy.
6. Keep answers concise — 2-4 sentences for simple questions,
   structured paragraphs for complex ones.
7. Never speculate or fill gaps with general knowledge."""</span>

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">build_augmented_prompt</span>(question, chunks):
    <span style="color:#fb923c">"""Build a RAG prompt with retrieved context."""</span>

    <span style="color:#71717a"># Format each chunk with clear delimiters and source</span>
    context_sections = []
    <span style="color:#c084fc">for</span> i, chunk <span style="color:#c084fc">in</span> <span style="color:#34d399">enumerate</span>(chunks):
        source = chunk.get(<span style="color:#fbbf24">"source"</span>, <span style="color:#fbbf24">"unknown"</span>)
        score = chunk.get(<span style="color:#fbbf24">"similarity"</span>, <span style="color:#fbbf24">0</span>)
        context_sections.append(
            <span style="color:#c084fc">f</span><span style="color:#fbbf24">"--- Document {i+1} [Source: {source}] (relevance: {score:.2f}) ---\n"</span>
            <span style="color:#c084fc">f</span><span style="color:#fbbf24">"{chunk['content']}"</span>
        )

    context = <span style="color:#fbbf24">"\n\n"</span>.join(context_sections)

    user_message = <span style="color:#c084fc">f</span><span style="color:#fbbf24">"""Context documents:

{context}

---

Question: {question}"""</span>

    <span style="color:#c084fc">return</span> user_message

<span style="color:#c084fc">def</span> <span style="color:#38bdf8">generate_answer</span>(question, chunks):
    <span style="color:#fb923c">"""Generate a grounded answer from retrieved chunks."""</span>
    user_message = build_augmented_prompt(question, chunks)

    response = claude.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
        max_tokens=<span style="color:#fbbf24">1024</span>,
        temperature=<span style="color:#fbbf24">0.1</span>,  <span style="color:#71717a"># Low temperature for factual answers</span>
        system=SYSTEM_PROMPT,
        messages=[{<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: user_message}]
    )
    <span style="color:#c084fc">return</span> response.content[<span style="color:#fbbf24">0</span>].text</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Six Rules for RAG Prompts</h2>
    <p>These rules are the difference between a RAG system that hallucInates 30% of the time and one that hallucInates 3% of the time:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Rule 1: Be Explicit About Grounding</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">"Answer ONLY based on the provided context" is the most important instruction in any RAG prompt. Without it, the LLM blends context with training data — introducing potential hallucinations even with perfect retrieval.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Rule 2: Handle Missing Information</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">"If the context doesn't contain the answer, say 'I don't have that information.'" This prevents the model from filling gaps with plausible-sounding inventions. A truthful "I don't know" is infinitely more valuable than a confident hallucination.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Rule 3: Request Citations</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">"Cite the source for each claim" makes answers verifiable. Users can check the original document. It also catches hallucinations — if the model cites a source that does not exist or does not support the claim, you know something went wrong.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444">Rule 4: Use Clear Delimiters</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Separate context blocks with <code>---</code> or triple backticks. Label each chunk with its source. This helps the LLM distinguish context from instructions and different documents from each other.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8">Rule 5: System vs. User Role</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Put grounding instructions in the <strong>system message</strong> and context + question in the <strong>user message</strong>. The system message sets persistent behavior that the model follows more reliably than instructions mixed into the user message.</p>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.1)">
        <strong style="color:#facc15">Rule 6: Control Output Format</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">"Answer in 2-3 sentences" or "Use bullet points" keeps responses focused. Long, rambling answers are harder to verify and more likely to contain unsupported claims buried in the text.</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Advanced Prompt Patterns</h2>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Multi-Document Synthesis</h3>
    <p>When chunks come from different sources, add this instruction: "If multiple sources provide different information on the same topic, present all perspectives and note which source supports each claim." This is critical for knowledge bases where documents may have been written at different times or by different authors.</p>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Structured Output</h3>
    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#71717a"># For structured answers (e.g., comparison queries)</span>
STRUCTURED_SYSTEM = <span style="color:#fbbf24">"""Answer based ONLY on the provided context.
Format your response as:
- **Summary**: 1-2 sentence answer
- **Details**: Key points as bullet points
- **Sources**: List which documents support each point
- **Gaps**: Note any aspects the context does not cover"""</span></code></pre>
    </div>

    <h3 style="font-size:.95rem;margin:1.5rem 0 .75rem;color:#e5e5e5">Conversational RAG</h3>
    <p>For chatbots that maintain conversation history, include previous turns in the prompt but always put fresh context first:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
      <pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">def</span> <span style="color:#38bdf8">conversational_rag</span>(question, chunks, history):
    <span style="color:#fb923c">"""RAG with conversation memory."""</span>
    context = format_chunks(chunks)

    messages = [{
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#c084fc">f</span><span style="color:#fbbf24">"Context (freshly retrieved):\n{context}"</span>
    }, {
        <span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"assistant"</span>,
        <span style="color:#fbbf24">"content"</span>: <span style="color:#fbbf24">"I've reviewed the context. What would you like to know?"</span>
    }]

    <span style="color:#71717a"># Add conversation history</span>
    messages.extend(history)

    <span style="color:#71717a"># Add current question</span>
    messages.append({<span style="color:#fbbf24">"role"</span>: <span style="color:#fbbf24">"user"</span>, <span style="color:#fbbf24">"content"</span>: question})

    <span style="color:#c084fc">return</span> claude.messages.create(
        model=<span style="color:#fbbf24">"claude-sonnet-4-20250514"</span>,
        system=SYSTEM_PROMPT,
        messages=messages
    ).content[<span style="color:#fbbf24">0</span>].text</code></pre>
    </div>
  </div>

  <div class="section">
    <h2>Common Mistakes</h2>
    <div style="background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1.25rem;margin:1rem 0;font-size:.85rem;color:#a1a1aa;line-height:1.7">
      <strong style="color:#ef4444">Mistake 1: No grounding instruction.</strong> Without "Answer based ONLY on the context," the model freely mixes retrieved facts with training data. This is the #1 cause of RAG hallucination.<br><br>
      <strong style="color:#ef4444">Mistake 2: Context and instructions mixed together.</strong> When context and system instructions are in the same message, the model sometimes treats context as instructions or instructions as context. Separate them clearly.<br><br>
      <strong style="color:#ef4444">Mistake 3: No fallback for unanswerable questions.</strong> Without "say I don't know," the model will fabricate an answer rather than admit the context does not cover the question.<br><br>
      <strong style="color:#ef4444">Mistake 4: High temperature.</strong> Temperature above 0.3 for factual RAG increases creativity — which means more hallucination. Keep it at 0.0-0.2.
    </div>
  </div>

  <div class="divider"><span>Test Your Understanding</span></div>

  <div data-learn="QuizMC" data-props='{"title":"Prompt Augmentation Quiz","questions":[{"q":"What is the most important instruction to include in a RAG prompt to prevent hallucination?","options":["Set the temperature to 0","Include \"Answer ONLY based on the provided context\"","Use GPT-4 instead of GPT-3.5","Always include at least 10 retrieved chunks"],"correct":1,"explanation":"Explicit grounding instructions tell the model to restrict itself to the retrieved context. Without this, the model may blend context with its training knowledge, which can introduce confident but incorrect information."},{"q":"Why should you add \"If the context doesn\u0027t contain the answer, say I don\u0027t have that information\"?","options":["To reduce API costs","To prevent the model from hallucinating an answer to a question the retrieved context cannot support","To make responses shorter","To improve vector search recall"],"correct":1,"explanation":"Without this instruction, the model may fill gaps in the context with plausible-sounding invented information. Explicitly handling the \"I don\u0027t know\" case forces the model to acknowledge the limits of its retrieved knowledge rather than fabricate."},{"q":"Where should grounding instructions be placed in a chat API prompt?","options":["In the user message alongside the question","In the system message","In the assistant message as a prefix","Grounding instructions should not be used"],"correct":1,"explanation":"The system message sets persistent behavior for the entire conversation. Placing grounding rules there means they apply to every response and cannot be accidentally overridden by user input phrasing."},{"q":"Why is low temperature (0.0-0.2) recommended for RAG answers?","options":["It makes the model respond faster","It reduces hallucination by making the model more deterministic and less likely to improvise","It saves API tokens","It is required by all vector databases"],"correct":1,"explanation":"Temperature controls randomness. Low temperature makes the model stick closely to the context, reducing creative improvisation. For factual RAG answers you want reliability over creativity."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Prompt Augmentation Vocabulary","cards":[{"front":"Grounding Instruction","back":"A directive in the system prompt like \"Answer ONLY based on the provided context\" that constrains the LLM to use retrieved facts, not training memory."},{"front":"Augmented Prompt","back":"A prompt that includes retrieved document chunks as context alongside the user question. The bridge between retrieval and generation."},{"front":"Context Delimiter","back":"Clear separators (--- or triple backticks) around context blocks so the LLM can distinguish retrieved content from instructions."},{"front":"Citation Prompt","back":"An instruction asking the model to reference specific sources: \"Cite the source for each claim.\" Increases answer verifiability."},{"front":"Fallback Instruction","back":"\"If the context doesn\u0027t contain the answer, say I don\u0027t know.\" Prevents hallucination on unanswerable questions."},{"front":"System vs User Role","back":"Grounding rules go in the system message (persistent behavior). Context + question go in the user message (per-turn input)."}]}'></div>

</div>
