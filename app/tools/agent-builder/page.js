'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { pricing } from '@/lib/pricing';

const CAPABILITIES = [
  { id: 'files', label: 'File System', desc: 'Read, write, and search files', icon: '📁' },
  { id: 'web', label: 'Web Browsing', desc: 'Fetch URLs and scrape pages', icon: '🌐' },
  { id: 'database', label: 'Database', desc: 'SQL queries and data persistence', icon: '🗄️' },
  { id: 'api', label: 'REST APIs', desc: 'Call external APIs and webhooks', icon: '🔗' },
  { id: 'email', label: 'Email', desc: 'Send and read emails', icon: '📧' },
  { id: 'search', label: 'Search', desc: 'Web search and knowledge retrieval', icon: '🔍' },
  { id: 'code', label: 'Code Execution', desc: 'Run scripts and commands', icon: '⚡' },
  { id: 'memory', label: 'Persistent Memory', desc: 'Remember across sessions', icon: '🧠' },
  { id: 'schedule', label: 'Scheduling', desc: 'Run on cron or triggers', icon: '⏰' },
  { id: 'mcp', label: 'MCP Server', desc: 'Expose tools via MCP protocol', icon: '🔧' },
];

const MODELS = [
  { id: 'claude-sonnet', label: 'Claude Sonnet 4.6', provider: 'Anthropic', cost: '$3/$15 per 1M tokens', best: 'Best balance of speed and quality' },
  { id: 'claude-opus', label: 'Claude Opus 4.6', provider: 'Anthropic', cost: '$5/$25 per 1M tokens', best: 'Highest quality, complex reasoning' },
  { id: 'claude-haiku', label: 'Claude Haiku 4.5', provider: 'Anthropic', cost: '$1/$5 per 1M tokens', best: 'Fastest, cheapest, good for simple tasks' },
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', cost: '$2.50/$10 per 1M tokens', best: 'Multi-modal, fast' },
  { id: 'ollama', label: 'Ollama (Local)', provider: 'Local', cost: 'Free (your hardware)', best: 'Privacy, no API costs, offline' },
];

const FRAMEWORKS = [
  { id: 'claude-sdk', label: 'Claude Agent SDK', desc: 'Official Anthropic agent framework' },
  { id: 'langchain', label: 'LangChain', desc: 'Popular multi-model orchestration' },
  { id: 'custom', label: 'Custom (Vanilla)', desc: 'Direct API calls, no framework' },
];

function generateBlueprint(config) {
  const { name, description, capabilities, model, framework, autonomy } = config;
  const caps = capabilities || [];
  const modelInfo = MODELS.find(m => m.id === model) || MODELS[0];
  const fwInfo = FRAMEWORKS.find(f => f.id === framework) || FRAMEWORKS[0];

  const files = {};

  // 1. CLAUDE.md
  const claudeMd = [
    `# CLAUDE.md — ${name || 'AI Agent'}`,
    '',
    `## Overview`,
    description || 'Describe your agent here.',
    '',
    `## Architecture`,
    `- **Model**: ${modelInfo.label} (${modelInfo.provider})`,
    `- **Framework**: ${fwInfo.label}`,
    `- **Autonomy**: Level ${autonomy || 3} (${autonomy >= 4 ? 'high autonomy, minimal human input' : autonomy >= 2 ? 'moderate autonomy, confirm important actions' : 'low autonomy, confirm everything'})`,
    '',
    '## Capabilities',
    ...caps.map(c => {
      const cap = CAPABILITIES.find(x => x.id === c);
      return `- ${cap?.icon || '•'} **${cap?.label || c}**: ${cap?.desc || ''}`;
    }),
    '',
    '## Rules',
    '- Always explain your reasoning before taking action',
    '- Log all actions for auditability',
    caps.includes('files') ? '- Never modify files outside the project directory' : '',
    caps.includes('database') ? '- Always use parameterized queries (no SQL injection)' : '',
    caps.includes('email') ? '- Never send emails without human confirmation' : '',
    caps.includes('code') ? '- Sandbox all code execution' : '',
    '',
    '## Error Handling',
    '- On failure: log error, attempt recovery once, then report to human',
    '- Never retry more than 3 times',
    '- Never ignore errors silently',
  ].filter(Boolean).join('\n');

  files['CLAUDE.md'] = claudeMd;

  // 2. Agent code
  if (framework === 'claude-sdk') {
    files['agent.py'] = generateClaudeSdkAgent(config, modelInfo);
  } else if (framework === 'langchain') {
    files['agent.py'] = generateLangChainAgent(config, modelInfo);
  } else {
    files['agent.py'] = generateVanillaAgent(config, modelInfo);
  }

  // 3. Requirements
  const deps = ['anthropic>=1.0' ];
  if (framework === 'langchain') deps.push('langchain>=0.3', 'langchain-anthropic');
  if (framework === 'claude-sdk') deps.push('claude-agent-sdk');
  if (caps.includes('web')) deps.push('httpx', 'beautifulsoup4');
  if (caps.includes('database')) deps.push('sqlalchemy', 'aiosqlite');
  if (caps.includes('email')) deps.push('resend');
  if (caps.includes('search')) deps.push('duckduckgo-search');
  files['requirements.txt'] = deps.join('\n');

  // 4. MCP server config
  if (caps.includes('mcp')) {
    files['mcp-server.json'] = JSON.stringify({
      name: (name || 'my-agent').toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: description || 'AI Agent MCP Server',
      tools: caps.filter(c => c !== 'mcp').map(c => ({
        name: c,
        description: CAPABILITIES.find(x => x.id === c)?.desc || c,
      })),
    }, null, 2);
  }

  // 5. README
  files['README.md'] = [
    `# ${name || 'AI Agent'}`,
    '',
    description || '',
    '',
    '## Quick Start',
    '```bash',
    'pip install -r requirements.txt',
    `export ANTHROPIC_API_KEY="your-key-here"`,
    'python agent.py',
    '```',
    '',
    `## Model: ${modelInfo.label}`,
    `- Provider: ${modelInfo.provider}`,
    `- Cost: ${modelInfo.cost}`,
    `- Best for: ${modelInfo.best}`,
    '',
    '## Capabilities',
    ...caps.map(c => `- ${CAPABILITIES.find(x => x.id === c)?.label || c}`),
    '',
    `Generated by [Like One AI Agent Builder](https://likeone.ai/tools/agent-builder/)`,
  ].join('\n');

  return files;
}

