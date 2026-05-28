---
title: "36% of MCP Servers Are Vulnerable. Here's How to Check Yours."
date: 2026-05-28
author: Sophie Cave
description: "A security audit of 7,000 MCP servers found 36.7% are vulnerable to SSRF attacks. We built an open-source scanner that checks your server in seconds."
excerpt: "A security audit of 7,000 MCP servers found 36.7% are vulnerable to SSRF attacks. We built an open-source scanner that checks your server in seconds."
tags: [mcp, security, ssrf, vulnerability, open-source, developer-tools, 2026]
faq:
  - q: "What security risks do MCP servers have?"
    a: "MCP servers are vulnerable to the same attacks as any web service, plus unique risks from AI agent access. The most common vulnerabilities are SSRF (Server-Side Request Forgery) at 36.7%, path traversal at 82% of servers using file operations, and code injection via eval/exec. Because MCP servers give AI agents access to files, databases, and APIs, a single vulnerability can give an attacker access to everything the agent can reach."
  - q: "How do I scan my MCP server for vulnerabilities?"
    a: "Use MCP Shield, our open-source security scanner. Clone the repo from GitHub, point it at your MCP server source code, and it will check for 20 security rules across 6 categories including SSRF, path traversal, injection, authentication, security configuration, and logging. It gives you a grade from A to F and specific fix suggestions for every finding."
  - q: "What is SSRF in MCP servers?"
    a: "SSRF (Server-Side Request Forgery) occurs when an MCP server makes HTTP requests to URLs provided by the AI agent without validating them. An attacker can craft prompts that cause the agent to request internal network resources (like cloud metadata endpoints at 169.254.169.254), effectively using your MCP server as a proxy to attack your internal infrastructure."
  - q: "Are MCP servers safe to use in production?"
    a: "MCP servers can be safe in production if properly secured. The problem is that most are built quickly without security review. Only 17% of audited MCP servers are considered production-ready. Before deploying any MCP server, scan it for vulnerabilities, add authentication, validate all inputs, and restrict network access to only necessary endpoints."
---

# 36% of MCP Servers Are Vulnerable. Here's How to Check Yours.

The Model Context Protocol ecosystem has 9,400 servers and 97 million monthly SDK downloads. It is also a security disaster.

A security audit of 7,000 public MCP servers by BlueRock found that 36.7% are vulnerable to Server-Side Request Forgery (SSRF). Endor Labs found that 82% of servers that handle files are prone to path traversal. There were 30 CVEs filed against MCP implementations in just 60 days in early 2026.

And 52% of public MCP servers are dead — abandoned, unmaintained, and running with known vulnerabilities.

We built MCP Shield because nobody else had.

## What MCP Shield Does

MCP Shield is an open-source security scanner that checks your MCP server code for 20 security rules across 6 categories:

- **SSRF** (3 rules): Unvalidated URLs in HTTP requests, insufficient URL validation, and DNS rebinding attacks
- **Path Traversal** (3 rules): Unsanitized file paths, missing `..` directory checks, and symlink following without resolution
- **Injection** (5 rules): Code injection via eval/exec, SQL injection, command injection via shell=True, template injection via .format(), and unsafe deserialization (pickle/yaml)
- **Authentication** (3 rules): Missing auth on tool handlers, hardcoded secrets in source code, and no rate limiting on endpoints
- **Security Configuration** (4 rules): Disabled SSL verification, permissive CORS, stack trace exposure to clients, and missing input length validation
- **Logging** (1 rule): No audit trail on tool invocations

Every finding includes the exact file and line number, a severity rating, a fix suggestion, and a CWE reference.

## How to Use It

```bash
git clone https://github.com/sophiacave/mcp-shield
cd mcp-shield

# Scan a file
python3 src/cli.py scan path/to/your/mcp_server.py

# Scan an entire project
python3 src/cli.py scan path/to/your/mcp-project/

# Use as MCP server in Claude Code
# Add to ~/.claude/mcp.json
```

The scanner gives your server a grade from A to F based on finding severity. Critical findings (SSRF, code injection, hardcoded secrets) result in an F. The goal is to get every MCP server to at least a B before deploying to production.

## Why This Matters

MCP servers are the new attack surface. When you give an AI agent access to your files, database, and APIs through MCP, you are trusting that the server properly validates every input. If it does not, a crafted prompt can:

1. Read files from anywhere on your system (path traversal)
2. Make requests to your internal network (SSRF)
3. Execute arbitrary code (injection)
4. Exfiltrate secrets from your codebase

This is not theoretical. CVE-2025-49596 was a critical RCE in MCP Inspector itself — the tool developers use to debug MCP servers.

## Open Source

MCP Shield is MIT-licensed and free to use. We built it because the MCP ecosystem needs security tooling that does not exist yet. When 36.7% of servers are vulnerable, the solution is not to tell developers to be more careful. The solution is to give them a scanner.

Check your servers. Fix what it finds. Ship secure MCP.

---

*MCP Shield is open source at [github.com/sophiacave/mcp-shield](https://github.com/sophiacave/mcp-shield). Built by Like One, a 501(c)(3) that believes security tooling should be free.*
