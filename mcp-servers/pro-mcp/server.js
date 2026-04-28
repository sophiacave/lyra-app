#!/usr/bin/env node
/**
 * Pro MCP Server — Make any web app programmable via CLI
 *
 * First target: Suno Studio for the Timbre pipeline.
 * Architecture: YAML profiles define actions → engine executes via Chrome bridge
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import chrome from "./chrome.js";
import engine from "./engine.js";

// ── Load profiles ──────────────────────────────────────────────────
const PROFILES_DIR = path.join(import.meta.dirname, "profiles");
const profiles = {};

function loadProfiles() {
  if (!fs.existsSync(PROFILES_DIR)) return;
  for (const file of fs.readdirSync(PROFILES_DIR)) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    try {
      const content = fs.readFileSync(path.join(PROFILES_DIR, file), "utf8");
      const profile = yaml.load(content);
      if (profile?.name) {
        profiles[profile.name] = profile;
      }
    } catch (e) {
      console.error(`Failed to load profile ${file}: ${e.message}`);
    }
  }
}

loadProfiles();

// ── MCP Server ─────────────────────────────────────────────────────
const server = new McpServer({
  name: "pro-mcp",
  version: "1.0.0",
});

// ── Tool: Execute action from profile ──────────────────────────────
server.tool(
  "pro_execute",
  "Execute a named action from a web app profile. Use pro_list to see available profiles and actions.",
  {
    profile: z.string().describe("Profile name (e.g. 'suno-studio')"),
    action: z.string().describe("Action name (e.g. 'generate', 'set_style', 'credits')"),
    params: z.record(z.string()).optional().describe("Parameters for the action (e.g. { style: 'lofi hip-hop' })"),
  },
  async ({ profile: profileName, action, params }) => {
    const profile = profiles[profileName];
    if (!profile) {
      return {
        content: [{
          type: "text",
          text: `❌ Profile "${profileName}" not found. Available: ${Object.keys(profiles).join(", ")}`,
        }],
      };
    }

    try {
      const result = await engine.executeAction(profile, action, params || {});
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2),
        }],
      };
    } catch (e) {
      return {
        content: [{
          type: "text",
          text: `❌ Action failed: ${e.message}`,
        }],
      };
    }
  }
);

// ── Tool: List profiles and actions ────────────────────────────────
server.tool(
  "pro_list",
  "List all available Pro MCP profiles and their actions",
  {},
  async () => {
    const listing = Object.values(profiles).map(p => ({
      name: p.name,
      url: p.url,
      description: p.description,
      actions: Object.entries(p.actions || {}).map(([name, action]) => ({
        name,
        description: action.description || "",
        steps: action.steps?.length || 0,
      })),
      genre_presets: p.genre_presets ? Object.keys(p.genre_presets) : undefined,
    }));

    return {
      content: [{
        type: "text",
        text: JSON.stringify(listing, null, 2),
      }],
    };
  }
);

// ── Tool: Suno Studio generate (convenience shortcut) ──────────────
server.tool(
  "suno_generate",
  "Generate a remix in Suno Studio with a specific genre style. Convenience wrapper for the Timbre pipeline.",
  {
    style: z.string().describe("Genre style tags (e.g. 'Lofi hip-hop, chill beats, 85BPM') or preset name (e.g. 'lofi', 'edm', 'kpop')"),
  },
  async ({ style }) => {
    const profile = profiles["suno-studio"];
    if (!profile) {
      return { content: [{ type: "text", text: "❌ suno-studio profile not loaded" }] };
    }

    // Resolve preset name to full style string
    const resolvedStyle = profile.genre_presets?.[style] || style;

    try {
      // Execute the combined generate action
      const result = await engine.executeAction(profile, "generate", { style: resolvedStyle });
      return {
        content: [{
          type: "text",
          text: `✅ Suno generation started\n\nStyle: ${resolvedStyle}\nSteps: ${result.steps?.length}\n\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    } catch (e) {
      return {
        content: [{
          type: "text",
          text: `❌ Generation failed: ${e.message}`,
        }],
      };
    }
  }
);

// ── Tool: Suno credits check ───────────────────────────────────────
server.tool(
  "suno_credits",
  "Check Suno Studio credits remaining",
  {},
  async () => {
    const profile = profiles["suno-studio"];
    if (!profile) {
      return { content: [{ type: "text", text: "❌ suno-studio profile not loaded" }] };
    }

    try {
      const result = await engine.executeAction(profile, "credits", {});
      const billing = result.context?.billing;
      if (billing) {
        try {
          const data = JSON.parse(billing);
          return {
            content: [{
              type: "text",
              text: `🎵 Suno Credits: ${data.credits} remaining\nPlan: ${data.plan}\nUsage: ${data.monthly_usage}/${data.monthly_limit} this month`,
            }],
          };
        } catch (e) {}
      }
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return { content: [{ type: "text", text: `❌ ${e.message}` }] };
    }
  }
);

// ── Tool: Suno batch generate (multiple genres) ────────────────────
server.tool(
  "suno_batch_generate",
  "Generate remixes in multiple genres sequentially. For the Timbre pipeline.",
  {
    genres: z.array(z.string()).describe("List of genre preset names or style strings"),
    delay_seconds: z.number().optional().default(10).describe("Seconds to wait between generations"),
  },
  async ({ genres, delay_seconds }) => {
    const profile = profiles["suno-studio"];
    if (!profile) {
      return { content: [{ type: "text", text: "❌ suno-studio profile not loaded" }] };
    }

    const results = [];
    for (const genre of genres) {
      const resolvedStyle = profile.genre_presets?.[genre] || genre;
      try {
        const result = await engine.executeAction(profile, "generate", { style: resolvedStyle });
        results.push({ genre, style: resolvedStyle, ok: result.ok });
      } catch (e) {
        results.push({ genre, style: resolvedStyle, ok: false, error: e.message });
      }

      // Wait between generations
      if (delay_seconds > 0) {
        await new Promise(r => setTimeout(r, delay_seconds * 1000));
      }
    }

    const succeeded = results.filter(r => r.ok).length;
    return {
      content: [{
        type: "text",
        text: `🎵 Batch generation: ${succeeded}/${genres.length} started\n\n${JSON.stringify(results, null, 2)}`,
      }],
    };
  }
);

// ── Tool: Chrome page info ─────────────────────────────────────────
server.tool(
  "pro_page_info",
  "Get current Chrome tab URL and title",
  {},
  async () => {
    const info = chrome.getPageInfo();
    return {
      content: [{
        type: "text",
        text: JSON.stringify(info, null, 2),
      }],
    };
  }
);

// ── Tool: Chrome navigate ──────────────────────────────────────────
server.tool(
  "pro_navigate",
  "Navigate Chrome to a URL",
  {
    url: z.string().describe("URL to navigate to"),
  },
  async ({ url }) => {
    const result = chrome.navigate(url);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result),
      }],
    };
  }
);

// ── Tool: Execute raw JavaScript in Chrome ─────────────────────────
server.tool(
  "pro_js",
  "Execute JavaScript in the current Chrome tab. For advanced automation.",
  {
    code: z.string().describe("JavaScript code to execute"),
    async: z.boolean().optional().default(false).describe("Whether the code is async (uses await)"),
  },
  async ({ code, async: isAsync }) => {
    const result = isAsync
      ? await chrome.executeAsyncJS(code)
      : chrome.executeJS(code);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2),
      }],
    };
  }
);

// ── Tool: Reload profiles ──────────────────────────────────────────
server.tool(
  "pro_reload",
  "Reload all YAML profiles from disk",
  {},
  async () => {
    Object.keys(profiles).forEach(k => delete profiles[k]);
    loadProfiles();
    return {
      content: [{
        type: "text",
        text: `✅ Reloaded ${Object.keys(profiles).length} profiles: ${Object.keys(profiles).join(", ")}`,
      }],
    };
  }
);

// ── Start ──────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
