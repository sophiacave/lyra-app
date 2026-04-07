/**
 * ide-completions.js — AI Inline Completions for Monaco Editor
 * Powered by Ollama (Qwen 32B local) with cloud fallback.
 * Ghost text appears as you type. Tab to accept.
 * Built with love. McQueen x Rothko.
 */

let completionEnabled = true;
let completionDebounce = null;
let lastCompletionRequest = 0;
const COMPLETION_DELAY = 500; // ms after typing stops
// MLX first (56% faster on Apple Silicon), Ollama fallback
const MLX_URL = 'http://localhost:8800/api/generate';
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const COMPLETION_MODEL = 'qwen2.5-coder:14b';
let useMLX = true; // try MLX first

// ═══ Register Monaco Inline Completion Provider ═══

function registerCompletionProvider() {
  if (!window.monaco || !monacoEditor) return;

  monaco.languages.registerInlineCompletionsProvider('*', {
    provideInlineCompletions: async (model, position, context, token) => {
      if (!completionEnabled) return { items: [] };

      // Don't complete on empty lines or comments
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.substring(0, position.column - 1).trim();
      if (!textBeforeCursor || textBeforeCursor.startsWith('//') || textBeforeCursor.startsWith('#')) {
        return { items: [] };
      }

      // Gather context: 30 lines before cursor + current line
      const startLine = Math.max(1, position.lineNumber - 30);
      const prefix = model.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      // Also get 5 lines after for better context
      const endLine = Math.min(model.getLineCount(), position.lineNumber + 5);
      const suffix = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: endLine,
        endColumn: model.getLineMaxColumn(endLine),
      });

      try {
        const completion = await getOllamaCompletion(prefix, suffix, model.getLanguageId());
        if (!completion || token.isCancellationRequested) return { items: [] };

        return {
          items: [{
            insertText: completion,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          }],
        };
      } catch (e) {
        console.error('[Completions]', e.message);
        return { items: [] };
      }
    },

    freeInlineCompletions: () => {},
  });

  console.log('[Completions] Inline completion provider registered');
}

// ═══ Ollama Completion Engine ═══

async function getOllamaCompletion(prefix, suffix, language) {
  const now = Date.now();
  if (now - lastCompletionRequest < 200) return null; // rate limit
  lastCompletionRequest = now;

  const prompt = buildFIMPrompt(prefix, suffix, language);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s max

    // Try MLX first, fallback to Ollama
    const url = useMLX ? MLX_URL : OLLAMA_URL;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: COMPLETION_MODEL,
        prompt,
        stream: false,
        options: {
          num_predict: 80, // max tokens for completion
          temperature: 0.2,
          top_p: 0.9,
          stop: ['\n\n', '```', '\nfunction ', '\nclass ', '\nconst ', '\nexport '],
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // MLX failed, try Ollama
      if (useMLX) { useMLX = false; return getOllamaCompletion(prefix, suffix, language); }
      return null;
    }
    const data = await response.json();
    const text = data.response?.trim();

    // Clean up: remove trailing incomplete lines, limit length
    if (!text) return null;
    const lines = text.split('\n');
    // Keep max 3 lines of completion
    const cleaned = lines.slice(0, 3).join('\n');
    return cleaned || null;
  } catch (e) {
    if (e.name === 'AbortError') return null;
    // MLX unreachable, fall back to Ollama
    if (useMLX) { useMLX = false; return getOllamaCompletion(prefix, suffix, language); }
    return null;
  }
}

// ═══ FIM (Fill-in-Middle) Prompt Builder ═══

function buildFIMPrompt(prefix, suffix, language) {
  // Qwen uses <|fim_prefix|>, <|fim_suffix|>, <|fim_middle|> for FIM
  return `<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`;
}

// ═══ Toggle ═══

function toggleCompletions(enabled) {
  completionEnabled = enabled;
  console.log('[Completions]', enabled ? 'Enabled' : 'Disabled');
}
