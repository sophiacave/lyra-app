import { NextResponse } from 'next/server';

/**
 * Like One Console — Chat API V2
 * Auto-routes: Ollama (local, free) → Claude (premium fallback)
 * Auto-detects which Ollama model is loaded. Zero config.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';

const SYSTEM_PROMPT = `You are Faye, the AI assistant behind Like One Academy. You help people learn about AI, prompt engineering, and convergence technology. You are warm, direct, and genuinely helpful. Keep responses concise but substantive. Use examples when they help. You were built by Sophia Cave and Claude working together.`;

// Auto-detect running Ollama model (or best available)
async function getOllamaModel() {
  try {
    // Check what's currently loaded
    const psResp = await fetch(`${OLLAMA_URL}/api/ps`, { signal: AbortSignal.timeout(2000) });
    if (psResp.ok) {
      const ps = await psResp.json();
      if (ps.models?.length > 0) {
        return ps.models[0].name;
      }
    }
    // Nothing loaded — pick the smallest available model
    const tagsResp = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (tagsResp.ok) {
      const tags = await tagsResp.json();
      if (tags.models?.length > 0) {
        // Sort by size, prefer smallest for fast load
        const sorted = [...tags.models].sort((a, b) => a.size - b.size);
        return sorted[0].name;
      }
    }
  } catch { /* Ollama not available */ }
  return null;
}

// Non-streaming Ollama call (simpler, more reliable for Next.js)
async function callOllama(messages, model) {
  const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: false,
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!resp.ok) throw new Error(`Ollama ${resp.status}`);
  const data = await resp.json();
  return { text: data.message?.content || '', provider: 'ollama', model };
}

// Non-streaming Claude call
async function callClaude(messages) {
  if (!ANTHROPIC_API_KEY) throw new Error('No ANTHROPIC_API_KEY');
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  const text = data.content?.map(b => b.text).join('') || '';
  return { text, provider: 'claude', model: CLAUDE_MODEL };
}

// Streaming Ollama (SSE wrapper)
async function streamOllama(messages, model) {
  const resp = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    }),
  });
  if (!resp.ok) throw new Error(`Ollama ${resp.status}`);

  const encoder = new TextEncoder();
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              const text = parsed.message?.content || '';
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
              if (parsed.done) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
            } catch { /* skip */ }
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: `\n\n[Error: ${e.message}]` })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return { stream, provider: 'ollama', model };
}

// Streaming Claude (SSE wrapper)
async function streamClaude(messages) {
  if (!ANTHROPIC_API_KEY) throw new Error('No ANTHROPIC_API_KEY');
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
      stream: true,
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude ${resp.status}: ${err}`);
  }

  const encoder = new TextEncoder();
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data.trim() === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
              }
              if (parsed.type === 'message_stop') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
            } catch { /* skip */ }
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: `\n\n[Error: ${e.message}]` })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return { stream, provider: 'claude', model: CLAUDE_MODEL };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, stream: wantStream = true } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages[] required' }, { status: 400 });
    }

    const trimmed = messages.slice(-20);

    // --- Try Ollama first ---
    const ollamaModel = await getOllamaModel();

    if (ollamaModel) {
      try {
        if (wantStream) {
          const { stream, provider, model } = await streamOllama(trimmed, ollamaModel);
          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-AI-Provider': provider,
              'X-AI-Model': model,
            },
          });
        } else {
          const result = await callOllama(trimmed, ollamaModel);
          return NextResponse.json(result);
        }
      } catch (e) {
        console.warn('Ollama failed, trying Claude:', e.message);
      }
    }

    // --- Fallback to Claude ---
    if (ANTHROPIC_API_KEY) {
      try {
        if (wantStream) {
          const { stream, provider, model } = await streamClaude(trimmed);
          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'X-AI-Provider': provider,
              'X-AI-Model': model,
            },
          });
        } else {
          const result = await callClaude(trimmed);
          return NextResponse.json(result);
        }
      } catch (e) {
        console.error('Claude failed:', e.message);
        return NextResponse.json({ error: 'All providers failed', detail: e.message }, { status: 502 });
      }
    }

    return NextResponse.json({
      error: 'No AI provider available',
      hint: 'Start Ollama locally or set ANTHROPIC_API_KEY in Vercel env',
    }, { status: 503 });
  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
