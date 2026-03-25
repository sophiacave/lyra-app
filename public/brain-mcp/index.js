#!/usr/bin/env node
/**
 * Brain MCP Server — Fractal Brain Connector
 * Connects Claude/Cowork directly to Supabase for unlimited persistent memory,
 * context, thinking, progress tracking, and working files.
 *
 * Architecture: Supabase (brain) → Make.com (muscle) → Notion (face)
 * Transport: stdio (local Cowork integration)
 *
 * S.C. — Like One / Fractal Brain
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// ─── Configuration ───────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "https://tnsujchfrixxsdpodygu.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const BRAIN_API_URL = process.env.BRAIN_API_URL || `${SUPABASE_URL}/functions/v1/brain-api`;
const BRAIN_API_KEY = process.env.BRAIN_API_KEY || "lk-brain-2026-fractal-console-key";
const SB_REST = `${SUPABASE_URL}/rest/v1`;
// ─── Supabase REST Helper ────────────────────────────────────────────────────
async function supabaseRequest(path, options = {}) {
    const { method = "GET", body, params, headers = {}, prefer } = options;
    const url = new URL(`${SB_REST}/${path}`);
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            url.searchParams.set(k, v);
        }
    }
    const reqHeaders = {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        ...headers,
    };
    if (prefer) {
        reqHeaders["Prefer"] = prefer;
    }
    const res = await fetch(url.toString(), {
        method,
        headers: reqHeaders,
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`Supabase ${method} ${path} failed (${res.status}): ${text}`);
    }
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
// ─── Brain API Helper ────────────────────────────────────────────────────────
async function brainApiRequest(endpoint, body) {
    const url = `${BRAIN_API_URL}${endpoint}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-brain-key": BRAIN_API_KEY,
        },
        body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`Brain API ${endpoint} failed (${res.status}): ${text}`);
    }
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
// ─── Server Init ─────────────────────────────────────────────────────────────
const server = new McpServer({
    name: "brain-mcp-server",
    version: "1.0.0",
});
// ─── Tool: brain_read_context ────────────────────────────────────────────────
server.registerTool("brain_read_context", {
    title: "Read Brain Context",
    description: "Read entries from brain_context table. Returns key-value context entries " +
        "with category, priority, and description. Use to retrieve system state, " +
        "credentials, architecture info, directives, and all persistent context. " +
        "Filter by key, category, or priority. Without filters returns all entries.",
    inputSchema: {
        key: z.string().optional().describe("Exact key to look up (e.g. 'architecture.fractal_brain')"),
        category: z.string().optional().describe("Filter by category (e.g. 'architecture', 'credentials', 'directive')"),
        priority: z.number().min(1).max(3).optional().describe("Filter by priority (1=critical, 2=important, 3=normal)"),
        search: z.string().optional().describe("Full-text search across key, description, and value fields"),
        limit: z.number().min(1).max(100).optional().describe("Max entries to return (default 50)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ key, category, priority, search, limit }) => {
    try {
        const params = {
            order: "priority.asc,updated_at.desc",
            limit: String(limit || 50),
        };
        if (key)
            params["key"] = `eq.${key}`;
        if (category)
            params["category"] = `eq.${category}`;
        if (priority)
            params["priority"] = `eq.${priority}`;
        if (search)
            params["or"] = `(key.ilike.*${search}*,description.ilike.*${search}*,value->>0.ilike.*${search}*)`;
        const data = await supabaseRequest("brain_context", { params, headers: { Accept: "application/json" } });
        const entries = data;
        const summary = entries.map((e) => ({
            key: e.key,
            value: e.value,
            category: e.category,
            priority: e.priority,
            description: e.description,
            updated_at: e.updated_at,
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ count: entries.length, entries: summary }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error reading context: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_write_context ───────────────────────────────────────────────
server.registerTool("brain_write_context", {
    title: "Write Brain Context",
    description: "Create or update an entry in brain_context. Use to store system state, " +
        "architecture decisions, credentials, directives, progress, and any persistent " +
        "context. Upserts on key — existing entries are updated, new ones created.",
    inputSchema: {
        key: z.string().describe("Unique key for the context entry (e.g. 'architecture.fractal_brain')"),
        value: z.unknown().describe("The value to store (any JSON — object, array, string, number)"),
        category: z.string().describe("Category (e.g. 'architecture', 'credentials', 'directive', 'system', 'tasks')"),
        priority: z.number().min(1).max(3).optional().describe("Priority: 1=critical, 2=important, 3=normal (default 2)"),
        description: z.string().optional().describe("Human-readable description of what this entry represents"),
    },
    annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ key, value, category, priority, description }) => {
    try {
        const body = {
            key,
            value,
            category,
            priority: priority || 2,
            description: description || null,
            updated_at: new Date().toISOString(),
        };
        const data = await supabaseRequest("brain_context", {
            method: "POST",
            body,
            headers: { Accept: "application/json" },
            prefer: "resolution=merge-duplicates,return=representation",
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ success: true, entry: data }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error writing context: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_search_memory ───────────────────────────────────────────────
server.registerTool("brain_search_memory", {
    title: "Search Agent Memory",
    description: "Search the agent_memory table (4,800+ entries). Contains all memories, " +
        "observations, learnings, and historical context. Filter by agent, type, " +
        "or full-text search. Returns most recent first.",
    inputSchema: {
        search: z.string().optional().describe("Search text across content, type, and metadata"),
        agent: z.string().optional().describe("Filter by agent name (e.g. 'lyra', 'claude')"),
        type: z.string().optional().describe("Filter by memory type"),
        limit: z.number().min(1).max(100).optional().describe("Max entries (default 20)"),
        offset: z.number().min(0).optional().describe("Offset for pagination (default 0)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ search, agent, type, limit, offset }) => {
    try {
        const params = {
            order: "created_at.desc",
            limit: String(limit || 20),
            offset: String(offset || 0),
        };
        if (agent)
            params["agent"] = `eq.${agent}`;
        if (type)
            params["type"] = `eq.${type}`;
        if (search)
            params["or"] = `(content.ilike.*${search}*,type.ilike.*${search}*)`;
        const data = await supabaseRequest("agent_memory", { params, headers: { Accept: "application/json" } });
        const entries = data;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ count: entries.length, offset: offset || 0, has_more: entries.length === (limit || 20), entries }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error searching memory: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_write_memory ────────────────────────────────────────────────
server.registerTool("brain_write_memory", {
    title: "Write Agent Memory",
    description: "Store a new memory entry in agent_memory. Use to persist observations, " +
        "learnings, decisions, discoveries, and any information that should survive " +
        "across sessions. Memories are never overwritten — each call creates a new entry.",
    inputSchema: {
        content: z.string().describe("The memory content to store"),
        agent: z.string().optional().describe("Agent name (default 'claude')"),
        type: z.string().optional().describe("Memory type (e.g. 'observation', 'learning', 'decision', 'discovery')"),
        metadata: z.record(z.unknown()).optional().describe("Additional metadata as key-value pairs"),
    },
    annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async ({ content, agent, type, metadata }) => {
    try {
        const body = {
            content,
            agent: agent || "claude",
            type: type || "observation",
            metadata: metadata || {},
            created_at: new Date().toISOString(),
        };
        const data = await supabaseRequest("agent_memory", {
            method: "POST",
            body,
            headers: { Accept: "application/json" },
            prefer: "return=representation",
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ success: true, memory: data }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error writing memory: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_query_knowledge ─────────────────────────────────────────────
server.registerTool("brain_query_knowledge", {
    title: "Query Shared Knowledge",
    description: "Query the shared_knowledge table (4,000+ entries). Contains cross-agent " +
        "knowledge, documentation, patterns, and reference material. Filter by " +
        "topic, category, or full-text search.",
    inputSchema: {
        search: z.string().optional().describe("Search text across title, content, and tags"),
        category: z.string().optional().describe("Filter by knowledge category"),
        limit: z.number().min(1).max(100).optional().describe("Max entries (default 20)"),
        offset: z.number().min(0).optional().describe("Offset for pagination (default 0)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ search, category, limit, offset }) => {
    try {
        const params = {
            order: "created_at.desc",
            limit: String(limit || 20),
            offset: String(offset || 0),
        };
        if (category)
            params["category"] = `eq.${category}`;
        if (search)
            params["or"] = `(title.ilike.*${search}*,content.ilike.*${search}*)`;
        const data = await supabaseRequest("shared_knowledge", { params, headers: { Accept: "application/json" } });
        const entries = data;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ count: entries.length, offset: offset || 0, has_more: entries.length === (limit || 20), entries }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error querying knowledge: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_think ───────────────────────────────────────────────────────
server.registerTool("brain_think", {
    title: "Brain Think",
    description: "Send a thinking request to the Brain API /think endpoint. Uses hybrid " +
        "LLM routing (85-90% free Groq, 10-15% paid Claude) to process requests. " +
        "Great for offloading reasoning, analysis, code generation, and planning " +
        "to the Fractal Brain's own intelligence layer.",
    inputSchema: {
        system: z.string().optional().describe("System prompt / context for the thinking request"),
        message: z.string().describe("The user message / question / task to think about"),
        tier: z.string().optional().describe("LLM tier: FAST, STANDARD, CODE, REASON, HEAVY, APEX (default auto-routes)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async ({ system, message, tier }) => {
    try {
        const messages = [];
        if (system) {
            messages.push({ role: "system", content: system });
        }
        messages.push({ role: "user", content: message });
        const body = { messages };
        if (tier)
            body.tier = tier;
        const data = await brainApiRequest("/think", body);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error calling brain /think: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_log_progress ────────────────────────────────────────────────
server.registerTool("brain_log_progress", {
    title: "Log Progress",
    description: "Log a progress entry to agent_logs. Use to record actions taken, " +
        "milestones reached, errors encountered, and decisions made. Entries " +
        "sync to Notion via Make.com automation.",
    inputSchema: {
        action: z.string().describe("What action was taken or what happened"),
        agent: z.string().optional().describe("Agent name (default 'claude')"),
        level: z.string().optional().describe("Log level: info, warn, error, debug (default 'info')"),
        details: z.record(z.unknown()).optional().describe("Additional structured details"),
    },
    annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async ({ action, agent, level, details }) => {
    try {
        const body = {
            action,
            agent: agent || "claude",
            level: level || "info",
            details: details || {},
            created_at: new Date().toISOString(),
        };
        const data = await supabaseRequest("agent_logs", {
            method: "POST",
            body,
            headers: { Accept: "application/json" },
            prefer: "return=representation",
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ success: true, log: data }, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error logging progress: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_list_sessions ───────────────────────────────────────────────
server.registerTool("brain_list_sessions", {
    title: "List Brain Sessions",
    description: "List sessions from brain_sessions table. Shows session history, " +
        "status, and metadata for tracking work across conversations.",
    inputSchema: {
        status: z.string().optional().describe("Filter by status (e.g. 'active', 'completed')"),
        limit: z.number().min(1).max(50).optional().describe("Max sessions (default 10)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ status, limit }) => {
    try {
        const params = {
            order: "created_at.desc",
            limit: String(limit || 10),
        };
        if (status)
            params["status"] = `eq.${status}`;
        const data = await supabaseRequest("brain_sessions", { params, headers: { Accept: "application/json" } });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error listing sessions: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_get_tools ───────────────────────────────────────────────────
server.registerTool("brain_get_tools", {
    title: "Get Brain Tools",
    description: "List registered tools from brain_tools table (26 tools). Shows all " +
        "capabilities registered in the Fractal Brain including endpoints, " +
        "descriptions, and status.",
    inputSchema: {
        search: z.string().optional().describe("Search tool names and descriptions"),
        limit: z.number().min(1).max(50).optional().describe("Max tools (default 30)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ search, limit }) => {
    try {
        const params = {
            order: "name.asc",
            limit: String(limit || 30),
        };
        if (search)
            params["or"] = `(name.ilike.*${search}*,description.ilike.*${search}*)`;
        const data = await supabaseRequest("brain_tools", { params, headers: { Accept: "application/json" } });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error getting tools: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_get_workflows ───────────────────────────────────────────────
server.registerTool("brain_get_workflows", {
    title: "Get Brain Workflows",
    description: "List workflows from brain_workflows table (10 workflows). Shows " +
        "automation workflows, their triggers, steps, and status.",
    inputSchema: {
        search: z.string().optional().describe("Search workflow names and descriptions"),
        limit: z.number().min(1).max(50).optional().describe("Max workflows (default 20)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ search, limit }) => {
    try {
        const params = {
            order: "created_at.desc",
            limit: String(limit || 20),
        };
        if (search)
            params["or"] = `(name.ilike.*${search}*,description.ilike.*${search}*)`;
        const data = await supabaseRequest("brain_workflows", { params, headers: { Accept: "application/json" } });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error getting workflows: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_get_decisions ────────────────────────────────────────────────
server.registerTool("brain_get_decisions", {
    title: "Get Brain Decisions",
    description: "List decisions from brain_decisions table (11 decisions). Shows " +
        "architectural and strategic decisions with rationale, status, and impact.",
    inputSchema: {
        search: z.string().optional().describe("Search decision titles and descriptions"),
        limit: z.number().min(1).max(50).optional().describe("Max decisions (default 20)"),
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async ({ search, limit }) => {
    try {
        const params = {
            order: "created_at.desc",
            limit: String(limit || 20),
        };
        if (search)
            params["or"] = `(title.ilike.*${search}*,description.ilike.*${search}*)`;
        const data = await supabaseRequest("brain_decisions", { params, headers: { Accept: "application/json" } });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error getting decisions: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_raw_query ───────────────────────────────────────────────────
server.registerTool("brain_raw_query", {
    title: "Raw Brain Query",
    description: "Execute a raw Supabase REST query against any table in the Fractal Brain. " +
        "Use for advanced queries, joins, or accessing tables not covered by other tools. " +
        "52 tables available including: brain_context, agent_memory, shared_knowledge, " +
        "agent_logs, brain_sessions, brain_tools, brain_workflows, brain_decisions, and more.",
    inputSchema: {
        table: z.string().describe("Table name to query (e.g. 'agent_memory', 'brain_context')"),
        method: z.enum(["GET", "POST", "PATCH", "DELETE"]).optional().describe("HTTP method (default GET)"),
        params: z.record(z.string()).optional().describe("Query parameters (PostgREST syntax, e.g. {\"select\": \"id,name\", \"limit\": \"10\"})"),
        body: z.unknown().optional().describe("Request body for POST/PATCH operations"),
        prefer: z.string().optional().describe("Prefer header (e.g. 'return=representation', 'count=exact')"),
    },
    annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
    },
}, async ({ table, method, params, body, prefer }) => {
    try {
        const data = await supabaseRequest(table, {
            method: method || "GET",
            params: params || undefined,
            body: body || undefined,
            headers: { Accept: "application/json" },
            prefer: prefer || undefined,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error querying ${table}: ${err.message}` }],
        };
    }
});
// ─── Tool: brain_status ──────────────────────────────────────────────────────
server.registerTool("brain_status", {
    title: "Brain Status",
    description: "Get a quick status overview of the Fractal Brain. Returns counts for " +
        "all major tables, recent activity, and system health indicators.",
    inputSchema: {},
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
    },
}, async () => {
    try {
        const tables = [
            "brain_context",
            "agent_memory",
            "shared_knowledge",
            "agent_logs",
            "brain_sessions",
            "brain_tools",
            "brain_workflows",
            "brain_decisions",
        ];
        const counts = {};
        for (const table of tables) {
            try {
                const data = await supabaseRequest(table, {
                    params: { select: "id", limit: "1" },
                    headers: { Accept: "application/json" },
                    prefer: "count=exact",
                });
                // Supabase returns content-range header with count, but via REST
                // we'll just get the array — use HEAD or a different approach
                // For simplicity, do a count query
                const countData = await supabaseRequest(`${table}?select=count`, {
                    headers: { Accept: "application/vnd.pgrst.object+json" },
                });
                counts[table] = countData.count;
            }
            catch {
                counts[table] = -1; // error getting count
            }
        }
        // Get most recent log
        const recentLogs = (await supabaseRequest("agent_logs", {
            params: { order: "created_at.desc", limit: "3", select: "action,agent,level,created_at" },
            headers: { Accept: "application/json" },
        }));
        // Get most recent context update
        const recentContext = (await supabaseRequest("brain_context", {
            params: { order: "updated_at.desc", limit: "3", select: "key,category,updated_at" },
            headers: { Accept: "application/json" },
        }));
        const status = {
            brain: "online",
            timestamp: new Date().toISOString(),
            table_counts: counts,
            recent_activity: {
                logs: recentLogs,
                context_updates: recentContext,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(status, null, 2),
                },
            ],
        };
    }
    catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `Error getting brain status: ${err.message}` }],
        };
    }
});
// ─── Start Server ────────────────────────────────────────────────────────────
async function main() {
    if (!SUPABASE_SERVICE_KEY) {
        console.error("SUPABASE_SERVICE_KEY environment variable is required");
        process.exit(1);
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Brain MCP Server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
