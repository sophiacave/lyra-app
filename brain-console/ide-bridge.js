/**
 * ide-bridge.js — Chat ↔ Editor ↔ Terminal Bridge
 * Connects all IDE panels so they work as one nervous system.
 * Built with love. McQueen x Rothko.
 */

// ═══ Editor → Chat: Ask Faye about selected code ═══

function registerEditorContextMenu() {
  if (!window.monaco || !monacoEditor) return;

  // Add "Ask Faye" to right-click context menu
  monacoEditor.addAction({
    id: 'faye-ask-about-selection',
    label: 'Ask Faye about this',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
    contextMenuGroupId: 'faye',
    contextMenuOrder: 1,
    run: () => {
      const selection = monacoEditor.getModel().getValueInRange(monacoEditor.getSelection());
      if (!selection.trim()) return;
      askFayeAboutCode(selection, 'explain');
    },
  });

  monacoEditor.addAction({
    id: 'faye-fix-selection',
    label: 'Fix this code',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyX],
    contextMenuGroupId: 'faye',
    contextMenuOrder: 2,
    run: () => {
      const selection = monacoEditor.getModel().getValueInRange(monacoEditor.getSelection());
      if (!selection.trim()) return;
      askFayeAboutCode(selection, 'fix');
    },
  });

  monacoEditor.addAction({
    id: 'faye-refactor-selection',
    label: 'Refactor this code',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR],
    contextMenuGroupId: 'faye',
    contextMenuOrder: 3,
    run: () => {
      const selection = monacoEditor.getModel().getValueInRange(monacoEditor.getSelection());
      if (!selection.trim()) return;
      askFayeAboutCode(selection, 'refactor');
    },
  });

  console.log('[Bridge] Editor context menu actions registered');
}

function askFayeAboutCode(code, action) {
  const lang = monacoEditor?.getModel()?.getLanguageId() || 'code';
  const fileName = activeEditorTab?.name || 'unknown';

  const prompts = {
    explain: `Explain this ${lang} code from ${fileName}:\n\n\`\`\`${lang}\n${code}\n\`\`\``,
    fix: `Fix any bugs in this ${lang} code from ${fileName}. Return ONLY the corrected code:\n\n\`\`\`${lang}\n${code}\n\`\`\``,
    refactor: `Refactor this ${lang} code from ${fileName} for clarity and performance. Return ONLY the improved code:\n\n\`\`\`${lang}\n${code}\n\`\`\``,
  };

  const message = prompts[action] || prompts.explain;

  // Switch to chat panel and inject the message
  switchPanel('chat');
  const input = document.getElementById('messageInput');
  if (input) {
    input.value = message;
    sendMessage();
  }
}

// ═══ Chat → Editor: Insert code from AI responses ═══

function insertCodeFromChat(code) {
  if (!monacoEditor || !activeEditorTab) {
    // No file open — open in new untitled tab
    if (window.monaco && monacoEditor) {
      const model = monaco.editor.createModel(code, 'javascript');
      const tab = { path: null, name: 'untitled', model, modified: true };
      editorTabs.push(tab);
      activateEditorTab(tab);
      switchPanel('editor');
    }
    return;
  }

  // Insert at cursor position
  const position = monacoEditor.getPosition();
  monacoEditor.executeEdits('faye-insert', [{
    range: new monaco.Range(
      position.lineNumber, position.column,
      position.lineNumber, position.column
    ),
    text: code,
  }]);

  switchPanel('editor');
  monacoEditor.focus();
}

// ═══ Chat → Terminal: Run commands ═══

function runInTerminal(command) {
  if (!activeTermId) {
    // No terminal — create one first
    terminalNew().then(() => {
      setTimeout(() => {
        window.brain.termWrite(activeTermId, command + '\n');
        switchPanel('terminal');
      }, 500);
    });
    return;
  }

  window.brain.termWrite(activeTermId, command + '\n');
  switchPanel('terminal');
}

// ═══ Enhanced Chat Commands ═══

function handleIDECommands(message) {
  // /edit <path> — open file in editor
  const editMatch = message.match(/^\/edit\s+(.+)$/);
  if (editMatch) {
    const filePath = editMatch[1].trim().replace('~', '/Users/sophiacave');
    editorOpenPath(filePath);
    switchPanel('editor');
    return true;
  }

  // /run <command> — execute in terminal
  const runMatch = message.match(/^\/run\s+(.+)$/);
  if (runMatch) {
    runInTerminal(runMatch[1]);
    return true;
  }

  // /term — switch to terminal
  if (message === '/term' || message === '/terminal') {
    switchPanel('terminal');
    if (!activeTermId) terminalNew();
    return true;
  }

  // /completions on|off — toggle AI completions
  const compMatch = message.match(/^\/completions\s+(on|off)$/);
  if (compMatch) {
    toggleCompletions(compMatch[1] === 'on');
    addMessage('brain', `AI completions ${compMatch[1] === 'on' ? 'enabled' : 'disabled'}.`);
    return true;
  }

  return false; // not an IDE command
}

// ═══ Make code blocks in chat clickable ═══

function enhanceChatCodeBlocks() {
  // Observe chat for new messages, add "Insert" and "Run" buttons to code blocks
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const codeBlocks = node.querySelectorAll?.('pre code') || [];
        codeBlocks.forEach((block) => {
          if (block.dataset.enhanced) return;
          block.dataset.enhanced = 'true';

          const toolbar = document.createElement('div');
          toolbar.style.cssText = 'display:flex; gap:4px; margin-top:6px; padding-top:6px; border-top:1px solid var(--border);';

          const insertBtn = document.createElement('button');
          insertBtn.textContent = 'Insert in Editor';
          insertBtn.style.cssText = 'font-size:10px; padding:2px 8px; background:var(--accent-purple); color:white; border:none; border-radius:3px; cursor:pointer; font-family:JetBrains Mono,monospace;';
          insertBtn.onclick = () => insertCodeFromChat(block.textContent);

          const copyBtn = document.createElement('button');
          copyBtn.textContent = 'Copy';
          copyBtn.style.cssText = 'font-size:10px; padding:2px 8px; background:var(--bg-tertiary); color:var(--text-secondary); border:1px solid var(--border); border-radius:3px; cursor:pointer; font-family:JetBrains Mono,monospace;';
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(block.textContent);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 1500);
          };

          // If it looks like a shell command, add Run button
          const text = block.textContent.trim();
          if (text.startsWith('$') || text.startsWith('npm ') || text.startsWith('node ') ||
              text.startsWith('cd ') || text.startsWith('git ') || text.startsWith('curl ')) {
            const runBtn = document.createElement('button');
            runBtn.textContent = 'Run in Terminal';
            runBtn.style.cssText = 'font-size:10px; padding:2px 8px; background:var(--accent-cyan); color:var(--bg-primary); border:none; border-radius:3px; cursor:pointer; font-family:JetBrains Mono,monospace;';
            runBtn.onclick = () => runInTerminal(text.replace(/^\$\s*/, ''));
            toolbar.appendChild(runBtn);
          }

          toolbar.appendChild(insertBtn);
          toolbar.appendChild(copyBtn);
          block.parentElement.appendChild(toolbar);
        });
      });
    });
  });

  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    observer.observe(chatMessages, { childList: true, subtree: true });
    console.log('[Bridge] Chat code block enhancer active');
  }
}

// ═══ Init Bridge ═══

document.addEventListener('DOMContentLoaded', () => {
  // Start code block enhancer immediately
  enhanceChatCodeBlocks();
});
