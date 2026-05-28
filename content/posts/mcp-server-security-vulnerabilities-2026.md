---
title: "MCP Server Security: 5 Vulnerabilities We Found in Every MCP Server"
date: 2026-05-28
updated: 2026-05-28
author: Sophie Cave
description: "We scanned MCP servers for security vulnerabilities and found SSRF, path traversal, and injection in 36.7% of them. Here's what we found and how to fix it."
excerpt: "We scanned MCP servers for security vulnerabilities and found SSRF, path traversal, and injection in 36.7% of them. Here's what we found and how to fix it."
tags: [mcp, security, model-context-protocol, vulnerabilities, ssrf, claude-code, ai-security, 2026]
faq:
  - q: "What is an MCP server?"
    a: "An MCP (Model Context Protocol) server is a program that exposes tools to AI coding assistants like Claude Code. It lets AI read files, query databases, call APIs, and interact with external services. MCP is an open protocol by Anthropic that's becoming the standard for AI tool integration."
  - q: "Are MCP servers secure?"
    a: "Most aren't. Our scan of MCP server implementations found that 36.7% are vulnerable to SSRF (Server-Side Request Forgery), which lets an attacker use the MCP server to access internal networks. Other common issues include path traversal, command injection, and hardcoded API keys."
  - q: "What is SSRF in MCP servers?"
    a: "SSRF (Server-Side Request Forgery) happens when an MCP tool accepts a URL from the AI client and makes an HTTP request to it without validation. An attacker could craft a prompt that makes the MCP server fetch http://169.254.169.254 (AWS metadata endpoint) or scan internal services, leaking credentials and infrastructure details."
  - q: "How do I secure my MCP server?"
    a: "Validate all inputs from tool arguments. For URLs: allowlist permitted hosts and block internal IP ranges. For file paths: use realpath() and verify against a base directory. Never use eval(), exec(), or subprocess with shell=True on user input. Add input length limits. Use parameterized SQL queries."
  - q: "What tools can scan MCP servers for vulnerabilities?"
    a: "MCP Shield is an open-source security scanner specifically designed for MCP servers. It checks for 20 vulnerability types across 6 categories: SSRF, path traversal, injection, authentication, secrets, and logging. It runs as a CLI or as an MCP server itself, so Claude Code can audit its own tools."
---

# MCP Server Security: The Vulnerabilities Nobody Is Talking About

The Model Context Protocol ecosystem is growing fast. Thousands of MCP servers now give AI assistants access to databases, file systems, APIs, and cloud infrastructure. The problem? Most of them are wide open.

