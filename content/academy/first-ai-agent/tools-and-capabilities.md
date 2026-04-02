---
title: "Tools and Capabilities"
course: "first-ai-agent"
order: 3
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">&larr; Course</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 3</div>
  <h1>Tools &amp; Capabilities</h1>
  <p class="subtitle">An agent without tools is just a chatbot. Each tool you add unlocks a new dimension of capability. Here is how tools work, what categories they fall into, and how to choose the right ones for your agent.</p>

  <div class="section">
    <h2>Three Categories of Tools</h2>
    <p>Every tool an agent can use falls into one of three categories. Understanding these categories helps you design agents that have the right capabilities for the job:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Knowledge Tools — Expand What the Agent Knows</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Give the agent access to information beyond its training data. Without these, the agent can only answer from what it learned during training — which is frozen in time.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(139,92,246,.08);font-size:.75rem;color:#8b5cf6">Web Search</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(139,92,246,.08);font-size:.75rem;color:#8b5cf6">Database Query</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(139,92,246,.08);font-size:.75rem;color:#8b5cf6">File Reader</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(139,92,246,.08);font-size:.75rem;color:#8b5cf6">Knowledge Base</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(139,92,246,.08);font-size:.75rem;color:#8b5cf6">API Data Fetch</span>
        </div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Action Tools — Let the Agent Change the World</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Let the agent take real actions — send emails, create records, trigger workflows. These are what separate an agent from a chatbot. Without action tools, the agent can only talk about doing things.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(52,211,153,.08);font-size:.75rem;color:#34d399">Email Sender</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(52,211,153,.08);font-size:.75rem;color:#34d399">API Caller</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(52,211,153,.08);font-size:.75rem;color:#34d399">File Writer</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(52,211,153,.08);font-size:.75rem;color:#34d399">Notification</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(52,211,153,.08);font-size:.75rem;color:#34d399">Database Insert</span>
        </div>
      </div>
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Autonomy Tools — Let the Agent Work Independently</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Enable the agent to operate without human prompting — triggers, schedulers, monitors. These turn a reactive agent into a proactive one that works while you sleep.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(251,146,60,.08);font-size:.75rem;color:#fb923c">Cron Scheduler</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(251,146,60,.08);font-size:.75rem;color:#fb923c">Webhook Listener</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(251,146,60,.08);font-size:.75rem;color:#fb923c">Health Monitor</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(251,146,60,.08);font-size:.75rem;color:#fb923c">Event Trigger</span>
          <span style="padding:.2rem .6rem;border-radius:4px;background:rgba(251,146,60,.08);font-size:.75rem;color:#fb923c">Queue Consumer</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>How Tools Are Defined (Real Code)</h2>
    <p>In the Claude API, each tool is defined as a JSON schema. The <code>description</code> field is what Claude reads to decide when to use the tool:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># A knowledge tool: web search</span><br>
      {<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"web_search"</span>,<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Search the web for current information. Use when the user asks about recent events, live data, or anything not in your training data."</span>,<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"input_schema"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"object"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"properties"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"query"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Search query"</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"required"</span>: [<span style="color:#fb923c">"query"</span>]<br>
      &nbsp;&nbsp;}<br>
      }<br>
      <br>
      <span style="color:#71717a"># An action tool: send email</span><br>
      {<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"send_email"</span>,<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Send an email. Use when the user asks to communicate with someone via email."</span>,<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"input_schema"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"object"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"properties"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"to"</span>: { <span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span> },<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"subject"</span>: { <span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span> },<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"body"</span>: { <span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span> }<br>
      &nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"required"</span>: [<span style="color:#fb923c">"to"</span>, <span style="color:#fb923c">"subject"</span>, <span style="color:#fb923c">"body"</span>]<br>
      &nbsp;&nbsp;}<br>
      }
    </div>
  </div>

  <div class="section">
    <h2>Tools Compound in Value</h2>
    <p>Each tool you add does not just add one capability — it multiplies them. Tools work together in ways that unlock tasks no single tool could handle:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#8b5cf6;font-weight:700;font-size:.75rem;min-width:130px">SEARCH + EMAIL</span>
        <span style="font-size:.85rem;color:#a1a1aa">Research a topic from the web, then email a summary. Neither tool alone can do both.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#34d399;font-weight:700;font-size:.75rem;min-width:130px">DATABASE + API</span>
        <span style="font-size:.85rem;color:#a1a1aa">Look up customer data in your database, then call Stripe to check payment status. Full account audit in seconds.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#fb923c;font-weight:700;font-size:.75rem;min-width:130px">MONITOR + NOTIFY</span>
        <span style="font-size:.85rem;color:#a1a1aa">Watch server health metrics, send Slack alert when CPU spikes. Proactive monitoring without human attention.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#f472b6;font-weight:700;font-size:.75rem;min-width:130px">FILE + CALC + DB</span>
        <span style="font-size:.85rem;color:#a1a1aa">Read a CSV file, calculate totals accurately, save results to database. End-to-end data pipeline.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Choosing the Right First Tool</h2>
    <p>The right first tool depends on your agent's job. Match the tool to the most critical capability gap:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.08)">
        <span style="font-size:.8rem;color:#a1a1aa"><strong style="color:#8b5cf6">Research agent</strong> → Web search first. It needs to find current information.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.08)">
        <span style="font-size:.8rem;color:#a1a1aa"><strong style="color:#34d399">Support agent</strong> → Database query first. It needs to look up customer accounts.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.08)">
        <span style="font-size:.8rem;color:#a1a1aa"><strong style="color:#fb923c">Coding agent</strong> → File read/write first. It needs to see and modify code.</span>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 1rem;border-radius:8px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.08)">
        <span style="font-size:.8rem;color:#a1a1aa"><strong style="color:#f472b6">Data agent</strong> → Calculator first. LLMs are unreliable at math — a calculator guarantees precision.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Why a Calculator Tool Exists</h2>
    <p>This surprises people: why does a powerful AI need a calculator? Because LLMs do not actually compute — they predict the most likely next token. For simple math, they are usually right. For precise calculations, they hallucinate:</p>

    <div style="display:flex;gap:1rem;margin:1rem 0;flex-wrap:wrap">
      <div style="flex:1;min-width:200px;padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">LLM alone</strong>
        <div style="font-size:.8rem;color:#a1a1aa;margin-top:.3rem">
          "What is 47,832 &times; 891?"<br>
          Answer: 42,618,312<br>
          <strong>Wrong.</strong> (Actual: 42,618,312... sometimes right, sometimes not. You cannot trust it.)
        </div>
      </div>
      <div style="flex:1;min-width:200px;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">LLM + Calculator tool</strong>
        <div style="font-size:.8rem;color:#a1a1aa;margin-top:.3rem">
          Agent calls <code>calculator(47832 * 891)</code><br>
          Returns: 42,618,312<br>
          <strong>Always correct.</strong> Deterministic, guaranteed.
        </div>
      </div>
    </div>

    <p>The agent's intelligence is in knowing <em>when</em> to delegate to a tool. The best agents are not the ones that try to do everything themselves — they are the ones that route each sub-task to the right tool.</p>
  </div>

  <div class="section">
    <h2>Interactive: Equip Your Agent</h2>
    <p>Drag tools onto the agent and watch its capabilities expand:</p>
  </div>

  <div class="workspace">
    <div class="toolbox">
      <h3>Toolbox</h3>
    </div>
    <div class="agent-zone" id="agent-zone">
      <div class="agent-avatar">&#x1F916;</div>
      <div class="agent-label">Your Agent</div>
      <div class="agent-status" id="agent-status">No tools equipped — just a chatbot</div>
    </div>
  </div>

  <div class="insight" id="insight">
    <h3>Key Insight</h3>
    <p id="insight-text">Right now your agent has zero tools. It can only generate text — exactly like a chatbot. Try dragging some tools over to see what changes.</p>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 3 of 10 &middot; Build Your First AI Agent</p>
