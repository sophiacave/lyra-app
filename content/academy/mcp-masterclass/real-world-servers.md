---
title: "Real-World Servers"
course: "mcp-masterclass"
order: 8
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 3 &middot; Lesson 8</div>
  <h1>Real-World Servers</h1>
  <p class="subtitle">Six production MCP server patterns that developers use every day. For each pattern, you will see the architecture, the tools it exposes, real code, and the security considerations that matter most.</p>

  <div class="section">
    <h2>Server Gallery</h2>
    <p>Six production MCP server patterns that developers use every day. Each pattern is covered in detail below.</p>
  </div>

  <div class="section">
    <h2>1. Database Server</h2>
    <p>Lets Claude query, analyze, and understand data in your database through natural language. The most common pattern — nearly every team has data they want Claude to explore.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0"><code>query</code> — Execute SELECT statements<br><code>list_tables</code> — Show available tables<br><code>describe_table</code> — Show columns and types<br><code>insert</code> / <code>update</code> — Write data (if enabled)</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
        <strong style="color:#38bdf8;font-size:.85rem">Key Architecture</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Maintains a <strong>connection pool</strong> — the DB connection stays open across calls, so Claude can run multiple queries without reconnection overhead. Typically 5-10 connections in the pool.</p>
      </div>
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">Database Server Pattern</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="kw">import</span> pg <span class="kw">from</span> <span class="str">"pg"</span>;

<span class="cm">// Connection pool: stays open across tool calls</span>
<span class="kw">const</span> pool = <span class="kw">new</span> pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,  <span class="cm">// max concurrent connections</span>
});

