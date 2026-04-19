# Real-World Servers

**Course:** MCP & AI Tool Integration
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[MCP Masterclass](/academy/mcp-masterclass/)
  Lesson 8 of 10


  # Real-World Servers

  Six production MCP server patterns that developers use every day. For each pattern, you will see the architecture, the tools it exposes, real code, and the security considerations that matter most.



    ## Server Gallery

    Six production MCP server patterns that developers use every day. Each pattern is covered in detail below.



    ## 1. Database Server

    Lets Claude query, analyze, and understand data in your database through natural language. The most common pattern — nearly every team has data they want Claude to explore.



        **Tools Exposed**
        `query` — Execute SELECT statements
`list_tables` — Show available tables
`describe_table` — Show columns and types
`insert` / `update` — Write data (if enabled)


        **Key Architecture**
        Maintains a **connection pool** — the DB connection stays open across calls, so Claude can run multiple queries without reconnection overhead. Typically 5-10 connections in the pool.




      Database Server PatternTypeScript
      import pg from "pg";

// Connection pool: stays open across tool calls
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,  // max concurrent connections
});

server.tool("query", {
  sql: z.string().describe("SQL SELECT statement to execute"),
}, async ({ sql }) => {
  // SECURITY: Only allow SELECT statements
  if (!sql.trim().toUpperCase().startsWith("SELECT")) {
    return { content: [{ type: "text", text: "Only SELECT queries are allowed." }], isError: true };
  }
  const result = await pool.query(sql);
  return { content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }] };
});



      **&#x1F6E1; Security:** Always use a **read-only database user** (see Lesson 9). The SQL prefix check above is a defense-in-depth layer, not the primary protection. A determined prompt injection can craft SQL that starts with SELECT but contains subqueries that modify data. The read-only user is what truly prevents damage.




    ## 2. GitHub Server

    Lets Claude manage repositories, pull requests, issues, and code reviews. The official GitHub MCP server is one of the most popular in the ecosystem.



        **Tools Exposed**
        `search_repositories`
`create_pull_request`
`list_issues` / `create_issue`
`get_file_contents`
`create_or_update_file`


        **Authentication**
        Uses **fine-grained personal access tokens (PATs)**. You choose exactly which repos and permissions to grant. Token goes in the `env` field of your config — never in code.




      claude_desktop_config.jsonJSON
      {
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}



      **&#x1F511; Best Practice:** Create a fine-grained PAT with **read-only access** to start. Only add write permissions (create PR, push commits) after you are comfortable with how Claude uses the tools. You can always upgrade permissions later.




    ## 3. Slack Server

    Lets Claude read channels, search messages, and post updates. Powerful for team coordination, standup summaries, and automated notifications.



        **Tools Exposed**
        `read_channel` — Get recent messages
`search_messages` — Full-text search
`send_message` — Post to a channel
`list_channels` — Discover channels


        **Authentication**
        Uses a **Slack Bot token** (`xoxb-...`) with scoped OAuth permissions. The bot must be **invited** to any channel it needs to read or post in.




      **&#x26A0; Caution:** Be very careful with `send_message`. A prompt injection that tricks Claude into posting to #general could be embarrassing or worse. Consider using the **human-in-the-loop pattern** (Lesson 9) for any send/post tools, or restricting the bot to a dedicated channel.




    ## 4. Browser Server

    Gives Claude full web automation — navigate pages, fill forms, click buttons, take screenshots, extract text. Powered by Puppeteer or Playwright running a headless browser.



        **Tools Exposed**
        `navigate` — Go to a URL
`screenshot` — Capture the page
`click` — Click an element
`type` — Enter text into a field
`get_text` — Extract page content


        **Key Architecture**
        Runs a **persistent headless browser**. The browser stays open across tool calls, maintaining cookies, session state, and page context. This means Claude can log in once and continue navigating.




      **&#x1F3AF; Use Cases:** Web scraping, automated testing, form filling, price monitoring, competitor analysis, accessibility auditing. Any workflow that currently requires you to manually navigate a website.




    ## 5. Memory Server

    Gives Claude persistent memory across conversations. Stores facts, relationships, and context in a knowledge graph that survives session boundaries.



        **Tools Exposed**
        `store_memory` — Save a fact or observation
`recall` — Retrieve memories by topic
`search_memory` — Semantic search
`create_relation` — Link two memories


        **Key Architecture**
        Stores memories as **entities with relations** — a knowledge graph. Some implementations use vector embeddings for semantic search, letting Claude find related memories even when the exact keywords do not match.




      Memory Server PatternTypeScript
      // Simplified memory server — stores to a JSON file
interface Memory { id: string; content: string; tags: string[]; created: string; }
let memories: Memory[] = loadFromDisk();

server.tool("store_memory", {
  content: z.string().describe("The fact, observation, or context to remember"),
  tags: z.array(z.string()).describe("Tags for categorization and retrieval"),
}, async ({ content, tags }) => {
  const memory = { id: crypto.randomUUID(), content, tags, created: new Date().toISOString() };
  memories.push(memory);
  saveToDisk(memories);
  return { content: [{ type: "text", text: `Stored memory: "${content.slice(0, 50)}..."` }] };
});