</footer>

<div data-learn="QuizMC" data-props='{"title":"Tools and Agent Capabilities","questions":[{"q":"What capability does adding an API Caller tool unlock?","options":["The agent can do math more accurately","The agent can connect to any external service — payments, CRMs, social media, anything with an API","The agent can read local files","The agent can send emails"],"correct":1,"explanation":"API access is the ultimate force multiplier. With an API Caller, your agent can interact with virtually any external system — booking platforms, payment processors, data services."},{"q":"Why does a Calculator tool exist when LLMs can attempt math?","options":["It is faster than reasoning","LLMs produce probabilistic outputs — a calculator guarantees exact precision for every calculation","Calculators use less memory","Users prefer seeing a separate tool was used"],"correct":1,"explanation":"LLMs predict the most likely next token, which makes them unreliable at precise arithmetic. A calculator tool delegates math to a deterministic system, eliminating hallucinated numbers."},{"q":"What is the difference between a knowledge tool and an action tool?","options":["Knowledge tools are faster","Knowledge tools retrieve information, action tools change the world — send emails, write files, call APIs","Knowledge tools are free, action tools cost money","There is no difference"],"correct":1,"explanation":"Knowledge tools (search, database query, file read) bring information IN. Action tools (email, API call, file write) push changes OUT. Both are essential for a capable agent."},{"q":"An agent needs to: (1) look up a customer, (2) check their payment status, (3) send a refund notification. Which tool categories are needed?","options":["Knowledge only","Action only","Knowledge (database lookup, payment API) + Action (email sender)","Autonomy only"],"correct":2,"explanation":"Database lookup and payment API check are knowledge tools (retrieving data). Email sender is an action tool (taking action). This task needs both categories working together."},{"q":"What makes tools compound in value?","options":["Each tool gets faster when more tools are added","Tools can chain together — the output of one becomes the input for another, enabling tasks no single tool could handle","More tools make the model smarter","Tools share memory with each other"],"correct":1,"explanation":"A web search alone finds information. An email sender alone sends messages. Combined: the agent researches a topic AND emails a summary. The combination enables tasks neither tool could do alone."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Agent Tool Categories","cards":[{"front":"Knowledge tools","back":"Tools that expand what the agent knows — web search, database queries, file readers, knowledge base lookups. They bring information IN from external sources."},{"front":"Action tools","back":"Tools that let the agent change the world — email senders, API callers, file writers, notification systems. They push changes OUT to external systems."},{"front":"Autonomy tools","back":"Tools that enable independent operation — cron schedulers, webhook listeners, health monitors, event triggers. They let the agent work without human prompting."},{"front":"Why tools compound in value","back":"Each additional tool multiplies capabilities. Search + email = research and communicate. Database + API = full account audits. The combination enables tasks no single tool could handle."},{"front":"Why LLMs need calculator tools","back":"LLMs predict tokens probabilistically — they do not actually compute. For precise calculations, they can hallucinate. A calculator tool delegates math to a deterministic system that is always correct."},{"front":"Choosing the right first tool","back":"Match the first tool to the agent\u0027s primary job. Research agent → web search. Support agent → database. Coding agent → file read/write. Data agent → calculator."},{"front":"Tool definition in Claude API","back":"A JSON schema with name, description, and input_schema. The description tells Claude WHEN to use the tool. Include \u0027Use when...\u0027 for accurate tool selection."}]}'></div>
