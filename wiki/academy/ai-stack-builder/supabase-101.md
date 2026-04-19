# Supabase 101

**Course:** AI Stack Builder
**Order:** 2
**Type:** lesson
**Access:** Free

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 2 of 10


  # Supabase 101

  Supabase gives you a Postgres database, auth, edge functions, and real-time subscriptions — all in one platform. It replaces five separate services and is the foundation of your entire AI stack.


## Why Supabase Is the Foundation

Most backend setups require stitching together a database (RDS), authentication (Auth0), serverless functions (Lambda), real-time features (Pusher), and file storage (S3). Supabase bundles **all of these into one platform** built on Postgres — the most battle-tested database in existence.

For AI applications specifically, Supabase adds **pgvector** — a Postgres extension that stores AI embeddings (numerical representations of text meaning) and enables semantic search. This means your AI agent can find memories by meaning, not just keywords.


&#x1f5c4;&#xfe0f;
PostgresFull SQL database with JSONB, indexes, and 30+ years of reliability


&#x1f512;
Auth + RLSUser management + row-level security — the database enforces who sees what


&#x1f9e0;
pgvectorStore AI embeddings and search by meaning — the foundation of AI memory


## Two Keys, Two Levels of Access

When you create a Supabase project, you get two API keys. Understanding the difference between them is **the most important security concept** in this entire course.


**Anon Key (Public)**
**Safe for frontend.** Can be seen in browser source code. Designed to be public. RLS policies control what it can access — without policies, it can access nothing.

eyJhbGciOi... // public, safe


**Service Role Key (Secret)**
**Server-side ONLY.** Bypasses ALL RLS. Full access to every table, every row. If this key leaks, your entire database is compromised.

eyJhbGciOi... // SECRET, never in browser


## Step-by-Step: Create Your First Project

Follow these steps to go from zero to a working Supabase project with a table, RLS, and your first data.


1. Go to **supabase.com** and create a new project. Pick a region close to your users.
2. Save your **Project URL**, **Anon Key**, and **Service Role Key** from Settings → API.
3. Open the **SQL Editor** in the dashboard — this is where you run all database commands.
4. Create your first table (SQL below).
5. Enable RLS and create an access policy.
6. Insert your first record to verify everything works.


## Create the brain_context Table

This table stores your AI agent's memory as key-value pairs. It is the single most important table in any AI application — the agent's persistent brain.


SQL — Create brain_context with pgvector support

```
-- Enable the vector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE brain_context (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text UNIQUE NOT NULL,     -- dot notation: 'identity.name'
  value       jsonb,                    -- flexible structured data
  category    text DEFAULT 'general',  -- session, directive, system
  description text,                     -- human-readable note
  embedding   vector(384),             -- BGE-small AI embeddings
  priority    int DEFAULT 5,
  updated_at  timestamptz DEFAULT now()
);

-- Fast lookups by key
CREATE INDEX idx_brain_key ON brain_context(key);
CREATE INDEX idx_brain_category ON brain_context(category);

-- Semantic search index (cosine similarity)
CREATE INDEX idx_brain_embedding
  ON brain_context
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```


**Column breakdown:** `key` uses dot notation (`identity.name`, `session.active_work`) for organization. `value` is JSONB — a binary JSON format that supports indexing and querying inside the structure. `embedding` stores 384 numbers representing the semantic meaning of the key's content (for AI search).


## Enable Row Level Security

RLS is the bouncer for your database. Without it, anyone with your anon key can read all data. With it, the database itself enforces who can see what — even if your application code has bugs.


SQL — Enable RLS and create a service role policy

```
-- Enable RLS — default-deny: nobody can access without a policy
ALTER TABLE brain_context ENABLE ROW LEVEL SECURITY;

-- Allow the service role (backend only) full access
CREATE POLICY "service_role_all" ON brain_context
  FOR ALL TO service_role
  USING (true);

-- The anon key (frontend) gets NOTHING by default
-- Add more policies later if users need direct access
```


**Critical:** Enabling RLS with **no policies** creates a default-deny state — nobody can access the table. This is the safe default. You explicitly create policies to grant access. Start locked down, open up only what is needed.


## Essential SQL Queries

Run these in the Supabase SQL Editor. They cover the four operations you will use constantly: read, write, update, and filter.


SQL — Essential brain_context queries

```
-- READ: Fetch all rows (most recent first)
SELECT key, value, updated_at
FROM brain_context
ORDER BY updated_at DESC;

-- WRITE: Insert a new key-value pair
INSERT INTO brain_context (key, value, category)
VALUES ('identity.name', '"AI Stack Builder Student"', 'identity');

-- UPSERT: Write or update (no need to check if key exists)
INSERT INTO brain_context (key, value, category)
VALUES ('session.active_work', '{"task":"building"}', 'session')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- FILTER: Find all session keys
SELECT key, value FROM brain_context
WHERE key LIKE 'session.%';
```


## Supabase Client: JavaScript SDK

In production, you interact with Supabase through the JavaScript SDK — not raw SQL. The SDK provides type-safe methods for every operation.


JavaScript — Supabase client setup + queries