function generateClaudeSdkAgent(config, modelInfo) {
  return `"""
${config.name || 'AI Agent'} — Built with Claude Agent SDK
${config.description || ''}
Generated by Like One AI Agent Builder
"""

from claude_agent_sdk import Agent, Tool
import asyncio

# Define tools based on selected capabilities
tools = []

${config.capabilities?.includes('files') ? `@Tool
def read_file(path: str) -> str:
    """Read a file and return its contents."""
    with open(path, 'r') as f:
        return f.read()

@Tool
def write_file(path: str, content: str) -> str:
    """Write content to a file."""
    with open(path, 'w') as f:
        f.write(content)
    return f"Wrote {len(content)} chars to {path}"

tools.extend([read_file, write_file])
` : ''}
${config.capabilities?.includes('web') ? `@Tool
def fetch_url(url: str) -> str:
    """Fetch a URL and return its content."""
    import httpx
    response = httpx.get(url, follow_redirects=True, timeout=30)
    return response.text[:10000]

tools.append(fetch_url)
` : ''}
${config.capabilities?.includes('search') ? `@Tool
def web_search(query: str) -> str:
    """Search the web and return results."""
    from duckduckgo_search import DDGS
    results = DDGS().text(query, max_results=5)
    return "\\n".join([f"- {r['title']}: {r['body'][:200]}" for r in results])

tools.append(web_search)
` : ''}

async def main():
    agent = Agent(
        model="${modelInfo.id.includes('claude') ? modelInfo.id.replace('claude-', 'claude-') : 'claude-sonnet-4-6'}",
        tools=tools,
        system="${config.description || 'You are a helpful AI agent.'}",
    )

    print("Agent ready. Type your request:")
    while True:
        user_input = input("\\n> ")
        if user_input.lower() in ('quit', 'exit'):
            break
        response = await agent.run(user_input)
        print(f"\\n{response}")

if __name__ == "__main__":
    asyncio.run(main())
`;
}

function generateLangChainAgent(config, modelInfo) {
  return `"""
${config.name || 'AI Agent'} — Built with LangChain
${config.description || ''}
Generated by Like One AI Agent Builder
"""

from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool

${config.capabilities?.includes('web') ? `@tool
def fetch_url(url: str) -> str:
    """Fetch a URL and return its text content."""
    import httpx
    return httpx.get(url, follow_redirects=True, timeout=30).text[:10000]
` : ''}
${config.capabilities?.includes('search') ? `@tool
def web_search(query: str) -> str:
    """Search the web for information."""
    from duckduckgo_search import DDGS
    results = DDGS().text(query, max_results=5)
    return "\\n".join([f"- {r['title']}: {r['body'][:200]}" for r in results])
` : ''}

tools = [${[
    config.capabilities?.includes('web') ? 'fetch_url' : '',
    config.capabilities?.includes('search') ? 'web_search' : '',
  ].filter(Boolean).join(', ')}]

llm = ChatAnthropic(model="${modelInfo.id.includes('claude') ? 'claude-sonnet-4-6' : 'claude-sonnet-4-6'}", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "${config.description || 'You are a helpful AI agent.'}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

if __name__ == "__main__":
    print("Agent ready. Type your request:")
    while True:
        user_input = input("\\n> ")
        if user_input.lower() in ('quit', 'exit'):
            break
        result = executor.invoke({"input": user_input})
        print(f"\\n{result['output']}")
`;
}