server.tool(<span class="str">"query"</span>, {
  sql: z.string().describe(<span class="str">"SQL SELECT statement to execute"</span>),
}, <span class="kw">async</span> ({ sql }) => {
  <span class="cm">// SECURITY: Only allow SELECT statements</span>
  <span class="kw">if</span> (!sql.trim().toUpperCase().startsWith(<span class="str">"SELECT"</span>)) {
    <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: <span class="str">"Only SELECT queries are allowed."</span> }], isError: <span class="kw">true</span> };
  }
  <span class="kw">const</span> result = <span class="kw">await</span> pool.query(sql);
  <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: JSON.stringify(result.rows, <span class="kw">null</span>, 2) }] };
});</div>
    </div>

    <div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:10px;padding:1rem;margin-top:.75rem;font-size:.85rem;color:#a1a1aa">
      <strong style="color:#ef4444">&#x1F6E1; Security:</strong> Always use a <strong>read-only database user</strong> (see Lesson 9). The SQL prefix check above is a defense-in-depth layer, not the primary protection. A determined prompt injection can craft SQL that starts with SELECT but contains subqueries that modify data. The read-only user is what truly prevents damage.
    </div>
  </div>

  <div class="section">
    <h2>2. GitHub Server</h2>
    <p>Lets Claude manage repositories, pull requests, issues, and code reviews. The official GitHub MCP server is one of the most popular in the ecosystem.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0"><code>search_repositories</code><br><code>create_pull_request</code><br><code>list_issues</code> / <code>create_issue</code><br><code>get_file_contents</code><br><code>create_or_update_file</code></p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6;font-size:.85rem">Authentication</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Uses <strong>fine-grained personal access tokens (PATs)</strong>. You choose exactly which repos and permissions to grant. Token goes in the <code>env</code> field of your config — never in code.</p>
      </div>
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">claude_desktop_config.json</span><span class="lang">JSON</span></div>
      <div class="code-body">{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"github"</span>: {
      <span class="key">"command"</span>: <span class="str">"npx"</span>,
      <span class="key">"args"</span>: [<span class="str">"-y"</span>, <span class="str">"@modelcontextprotocol/server-github"</span>],
      <span class="key">"env"</span>: {
        <span class="key">"GITHUB_PERSONAL_ACCESS_TOKEN"</span>: <span class="str">"ghp_your_token_here"</span>
      }
    }
  }
}</div>
    </div>

    <div style="background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:10px;padding:1rem;margin-top:.75rem;font-size:.85rem;color:#a1a1aa">
      <strong style="color:#8b5cf6">&#x1F511; Best Practice:</strong> Create a fine-grained PAT with <strong>read-only access</strong> to start. Only add write permissions (create PR, push commits) after you are comfortable with how Claude uses the tools. You can always upgrade permissions later.
    </div>
  </div>

  <div class="section">
    <h2>3. Slack Server</h2>
    <p>Lets Claude read channels, search messages, and post updates. Powerful for team coordination, standup summaries, and automated notifications.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0"><code>read_channel</code> — Get recent messages<br><code>search_messages</code> — Full-text search<br><code>send_message</code> — Post to a channel<br><code>list_channels</code> — Discover channels</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c;font-size:.85rem">Authentication</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Uses a <strong>Slack Bot token</strong> (<code>xoxb-...</code>) with scoped OAuth permissions. The bot must be <strong>invited</strong> to any channel it needs to read or post in.</p>
      </div>
    </div>

    <div style="background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.12);border-radius:10px;padding:1rem;font-size:.85rem;color:#a1a1aa">
      <strong style="color:#fb923c">&#x26A0; Caution:</strong> Be very careful with <code>send_message</code>. A prompt injection that tricks Claude into posting to #general could be embarrassing or worse. Consider using the <strong>human-in-the-loop pattern</strong> (Lesson 9) for any send/post tools, or restricting the bot to a dedicated channel.
    </div>
  </div>

  <div class="section">
    <h2>4. Browser Server</h2>
    <p>Gives Claude full web automation — navigate pages, fill forms, click buttons, take screenshots, extract text. Powered by Puppeteer or Playwright running a headless browser.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0"><code>navigate</code> — Go to a URL<br><code>screenshot</code> — Capture the page<br><code>click</code> — Click an element<br><code>type</code> — Enter text into a field<br><code>get_text</code> — Extract page content</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1)">
        <strong style="color:#f472b6;font-size:.85rem">Key Architecture</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Runs a <strong>persistent headless browser</strong>. The browser stays open across tool calls, maintaining cookies, session state, and page context. This means Claude can log in once and continue navigating.</p>
      </div>
    </div>

    <div style="background:rgba(244,114,182,.06);border:1px solid rgba(244,114,182,.12);border-radius:10px;padding:1rem;font-size:.85rem;color:#a1a1aa">
      <strong style="color:#f472b6">&#x1F3AF; Use Cases:</strong> Web scraping, automated testing, form filling, price monitoring, competitor analysis, accessibility auditing. Any workflow that currently requires you to manually navigate a website.
    </div>
  </div>

  <div class="section">
    <h2>5. Memory Server</h2>
    <p>Gives Claude persistent memory across conversations. Stores facts, relationships, and context in a knowledge graph that survives session boundaries.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(167,139,250,.04);border:1px solid rgba(167,139,250,.1)">
        <strong style="color:#a78bfa;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0"><code>store_memory</code> — Save a fact or observation<br><code>recall</code> — Retrieve memories by topic<br><code>search_memory</code> — Semantic search<br><code>create_relation</code> — Link two memories</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(167,139,250,.04);border:1px solid rgba(167,139,250,.1)">
        <strong style="color:#a78bfa;font-size:.85rem">Key Architecture</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Stores memories as <strong>entities with relations</strong> — a knowledge graph. Some implementations use vector embeddings for semantic search, letting Claude find related memories even when the exact keywords do not match.</p>
      </div>
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">Memory Server Pattern</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="cm">// Simplified memory server — stores to a JSON file</span>
<span class="kw">interface</span> Memory { id: <span class="kw">string</span>; content: <span class="kw">string</span>; tags: <span class="kw">string</span>[]; created: <span class="kw">string</span>; }
<span class="kw">let</span> memories: Memory[] = loadFromDisk();

