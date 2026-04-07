const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const { execSync } = require('child_process');
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

    // Top processes by RAM
    try {
      const ps = run('ps aux --sort=-%mem | head -11');
      result.topRAM = ps.split('\n').slice(1).filter(l => l.trim()).map(line => {
        const parts = line.trim().split(/\s+/);
        return { pid: parts[1], cpu: parseFloat(parts[2]), mem: parseFloat(parts[3]), rss: parts[5], command: parts.slice(10).join(' ').slice(0, 60) };
      });
    } catch { result.topRAM = []; }

    // Top processes by CPU
    try {
      const ps = run('ps aux --sort=-%cpu | head -11');
      result.topCPU = ps.split('\n').slice(1).filter(l => l.trim()).map(line => {
        const parts = line.trim().split(/\s+/);
        return { pid: parts[1], cpu: parseFloat(parts[2]), mem: parseFloat(parts[3]), rss: parts[5], command: parts.slice(10).join(' ').slice(0, 60) };
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

      // Get active tasks from fleet dispatch
      const { data: taskData } = await sb.from('brain_context')
        .select('key, value, updated_at')
        .like('key', 'fleet.task_%')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (taskData?.length) {
        result.tasks = taskData.map(t => {
          const val = typeof t.value === 'string' ? JSON.parse(t.value) : t.value;
          return { ...val, key: t.key, updated_at: t.updated_at };
        });
      }

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

    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const task = {
      id: taskId,
      title,
      target: target === 'auto' ? null : target,
      status: 'pending',
      created_at: new Date().toISOString(),
      created_by: 'm3_forge',
      category: 'general',
    };

    try {
      await sb.from('brain_context').upsert({
        key: `fleet.task_${taskId}`,
        value: JSON.stringify(task),
        category: 'fleet',
        description: `Task: ${title.slice(0, 80)}`,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
      return { success: true, taskId };
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
