const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('brain', {
  sendMessage: (message) => ipcRenderer.invoke('brain:send-message', message),
  streamMessage: (message) => ipcRenderer.invoke('brain:stream-message', message),
  getContext: () => ipcRenderer.invoke('brain:get-context'),
  getStatus: () => ipcRenderer.invoke('brain:get-status'),
  clearConversation: () => ipcRenderer.invoke('brain:clear-conversation'),
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

  // Agentic
  agentRun: (taskChain) => ipcRenderer.invoke('brain:agent-run', taskChain),
  agentStatus: () => ipcRenderer.invoke('brain:agent-status'),

  // Stream listeners
  onStreamChunk: (callback) => ipcRenderer.on('brain:stream-chunk', (_, chunk) => callback(chunk)),
  onStreamEnd: (callback) => ipcRenderer.on('brain:stream-end', (_, meta) => callback(meta)),
  onStreamError: (callback) => ipcRenderer.on('brain:stream-error', (_, error) => callback(error)),

  // Agent progress stream
  onAgentProgress: (callback) => ipcRenderer.on('brain:agent-progress', (_, step) => callback(step)),

  // Boot signal
  onBootReady: (callback) => ipcRenderer.on('brain:boot-ready', (_, data) => callback(data)),
  onInitError: (callback) => ipcRenderer.on('brain:init-error', (_, msg) => callback(msg)),

  // Proactive brain insights
  onProactiveInsight: (callback) => ipcRenderer.on('brain:proactive-insight', (_, data) => callback(data)),
});