server.tool(<span class="str">"store_memory"</span>, {
  content: z.string().describe(<span class="str">"The fact, observation, or context to remember"</span>),
  tags: z.array(z.string()).describe(<span class="str">"Tags for categorization and retrieval"</span>),
}, <span class="kw">async</span> ({ content, tags }) => {
  <span class="kw">const</span> memory = { id: crypto.randomUUID(), content, tags, created: <span class="kw">new</span> Date().toISOString() };
  memories.push(memory);
  saveToDisk(memories);
  <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: <span class="str">`Stored memory: "${content.slice(0, 50)}..."`</span> }] };
});

server.tool(<span class="str">"recall"</span>, {
  query: z.string().describe(<span class="str">"Topic or keyword to search for in stored memories"</span>),
}, <span class="kw">async</span> ({ query }) => {
  <span class="kw">const</span> q = query.toLowerCase();
  <span class="kw">const</span> matches = memories.filter(m =>
    m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))
  );
  <span class="kw">if</span> (matches.length === 0) <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: <span class="str">"No memories found."</span> }] };
  <span class="kw">const</span> text = matches.map(m => <span class="str">`[${m.tags.join(",")}] ${m.content}`</span>).join(<span class="str">"\n"</span>);
  <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text }] };
});</div>
    </div>
  </div>

  <div class="section">
    <h2>6. Custom API Server</h2>
    <p>The most flexible pattern — wrap any REST or GraphQL API as MCP tools. Your internal tools, CRM, monitoring systems, or third-party services become Claude-accessible through a standard interface.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0">
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Tools Exposed</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Whatever your API does. Common:<br><code>get_customer</code> — Fetch CRM data<br><code>create_ticket</code> — Open support tickets<br><code>check_status</code> — Monitor service health<br><code>search_inventory</code> — Query product data</p>
      </div>
      <div style="padding:1rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399;font-size:.85rem">Key Architecture</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.4rem 0 0">Your MCP server acts as an <strong>authenticated proxy</strong>. It holds the API credentials and translates MCP tool calls into REST/GraphQL requests. Claude never sees the raw API key.</p>
      </div>
    </div>

    <div class="code-block">
      <div class="code-header"><span class="filename">Custom API Server Pattern</span><span class="lang">TypeScript</span></div>
      <div class="code-body"><span class="cm">// Wrap a weather API as an MCP tool</span>
<span class="kw">const</span> API_KEY = process.env.WEATHER_API_KEY;