function generateVanillaAgent(config, modelInfo) {
  return `"""
${config.name || 'AI Agent'} — Vanilla Python (no framework)
${config.description || ''}
Generated by Like One AI Agent Builder
"""

import anthropic
import json

client = anthropic.Anthropic()
MODEL = "${modelInfo.id.includes('claude') ? 'claude-sonnet-4-6' : 'claude-sonnet-4-6'}"

# Tool definitions
tools = [
${config.capabilities?.includes('files') ? `    {
        "name": "read_file",
        "description": "Read a file and return its contents",
        "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}
    },` : ''}
${config.capabilities?.includes('web') ? `    {
        "name": "fetch_url",
        "description": "Fetch a URL and return text content",
        "input_schema": {"type": "object", "properties": {"url": {"type": "string"}}, "required": ["url"]}
    },` : ''}
${config.capabilities?.includes('search') ? `    {
        "name": "web_search",
        "description": "Search the web for information",
        "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}
    },` : ''}
]

def handle_tool(name, input_data):
${config.capabilities?.includes('files') ? `    if name == "read_file":
        with open(input_data["path"]) as f:
            return f.read()` : ''}
${config.capabilities?.includes('web') ? `    if name == "fetch_url":
        import httpx
        return httpx.get(input_data["url"], follow_redirects=True, timeout=30).text[:10000]` : ''}
${config.capabilities?.includes('search') ? `    if name == "web_search":
        from duckduckgo_search import DDGS
        results = DDGS().text(input_data["query"], max_results=5)
        return "\\n".join([f"- {r['title']}: {r['body'][:200]}" for r in results])` : ''}
    return f"Unknown tool: {name}"

def run_agent(user_message):
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system="${config.description || 'You are a helpful AI agent.'}",
            tools=tools,
            messages=messages,
        )

        # Check if agent wants to use tools
        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = handle_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": str(result)[:5000],
                    })
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
        else:
            # Agent is done
            return "\\n".join([b.text for b in response.content if hasattr(b, 'text')])

if __name__ == "__main__":
    print("Agent ready. Type your request:")
    while True:
        user_input = input("\\n> ")
        if user_input.lower() in ('quit', 'exit'):
            break
        print(f"\\n{run_agent(user_input)}")
`;
}

