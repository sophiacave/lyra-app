---
title: "Prompt Augmentation"
course: "rag-vector-search"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~50 min</span>
    </div>
    <h1>Prompt Augmentation</h1>
    <p>The "A" in RAG. How you insert retrieved context into the prompt determines whether the LLM gives accurate answers or confident hallucinations.</p>
  </div>

  <div class="narration">
    <strong>The critical moment in RAG:</strong> You have your retrieved chunks. Now you need to construct a prompt that tells the LLM: "Here is the context. Answer based ONLY on this context." The template you use for this matters enormously. See the difference below.
  </div>

  <h3 class="section">Same Question, Dramatically Different Answers</h3>

  <div class="side-by-side">
    <div class="response-panel without">
      <h4 style="color:#ef4444">Without RAG Context</h4>
      <div class="q">"What is the refund policy for the Pro plan?"</div>
      <p>Based on industry standards, most SaaS companies offer a <span class="hallucination">30-day money-back guarantee</span> for their Pro plans. You can typically <span class="hallucination">request a refund through the settings page</span> or by <span class="hallucination">emailing support@company.com</span>. Pro plans usually cost <span class="hallucination">$49/month</span> and include premium features.</p>
      <p style="margin-top:.75rem;font-size:.75rem;color:#ef4444;font-weight:600">4 hallucinations. Sounds confident but completely made up.</p>
    </div>
    <div class="response-panel with">
      <h4 style="color:#10b981">With RAG Context</h4>
      <div class="q">"What is the refund policy for the Pro plan?"</div>
      <p>According to our documentation, the Pro plan has a <span class="grounded">14-day refund window</span> from the date of purchase. To request a refund, <span class="grounded">contact billing@acme.io</span> with your order number. After 14 days, refunds are handled <span class="grounded">on a case-by-case basis</span> by the support team.</p>
      <p style="margin-top:.75rem;font-size:.75rem;color:#10b981;font-weight:600">0 hallucinations. Every claim traced to retrieved context.</p>
    </div>
  </div>

  <h3 class="section">Prompt Engineering Tips for RAG</h3>
  <div class="tips">
    <div class="tip"><h4>Be Explicit About Grounding</h4><p>"Answer ONLY based on the provided context" prevents the LLM from filling gaps with training knowledge that may be wrong.</p></div>
    <div class="tip"><h4>Handle Missing Info</h4><p>Add: "If the context doesn't contain the answer, say 'I don't have that information.'" This prevents hallucination on unanswerable questions.</p></div>
    <div class="tip"><h4>Request Citations</h4><p>"Cite the specific passage that supports your answer" makes responses verifiable and catches cases where the model fabricates sources.</p></div>
    <div class="tip"><h4>Control Format</h4><p>"Answer in 2-3 sentences" or "Use bullet points" keeps responses focused. Long, rambling answers are harder to verify.</p></div>
    <div class="tip"><h4>Separate Context Clearly</h4><p>Use clear delimiters like --- or triple backticks around context. This helps the LLM distinguish context from instructions.</p></div>
    <div class="tip"><h4>System vs User Role</h4><p>Put grounding instructions in the system message, context+question in the user message. This leverages the model's role-following behavior.</p></div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Prompt Augmentation Quiz","questions":[{"q":"What is the most important instruction to include in a RAG prompt to prevent hallucination?","options":["Set the temperature to 0","Include \"Answer ONLY based on the provided context\"","Use GPT-4 instead of GPT-3.5","Always include at least 10 retrieved chunks"],"correct":1,"explanation":"Explicit grounding instructions tell the model to restrict itself to the retrieved context. Without this, the model may blend context with its training knowledge, which can introduce confident but incorrect information."},{"q":"Why should you add \"If the context doesn\u0027t contain the answer, say I don\u0027t have that information\"?","options":["To reduce API costs","To prevent the model from hallucinating an answer to a question the retrieved context cannot support","To make responses shorter","To improve vector search recall"],"correct":1,"explanation":"Without this instruction, the model may fill gaps in the context with plausible-sounding invented information. Explicitly handling the \"I don\u0027t know\" case forces the model to acknowledge the limits of its retrieved knowledge rather than fabricate."},{"q":"Where should grounding instructions be placed in a chat API prompt?","options":["In the user message alongside the question","In the system message","In the assistant message as a prefix","Grounding instructions should not be used"],"correct":1,"explanation":"The system message sets persistent behavior for the entire conversation. Placing grounding rules there means they apply to every response and cannot be accidentally overridden by user input phrasing."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Prompt Augmentation Vocabulary","cards":[{"front":"Augmented prompt","back":"A prompt that includes retrieved document chunks inserted as context alongside the user question. The foundation of the RAG generation step."},{"front":"Grounding instruction","back":"A directive in the prompt like \"Answer ONLY based on the provided context\" that constrains the LLM to use retrieved facts, not training memory."},{"front":"{context} placeholder","back":"A template variable replaced with the concatenated text of retrieved chunks before sending to the LLM."},{"front":"Citation prompt","back":"An instruction asking the model to reference specific passages: \"Cite the passage that supports each claim.\" Increases answer verifiability."},{"front":"Context delimiter","back":"Clear separators (--- or triple backticks) around context blocks so the LLM can distinguish retrieved content from instructions."}]}'></div>


</div>