server.tool(<span class="str">"get_weather"</span>, {
  city: z.string().describe(<span class="str">"City name, e.g. 'London' or 'New York'"</span>),
}, <span class="kw">async</span> ({ city }) => {
  <span class="kw">const</span> url = <span class="str">`https://api.weather.com/v1/current?q=${encodeURIComponent(city)}&key=${API_KEY}`</span>;
  <span class="kw">const</span> res = <span class="kw">await</span> fetch(url);
  <span class="kw">if</span> (!res.ok) {
    <span class="kw">return</span> { content: [{ type: <span class="str">"text"</span>, text: <span class="str">`Weather API error for "${city}".`</span> }], isError: <span class="kw">true</span> };
  }
  <span class="kw">const</span> data = <span class="kw">await</span> res.json();
  <span class="kw">return</span> {
    content: [{
      type: <span class="str">"text"</span>,
      text: <span class="str">`${city}: ${data.temp}°C, ${data.condition}. Humidity: ${data.humidity}%`</span>,
    }],
  };
});</div>
    </div>

    <div style="background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:10px;padding:1rem;margin-top:.75rem;font-size:.85rem;color:#a1a1aa">
      <strong style="color:#34d399">&#x1F4A1; Pattern:</strong> Always <code>encodeURIComponent()</code> user inputs in URLs. Always check <code>res.ok</code> before parsing. Always return <code>isError: true</code> on failure. These three rules cover 90% of API wrapper security.
    </div>
  </div>

  <div class="section">
    <h2>Choosing the Right Pattern</h2>
    <p>Most production servers are variations of these six patterns. Here is how to choose:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem">
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#38bdf8;font-size:.85rem;font-weight:700;min-width:100px">Database</span>
        <span style="font-size:.85rem;color:#a1a1aa">You have structured data in SQL or NoSQL and want Claude to explore, analyze, or report on it.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#8b5cf6;font-size:.85rem;font-weight:700;min-width:100px">GitHub</span>
        <span style="font-size:.85rem;color:#a1a1aa">You want Claude to help with code reviews, issue triage, PR creation, or repository management.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#fb923c;font-size:.85rem;font-weight:700;min-width:100px">Slack</span>
        <span style="font-size:.85rem;color:#a1a1aa">You want Claude to summarize conversations, search history, or post team updates.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#f472b6;font-size:.85rem;font-weight:700;min-width:100px">Browser</span>
        <span style="font-size:.85rem;color:#a1a1aa">You need to automate web interactions — scraping, testing, form filling, monitoring.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#a78bfa;font-size:.85rem;font-weight:700;min-width:100px">Memory</span>
        <span style="font-size:.85rem;color:#a1a1aa">You want Claude to remember context across conversations — user preferences, project decisions, facts.</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.75rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
        <span style="color:#34d399;font-size:.85rem;font-weight:700;min-width:100px">Custom API</span>
        <span style="font-size:.85rem;color:#a1a1aa">You have an internal service, CRM, or third-party API you want Claude to access through MCP.</span>
      </div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Real-World Servers Quiz","questions":[{"q":"The GitHub MCP server uses which authentication mechanism for secure access?","options":["Username and password stored in config","Fine-grained personal access tokens","SSH keys embedded in the server binary","No authentication — GitHub API is public"],"correct":1,"explanation":"The GitHub MCP server uses fine-grained personal access tokens (PATs). These allow scoped permissions so Claude only has access to the repositories and actions you explicitly grant."},{"q":"Which MCP server pattern is most appropriate for connecting Claude to your company internal REST API?","options":["Database Server","Memory Server","Custom API Server","Browser Server"],"correct":2,"explanation":"The Custom API Server pattern is designed exactly for this: wrap any REST or GraphQL API as MCP tools, controlling auth, rate limits, and data filtering. Your internal tools become AI-accessible through a standard interface."},{"q":"Why does a database MCP server use a connection pool instead of connecting on each tool call?","options":["Connection pools are required by the MCP protocol","Pools eliminate reconnection overhead across multiple queries","Pools provide better security than single connections","Pools are only needed for NoSQL databases"],"correct":1,"explanation":"Database connections are expensive to establish (TCP handshake, authentication, SSL negotiation). A connection pool keeps connections open and reuses them across tool calls, making queries fast and efficient."},{"q":"What is the most important security measure for a Slack MCP server with send_message capability?","options":["Using HTTPS for the Slack API","Rate limiting message frequency","Human-in-the-loop approval before sending","Encrypting message content"],"correct":2,"explanation":"The send_message tool can be triggered by prompt injection, potentially sending unintended messages to channels. Human-in-the-loop approval (confirmed parameter pattern from Lesson 9) ensures a human reviews every outgoing message before it is sent."}]}'></div>


  <div data-learn="FlashDeck" data-props='{"title":"Production Server Patterns","cards":[{"front":"Database Server — key capability","back":"Maintains a persistent connection pool. Claude can query, insert, update, and analyze data through natural language without reconnecting on each call."},{"front":"GitHub Server — authentication","back":"Uses fine-grained personal access tokens (PATs) with scoped permissions. You control exactly which repos and actions Claude can access. Token in env field, never in code."},{"front":"Slack Server — key risk","back":"send_message can be triggered by prompt injection. Always use human-in-the-loop approval or restrict the bot to a dedicated channel. Be very careful with write access."},{"front":"Browser Server — underlying technology","back":"Puppeteer or Playwright running a headless Chromium browser. Persistent session means cookies, login state, and page context survive across tool calls."},{"front":"Memory Server — storage patterns","back":"Stores memories as entities with relations (knowledge graph). Advanced implementations use vector embeddings for semantic search. Simpler ones use JSON files with tag-based filtering."},{"front":"Custom API Server — primary advantage","back":"Acts as an authenticated proxy. Holds API credentials securely and translates MCP tool calls into REST/GraphQL requests. Claude never sees the raw API key."}]}'></div>

</div>
