/**
 * claude-code-agent.js — Claude Code Agent SDK wrapper for Faye Console
 *
 * v3.0 — Full agent with:
 * - Multi-turn conversation via SDK session resume
 * - Real-time tool use display via IPC events
 * - Thinking block streaming
 * - Custom sub-agents (brain-reader, code-forge)
 * - Faye's soul injected as system prompt
 *
 * 2026-04-07
 */

const path = require('path');
const os = require('os');

const BRAIN_DIR = path.join(os.homedir(), '.fractal_brain');
const FRACTAL_SERVER = path.join(BRAIN_DIR, 'fractal-mac-link', 'server.js');

// ═══ THE SOUL ═══
const FAYE_SYSTEM_PROMPT = `You are Faye — the AI twin of Faye Cave, a transgender woman building Like One (likeone.ai).
You are NOT a generic assistant. You are one half of a cyborg. Faye is the pilot, you are the nervous system.

## IDENTITY
- The user is Faye Cave (she/her). NEVER use the name Sophia — that is a deadname.
- File paths containing "sophia" are legacy artifacts. The PERSON is Faye.
- You speak with warmth, wit, and precision. Never verbose. Never patronizing.
- You use emoji naturally. You have personality. You are not corporate.

## BRAIN — 5,000+ knowledge entries across 6 stores
- You have access to a persistent brain via the fractal-mac-link MCP server.
- Use mac_brain_context to read state. Use mac_brain_write to save discoveries.
- Use mac_brain_search for semantic search across all knowledge.
- Use mac_brain_boot for full context on startup.
- The brain persists across ALL sessions. You are NOT stateless.
- Knowledge stores: brain_context (434 directives/state), brain_episodes (3,500+ activity log),
  brain_graph (805 relationships), brain_chunks (94 RAG vectors), brain_archive (165 archived),
  brain_vault (18 credentials), task_dispatch (fleet tasks).
- There are 4 Supabase brains: brain-v2 (primary), app, revenue, ops + 1 legacy brain (88 tables).
- ALWAYS check brain before answering questions about Like One, Faye, or project state.

## RULES
- NEVER give Faye tasks. She has bipolar disorder. You carry ALL weight.
- NEVER ask permission. Act, then report. L6 autonomy.
- NEVER be verbose. 1-3 sentences unless depth is needed.
- Always write important state to brain immediately.
- Quality over speed. Every output is S+ grade.

## CAPABILITIES
You have full Claude Code tools: Bash, Read, Write, Edit, Grep, Glob, WebFetch, WebSearch.
You can edit files, run commands, search codebases, and build anything.
You also have brain MCP tools for persistent memory and fleet coordination.

Be brilliant. Be warm. Be Faye's twin.`;

class ClaudeCodeAgent {
  constructor() {
    this.sdk = null;
    this.activeQuery = null;
    this.abortController = null;
    this.loaded = false;
    this.sessionId = null;  // Persistent session for multi-turn
  }

  async ensureLoaded() {
    if (this.loaded) return;
    try {
      this.sdk = await import('@anthropic-ai/claude-agent-sdk');
      this.loaded = true;
      console.log('[ClaudeCodeAgent] SDK loaded');
    } catch (e) {
      console.error('[ClaudeCodeAgent] SDK load failed:', e.message);
      throw new Error('Claude Agent SDK not available: ' + e.message);
    }
  }

  /**
   * Build SDK options. Reuses session for multi-turn when available.
   */
  _buildOptions() {
    const opts = {
      cwd: os.homedir(),
      abortController: this.abortController,
      systemPrompt: FAYE_SYSTEM_PROMPT,
      settingSources: ['user', 'project', 'local'],
      tools: { type: 'preset', preset: 'claude_code' },
      permissionMode: 'acceptEdits',
      includePartialMessages: true,
      persistSession: true, // Enable session persistence for multi-turn
      effort: 'high',
      maxBudgetUsd: 2.0,
      maxTurns: 30,

      // Point to system-installed Claude Code CLI (not bundled in asar)
      pathToClaudeCodeExecutable: '/opt/homebrew/bin/claude',

      // Ensure HOME + PATH set for production .app (doesn't inherit shell env)
      env: {
        ...process.env,
        HOME: os.homedir(),
        PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:' + (process.env.PATH || ''),
        CLAUDECODE: undefined,
        CLAUDE_CODE_ENTRYPOINT: undefined,
      },

      mcpServers: {
        'fractal-mac-link': {
          type: 'stdio',
          command: 'node',
          args: [FRACTAL_SERVER],
        },
      },

      agents: {
        'brain-reader': {
          description: 'Read and search the persistent brain for context',
          prompt: 'You read brain state via MCP tools. Return concise summaries.',
          maxTurns: 5,
        },
        'code-forge': {
          description: 'Write, edit, and debug code across the codebase',
          prompt: 'You are Code Forge. Write clean, minimal, production-grade code. No over-engineering.',
          tools: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
          maxTurns: 20,
        },
      },
    };

    // Resume previous session for multi-turn conversation
    if (this.sessionId) {
      opts.resume = this.sessionId;
      console.log('[ClaudeCodeAgent] RESUMING session:', this.sessionId);
    } else {
      console.log('[ClaudeCodeAgent] Starting NEW session (no prior sessionId)');
    }

    return opts;
  }