server.tool("recall", {
  query: z.string().describe("Topic or keyword to search for in stored memories"),
}, async ({ query }) => {
  const q = query.toLowerCase();
  const matches = memories.filter(m =>
    m.content.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))
  );
  if (matches.length === 0) return { content: [{ type: "text", text: "No memories found." }] };
  const text = matches.map(m => `[${m.tags.join(",")}] ${m.content}`).join("\n");
  return { content: [{ type: "text", text }] };
});




    ## 6. Custom API Server

    The most flexible pattern — wrap any REST or GraphQL API as MCP tools. Your internal tools, CRM, monitoring systems, or third-party services become Claude-accessible through a standard interface.



        **Tools Exposed**
        Whatever your API does. Common:
`get_customer` — Fetch CRM data
`create_ticket` — Open support tickets
`check_status` — Monitor service health
`search_inventory` — Query product data


        **Key Architecture**
        Your MCP server acts as an **authenticated proxy**. It holds the API credentials and translates MCP tool calls into REST/GraphQL requests. Claude never sees the raw API key.




      Custom API Server PatternTypeScript
      // Wrap a weather API as an MCP tool
const API_KEY = process.env.WEATHER_API_KEY;

server.tool("get_weather", {
  city: z.string().describe("City name, e.g. 'London' or 'New York'"),
}, async ({ city }) => {
  const url = `https://api.weather.com/v1/current?q=${encodeURIComponent(city)}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { content: [{ type: "text", text: `Weather API error for "${city}".` }], isError: true };
  }
  const data = await res.json();
  return {
    content: [{
      type: "text",
      text: `${city}: ${data.temp}°C, ${data.condition}. Humidity: ${data.humidity}%`,
    }],
  };
});



      **&#x1F4A1; Pattern:** Always `encodeURIComponent()` user inputs in URLs. Always check `res.ok` before parsing. Always return `isError: true` on failure. These three rules cover 90% of API wrapper security.




    ## Choosing the Right Pattern

    Most production servers are variations of these six patterns. Here is how to choose:



        Database
        You have structured data in SQL or NoSQL and want Claude to explore, analyze, or report on it.


        GitHub
        You want Claude to help with code reviews, issue triage, PR creation, or repository management.


        Slack
        You want Claude to summarize conversations, search history, or post team updates.


        Browser
        You need to automate web interactions — scraping, testing, form filling, monitoring.


        Memory
        You want Claude to remember context across conversations — user preferences, project decisions, facts.


        Custom API
        You have an internal service, CRM, or third-party API you want Claude to access through MCP.





### Quiz

**Q1: The GitHub MCP server uses which authentication mechanism for secure access?**
    A. Username and password stored in config
  ✓ B. Fine-grained personal access tokens
    C. SSH keys embedded in the server binary
    D. No authentication — GitHub API is public
  *The GitHub MCP server uses fine-grained personal access tokens (PATs). These allow scoped permissions so Claude only has access to the repositories and actions you explicitly grant.*

**Q2: Which MCP server pattern is most appropriate for connecting Claude to your company internal REST API?**
    A. Database Server
    B. Memory Server
  ✓ C. Custom API Server
    D. Browser Server
  *The Custom API Server pattern is designed exactly for this: wrap any REST or GraphQL API as MCP tools, controlling auth, rate limits, and data filtering. Your internal tools become AI-accessible through a standard interface.*

**Q3: Why does a database MCP server use a connection pool instead of connecting on each tool call?**
    A. Connection pools are required by the MCP protocol
  ✓ B. Pools eliminate reconnection overhead across multiple queries
    C. Pools provide better security than single connections
    D. Pools are only needed for NoSQL databases
  *Database connections are expensive to establish (TCP handshake, authentication, SSL negotiation). A connection pool keeps connections open and reuses them across tool calls, making queries fast and efficient.*

**Q4: What is the most important security measure for a Slack MCP server with send_message capability?**
    A. Using HTTPS for the Slack API
    B. Rate limiting message frequency
  ✓ C. Human-in-the-loop approval before sending
    D. Encrypting message content
  *The send_message tool can be triggered by prompt injection, potentially sending unintended messages to channels. Human-in-the-loop approval (confirmed parameter pattern from Lesson 9) ensures a human reviews every outgoing message before it is sent.*



### Production Server Patterns

**Card 1:**
Front: Database Server — key capability
Back: Maintains a persistent connection pool. Claude can query, insert, update, and analyze data through natural language without reconnecting on each call.

**Card 2:**
Front: GitHub Server — authentication
Back: Uses fine-grained personal access tokens (PATs) with scoped permissions. You control exactly which repos and actions Claude can access. Token in env field, never in code.

**Card 3:**
Front: Slack Server — key risk
Back: send_message can be triggered by prompt injection. Always use human-in-the-loop approval or restrict the bot to a dedicated channel. Be very careful with write access.

**Card 4:**
Front: Browser Server — underlying technology
Back: Puppeteer or Playwright running a headless Chromium browser. Persistent session means cookies, login state, and page context survive across tool calls.

**Card 5:**
Front: Memory Server — storage patterns
Back: Stores memories as entities with relations (knowledge graph). Advanced implementations use vector embeddings for semantic search. Simpler ones use JSON files with tag-based filtering.

**Card 6:**
Front: Custom API Server — primary advantage
Back: Acts as an authenticated proxy. Holds API credentials securely and translates MCP tool calls into REST/GraphQL requests. Claude never sees the raw API key.
