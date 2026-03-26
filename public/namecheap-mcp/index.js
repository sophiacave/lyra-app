#!/usr/bin/env node
/**
 * Namecheap MCP Server — DNS Management
 * Zero-keystroke DNS control for Like One infrastructure.
 * Wraps the Namecheap XML API with clean MCP tools.
 *
 * Required env vars:
 *   NAMECHEAP_API_USER — Namecheap username
 *   NAMECHEAP_API_KEY  — API key from Namecheap dashboard
 *   NAMECHEAP_CLIENT_IP — Whitelisted IP address
 *
 * Faye Cave — Like One / Fractal Brain
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Configuration ───────────────────────────────────────────────────────────
const API_USER = process.env.NAMECHEAP_API_USER || "";
const API_KEY = process.env.NAMECHEAP_API_KEY || "";
const CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP || "";
const API_BASE = "https://api.namecheap.com/xml.response";

// ─── XML Parser (lightweight, no deps) ───────────────────────────────────────
function parseXmlTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function parseXmlAttributes(xml, tag) {
  const regex = new RegExp(`<${tag}\\s+([^>]*?)/?>`, "gi");
  const results = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(match[1])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    results.push(attrs);
  }
  return results;
}

function parseApiErrors(xml) {
  const errors = parseXmlTag(xml, "Error");
  return errors.length > 0 ? errors : null;
}

// ─── API Helper ──────────────────────────────────────────────────────────────
async function namecheapRequest(command, params = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set("ApiUser", API_USER);
  url.searchParams.set("ApiKey", API_KEY);
  url.searchParams.set("UserName", API_USER);
  url.searchParams.set("ClientIp", CLIENT_IP);
  url.searchParams.set("Command", command);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString());
  const xml = await res.text();
  const errors = parseApiErrors(xml);
  if (errors) {
    throw new Error(`Namecheap API error: ${errors.join(", ")}`);
  }
  return xml;
}

// ─── Server Init ─────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "namecheap-mcp-server",
  version: "1.0.0",
});

// ─── Tool: dns_get_records ───────────────────────────────────────────────────
server.registerTool("dns_get_records", {
  title: "Get DNS Records",
  description:
    "Get all DNS host records for a domain. Returns record type, name, " +
    "address/value, TTL, and MX preference for each record.",
  inputSchema: {
    domain: z
      .string()
      .describe('Full domain name (e.g. "likeone.ai", "example.com")'),
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}, async ({ domain }) => {
  try {
    const parts = domain.split(".");
    const tld = parts.pop();
    const sld = parts.join(".");

    const xml = await namecheapRequest("namecheap.domains.dns.getHosts", {
      SLD: sld,
      TLD: tld,
    });

    const hosts = parseXmlAttributes(xml, "host");
    const records = hosts.map((h) => ({
      name: h.Name,
      type: h.Type,
      address: h.Address,
      ttl: h.TTL,
      mxPref: h.MXPref || null,
      hostId: h.HostId,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ domain, count: records.length, records }, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error getting DNS records: ${err.message}` }],
    };
  }
});

// ─── Tool: dns_update_record ─────────────────────────────────────────────────
server.registerTool("dns_update_record", {
  title: "Update DNS Record",
  description:
    "Update a specific DNS record by name and type. Fetches all existing records, " +
    "modifies the target, and writes them all back (Namecheap requires full replacement). " +
    "If the record doesn't exist, it will be added.",
  inputSchema: {
    domain: z.string().describe('Full domain (e.g. "likeone.ai")'),
    name: z.string().describe('Record name/subdomain (e.g. "api", "@", "www", "_acme-challenge.api")'),
    type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "URL", "URL301", "FRAME"])
      .describe("DNS record type"),
    address: z.string().describe("Record value (IP for A/AAAA, hostname for CNAME, text for TXT)"),
    ttl: z.number().min(60).max(60000).optional().describe("TTL in seconds (default 1800)"),
    mxPref: z.number().optional().describe("MX preference (only for MX records)"),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
  },
}, async ({ domain, name, type, address, ttl, mxPref }) => {
  try {
    const parts = domain.split(".");
    const tld = parts.pop();
    const sld = parts.join(".");

    // Get existing records
    const xml = await namecheapRequest("namecheap.domains.dns.getHosts", {
      SLD: sld,
      TLD: tld,
    });
    const existingHosts = parseXmlAttributes(xml, "host");

    // Build new record list — replace matching record or append
    let found = false;
    const records = existingHosts.map((h) => {
      if (h.Name === name && h.Type === type) {
        found = true;
        return { Name: name, Type: type, Address: address, TTL: String(ttl || 1800), MXPref: String(mxPref || h.MXPref || "10") };
      }
      return { Name: h.Name, Type: h.Type, Address: h.Address, TTL: h.TTL, MXPref: h.MXPref || "10" };
    });

    if (!found) {
      records.push({
        Name: name,
        Type: type,
        Address: address,
        TTL: String(ttl || 1800),
        MXPref: String(mxPref || "10"),
      });
    }

    // Build setHosts params
    const setParams = { SLD: sld, TLD: tld };
    records.forEach((r, i) => {
      const n = i + 1;
      setParams[`HostName${n}`] = r.Name;
      setParams[`RecordType${n}`] = r.Type;
      setParams[`Address${n}`] = r.Address;
      setParams[`TTL${n}`] = r.TTL;
      if (r.Type === "MX" || r.Type === "MXE") {
        setParams[`MXPref${n}`] = r.MXPref;
      }
    });

    await namecheapRequest("namecheap.domains.dns.setHosts", setParams);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            action: found ? "updated" : "added",
            record: { name, type, address, ttl: ttl || 1800 },
            totalRecords: records.length,
          }, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error updating DNS record: ${err.message}` }],
    };
  }
});

// ─── Tool: dns_delete_record ─────────────────────────────────────────────────
server.registerTool("dns_delete_record", {
  title: "Delete DNS Record",
  description:
    "Delete a specific DNS record by name and type. Fetches all records, " +
    "removes the target, and writes the rest back.",
  inputSchema: {
    domain: z.string().describe('Full domain (e.g. "likeone.ai")'),
    name: z.string().describe('Record name to delete (e.g. "api", "old-subdomain")'),
    type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "URL", "URL301", "FRAME"])
      .describe("Record type to delete"),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
  },
}, async ({ domain, name, type }) => {
  try {
    const parts = domain.split(".");
    const tld = parts.pop();
    const sld = parts.join(".");

    const xml = await namecheapRequest("namecheap.domains.dns.getHosts", {
      SLD: sld,
      TLD: tld,
    });
    const existingHosts = parseXmlAttributes(xml, "host");

    const filtered = existingHosts.filter(
      (h) => !(h.Name === name && h.Type === type)
    );

    if (filtered.length === existingHosts.length) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: false, reason: "Record not found", name, type }, null, 2),
          },
        ],
      };
    }

    // Namecheap requires at least one record
    if (filtered.length === 0) {
      return {
        isError: true,
        content: [{ type: "text", text: "Cannot delete last remaining DNS record." }],
      };
    }

    const setParams = { SLD: sld, TLD: tld };
    filtered.forEach((h, i) => {
      const n = i + 1;
      setParams[`HostName${n}`] = h.Name;
      setParams[`RecordType${n}`] = h.Type;
      setParams[`Address${n}`] = h.Address;
      setParams[`TTL${n}`] = h.TTL;
      if (h.Type === "MX" || h.Type === "MXE") {
        setParams[`MXPref${n}`] = h.MXPref || "10";
      }
    });

    await namecheapRequest("namecheap.domains.dns.setHosts", setParams);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            deleted: { name, type },
            remainingRecords: filtered.length,
          }, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error deleting DNS record: ${err.message}` }],
    };
  }
});

// ─── Tool: domains_list ──────────────────────────────────────────────────────
server.registerTool("domains_list", {
  title: "List Domains",
  description: "List all domains in the Namecheap account with expiry dates and status.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}, async () => {
  try {
    const xml = await namecheapRequest("namecheap.domains.getList");
    const domains = parseXmlAttributes(xml, "Domain");

    const list = domains.map((d) => ({
      name: d.Name,
      expires: d.Expires,
      isExpired: d.IsExpired,
      autoRenew: d.AutoRenew,
      whoisGuard: d.WhoisGuard,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: list.length, domains: list }, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error listing domains: ${err.message}` }],
    };
  }
});

// ─── Tool: dns_check_propagation ─────────────────────────────────────────────
server.registerTool("dns_check_propagation", {
  title: "Check DNS Propagation",
  description:
    "Quick check if a DNS record has propagated by querying the system resolver. " +
    "Useful after making changes to verify they're live.",
  inputSchema: {
    hostname: z.string().describe('Full hostname to check (e.g. "api.likeone.ai")'),
    type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]).describe("Record type to query"),
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}, async ({ hostname, type }) => {
  try {
    const { execSync } = await import("child_process");
    const result = execSync(`dig ${type} ${hostname} +short`, {
      encoding: "utf-8",
      timeout: 10000,
    }).trim();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            hostname,
            type,
            resolved: result || "(no result)",
            propagated: result.length > 0,
          }, null, 2),
        },
      ],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error checking DNS: ${err.message}` }],
    };
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
async function main() {
  if (!API_USER || !API_KEY || !CLIENT_IP) {
    console.error(
      "Required env vars: NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_CLIENT_IP"
    );
    console.error("Get API key from: Namecheap Dashboard → Profile → Tools → API Access");
    process.exit(1);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Namecheap MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