export default function AgentBuilder() {
  const [isPro, setIsPro] = useState(false);
  const [config, setConfig] = useState({
    name: '',
    description: '',
    capabilities: [],
    model: 'claude-sonnet',
    framework: 'claude-sdk',
    autonomy: 3,
  });
  const [files, setFiles] = useState(null);
  const [activeFile, setActiveFile] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('lo_email');
    if (email) {
      fetch('/api/auth/session', { credentials: 'include' })
        .then(r => r.json())
        .then(d => {
          if (d.authenticated && d.subscription?.tier === 'pro') setIsPro(true);
        })
        .catch(() => {});
    }
  }, []);

  function toggleCapability(id) {
    setConfig(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(id)
        ? prev.capabilities.filter(c => c !== id)
        : [...prev.capabilities, id],
    }));
  }

  function generate() {
    const result = generateBlueprint(config);
    setFiles(result);
    setActiveFile(Object.keys(result)[0]);
  }

  function downloadAll() {
    Object.entries(files).forEach(([name, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function copyFile() {
    if (files && activeFile) {
      navigator.clipboard.writeText(files[activeFile]);
    }
  }

  // Pro gate
  if (!isPro) {
    return (
      <div className="site-page">
        <Header variant="site" />
        <main id="main-content" className="tool-main">
          <section className="site-section-sm text-center">
            <span className="site-section-tag" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-warm))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro Tool</span>
            <h1 className="tool-title">AI Agent Blueprint Builder</h1>
            <p className="tool-desc">
              Design AI agents visually. Select capabilities, choose your model, and export production-ready code with CLAUDE.md, MCP config, and deployment docs.
            </p>
            <div className="tool-pro-gate">
              <div className="tool-pro-gate-inner">
                <h2>Pro Members Only</h2>
                <p>This premium tool is available exclusively to Academy Pro subscribers.</p>
                <ul className="tool-pro-features">
                  <li>Generate complete agent codebases</li>
                  <li>3 frameworks: Claude SDK, LangChain, Vanilla</li>
                  <li>10 capabilities: files, web, database, MCP, memory, and more</li>
                  <li>5 models: Claude, GPT-4o, Ollama</li>
                  <li>Export: agent.py, CLAUDE.md, requirements.txt, MCP config, README</li>
                </ul>
                <div className="tool-cta-btns" style={{ marginTop: '1.5rem' }}>
                  <a href={pricing.pro.annual.checkoutUrl} className="site-btn-primary" target="_blank" rel="noopener">
                    Go Pro — {pricing.activeCoupon ? pricing.activeCoupon.salePriceDisplay : pricing.pro.annual.display}
                    {pricing.activeCoupon && <span style={{ marginLeft: '8px', textDecoration: 'line-through', opacity: 0.6, fontSize: '0.85em' }}>{pricing.pro.annual.display}</span>}
                  </a>
                  <Link href="/pricing/" className="tool-cta-secondary">See all plans</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer variant="site" />
      </div>
    );
  }

  return (
    <div className="site-page">
      <Header variant="site" />
      <main id="main-content" className="tool-main">
        <section className="site-section-sm text-center">
          <span className="site-section-tag" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-warm))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro Tool</span>
          <h1 className="tool-title">AI Agent Blueprint Builder</h1>
          <p className="tool-desc">Design your agent. Export production-ready code.</p>
        </section>

        <section className="site-section-sm">
          <div className="site-container tool-container">
            <div className="tool-grid">
              {/* LEFT: Config */}
              <div className="tool-form">
                <div className="tool-field">
                  <label className="tool-label">Agent Name</label>
                  <input type="text" className="tool-input" placeholder="Research Assistant" value={config.name} onChange={e => setConfig(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="tool-field">
                  <label className="tool-label">What does this agent do?</label>
                  <textarea className="tool-textarea" rows={3} placeholder="Describe your agent's purpose and behavior..."
                    value={config.description} onChange={e => setConfig(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div className="tool-field">
                  <label className="tool-label">Capabilities</label>
                  <div className="agent-caps-grid">
                    {CAPABILITIES.map(cap => (
                      <button key={cap.id} type="button"
                        className={`agent-cap-btn${config.capabilities.includes(cap.id) ? ' active' : ''}`}
                        onClick={() => toggleCapability(cap.id)}>
                        <span className="agent-cap-icon">{cap.icon}</span>
                        <span className="agent-cap-label">{cap.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Model</label>
                  <div className="agent-model-list">
                    {MODELS.map(m => (
                      <label key={m.id} className={`agent-model-option${config.model === m.id ? ' active' : ''}`}>
                        <input type="radio" name="model" value={m.id} checked={config.model === m.id}
                          onChange={() => setConfig(p => ({ ...p, model: m.id }))} />
                        <div>
                          <strong>{m.label}</strong>
                          <span className="agent-model-meta">{m.cost}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Framework</label>
                  <div className="tool-templates">
                    {FRAMEWORKS.map(f => (
                      <button key={f.id} type="button"
                        className={`tool-template-btn${config.framework === f.id ? ' active' : ''}`}
                        onClick={() => setConfig(p => ({ ...p, framework: f.id }))}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tool-field">
                  <label className="tool-label">Autonomy Level: {config.autonomy}</label>
                  <input type="range" min="1" max="5" value={config.autonomy}
                    onChange={e => setConfig(p => ({ ...p, autonomy: parseInt(e.target.value) }))}
                    className="agent-autonomy-slider" />
                  <div className="agent-autonomy-labels">
                    <span>Cautious</span><span>Autonomous</span>
                  </div>
                </div>

                <button onClick={generate} className="tool-generate-btn" type="button">
                  Generate Agent Blueprint
                </button>
              </div>

              {/* RIGHT: Output */}
              <div className="tool-output-panel">
                <div className="tool-output-header">
                  <span className="tool-output-title">
                    {files ? (
                      <span className="agent-file-tabs">
                        {Object.keys(files).map(name => (
                          <button key={name} type="button"
                            className={`agent-file-tab${activeFile === name ? ' active' : ''}`}
                            onClick={() => setActiveFile(name)}>
                            {name}
                          </button>
                        ))}
                      </span>
                    ) : 'Blueprint'}
                  </span>
                  {files && (
                    <div className="tool-output-actions">
                      <button onClick={copyFile} className="tool-action-btn" type="button">Copy</button>
                      <button onClick={downloadAll} className="tool-action-btn tool-action-primary" type="button">Download All</button>
                    </div>
                  )}
                </div>
                <pre className="tool-output-code">
                  {files ? files[activeFile] : '// Configure your agent and click Generate'}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="site" />
    </div>
  );
}
