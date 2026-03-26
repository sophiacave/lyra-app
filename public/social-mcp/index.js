#!/usr/bin/env node
/**
 * Nova Social MCP Server — Zero-Keystroke Social Media
 * Posts to Bluesky, X/Twitter, LinkedIn from the brain.
 * Uses Ollama locally for content repurposing.
 *
 * Env vars (credentials stored in brain, loaded at runtime):
 *   SUPABASE_URL        — brain-v2 URL
 *   SUPABASE_SERVICE_KEY — brain-v2 service role key
 *
 * Platform credentials stored in brain_context:
 *   social.credentials.bluesky  — { handle, appPassword }
 *   social.credentials.x        — { apiKey, apiSecret, accessToken, accessSecret }
 *   social.credentials.linkedin — { accessToken, expiresAt }
 *
 * Faye Cave — Like One / Fractal Brain
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Configuration ───────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gpt-oss:20b";

// ─── Brain Helpers ───────────────────────────────────────────────────────────
async function brainRead(key) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/brain_context?key=eq.${encodeURIComponent(key)}&select=value`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const rows = await res.json();
  return rows?.[0]?.value || null;
}

async function brainWrite(key, value, category = "social", description = "", priority = 5) {
  const body = { key, category, value, description, priority };
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/brain_context?on_conflict=key`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(body),
    }
  );
  return res.ok;
}

// ─── Ollama Helper ───────────────────────────────────────────────────────────
async function ollamaGenerate(prompt, system = "") {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        system: system || "You are Nova, the social media voice for Like One (likeone.ai). You write punchy, authentic social posts. No corporate speak. No hashtag spam. Max 2-3 hashtags per post. Voice: smart, direct, slightly irreverent, deeply human.",
        stream: false,
      }),
    });
    const data = await res.json();
    return data.response || "";
  } catch (e) {
    return `[Ollama unavailable: ${e.message}]`;
  }
}

// ─── Platform: Bluesky (AT Protocol) ─────────────────────────────────────────
async function blueskyAuth() {
  const creds = await brainRead("social.credentials.bluesky");
  if (!creds) throw new Error("No Bluesky credentials in brain. Store them at social.credentials.bluesky with { handle, appPassword }");

  const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: creds.handle, password: creds.appPassword }),
  });
  if (!res.ok) throw new Error(`Bluesky auth failed: ${await res.text()}`);
  return res.json();
}

async function blueskyPost(text) {
  const session = await blueskyAuth();
  const now = new Date().toISOString();

  // Parse URLs and create facets for link detection
  const facets = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let match;
  const encoder = new TextEncoder();
  while ((match = urlRegex.exec(text)) !== null) {
    const beforeUrl = text.substring(0, match.index);
    const byteStart = encoder.encode(beforeUrl).length;
    const byteEnd = byteStart + encoder.encode(match[0]).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: match[0] }],
    });
  }

  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: now,
    ...(facets.length > 0 ? { facets } : {}),
  };

  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record,
    }),
  });

  if (!res.ok) throw new Error(`Bluesky post failed: ${await res.text()}`);
  const result = await res.json();
  return { platform: "bluesky", uri: result.uri, cid: result.cid };
}

// ─── Platform: X/Twitter (API v2) ────────────────────────────────────────────
async function xPost(text) {
  const creds = await brainRead("social.credentials.x");
  if (!creds) throw new Error("No X/Twitter credentials in brain. Store them at social.credentials.x with { apiKey, apiSecret, accessToken, accessSecret }");

  const crypto = await import("node:crypto");
  const url = "https://api.twitter.com/2/tweets";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const oauthParams = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join("&");

  const baseString = `POST&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(creds.apiSecret)}&${encodeURIComponent(creds.accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;
  const authHeader = "OAuth " + Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(", ");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`X post failed: ${await res.text()}`);
  const result = await res.json();
  return { platform: "x", id: result.data?.id, text: result.data?.text };
}

// ─── Platform: LinkedIn (Marketing API v2) ────────────────────────────────────
async function linkedinPost(text) {
  const creds = await brainRead("social.credentials.linkedin");
  if (!creds) throw new Error("No LinkedIn credentials in brain. Store them at social.credentials.linkedin with { accessToken, personUrn }");

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: creds.personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (!res.ok) throw new Error(`LinkedIn post failed: ${await res.text()}`);
  const id = res.headers.get("x-restli-id") || "posted";
  return { platform: "linkedin", id };
}

// ─── Platform Router ─────────────────────────────────────────────────────────
const PLATFORMS = {
  bluesky: blueskyPost,
  x: xPost,
  linkedin: linkedinPost,
};

async function postTo(platform, text) {
  const fn = PLATFORMS[platform];
  if (!fn) throw new Error(`Unknown platform: ${platform}. Available: ${Object.keys(PLATFORMS).join(", ")}`);
  return fn(text);
}

// ─── MCP Server Setup ────────────────────────────────────────────────────────
const server = new McpServer({
  name: "nova-social",
  version: "1.0.0",
});

// Tool: social_post — post to one or all platforms
server.tool(
  "social_post",
  "Post text to a social media platform (bluesky, x, linkedin, or 'all')",
  {
    platform: z.enum(["bluesky", "x", "linkedin", "all"]).describe("Platform to post to, or 'all' for everywhere"),
    text: z.string().describe("The post text content"),
  },
  async ({ platform, text }) => {
    const results = [];
    const errors = [];
    const targets = platform === "all" ? Object.keys(PLATFORMS) : [platform];

    for (const p of targets) {
      try {
        const result = await postTo(p, text);
        results.push(result);
      } catch (e) {
        errors.push({ platform: p, error: e.message });
      }
    }

    // Log to brain
    const logEntry = {
      timestamp: new Date().toISOString(),
      text: text.substring(0, 100),
      results,
      errors,
    };
    const history = (await brainRead("social.posting_history")) || [];
    history.unshift(logEntry);
    if (history.length > 100) history.length = 100;
    await brainWrite("social.posting_history", history, "social", "Social posting history — last 100 posts");

    const summary = [
      ...results.map((r) => `✅ ${r.platform}: posted (${r.id || r.uri || "ok"})`),
      ...errors.map((e) => `❌ ${e.platform}: ${e.error}`),
    ].join("\n");

    return { content: [{ type: "text", text: summary }] };
  }
);

// Tool: social_draft — generate platform-specific drafts from content
server.tool(
  "social_draft",
  "Generate platform-specific social media drafts from a blog post or topic using local Ollama AI",
  {
    source: z.string().describe("Blog post slug, URL, or topic to create posts about"),
    platforms: z.array(z.enum(["bluesky", "x", "linkedin"])).default(["bluesky", "x", "linkedin"]).describe("Platforms to generate drafts for"),
  },
  async ({ source, platforms }) => {
    // Try to load blog content from brain if it's a slug
    let content = source;
    const blogContent = await brainRead(`nova.content_${source}`);
    if (blogContent?.markdown) {
      content = blogContent.markdown;
    }

    const drafts = {};
    for (const platform of platforms) {
      const charLimit = platform === "x" ? 280 : platform === "bluesky" ? 300 : 3000;
      const style = platform === "x" ? "punchy tweet, max 280 chars" : platform === "bluesky" ? "authentic short post, max 300 chars" : "professional LinkedIn post with line breaks, 1-3 paragraphs";

      const prompt = `Create a ${style} based on this content. Include a link to https://likeone.ai if relevant. No more than 2 hashtags.\n\nContent:\n${content.substring(0, 2000)}`;
      const draft = await ollamaGenerate(prompt);
      drafts[platform] = draft.trim();
    }

    const output = Object.entries(drafts)
      .map(([p, d]) => `## ${p.toUpperCase()}\n${d}`)
      .join("\n\n");

    return { content: [{ type: "text", text: output }] };
  }
);

// Tool: social_repurpose — take a blog post and create posts for all platforms
server.tool(
  "social_repurpose",
  "Repurpose a blog post into social media posts for all platforms. Reads from content/posts/ directory.",
  {
    slug: z.string().describe("Blog post slug (filename without .md)"),
    auto_post: z.boolean().default(false).describe("If true, immediately post the generated drafts"),
  },
  async ({ slug, auto_post }) => {
    // Read the blog post file
    const fs = await import("node:fs");
    const path = await import("node:path");
    const REPO_ROOT = "/Users/sophiacave/lyra-app";
    const postPath = path.join(REPO_ROOT, "content", "posts", `${slug}.md`);

    let content;
    try {
      content = fs.readFileSync(postPath, "utf8");
    } catch {
      // Try brain
      const brainContent = await brainRead(`nova.content_${slug}`);
      if (brainContent?.markdown) {
        content = brainContent.markdown;
      } else {
        return { content: [{ type: "text", text: `❌ Blog post not found: ${slug}` }] };
      }
    }

    // Extract title from frontmatter or first heading
    const titleMatch = content.match(/title:\s*["']?(.+?)["']?\s*$/m) || content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] || slug;
    const blogUrl = `https://likeone.ai/blog/${slug}/`;

    const drafts = {};
    for (const [platform, charLimit] of [["x", 280], ["bluesky", 300], ["linkedin", 3000]]) {
      const style = platform === "x"
        ? `a punchy tweet (max ${charLimit} chars including the URL). Hook readers. End with the blog URL.`
        : platform === "bluesky"
        ? `a short authentic post (max ${charLimit} chars). Conversational tone. Include the blog URL.`
        : `a LinkedIn post (1-3 short paragraphs). Professional but human. End with a call to read the full post at the URL.`;

      const prompt = `Write ${style}\n\nBlog title: ${title}\nBlog URL: ${blogUrl}\nBlog content (first 1500 chars):\n${content.substring(0, 1500)}`;
      drafts[platform] = (await ollamaGenerate(prompt)).trim();
    }

    // Auto-post if requested
    let postResults = "";
    if (auto_post) {
      for (const [platform, text] of Object.entries(drafts)) {
        try {
          const result = await postTo(platform, text);
          postResults += `\n✅ Posted to ${platform}: ${result.id || result.uri || "ok"}`;
        } catch (e) {
          postResults += `\n❌ ${platform}: ${e.message}`;
        }
      }
    }

    // Store drafts in brain
    await brainWrite(
      `social.drafts.${slug}`,
      { slug, title, drafts, auto_posted: auto_post, created: new Date().toISOString() },
      "social",
      `Social drafts for blog: ${title}`
    );

    const output = Object.entries(drafts)
      .map(([p, d]) => `## ${p.toUpperCase()} (${d.length} chars)\n${d}`)
      .join("\n\n");

    return { content: [{ type: "text", text: `# Social drafts for: ${title}\n\n${output}${postResults ? "\n\n# Post Results" + postResults : "\n\nSet auto_post=true to publish immediately."}` }] };
  }
);

// Tool: social_accounts — list connected accounts and status
server.tool(
  "social_accounts",
  "List all social media accounts and their connection status",
  {},
  async () => {
    const platforms = ["bluesky", "x", "linkedin"];
    const statuses = [];

    for (const p of platforms) {
      const creds = await brainRead(`social.credentials.${p}`);
      if (creds) {
        statuses.push(`✅ ${p}: connected (${creds.handle || creds.personUrn || "configured"})`);
      } else {
        statuses.push(`❌ ${p}: not connected — store credentials at social.credentials.${p}`);
      }
    }

    return { content: [{ type: "text", text: statuses.join("\n") }] };
  }
);

// Tool: social_history — view recent posting history
server.tool(
  "social_history",
  "View recent social media posting history from brain",
  {
    limit: z.number().default(10).describe("Number of recent posts to show"),
  },
  async ({ limit }) => {
    const history = (await brainRead("social.posting_history")) || [];
    if (history.length === 0) {
      return { content: [{ type: "text", text: "No posting history yet." }] };
    }

    const entries = history.slice(0, limit).map((h, i) => {
      const results = h.results?.map((r) => `✅ ${r.platform}`).join(", ") || "";
      const errors = h.errors?.map((e) => `❌ ${e.platform}`).join(", ") || "";
      return `${i + 1}. [${h.timestamp}] "${h.text}..." → ${results}${errors}`;
    });

    return { content: [{ type: "text", text: entries.join("\n") }] };
  }
);

// Tool: social_store_credentials — store platform credentials in brain
server.tool(
  "social_store_credentials",
  "Store social media platform credentials securely in the brain",
  {
    platform: z.enum(["bluesky", "x", "linkedin"]).describe("Platform to store credentials for"),
    credentials: z.string().describe("JSON string of credentials. Bluesky: {handle, appPassword}. X: {apiKey, apiSecret, accessToken, accessSecret}. LinkedIn: {accessToken, personUrn}"),
  },
  async ({ platform, credentials }) => {
    let creds;
    try {
      creds = JSON.parse(credentials);
    } catch {
      return { content: [{ type: "text", text: "❌ Invalid JSON. Provide a valid JSON string." }] };
    }

    await brainWrite(
      `social.credentials.${platform}`,
      creds,
      "social",
      `${platform} API credentials — stored securely in brain`
    );

    return { content: [{ type: "text", text: `✅ ${platform} credentials stored in brain at social.credentials.${platform}` }] };
  }
);

// ─── Start Server ────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
