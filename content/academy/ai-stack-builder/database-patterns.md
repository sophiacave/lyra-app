---
title: "Database Patterns"
course: "ai-stack-builder"
order: 7
type: "lesson"
free: false
---<div class="container">
<div class="nav">

<span class="current">Lesson 7 of 10</span>

</div>

<div class="lesson-badge">MODULE 2 &middot; 260 XP</div>
<h1>Database Patterns</h1>
<p class="intro">Your AI needs a brain — a structured place to store memory, context, and agent state. Let's design that schema interactively and see the relationships in real-time.</p>

<h2>Design Your Brain Schema</h2>
<p>Click each table tab to edit its columns. Add new columns, set types, mark primary and foreign keys. The ER diagram below updates as you build.</p>
<p style="font-size:.85rem;color:#888"><strong>Why 3 tables instead of 1?</strong> Each table serves a different purpose: <code style="color:#f59e0b">brain_context</code> holds the agent's current state (like a whiteboard), <code style="color:#f59e0b">agent_memory</code> stores past interactions (like a journal), and <code style="color:#f59e0b">consciousness_stream</code> logs every action (like security footage). Separating them lets you query and optimize each independently.</p>
<p style="font-size:.85rem;color:#888">These tables are pre-populated as a starting point. Try modifying them — rename columns, change types, add new ones. The generated SQL updates live so you can see the impact of your changes.</p>

<div class="table-tabs" id="tableTabs">
<div class="table-tab active" onclick="switchTable(0)">brain_context</div>
<div class="table-tab" onclick="switchTable(1)">agent_memory</div>
<div class="table-tab" onclick="switchTable(2)">consciousness_stream</div>
</div>

<div class="table-editor" id="tableEditor"></div>

<h2>Entity Relationship Diagram</h2>
<p>This updates live as you modify the tables above.</p>
<div class="er-diagram" id="erCanvas">
</div>

<button class="gen-btn" onclick="generateSQL()">Generate SQL &rarr;</button>

<div class="panel" id="sqlPanel" style="display:none">
<div class="label">Generated SQL</div>
<pre class="code-block" id="sqlOutput"></pre>
</div>

<div class="panel">
<div class="label">Key Patterns</div>
<h3 style="margin-top:0">Pattern 1: Key-Value Brain</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Instead of creating a new column for every piece of information, you store everything as key-value pairs. This means your AI agent can learn new things without database migrations. The <code style="color:#f59e0b">brain_context</code> table is a flexible key-value store. Keys use dot notation (like <code style="color:#f59e0b">identity.name</code>, <code style="color:#f59e0b">session.active_work</code>) for namespacing — the dots create a hierarchy, like folders on your computer. Values are JSONB (a Postgres data type that stores structured JSON data — it can hold strings, numbers, arrays, or nested objects, and you can query inside it).</p>
<h3>Pattern 2: Append-Only Memory</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> Deleting data destroys context. An AI agent that forgets past interactions can't learn or improve. By always appending, you build a complete history the agent can search through. The <code style="color:#f59e0b">agent_memory</code> table stores every interaction. Use <code style="color:#f59e0b">importance</code> scores (1-10) to prioritize retrieval — when the agent needs context, it grabs high-importance memories first. The <code style="color:#f59e0b">embedding</code> column uses <code style="color:#f59e0b">vector(1536)</code> — that's a list of 1,536 numbers that represent the meaning of text. AI models convert text into these vectors so you can find semantically similar memories (e.g., "find memories about deployment" would match "pushed code to Vercel" even though the words are different). The 1536 number matches OpenAI's embedding model dimensions.</p>
<h3>Pattern 3: Event Streaming</h3>
<p style="font-size:.9rem"><strong>Why this pattern:</strong> When something goes wrong (and it will), you need to know exactly what your agent did and when. The <code style="color:#f59e0b">consciousness_stream</code> is an event log — every action the agent takes gets logged with its input and output. This is invaluable for debugging ("why did the agent send that email?"), auditing ("who changed this data?"), and replaying agent behavior to test improvements.</p>
</div>

<div class="progress-section">
<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#999">
<span>Lesson Progress</span><span id="lessonPct">0%</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="lessonProgress"></div></div>
</div>
<div class="footer">Like One Academy &copy; 2026</div>

<div data-learn="QuizMC" data-props='{"title":"Database Patterns Quiz","questions":[{"q":"Why use a key-value pattern for brain_context instead of separate columns?","options":["It is faster to query","New keys can be added without database migrations","It uses less storage","It is more secure"],"correct":1,"explanation":"The key-value pattern means your AI agent can learn new types of information without ALTER TABLE migrations. You just insert a new key — the schema stays the same."},{"q":"What does `vector(1536)` store in the agent_memory table?","options":["A list of 1536 user IDs","A 1536-character text string","1536 numbers representing the semantic meaning of text","A compressed image"],"correct":2,"explanation":"Embeddings are lists of floating-point numbers (1536 for OpenAI models) that encode the semantic meaning of text. They enable similarity search — finding memories that are conceptually related even when words differ."},{"q":"What is the primary purpose of the consciousness_stream table?","options":["Storing user preferences","Logging every agent action for debugging and auditing","Caching API responses","Managing user sessions"],"correct":1,"explanation":"The consciousness_stream is an append-only event log. Every agent action is recorded with its input and output, enabling debugging, auditing, and behavioral replay."}]}'></div>

<div data-learn="MatchConnect" data-props='{"title":"Match Table to Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"brain_context","right":"Current agent state (whiteboard)"},{"left":"agent_memory","right":"Past interactions with importance scores"},{"left":"consciousness_stream","right":"Event log of every agent action"},{"left":"vector(1536)","right":"Semantic embedding for similarity search"}]}'></div>

<div data-learn="SortStack" data-props='{"title":"Order the Schema Design Steps","instruction":"Arrange these steps in the correct order for designing an AI agent database","items":["Identify what data the agent needs to remember","Choose key-value vs. relational structure","Add embedding column for semantic search","Enable RLS on all tables","Create indexes on frequently queried columns"]}'></div>

</div>