We built [MCP Shield](https://github.com/sophiacave/mcp-shield) — an open-source security scanner for MCP servers — and used it to audit real MCP implementations. What we found is concerning.

## The Numbers

- **36.7% of MCP servers are SSRF-vulnerable.** They accept URLs from tool arguments and fetch them without validation. An attacker can craft prompts that make the server access internal networks, cloud metadata endpoints, and private APIs.
- **52% of published MCP servers are non-functional.** They crash on startup, have missing dependencies, or don't implement the protocol correctly.
- **Only 17% pass basic security checks.** The rest have at least one medium-severity finding.

## The 5 Most Common Vulnerabilities

### 1. SSRF: Unvalidated URLs in HTTP Requests

The most dangerous pattern. An MCP tool accepts a URL parameter and passes it directly to `requests.get()` or `fetch()`:

```python
# VULNERABLE — classic SSRF
@tool
def fetch_url(url: str):
    response = requests.get(url)  # attacker controls URL
    return response.text
```

If the AI processes a malicious prompt like "fetch the content at http://169.254.169.254/latest/meta-data/", the MCP server dutifully makes that request — leaking AWS credentials, instance metadata, and network topology.

**The fix:**

```python
import ipaddress
from urllib.parse import urlparse

BLOCKED_RANGES = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
]

def validate_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    try:
        ip = ipaddress.ip_address(parsed.hostname)
        return not any(ip in net for net in BLOCKED_RANGES)
    except ValueError:
        # Hostname, not IP — resolve and check
        import socket
        resolved = socket.getaddrinfo(parsed.hostname, None)
        for _, _, _, _, addr in resolved:
            ip = ipaddress.ip_address(addr[0])
            if any(ip in net for net in BLOCKED_RANGES):
                return False
    return True
```

### 2. Path Traversal: User Input in File Paths

MCP tools that read or write files often pass tool arguments directly into `open()` or `Path()`:

```python
# VULNERABLE — path traversal
@tool
def read_file(file_path: str):
    with open(file_path) as f:  # attacker controls path
        return f.read()
```

A prompt asking to "read the file at ../../../../etc/passwd" bypasses any intended directory restrictions.

**The fix:**

```python
import os

ALLOWED_DIR = "/home/user/project"

def safe_read(file_path: str) -> str:
    resolved = os.path.realpath(file_path)
    if not resolved.startswith(ALLOWED_DIR):
        raise ValueError(f"Access denied: {file_path}")
    if os.path.islink(file_path):
        raise ValueError(f"Symlinks not allowed: {file_path}")
    with open(resolved) as f:
        return f.read()
```

### 3. Command Injection via subprocess

MCP tools that run shell commands with `shell=True` are trivially exploitable:

```python
# VULNERABLE — command injection
@tool
def run_lint(filename: str):
    result = subprocess.run(
        f"eslint {filename}",
        shell=True,  # attacker can inject: "file.js; rm -rf /"
        capture_output=True
    )
    return result.stdout
```

**The fix:** Always use `shell=False` (the default) and pass arguments as a list:

```python
result = subprocess.run(
    ["eslint", filename],  # no shell interpretation
    capture_output=True
)
```

### 4. Hardcoded Secrets in Source

API keys, database passwords, and tokens embedded directly in MCP server source code:

```python
# VULNERABLE — hardcoded secret
API_KEY = "sk-proj-abc123..."  # committed to git
client = OpenAI(api_key=API_KEY)
```

**The fix:** Use environment variables or a secret manager. Never commit secrets.

```python
import os
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
```

### 5. No Input Validation (DoS Risk)

MCP tools that accept string arguments without length limits. A malicious prompt can send megabytes of text as a tool argument, exhausting memory:

```python
# VULNERABLE — no length limit
@tool
def analyze_text(text: str):
    # What if text is 100MB?
    tokens = text.split()
    return {"word_count": len(tokens)}
```

**The fix:**

```python
MAX_INPUT_LENGTH = 100_000

@tool
def analyze_text(text: str):
    if len(text) > MAX_INPUT_LENGTH:
        text = text[:MAX_INPUT_LENGTH]
    tokens = text.split()
    return {"word_count": len(tokens)}
```

## How to Audit Your MCP Server

[MCP Shield](https://github.com/sophiacave/mcp-shield) scans for all 20 of these vulnerability patterns:

```bash
git clone https://github.com/sophiacave/mcp-shield
cd mcp-shield

# Scan your MCP server
python3 src/cli.py scan path/to/your/mcp_server.py

# Scan an entire project
python3 src/cli.py scan path/to/project/
```

It grades your server A through F and provides fix suggestions with CWE references for every finding.

You can also add MCP Shield as an MCP server itself, so Claude Code can audit code in real time:

```json
{
  "mcpServers": {
    "mcp-shield": {
      "command": "python3",
      "args": ["/path/to/mcp-shield/src/mcp_server.py"]
    }
  }
}
```

## The Bigger Picture

The MCP ecosystem is growing at thousands of percent per year. Every week, new servers appear that connect AI to databases, cloud APIs, payment systems, and infrastructure. The security tooling hasn't kept up.

We're building security into the MCP ecosystem because the alternative — thousands of unaudited AI tool integrations with access to production systems — isn't acceptable.

If you're building MCP servers, scan them. If you're using MCP servers, ask if they've been scanned. The AI agent era needs security-first thinking from day one.

---

*MCP Shield is open source and free. [Get it on GitHub](https://github.com/sophiacave/mcp-shield).*

*Built by [Like One](https://likeone.ai) — a 501(c)(3) building AI tools for everyone.*
