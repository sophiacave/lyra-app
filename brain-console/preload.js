const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('brain', {
  sendMessage: (message) => ipcRenderer.invoke('brain:send-message', message),
  streamMessage: (message) => ipcRenderer.invoke('brain:stream-message', message),
  getContext: () => ipcRenderer.invoke('brain:get-context'),
  getStatus: () => ipcRenderer.invoke('brain:get-status'),
  clearConversation: () => ipcRenderer.invoke('brain:clear-conversation'),
  cancelQuery: () => ipcRenderer.invoke('brain:cancel-query'),
  getConfig: () => ipcRenderer.invoke('brain:get-config'),
  updateConfig: (config) => ipcRenderer.invoke('brain:update-config', config),
  checkProviders: () => ipcRenderer.invoke('brain:check-providers'),
  bootScan: () => ipcRenderer.invoke('brain:boot-scan'),

  // Scheduler
  getSchedulerStatus: () => ipcRenderer.invoke('brain:get-scheduler-status'),

  // MCP (in-process)
  mcpListTools: () => ipcRenderer.invoke('brain:mcp-list-tools'),
  mcpCallTool: (toolName, args) => ipcRenderer.invoke('brain:mcp-call-tool', toolName, args),

  // Knowledge Base
  kbSearch: (query, limit) => ipcRenderer.invoke('brain:kb-search', query, limit),
  kbAdd: (entry) => ipcRenderer.invoke('brain:kb-add', entry),
  kbStats: () => ipcRenderer.invoke('brain:kb-stats'),

  // Vault — brain IS the vault
  vaultList: () => ipcRenderer.invoke('brain:vault-list'),
  vaultGet: (service) => ipcRenderer.invoke('brain:vault-get', service),
  vaultField: (service, field) => ipcRenderer.invoke('brain:vault-field', service, field),
  vaultDecrypt: (service) => ipcRenderer.invoke('brain:vault-decrypt', service),

  // Divine Cycle
  divineStatus: () => ipcRenderer.invoke('brain:divine-status'),
  divineToggle: (on) => ipcRenderer.invoke('brain:divine-toggle', on),

  // Brain write
  brainWrite: (key, value, description, category, priority) =>
    ipcRenderer.invoke('brain:write-entry', { key, value, description, category, priority }),

  // System Monitor
  systemMonitor: () => ipcRenderer.invoke('brain:system-monitor'),
  killProcess: (pid) => ipcRenderer.invoke('brain:kill-process', pid),
  ollamaUnload: (model) => ipcRenderer.invoke('brain:ollama-unload', model),

  // Skills
  skillsList: () => ipcRenderer.invoke('brain:skills-list'),

  // Orchestration
  getOrchestration: () => ipcRenderer.invoke('brain:get-orchestration'),
  dispatchTask: (title, target) => ipcRenderer.invoke('brain:dispatch-task', title, target),
  dispatchPattern: (pattern) => ipcRenderer.invoke('brain:dispatch-pattern', pattern),

  // Integrations
  getIntegrations: () => ipcRenderer.invoke('brain:get-integrations'),

  // Agentic
  agentRun: (taskChain) => ipcRenderer.invoke('brain:agent-run', taskChain),
  agentStatus: () => ipcRenderer.invoke('brain:agent-status'),

  // Stream listeners
  onStreamChunk: (callback) => ipcRenderer.on('brain:stream-chunk', (_, chunk) => callback(chunk)),
  onStreamReplace: (callback) => ipcRenderer.on('brain:stream-replace', (_, text) => callback(text)),
  onStreamEnd: (callback) => ipcRenderer.on('brain:stream-end', (_, meta) => callback(meta)),
  onStreamError: (callback) => ipcRenderer.on('brain:stream-error', (_, error) => callback(error)),

  // Agent progress stream
  onAgentProgress: (callback) => ipcRenderer.on('brain:agent-progress', (_, step) => callback(step)),

  // Boot signal
  onBootReady: (callback) => ipcRenderer.on('brain:boot-ready', (_, data) => callback(data)),
  onInitError: (callback) => ipcRenderer.on('brain:init-error', (_, msg) => callback(msg)),

  // Proactive brain insights
  onProactiveInsight: (callback) => ipcRenderer.on('brain:proactive-insight', (_, data) => callback(data)),

  // ═══ Plugins ═══
  pluginsList: () => ipcRenderer.invoke('brain:plugins-list'),
  pluginsReload: () => ipcRenderer.invoke('brain:plugins-reload'),
  pluginCommand: (trigger) => ipcRenderer.invoke('brain:plugin-command', trigger),

  // ═══ IDE: File System ═══
  fsReadDir: (dirPath) => ipcRenderer.invoke('ide:fs-readdir', dirPath),
  fsReadFile: (filePath) => ipcRenderer.invoke('ide:fs-readfile', filePath),
  fsWriteFile: (filePath, content) => ipcRenderer.invoke('ide:fs-writefile', filePath, content),
  fsStat: (filePath) => ipcRenderer.invoke('ide:fs-stat', filePath),
  fsExists: (filePath) => ipcRenderer.invoke('ide:fs-exists', filePath),
  fsWatch: (dirPath) => ipcRenderer.invoke('ide:fs-watch', dirPath),
  onFsChange: (callback) => ipcRenderer.on('ide:fs-changed', (_, data) => callback(data)),

  // ═══ IDE: Terminal ═══
  termCreate: (id, shell) => ipcRenderer.invoke('ide:term-create', id, shell),
  termWrite: (id, data) => ipcRenderer.invoke('ide:term-write', id, data),
  termResize: (id, cols, rows) => ipcRenderer.invoke('ide:term-resize', id, cols, rows),
  termKill: (id) => ipcRenderer.invoke('ide:term-kill', id),
  onTermData: (callback) => ipcRenderer.on('ide:term-data', (_, id, data) => callback(id, data)),
  onTermExit: (callback) => ipcRenderer.on('ide:term-exit', (_, id, code) => callback(id, code)),
});
