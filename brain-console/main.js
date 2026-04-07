const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');

// Set app name for dock and task switcher
app.setName('Like One');
if (app.dock) app.dock.setIcon(require('path').join(__dirname, 'assets', 'icon.png'));
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ═══ Load environment from brain's .env (production app doesn't inherit shell env) ═══
const BRAIN_ENV = path.join(os.homedir(), '.fractal_brain', '.env');
try {
  const envContent = fs.readFileSync(BRAIN_ENV, 'utf8');
  for (const line of envContent.split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0 && !line.startsWith('#')) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (val && !process.env[key]) process.env[key] = val;
    }
  }
  // Also load Anthropic key from faye_config.json if available
  const fayeConfig = path.join(os.homedir(), '.fractal_brain', 'faye_config.json');
  if (fs.existsSync(fayeConfig)) {
    const config = JSON.parse(fs.readFileSync(fayeConfig, 'utf8'));
    if (config.anthropic_api_key && !process.env.ANTHROPIC_API_KEY) {
      process.env.ANTHROPIC_API_KEY = config.anthropic_api_key;
    }
  }
} catch (e) {
  console.warn('[Env] Could not load brain .env:', e.message);
}
const { TerminalManager } = require('./terminal-manager');
const { BrainAPI } = require('./brain-api');
const { BrainContext } = require('./brain-context');
const { LocalEngine } = require('./local-engine');
const { SmartRouter } = require('./smart-router');
const { Scheduler } = require('./scheduler');
const { BrainMCP } = require('./brain-mcp');
const { BrainKnowledge } = require('./brain-knowledge');
const { BrainAgent } = require('./brain-agent');
const { ClaudeCodeAgent } = require('./claude-code-agent');
const { ElectronMCPBridge } = require('./electron-mcp-bridge');
const { PluginLoader } = require('./plugin-loader');
const { HookSystem } = require('./hook-system');

let mainWindow;
let terminalManager;
let brainAPI;
let brainContext;
let localEngine;
let smartRouter;
let scheduler;
let brainMCP;
let brainKnowledge;
let brainAgent;
let claudeCodeAgent;
let pluginLoader;
let hookSystem;

const APP_NAME = 'Like One';
const APP_VERSION = '5.0.0-alpha';