```
import { createClient } from '@supabase/supabase-js'

// Initialize (these are safe for the frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// READ — Fetch the 10 most recently updated brain keys
const { data, error } = await supabase
  .from('brain_context')
  .select('key, value, updated_at')
  .order('updated_at', { ascending: false })
  .limit(10)

// UPSERT — Write or update a key-value pair
const { error: writeErr } = await supabase
  .from('brain_context')
  .upsert({
    key: 'session.active_work',
    value: { task: 'Building the AI stack', status: 'in_progress' }
  }, { onConflict: 'key' })

// FILTER — Find all keys matching a pattern
const { data: sessions } = await supabase
  .from('brain_context')
  .select('*')
  .like('key', 'session.%')
```


## The Five Superpowers of Supabase

Each of these replaces a separate service you would otherwise need to set up, configure, and maintain independently.


Feature
What It Does
Replaces


Postgres Database
Full SQL database with JSONB, views, triggers, and 30+ years of reliability
AWS RDS, PlanetScale, MongoDB


Auth + RLS
User signup/login, JWT tokens, row-level access control
Auth0, Firebase Auth, Clerk


Edge Functions
Serverless TypeScript functions deployed globally (Deno runtime)
AWS Lambda, Cloudflare Workers


Realtime
Live subscriptions — your UI updates instantly when data changes
Pusher, Socket.io, Firebase Realtime


pgvector
Store AI embeddings, search by semantic meaning
Pinecone, Weaviate, Chroma


**Cost:** Supabase Pro is **$25/month** and includes all five features. The free tier gives you 2 projects with generous limits for learning and prototyping.


### Quiz

**Q1: What is the difference between the anon key and the service role key?**
    A. They are the same key with different names
  ✓ B. The anon key is public and safe for frontend use; the service role key is secret and bypasses ALL RLS
    C. The anon key is for Edge Functions only
    D. The service role key is used for read operations only
  *The anon key is designed to be public — it can be safely included in frontend JavaScript. RLS policies control what it can access. The service role key bypasses ALL RLS and should only ever exist in server-side code (edge functions, never in the browser).*

**Q2: What does enabling RLS on a table do without adding any policies?**
    A. Allows everyone to read but not write
  ✓ B. Blocks all access to the table — default-deny
    C. Allows service role access only
    D. Has no effect until policies are added
  *Enabling RLS with no policies creates a default-deny state — nobody can access the table. You must explicitly create policies to grant access. This is the safe default: deny all, then open up only what is needed.*

**Q3: What is JSONB in Postgres and why use it for an AI brain table?**
  ✓ A. A faster version of JSON that supports indexing and querying inside the JSON structure
    B. A text format for storing binary data
    C. A UUID generator
    D. A real-time subscription type
  *JSONB is a binary JSON storage format in Postgres. Unlike plain text JSON, JSONB allows you to index and query inside the structure (e.g., WHERE value->>name = Alex). For an AI brain table, this lets you store flexible, schema-less data while still querying it efficiently.*

**Q4: What does an upsert (INSERT ... ON CONFLICT DO UPDATE) do?**
    A. Inserts a row only if the key does not exist
    B. Updates a row only if the key exists
  ✓ C. Creates the row if new, or updates it if the key already exists — in one atomic query
    D. Deletes the old row and creates a new one
  *Upsert combines INSERT and UPDATE into one atomic operation. If the key exists, it updates the row. If not, it creates a new one. No need to check first — the database handles it. This is the standard write pattern for key-value brain tables.*

**Q5: What does pgvector enable that regular Postgres cannot do?**
    A. Faster SQL queries
  ✓ B. Storing AI embeddings and searching by semantic similarity — finding related content by meaning, not keywords
    C. Better authentication
    D. Real-time subscriptions
  *pgvector adds a vector data type and similarity search operators to Postgres. You store AI embeddings (numerical representations of text meaning) and search by cosine similarity — finding semantically related content even when the exact words differ.*


### Supabase 101 Flashcards

**Card 1:**
Front: What SQL command enables Row Level Security on a table?
Back: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY; — This must be followed by CREATE POLICY statements, otherwise the table is locked to all users (default-deny).

**Card 2:**
Front: What is pgvector and what does it enable?
Back: pgvector is a Postgres extension that adds a vector data type and similarity search operators. It enables storing AI embeddings and finding semantically similar rows — the foundation of AI memory and RAG (Retrieval-Augmented Generation).

**Card 3:**
Front: How do you connect to Supabase from a JavaScript frontend?
Back: import { createClient } from @supabase/supabase-js; const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); — then use supabase.from(table).select() for queries.

**Card 4:**
Front: What is the difference between the anon key and service role key?
Back: Anon key: public, safe for frontend, access controlled by RLS policies. Service role key: secret, bypasses ALL RLS, server-side only. If the service role key leaks, your entire database is exposed.

**Card 5:**
Front: What is JSONB and why use it?
Back: JSONB is binary JSON storage in Postgres. Unlike text JSON, it supports indexing and querying inside the structure. Perfect for AI brain tables where values have varying shapes — no schema changes needed for new data types.

**Card 6:**
Front: What does an upsert do?
Back: INSERT ... ON CONFLICT (key) DO UPDATE SET ... — creates a new row if the key does not exist, or updates the existing row if it does. One atomic query, no race conditions, no need to check first.


Lesson 2 of 10

Module 1
