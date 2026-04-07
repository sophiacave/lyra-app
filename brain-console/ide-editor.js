/**
 * ide-editor.js — Monaco Code Editor for Faye Brain IDE
 * Built with love. McQueen x Rothko.
 */

let monacoEditor = null;
let editorTabs = []; // { path, name, model, modified }
let activeEditorTab = null;
let monacoReady = false;
let fileTreeRoot = null;
// Home dir hardcoded for now — preload doesn't expose os.homedir
const HOME_DIR = '/Users/sophiacave';

// ═══ Monaco Loader ═══

function initMonaco() {
  if (monacoReady) return Promise.resolve();

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'node_modules/monaco-editor/min/vs/loader.js';
    script.onload = () => {
      require.config({
        paths: { vs: 'node_modules/monaco-editor/min/vs' }
      });
      require(['vs/editor/editor.main'], function (monaco) {
        window.monaco = monaco;

        // Define Faye dark theme — McQueen x Rothko
        monaco.editor.defineTheme('faye-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '636e72', fontStyle: 'italic' },
            { token: 'keyword', foreground: '6c5ce7' },
            { token: 'string', foreground: '00cec9' },
            { token: 'number', foreground: 'e17055' },
            { token: 'type', foreground: 'a29bfe' },
            { token: 'function', foreground: '74b9ff' },
          ],
          colors: {
            'editor.background': '#0a0a0f',
            'editor.foreground': '#e8e6e3',
            'editor.selectionBackground': '#6c5ce740',
            'editor.lineHighlightBackground': '#ffffff08',
            'editorCursor.foreground': '#a29bfe',
            'editorLineNumber.foreground': '#636e72',
            'editorLineNumber.activeForeground': '#a29bfe',
            'editor.selectionHighlightBackground': '#6c5ce720',
            'editorIndentGuide.background': '#ffffff10',
            'editorBracketMatch.background': '#6c5ce730',
          },
        });

        monacoReady = true;
        resolve();
      });
    };
    document.head.appendChild(script);
  });
}

function createMonacoEditor() {
  if (!monacoReady || monacoEditor) return;

  const container = document.getElementById('monaco-container');
  if (!container) return;

  monacoEditor = monaco.editor.create(container, {
    value: '// Open a file from the tree or use the Open File button\n',
    language: 'javascript',
    theme: 'faye-dark',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 22,
    minimap: { enabled: true, maxColumn: 80 },
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    bracketPairColorization: { enabled: true },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    padding: { top: 12 },
    automaticLayout: true,
  });

  // Track modifications
  monacoEditor.onDidChangeModelContent(() => {
    if (activeEditorTab) {
      activeEditorTab.modified = true;
      renderEditorTabs();
    }
  });

  // Cmd+S to save
  monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    editorSave();
  });
}

// ═══ File Operations ═══

function getLanguageForFile(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
    json: 'json', md: 'markdown', html: 'html', css: 'css', scss: 'scss',
    yaml: 'yaml', yml: 'yaml', toml: 'toml', sh: 'shell', zsh: 'shell',
    sql: 'sql', xml: 'xml', svg: 'xml', txt: 'plaintext',
  };
  return map[ext] || 'plaintext';
}

async function editorOpenPath(filePath) {
  // Check if already open
  const existing = editorTabs.find(t => t.path === filePath);
  if (existing) {
    activateEditorTab(existing);
    return;
  }

  const result = await window.brain.fsReadFile(filePath);
  if (result.error) {
    console.error('[Editor] Failed to open:', result.error);
    return;
  }

  const name = filePath.split('/').pop();
  const lang = getLanguageForFile(name);
  const model = monaco.editor.createModel(result.content, lang, monaco.Uri.file(filePath));

  const tab = { path: filePath, name, model, modified: false };
  editorTabs.push(tab);
  activateEditorTab(tab);
}

function activateEditorTab(tab) {
  activeEditorTab = tab;
  if (monacoEditor && tab.model) {
    monacoEditor.setModel(tab.model);
  }
  renderEditorTabs();
}