function createWindow() {
  nativeTheme.themeSource = 'dark';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: APP_NAME,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(async () => {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: false,
      name: APP_NAME,
    });
  }

  try {
    // ============ INIT CORE ============
    brainContext = new BrainContext();
    // Store vault passphrase on first boot
    try {
      if (typeof brainContext.setVaultPassphrase === 'function' && !brainContext.store.get('vault_passphrase')) {
        brainContext.setVaultPassphrase('Angelica and Faye Across the Universe');
      }
    } catch {}
    await brainContext.initialize();
    brainAPI = new BrainAPI(brainContext);
    await brainAPI.restoreConversation();
    localEngine = new LocalEngine(brainContext, brainAPI);
    smartRouter = new SmartRouter(brainAPI);
    scheduler = new Scheduler(brainContext, brainAPI);

    // ============ INIT KNOWLEDGE BASE ============
    brainKnowledge = new BrainKnowledge(brainContext);
    await brainKnowledge.initialize();

    // ============ INIT MCP SERVER ============
    brainMCP = new BrainMCP(brainContext, brainAPI, localEngine, scheduler);

    // ============ INIT AGENT ============
    brainAgent = new BrainAgent(brainContext, brainAPI, localEngine, brainMCP, brainKnowledge);

    // ============ INIT CLAUDE CODE AGENT ============
    claudeCodeAgent = new ClaudeCodeAgent();
    // Set pending so divine cycle can lazy-init if async check is slow
    localEngine._pendingSDKAgent = claudeCodeAgent;
    claudeCodeAgent.isAvailable().then(ok => {
      console.log('[ClaudeCodeAgent]', ok ? '✅ SDK ready' : '⚠️ SDK not available');
      if (ok) localEngine.sdkAgent = claudeCodeAgent;
    }).catch(() => {});
    // Load brain context into flash cache (makes Ollama brain-aware)
    claudeCodeAgent.refreshBrainCache(brainContext).catch(() => {});
    // Refresh every 5 min
    setInterval(() => claudeCodeAgent.refreshBrainCache(brainContext).catch(() => {}), 300000);

    // ============ INIT PLUGINS ============
    pluginLoader = new PluginLoader();
    pluginLoader.loadAll();

    // ============ INIT HOOKS ============
    hookSystem = new HookSystem(brainContext);
    await hookSystem.loadFromBrain();

    // ============ WIRE REFERENCES ============
    localEngine.setScheduler(scheduler);
    localEngine.setBrainMCP(brainMCP);

    // Load Faye's deep context from brain
    await localEngine.loadDeepContext();
    localEngine.setKnowledge(brainKnowledge);
    localEngine.setAgent(brainAgent);

    scheduler.start(60000);

    brainAgent.onProgress((step) => {
      if (mainWindow) mainWindow.webContents.send('brain:agent-progress', step);
    });

    createWindow();

    // Wire mainWindow to localEngine for divine cycle UI progress events
    localEngine.setMainWindow(mainWindow);

    mainWindow.webContents.on('did-finish-load', async () => {
      // ============ BOOT SCAN — check ALL systems on startup ============
      const bootResults = await brainContext.bootScan();

      mainWindow.webContents.send('brain:boot-ready', {
        connected: true,
        version: APP_VERSION,
        bootResults,
      });

      // Start proactive brain loop after 5s
      setTimeout(() => startProactiveBrain(), 5000);

      // ============ ELECTRON MCP BRIDGE — gives Claude Code direct app control ============
      const bridge = new ElectronMCPBridge(mainWindow);
      bridge.start();

      // ============ AUTO-START DIVINE CYCLE (L6 — never stops) ============
      setTimeout(async () => {
        try {
          console.log('[Divine] Auto-starting L6 divine cycle...');
          const result = await localEngine.handleCommand('/divine', 'on 10000');
          console.log('[Divine] Started:', result.response?.slice(0, 80));
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('brain:divine-status', {
              active: true, phase: localEngine.divinePhase, cycle: localEngine.divineCycle,
            });
          }
        } catch (e) { console.error('[Divine] Auto-start failed:', e.message); }
      }, 8000);

      // Log boot to brain
      if (brainContext.supabase) {
        brainContext.supabase.from('brain_context').upsert({
          key: 'system.console_boot',
          value: JSON.stringify({
            version: APP_VERSION,
            timestamp: new Date().toISOString(),
            systems: bootResults,
          }),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' }).then(() => {}).catch(() => {});
      }
    });
  } catch (initError) {
    console.error('[Init Error]', initError);
    createWindow();
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('brain:boot-ready', { connected: false, error: initError.message });
    });
  }

  // ============ AUTO-ROUTING ============

  function autoRouteTarget(category) {
    // M4 handles parallel ops: social, deploys, testing, lighter renders
    const m4Categories = ['social', 'deploy', 'revenue'];
    if (m4Categories.includes(category)) return 'm4_mirror';
    // M3 handles heavy AI, code, studio, brain
    return 'm3_forge';
  }

  // ============ IPC HANDLERS ============

  ipcMain.handle('brain:send-message', async (event, message) => {
    try {
      const local = await localEngine.tryHandle(message);
      if (local.handled) {
        return { success: true, response: { text: local.response, provider: 'Local Engine', fromLocal: true } };
      }
      let augmentedMessage = message;
      if (brainKnowledge) {
        const ragContext = brainKnowledge.generateRAGContext(message, 600);
        if (ragContext) augmentedMessage = ragContext + '\n' + message;
      }
      const response = await brainAPI.sendMessage(augmentedMessage);
      if (brainKnowledge && response.text) {
        brainKnowledge.learnFromConversation(message, response.text, response.provider).catch(() => {});
      }
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('brain:stream-message', async (event, message) => {
    let originalProvider;
    try {
      console.log('[IPC] stream-message received:', message);

      const sdkReady = claudeCodeAgent && await claudeCodeAgent.isAvailable();

      // 1. Slash commands always go through local engine (zero tokens)
      // 2. When SDK is ready, ALL natural language goes to SDK — local intent matching disabled
      if (message.trim().startsWith('/')) {
        const local = await localEngine.tryHandle(message);
        if (local.handled) {
          const text = local.response || '';
          const chunkSize = 40;
          for (let i = 0; i < text.length; i += chunkSize) {
            mainWindow.webContents.send('brain:stream-chunk', text.slice(i, i + chunkSize));
            if (i + chunkSize < text.length) await new Promise(r => setTimeout(r, 15));
          }
          mainWindow.webContents.send('brain:stream-end', { provider: 'Faye (local)', fromLocal: true });
          return { success: true };
        }
      } else if (!sdkReady) {
        // SDK not available — fall back to local intent matching
        const local = await localEngine.tryHandle(message);
        if (local.handled) {
          const text = local.response || '';
          const chunkSize = 40;
          for (let i = 0; i < text.length; i += chunkSize) {
            mainWindow.webContents.send('brain:stream-chunk', text.slice(i, i + chunkSize));
            if (i + chunkSize < text.length) await new Promise(r => setTimeout(r, 15));
          }
          mainWindow.webContents.send('brain:stream-end', { provider: 'Faye (local)', fromLocal: true });
          return { success: true };
        }
      }

      // 2. Dual Engine — Flash (Ollama instant) + Deep (Claude SDK verify)
      if (sdkReady) {
        let ollamaUp = false;
        try {
          ollamaUp = await new Promise((resolve) => {
            const req = require('http').get('http://localhost:11434/api/tags', { timeout: 1500 }, (res) => {
              resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.on('timeout', () => { req.destroy(); resolve(false); });
          });
        } catch {}

        if (ollamaUp) {
          console.log('[IPC] DUAL ENGINE: Flash (Ollama) + Deep (Claude SDK)');
          const result = await claudeCodeAgent.dualEngine(message, mainWindow);
          return result;
        } else {
          console.log('[IPC] SDK only (Ollama offline)');
          const result = await claudeCodeAgent.streamQuery(message, mainWindow);
          return result;
        }
      }

      // 3. Fallback: legacy brainAPI path
      console.log('[IPC] Claude Code SDK unavailable, falling back to brainAPI...');
      const route = await smartRouter.route(message);

      if (!route.providerAvailable) {
        mainWindow.webContents.send('brain:stream-chunk',
          '**No AI provider available.**\n\n' +
          'Install Claude Code SDK or set up a local AI provider:\n\n' +
          '1. **Claude Code SDK** — `npm install @anthropic-ai/claude-agent-sdk`\n' +
          '2. **Ollama** — `ollama serve` then `ollama pull qwen2.5:32b`\n' +
          '3. **Groq** — Free key at console.groq.com\n\n' +
          '`/help` for zero-token commands.'
        );
        mainWindow.webContents.send('brain:stream-end', { provider: 'none' });
        return { success: true };
      }

      originalProvider = brainContext.getConfig().aiProvider;
      if (route.provider && route.provider !== originalProvider) {
        brainContext.updateConfig({ aiProvider: route.provider });
      }

      const providerInfo = brainAPI.getProviders()[route.provider] || {};
      let augmentedMessage = message;
      if (brainKnowledge) {
        const ragContext = brainKnowledge.generateRAGContext(message, 600);
        if (ragContext) augmentedMessage = ragContext + '\n' + message;
      }

      let fullResponse = '';
      let chunkCount = 0;
      console.log('[IPC] Starting brainAPI.streamMessage...');
      await brainAPI.streamMessage(augmentedMessage, (chunk) => {
        chunkCount++;
        fullResponse += chunk;
        if (chunkCount <= 3) console.log(`[IPC] Chunk #${chunkCount}:`, chunk.slice(0, 50));
        mainWindow.webContents.send('brain:stream-chunk', chunk);
      });
      console.log(`[IPC] Stream complete: ${chunkCount} chunks, ${fullResponse.length} chars`);

      if (brainKnowledge && fullResponse) {
        brainKnowledge.learnFromConversation(message, fullResponse, route.provider).catch(() => {});
      }

      mainWindow.webContents.send('brain:stream-end', {
        provider: providerInfo.name || route.provider,
        tier: route.tier,
        reason: route.reason,
        cost: providerInfo.cost || 0,
      });
      return { success: true };
    } catch (error) {
      mainWindow.webContents.send('brain:stream-error', error.message);
      return { success: false, error: error.message };
    } finally {
      if (originalProvider !== undefined) {
        const currentProvider = brainContext.getConfig().aiProvider;
        if (currentProvider !== originalProvider) {
          brainContext.updateConfig({ aiProvider: originalProvider });
        }
      }
    }
  });

  ipcMain.handle('brain:get-context', async () => {
    try { return { success: true, context: await brainContext.getFullContext() }; }
    catch (error) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('brain:get-status', async () => {
    try {
      const status = await brainContext.getSystemStatus();
      const budget = brainAPI.getBudget();
      const sdkReady = claudeCodeAgent ? await claudeCodeAgent.isAvailable() : false;
      const provider = sdkReady ? { name: 'Claude Code SDK' } : await brainAPI.detectBestProvider();
      return {
        success: true, status, budget,
        provider: provider?.name || 'None',
        sdkReady,
        knowledge: brainKnowledge?.getStats() || {},
        agent: brainAgent?.getStatus() || {},
        version: APP_VERSION,
      };
    } catch (error) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('brain:clear-conversation', () => {
    brainAPI.clearConversation();
    if (claudeCodeAgent) claudeCodeAgent.clearSession();
    return { success: true };
  });

  // Cancel active Claude Code SDK query
  ipcMain.handle('brain:cancel-query', () => {
    if (claudeCodeAgent) claudeCodeAgent.cancel();
    return { success: true };
  });
  ipcMain.handle('brain:get-config', () => brainContext.getConfig());

  ipcMain.handle('brain:update-config', async (event, config) => {
    brainContext.updateConfig(config);
    if (config.supabaseUrl || config.supabaseKey) {
      await brainContext.initialize();
      await brainKnowledge.initialize();
    }
    return { success: true };
  });

  ipcMain.handle('brain:get-scheduler-status', () => ({
    running: scheduler.running,
    recentExecutions: scheduler.getRecentExecutions(),
  }));

  ipcMain.handle('brain:check-providers', async () => {
    const sdkReady = claudeCodeAgent ? await claudeCodeAgent.isAvailable() : false;
    if (sdkReady) {
      return { detected: { name: 'Claude Code SDK', sdkReady: true }, ollama: false };
    }
    try {
      const detected = brainAPI ? await brainAPI.detectBestProvider() : null;
      return { detected, ollama: false };
    } catch { return { detected: null, ollama: false }; }
  });

  ipcMain.handle('brain:boot-scan', async () => await brainContext.bootScan());

  // Vault IPC — query brain_vault table
  ipcMain.handle('brain:vault-list', async () => {
    const sb = brainContext.supabase;
    if (!sb) return [];
    try {
      const { data } = await sb.from('brain_vault').select('service, description, hint, tier, updated_at').order('service');
      return (data || []).map(d => ({
        service: d.service,
        name: d.service,
        description: d.description || d.tier || '',
        masked: d.hint || '••••••••',
      }));
    } catch (e) { console.error('[Vault] List error:', e.message); return []; }
  });
  ipcMain.handle('brain:vault-get', async (event, service) => {
    const sb = brainContext.supabase;
    if (!sb) return null;
    try {
      const { data } = await sb.from('brain_vault').select('secret_encrypted, hint').eq('service', service).single();
      return data?.secret_encrypted || data?.hint || null;
    } catch (e) { return null; }
  });
  ipcMain.handle('brain:vault-field', async (event, service, field) => {
    const sb = brainContext.supabase;
    if (!sb) return null;
    try {
      const { data } = await sb.from('brain_vault').select('secret_encrypted').eq('service', service).single();
      const val = typeof data?.secret_encrypted === 'string' ? JSON.parse(data.secret_encrypted) : data?.secret_encrypted;
      return val?.[field] || null;
    } catch (e) { return null; }
  });
  ipcMain.handle('brain:vault-decrypt', async (event, service) => {
    try { return { success: true, data: await brainContext.decryptFromVault(service) }; }
    catch (error) { return { success: false, error: error.message }; }
  });

  // MCP IPC
  ipcMain.handle('brain:mcp-list-tools', () => brainMCP.listTools());
  ipcMain.handle('brain:mcp-call-tool', async (event, toolName, args) => {
    try { return { success: true, result: await brainMCP.handleIPC(toolName, args) }; }
    catch (error) { return { success: false, error: error.message }; }
  });

  // Knowledge Base IPC — unified cross-brain search
  ipcMain.handle('brain:kb-search', async (event, query, limit) => {
    const sb = brainContext.supabase;
    if (!sb) return brainKnowledge.search(query, limit || 10);
    const results = [];
    const q = query.toLowerCase();
    const max = limit || 20;

    // 1. brain_context — key-value pairs (primary knowledge)
    try {
      const { data } = await sb.from('brain_context')
        .select('key, description, category, value, priority, updated_at')
        .or(`key.ilike.%${q}%,description.ilike.%${q}%`)
        .order('priority', { ascending: false })
        .limit(max);
      if (data) {
        for (const r of data) {
          results.push({
            source: 'brain_context', key: r.key, topic: r.key,
            content: r.description || (typeof r.value === 'string' ? r.value.slice(0, 300) : JSON.stringify(r.value).slice(0, 300)),
            category: r.category, priority: r.priority, updated_at: r.updated_at,
          });
        }
      }
    } catch {}

    // 2. brain_episodes — activity log
    try {
      const { data } = await sb.from('brain_episodes')
        .select('id, event_type, summary, details, created_at')
        .or(`summary.ilike.%${q}%,event_type.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(Math.min(max, 10));
      if (data) {
        for (const r of data) {
          results.push({
            source: 'episodes', key: `episode.${r.id}`, topic: r.event_type,
            content: r.summary || r.details?.slice(0, 200) || '',
            category: 'episode', updated_at: r.created_at,
          });
        }
      }
    } catch {}

    // 3. brain_graph — relationships
    try {
      const { data } = await sb.from('brain_graph')
        .select('from_key, to_key, relationship, weight')
        .or(`from_key.ilike.%${q}%,to_key.ilike.%${q}%,relationship.ilike.%${q}%`)
        .order('weight', { ascending: false })
        .limit(Math.min(max, 10));
      if (data) {
        for (const r of data) {
          results.push({
            source: 'graph', key: `${r.from_key} → ${r.to_key}`,
            topic: r.relationship,
            content: `${r.from_key} —[${r.relationship}]→ ${r.to_key} (weight: ${r.weight})`,
            category: 'graph',
          });
        }
      }
    } catch {}

    // 4. brain_chunks — RAG semantic chunks
    try {
      const { data } = await sb.from('brain_chunks')
        .select('id, source_key, content, metadata')
        .ilike('content', `%${q}%`)
        .limit(Math.min(max, 10));
      if (data) {
        for (const r of data) {
          results.push({
            source: 'chunks', key: r.source_key || `chunk.${r.id}`,
            topic: r.source_key || 'RAG chunk',
            content: r.content?.slice(0, 300) || '',
            category: 'chunk',
          });
        }
      }
    } catch {}

    // 5. brain_archive — archived entries
    try {
      const { data } = await sb.from('brain_archive')
        .select('key, category, archive_reason, archived_at')
        .or(`key.ilike.%${q}%,archive_reason.ilike.%${q}%`)
        .limit(Math.min(max, 5));
      if (data) {
        for (const r of data) {
          results.push({
            source: 'archive', key: r.key, topic: r.key,
            content: r.archive_reason || 'Archived',
            category: 'archive', updated_at: r.archived_at,
          });
        }
      }
    } catch {}

    return results.slice(0, max);
  });

  ipcMain.handle('brain:kb-add', async (event, entry) => await brainKnowledge.add(entry));

  ipcMain.handle('brain:kb-stats', async () => {
    const sb = brainContext.supabase;
    if (!sb) return brainKnowledge.getStats();
    try {
      const [ctx, ep, graph, chunks, archive, skills] = await Promise.all([
        sb.from('brain_context').select('*', { count: 'exact', head: true }),
        sb.from('brain_episodes').select('*', { count: 'exact', head: true }),
        sb.from('brain_graph').select('*', { count: 'exact', head: true }),
        sb.from('brain_chunks').select('*', { count: 'exact', head: true }),
        sb.from('brain_archive').select('*', { count: 'exact', head: true }),
        sb.from('brain_skills').select('*', { count: 'exact', head: true }),
      ]);
      const categories = [
        { name: 'Context', count: ctx.count || 0, icon: '🧠' },
        { name: 'Episodes', count: ep.count || 0, icon: '📜' },
        { name: 'Graph', count: graph.count || 0, icon: '🕸️' },
        { name: 'RAG Chunks', count: chunks.count || 0, icon: '🔍' },
        { name: 'Archive', count: archive.count || 0, icon: '📦' },
        { name: 'Skills', count: skills.count || 0, icon: '⚡' },
      ];
      const total = categories.reduce((s, c) => s + c.count, 0);
      return { totalEntries: total, categories, recentlyAdded: 0 };
    } catch (e) { return brainKnowledge.getStats(); }
  });

  // Agent IPC
  ipcMain.handle('brain:agent-run', async (event, chain) => {
    try { return { success: true, result: await brainAgent.run(chain) }; }
    catch (error) { return { success: false, error: error.message }; }
  });
  ipcMain.handle('brain:agent-status', () => brainAgent.getStatus());

  // Divine Cycle IPC
  ipcMain.handle('brain:divine-status', () => ({
    active: localEngine.divineMode,
    phase: localEngine.divinePhase,
    cycle: localEngine.divineCycle,
    taskIndex: localEngine.divineTaskIndex,
    totalTasks: localEngine.divinePlan?.tasks?.length || 0,
    log: localEngine.divineLog.slice(-20),
  }));
  ipcMain.handle('brain:divine-toggle', async (event, on) => {
    const result = await localEngine.handleCommand('/divine', on ? 'on' : 'off');
    return { success: true, response: result.response };
  });

  // Brain write IPC
  ipcMain.handle('brain:write-entry', async (event, { key, value, description, category, priority }) => {
    try {
      if (!brainContext.supabase) return { success: false, error: 'Brain not connected' };
      const row = { key, value: typeof value === 'string' ? value : JSON.stringify(value), updated_at: new Date().toISOString() };
      if (description) row.description = description;
      if (category) row.category = category;
      if (priority) row.priority = priority;
      const { error } = await brainContext.supabase.from('brain_context').upsert(row, { onConflict: 'key' });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  // System Monitor IPC
  ipcMain.handle('brain:system-monitor', async () => {
    const run = (cmd) => { try { return execSync(cmd, { timeout: 5000, encoding: 'utf8' }); } catch { return ''; } };
    const result = { timestamp: Date.now() };

    // RAM
    try {
      const vmstat = run('vm_stat');
      const pageSize = 16384;
      const extract = (label) => {
        const m = vmstat.match(new RegExp(label + ':\\s+(\\d+)'));
        return m ? parseInt(m[1]) * pageSize : 0;
      };
      const free = extract('Pages free');
      const active = extract('Pages active');
      const inactive = extract('Pages inactive');
      const speculative = extract('Pages speculative');
      const wired = extract('Pages wired down');
      const compressed = extract('Pages occupied by compressor');
      const used = active + wired + compressed;
      const total = 64 * 1024 * 1024 * 1024; // 64GB
      result.ram = {
        totalGB: 64,
        usedGB: +(used / (1024 ** 3)).toFixed(1),
        freeGB: +((total - used) / (1024 ** 3)).toFixed(1),
        activeGB: +(active / (1024 ** 3)).toFixed(1),
        wiredGB: +(wired / (1024 ** 3)).toFixed(1),
        compressedGB: +(compressed / (1024 ** 3)).toFixed(1),
        pressure: Math.round((used / total) * 100),
      };
    } catch { result.ram = null; }

    // Swap
    try {
      const swap = run('sysctl vm.swapusage');
      const m = swap.match(/used = ([\d.]+)M/);
      const t = swap.match(/total = ([\d.]+)M/);
      result.swap = { usedMB: m ? parseFloat(m[1]) : 0, totalMB: t ? parseFloat(t[1]) : 0 };
    } catch { result.swap = null; }

    // Top processes by RAM (macOS ps syntax)
    try {
      const ps = run('ps -eo pid,%cpu,%mem,rss,comm -r | head -11');
      result.topRAM = ps.split('\n').slice(1).filter(l => l.trim()).map(line => {
        const parts = line.trim().split(/\s+/);
        return { pid: parts[0], cpu: parseFloat(parts[1]), mem: parseFloat(parts[2]), rss: parts[3], command: parts.slice(4).join(' ').slice(0, 60) };
      });
    } catch { result.topRAM = []; }

    // Top processes by CPU (macOS ps syntax)
    try {
      const ps = run('ps -eo pid,%cpu,%mem,rss,comm -r | head -11');
      result.topCPU = ps.split('\n').slice(1).filter(l => l.trim()).sort((a, b) => {
        return parseFloat(b.trim().split(/\s+/)[1]) - parseFloat(a.trim().split(/\s+/)[1]);
      }).map(line => {
        const parts = line.trim().split(/\s+/);
        return { pid: parts[0], cpu: parseFloat(parts[1]), mem: parseFloat(parts[2]), rss: parts[3], command: parts.slice(4).join(' ').slice(0, 60) };
      });
    } catch { result.topCPU = []; }

    // Ollama models
    try {
      const ollamaPs = run('curl -s http://localhost:11434/api/ps 2>/dev/null');
      if (ollamaPs) {
        const parsed = JSON.parse(ollamaPs);
        result.ollamaModels = (parsed.models || []).map(m => ({
          name: m.name, size: m.size, sizeGB: +(m.size / (1024 ** 3)).toFixed(1),
          digest: m.digest?.slice(0, 12), expires: m.expires_at,
        }));
      } else { result.ollamaModels = []; }
    } catch { result.ollamaModels = null; }

    // CPU info
    try {
      result.cpuCores = parseInt(run('sysctl -n hw.ncpu')) || 0;
      result.cpuBrand = run('sysctl -n machdep.cpu.brand_string').trim();
    } catch {}

    return result;
  });

  ipcMain.handle('brain:kill-process', async (event, pid) => {
    try {
      execSync(`kill -9 ${parseInt(pid)}`, { timeout: 3000 });
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('brain:ollama-unload', async (event, model) => {
    try {
      if (!/^[a-zA-Z0-9._:/-]+$/.test(model)) return { success: false, error: 'Invalid model name' };
      const payload = JSON.stringify({ model, keep_alive: 0 });
      const { execSync: exec } = require('child_process');
      exec(`curl -s -X POST http://localhost:11434/api/generate -d ${JSON.stringify(payload)}`, { timeout: 5000 });
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  // Skills IPC — query brain_skills table
  ipcMain.handle('brain:skills-list', async () => {
    if (!brainContext.supabase) return [];
    const { data } = await brainContext.supabase
      .from('brain_skills').select('*').eq('active', true).order('use_count', { ascending: false });
    return data || [];
  });

  // ============ ORCHESTRATION IPC ============
  ipcMain.handle('brain:get-orchestration', async () => {
    const result = { agents: [], tasks: [], stats: {} };
    const sb = brainContext.supabase;
    if (!sb) return result;

    try {
      // Get agent registry from brain
      const { data: registryData } = await sb.from('brain_context')
        .select('value').eq('key', 'system.agent_registry').single();
      if (registryData?.value) {
        const registry = typeof registryData.value === 'string' ? JSON.parse(registryData.value) : registryData.value;
        result.agents = registry.agents || [];
      }

      // Get active tasks from task_dispatch table (real fleet dispatch)
      const { data: taskData } = await sb.from('task_dispatch')
        .select('*')
        .in('status', ['pending', 'assigned', 'claimed', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (taskData?.length) {
        result.tasks = taskData.map(t => ({
          ...t,
          target: t.assigned_to,
        }));
      }

      // Also count completed/failed for stats
      const { count: completedCount } = await sb.from('task_dispatch')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      const { count: failedCount } = await sb.from('task_dispatch')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');
      result.stats.completed = completedCount || 0;
      result.stats.failed = failedCount || 0;

      // Get last dispatch time
      const { data: lastTask } = await sb.from('task_dispatch')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (lastTask) result.stats.lastDispatch = lastTask.created_at;

      // Get orchestration stats
      const { data: statsData } = await sb.from('brain_context')
        .select('value').eq('key', 'system.orchestration_stats').single();
      if (statsData?.value) {
        result.stats = typeof statsData.value === 'string' ? JSON.parse(statsData.value) : statsData.value;
      }
    } catch (e) { console.error('[Orchestration] Error:', e.message); }

    return result;
  });

  ipcMain.handle('brain:dispatch-task', async (event, title, target) => {
    const sb = brainContext.supabase;
    if (!sb) return { success: false, error: 'Brain not connected' };

    // Auto-detect category from title keywords
    const titleLower = title.toLowerCase();
    const category = titleLower.match(/video|render|studio/) ? 'studio'
      : titleLower.match(/deploy|vercel|ship/) ? 'deploy'
      : titleLower.match(/social|post|tweet/) ? 'social'
      : titleLower.match(/test|smoke|verify/) ? 'test'
      : titleLower.match(/stripe|revenue|payment/) ? 'revenue'
      : titleLower.match(/brain|embed|context/) ? 'brain'
      : 'general';

    const resolvedTarget = target === 'auto' ? autoRouteTarget(category) : target;

    // Build context boost payload
    let payload = {};
    try {
      const contextKeys = ['session.active_work', 'session.next_steps', 'session.divine_plan'];
      const { data: contextData } = await sb.from('brain_context')
        .select('key, value')
        .in('key', contextKeys);
      if (contextData?.length) {
        payload.context_boost = {};
        contextData.forEach(c => {
          payload.context_boost[c.key] = typeof c.value === 'string' ? c.value.slice(0, 500) : JSON.stringify(c.value).slice(0, 500);
        });
      }
    } catch {} // Context boost is best-effort

    // Write to real task_dispatch table (same as mac_fleet_dispatch MCP)
    try {
      const { data, error } = await sb.from('task_dispatch').insert({
        title,
        description: `Dispatched from Faye Console`,
        assigned_to: resolvedTarget,
        created_by: 'm3_forge',
        status: resolvedTarget ? 'assigned' : 'pending',
        priority: 5,
        category,
        payload,
      }).select('id').single();

      if (error) throw error;
      return { success: true, taskId: data.id, target: resolvedTarget, category };
    } catch (e) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('brain:dispatch-pattern', async (event, pattern) => {
    const sb = brainContext.supabase;
    if (!sb) return { success: false, error: 'Brain not connected' };

    try {
      await sb.from('brain_context').upsert({
        key: 'system.orchestration_stats',
        value: JSON.stringify({
          activePattern: pattern,
          activatedAt: new Date().toISOString(),
          activatedBy: 'm3_forge',
        }),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  // ============ INTEGRATIONS IPC ============
  ipcMain.handle('brain:get-integrations', async () => {
    const result = { stripe: {}, vercel: {}, supabase: {}, fleet: {} };
    const sb = brainContext.supabase;
    const run = (cmd) => { try { return execSync(cmd, { timeout: 8000, encoding: 'utf8' }); } catch { return ''; } };

    // Stripe — read from brain revenue alerts
    if (sb) {
      try {
        const { data } = await sb.from('brain_context')
          .select('value')
          .like('key', 'revenue.daily_alert%')
          .order('updated_at', { ascending: false })
          .limit(1);
        if (data?.[0]?.value) {
          const rev = typeof data[0].value === 'string' ? JSON.parse(data[0].value) : data[0].value;
          result.stripe = {
            connected: true,
            mrr: rev.mrr || 0,
            customers: rev.total_customers || rev.customers || 0,
            lastPayment: rev.last_payment || rev.date || 'Unknown',
            balance: rev.balance || 0,
          };
        }
      } catch {}
    }

    // Also try live Stripe CLI
    try {
      const stripeOut = run('~/bin/stripe-dashboard revenue 2>/dev/null');
      if (stripeOut) {
        const mrrMatch = stripeOut.match(/MRR[:\s]*\$?([\d.]+)/i);
        const custMatch = stripeOut.match(/(\d+)\s*customer/i);
        if (mrrMatch) result.stripe.mrr = parseFloat(mrrMatch[1]);
        if (custMatch) result.stripe.customers = parseInt(custMatch[1]);
        result.stripe.connected = true;
      }
    } catch {}

    // Vercel — git status
    try {
      const branch = run('cd ~/lyra-app && git branch --show-current').trim();
      const uncommitted = parseInt(run('cd ~/lyra-app && git status --porcelain | wc -l').trim()) || 0;
      const lastCommit = run('cd ~/lyra-app && git log -1 --format="%cr"').trim();
      result.vercel = { connected: true, branch, uncommitted, lastDeploy: lastCommit, status: 'Auto-deploy on push' };
    } catch {}

    // Supabase — connection health
    if (sb) {
      try {
        const { data, error } = await sb.from('brain_context').select('key, updated_at').order('updated_at', { ascending: false }).limit(1);
        result.supabase = {
          connected: !error,
          brainEntries: Object.keys(brainContext.contextCache || {}).length,
          lastUpdate: data?.[0]?.updated_at ? new Date(data[0].updated_at).toLocaleString() : 'Unknown',
          plan: 'Teams',
          brainCount: 4,
        };
      } catch { result.supabase = { connected: false }; }
    }

    // Fleet — read heartbeats
    if (sb) {
      try {
        const { data } = await sb.from('brain_context')
          .select('key, value, updated_at')
          .in('key', ['computers.m3_forge_heartbeat', 'computers.m4_mirror_heartbeat', 'computers.gcp_watcher_heartbeat']);
        const heartbeats = {};
        (data || []).forEach(h => {
          const age = (Date.now() - new Date(h.updated_at).getTime()) / 60000;
          heartbeats[h.key] = age < 10 ? 'Online' : age < 60 ? `${Math.floor(age)}m ago` : 'Offline';
        });
        result.fleet = {
          healthy: true,
          m3: heartbeats['computers.m3_forge_heartbeat'] || 'Online',
          m4: heartbeats['computers.m4_mirror_heartbeat'] || 'Unknown',
          gcp: heartbeats['computers.gcp_watcher_heartbeat'] || 'Unknown',
          activeTasks: 0,
        };
      } catch {}
    }

    return result;
  });

  // ============ PLUGIN IPC ============
  ipcMain.handle('brain:plugins-list', () => pluginLoader ? pluginLoader.listCommands() : []);
  ipcMain.handle('brain:plugins-reload', () => {
    if (pluginLoader) return pluginLoader.loadAll();
    return { commands: 0, agents: 0, skills: 0 };
  });
  ipcMain.handle('brain:plugin-command', (event, trigger) => {
    if (!pluginLoader) return null;
    return pluginLoader.getCommand(trigger);
  });

  // ============ IDE: FILE SYSTEM IPC ============

  ipcMain.handle('ide:fs-readdir', async (event, dirPath) => {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      return entries.map(e => ({
        name: e.name,
        path: path.join(dirPath, e.name),
        isDirectory: e.isDirectory(),
        isFile: e.isFile(),
      })).sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    } catch (e) { return []; }
  });

  ipcMain.handle('ide:fs-readfile', async (event, filePath) => {
    try {
      const stat = await fs.promises.stat(filePath);
      if (stat.size > 5 * 1024 * 1024) return { error: 'File too large (>5MB)' };
      const content = await fs.promises.readFile(filePath, 'utf8');
      return { content, size: stat.size, modified: stat.mtimeMs };
    } catch (e) { return { error: e.message }; }
  });

  ipcMain.handle('ide:fs-writefile', async (event, filePath, content) => {
    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('ide:fs-stat', async (event, filePath) => {
    try {
      const stat = await fs.promises.stat(filePath);
      return { size: stat.size, modified: stat.mtimeMs, isDirectory: stat.isDirectory(), isFile: stat.isFile() };
    } catch (e) { return null; }
  });

  ipcMain.handle('ide:fs-exists', async (event, filePath) => {
    try { await fs.promises.access(filePath); return true; } catch { return false; }
  });

  if (!global.fsWatchers) global.fsWatchers = new Map();
  const fsWatchers = global.fsWatchers;
  ipcMain.handle('ide:fs-watch', async (event, dirPath) => {
    if (fsWatchers.has(dirPath)) return { watching: true };
    try {
      const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('ide:fs-changed', { dir: dirPath, event: eventType, file: filename });
        }
      });
      fsWatchers.set(dirPath, watcher);
      return { watching: true };
    } catch (e) { return { watching: false, error: e.message }; }
  });

  // ============ IDE: TERMINAL IPC ============

  terminalManager = new TerminalManager();

  ipcMain.handle('ide:term-create', (event, id, shell) => {
    try {
      const proc = terminalManager.create(id, shell);
      proc.onData((data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('ide:term-data', id, data);
        }
      });
      proc.onExit(({ exitCode }) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('ide:term-exit', id, exitCode);
        }
        terminalManager.terminals.delete(id);
      });
      return { success: true, id };
    } catch (e) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('ide:term-write', (event, id, data) => {
    terminalManager.write(id, data);
    return { success: true };
  });

  ipcMain.handle('ide:term-resize', (event, id, cols, rows) => {
    terminalManager.resize(id, cols, rows);
    return { success: true };
  });

  ipcMain.handle('ide:term-kill', (event, id) => {
    terminalManager.kill(id);
    return { success: true };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (terminalManager) terminalManager.killAll();
  for (const [, watcher] of global.fsWatchers || new Map()) watcher.close();
});

// ============ PROACTIVE BRAIN ============
let proactiveInterval = null;

function startProactiveBrain() {
  if (proactiveInterval) return;
  console.log('[ProactiveBrain] Starting — cycle every 5 minutes');
  proactiveCycle();
  proactiveInterval = setInterval(proactiveCycle, 5 * 60 * 1000);
}

async function proactiveCycle() {
  if (!brainContext || !mainWindow || mainWindow.isDestroyed()) return;

  try {
    const insights = [];
    const actions = [];
    const sb = brainContext.supabase;

    // 1. Pending actions
    if (sb) {
      try {
        const { data: pending } = await sb.from('brain_actions')
          .select('id, action_type, target, priority')
          .eq('status', 'pending')
          .order('priority')
          .limit(5);
        if (pending?.length) {
          insights.push({ type: 'actions', priority: 'high', title: `${pending.length} pending action${pending.length > 1 ? 's' : ''}`, detail: pending.map(a => `${a.action_type} → ${a.target}`).join(', ') });
        }
      } catch {}
    }

    // 2. Budget check
    if (brainAPI) {
      const budget = brainAPI.getBudget();
      if (budget?.limit > 0) {
        const pct = (budget.tokensUsed / budget.limit) * 100;
        if (pct > 90) insights.push({ type: 'budget', priority: 'high', title: `Token budget at ${Math.round(pct)}%`, detail: 'Consider reducing query complexity' });
      }
    }

    // 3. Ollama health
    // Ollama check removed — Claude Code SDK is primary provider

    // 4. Self-heal
    if (sb) {
      try { await sb.from('brain_context').select('key').limit(1); }
      catch { actions.push('supabase_reconnect'); try { await brainContext.initialize(); actions.push('supabase_reconnected'); } catch {} }
    }
    if (scheduler && !scheduler.running) { scheduler.start(60000); actions.push('scheduler_restarted'); }

    // 5. Context freshness
    if (sb && brainContext.lastContextLoad) {
      if (Date.now() - brainContext.lastContextLoad.getTime() > 15 * 60 * 1000) {
        await brainContext.loadContext();
        actions.push('context_refreshed');
      }
    }

    // 6. Log + send
    if (sb && (insights.length || actions.length)) {
      sb.from('brain_context').upsert({
        key: 'system.proactive_log',
        value: JSON.stringify({ timestamp: new Date().toISOString(), insights_count: insights.length, actions_taken: actions, insights: insights.slice(0, 10) }),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' }).then(() => {}).catch(() => {});
    }

    if (insights.length > 0 || actions.length > 0) {
      mainWindow.webContents.send('brain:proactive-insight', { timestamp: new Date().toISOString(), insights, actions });
    }
  } catch (e) {
    console.error('[ProactiveBrain] Cycle error:', e.message);
  }
}
