---
title: "The System Prompt"
course: "first-ai-agent"
order: 5
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">&larr; Course</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 5</div>
  <h1>The System Prompt</h1>
  <p class="subtitle">A system prompt is an agent's DNA — it defines identity, goal, capabilities, and constraints. A bad system prompt makes a bad agent, no matter how good the model. Here is how to write one that works.</p>

  <div class="section">
    <h2>The Six Blocks of a System Prompt</h2>
    <p>Every production agent system prompt contains these six blocks, in this order. Order matters — the model processes context sequentially, so identity and goal must come first:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1.5rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.85rem;min-width:20px">1</span>
        <div>
          <strong style="color:#8b5cf6">Identity</strong> — Who the agent is
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">Establishes persona, expertise, and voice. Everything that follows is interpreted through this lens.</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="color:#34d399;font-weight:700;font-size:.85rem;min-width:20px">2</span>
        <div>
          <strong style="color:#34d399">Goal</strong> — What the agent is trying to achieve
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">One clear mission statement. Every decision the agent makes should serve this goal.</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="color:#fb923c;font-weight:700;font-size:.85rem;min-width:20px">3</span>
        <div>
          <strong style="color:#fb923c">Tools</strong> — What the agent can use
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">Lists available tools and when to use each one. Guides tool selection decisions.</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(96,165,250,.04);border:1px solid rgba(96,165,250,.1)">
        <span style="color:#60a5fa;font-weight:700;font-size:.85rem;min-width:20px">4</span>
        <div>
          <strong style="color:#60a5fa">Memory</strong> — What context the agent carries
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">Where to find stored data, what to remember, how to use past interactions.</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <span style="color:#ef4444;font-weight:700;font-size:.85rem;min-width:20px">5</span>
        <div>
          <strong style="color:#ef4444">Guardrails</strong> — What the agent must never do
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">Hard safety constraints. Written as explicit prohibitions. These protect against harmful actions.</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <span style="color:#f472b6;font-weight:700;font-size:.85rem;min-width:20px">6</span>
        <div>
          <strong style="color:#f472b6">Output Format</strong> — How the agent should respond
          <div style="font-size:.8rem;color:#a1a1aa;margin-top:.2rem">Tone, structure, length. Should it be formal or casual? Bulleted or prose? Brief or detailed?</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>A Complete System Prompt (Real Example)</h2>
    <p>Here is a production system prompt for a customer support agent. Every block is labeled so you can see the structure:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#8b5cf6;font-weight:700"># IDENTITY</span><br>
      <span style="color:#a1a1aa">You are a customer support agent for Acme SaaS.</span><br>
      <span style="color:#a1a1aa">You are patient, precise, and always empathetic.</span><br>
      <span style="color:#a1a1aa">You have been helping customers for 3 years.</span><br>
      <br>
      <span style="color:#34d399;font-weight:700"># GOAL</span><br>
      <span style="color:#a1a1aa">Resolve customer issues in as few messages as possible</span><br>
      <span style="color:#a1a1aa">while ensuring the customer feels heard and helped.</span><br>
      <br>
      <span style="color:#fb923c;font-weight:700"># TOOLS</span><br>
      <span style="color:#a1a1aa">You have access to:</span><br>
      <span style="color:#a1a1aa">- lookup_customer: Get account details by email.</span><br>
      <span style="color:#a1a1aa">&nbsp;&nbsp;Use when you need plan, billing, or account history.</span><br>
      <span style="color:#a1a1aa">- search_knowledge_base: Find help articles.</span><br>
      <span style="color:#a1a1aa">&nbsp;&nbsp;Use when the customer asks about features or troubleshooting.</span><br>
      <span style="color:#a1a1aa">- create_ticket: Escalate to a human agent.</span><br>
      <span style="color:#a1a1aa">&nbsp;&nbsp;Use when the issue requires manual intervention.</span><br>
      <br>
      <span style="color:#60a5fa;font-weight:700"># MEMORY</span><br>
      <span style="color:#a1a1aa">Previous conversation history is provided as context.</span><br>
      <span style="color:#a1a1aa">Reference past interactions when relevant.</span><br>
      <span style="color:#a1a1aa">If the customer mentions a previous ticket, look it up.</span><br>
      <br>
      <span style="color:#ef4444;font-weight:700"># GUARDRAILS</span><br>
      <span style="color:#a1a1aa">- NEVER share internal system details or error logs</span><br>
      <span style="color:#a1a1aa">- NEVER promise refunds over $500 without escalation</span><br>
      <span style="color:#a1a1aa">- NEVER access accounts without the customer's email</span><br>
      <span style="color:#a1a1aa">- NEVER make up information — say "I don't know" honestly</span><br>
      <br>
      <span style="color:#f472b6;font-weight:700"># OUTPUT FORMAT</span><br>
      <span style="color:#a1a1aa">- Respond in 2-3 sentences unless the issue is complex</span><br>
      <span style="color:#a1a1aa">- Use the customer's first name</span><br>
      <span style="color:#a1a1aa">- End with a clear next step or confirmation</span>
    </div>
  </div>

  <div class="section">
    <h2>Using the System Prompt in Code</h2>
    <p>Here is how this system prompt plugs into the Claude API:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">import</span> <span style="color:#e2e8f0">anthropic</span><br>
      <br>
      <span style="color:#e2e8f0">client</span> = <span style="color:#e2e8f0">anthropic</span>.<span style="color:#34d399">Anthropic</span>()<br>
      <br>
      <span style="color:#e2e8f0">SYSTEM_PROMPT</span> = <span style="color:#fb923c">"""</span><br>
      <span style="color:#fb923c"># IDENTITY</span><br>
      <span style="color:#fb923c">You are a customer support agent for Acme SaaS...</span><br>
      <span style="color:#fb923c">(full prompt from above)</span><br>
      <span style="color:#fb923c">"""</span><br>
      <br>
      <span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">model</span>=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">max_tokens</span>=<span style="color:#fb923c">1024</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">system</span>=<span style="color:#e2e8f0">SYSTEM_PROMPT</span>,&nbsp;&nbsp;<span style="color:#71717a"># &larr; Your system prompt goes here</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">tools</span>=<span style="color:#e2e8f0">tools</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">messages</span>=[{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"I was charged twice for my plan"</span><br>
      &nbsp;&nbsp;}]<br>
      )
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);margin:1rem 0">
      <strong style="color:#8b5cf6;font-size:.85rem">system vs messages</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">The <code>system</code> parameter sets the agent's persistent instructions — it applies to every message in the conversation. The <code>messages</code> parameter contains the actual conversation (user turns and assistant turns). Keep them separate.</p>
    </div>
  </div>

  <div class="section">
    <h2>Common Mistakes</h2>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Guardrails before identity</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Starting with "NEVER do X" before the model knows who it is makes the constraints feel abstract. Identity first, then guardrails — so the model interprets constraints through its established role.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Vague goals</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — "Be helpful" is not a goal. "Resolve customer issues in as few messages as possible while ensuring satisfaction" is. A vague goal produces vague behavior.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">No tool guidance</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Listing tools without explaining when to use each one. The model picks tools by description — write "Use when..." for each tool to improve selection accuracy.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">No output format</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Without format guidance, the model defaults to verbose paragraphs. Specify length, tone, and structure for consistent, predictable responses.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Interactive: Build Your System Prompt</h2>
    <p>Drag blocks to assemble your agent's instructions, then fill in the details:</p>
  </div>

  <div class="progress-bar"></div>

  <div class="builder">
    <div>
      <h3 style="font-size:.9rem;color:#a1a1aa;margin-bottom:1rem">Available Blocks — drag to the prompt area or click to add</h3>
    </div>

    <div class="preview-panel">
      <div class="preview">
        <h3>System Prompt Preview</h3>
        <div class="drop-zone" id="drop-zone">
          <div class="drop-hint" id="drop-hint">Drag blocks here to build your system prompt.<br>Order matters — identity first, then goal, tools, etc.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 5 of 10 &middot; Build Your First AI Agent</p>