function closeEditorTab(tab) {
  const idx = editorTabs.indexOf(tab);
  if (idx === -1) return;

  tab.model.dispose();
  editorTabs.splice(idx, 1);

  if (activeEditorTab === tab) {
    if (editorTabs.length > 0) {
      activateEditorTab(editorTabs[Math.max(0, idx - 1)]);
    } else {
      activeEditorTab = null;
      if (monacoEditor) {
        monacoEditor.setModel(monaco.editor.createModel('// No file open\n', 'plaintext'));
      }
    }
  }
  renderEditorTabs();
}

async function editorSave() {
  if (!activeEditorTab || !activeEditorTab.path) return;
  const content = monacoEditor.getValue();
  const result = await window.brain.fsWriteFile(activeEditorTab.path, content);
  if (result.success) {
    activeEditorTab.modified = false;
    renderEditorTabs();
  } else {
    console.error('[Editor] Save failed:', result.error);
  }
}

async function editorOpenFile() {
  // Simple prompt-based file open (later: native dialog)
  const filePath = prompt('File path to open:');
  if (filePath) await editorOpenPath(filePath);
}

function renderEditorTabs() {
  const container = document.getElementById('editor-tabs');
  if (!container) return;

  container.innerHTML = editorTabs.map(tab => {
    const active = tab === activeEditorTab ? ' active' : '';
    const mod = tab.modified ? '<span class="tab-modified">*</span>' : '';
    return `<div class="editor-tab${active}" onclick="activateEditorTab(editorTabs[${editorTabs.indexOf(tab)}])">
      ${tab.name}${mod}
      <span class="tab-close" onclick="event.stopPropagation(); closeEditorTab(editorTabs[${editorTabs.indexOf(tab)}])">x</span>
    </div>`;
  }).join('');
}

// ═══ File Tree ═══

async function loadFileTree(rootPath, container, depth = 0) {
  if (depth > 6) return; // safety
  const entries = await window.brain.fsReadDir(rootPath);
  if (!entries?.length) return;

  // Filter hidden files at root level
  const filtered = depth === 0
    ? entries.filter(e => !e.name.startsWith('.') || e.name === '.claude')
    : entries.filter(e => !e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== '.git');

  filtered.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'tree-item';
    item.style.paddingLeft = (12 + depth * 14) + 'px';

    if (entry.isDirectory) {
      let expanded = false;
      const childContainer = document.createElement('div');
      childContainer.style.display = 'none';

      item.innerHTML = `<span class="tree-dir-icon">&#9654;</span> ${entry.name}/`;
      item.onclick = async (e) => {
        e.stopPropagation();
        expanded = !expanded;
        const icon = item.querySelector('.tree-dir-icon');
        if (expanded) {
          icon.classList.add('open');
          childContainer.style.display = 'block';
          if (!childContainer.hasChildNodes()) {
            await loadFileTree(entry.path, childContainer, depth + 1);
          }
        } else {
          icon.classList.remove('open');
          childContainer.style.display = 'none';
        }
      };

      container.appendChild(item);
      container.appendChild(childContainer);
    } else {
      const ext = entry.name.split('.').pop();
      const icon = { js: '&#9830;', ts: '&#9826;', py: '&#9827;', json: '{ }', md: '&#9998;', html: '&#9671;', css: '&#9670;' }[ext] || '&#9642;';
      item.innerHTML = `<span style="width:14px;text-align:center;font-size:10px;opacity:0.5;">${icon}</span> ${entry.name}`;
      item.onclick = () => editorOpenPath(entry.path);
      container.appendChild(item);
    }
  });
}

// ═══ Panel Loader ═══

let editorInitialized = false;

async function loadEditorPanel() {
  if (!editorInitialized) {
    editorInitialized = true;
    await initMonaco();
    createMonacoEditor();

    // Register AI completions + context menu
    registerCompletionProvider();
    registerEditorContextMenu();

    // Load file tree
    const treeContainer = document.getElementById('editor-file-tree');
    if (treeContainer) {
      treeContainer.innerHTML = '';
      await loadFileTree(HOME_DIR + '/lyra-app', treeContainer, 0);
    }
  }

  // Refresh layout
  if (monacoEditor) {
    setTimeout(() => monacoEditor.layout(), 100);
  }
}
