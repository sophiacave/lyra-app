---
title: "Memory Matters"
course: "first-ai-agent"
order: 6
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">&larr; Course</a>
</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 2 &middot; Lesson 6</div>
  <h1>Memory Matters</h1>
  <p class="subtitle">Without memory, your agent is a goldfish — it forgets everything between sessions. With memory, it learns from every interaction and gets better over time. Here is how to implement both types.</p>

  <div class="section">
    <h2>Two Types of Memory</h2>
    <p>Agents need two kinds of memory, just like humans. Short-term memory holds the current conversation. Long-term memory persists across sessions.</p>

    <div style="display:flex;gap:1rem;margin:1.5rem 0;flex-wrap:wrap">
      <div style="flex:1;min-width:220px;padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Short-Term Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">The conversation history. Each message and tool result from the current session. Lost when the session ends.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem">Implementation: the <code>messages</code> array you send to Claude on every turn.</div>
      </div>
      <div style="flex:1;min-width:220px;padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Long-Term Memory</strong>
        <p style="font-size:.85rem;color:#a1a1aa;margin:.4rem 0 0">Persistent storage — a database, vector store, or file. Survives across sessions, users, and restarts.</p>
        <div style="font-size:.78rem;color:#71717a;margin-top:.4rem">Implementation: Supabase, Pinecone, or a simple JSON file that the agent reads on boot.</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Short-Term Memory in Code</h2>
    <p>Short-term memory is simply the conversation history you pass to the API. Each turn adds to the array:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># Short-term memory = the messages array</span><br>
      <span style="color:#e2e8f0">messages</span> = []<br>
      <br>
      <span style="color:#71717a"># Turn 1: User asks a question</span><br>
      <span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">append</span>({<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"What is my account status?"</span>})<br>
      <br>
      <span style="color:#71717a"># Turn 1: Agent responds + uses a tool</span><br>
      <span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<span style="color:#e2e8f0">messages</span>=<span style="color:#e2e8f0">messages</span>, ...)<br>
      <span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">append</span>({<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"assistant"</span>, <span style="color:#fb923c">"content"</span>: <span style="color:#e2e8f0">response</span>.<span style="color:#e2e8f0">content</span>})<br>
      <br>
      <span style="color:#71717a"># Turn 2: User follows up — agent remembers Turn 1</span><br>
      <span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">append</span>({<span style="color:#fb923c">"role"</span>: <span style="color:#fb923c">"user"</span>, <span style="color:#fb923c">"content"</span>: <span style="color:#fb923c">"Can you upgrade it?"</span>})<br>
      <span style="color:#71717a"># Claude now sees the full history — it knows "it" = the account</span>
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);margin:1rem 0">
      <strong style="color:#fb923c;font-size:.85rem">The problem with short-term memory</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">When the messages array gets too long, it overflows the context window. When the session ends, the array is gone. The agent starts the next session knowing nothing about what happened before.</p>
    </div>
  </div>

  <div class="section">
    <h2>Long-Term Memory in Code</h2>
    <p>Long-term memory uses a database to persist knowledge across sessions. Here is a complete implementation using Supabase:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">from</span> <span style="color:#e2e8f0">supabase</span> <span style="color:#c084fc">import</span> <span style="color:#34d399">create_client</span><br>
      <br>
      <span style="color:#e2e8f0">supabase</span> = <span style="color:#34d399">create_client</span>(<span style="color:#e2e8f0">url</span>, <span style="color:#e2e8f0">key</span>)<br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">save_memory</span>(<span style="color:#e2e8f0">key</span>, <span style="color:#e2e8f0">value</span>, <span style="color:#e2e8f0">category</span>=<span style="color:#fb923c">"general"</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Save a fact to long-term memory"""</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">table</span>(<span style="color:#fb923c">"agent_memory"</span>).<span style="color:#34d399">upsert</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"key"</span>: <span style="color:#e2e8f0">key</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"value"</span>: <span style="color:#e2e8f0">value</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"category"</span>: <span style="color:#e2e8f0">category</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"updated_at"</span>: <span style="color:#fb923c">"now()"</span><br>
      &nbsp;&nbsp;}).<span style="color:#34d399">execute</span>()<br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">recall_memory</span>(<span style="color:#e2e8f0">key</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Retrieve a fact from long-term memory"""</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">result</span> = <span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">table</span>(<span style="color:#fb923c">"agent_memory"</span>).<span style="color:#34d399">select</span>(<span style="color:#fb923c">"value"</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">"key"</span>, <span style="color:#e2e8f0">key</span>).<span style="color:#34d399">execute</span>()<br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">data</span>[<span style="color:#fb923c">0</span>][<span style="color:#fb923c">"value"</span>] <span style="color:#c084fc">if</span> <span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">data</span> <span style="color:#c084fc">else</span> <span style="color:#c084fc">None</span><br>
      <br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">search_memory</span>(<span style="color:#e2e8f0">category</span>):<br>
      &nbsp;&nbsp;<span style="color:#fb923c">"""Search all memories in a category"""</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">result</span> = <span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">table</span>(<span style="color:#fb923c">"agent_memory"</span>).<span style="color:#34d399">select</span>(<span style="color:#fb923c">"*"</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">"category"</span>, <span style="color:#e2e8f0">category</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">order</span>(<span style="color:#fb923c">"updated_at"</span>, <span style="color:#e2e8f0">desc</span>=<span style="color:#c084fc">True</span>).<span style="color:#34d399">execute</span>()<br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> <span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">data</span>
    </div>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a"># Using memory in the agent loop</span><br>
      <span style="color:#c084fc">def</span> <span style="color:#34d399">agent_with_memory</span>(<span style="color:#e2e8f0">user_message</span>):<br>
      &nbsp;&nbsp;<span style="color:#71717a"># Boot: load relevant memories into context</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">past_interactions</span> = <span style="color:#34d399">search_memory</span>(<span style="color:#fb923c">"customer_issues"</span>)<br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">user_prefs</span> = <span style="color:#34d399">recall_memory</span>(<span style="color:#fb923c">"user.preferences"</span>)<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a"># Include memories in the system prompt</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">context</span> = <span style="color:#fb923c">f"""You have the following memories:</span><br>
      <span style="color:#fb923c">Past issues: {past_interactions}</span><br>
      <span style="color:#fb923c">User preferences: {user_prefs}"""</span><br>
      <br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">response</span> = <span style="color:#e2e8f0">client</span>.<span style="color:#e2e8f0">messages</span>.<span style="color:#34d399">create</span>(<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">system</span>=<span style="color:#e2e8f0">SYSTEM_PROMPT</span> + <span style="color:#fb923c">"\n"</span> + <span style="color:#e2e8f0">context</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;...<br>
      &nbsp;&nbsp;)<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a"># After resolving: save what was learned</span><br>
      &nbsp;&nbsp;<span style="color:#34d399">save_memory</span>(<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"resolution.login_failure"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#fb923c">"Cache clearing does not fix login issues. Root cause is usually expired OAuth token."</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">category</span>=<span style="color:#fb923c">"customer_issues"</span><br>
      &nbsp;&nbsp;)
    </div>
  </div>

  <div class="section">
    <h2>What to Store in Long-Term Memory</h2>
    <p>Not everything should be saved. Store information that will make the agent better at future tasks:</p>

    <div style="display:flex;flex-direction:column;gap:.4rem;margin:1rem 0">
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#34d399">&#x2713;</span> <strong>Resolutions</strong> — what fixed the problem and why
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#34d399">&#x2713;</span> <strong>User preferences</strong> — communication style, preferred tools, timezone
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#34d399">&#x2713;</span> <strong>Failure patterns</strong> — what did NOT work, so the agent does not retry dead ends
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#34d399">&#x2713;</span> <strong>Domain knowledge</strong> — facts learned from tools that the agent's training data does not have
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#ef4444">&#x2717;</span> <strong>Raw conversation logs</strong> — too noisy. Save the insight, not every word.
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:.85rem;color:#a1a1aa">
        <span style="color:#ef4444">&#x2717;</span> <strong>Temporary state</strong> — "user is on step 3 of signup." This belongs in short-term memory.
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Context Window Problem</h2>
    <p>As memory grows, you hit the context window limit — the maximum amount of text the model can process at once. Here is how production agents handle it:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Sliding window</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Keep the last N messages in full. Summarize or drop older messages. Claude Code uses this approach.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">RAG (Retrieval-Augmented Generation)</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Store memories as embeddings in a vector database. On each turn, retrieve only the most relevant memories. Scales to millions of memories.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Summarization</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Periodically summarize old memories into compressed form. "We resolved 14 login issues this month. Most were expired OAuth tokens." Compact but lossy.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Comparing Memory Configurations</h2>
    <p>Consider a customer support agent that handles the same type of ticket three times. Each time, the issue is slightly different — but the pattern is the same. Here is how each memory configuration performs:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">No Memory</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Starts fresh every single time. On ticket 3, it tries the same failed fix from ticket 1 because it has no record of what did not work. Performance stays flat.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(234,179,8,.04);border:1px solid rgba(234,179,8,.1)">
        <strong style="color:#eab308;font-size:.85rem">Short-Term Memory</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Remembers within a single session. If all three tickets come in the same session, it learns from ticket 1 when handling ticket 3. But after a restart, it forgets everything.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.1)">
        <strong style="color:#22c55e;font-size:.85rem">Long-Term Memory</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Remembers everything, across all sessions. By ticket 3, it has stored the resolution pattern and solves it immediately. Performance improves with every interaction.</span>
      </div>
    </div>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 6 of 10 &middot; Build Your First AI Agent</p>
</footer>

<div data-learn="QuizMC" data-props='{"title":"Memory Architecture Quiz","questions":[{"q":"What is the key limitation of short-term memory?","options":["It is too slow","It is lost when the session ends — the agent cannot learn across sessions","It cannot store user preferences","It uses too much storage"],"correct":1,"explanation":"Short-term memory lives within a single session. When the session ends, the context is gone. The agent must re-learn from scratch on every new session."},{"q":"In the code example, where does long-term memory get injected?","options":["In the messages array as a user message","In the system prompt as additional context","In the tools parameter","In the response"],"correct":1,"explanation":"Long-term memories are loaded from the database and appended to the system prompt. This gives Claude persistent context without cluttering the message history."},{"q":"What should you NOT store in long-term memory?","options":["Successful resolutions","Failure patterns that should not be retried","Raw conversation logs — too noisy, save the insight instead","User preferences"],"correct":2,"explanation":"Raw conversation logs are too noisy and consume too much storage and context window. Save the insight: what was learned, what worked, what failed. Not every word of the conversation."},{"q":"What is RAG and why does it matter for agent memory?","options":["A model architecture that replaces transformers","Retrieval-Augmented Generation — retrieve only relevant memories from a vector store, enabling memory to scale to millions of entries","A type of fine-tuning","A caching strategy"],"correct":1,"explanation":"RAG stores memories as embeddings and retrieves only the most relevant ones on each turn. This means your agent can have millions of memories without overflowing the context window."}]}'></div>

<div data-learn="FlashDeck" data-props='{"title":"Memory Architecture","cards":[{"front":"Short-term memory","back":"The conversation history (messages array) for the current session. Lost when the session ends. Implementation: the messages parameter in the Claude API."},{"front":"Long-term memory","back":"Persistent storage (database, vector store) that survives across sessions. The agent loads relevant memories on boot and saves new learnings after each task."},{"front":"Context window overflow","back":"When memory grows larger than the model can process. Solutions: sliding window (keep last N messages), RAG (retrieve relevant memories only), or summarization (compress old memories)."},{"front":"RAG (Retrieval-Augmented Generation)","back":"Store memories as vector embeddings. On each turn, retrieve only the most semantically relevant memories. Scales to millions without overflowing context."},{"front":"What to store in long-term memory","back":"Resolutions, user preferences, failure patterns, domain knowledge. NOT raw conversation logs or temporary state."},{"front":"The goldfish problem","back":"An agent without long-term memory starts every session from zero. It repeats the same mistakes, asks the same questions, and never improves. Memory is the cure."},{"front":"How to inject long-term memory","back":"Load relevant memories from the database on boot. Append them to the system prompt as context. The agent sees its own past knowledge alongside the current conversation."}]}'></div>
