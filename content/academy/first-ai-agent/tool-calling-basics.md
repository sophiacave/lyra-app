---
title: "Tool Calling Basics"
course: "first-ai-agent"
order: 7
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">&larr; Course</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 7</div>
  <h1>Tool Calling Basics</h1>
  <p class="subtitle">Tool calling is how agents take action in the real world. You define tools as JSON schemas, Claude decides when to use them, and your code executes them. Here is the complete pattern with production code.</p>

  <div class="section">
    <h2>How Tool Calling Works</h2>
    <p>Tool calling is a three-step conversation between your code and Claude:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1.5rem 0">
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <span style="font-size:1.2rem;min-width:30px;text-align:center">1</span>
        <div>
          <strong style="color:#8b5cf6;font-size:.85rem">You define tools</strong>
          <p style="font-size:.8rem;color:#a1a1aa;margin:.2rem 0 0">Tell Claude what tools exist using JSON schemas — name, description, and parameters.</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <span style="font-size:1.2rem;min-width:30px;text-align:center">2</span>
        <div>
          <strong style="color:#34d399;font-size:.85rem">Claude decides to use one</strong>
          <p style="font-size:.8rem;color:#a1a1aa;margin:.2rem 0 0">Based on the user's request, Claude returns a <code>tool_use</code> block with the tool name and filled-in parameters.</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <span style="font-size:1.2rem;min-width:30px;text-align:center">3</span>
        <div>
          <strong style="color:#fb923c;font-size:.85rem">Your code executes it</strong>
          <p style="font-size:.8rem;color:#a1a1aa;margin:.2rem 0 0">You run the actual function, then send the result back to Claude as a <code>tool_result</code> message.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Step 1: Define Your Tools</h2>
    <p>A tool definition is a JSON schema that tells Claude what the tool does and what parameters it accepts. The better your description, the better Claude's tool selection:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># Define tools for a customer support agent</span><br>
      <span style="color:#e2e8f0">tools</span> = [<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"search_knowledge_base"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Search the company knowledge base for help articles. Use when the customer asks a question about how to use the product, troubleshoot an issue, or understand a feature."</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input_schema"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"object"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"properties"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"query"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Search query describing the customer's issue"</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"required"</span>: [<span style="color:#fb923c">"query"</span>]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;},<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"lookup_customer"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Look up a customer's account details by email. Use when you need to check their plan, billing status, or account history."</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input_schema"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"object"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"properties"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"email"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Customer email address"</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"required"</span>: [<span style="color:#fb923c">"email"</span>]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;},<br>
      &nbsp;&nbsp;{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"name"</span>: <span style="color:#fb923c">"create_ticket"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: <span style="color:#fb923c">"Create a support ticket for issues that need human follow-up. Use when the issue cannot be resolved automatically."</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"input_schema"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"object"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"properties"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"subject"</span>: { <span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span> },<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"priority"</span>: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"enum"</span>: [<span style="color:#fb923c">"low"</span>, <span style="color:#fb923c">"medium"</span>, <span style="color:#fb923c">"high"</span>, <span style="color:#fb923c">"urgent"</span>]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"description"</span>: { <span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"string"</span> }<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"required"</span>: [<span style="color:#fb923c">"subject"</span>, <span style="color:#fb923c">"priority"</span>, <span style="color:#fb923c">"description"</span>]<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;}<br>
      ]
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);margin:1rem 0">
      <strong style="color:#8b5cf6;font-size:.85rem">The description is the most important field</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Claude uses the tool description to decide when to call it. Vague descriptions like "search stuff" lead to wrong tool selection. Be specific about what the tool does and <em>when</em> to use it.</p>
    </div>
  </div>

  <div class="section">
    <h2>Step 2: Claude Decides to Call a Tool</h2>
    <p>When you send a message with tools defined, Claude reads the user's request and decides if any tool would help. If so, it returns a <code>tool_use</code> content block:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># Send a message with tools available</span><br>
      <span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">model</span>=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">max_tokens</span>=<span style="color:#fb923c">1024</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">tools</span>=<span style="color:#e2e8f0">tools</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">messages</span>=[{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"I was charged twice for my Pro plan. My email is jane@acme.co"</span><br>
      &nbsp;&nbsp;}]<br>
      )<br>
      <br>
      <span style="color:#71717a"># Claude responds with a tool_use block:</span><br>
      <span style="color:#71717a"># response.stop_reason = "tool_use"</span><br>
      <span style="color:#71717a"># response.content = [</span><br>
      <span style="color:#71717a">#   TextBlock("Let me look up your account..."),</span><br>
      <span style="color:#71717a">#   ToolUseBlock(</span><br>
      <span style="color:#71717a">#     id="toolu_abc123",</span><br>
      <span style="color:#71717a">#     name="lookup_customer",</span><br>
      <span style="color:#71717a">#     input={"email": "jane@acme.co"}</span><br>
      <span style="color:#71717a">#   )</span><br>
      <span style="color:#71717a"># ]</span>
    </div>

    <p>Claude extracted the email from the user's message and decided <code>lookup_customer</code> is the right tool. It filled in the parameters automatically.</p>
  </div>

  <div class="section">
    <h2>Step 3: Execute and Return Results</h2>
    <p>Your code runs the actual tool, then sends the result back to Claude. Claude uses the result to continue reasoning:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># Execute the tool call</span><br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">execute_tool</span>(<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">params</span>):<br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> <span style="color:#e2e8f0">name</span> == <span style="color:#fb923c">"lookup_customer"</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">db</span>.<span style="color:#34d399">query</span>(<span style="color:#fb923c">"SELECT * FROM customers WHERE email = %s"</span>, <span style="color:#e2e8f0">params</span>[<span style="color:#fb923c">"email"</span>])<br>
      &nbsp;&nbsp;<span style="color:#c084fc">elif</span> <span style="color:#e2e8f0">name</span> == <span style="color:#fb923c">"search_knowledge_base"</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">kb</span>.<span style="color:#34d399">search</span>(<span style="color:#e2e8f0">params</span>[<span style="color:#fb923c">"query"</span>])<br>
      &nbsp;&nbsp;<span style="color:#c084fc">elif</span> <span style="color:#e2e8f0">name</span> == <span style="color:#fb923c">"create_ticket"</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">tickets</span>.<span style="color:#34d399">create</span>(**<span style="color:#e2e8f0">params</span>)<br>
      <br>
      <span style="color:#71717a"># Get the tool use block from the response</span><br>
      <span style="color:#e2e8f0">tool_block</span> = <span style="color:#34d399">next</span>(<span style="color:#e2e8f0">b</span> <span style="color:#c084fc">for</span> <span style="color:#e2e8f0">b</span> <span style="color:#c084fc">in</span> <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span> <span style="color:#c084fc">if</span> <span style="color:#e2e8f0">b</span>.<span style="color:#e2e8f0">type</span> == <span style="color:#fb923c">"tool_use"</span>)<br>
      <span style="color:#e2e8f0">result</span> = <span style="color:#34d399">execute_tool</span>(<span style="color:#e2e8f0">tool_block</span>.<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">tool_block</span>.<span style="color:#e2e8f0">input</span>)<br>
      <br>
      <span style="color:#71717a"># Send the result back to Claude</span><br>
      <span style="color:#e2e8f0">follow_up</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">model</span>=<span style="color:#fb923c">"claude-sonnet-4-6"</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">max_tokens</span>=<span style="color:#fb923c">1024</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">tools</span>=<span style="color:#e2e8f0">tools</span>,<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">messages</span>=[<br>
      &nbsp;&nbsp;&nbsp;&nbsp;{<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"I was charged twice..."</span>},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;{<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"assistant"</span>, <span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span>},<br>
      &nbsp;&nbsp;&nbsp;&nbsp;{<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: [{<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"type"</span>: <span style="color:#fb923c">"tool_result"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"tool_use_id"</span>: <span style="color:#e2e8f0">tool_block</span>.<span style="color:#e2e8f0">id</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">json</span>.<span style="color:#34d399">dumps</span>(<span style="color:#e2e8f0">result</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}]}<br>
      &nbsp;&nbsp;]<br>
      )<br>
      <br>
      <span style="color:#71717a"># Claude now has the customer data and can respond intelligently</span><br>
      <span style="color:#34d399">print</span>(<span style="color:#e2e8f0">follow_up</span>.<span style="color:#e2e8f0">content</span>[<span style="color:#fb923c">0</span>].<span style="color:#e2e8f0">text</span>)<br>
      <span style="color:#71717a"># "I can see your account, Jane. You're on the Pro plan at $49/mo.</span><br>
      <span style="color:#71717a">#  I see two charges on March 15. Let me create a ticket for the</span><br>
      <span style="color:#71717a">#  billing team to refund the duplicate charge."</span>
    </div>
  </div>

  <div class="section">
    <h2>Chained Tool Calls</h2>
    <p>Powerful agents chain multiple tool calls in sequence. Claude uses the result of one call to decide the next:</p>

    <div style="display:flex;align-items:center;gap:.5rem;justify-content:center;margin:1.5rem 0;flex-wrap:wrap">
      <div style="padding:.5rem .75rem;border-radius:8px;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.15);text-align:center;font-size:.75rem">
        <strong style="color:#8b5cf6">lookup_customer</strong><br>
        <span style="color:#a1a1aa">Get account data</span>
      </div>
      <div style="color:#52525b">&rarr;</div>
      <div style="padding:.5rem .75rem;border-radius:8px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);text-align:center;font-size:.75rem">
        <strong style="color:#34d399">search_knowledge_base</strong><br>
        <span style="color:#a1a1aa">Find refund policy</span>
      </div>
      <div style="color:#52525b">&rarr;</div>
      <div style="padding:.5rem .75rem;border-radius:8px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.15);text-align:center;font-size:.75rem">
        <strong style="color:#fb923c">create_ticket</strong><br>
        <span style="color:#a1a1aa">Escalate to billing</span>
      </div>
    </div>

    <p>Claude autonomously decided to: (1) look up the customer, (2) check the refund policy, (3) create a ticket with all the context. Three tool calls, zero human intervention. This is the agent pattern.</p>
  </div>

  <div class="section">
    <h2>Writing Good Tool Descriptions</h2>
    <p>Tool selection is only as good as your descriptions. Here is the difference between a bad and good description:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">Bad:</strong> <code style="font-size:.8rem">"Search the database"</code>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Too vague. Claude does not know <em>what</em> database, <em>when</em> to use it, or <em>what data</em> it returns.</p>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Good:</strong> <code style="font-size:.8rem">"Search the company knowledge base for help articles. Use when the customer asks a question about how to use the product, troubleshoot an issue, or understand a feature."</code>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Specific about what it does, what data it returns, and <em>when</em> Claude should choose it.</p>
      </div>
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);margin:1rem 0">
      <strong style="color:#fb923c;font-size:.85rem">Pro tip: Include "Use when..." in every tool description</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">This phrase directly tells Claude the decision criteria for selecting this tool. It is the single most impactful improvement you can make to tool selection accuracy.</p>
    </div>
  </div>

  <div class="section">
    <h2>When Tool Calls Fail</h2>
    <p>Tools fail. APIs timeout. Databases go down. Your code needs to handle every failure:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">def</span> <span style="color:#34d399">execute_tool_safe</span>(<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">params</span>):<br>
      &nbsp;&nbsp;<span style="color:#c084fc">try</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">result</span> = <span style="color:#34d399">execute_tool</span>(<span style="color:#e2e8f0">name</span>, <span style="color:#e2e8f0">params</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">json</span>.<span style="color:#34d399">dumps</span>(<span style="color:#e2e8f0">result</span>)<br>
      &nbsp;&nbsp;<span style="color:#c084fc">except</span> <span style="color:#e2e8f0">Exception</span> <span style="color:#c084fc">as</span> <span style="color:#e2e8f0">e</span>:<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#71717a"># Return error AS the tool result — Claude can adapt</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">json</span>.<span style="color:#34d399">dumps</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"error"</span>: <span style="color:#c084fc">str</span>(<span style="color:#e2e8f0">e</span>),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"tool"</span>: <span style="color:#e2e8f0">name</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"suggestion"</span>: <span style="color:#fb923c">"Try an alternative approach"</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;})
    </div>

    <p>When you return an error as a tool result, Claude sees the failure and can adapt — trying a different tool, asking the user for more information, or gracefully explaining the limitation.</p>
  </div>

  <div class="section">
    <h2>Interactive: Watch Tool Calling in Action</h2>
    <p>Pick a question to see the agent decide which tool to use, make the call, and use the result:</p>
  </div>

  <div class="question-picker">
    <h3>Pick a question for the agent to answer:</h3>
    <div class="q-grid" id="q-grid"></div>
    <div class="dots" id="dots"></div>
  </div>

  <div class="flow-viz" id="flow-viz"></div>
</div>

<footer class="progress-footer">
  <p>Lesson 7 of 10 &middot; Build Your First AI Agent</p>
</footer>

<div data-learn="FlashDeck" data-props='{"title":"Tool Calling Concepts","cards":[{"front":"What is a tool definition?","back":"A JSON schema that tells Claude what a tool does (description), what parameters it accepts (input_schema), and what they mean. Claude uses this to decide when and how to call the tool."},{"front":"What is a tool_use block?","back":"Claude\u0027s response when it wants to call a tool. Contains the tool name, a unique ID, and the filled-in parameters. Your code executes the tool and returns the result."},{"front":"What is a tool_result message?","back":"Your response after executing a tool. Contains the tool_use_id (linking back to the request) and the result data. Claude uses this to continue reasoning."},{"front":"Chained tool calls","back":"When an agent uses the output of one tool call as context for the next. Example: look up customer → find their plan → create a refund ticket. Each call builds on the previous result."},{"front":"Why does the description field matter most?","back":"Claude reads tool descriptions to decide which tool to use. Vague descriptions cause wrong tool selection. Include WHAT the tool does and WHEN to use it for accurate selection."},{"front":"How to handle tool failures","back":"Return the error as the tool_result content. Claude sees the failure and can adapt — trying a different tool, asking for clarification, or explaining the limitation gracefully."},{"front":"input_schema required vs optional","back":"Required parameters must always be provided by Claude. Optional parameters have defaults. Use required for data Claude MUST extract from the user message."},{"front":"enum in tool parameters","back":"Constrains a parameter to specific valid values (e.g., priority: low/medium/high/urgent). Prevents Claude from inventing invalid values and makes your tool handling predictable."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Tool Calling Quiz","questions":[{"q":"What is the purpose of the tool description field?","options":["It is displayed to the user as help text","Claude reads it to decide WHEN to use this tool vs other available tools","It controls the output format","It defines the API endpoint URL"],"correct":1,"explanation":"The description is Claude\u0027s decision criteria. When multiple tools are available, Claude reads each description to determine which tool best matches the current request. Better descriptions = better tool selection."},{"q":"A user says: Check if jane@acme.co has an active subscription. Which tool should Claude call?","options":["search_knowledge_base — to find subscription docs","lookup_customer — to get account details including subscription status","create_ticket — to ask someone to check","No tool needed — Claude can answer from training data"],"correct":1,"explanation":"The user is asking about a specific customer\u0027s data. lookup_customer retrieves account details (including plan and billing status) by email. The knowledge base has general docs, not customer-specific data."},{"q":"What happens when you return an error as a tool_result?","options":["The entire program crashes","Claude sees the error and can adapt — trying a different tool or explaining the issue","The error is hidden from Claude","Claude retries the same tool automatically"],"correct":1,"explanation":"Returning the error as content lets Claude see what went wrong. Claude can then adapt — trying a different approach, asking the user for alternative information, or explaining why it cannot complete the request."},{"q":"An agent calls lookup_customer, then search_knowledge_base, then create_ticket. What is this pattern called?","options":["Parallel tool calling","Chained tool calling — each call builds on previous results","Recursive tool calling","Batch tool calling"],"correct":1,"explanation":"Chained tool calling means each subsequent tool call uses context from previous results. The agent looked up the customer, found the relevant policy, then created a ticket with all the context. This is autonomous multi-step execution."},{"q":"Which tool description is better for accurate tool selection?","options":["Search the database","Search the company knowledge base for help articles. Use when the customer asks about product features or troubleshooting.","DB search tool","Query handler"],"correct":1,"explanation":"The second description tells Claude exactly what data the tool returns (help articles) and when to use it (product questions, troubleshooting). Claude can distinguish this from a customer lookup or ticket creation tool based on these specifics."}]}'></div>