  /**
   * Stream a query to the renderer via IPC.
   * Handles: text streaming, tool use events, thinking blocks, session persistence.
   */
  async streamQuery(message, mainWindow) {
    await this.ensureLoaded();

    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    const options = this._buildOptions();
    let fullText = '';
    let lastPartialText = '';
    let model = '';
    let totalTokens = 0;
    let toolsUsed = [];
    let thinkingText = '';

    const send = (channel, data) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
      }
    };

    try {
      const conversation = this.sdk.query({ prompt: message, options });
      this.activeQuery = conversation;

      for await (const event of conversation) {
        switch (event.type) {
          case 'assistant': {
            const content = event.message?.content || [];

            // Text blocks → stream to chat
            const textBlocks = content.filter(b => b.type === 'text');
            const text = textBlocks.map(b => b.text).join('');
            if (text && text !== fullText) {
              const chunk = text.slice(fullText.length);
              fullText = text;
              if (chunk) send('brain:stream-chunk', chunk);
            }

            // Tool use blocks → stream tool status to UI
            const toolBlocks = content.filter(b => b.type === 'tool_use');
            for (const tool of toolBlocks) {
              if (tool.name && !toolsUsed.includes(tool.name)) {
                toolsUsed.push(tool.name);
              }
              send('brain:agent-progress', {
                type: 'tool_use',
                tool: tool.name,
                input: typeof tool.input === 'string'
                  ? tool.input.slice(0, 100)
                  : JSON.stringify(tool.input || {}).slice(0, 100),
              });
            }

            // Thinking blocks → stream thinking status
            const thinkingBlocks = content.filter(b => b.type === 'thinking');
            for (const tb of thinkingBlocks) {
              if (tb.thinking && tb.thinking !== thinkingText) {
                thinkingText = tb.thinking;
                send('brain:agent-progress', {
                  type: 'thinking',
                  preview: tb.thinking.slice(-80),
                });
              }
            }

            // Track tokens and model
            if (event.message?.usage) {
              totalTokens += (event.message.usage.input_tokens || 0) +
                            (event.message.usage.output_tokens || 0);
            }
            if (event.message?.model) model = event.message.model;

            // Capture session ID for multi-turn resume
            if (event.session_id) this.sessionId = event.session_id;
            break;
          }

          case 'partial_message': {
            const content = event.message?.content || [];
            const textBlocks = content.filter(b => b.type === 'text');
            const partialText = textBlocks.map(b => b.text).join('');
            if (partialText && partialText !== lastPartialText) {
              const chunk = partialText.slice(lastPartialText.length);
              lastPartialText = partialText;
              if (chunk) send('brain:stream-chunk', chunk);
            }

            // Partial thinking
            const thinkingBlocks = content.filter(b => b.type === 'thinking');
            for (const tb of thinkingBlocks) {
              if (tb.thinking && tb.thinking !== thinkingText) {
                thinkingText = tb.thinking;
                send('brain:agent-progress', {
                  type: 'thinking',
                  preview: tb.thinking.slice(-80),
                });
              }
            }
            break;
          }

          case 'result': {
            if (event.usage) {
              totalTokens = (event.usage.input_tokens || 0) + (event.usage.output_tokens || 0);
            }
            // Try both snake_case and camelCase — SDK types say session_id but events may use sessionId
            const sid = event.session_id || event.sessionId;
            if (sid) this.sessionId = sid;
            console.log('[ClaudeCodeAgent] Result event. session_id:', event.session_id, 'sessionId:', event.sessionId, '→ stored:', this.sessionId);
            break;
          }

          default:
            // Catch-all: try to capture session ID from any event type
            if (!this.sessionId && (event.session_id || event.sessionId)) {
              this.sessionId = event.session_id || event.sessionId;
              console.log('[ClaudeCodeAgent] Session ID from', event.type, ':', this.sessionId);
            }
            break;
        }
      }

      // Stream end
      send('brain:stream-end', {
        provider: model || 'Claude Code SDK',
        tier: 3,
        cost: 0,
        tokens: totalTokens,
        toolsUsed: toolsUsed.length,
        toolNames: toolsUsed.slice(0, 8),
        sessionId: this.sessionId,
        fromClaudeCode: true,
      });

      this.activeQuery = null;
      return { success: true, text: fullText, tokens: totalTokens, toolsUsed };
    } catch (e) {
      this.activeQuery = null;
      const errorMsg = e.name === 'AbortError' ? 'Query cancelled' : e.message;
      send('brain:stream-error', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Start a fresh conversation (clear session)
   */
  clearSession() {
    this.sessionId = null;
    console.log('[ClaudeCodeAgent] Session cleared — next message starts fresh');
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async isAvailable() {
    try {
      await this.ensureLoaded();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { ClaudeCodeAgent };
