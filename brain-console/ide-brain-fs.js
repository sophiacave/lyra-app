/**
 * ide-brain-fs.js — Brain Virtual Filesystem for Monaco Editor
 * Opens brain keys as editable JSON documents in the editor.
 * brain://directive.divine_cycle → opens as JSON in Monaco
 * Built with love. McQueen x Rothko.
 */

// ═══ Brain Key → Monaco Model ═══

async function openBrainKey(key) {
  // Check if already open
  const virtualPath = `brain://${key}`;
  const existing = editorTabs.find(t => t.path === virtualPath);
  if (existing) {
    activateEditorTab(existing);
    switchPanel('editor');
    return;
  }

  // Fetch from brain
  const result = await window.brain.getContext();
  if (!result.success || !result.context) {
    console.error('[BrainFS] Brain not connected');
    return;
  }

  const entry = result.context.find(e => e.key === key);
  if (!entry) {
    console.error('[BrainFS] Key not found:', key);
    return;
  }

  // Parse value to pretty JSON
  let content;
  try {
    const parsed = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
    content = JSON.stringify(parsed, null, 2);
  } catch {
    content = typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value);
  }

  // Add metadata header as comment
  const header = `// brain://${key}\n// category: ${entry.category || 'unknown'} | priority: ${entry.priority || 5}\n// ${entry.description || ''}\n// ─────────────────────────────────────\n\n`;

  await initMonaco();
  if (!monacoEditor) createMonacoEditor();

  const model = monaco.editor.createModel(header + content, 'json', monaco.Uri.parse(virtualPath));
  const tab = { path: virtualPath, name: `🧠 ${key}`, model, modified: false, brainKey: key, brainMeta: entry };
  editorTabs.push(tab);
  activateEditorTab(tab);
  switchPanel('editor');
}

// ═══ Save Brain Key from Editor ═══

async function saveBrainKey(tab) {
  if (!tab.brainKey) return false;

  const raw = monacoEditor.getValue();
  // Strip header comments
  const lines = raw.split('\n');
  const dataStart = lines.findIndex(l => !l.startsWith('//') && l.trim() !== '');
  const jsonStr = lines.slice(dataStart).join('\n').trim();

  let value;
  try {
    value = JSON.parse(jsonStr);
  } catch (e) {
    console.error('[BrainFS] Invalid JSON:', e.message);
    addMessage('brain', `❌ Save failed: invalid JSON in ${tab.brainKey}`, true);
    return false;
  }

  const result = await window.brain.brainWrite(
    tab.brainKey,
    value,
    tab.brainMeta?.description || '',
    tab.brainMeta?.category || 'session',
    tab.brainMeta?.priority || 5
  );

  if (result.success) {
    tab.modified = false;
    renderEditorTabs();
    return true;
  }
  return false;
}

// ═══ Brain Tree in File Explorer ═══

async function loadBrainTree(container) {
  const result = await window.brain.getContext();
  if (!result.success || !result.context) return;

  // Group by category
  const categories = {};
  result.context.forEach(entry => {
    const cat = entry.category || 'uncategorized';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(entry);
  });

  // Section header
  const header = document.createElement('div');
  header.style.cssText = 'padding:8px 12px; font-size:10px; color:var(--accent-purple); font-weight:600; text-transform:uppercase; letter-spacing:1px; border-top:1px solid var(--border); margin-top:8px;';
  header.textContent = '🧠 Brain Keys';
  container.appendChild(header);

  Object.keys(categories).sort().forEach(cat => {
    const catItem = document.createElement('div');
    catItem.className = 'tree-item';
    catItem.style.paddingLeft = '12px';
    let expanded = false;
    const childDiv = document.createElement('div');
    childDiv.style.display = 'none';

    catItem.innerHTML = `<span class="tree-dir-icon">&#9654;</span> ${cat}/ <span style="opacity:0.4;font-size:10px;">(${categories[cat].length})</span>`;
    catItem.onclick = () => {
      expanded = !expanded;
      catItem.querySelector('.tree-dir-icon').classList.toggle('open', expanded);
      childDiv.style.display = expanded ? 'block' : 'none';
    };

    categories[cat].sort((a, b) => a.key.localeCompare(b.key)).forEach(entry => {
      const item = document.createElement('div');
      item.className = 'tree-item';
      item.style.paddingLeft = '26px';
      const shortKey = entry.key.split('.').pop();
      item.innerHTML = `<span style="width:14px;text-align:center;font-size:10px;opacity:0.5;">{ }</span> ${shortKey}`;
      item.title = entry.key + '\n' + (entry.description || '');
      item.onclick = () => openBrainKey(entry.key);
      childDiv.appendChild(item);
    });

    container.appendChild(catItem);
    container.appendChild(childDiv);
  });
}

// ═══ Override editorSave to handle brain keys ═══

const _originalEditorSave = typeof editorSave === 'function' ? editorSave : null;

// Patch will be applied after ide-editor.js loads
function patchEditorSave() {
  const origSave = window.editorSave || editorSave;
  window.editorSave = editorSave = async function() {
    if (activeEditorTab?.brainKey) {
      const ok = await saveBrainKey(activeEditorTab);
      if (ok) addMessage('brain', `✅ Brain key \`${activeEditorTab.brainKey}\` saved.`);
      return;
    }
    // Fall through to filesystem save
    if (!activeEditorTab || !activeEditorTab.path) return;
    const content = monacoEditor.getValue();
    const result = await window.brain.fsWriteFile(activeEditorTab.path, content);
    if (result.success) {
      activeEditorTab.modified = false;
      renderEditorTabs();
    }
  };
}

// ═══ Patch file tree to include brain keys ═══

const _originalLoadEditorPanel = typeof loadEditorPanel === 'function' ? loadEditorPanel : null;

function patchEditorPanel() {
  const origLoad = window.loadEditorPanel || loadEditorPanel;
  const origInit = editorInitialized;

  window.loadEditorPanel = loadEditorPanel = async function() {
    await origLoad();

    // Add brain tree after file tree (only once)
    const treeContainer = document.getElementById('editor-file-tree');
    if (treeContainer && !treeContainer.dataset.brainLoaded) {
      treeContainer.dataset.brainLoaded = 'true';
      await loadBrainTree(treeContainer);
    }
  };
}

// Apply patches after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    patchEditorSave();
    patchEditorPanel();
  }, 500);
});
