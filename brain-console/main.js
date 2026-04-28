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
// SmartRouter removed — divine plan v4 (SDK/sovereign agent handles routing)
const { Scheduler } = require('./scheduler');
const { BrainMCP } = require('./brain-mcp');
const { BrainKnowledge } = require('./brain-knowledge');
const { generateTOS } = require('./consulting-tos');
const { BrainAgent } = require('./brain-agent');
const { ClaudeCodeAgent } = require('./claude-code-agent');
const { FayeAgent } = require('./faye-agent');
const { ElectronMCPBridge } = require('./electron-mcp-bridge');
const { PluginLoader } = require('./plugin-loader');
const { HookSystem } = require('./hook-system');
const { TaskWorker } = require('./task-worker');

let mainWindow;
let terminalManager;
let brainAPI;
let brainContext;
let localEngine;
let scheduler;
let brainMCP;
let brainKnowledge;
let brainAgent;
let claudeCodeAgent;
let fayeAgent;
let pluginLoader;
let hookSystem;
let taskWorker;

const APP_NAME = 'Like One';
const APP_VERSION = '6.0.0';

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
    scheduler = new Scheduler(brainContext, brainAPI);

    // ============ INIT KNOWLEDGE BASE ============
    brainKnowledge = new BrainKnowledge(brainContext);
    await brainKnowledge.initialize();

    // ============ INIT MCP SERVER ============
    brainMCP = new BrainMCP(brainContext, brainAPI, localEngine, scheduler);

    // ============ INIT SOVEREIGN AGENT ============
    fayeAgent = new FayeAgent(brainMCP, brainContext);
    fayeAgent.refreshBrainCache().catch(() => {});
    // Connect fractal-mac-link MCP tools (async, non-blocking)
    fayeAgent.connectFractal().then(ok => {
      console.log('[FayeAgent]', ok ? `✅ Sovereign agent: ${fayeAgent.tools.length} tools (fractal connected)` : `⚠️ Sovereign agent: ${fayeAgent.tools.length} tools (fractal offline)`);
    }).catch(() => {});
    console.log('[FayeAgent] ✅ Sovereign agent initialized with', fayeAgent.tools.length, 'base tools');
    localEngine.setSovereignAgent(fayeAgent);

    // ============ INIT AGENT ============
    brainAgent = new BrainAgent(brainContext, brainAPI, localEngine, brainMCP, brainKnowledge);

    // ============ INIT CLAUDE CODE AGENT ============
    claudeCodeAgent = new ClaudeCodeAgent();
    localEngine._pendingSDKAgent = claudeCodeAgent;
    claudeCodeAgent.isAvailable().then(ok => {
      console.log('[ClaudeCodeAgent]', ok ? '✅ SDK ready (Claude CLI authenticated)' : '⚠️ SDK not available — Ollama fallback');
      if (ok) localEngine.sdkAgent = claudeCodeAgent;
    }).catch(() => {});
    // Brain cache — local SQLite, refreshed every 5 min
    claudeCodeAgent.refreshBrainCache(brainContext).catch(() => {});
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

    // ============ INIT TASK WORKER — claims from task_dispatch ============
    taskWorker = new TaskWorker(brainContext, localEngine);
    taskWorker.start(30000); // poll every 30s

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

      // Log boot to brain (sovereign SQLite)
      try {
        brainContext.localBrain.upsertContext('system.console_boot', {
          version: APP_VERSION,
          timestamp: new Date().toISOString(),
          systems: bootResults,
        });
      } catch {}
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
    try {
      console.log('[IPC] stream-message:', message.slice(0, 80));

      // Helper: stream local response to renderer
      const streamLocal = async (text) => {
        const chunkSize = 40;
        for (let i = 0; i < text.length; i += chunkSize) {
          mainWindow.webContents.send('brain:stream-chunk', text.slice(i, i + chunkSize));
          if (i + chunkSize < text.length) await new Promise(r => setTimeout(r, 15));
        }
        mainWindow.webContents.send('brain:stream-end', { provider: 'Faye (local)', fromLocal: true });
        return { success: true };
      };

      // 1. Slash commands → local engine (zero tokens)
      if (message.trim().startsWith('/')) {
        const local = await localEngine.tryHandle(message);
        if (local.handled) return streamLocal(local.response || '');
      }

      // 2. Claude Agent SDK — primary engine
      const sdkReady = claudeCodeAgent && await claudeCodeAgent.isAvailable();
      if (sdkReady) {
        console.log('[IPC] Claude Agent SDK');
        return await claudeCodeAgent.streamQuery(message, mainWindow);
      }

      // 3. Sovereign Agent — Ollama with tool calling (zero-cost fallback)
      if (fayeAgent) {
        const ollamaStatus = await fayeAgent.isAvailable();
        if (ollamaStatus.available) {
          console.log('[IPC] Sovereign Agent (Ollama):', fayeAgent.tools.length, 'tools');
          return await fayeAgent.run(message, mainWindow);
        }
      }

      // 4. Local intent matching (no AI needed)
      const local = await localEngine.tryHandle(message);
      if (local.handled) return streamLocal(local.response || '');

      // 5. Nothing available
      mainWindow.webContents.send('brain:stream-chunk',
        '**No AI provider available.**\n\n' +
        '1. **Claude Agent SDK** — `claude auth login` (primary)\n' +
        '2. **Ollama** — `ollama serve` then `ollama pull qwen3:14b`\n\n' +
        '`/help` for zero-token commands.'
      );
      mainWindow.webContents.send('brain:stream-end', { provider: 'none' });
      return { success: true };
    } catch (error) {
      mainWindow.webContents.send('brain:stream-error', error.message);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('brain:get-context', async () => {
    try {
      // Return ALL entries for Brain Explorer (not just boot keys)
      const entries = brainContext.getAllEntries();
      return { success: true, context: entries };
    } catch (error) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('brain:get-status', async () => {
    try {
      const status = await brainContext.getSystemStatus();
      const sdkReady = claudeCodeAgent ? await claudeCodeAgent.isAvailable() : false;
      return {
        success: true, status,
        provider: sdkReady ? 'Claude Code SDK' : (fayeAgent ? 'Sovereign (Ollama)' : 'None'),
        sdkReady,
        sovereign: fayeAgent?.getStatus() || {},
        knowledge: brainKnowledge?.getStats() || {},
        agent: brainAgent?.getStatus() || {},
        taskWorker: taskWorker?.getStatus() || {},
        version: APP_VERSION,
      };
    } catch (error) { return { success: false, error: error.message }; }
  });

  ipcMain.handle('brain:clear-conversation', () => {
    brainAPI.clearConversation();
    if (claudeCodeAgent) claudeCodeAgent.clearSession();
    if (fayeAgent) fayeAgent.clearHistory();
    return { success: true };
  });

  // Cancel active Claude Code SDK query
  ipcMain.handle('brain:cancel-query', () => {
    if (claudeCodeAgent) claudeCodeAgent.cancel();
    if (fayeAgent) fayeAgent.cancel();
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
    const sovereignUp = fayeAgent ? (await fayeAgent.isAvailable()).available : false;
    return {
      detected: sdkReady ? { name: 'Claude Code SDK', sdkReady: true } : sovereignUp ? { name: 'Sovereign (Ollama)', sdkReady: false } : null,
      ollama: sovereignUp,
    };
  });

  ipcMain.handle('brain:boot-scan', async () => await brainContext.bootScan());

  // Vault IPC — sovereign SQLite vault
  ipcMain.handle('brain:vault-list', async () => {
    try { return brainContext.localBrain.vaultList(); }
    catch (e) { console.error('[Vault] List error:', e.message); return []; }
  });
  ipcMain.handle('brain:vault-get', async (event, service) => {
    try { return brainContext.localBrain.vaultGet(service); }
    catch (e) { return null; }
  });
  ipcMain.handle('brain:vault-field', async (event, service, field) => {
    try {
      const raw = brainContext.localBrain.vaultGet(service);
      if (!raw) return null;
      const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
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

  // Knowledge Base IPC — sovereign SQLite cross-table search
  ipcMain.handle('brain:kb-search', async (event, query, limit) => {
    try {
      return brainContext.localBrain.kbSearch(query, limit || 20);
    } catch (e) {
      return brainKnowledge ? brainKnowledge.search(query, limit || 10) : [];
    }
  });

  ipcMain.handle('brain:kb-add', async (event, entry) => await brainKnowledge.add(entry));

  ipcMain.handle('brain:kb-stats', async () => {
    try {
      return brainContext.localBrain.kbStats();
    } catch (e) { return brainKnowledge ? brainKnowledge.getStats() : { totalEntries: 0, categories: [] }; }
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

  // Brain write IPC — sovereign SQLite
  ipcMain.handle('brain:write-entry', async (event, { key, value, description, category, priority }) => {
    try {
      return brainContext.localBrain.upsertContext(key, value, description, category, priority);
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

  // Skills IPC — local
  ipcMain.handle('brain:skills-list', async () => {
    try {
      return brainContext.localBrain.db.prepare("SELECT * FROM brain_skills WHERE active = 1 ORDER BY use_count DESC").all();
    } catch { return []; }
  });

  // ============ ORCHESTRATION IPC — sovereign SQLite ============
  ipcMain.handle('brain:get-orchestration', async () => {
    const result = { agents: [], tasks: [], stats: {} };
    const lb = brainContext.localBrain;

    try {
      // Agent registry from brain_context
      const registry = lb.getContextByKey('system.agent_registry');
      if (registry) result.agents = registry.agents || [];

      // Active tasks from task_dispatch
      result.tasks = lb.getActiveTasks(20).map(t => ({ ...t, target: t.assigned_to }));

      // Stats
      const taskStats = lb.getTaskStats();
      result.stats = { ...taskStats };

      // Orchestration pattern from brain_context
      const orchStats = lb.getContextByKey('system.orchestration_stats');
      if (orchStats) result.stats = { ...result.stats, ...orchStats };
    } catch (e) { console.error('[Orchestration] Error:', e.message); }

    return result;
  });

  ipcMain.handle('brain:dispatch-task', async (event, title, target) => {
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

    try {
      return brainContext.localBrain.dispatchTask(title, resolvedTarget, category);
    } catch (e) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('brain:dispatch-pattern', async (event, pattern) => {
    try {
      brainContext.localBrain.upsertContext('system.orchestration_stats', {
        activePattern: pattern,
        activatedAt: new Date().toISOString(),
        activatedBy: 'm3_forge',
      });
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  });

  // ============ INTEGRATIONS IPC — sovereign SQLite + live CLI ============
  ipcMain.handle('brain:get-integrations', async () => {
    const result = { stripe: {}, vercel: {}, brain: {}, fleet: {} };
    const lb = brainContext.localBrain;
    const run = (cmd) => { try { return execSync(cmd, { timeout: 8000, encoding: 'utf8' }); } catch { return ''; } };

    // Stripe — brain context first, then live CLI
    try {
      const rows = lb.db.prepare("SELECT value FROM brain_context WHERE key LIKE 'revenue.daily_alert%' ORDER BY updated_at DESC LIMIT 1").all();
      if (rows[0]?.value) {
        const rev = JSON.parse(rows[0].value);
        result.stripe = { connected: true, mrr: rev.mrr || 0, customers: rev.total_customers || rev.customers || 0, lastPayment: rev.last_payment || rev.date || 'Unknown', balance: rev.balance || 0 };
      }
    } catch {}

    // Live Stripe CLI override
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

    // Brain — local SQLite health
    try {
      const count = lb.contextCount();
      const lastRow = lb.db.prepare('SELECT updated_at FROM brain_context ORDER BY updated_at DESC LIMIT 1').get();
      result.brain = {
        connected: true,
        brainEntries: count,
        lastUpdate: lastRow?.updated_at ? new Date(lastRow.updated_at).toLocaleString() : 'Unknown',
        plan: 'Sovereign (SQLite)',
        backend: 'local_brain.db',
      };
    } catch { result.brain = { connected: false }; }

    // Fleet — heartbeats from SQLite
    try {
      const heartbeats = lb.getHeartbeats();
      const hbMap = {};
      for (const h of heartbeats) {
        const age = h.last_heartbeat ? (Date.now() - new Date(h.last_heartbeat).getTime()) / 60000 : Infinity;
        hbMap[h.machine_id] = age < 10 ? 'Online' : age < 60 ? `${Math.floor(age)}m ago` : 'Offline';
      }
      const activeTasks = lb.getActiveTasks(100).length;
      result.fleet = {
        healthy: true,
        m3: hbMap['m3_forge'] || 'Online',
        m4: hbMap['m4_mirror'] || 'Unknown',
        gcp: hbMap['gcp_watcher'] || 'Unknown',
        activeTasks,
      };
    } catch {}

    return result;
  });

  // ============ CONSULTING IPC ============
  ipcMain.handle('consulting:generate-tos', async (event, clientName, deviceType) => {
    try {
      const tos = generateTOS(clientName, deviceType);
      // Save TOS to file
      const tosPath = path.join(os.homedir(), 'Documents', 'consulting', `tos-${clientName.toLowerCase().replace(/\s+/g, '-')}.txt`);
      fs.mkdirSync(path.dirname(tosPath), { recursive: true });
      fs.writeFileSync(tosPath, tos);
      return { success: true, path: tosPath, tos };
    } catch (e) { return { success: false, error: e.message }; }
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

    // 2. Self-heal
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

    // 6. Log to local brain (Supabase is dead)
    if (insights.length || actions.length) {
      try {
        brainContext.localBrain.upsertContext('system.proactive_log', {
          timestamp: new Date().toISOString(),
          insights_count: insights.length,
          actions_taken: actions,
          insights: insights.slice(0, 10),
        });
      } catch {}
    }

    if (insights.length > 0 || actions.length > 0) {
      mainWindow.webContents.send('brain:proactive-insight', { timestamp: new Date().toISOString(), insights, actions });
    }
  } catch (e) {
    console.error('[ProactiveBrain] Cycle error:', e.message);
  }
}
