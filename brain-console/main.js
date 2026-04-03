const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const { BrainAPI } = require('./brain-api');
const { BrainContext } = require('./brain-context');
const { LocalEngine } = require('./local-engine');
const { SmartRouter } = require('./smart-router');
const { Scheduler } = require('./scheduler');
const { BrainMCP } = require('./brain-mcp');
const { BrainKnowledge } = require('./brain-knowledge');
const { BrainAgent } = require('./brain-agent');

let mainWindow;
let brainAPI;
let brainContext;
let localEngine;
let smartRouter;
let scheduler;
let brainMCP;
let brainKnowledge;
let brainAgent;

const APP_NAME = 'Faye';
const APP_VERSION = '4.0.0';

function createWindow() {
  nativeTheme.themeSource = 'dark';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
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
    // Store vault passphrase on first boot (Faye provided it)
    if (!brainContext.store.get('vault_passphrase')) {
      brainContext.setVaultPassphrase('Angelica and Faye Across the Universe');
    }
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

      // ============ AUTO-WARM Ollama primary model ============
      try {
        const config = brainContext.getConfig();
        const model = config.ollamaModel || 'qwen2.5:32b';
        fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt: 'ping', stream: false, options: { num_predict: 1 } }),
        }).catch(() => {});
        console.log(`[Boot] Warming Ollama: ${model}`);
      } catch {}

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
      const local = await localEngine.tryHandle(message);
      console.log('[IPC] tryHandle result:', local.handled);
      if (local.handled) {
        // Stream the response in chunks for natural feel
        const text = local.response || '';
        const chunkSize = 40; // ~40 chars per chunk for smooth streaming
        for (let i = 0; i < text.length; i += chunkSize) {
          mainWindow.webContents.send('brain:stream-chunk', text.slice(i, i + chunkSize));
          if (i + chunkSize < text.length) await new Promise(r => setTimeout(r, 15)); // 15ms between chunks
        }
        mainWindow.webContents.send('brain:stream-end', { provider: 'Faye (local)', fromLocal: true });
        return { success: true };
      }

      const route = await smartRouter.route(message);

      if (!route.providerAvailable) {
        mainWindow.webContents.send('brain:stream-chunk',
          '**No AI provider available.**\n\n' +
          'Faye works best with local AI:\n\n' +
          '1. **Ollama** — `ollama serve` then `ollama pull qwen2.5:32b`\n' +
          '2. **Groq** — Free key at console.groq.com\n' +
          '3. **OpenRouter** — openrouter.ai\n' +
          '4. **Anthropic** — console.anthropic.com\n\n' +
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
      const provider = await brainAPI.detectBestProvider();
      return {
        success: true, status, budget,
        provider: provider?.name || 'None',
        knowledge: brainKnowledge?.getStats() || {},
        agent: brainAgent?.getStatus() || {},
        version: APP_VERSION,
      };
    } catch (error) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('brain:clear-conversation', () => { brainAPI.clearConversation(); return { success: true }; });
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
    const detected = await brainAPI.detectBestProvider();
    const ollama = await brainAPI.checkOllama();
    return { detected, ollama };
  });

  ipcMain.handle('brain:boot-scan', async () => await brainContext.bootScan());

  // Vault IPC — brain IS the vault
  ipcMain.handle('brain:vault-list', () => brainContext.listCredentials());
  ipcMain.handle('brain:vault-get', async (event, service) => brainContext.getCredential(service));
  ipcMain.handle('brain:vault-field', async (event, service, field) => brainContext.getCredentialField(service, field));
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

  // Knowledge Base IPC
  ipcMain.handle('brain:kb-search', async (event, query, limit) => brainKnowledge.search(query, limit || 10));
  ipcMain.handle('brain:kb-add', async (event, entry) => await brainKnowledge.add(entry));
  ipcMain.handle('brain:kb-stats', () => brainKnowledge.getStats());

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

  // Skills IPC — query brain_skills table
  ipcMain.handle('brain:skills-list', async () => {
    if (!brainContext.supabase) return [];
    const { data } = await brainContext.supabase
      .from('brain_skills').select('*').eq('active', true).order('use_count', { ascending: false });
    return data || [];
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
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
        if (pct > 90) insights.push({ type: 'budget', priority: 'high', title: `Token budget at ${Math.round(pct)}%`, detail: 'Switch to Ollama for remaining tasks' });
      }
    }

    // 3. Ollama health
    try {
      const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) });
      if (!res.ok) insights.push({ type: 'system', priority: 'high', title: 'Ollama DOWN', detail: 'Run: ollama serve' });
    } catch {
      insights.push({ type: 'system', priority: 'high', title: 'Ollama unreachable', detail: 'Local AI offline' });
    }

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