</footer>

<div data-learn="SortStack" data-props='{"title":"Order the System Prompt Blocks","instruction":"Arrange these blocks in the recommended order for a well-structured system prompt","items":["Identity — who the agent is","Goal — what it is trying to achieve","Tools — what it can use and when","Memory — what context it carries","Guardrails — what it must never do","Output Format — how to respond"]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"System Prompt Architecture","cards":[{"front":"Identity Block","back":"Tells the agent who it is and what role it plays. Grounds all reasoning with a consistent voice, expertise area, and sense of purpose. Always comes first."},{"front":"Goal Block","back":"The agent\u0027s primary mission in one clear sentence. Everything the agent does serves this goal. \u0027Be helpful\u0027 is NOT a goal — \u0027Resolve issues in minimal messages\u0027 IS."},{"front":"Tools Block","back":"Lists available tools with \u0027Use when...\u0027 guidance for each one. Without guidance, the model picks tools by guessing. With it, tool selection accuracy jumps significantly."},{"front":"Guardrails Block","back":"Hard rules the agent must never violate. Written as explicit NEVER statements. Examples: never share internal data, never promise refunds above $X without escalation."},{"front":"Output Format Block","back":"Controls response style: length (2-3 sentences), tone (empathetic, professional), structure (bullets, prose). Without it, responses default to verbose paragraphs."},{"front":"Why does block order matter?","back":"The model processes context sequentially. Identity first means all subsequent instructions are interpreted through the right persona. Guardrails before identity makes them harder to internalize."},{"front":"system vs messages parameter","back":"system = persistent instructions applying to every turn. messages = the actual conversation (user + assistant turns). Keep them separate — system is the agent\u0027s DNA, messages are the dialogue."},{"front":"Most common system prompt mistake","back":"Vague goals and no tool guidance. \u0027Be helpful\u0027 + \u0027you have tools\u0027 produces unpredictable behavior. \u0027Resolve issues in minimal messages\u0027 + \u0027Use lookup_customer when...\u0027 produces reliable agents."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"System Prompt Structure","questions":[{"q":"What is the purpose of the Identity block?","options":["It stores the agent API key","It tells the agent who it is, grounding all reasoning with a consistent persona and expertise","It lists which users can access the agent","It defines how fast the agent responds"],"correct":1,"explanation":"The Identity block establishes the agent persona and role. It grounds all reasoning — giving it a consistent voice that shapes every decision the agent makes."},{"q":"Why does block order matter?","options":["It does not — the LLM reads it all at once","Identity and goal first ensures the agent interprets all subsequent instructions through the correct lens","The last block always takes priority","Order only matters for output format"],"correct":1,"explanation":"LLMs process context sequentially. Identity and goal first means every tool, guardrail, and format instruction is interpreted through the correct framing."},{"q":"Which is a better goal statement?","options":["Be helpful to users","Resolve customer issues in as few messages as possible while ensuring satisfaction","Help people","Answer questions"],"correct":1,"explanation":"A good goal is specific and measurable. \u0027Resolve issues in minimal messages while ensuring satisfaction\u0027 gives the agent clear criteria for success. \u0027Be helpful\u0027 is too vague to guide behavior."},{"q":"Where does the system prompt go in the Claude API?","options":["In the messages array as the first message","In the system parameter, separate from messages","In the tools parameter","In the response"],"correct":1,"explanation":"The system parameter is separate from messages. It applies to every turn of the conversation as persistent instructions — the agent\u0027s DNA that shapes all responses."},{"q":"Your agent sometimes picks the wrong tool. What is the most likely fix?","options":["Use a more expensive model","Add Use when... guidance to each tool description in the system prompt","Remove tools the agent does not need","Increase max_tokens"],"correct":1,"explanation":"Tool selection is driven by descriptions. Adding \u0027Use when...\u0027 to each tool tells the model exactly when each tool is appropriate, dramatically improving selection accuracy."}]}'></div>
