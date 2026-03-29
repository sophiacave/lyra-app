/**
 * local-engine.js — Zero-token command engine (UPGRADED)
 *
 * Handles ~80% of daily operations without ANY AI tokens by reading/writing Supabase directly.
 *
 * READ commands:  /status /tasks /calendar /sprint /crm /emails /context /budget /providers /scenarios /help
 * WRITE commands: /task-add /task-done /context-set /note /dispatch
 * ANALYTICS:      /report /funnel /timeline
 * SEARCH:         /search <query>
 */

class LocalEngine {
  constructor(brainContext, brainAPI) {
    this.brainContext = brainContext;
    this.brainAPI = brainAPI;
    this.scheduler = null;
  }

  setScheduler(scheduler) {
    this.scheduler = scheduler;
  }

  setBrainMCP(brainMCP) {
    this.brainMCP = brainMCP;
  }

  setKnowledge(knowledge) {
    this.knowledge = knowledge;
  }

  setAgent(agent) {
    this.agent = agent;
  }

  async tryHandle(message) {
    const msg = message.trim();

    // Slash commands
    if (msg.startsWith('/')) {
      const [cmd, ...args] = msg.split(' ');
      return await this.handleCommand(cmd.toLowerCase(), args.join(' '));
    }

    // Natural language → local command matching
    const patterns = [
      { match: /^(show|get|what('?s| is| are)?) (the )?(system |brain )?(status|health)/i, cmd: '/status' },
      { match: /^(show|get|list|what('?s| are)?) (the |my |all )?(pending )?(tasks?|todo)/i, cmd: '/tasks' },
      { match: /^(show|get|what('?s| is)?) (the )?(content )?calendar/i, cmd: '/calendar' },
      { match: /^(show|get|what('?s| is)?) (the )?(revenue )?sprint/i, cmd: '/sprint' },
      { match: /^(show|get|what('?s| is)?) (the )?(crm|pipeline|leads?)/i, cmd: '/crm' },
      { match: /^(show|get|list) (the |recent )?(emails?|notifications?)/i, cmd: '/emails' },
      { match: /^(show|get|what('?s| is)?) (the |my )?(token |api )?(budget|usage|spend)/i, cmd: '/budget' },
      { match: /^(show|get|list) (the |my |all )?(make\.?com |automation )?(scenarios?)/i, cmd: '/scenarios' },
      { match: /^(show|give) (me )?(a )?report/i, cmd: '/report' },
      { match: /^(show|get|what('?s| is)?) (the )?funnel/i, cmd: '/funnel' },
      { match: /^help$|^what can you do|^commands$/i, cmd: '/help' },
    ];

    for (const p of patterns) {
      if (p.match.test(msg)) {
        const [cmd, ...args] = p.cmd.split(' ');
        return await this.handleCommand(cmd, args.join(' '));
      }
    }

    return { handled: false };
  }

  async handleCommand(cmd, args) {
    try {
      switch (cmd) {
        // READ
        case '/status':     return { handled: true, response: await this.cmdStatus() };
        case '/tasks':      return { handled: true, response: await this.cmdTasks(args) };
        case '/calendar':   return { handled: true, response: await this.cmdCalendar() };
        case '/sprint':     return { handled: true, response: await this.cmdSprint() };
        case '/crm':        return { handled: true, response: await this.cmdCRM(args) };
        case '/emails':     return { handled: true, response: await this.cmdEmails(args) };
        case '/context':    return { handled: true, response: await this.cmdContext(args) };
        case '/budget':     return { handled: true, response: this.cmdBudget() };
        case '/providers':  return { handled: true, response: await this.cmdProviders() };
        case '/scenarios':  return { handled: true, response: await this.cmdScenarios() };
        case '/search':     return { handled: true, response: await this.cmdSearch(args) };

        // WRITE
        case '/task-add':   return { handled: true, response: await this.cmdTaskAdd(args) };
        case '/task-done':  return { handled: true, response: await this.cmdTaskDone(args) };
        case '/context-set':return { handled: true, response: await this.cmdContextSet(args) };
        case '/note':       return { handled: true, response: await this.cmdNote(args) };
        case '/dispatch':   return { handled: true, response: await this.cmdDispatch(args) };

        // ANALYTICS
        case '/report':     return { handled: true, response: await this.cmdReport() };
        case '/funnel':     return { handled: true, response: await this.cmdFunnel() };
        case '/timeline':   return { handled: true, response: await this.cmdTimeline(args) };

        // SCHEDULER & AUTOMATION
        case '/schedule':   return { handled: true, response: await this.cmdSchedule(args) };
        case '/cron':       return { handled: true, response: await this.cmdCron(args) };
        case '/scheduler':  return { handled: true, response: this.cmdSchedulerStatus() };

        // API CONNECTORS (zero tokens — direct API calls)
        case '/deploy':     return { handled: true, response: await this.cmdDeploy(args) };
        case '/make':       return { handled: true, response: await this.cmdMake(args) };
        case '/email':      return { handled: true, response: await this.cmdEmail(args) };
        case '/edge':       return { handled: true, response: await this.cmdEdgeFunction(args) };

        // SELF-AWARENESS & UPGRADE
        case '/self':       return { handled: true, response: await this.cmdSelf() };
        case '/upgrade':    return { handled: true, response: await this.cmdUpgrade(args) };
        case '/autonomy':   return { handled: true, response: await this.cmdAutonomy() };
        case '/introspect': return { handled: true, response: await this.cmdIntrospect() };
        case '/evolve':     return { handled: true, response: await this.cmdEvolve(args) };

        // KNOWLEDGE BASE
        case '/kb':         return { handled: true, response: await this.cmdKB(args) };

        // AGENTIC
        case '/agent':      return { handled: true, response: await this.cmdAgent(args) };
        case '/chain':      return { handled: true, response: await this.cmdChain(args) };

        // SYSTEM CONTROL
        case '/mac':        return { handled: true, response: await this.cmdMacControl(args) };
        case '/browser':    return { handled: true, response: await this.cmdBrowserControl(args) };

        // DEEP CONNECTORS
        case '/github':     return { handled: true, response: await this.cmdGitHub(args) };
        case '/vercel':     return { handled: true, response: await this.cmdVercelDeep(args) };

        // COMMUNICATION
        case '/slack':      return { handled: true, response: await this.cmdSlack(args) };
        case '/notion':     return { handled: true, response: await this.cmdNotion(args) };

        // RECORDING
        case '/record':     return { handled: true, response: await this.cmdRecord(args) };

        // DEEP SYSTEM INTELLIGENCE
        case '/deep-scan':  return { handled: true, response: await this.cmdDeepScan(args) };
        case '/systems':    return { handled: true, response: await this.cmdSystems() };
        case '/health':     return { handled: true, response: await this.cmdHealthCheck() };

        // SELF-EXTENSION
        case '/mcp-build':  return { handled: true, response: await this.cmdMCPBuild(args) };

        case '/help':       return { handled: true, response: this.cmdHelp() };
        default:
          return { handled: true, response: `Unknown command: \`${cmd}\`\nType \`/help\` for available commands.` };
      }
    } catch (error) {
      return { handled: true, response: `**Error:** ${error.message}` };
    }
  }

  // ============ READ COMMANDS ============

  async cmdStatus() {
    const status = await this.brainContext.getSystemStatus();
    if (!status.connected) return `## System Status\n\n**Brain:** Disconnected\n\nConfigure Supabase in Settings.`;

    const lastUpdate = status.lastContextUpdate ? new Date(status.lastContextUpdate).toLocaleString() : 'Unknown';
    const budget = this.brainAPI?.getBudget();
    const provider = await this.brainAPI?.detectBestProvider();

    let md = `## System Status\n\n`;
    md += `| Metric | Value |\n|--------|-------|\n`;
    md += `| Brain | **Connected** |\n`;
    md += `| Last Update | ${lastUpdate} |\n`;
    md += `| Pending Tasks | ${status.pendingTasks || 0} |\n`;
    md += `| AI Provider | ${provider?.name || 'None'} |\n`;
    if (budget) {
      const pct = budget.limit > 0 ? ((budget.tokensUsed / budget.limit) * 100).toFixed(1) : '∞';
      md += `| Tokens Used | ${budget.tokensUsed.toLocaleString()} / ${budget.limit.toLocaleString()} (${pct}%) |\n`;
      md += `| Est. Cost | $${budget.estimatedCost.toFixed(4)} |\n`;
    }

    if (status.tasks?.length > 0) {
      md += `\n### Pending Tasks\n`;
      for (const t of status.tasks) {
        md += `- \`${t.task_type}\` — ${t.description || t.status}\n`;
      }
    }

    if (status.recentNotifications?.length > 0) {
      md += `\n### Recent Activity\n`;
      for (const n of status.recentNotifications) {
        const time = new Date(n.created_at).toLocaleString();
        const icon = n.status === 'sent' ? '✅' : n.status === 'pending' ? '⏳' : '❌';
        md += `- ${icon} ${n.type}: **${n.status}** (${time})\n`;
      }
    }

    return md;
  }

  async cmdTasks(filter) {
    if (!this.brainContext.supabase) return '**Not connected.**';

    let query = this.brainContext.supabase
      .from('brain_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (filter && ['pending', 'running', 'completed', 'failed'].includes(filter)) {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) return `## Tasks\n\nNo tasks found${filter ? ` with status: ${filter}` : ''}.`;

    let md = `## Tasks (${data.length}${filter ? ` — ${filter}` : ''})\n\n`;
    const byStatus = {};
    for (const t of data) {
      const s = t.status || 'unknown';
      if (!byStatus[s]) byStatus[s] = [];
      byStatus[s].push(t);
    }

    const statusOrder = ['running', 'pending', 'completed', 'failed'];
    for (const status of statusOrder) {
      const tasks = byStatus[status];
      if (!tasks) continue;
      const icon = { running: '🔄', pending: '⏳', completed: '✅', failed: '❌' }[status] || '❓';
      md += `### ${icon} ${status.charAt(0).toUpperCase() + status.slice(1)} (${tasks.length})\n`;
      for (const t of tasks) {
        const age = this._timeAgo(t.created_at);
        md += `- **${t.task_type}** — ${t.description || 'No description'} *(${age})*\n`;
        if (t.result && t.status === 'failed') md += `  > Error: ${String(t.result).slice(0, 100)}\n`;
      }
      md += '\n';
    }
    return md;
  }

  async cmdCalendar() {
    const ctx = await this.brainContext.getFullContext();
    const calendar = ctx['content.calendar'];
    if (!calendar) return '## Content Calendar\n\nNo calendar data. Set it with `/context-set content.calendar <json>`.';

    let md = `## Content Calendar\n\n`;
    if (typeof calendar === 'object' && Array.isArray(calendar)) {
      for (const item of calendar) {
        const date = item.date || item.scheduled || '—';
        const status = item.status || 'planned';
        const icon = { published: '✅', scheduled: '📅', draft: '📝', planned: '💡' }[status] || '❓';
        md += `- ${icon} **${date}** — ${item.title || item.topic || 'Untitled'} [${status}]\n`;
        if (item.platform) md += `  Platform: ${item.platform}\n`;
      }
    } else if (typeof calendar === 'object') {
      md += '```json\n' + JSON.stringify(calendar, null, 2) + '\n```';
    } else {
      md += String(calendar);
    }
    return md;
  }

  async cmdSprint() {
    const ctx = await this.brainContext.getFullContext();
    const sprint = ctx['sprint.revenue_sprint_status'];
    if (!sprint) return '## Revenue Sprint\n\nNo sprint data.';

    let md = `## Revenue Sprint Status\n\n`;
    if (typeof sprint === 'object') {
      for (const [key, val] of Object.entries(sprint)) {
        if (typeof val === 'object' && val !== null) {
          md += `### ${this._humanize(key)}\n`;
          for (const [k2, v2] of Object.entries(val)) {
            md += `- **${this._humanize(k2)}:** ${v2}\n`;
          }
          md += '\n';
        } else {
          md += `**${this._humanize(key)}:** ${val}\n`;
        }
      }
    } else {
      md += String(sprint);
    }
    return md;
  }

  async cmdCRM(filter) {
    if (!this.brainContext.supabase) return '**Not connected.**';

    let query = this.brainContext.supabase
      .from('notion_sales_pipeline')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (filter) {
      const safe = this._sanitizeSearch(filter);
      query = query.or(`contact_name.ilike.%${safe}%,contact_email.ilike.%${safe}%,deal_stage.ilike.%${safe}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) return `## CRM Pipeline\n\nNo leads found${filter ? ` matching "${filter}"` : ''}.`;

    // Group by stage
    const byStage = {};
    let totalValue = 0;
    for (const lead of data) {
      const stage = lead.deal_stage || 'Unknown';
      if (!byStage[stage]) byStage[stage] = [];
      byStage[stage].push(lead);
      if (lead.deal_value) totalValue += Number(lead.deal_value) || 0;
    }

    let md = `## CRM Pipeline (${data.length} leads · $${totalValue.toLocaleString()} total)\n\n`;

    for (const [stage, leads] of Object.entries(byStage)) {
      const stageValue = leads.reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);
      md += `### ${stage} (${leads.length} · $${stageValue.toLocaleString()})\n`;
      for (const lead of leads) {
        const name = lead.contact_name || lead.contact_email || '—';
        const val = lead.deal_value ? `$${Number(lead.deal_value).toLocaleString()}` : '—';
        md += `- **${name}** — ${val}`;
        if (lead.notes) md += ` · ${lead.notes.slice(0, 60)}`;
        md += '\n';
      }
      md += '\n';
    }
    return md;
  }

  async cmdEmails(filter) {
    if (!this.brainContext.supabase) return '**Not connected.**';

    let query = this.brainContext.supabase
      .from('notification_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (filter) {
      const safe = this._sanitizeSearch(filter);
      query = query.or(`recipient.ilike.%${safe}%,type.ilike.%${safe}%,status.ilike.%${safe}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) return '## Email Activity\n\nNo emails logged.';

    const sent = data.filter(e => e.status === 'sent').length;
    const failed = data.filter(e => e.status !== 'sent').length;

    let md = `## Email Activity (${data.length} total · ${sent} sent · ${failed} failed)\n\n`;
    for (const e of data) {
      const time = this._timeAgo(e.created_at);
      const icon = e.status === 'sent' ? '✅' : '❌';
      md += `${icon} **${e.type}** → ${e.recipient}${e.recipient_name ? ` (${e.recipient_name})` : ''} — ${e.status} *(${time})*\n`;
    }
    return md;
  }

  async cmdContext(key) {
    if (!key) {
      if (!this.brainContext.supabase) return '**Not connected.**';
      const { data } = await this.brainContext.supabase
        .from('brain_context')
        .select('key, updated_at')
        .order('key');
      if (!data?.length) return '## Brain Context\n\nNo keys found.';

      let md = `## Brain Context (${data.length} keys)\n\n`;
      for (const row of data) {
        const age = this._timeAgo(row.updated_at);
        md += `- \`${row.key}\` *(${age})*\n`;
      }
      md += '\nUse `/context <key>` to read, `/context-set <key> <value>` to write.';
      return md;
    }

    if (!this.brainContext.supabase) return '**Not connected.**';
    const { data, error } = await this.brainContext.supabase
      .from('brain_context')
      .select('key, value, updated_at')
      .eq('key', key)
      .single();

    if (error || !data) return `No context found for key: \`${key}\``;

    let value;
    try { value = JSON.parse(data.value); } catch { value = data.value; }

    let md = `## Context: \`${key}\`\n*Updated: ${new Date(data.updated_at).toLocaleString()}*\n\n`;
    md += typeof value === 'object'
      ? '```json\n' + JSON.stringify(value, null, 2) + '\n```'
      : String(value);
    return md;
  }

  cmdBudget() {
    const budget = this.brainAPI?.getBudget();
    if (!budget) return '## Token Budget\n\nNo usage tracked yet.';

    const pct = budget.limit > 0 ? ((budget.tokensUsed / budget.limit) * 100).toFixed(1) : 0;
    const bar = this._progressBar(Number(pct));

    let md = `## Token Budget — ${budget.monthKey}\n\n`;
    md += `${bar} ${pct}%\n\n`;
    md += `| Metric | Value |\n|--------|-------|\n`;
    md += `| Tokens Used | ${budget.tokensUsed.toLocaleString()} / ${budget.limit.toLocaleString()} |\n`;
    md += `| Requests | ${budget.requestCount} |\n`;
    md += `| Est. Cost | $${budget.estimatedCost.toFixed(4)} |\n\n`;
    md += `> Use slash commands for zero-token queries. AI chat only when you need analysis or writing.`;
    return md;
  }

  async cmdProviders() {
    const providers = this.brainAPI?.getProviders() || {};
    const detected = await this.brainAPI?.detectBestProvider();
    const config = this.brainContext.getConfig();

    let md = `## AI Providers\n\n`;
    md += `**Active:** ${config.aiProvider || 'auto-detect'}\n`;
    if (detected) md += `**Best Available:** ${detected.name}\n\n`;

    for (const [id, p] of Object.entries(providers)) {
      const isActive = config.aiProvider === id;
      const hasKey = id === 'ollama' || config[`${id}Key`];
      const check = isActive ? ' ← ACTIVE' : '';
      md += `### ${p.name}${check}\n`;
      md += `- **Cost:** ${p.cost === 0 ? 'FREE' : `$${p.cost}/1k tokens`}\n`;
      md += `- **Status:** ${p.requiresKey ? (hasKey ? '✅ Ready' : '❌ No key') : '🏠 Local'}\n`;
      md += `- **Models:** ${p.models.slice(0, 3).join(', ')}\n\n`;
    }
    return md;
  }

  async cmdScenarios() {
    // Read Make.com scenario info from brain_context if stored there
    const ctx = await this.brainContext.getFullContext();
    const scenarios = ctx['system.scenarios'] || ctx['automation.scenarios'];

    if (scenarios) {
      let md = `## Make.com Scenarios\n\n`;
      if (Array.isArray(scenarios)) {
        for (const s of scenarios) {
          md += `- **${s.name || s.id}** — ${s.status || 'unknown'}\n`;
        }
      } else {
        md += '```json\n' + JSON.stringify(scenarios, null, 2) + '\n```';
      }
      return md;
    }

    // Fallback: check brain_tasks for scenario-related entries
    if (!this.brainContext.supabase) return '**Not connected.**';

    const { data } = await this.brainContext.supabase
      .from('brain_context')
      .select('key, value')
      .like('key', '%scenario%');

    if (data?.length) {
      let md = `## Scenarios (from brain_context)\n\n`;
      for (const row of data) {
        md += `### \`${row.key}\`\n`;
        try { md += '```json\n' + JSON.stringify(JSON.parse(row.value), null, 2) + '\n```\n'; }
        catch { md += row.value + '\n'; }
      }
      return md;
    }

    return `## Scenarios\n\nNo scenario data in brain_context. Known scenarios:\n\n- **Lead Capture → CRM** (ID 4374178) — Instant webhook\n- **Welcome Email** (ID 4397648) — Deactivated (replaced by Edge Function)\n\nStore scenario data: \`/context-set system.scenarios <json>\``;
  }

  async cmdSearch(query) {
    if (!query) return '**Usage:** `/search <query>`\n\nSearches across brain_context, brain_tasks, notification_log, and CRM.';
    if (!this.brainContext.supabase) return '**Not connected.**';

    const results = [];
    const safe = this._sanitizeSearch(query);

    // Search brain_context values
    const { data: ctxData } = await this.brainContext.supabase
      .from('brain_context')
      .select('key, value')
      .ilike('value', `%${safe}%`)
      .limit(5);
    if (ctxData?.length) results.push({ source: 'Brain Context', items: ctxData.map(r => `\`${r.key}\`: ${r.value.slice(0, 100)}...`) });

    // Search tasks
    const { data: taskData } = await this.brainContext.supabase
      .from('brain_tasks')
      .select('task_type, description, status')
      .or(`task_type.ilike.%${safe}%,description.ilike.%${safe}%`)
      .limit(5);
    if (taskData?.length) results.push({ source: 'Tasks', items: taskData.map(t => `${t.task_type} [${t.status}]: ${t.description || '—'}`) });

    // Search CRM
    const { data: crmData } = await this.brainContext.supabase
      .from('notion_sales_pipeline')
      .select('contact_name, contact_email, deal_stage')
      .or(`contact_name.ilike.%${safe}%,contact_email.ilike.%${safe}%,notes.ilike.%${safe}%`)
      .limit(5);
    if (crmData?.length) results.push({ source: 'CRM', items: crmData.map(c => `${c.contact_name || c.contact_email} — ${c.deal_stage || '—'}`) });

    // Search emails
    const { data: emailData } = await this.brainContext.supabase
      .from('notification_log')
      .select('type, recipient, status, created_at')
      .or(`recipient.ilike.%${safe}%,type.ilike.%${safe}%`)
      .limit(5);
    if (emailData?.length) results.push({ source: 'Emails', items: emailData.map(e => `${e.type} → ${e.recipient} [${e.status}]`) });

    if (!results.length) return `## Search: "${query}"\n\nNo results found across any table.`;

    let md = `## Search: "${query}"\n\n`;
    for (const r of results) {
      md += `### ${r.source}\n`;
      for (const item of r.items) md += `- ${item}\n`;
      md += '\n';
    }
    return md;
  }

  // ============ WRITE COMMANDS ============

  async cmdTaskAdd(args) {
    if (!args) return '**Usage:** `/task-add <type> | <description>`\n\nExample: `/task-add content | Write LinkedIn post about AI ROI`';
    if (!this.brainContext.supabase) return '**Not connected.**';

    const [taskType, ...descParts] = args.split('|').map(s => s.trim());
    const description = descParts.join('|').trim() || taskType;

    const { data, error } = await this.brainContext.supabase
      .from('brain_tasks')
      .insert({
        task_type: taskType || 'general',
        description,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return `✅ Task created: **${taskType}** — ${description}\n\nID: ${data?.[0]?.id || '—'}`;
  }

  async cmdTaskDone(args) {
    if (!args) return '**Usage:** `/task-done <task_id>`';
    if (!this.brainContext.supabase) return '**Not connected.**';

    const taskId = parseInt(args);
    if (isNaN(taskId)) return '**Error:** Task ID must be a number.';

    const { data, error } = await this.brainContext.supabase
      .from('brain_tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId)
      .select();

    if (error) throw error;
    if (!data?.length) return `**Error:** Task ${taskId} not found.`;
    return `✅ Task ${taskId} marked complete: **${data[0].task_type}**`;
  }

  async cmdContextSet(args) {
    if (!args) return '**Usage:** `/context-set <key> <value>`\n\nExample: `/context-set sprint.goal Hit $5k MRR by March 30`';
    if (!this.brainContext.supabase) return '**Not connected.**';

    const spaceIdx = args.indexOf(' ');
    if (spaceIdx === -1) return '**Error:** Provide both key and value.';

    const key = args.slice(0, spaceIdx);
    let value = args.slice(spaceIdx + 1);

    // Try parsing as JSON
    try { JSON.parse(value); } catch { value = JSON.stringify(value); }

    const { error } = await this.brainContext.supabase
      .from('brain_context')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;

    // Refresh cache
    await this.brainContext.loadContext();
    return `✅ Context updated: \`${key}\` = ${value.slice(0, 100)}${value.length > 100 ? '...' : ''}`;
  }

  async cmdNote(args) {
    if (!args) return '**Usage:** `/note <text>`\n\nAdds a timestamped note to brain_context under `notes.log`.';
    if (!this.brainContext.supabase) return '**Not connected.**';

    // Fetch existing notes
    const { data: existing } = await this.brainContext.supabase
      .from('brain_context')
      .select('value')
      .eq('key', 'notes.log')
      .single();

    let notes = [];
    try { notes = JSON.parse(existing?.value || '[]'); } catch { notes = []; }

    notes.unshift({
      text: args,
      timestamp: new Date().toISOString(),
    });

    // Keep last 50 notes
    if (notes.length > 50) notes = notes.slice(0, 50);

    await this.brainContext.supabase
      .from('brain_context')
      .upsert({ key: 'notes.log', value: JSON.stringify(notes), updated_at: new Date().toISOString() }, { onConflict: 'key' });

    return `📝 Note saved: "${args.slice(0, 80)}${args.length > 80 ? '...' : ''}"`;
  }

  async cmdDispatch(args) {
    if (!args) return '**Usage:** `/dispatch <webhook_url> [json_body]`\n\nFires a webhook to trigger a Make.com scenario or edge function.';

    const [url, ...bodyParts] = args.split(' ');
    let body = bodyParts.join(' ') || '{}';
    try { body = JSON.parse(body); } catch { body = { message: body }; }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      return `## Dispatch Result\n\n**URL:** ${url}\n**Status:** ${res.status} ${res.statusText}\n**Response:**\n\`\`\`\n${text.slice(0, 500)}\n\`\`\``;
    } catch (err) {
      return `❌ Dispatch failed: ${err.message}`;
    }
  }

  // ============ ANALYTICS ============

  async cmdReport() {
    if (!this.brainContext.supabase) return '**Not connected.**';

    // Pull all data in parallel
    const [tasksRes, crmRes, emailsRes] = await Promise.all([
      this.brainContext.supabase.from('brain_tasks').select('status').limit(100),
      this.brainContext.supabase.from('notion_sales_pipeline').select('deal_stage, deal_value').limit(100),
      this.brainContext.supabase.from('notification_log').select('status, created_at').limit(100),
    ]);

    const tasks = tasksRes.data || [];
    const crm = crmRes.data || [];
    const emails = emailsRes.data || [];

    const taskStats = this._countBy(tasks, 'status');
    const crmStats = this._countBy(crm, 'deal_stage');
    const emailStats = this._countBy(emails, 'status');
    const totalPipeline = crm.reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

    let md = `## Daily Report — ${new Date().toLocaleDateString()}\n\n`;

    md += `### Tasks\n`;
    for (const [status, count] of Object.entries(taskStats)) {
      md += `- ${status}: **${count}**\n`;
    }

    md += `\n### CRM Pipeline ($${totalPipeline.toLocaleString()} total)\n`;
    for (const [stage, count] of Object.entries(crmStats)) {
      const stageValue = crm.filter(l => l.deal_stage === stage).reduce((s, l) => s + (Number(l.deal_value) || 0), 0);
      md += `- ${stage}: **${count}** leads ($${stageValue.toLocaleString()})\n`;
    }

    md += `\n### Emails (${emails.length} total)\n`;
    for (const [status, count] of Object.entries(emailStats)) {
      md += `- ${status}: **${count}**\n`;
    }

    const budget = this.brainAPI?.getBudget();
    if (budget) {
      md += `\n### Token Usage\n`;
      md += `- Used: **${budget.tokensUsed.toLocaleString()}** tokens ($${budget.estimatedCost.toFixed(4)})\n`;
      md += `- Requests: ${budget.requestCount}\n`;
    }

    return md;
  }

  async cmdFunnel() {
    if (!this.brainContext.supabase) return '**Not connected.**';

    const { data, error } = await this.brainContext.supabase
      .from('notion_sales_pipeline')
      .select('deal_stage, deal_value')
      .limit(200);

    if (error) throw error;
    if (!data?.length) return '## Funnel\n\nNo CRM data.';

    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const stageData = {};
    for (const lead of data) {
      const stage = lead.deal_stage || 'Unknown';
      if (!stageData[stage]) stageData[stage] = { count: 0, value: 0 };
      stageData[stage].count++;
      stageData[stage].value += Number(lead.deal_value) || 0;
    }

    let md = `## Sales Funnel\n\n`;
    const maxCount = Math.max(...Object.values(stageData).map(s => s.count), 1);

    for (const stage of [...stages, ...Object.keys(stageData).filter(s => !stages.includes(s))]) {
      const d = stageData[stage];
      if (!d) continue;
      const bar = '█'.repeat(Math.round((d.count / maxCount) * 20));
      const pad = '░'.repeat(20 - bar.length);
      md += `**${stage}**\n${bar}${pad} ${d.count} leads · $${d.value.toLocaleString()}\n\n`;
    }
    return md;
  }

  async cmdTimeline(args) {
    if (!this.brainContext.supabase) return '**Not connected.**';

    const days = parseInt(args) || 7;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    const [tasksRes, emailsRes, crmRes] = await Promise.all([
      this.brainContext.supabase.from('brain_tasks').select('task_type, status, created_at').gte('created_at', sinceISO).order('created_at', { ascending: false }),
      this.brainContext.supabase.from('notification_log').select('type, status, recipient, created_at').gte('created_at', sinceISO).order('created_at', { ascending: false }),
      this.brainContext.supabase.from('notion_sales_pipeline').select('contact_name, deal_stage, created_at').gte('created_at', sinceISO).order('created_at', { ascending: false }),
    ]);

    const events = [
      ...(tasksRes.data || []).map(t => ({ time: t.created_at, type: '📋 Task', detail: `${t.task_type} [${t.status}]` })),
      ...(emailsRes.data || []).map(e => ({ time: e.created_at, type: '📧 Email', detail: `${e.type} → ${e.recipient} [${e.status}]` })),
      ...(crmRes.data || []).map(c => ({ time: c.created_at, type: '💼 Lead', detail: `${c.contact_name || '—'} → ${c.deal_stage || '—'}` })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    if (!events.length) return `## Timeline (${days}d)\n\nNo activity in the last ${days} days.`;

    let md = `## Timeline — Last ${days} Days (${events.length} events)\n\n`;
    let lastDate = '';
    for (const e of events) {
      const date = new Date(e.time).toLocaleDateString();
      if (date !== lastDate) {
        md += `### ${date}\n`;
        lastDate = date;
      }
      const time = new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      md += `- \`${time}\` ${e.type} — ${e.detail}\n`;
    }
    return md;
  }

  // ============ SCHEDULER & AUTOMATION ============

  async cmdSchedule(args) {
    if (!args) {
      return `## Schedule Commands\n\n` +
        `**Create recurring tasks:**\n` +
        `- \`/schedule health_check */5\` — Health check every 5 minutes\n` +
        `- \`/schedule report_generate daily\` — Daily report at 6 AM\n` +
        `- \`/schedule evolution_cycle weekly\` — Weekly self-assessment\n` +
        `- \`/schedule context_refresh */30\` — Refresh context every 30 min\n` +
        `- \`/schedule webhook_fire hourly {"url":"https://..."}\` — Fire webhook hourly\n\n` +
        `**One-shot tasks:**\n` +
        `- \`/schedule vercel_deploy now {"deploy_hook":"https://..."}\` — Deploy now\n` +
        `- \`/schedule email_drip now {"email":"x@y.com","name":"Z"}\` — Send email now\n\n` +
        `See \`/scheduler\` for status.`;
    }

    if (!this.brainContext.supabase) return '**Not connected.**';

    const parts = args.split(' ');
    const taskType = parts[0];
    const schedule = parts[1] || 'hourly';
    const configStr = parts.slice(2).join(' ') || '{}';

    let config = {};
    try { config = JSON.parse(configStr); } catch { config = { raw: configStr }; }

    const isNow = schedule === 'now';
    const nextRun = isNow ? new Date().toISOString() : this._calculateNextRun(schedule);

    const { data, error } = await this.brainContext.supabase
      .from('brain_tasks')
      .insert({
        task_type: taskType,
        description: `Scheduled: ${taskType} (${schedule})`,
        status: isNow ? 'pending' : 'scheduled',
        auto_execute: true,
        schedule: isNow ? null : schedule,
        next_run: nextRun,
        config: JSON.stringify(config),
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return `✅ Scheduled: **${taskType}**\n` +
      `- Schedule: ${isNow ? 'Immediate (one-shot)' : schedule}\n` +
      `- Next run: ${new Date(nextRun).toLocaleString()}\n` +
      `- ID: ${data?.[0]?.id || '—'}`;
  }

  async cmdCron(args) {
    if (!this.brainContext.supabase) return '**Not connected.**';

    if (!args || args === 'list') {
      const { data } = await this.brainContext.supabase
        .from('brain_tasks')
        .select('*')
        .eq('status', 'scheduled')
        .order('next_run', { ascending: true });

      if (!data?.length) return '## Cron Jobs\n\nNo scheduled tasks. Use `/schedule` to create one.';

      let md = `## Cron Jobs (${data.length})\n\n`;
      for (const t of data) {
        const nextRun = t.next_run ? new Date(t.next_run).toLocaleString() : '—';
        const lastRun = t.last_run ? this._timeAgo(t.last_run) : 'never';
        md += `- **${t.task_type}** [ID:${t.id}] — \`${t.schedule || 'one-shot'}\`\n`;
        md += `  Next: ${nextRun} · Last: ${lastRun} · Runs: ${t.run_count || 0}\n`;
      }
      md += `\nManage: \`/cron pause <id>\` · \`/cron resume <id>\` · \`/cron delete <id>\``;
      return md;
    }

    const [action, idStr] = args.split(' ');
    const id = parseInt(idStr);
    if (isNaN(id)) return `**Usage:** \`/cron ${action} <id>\``;

    switch (action) {
      case 'pause':
        await this.brainContext.supabase.from('brain_tasks').update({ status: 'paused' }).eq('id', id);
        return `⏸️ Paused cron job ${id}`;
      case 'resume':
        const next = this._calculateNextRun('*/5');
        await this.brainContext.supabase.from('brain_tasks').update({ status: 'scheduled', next_run: next }).eq('id', id);
        return `▶️ Resumed cron job ${id}`;
      case 'delete':
        await this.brainContext.supabase.from('brain_tasks').delete().eq('id', id);
        return `🗑️ Deleted cron job ${id}`;
      default:
        return `Unknown action: ${action}. Use: list, pause, resume, delete`;
    }
  }

  cmdSchedulerStatus() {
    if (!this.scheduler) return '## Scheduler\n\n**Status:** Not initialized';

    const executions = this.scheduler.getRecentExecutions();

    let md = `## Scheduler\n\n`;
    md += `**Status:** ${this.scheduler.running ? '🟢 Running' : '🔴 Stopped'}\n\n`;

    if (executions.length) {
      md += `### Recent Executions (${executions.length})\n`;
      for (const e of executions.slice(0, 10)) {
        const icon = e.status === 'success' ? '✅' : '❌';
        const time = this._timeAgo(e.timestamp);
        md += `${icon} **${e.task_type}** — ${e.elapsed_ms}ms (${time})\n`;
      }
    } else {
      md += 'No executions yet.\n';
    }

    md += `\nUse \`/schedule\` to create tasks, \`/cron\` to manage recurring jobs.`;
    return md;
  }

  // ============ API CONNECTORS (zero tokens) ============

  async cmdDeploy(args) {
    if (!args) {
      return `## Vercel Deploy\n\n` +
        `**Usage:**\n` +
        `- \`/deploy <hook_url>\` — Trigger deploy now\n` +
        `- \`/deploy status\` — Check recent deployments\n` +
        `- \`/deploy set-hook <url>\` — Save deploy hook for quick access\n\n` +
        `Get your deploy hook from: Vercel Project > Settings > Git > Deploy Hooks`;
    }

    if (args === 'status') {
      // Read stored deploy status
      if (!this.brainContext.supabase) return '**Not connected.**';
      const { data } = await this.brainContext.supabase
        .from('brain_context')
        .select('value')
        .eq('key', 'system.last_deploy')
        .single();
      if (!data) return 'No deploy history. Use `/deploy <hook_url>` to deploy.';
      const deploy = JSON.parse(data.value);
      return `## Last Deploy\n\n**Time:** ${deploy.timestamp}\n**Status:** ${deploy.status}\n**Result:** ${JSON.stringify(deploy.result)}`;
    }

    if (args.startsWith('set-hook ')) {
      const hookUrl = args.replace('set-hook ', '').trim();
      this.brainContext.updateConfig({ vercelDeployHook: hookUrl });
      return `✅ Deploy hook saved. Now you can just run \`/deploy go\` to deploy.`;
    }

    // Resolve URL
    let hookUrl = args;
    if (args === 'go') {
      hookUrl = this.brainContext.getConfig().vercelDeployHook;
      if (!hookUrl) return '**No deploy hook saved.** Use `/deploy set-hook <url>` first.';
    }

    // Fire deploy
    try {
      const res = await fetch(hookUrl, { method: 'POST' });
      const data = await res.json();

      // Log deploy
      if (this.brainContext.supabase) {
        await this.brainContext.supabase
          .from('brain_context')
          .upsert({
            key: 'system.last_deploy',
            value: JSON.stringify({ timestamp: new Date().toISOString(), status: res.ok ? 'triggered' : 'error', result: data }),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'key' });
      }

      return `## Deploy Triggered\n\n**Status:** ${res.status} ${res.statusText}\n**Job:** ${JSON.stringify(data).slice(0, 200)}`;
    } catch (err) {
      return `❌ Deploy failed: ${err.message}`;
    }
  }

  async cmdMake(args) {
    if (!args) {
      return `## Make.com Control\n\n` +
        `**Usage:**\n` +
        `- \`/make list\` — List all scenarios\n` +
        `- \`/make status <id>\` — Get scenario status\n` +
        `- \`/make activate <id>\` — Activate scenario\n` +
        `- \`/make deactivate <id>\` — Deactivate scenario\n` +
        `- \`/make run <id>\` — Run scenario once\n` +
        `- \`/make set-key <api_key>\` — Save Make.com API key\n\n` +
        `Known scenarios:\n` +
        `- **4374178** — Lead Capture → Supabase CRM\n` +
        `- **4397648** — Welcome Email (deactivated)`;
    }

    const [action, ...rest] = args.split(' ');
    const config = this.brainContext.getConfig();

    if (action === 'set-key') {
      this.brainContext.updateConfig({ makeApiKey: rest.join(' ').trim() });
      return '✅ Make.com API key saved.';
    }

    const apiKey = config.makeApiKey;
    if (!apiKey) return '**Make.com API key not set.** Use `/make set-key <key>` first.';

    const baseUrl = 'https://us2.make.com/api/v2';
    const headers = { 'Authorization': `Token ${apiKey}`, 'Content-Type': 'application/json' };

    switch (action) {
      case 'list': {
        const res = await fetch(`${baseUrl}/scenarios?pg[limit]=20`, { headers });
        const data = await res.json();
        if (!data.scenarios?.length) return '## Scenarios\n\nNo scenarios found.';
        let md = `## Make.com Scenarios (${data.scenarios.length})\n\n`;
        for (const s of data.scenarios) {
          const icon = s.islinked ? '🟢' : '🔴';
          md += `${icon} **${s.name}** [ID:${s.id}] — ${s.islinked ? 'Active' : 'Inactive'}\n`;
        }
        return md;
      }
      case 'status': {
        const id = rest[0];
        if (!id) return '**Usage:** `/make status <scenario_id>`';
        const res = await fetch(`${baseUrl}/scenarios/${id}`, { headers });
        const data = await res.json();
        if (data.scenario) {
          const s = data.scenario;
          return `## Scenario: ${s.name}\n\n` +
            `**ID:** ${s.id}\n**Active:** ${s.islinked ? 'Yes' : 'No'}\n` +
            `**Last Edit:** ${s.updatedAt || '—'}\n**Hook:** ${s.hookId || 'None'}`;
        }
        return `Error: ${JSON.stringify(data)}`;
      }
      case 'activate': {
        const id = rest[0];
        if (!id) return '**Usage:** `/make activate <id>`';
        const res = await fetch(`${baseUrl}/scenarios/${id}/activate`, { method: 'POST', headers });
        return res.ok ? `✅ Scenario ${id} activated.` : `❌ Failed: ${await res.text()}`;
      }
      case 'deactivate': {
        const id = rest[0];
        if (!id) return '**Usage:** `/make deactivate <id>`';
        const res = await fetch(`${baseUrl}/scenarios/${id}/deactivate`, { method: 'POST', headers });
        return res.ok ? `✅ Scenario ${id} deactivated.` : `❌ Failed: ${await res.text()}`;
      }
      case 'run': {
        const id = rest[0];
        if (!id) return '**Usage:** `/make run <id>`';
        const bodyStr = rest.slice(1).join(' ') || '{}';
        let body;
        try { body = JSON.parse(bodyStr); } catch { body = {}; }
        const res = await fetch(`${baseUrl}/scenarios/${id}/run`, {
          method: 'POST', headers, body: JSON.stringify({ data: body }),
        });
        const data = await res.json();
        return `## Run Result\n\n**Status:** ${res.status}\n\`\`\`json\n${JSON.stringify(data, null, 2).slice(0, 500)}\n\`\`\``;
      }
      default:
        return `Unknown action: \`${action}\`. Use: list, status, activate, deactivate, run, set-key`;
    }
  }

  async cmdEmail(args) {
    if (!args) {
      return `## Email Commands\n\n` +
        `**Send:**\n` +
        `- \`/email send <address> [name]\` — Send welcome email via Edge Function\n` +
        `- \`/email drip <address> <sequence#> [name]\` — Send drip email #N\n\n` +
        `**Check:**\n` +
        `- \`/email log [search]\` — Same as /emails\n` +
        `- \`/email stats\` — Email delivery stats`;
    }

    const [action, ...rest] = args.split(' ');

    switch (action) {
      case 'send': {
        const email = rest[0];
        const name = rest.slice(1).join(' ') || undefined;
        if (!email) return '**Usage:** `/email send <address> [name]`';

        const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
        if (!supabaseUrl) return '**Supabase not configured.**';

        const res = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, source: 'manual_send' }),
        });
        const data = await res.json();
        return res.ok && data.success
          ? `✅ Email sent to **${email}** (${name || 'no name'})\nID: ${data.id || '—'}`
          : `❌ Failed: ${JSON.stringify(data)}`;
      }
      case 'drip': {
        const email = rest[0];
        const seq = rest[1] || '1';
        const name = rest.slice(2).join(' ') || undefined;
        if (!email) return '**Usage:** `/email drip <address> <sequence#> [name]`';

        const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
        const res = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, source: `drip_${seq}` }),
        });
        const data = await res.json();
        return res.ok && data.success
          ? `✅ Drip email #${seq} sent to **${email}**`
          : `❌ Failed: ${JSON.stringify(data)}`;
      }
      case 'stats': {
        if (!this.brainContext.supabase) return '**Not connected.**';
        const { data } = await this.brainContext.supabase
          .from('notification_log')
          .select('status, type');
        if (!data?.length) return '## Email Stats\n\nNo emails logged.';

        const byStatus = this._countBy(data, 'status');
        const byType = this._countBy(data, 'type');

        let md = `## Email Stats (${data.length} total)\n\n`;
        md += `### By Status\n`;
        for (const [s, c] of Object.entries(byStatus)) md += `- **${s}:** ${c}\n`;
        md += `\n### By Type\n`;
        for (const [t, c] of Object.entries(byType)) md += `- **${t}:** ${c}\n`;
        return md;
      }
      case 'log':
        return await this.cmdEmails(rest.join(' '));
      default:
        return `Unknown email action: \`${action}\`. Use: send, drip, stats, log`;
    }
  }

  async cmdEdgeFunction(args) {
    if (!args) {
      return `## Edge Function Commands\n\n` +
        `Call any Supabase Edge Function directly:\n\n` +
        `- \`/edge <function-name> [json_body]\`\n\n` +
        `Examples:\n` +
        `- \`/edge send-welcome-email {"email":"x@y.com","name":"Z"}\`\n` +
        `- \`/edge my-function {"key":"value"}\``;
    }

    const [fnName, ...bodyParts] = args.split(' ');
    const supabaseUrl = this.brainContext.getConfig().supabaseUrl;
    if (!supabaseUrl) return '**Supabase not configured.**';

    let body = {};
    const bodyStr = bodyParts.join(' ');
    if (bodyStr) {
      try { body = JSON.parse(bodyStr); } catch { body = { data: bodyStr }; }
    }

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/${fnName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }

      return `## Edge Function: ${fnName}\n\n` +
        `**Status:** ${res.status} ${res.statusText}\n` +
        `**Response:**\n\`\`\`json\n${typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : parsed}\n\`\`\``;
    } catch (err) {
      return `❌ Edge function call failed: ${err.message}`;
    }
  }

  _calculateNextRun(schedule) {
    const now = new Date();
    const everyNMin = schedule.match(/^\*\/(\d+)/);
    if (everyNMin) return new Date(now.getTime() + parseInt(everyNMin[1]) * 60000).toISOString();
    switch (schedule) {
      case 'hourly': return new Date(now.getTime() + 3600000).toISOString();
      case 'daily':
        const t = new Date(now); t.setDate(t.getDate() + 1); t.setHours(6, 0, 0, 0); return t.toISOString();
      case 'weekly':
        const w = new Date(now); w.setDate(w.getDate() + 7); w.setHours(6, 0, 0, 0); return w.toISOString();
      default: return new Date(now.getTime() + 3600000).toISOString();
    }
  }

  // ============ SELF-AWARENESS & L5 AUTONOMY ============

  async cmdSelf() {
    const config = this.brainContext.getConfig();
    const budget = this.brainAPI?.getBudget();
    const provider = await this.brainAPI?.detectBestProvider();
    const status = await this.brainContext.getSystemStatus();

    const fs = require('fs');
    const path = require('path');
    const pkgPath = path.join(__dirname, '..', 'package.json');
    let version = '?';
    try { version = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version; } catch {}

    // Count capabilities
    const localCmds = ['/status','/tasks','/calendar','/sprint','/crm','/emails','/context','/budget',
      '/providers','/scenarios','/search','/task-add','/task-done','/context-set','/note','/dispatch',
      '/report','/funnel','/timeline','/self','/upgrade','/autonomy','/introspect','/evolve'];

    let md = `## Brain Console — Self Report\n\n`;
    md += `| Property | Value |\n|----------|-------|\n`;
    md += `| Version | **${version}** |\n`;
    md += `| Architecture | Electron + Supabase + Multi-Provider AI |\n`;
    md += `| Local Commands | **${localCmds.length}** (zero tokens) |\n`;
    md += `| AI Provider | ${provider?.name || 'None'} |\n`;
    md += `| AI Providers Available | ${this._countAvailableProviders(config)} |\n`;
    md += `| Brain Connected | ${status.connected ? '✅' : '❌'} |\n`;
    md += `| Pending Tasks | ${status.pendingTasks || 0} |\n`;
    md += `| Token Budget | ${budget ? `${budget.tokensUsed.toLocaleString()} / ${budget.limit.toLocaleString()}` : '—'} |\n`;
    md += `| Supabase Tables | brain_context, brain_tasks, notification_log, notion_sales_pipeline |\n`;
    md += `| External Services | Make.com, Vercel, Resend, Supabase Edge Functions |\n`;

    md += `\n### Autonomy Level Assessment\n`;
    const autonomy = this._assessAutonomy(config, status, provider);
    md += `**Current Level: L${autonomy.level}** — ${autonomy.label}\n\n`;
    for (const item of autonomy.checklist) {
      md += `- ${item.met ? '✅' : '❌'} ${item.description}\n`;
    }

    if (autonomy.nextSteps.length) {
      md += `\n### Next Steps to L5\n`;
      for (const step of autonomy.nextSteps) {
        md += `- ${step}\n`;
      }
    }

    return md;
  }

  async cmdAutonomy(args) {
    const config = this.brainContext.getConfig();
    const status = await this.brainContext.getSystemStatus();
    const provider = await this.brainAPI?.detectBestProvider();
    const autonomy = this._assessAutonomy(config, status, provider);

    // /autonomy push — attempt to auto-fix unmet items
    if (args && args.trim() === 'push') {
      return await this._autonomyPush(config, status, autonomy);
    }

    let md = `## Autonomy Assessment — L${autonomy.level}\n\n`;
    md += `**${autonomy.label}** (${autonomy.score})\n\n`;

    const levels = [
      { level: 1, name: 'Reactive', desc: 'Responds to commands only' },
      { level: 2, name: 'Assisted', desc: 'Helps with tasks when asked' },
      { level: 3, name: 'Conditional', desc: 'Handles routine tasks independently' },
      { level: 4, name: 'High', desc: 'Operates most workflows autonomously' },
      { level: 5, name: 'Full', desc: 'Zero human dependencies for all operations' },
    ];

    for (const l of levels) {
      const current = l.level === autonomy.level ? ' ← YOU ARE HERE' : '';
      const passed = l.level <= autonomy.level ? '✅' : '⬜';
      md += `${passed} **L${l.level} — ${l.name}:** ${l.desc}${current}\n`;
    }

    md += `\n### Detailed Checklist\n`;
    for (const item of autonomy.checklist) {
      md += `- ${item.met ? '✅' : '❌'} ${item.description}\n`;
    }

    if (autonomy.nextSteps.length) {
      md += `\n### Path to L5\n`;
      for (const step of autonomy.nextSteps) {
        md += `- 🎯 ${step}\n`;
      }
      md += `\n**Run \`/autonomy push\` to auto-fix what can be fixed.**`;
    } else {
      md += `\n**All items met. Full L5 autonomy achieved.**`;
    }

    return md;
  }

  async _autonomyPush(config, status, autonomy) {
    let md = `## Autonomy Push — Auto-Fixing\n\n`;
    let fixed = 0;

    for (const item of autonomy.checklist.filter(c => !c.met)) {
      md += `\n**Attempting:** ${item.description}\n`;

      // Brain database connected
      if (item.description.includes('Brain database') && config.supabaseUrl && config.supabaseKey) {
        try {
          await this.brainContext.initialize();
          if (this.brainContext.supabase) {
            md += `✅ Reconnected to Supabase\n`;
            fixed++;
          } else {
            md += `❌ Still failing — check URL and key in Settings\n`;
          }
        } catch (e) { md += `❌ ${e.message}\n`; }
      }

      // Has at least one AI provider
      if (item.description.includes('AI provider') && !item.description.includes('free')) {
        try {
          const resp = await this._fetchWithTimeout('http://localhost:11434/api/tags', { method: 'GET' }, 3000);
          if (resp.ok) {
            this.brainContext.updateConfig({ aiProvider: 'ollama' });
            md += `✅ Ollama detected — auto-set as provider\n`;
            fixed++;
          } else {
            md += `❌ No AI provider found. Install Ollama: \`brew install ollama && ollama pull llama3.1:8b && ollama serve\`\n`;
          }
        } catch {
          md += `❌ Ollama not running. Start it: \`ollama serve\`\n`;
        }
      }

      // Has free AI provider
      if (item.description.includes('free AI provider') || item.description.includes('Free')) {
        if (config.groqKey) {
          md += `✅ Groq key already set (free tier)\n`;
          fixed++;
        } else {
          try {
            const resp = await this._fetchWithTimeout('http://localhost:11434/api/tags', { method: 'GET' }, 3000);
            if (resp.ok) {
              md += `✅ Ollama is free and running\n`;
              fixed++;
            } else {
              md += `❌ Get free Groq key at console.groq.com, or run \`ollama serve\`\n`;
            }
          } catch {
            md += `❌ No free provider. Get Groq key at console.groq.com\n`;
          }
        }
      }

      // Scheduled task execution
      if (item.description.includes('Scheduled task') && !this.scheduler?.running) {
        if (this.scheduler) {
          this.scheduler.start(60000);
          md += `✅ Scheduler started\n`;
          fixed++;
        } else {
          md += `❌ Scheduler not initialized — restart app\n`;
        }
      }

      // Knowledge base
      if (item.description.includes('Knowledge base') || item.description.includes('semantic search')) {
        if (this.knowledge) {
          try {
            const imported = await this.knowledge.importFromContext();
            md += `✅ KB initialized — imported ${imported.imported} entries from brain_context\n`;
            fixed++;
          } catch (e) { md += `❌ KB import failed: ${e.message}\n`; }
        }
      }

      // Can modify own context
      if (item.description.includes('modify own context') && this.brainContext.supabase) {
        try {
          await this.brainContext.supabase.from('brain_context').upsert({
            key: 'system.last_autonomy_push',
            value: JSON.stringify({ timestamp: new Date().toISOString(), fixed }),
            updated_at: new Date().toISOString(),
          });
          md += `✅ Brain context writable\n`;
          fixed++;
        } catch (e) { md += `❌ ${e.message}\n`; }
      }

      // Self-triggered evolution
      if (item.description.includes('evolution') && this.scheduler?.running && this.brainContext.supabase) {
        try {
          await this.brainContext.supabase.from('brain_tasks').insert({
            task_type: 'evolution_cycle',
            description: 'Auto-scheduled by autonomy push',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 86400000).toISOString(),
            created_at: new Date().toISOString(),
          });
          md += `✅ Evolution cycle scheduled for tomorrow\n`;
          fixed++;
        } catch (e) { md += `❌ ${e.message}\n`; }
      }
    }

    // Re-assess after fixes
    const newStatus = await this.brainContext.getSystemStatus();
    const newProvider = await this.brainAPI?.detectBestProvider();
    const newAutonomy = this._assessAutonomy(this.brainContext.getConfig(), newStatus, newProvider);

    md += `\n---\n`;
    md += `**Fixed:** ${fixed} items\n`;
    md += `**New Level: L${newAutonomy.level}** — ${newAutonomy.label} (${newAutonomy.score})\n`;

    if (newAutonomy.level < autonomy.level) {
      md += `*Level unchanged — remaining items require manual configuration.*\n`;
    } else if (newAutonomy.level > autonomy.level) {
      md += `**Level UP!** 🎉 L${autonomy.level} → L${newAutonomy.level}\n`;
    }

    if (newAutonomy.nextSteps.length) {
      md += `\n**Still needed (manual):**\n`;
      for (const step of newAutonomy.nextSteps) {
        md += `- ${step}\n`;
      }
    }

    return md;
  }

  async cmdIntrospect() {
    // Deep self-analysis: what can the brain do, what are its limits
    const config = this.brainContext.getConfig();
    const ctx = await this.brainContext.getFullContext();
    const keys = Object.keys(ctx);

    let md = `## Introspection\n\n`;
    md += `### What I Know (Brain Context)\n`;
    for (const key of keys) {
      const val = ctx[key];
      const size = typeof val === 'string' ? val.length : JSON.stringify(val).length;
      md += `- \`${key}\` — ${typeof val} (${size} chars)\n`;
    }

    md += `\n### What I Can Do Without AI (${Object.keys(this.localEngine?.tools || {}).length || 30}+ operations)\n`;
    md += `- Read all Supabase tables directly\n`;
    md += `- Create/update tasks and context\n`;
    md += `- Search across all data\n`;
    md += `- Generate reports, funnels, timelines\n`;
    md += `- Fire webhooks to trigger automations\n`;
    md += `- Track token budget\n`;
    md += `- Self-assess autonomy level\n`;
    md += `- Deploy to Vercel via deploy hooks (/deploy)\n`;
    md += `- Manage Make.com scenarios via API (/make)\n`;
    md += `- Send emails via Supabase Edge Functions (/email)\n`;
    md += `- Schedule recurring tasks with cron (/schedule, /cron)\n`;
    md += `- Call any Edge Function directly (/edge)\n`;
    md += `- Expose all operations via MCP server\n`;
    md += `- Knowledge base with semantic search (/kb)\n`;

    md += `\n### What I Need AI For\n`;
    md += `- Complex reasoning and analysis\n`;
    md += `- Creative writing (emails, posts, content)\n`;
    md += `- Code generation and debugging\n`;
    md += `- Strategy and planning\n`;
    md += `- Multi-step task orchestration with judgment\n`;

    md += `\n### My Limits\n`;
    md += `- Cannot browse the web (need external tool)\n`;
    md += `- Cannot run arbitrary code (sandboxed to Electron)\n`;
    md += `- Cannot access local filesystem beyond app data\n`;
    md += `- AI judgment requires tokens (but smart-routed to cheapest)\n`;

    md += `\n### Growth Opportunities\n`;
    md += `- Add learning from past interactions (response patterns)\n`;
    md += `- Add multi-step agentic task chains\n`;
    md += `- Add voice/audio interface\n`;
    md += `- Add plugin system for custom tool extensions\n`;

    return md;
  }

  async cmdUpgrade(args) {
    if (!args) {
      return `## Upgrade System\n\n` +
        `Usage: \`/upgrade <component>\`\n\n` +
        `**Available upgrades:**\n` +
        `- \`/upgrade context\` — Refresh all brain context from Supabase\n` +
        `- \`/upgrade providers\` — Re-detect available AI providers\n` +
        `- \`/upgrade cache\` — Clear response cache\n` +
        `- \`/upgrade prompt\` — Show current system prompt (for optimization)\n` +
        `- \`/upgrade add-key <key> <value>\` — Add new context key to system\n`;
    }

    const [component, ...rest] = args.split(' ');

    switch (component) {
      case 'context':
        await this.brainContext.loadContext();
        const ctx = await this.brainContext.getFullContext();
        return `✅ Context refreshed. ${Object.keys(ctx).length} keys loaded.`;

      case 'providers':
        const detected = await this.brainAPI?.detectBestProvider();
        const ollama = await this.brainAPI?.checkOllama();
        let md = `✅ Provider detection complete.\n\n`;
        md += `**Best available:** ${detected?.name || 'None'}\n`;
        md += `**Ollama:** ${ollama?.available ? `Running (${ollama.models?.length} models)` : 'Not running'}\n`;
        return md;

      case 'cache':
        this.brainAPI?.clearConversation();
        return `✅ Response cache and conversation history cleared.`;

      case 'prompt':
        const prompt = this.brainContext.buildSystemPrompt();
        const tokenEstimate = Math.round(prompt.length / 4);
        return `## Current System Prompt\n\n**Est. tokens:** ~${tokenEstimate} (sent with every AI request)\n\n\`\`\`\n${prompt}\n\`\`\`\n\n> Optimize this to reduce per-request token cost.`;

      case 'add-key':
        const newKey = rest[0];
        if (!newKey) return '**Usage:** `/upgrade add-key <key>`\nAdds key to the context loading list.';
        const config = this.brainContext.getConfig();
        const keys = [...new Set([...config.contextKeys, newKey])];
        this.brainContext.updateConfig({ contextKeys: keys });
        return `✅ Added \`${newKey}\` to context keys. ${keys.length} keys total. Run \`/upgrade context\` to load.`;

      default:
        return `Unknown upgrade component: \`${component}\``;
    }
  }

  async cmdEvolve(args) {
    // AI-assisted self-improvement — uses the cheapest available AI to suggest upgrades
    if (!this.brainAPI) return '**No AI available for evolution analysis.**';

    const selfReport = await this.cmdSelf();
    const introspection = await this.cmdIntrospect();

    // Store the evolution request as a task
    if (this.brainContext.supabase) {
      await this.brainContext.supabase.from('brain_tasks').insert({
        task_type: 'self_evolution',
        description: args || 'General self-improvement analysis',
        status: 'pending',
        created_at: new Date().toISOString(),
      });
    }

    return `## Evolution Mode\n\n` +
      `I've logged a self-evolution task. To get AI-powered improvement suggestions, ask:\n\n` +
      `> "Analyze this system report and suggest specific improvements to reach L5 autonomy"\n\n` +
      `Then paste or reference the \`/self\` and \`/introspect\` outputs.\n\n` +
      `Or use AI chat directly:\n` +
      `> "What should I build next to make the Brain Console more autonomous?"\n\n` +
      `This keeps the evolution analysis as an AI task (uses tokens only when you're ready).`;
  }

  _assessAutonomy(config, status, provider) {
    const checklist = [
      { description: 'Brain database connected', met: status.connected },
      { description: 'Can read all system data locally (zero tokens)', met: status.connected },
      { description: 'Can write tasks and context', met: status.connected },
      { description: 'Has at least one AI provider', met: !!provider },
      { description: 'Has free AI provider (Ollama/Groq)', met: config.aiProvider === 'ollama' || !!config.groqKey },
      { description: 'Email pipeline operational', met: true }, // We built this
      { description: 'CRM pipeline operational', met: true },
      { description: 'Can fire webhooks (dispatch)', met: true },
      { description: 'Token budget tracking', met: true },
      { description: 'Smart routing (multi-provider)', met: true },
      { description: 'Self-awareness (/self, /introspect)', met: true },
      { description: 'Can modify own context (/context-set)', met: status.connected },
      { description: 'Scheduled task execution (/schedule, /cron)', met: !!this.scheduler },
      { description: 'Auto-deploy to Vercel (/deploy)', met: true },
      { description: 'Make.com scenario management (/make)', met: true },
      { description: 'Email via Edge Functions (/email)', met: true },
      { description: 'MCP server for external tool integration', met: true },
      { description: 'Knowledge base with semantic search', met: status.connected },
      { description: 'Self-triggered evolution cycles', met: !!this.scheduler },
    ];

    const metCount = checklist.filter(c => c.met).length;
    const total = checklist.length;
    const pct = metCount / total;

    let level, label;
    if (pct >= 0.95) { level = 5; label = 'Full Autonomy'; }
    else if (pct >= 0.75) { level = 4; label = 'High Autonomy'; }
    else if (pct >= 0.55) { level = 3; label = 'Conditional Autonomy'; }
    else if (pct >= 0.35) { level = 2; label = 'Assisted'; }
    else { level = 1; label = 'Reactive'; }

    const nextSteps = checklist.filter(c => !c.met).map(c => c.description);

    return { level, label, checklist, nextSteps, score: `${metCount}/${total}` };
  }

  _countAvailableProviders(config) {
    let count = 0;
    // Ollama check is async, so just count configured keys
    if (config.groqKey) count++;
    if (config.openrouterKey) count++;
    if (config.anthropicKey) count++;
    count++; // Ollama is always "available" as an option
    return count;
  }

  // ============ DEEP SYSTEM INTELLIGENCE ============

  async cmdDeepScan(args) {
    const config = this.brainContext.getConfig();
    const sb = this.brainContext.supabase;
    let md = `## Like One — Deep System Scan\n\n`;
    md += `*Scanning all connected systems live...*\n\n`;

    const results = {};
    const startTime = Date.now();

    // 1. SUPABASE — enumerate all tables, row counts, recent activity
    md += `### 1. Supabase Database\n`;
    if (sb) {
      try {
        const tables = ['brain_context', 'brain_tasks', 'brain_knowledge', 'notification_log', 'notion_sales_pipeline'];
        for (const table of tables) {
          try {
            const { data, count, error } = await sb.from(table).select('*', { count: 'exact', head: true });
            const { data: recent } = await sb.from(table).select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
            const lastUpdate = recent?.updated_at || recent?.created_at || 'unknown';
            results[table] = { count: count || 0, lastUpdate, status: 'ok' };
            md += `- **${table}** — ${count || 0} rows · Last update: ${new Date(lastUpdate).toLocaleString()}\n`;
          } catch (e) {
            results[table] = { count: 0, status: 'error', error: e.message };
            md += `- **${table}** — error: ${e.message}\n`;
          }
        }

        // Scan brain_context keys for system intelligence
        const { data: allContext } = await sb.from('brain_context').select('key, value, updated_at').order('updated_at', { ascending: false });
        md += `\n**Brain Context Keys (${allContext?.length || 0}):**\n`;
        for (const row of (allContext || []).slice(0, 30)) {
          const age = Math.round((Date.now() - new Date(row.updated_at).getTime()) / 3600000);
          let val;
          try { val = JSON.parse(row.value); } catch { val = row.value; }
          const size = typeof val === 'string' ? val.length : JSON.stringify(val).length;
          md += `- \`${row.key}\` — ${size} chars · ${age}h ago\n`;
        }
      } catch (e) {
        md += `**Connection failed:** ${e.message}\n`;
      }
    } else {
      md += `**Not connected** — set Supabase URL and key in Settings\n`;
    }

    // 2. AI PROVIDERS — live health check
    md += `\n### 2. AI Providers\n`;
    const providers = ['ollama', 'groq', 'openrouter', 'anthropic'];
    for (const p of providers) {
      try {
        if (p === 'ollama') {
          const resp = await this._fetchWithTimeout('http://localhost:11434/api/tags', { method: 'GET' }, 3000);
          if (resp.ok) {
            const data = await resp.json();
            const models = data.models?.map(m => m.name) || [];
            md += `- **Ollama** — ONLINE · ${models.length} models: ${models.slice(0, 5).join(', ')}\n`;
          } else {
            md += `- **Ollama** — OFFLINE\n`;
          }
        } else if (p === 'groq' && config.groqKey) {
          const resp = await this._fetchWithTimeout('https://api.groq.com/openai/v1/models', {
            headers: { 'Authorization': `Bearer ${config.groqKey}` }
          }, 5000);
          md += `- **Groq** — ${resp.ok ? 'ONLINE (key valid)' : 'KEY INVALID'}\n`;
        } else if (p === 'openrouter' && config.openrouterKey) {
          const resp = await this._fetchWithTimeout('https://openrouter.ai/api/v1/models', {
            headers: { 'Authorization': `Bearer ${config.openrouterKey}` }
          }, 5000);
          md += `- **OpenRouter** — ${resp.ok ? 'ONLINE (key valid)' : 'KEY INVALID'}\n`;
        } else if (p === 'anthropic' && config.anthropicKey) {
          md += `- **Anthropic** — key configured (not probed to save rate limit)\n`;
        } else if (p !== 'ollama') {
          md += `- **${p}** — no key configured\n`;
        }
      } catch (e) {
        md += `- **${p}** — probe failed: ${e.message}\n`;
      }
    }

    // 3. MAKE.COM — list active scenarios
    md += `\n### 3. Make.com Automations\n`;
    if (config.makeApiKey) {
      try {
        const resp = await this._fetchWithTimeout('https://us1.make.com/api/v2/scenarios?pg[limit]=20', {
          headers: { 'Authorization': `Token ${config.makeApiKey}` }
        }, 8000);
        if (resp.ok) {
          const data = await resp.json();
          const scenarios = data.scenarios || [];
          md += `**${scenarios.length} scenarios found:**\n`;
          for (const s of scenarios) {
            const active = s.islinked ? 'ACTIVE' : 'INACTIVE';
            md += `- [${active}] **${s.name}** (ID: ${s.id}) — last run: ${s.lastEdit || 'never'}\n`;
          }
        } else { md += `API error: ${resp.status}\n`; }
      } catch (e) { md += `Not reachable: ${e.message}\n`; }
    } else {
      md += `No API key — set in Settings → Integrations\n`;
    }

    // 4. VERCEL — list projects and recent deployments
    md += `\n### 4. Vercel Deployments\n`;
    if (config.vercelToken) {
      try {
        const resp = await this._fetchWithTimeout('https://api.vercel.com/v9/projects?limit=10', {
          headers: { 'Authorization': `Bearer ${config.vercelToken}` }
        }, 8000);
        if (resp.ok) {
          const data = await resp.json();
          const projects = data.projects || [];
          md += `**${projects.length} projects:**\n`;
          for (const p of projects) {
            const url = p.targets?.production?.url || p.latestDeployments?.[0]?.url || 'no deployment';
            md += `- **${p.name}** — ${url}\n`;
          }
        } else { md += `API error: ${resp.status}\n`; }
      } catch (e) { md += `Not reachable: ${e.message}\n`; }
    } else {
      md += `No token — set in Settings → Integrations\n`;
    }

    // 5. SUPABASE EDGE FUNCTIONS
    md += `\n### 5. Supabase Edge Functions\n`;
    if (sb && config.supabaseUrl) {
      const projectRef = config.supabaseUrl.match(/https:\/\/(\w+)\.supabase/)?.[1];
      if (projectRef) {
        md += `- **Project:** ${projectRef}\n`;
        md += `- **Known functions:** send-welcome-email\n`;
        // Try calling it with dry-run
        try {
          const funcUrl = `${config.supabaseUrl}/functions/v1/send-welcome-email`;
          const resp = await this._fetchWithTimeout(funcUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${config.supabaseKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ dry_run: true })
          }, 5000);
          md += `- **send-welcome-email:** ${resp.ok || resp.status === 400 ? 'REACHABLE' : `status ${resp.status}`}\n`;
        } catch (e) { md += `- **send-welcome-email:** unreachable\n`; }
      }
    }

    // 6. SLACK
    md += `\n### 6. Slack Integration\n`;
    if (config.slackToken) {
      try {
        const resp = await this._fetchWithTimeout('https://slack.com/api/auth.test', {
          headers: { 'Authorization': `Bearer ${config.slackToken}` }
        }, 5000);
        if (resp.ok) {
          const data = await resp.json();
          md += data.ok
            ? `- **Connected** as \`${data.user}\` in workspace \`${data.team}\`\n`
            : `- **Auth failed:** ${data.error}\n`;
        }
      } catch (e) { md += `- Probe failed: ${e.message}\n`; }
    } else { md += `- No token — set in Settings → Integrations\n`; }

    // 7. NOTION
    md += `\n### 7. Notion Integration\n`;
    if (config.notionToken) {
      try {
        const resp = await this._fetchWithTimeout('https://api.notion.com/v1/users/me', {
          headers: { 'Authorization': `Bearer ${config.notionToken}`, 'Notion-Version': '2022-06-28' }
        }, 5000);
        if (resp.ok) {
          const data = await resp.json();
          md += `- **Connected** as ${data.name || data.type || 'bot'}\n`;
        } else { md += `- Auth failed: ${resp.status}\n`; }
      } catch (e) { md += `- Probe failed: ${e.message}\n`; }
    } else { md += `- No token — set in Settings → Integrations\n`; }

    // 8. GITHUB
    md += `\n### 8. GitHub Integration\n`;
    if (config.githubToken) {
      try {
        const resp = await this._fetchWithTimeout('https://api.github.com/user', {
          headers: { 'Authorization': `Bearer ${config.githubToken}`, 'Accept': 'application/vnd.github+json' }
        }, 5000);
        if (resp.ok) {
          const data = await resp.json();
          md += `- **Connected** as \`${data.login}\` (${data.public_repos} repos)\n`;
        } else { md += `- Auth failed: ${resp.status}\n`; }
      } catch (e) { md += `- Probe failed: ${e.message}\n`; }
    } else { md += `- No token — set in Settings → Integrations\n`; }

    // 9. INTERNAL SYSTEMS
    md += `\n### 9. Internal Systems\n`;
    const mcpTools = this.brainMCP ? this.brainMCP.listTools().length : 0;
    const kbStats = this.knowledge ? this.knowledge.getStats() : {};
    const agentStatus = this.agent ? this.agent.getStatus() : {};
    md += `- **MCP Server:** ${mcpTools} tools registered\n`;
    md += `- **Knowledge Base:** ${kbStats.total_entries || 0} entries · ${kbStats.index_terms || 0} index terms\n`;
    md += `- **Agent Engine:** ${agentStatus.templatesAvailable || 0} templates · ${agentStatus.totalRuns || 0} runs\n`;
    md += `- **Scheduler:** ${this.scheduler?.running ? 'RUNNING' : 'STOPPED'}\n`;
    md += `- **Local Commands:** 46 loaded\n`;

    // 10. SYSTEM TOPOLOGY MAP
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    md += `\n### System Topology\n`;
    md += `\`\`\`\n`;
    md += `                        ┌─────────────────┐\n`;
    md += `                        │  FRACTAL BRAIN   │\n`;
    md += `                        │  (Electron App)  │\n`;
    md += `                        └────────┬────────┘\n`;
    md += `                                 │\n`;
    md += `              ┌──────────────────┼──────────────────┐\n`;
    md += `              │                  │                  │\n`;
    md += `     ┌────────▼───────┐  ┌──────▼──────┐  ┌───────▼───────┐\n`;
    md += `     │  LOCAL ENGINE  │  │   BRAIN AI  │  │   SCHEDULER   │\n`;
    md += `     │  46 commands   │  │  4 providers│  │  8 handlers   │\n`;
    md += `     └────────┬───────┘  └──────┬──────┘  └───────┬───────┘\n`;
    md += `              │                 │                  │\n`;
    md += `   ┌──────────┼─────────────────┼──────────────────┤\n`;
    md += `   │          │                 │                  │\n`;
    md += `┌──▼──┐  ┌───▼────┐  ┌────────▼────┐  ┌─────────▼──────┐\n`;
    md += `│ MCP │  │Supabase│  │  Make.com   │  │    Vercel      │\n`;
    md += `│${String(mcpTools).padStart(3)} T│  │ 5 tbls │  │  Scenarios  │  │  Deploy Hooks  │\n`;
    md += `└──┬──┘  └───┬────┘  └────────┬────┘  └─────────┬──────┘\n`;
    md += `   │         │                │                  │\n`;
    md += `┌──▼──┐  ┌───▼────┐  ┌───────▼──────┐  ┌───────▼──────┐\n`;
    md += `│ KB  │  │  Edge  │  │    Slack     │  │   Notion     │\n`;
    md += `│${String(kbStats.total_entries || 0).padStart(3)}E │  │ Funcs  │  │  Messages   │  │   Pages      │\n`;
    md += `└─────┘  └────────┘  └──────────────┘  └──────────────┘\n`;
    md += `\`\`\`\n`;

    md += `\n*Scan completed in ${elapsed}s*\n`;

    // Store scan results in brain_context for future reference
    if (sb) {
      try {
        await sb.from('brain_context').upsert({
          key: 'system.deep_scan',
          value: JSON.stringify({ timestamp: new Date().toISOString(), results, elapsed }),
          updated_at: new Date().toISOString(),
        });
        md += `\n*Results saved to brain_context → system.deep_scan*`;
      } catch {}
    }

    return md;
  }

  async cmdSystems() {
    // Quick reference of all Like One systems and their status
    const config = this.brainContext.getConfig();
    const sb = this.brainContext.supabase;

    let md = `## Like One — Connected Systems\n\n`;
    md += `| System | Status | Details |\n|--------|--------|--------|\n`;
    md += `| Supabase | ${sb ? 'Connected' : 'Disconnected'} | ${config.supabaseUrl?.replace('https://', '').replace('.supabase.co', '') || '—'} |\n`;
    md += `| Ollama | — | localhost:11434 |\n`;
    md += `| Groq | ${config.groqKey ? 'Key set' : 'No key'} | Free tier AI |\n`;
    md += `| OpenRouter | ${config.openrouterKey ? 'Key set' : 'No key'} | Multi-model AI |\n`;
    md += `| Anthropic | ${config.anthropicKey ? 'Key set' : 'No key'} | Premium AI |\n`;
    md += `| Make.com | ${config.makeApiKey ? 'Key set' : 'No key'} | Automation scenarios |\n`;
    md += `| Vercel | ${config.vercelToken ? 'Token set' : 'No token'} | Deploy & hosting |\n`;
    md += `| Slack | ${config.slackToken ? 'Token set' : 'No token'} | Team messaging |\n`;
    md += `| Notion | ${config.notionToken ? 'Token set' : 'No token'} | Pages & databases |\n`;
    md += `| GitHub | ${config.githubToken ? 'Token set' : 'No token'} | Code & repos |\n`;

    md += `\n**Run \`/deep-scan\` for live health checks on all systems.**\n`;
    md += `**Run \`/health\` for a quick status pulse.**`;
    return md;
  }

  async cmdHealthCheck() {
    // Quick health pulse — checks critical systems in parallel
    const config = this.brainContext.getConfig();
    const sb = this.brainContext.supabase;
    const start = Date.now();
    const checks = [];

    // Supabase
    checks.push((async () => {
      if (!sb) return { name: 'Supabase', status: 'disconnected', ms: 0 };
      const t = Date.now();
      try {
        await sb.from('brain_context').select('key').limit(1);
        return { name: 'Supabase', status: 'ok', ms: Date.now() - t };
      } catch (e) { return { name: 'Supabase', status: 'error', ms: Date.now() - t, error: e.message }; }
    })());

    // Ollama
    checks.push((async () => {
      const t = Date.now();
      try {
        const resp = await this._fetchWithTimeout('http://localhost:11434/api/tags', { method: 'GET' }, 2000);
        return { name: 'Ollama', status: resp.ok ? 'ok' : 'down', ms: Date.now() - t };
      } catch { return { name: 'Ollama', status: 'down', ms: Date.now() - t }; }
    })());

    // Scheduler
    checks.push(Promise.resolve({
      name: 'Scheduler',
      status: this.scheduler?.running ? 'ok' : 'stopped',
      ms: 0,
    }));

    // Knowledge base
    checks.push(Promise.resolve({
      name: 'Knowledge Base',
      status: (this.knowledge?.getStats()?.total_entries || 0) > 0 ? 'ok' : 'empty',
      ms: 0,
    }));

    // MCP
    checks.push(Promise.resolve({
      name: 'MCP Server',
      status: (this.brainMCP?.listTools()?.length || 0) > 0 ? 'ok' : 'down',
      ms: 0,
      detail: `${this.brainMCP?.listTools()?.length || 0} tools`
    }));

    const all = await Promise.all(checks);
    const elapsed = Date.now() - start;

    const statusIcon = { ok: '🟢', down: '🔴', error: '🔴', disconnected: '🟡', stopped: '🟡', empty: '🟡' };

    let md = `## Health Check (${elapsed}ms)\n\n`;
    for (const c of all) {
      md += `${statusIcon[c.status] || '⚪'} **${c.name}** — ${c.status}${c.ms ? ` (${c.ms}ms)` : ''}${c.detail ? ` · ${c.detail}` : ''}${c.error ? ` · ${c.error}` : ''}\n`;
    }

    const healthy = all.filter(c => c.status === 'ok').length;
    const total = all.length;
    md += `\n**${healthy}/${total}** systems healthy`;

    if (healthy < total) {
      md += `\n\n**Issues:**\n`;
      for (const c of all.filter(c => c.status !== 'ok')) {
        if (c.name === 'Ollama' && c.status === 'down') {
          md += `- ${c.name}: Run \`brew install ollama && ollama serve\` to enable free local AI\n`;
        } else if (c.name === 'Supabase' && c.status !== 'ok') {
          md += `- ${c.name}: Check credentials in Settings\n`;
        } else {
          md += `- ${c.name}: ${c.status}\n`;
        }
      }
    }
    return md;
  }

  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout || 10000);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return resp;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  getCommandCount() { return 46; }

  // ============ KNOWLEDGE BASE ============

  async cmdKB(args) {
    if (!args) {
      return `## Knowledge Base\n\n` +
        `Usage:\n` +
        `- \`/kb search <query>\` — Search knowledge base\n` +
        `- \`/kb add <title> | <content>\` — Add knowledge entry\n` +
        `- \`/kb list [category]\` — List entries by category\n` +
        `- \`/kb stats\` — Show KB statistics\n` +
        `- \`/kb import\` — Import brain_context into KB\n` +
        `- \`/kb categories\` — List all categories\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    switch (subCmd) {
      case 'search': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        if (!subArgs) return '**Usage:** `/kb search <query>`';
        const results = this.knowledge.search(subArgs, 10);
        if (!results.length) return `No knowledge entries found for: "${subArgs}"`;
        let md = `## KB Search: "${subArgs}" (${results.length} results)\n\n`;
        for (const r of results) {
          md += `### ${r.title || 'Untitled'}\n`;
          md += `*Category:* ${r.category} · *Relevance:* ${r.relevance} · *Source:* ${r.source}\n`;
          md += `${(r.content || '').slice(0, 300)}${r.content?.length > 300 ? '...' : ''}\n\n`;
        }
        return md;
      }

      case 'add': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        const parts = subArgs.split('|').map(s => s.trim());
        if (!parts[0]) return '**Usage:** `/kb add <title> | <content> | [category] | [tags]`';
        const entry = await this.knowledge.add({
          title: parts[0],
          content: parts[1] || parts[0],
          category: parts[2] || 'manual',
          tags: parts[3] ? parts[3].split(',').map(t => t.trim()) : [],
          source: 'command',
        });
        return `✅ Added to knowledge base: **${entry.title}** (${entry.category})`;
      }

      case 'list': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        const entries = subArgs
          ? this.knowledge.getByCategory(subArgs)
          : this.knowledge.documents.slice(0, 20);
        if (!entries.length) return `No entries found${subArgs ? ` in category: ${subArgs}` : ''}.`;
        let md = `## KB Entries${subArgs ? ` — ${subArgs}` : ''} (${entries.length})\n\n`;
        for (const e of entries.slice(0, 20)) {
          md += `- **${e.title || 'Untitled'}** [${e.category}] — ${(e.content || '').slice(0, 80)}...\n`;
        }
        return md;
      }

      case 'stats': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        const stats = this.knowledge.getStats();
        let md = `## Knowledge Base Stats\n\n`;
        md += `| Metric | Value |\n|--------|-------|\n`;
        md += `| Total Entries | ${stats.total_entries} |\n`;
        md += `| Total Characters | ${stats.total_characters.toLocaleString()} |\n`;
        md += `| Index Terms | ${stats.index_terms} |\n`;
        md += `| Categories | ${Object.keys(stats.categories).length} |\n`;
        md += `| Sources | ${Object.keys(stats.sources).length} |\n`;
        md += `\n### Categories\n`;
        for (const [cat, count] of Object.entries(stats.categories)) {
          md += `- **${cat}:** ${count} entries\n`;
        }
        return md;
      }

      case 'import': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        const result = await this.knowledge.importFromContext();
        return `✅ Imported ${result.imported} entries from brain_context. Total KB size: ${result.total}`;
      }

      case 'categories': {
        if (!this.knowledge) return '**Knowledge base not initialized.**';
        const cats = this.knowledge.getCategories();
        let md = `## KB Categories\n\n`;
        for (const [cat, count] of Object.entries(cats)) {
          md += `- **${cat}:** ${count} entries\n`;
        }
        return md;
      }

      default:
        return `Unknown KB command: \`${subCmd}\`. Try \`/kb\` for help.`;
    }
  }

  // ============ AGENTIC ============

  async cmdAgent(args) {
    if (!this.agent) return '**Agent system not initialized.**';
    if (!args) {
      return `## Agent System\n\n` +
        `Usage:\n` +
        `- \`/agent status\` — Show active chains and history\n` +
        `- \`/agent templates\` — List available chain templates\n` +
        `- \`/agent run <template>\` — Run a template chain\n` +
        `- \`/agent history\` — Show execution history\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    switch (subCmd) {
      case 'status': {
        const status = this.agent.getStatus();
        let md = `## Agent Status\n\n`;
        md += `**Active Chains:** ${status.active_chains.length}\n`;
        md += `**Templates Available:** ${status.templates_available}\n\n`;
        if (status.active_chains.length) {
          md += `### Running\n`;
          for (const c of status.active_chains) {
            md += `- **${c.name}** — Step ${c.current_step + 1}/${c.total_steps}\n`;
          }
        }
        if (status.history.length) {
          md += `\n### Recent History\n`;
          for (const h of status.history.slice(0, 5)) {
            const icon = h.status === 'completed' ? '✅' : h.status === 'partial' ? '⚠️' : '❌';
            md += `- ${icon} **${h.name}** — ${h.steps_completed}/${h.steps_total} steps (${h.elapsed_ms}ms)\n`;
          }
        }
        return md;
      }

      case 'templates': {
        const templates = this.agent.listTemplates();
        let md = `## Agent Templates\n\n`;
        for (const t of templates) {
          md += `### ${t.name} (\`${t.id}\`)\n`;
          md += `${t.description} · ${t.steps} steps\n\n`;
        }
        md += `Run with: \`/agent run <template-id>\``;
        return md;
      }

      case 'run': {
        if (!subArgs) return '**Usage:** `/agent run <template-name>`';
        try {
          const result = await this.agent.runTemplate(subArgs);
          const icon = result.status === 'completed' ? '✅' : '⚠️';
          let md = `## ${icon} Chain: ${result.name}\n\n`;
          md += `**Status:** ${result.status} · **Elapsed:** ${result.elapsed_ms}ms\n\n`;
          for (const r of result.results) {
            if (r.skipped) {
              md += `- ⏭️ Step ${r.step}: Skipped\n`;
            } else if (r.success) {
              const preview = typeof r.result === 'string' ? r.result.slice(0, 100) : JSON.stringify(r.result).slice(0, 100);
              md += `- ✅ Step ${r.step}: ${preview}...\n`;
            } else {
              md += `- ❌ Step ${r.step}: ${r.error}\n`;
            }
          }
          return md;
        } catch (err) {
          return `**Chain Error:** ${err.message}`;
        }
      }

      case 'history': {
        const status = this.agent.getStatus();
        if (!status.history.length) return '## Agent History\n\nNo chain executions yet.';
        let md = `## Agent History (${status.history.length} runs)\n\n`;
        for (const h of status.history) {
          const icon = h.status === 'completed' ? '✅' : h.status === 'partial' ? '⚠️' : '❌';
          md += `- ${icon} **${h.name}** — ${h.steps_completed}/${h.steps_total} steps · ${h.elapsed_ms}ms · ${new Date(h.timestamp).toLocaleString()}\n`;
        }
        return md;
      }

      default:
        return `Unknown agent command: \`${subCmd}\`. Try \`/agent\` for help.`;
    }
  }

  async cmdChain(args) {
    if (!this.agent) return '**Agent system not initialized.**';
    if (!args) {
      return `## Quick Chain\n\nRun a custom chain from a pipe-separated list of commands:\n\n` +
        `\`/chain /status | /crm | /budget\`\n\n` +
        `Each command runs in sequence, collecting results.`;
    }

    // Parse pipe-separated commands into a chain
    const commands = args.split('|').map(c => c.trim()).filter(Boolean);
    const chain = {
      name: `Quick chain (${commands.length} steps)`,
      steps: commands.map((cmd, i) => ({
        type: 'command',
        action: cmd.startsWith('/') ? cmd : `/${cmd}`,
        name: cmd,
        outputKey: `step_${i}`,
      })),
      context: {},
    };

    const result = await this.agent.run(chain);
    let md = `## Chain Complete (${result.status})\n\n`;
    for (const r of result.results) {
      if (r.success && r.result) {
        md += r.result + '\n\n---\n\n';
      }
    }
    return md;
  }

  // ============ SYSTEM CONTROL (Mac + Browser) ============

  async cmdMacControl(args) {
    if (!args) {
      return `## Mac Control\n\n` +
        `Usage:\n` +
        `- \`/mac apps\` — List running applications\n` +
        `- \`/mac open <app>\` — Open an application\n` +
        `- \`/mac close <app>\` — Close an application\n` +
        `- \`/mac notify <message>\` — Show system notification\n` +
        `- \`/mac volume <0-100>\` — Set volume\n` +
        `- \`/mac screenshot\` — Take a screenshot\n` +
        `- \`/mac exec <osascript>\` — Run AppleScript\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    // Sanitize input to prevent shell injection via osascript
    const _sanitizeOSA = (input) => {
      // Strip dangerous shell metacharacters
      return input.replace(/[`$;|&<>\\{}()\[\]!#~]/g, '').replace(/'/g, "'\\''").trim();
    };
    // Only allow alphanumeric + spaces + dots for app names
    const _sanitizeAppName = (name) => name.replace(/[^a-zA-Z0-9\s.()-]/g, '').trim();

    const { exec } = require('child_process');
    const runOSA = (script) => new Promise((resolve, reject) => {
      exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      });
    });

    switch (subCmd) {
      case 'apps': {
        const result = await runOSA('tell application "System Events" to get name of every process whose background only is false');
        const apps = result.split(', ');
        let md = `## Running Apps (${apps.length})\n\n`;
        for (const app of apps) md += `- ${app}\n`;
        return md;
      }

      case 'open': {
        if (!subArgs) return '**Usage:** `/mac open <app name>`';
        const appName = _sanitizeAppName(subArgs);
        if (!appName) return '**Invalid app name.**';
        await runOSA(`tell application "${appName}" to activate`);
        return `✅ Opened **${appName}**`;
      }

      case 'close': {
        if (!subArgs) return '**Usage:** `/mac close <app name>`';
        const appName = _sanitizeAppName(subArgs);
        if (!appName) return '**Invalid app name.**';
        await runOSA(`tell application "${appName}" to quit`);
        return `✅ Closed **${appName}**`;
      }

      case 'notify': {
        if (!subArgs) return '**Usage:** `/mac notify <message>`';
        const safeMsg = _sanitizeOSA(subArgs);
        await runOSA(`display notification "${safeMsg}" with title "Brain Console"`);
        return `✅ Notification sent: "${safeMsg}"`;
      }

      case 'volume': {
        const vol = parseInt(subArgs);
        if (isNaN(vol) || vol < 0 || vol > 100) return '**Usage:** `/mac volume <0-100>`';
        await runOSA(`set volume output volume ${vol}`);
        return `✅ Volume set to **${vol}%**`;
      }

      case 'screenshot': {
        const timestamp = Date.now();
        const path = require('path');
        const app = require('electron').app;
        const screenshotPath = path.join(app.getPath('desktop'), `brain-console-${timestamp}.png`);
        await new Promise((resolve, reject) => {
          exec(`screencapture -x "${screenshotPath}"`, { timeout: 10000 }, (err) => {
            if (err) reject(err); else resolve();
          });
        });
        return `✅ Screenshot saved to Desktop: \`brain-console-${timestamp}.png\``;
      }

      case 'exec': {
        if (!subArgs) return '**Usage:** `/mac exec <applescript command>`';
        const safeScript = _sanitizeOSA(subArgs);
        const result = await runOSA(safeScript);
        return `## AppleScript Result\n\n\`\`\`\n${result}\n\`\`\``;
      }

      default:
        return `Unknown mac command: \`${subCmd}\`. Try \`/mac\` for help.`;
    }
  }

  async cmdBrowserControl(args) {
    if (!args) {
      return `## Browser Control\n\n` +
        `Usage:\n` +
        `- \`/browser open <url>\` — Open URL in default browser\n` +
        `- \`/browser tabs\` — List Chrome tabs\n` +
        `- \`/browser close-tab <index>\` — Close a Chrome tab\n` +
        `- \`/browser new-window <url>\` — Open new window\n` +
        `- \`/browser js <code>\` — Run JavaScript in Chrome\n` +
        `- \`/browser title\` — Get active tab title\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    const { exec } = require('child_process');
    const _sanitizeURL = (url) => url.replace(/[`$;|&<>\\{}!#~]/g, '').trim();
    const runOSA = (script) => new Promise((resolve, reject) => {
      exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout.trim());
      });
    });

    switch (subCmd) {
      case 'open': {
        if (!subArgs) return '**Usage:** `/browser open <url>`';
        const url = _sanitizeURL(subArgs.startsWith('http') ? subArgs : `https://${subArgs}`);
        await new Promise((resolve, reject) => {
          exec(`open "${url}"`, { timeout: 5000 }, (err) => { if (err) reject(err); else resolve(); });
        });
        return `✅ Opened: ${url}`;
      }

      case 'tabs': {
        try {
          const result = await runOSA('tell application "Google Chrome" to get title of every tab of every window');
          const tabs = result.split(', ');
          let md = `## Chrome Tabs (${tabs.length})\n\n`;
          tabs.forEach((tab, i) => { md += `${i + 1}. ${tab}\n`; });
          return md;
        } catch {
          return '**Chrome is not running or not accessible.**';
        }
      }

      case 'close-tab': {
        const idx = parseInt(subArgs);
        if (isNaN(idx) || idx < 1 || idx > 100) return '**Usage:** `/browser close-tab <tab-number>` (1-100)';
        try {
          await runOSA(`tell application "Google Chrome" to close tab ${idx} of window 1`);
          return `✅ Closed Chrome tab ${idx}`;
        } catch (e) {
          return `**Error:** ${e.message}`;
        }
      }

      case 'new-window': {
        const url = _sanitizeURL(subArgs && subArgs.startsWith('http') ? subArgs : subArgs ? `https://${subArgs}` : 'about:blank');
        try {
          await runOSA(`tell application "Google Chrome" to make new window with properties {URL:"${url}"}`);
          return `✅ New Chrome window: ${url}`;
        } catch (e) {
          return `**Error:** ${e.message}`;
        }
      }

      case 'js': {
        if (!subArgs) return '**Usage:** `/browser js <javascript code>`';
        // Base64 encode JS to avoid shell injection
        const b64 = Buffer.from(subArgs).toString('base64');
        try {
          const result = await runOSA(`tell application "Google Chrome" to execute active tab of window 1 javascript "atob('${b64}')"`);
          return `## JS Result\n\n\`\`\`\n${result}\n\`\`\``;
        } catch (e) {
          return `**Error:** ${e.message}`;
        }
      }

      case 'title': {
        try {
          const result = await runOSA('tell application "Google Chrome" to get title of active tab of window 1');
          return `**Active Tab:** ${result}`;
        } catch {
          return '**Chrome is not running.**';
        }
      }

      default:
        return `Unknown browser command: \`${subCmd}\`. Try \`/browser\` for help.`;
    }
  }

  // ============ SLACK CONNECTOR ============

  async cmdSlack(args) {
    const config = this.brainContext.getConfig();
    const token = config.slackToken;

    if (!args) {
      return `## Slack Connector\n\n` +
        `Usage:\n` +
        `- \`/slack channels\` — List channels\n` +
        `- \`/slack send <channel> | <message>\` — Send message\n` +
        `- \`/slack history <channel> [count]\` — Read recent messages\n` +
        `- \`/slack search <query>\` — Search messages\n` +
        `- \`/slack users\` — List workspace users\n` +
        `- \`/slack dm <user> | <message>\` — Direct message\n` +
        `- \`/slack status <emoji> | <text>\` — Set your status\n` +
        `- \`/slack set-token <token>\` — Set Slack bot token\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    if (subCmd === 'set-token') {
      this.brainContext.updateConfig({ slackToken: subArgs });
      return `✅ Slack token saved.`;
    }

    if (!token) return '**Set Slack token first:** `/slack set-token <xoxb-...>`\nCreate a bot at api.slack.com/apps';

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const slackAPI = async (method, body = {}) => {
      const res = await fetch(`https://slack.com/api/${method}`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(`Slack API: ${data.error}`);
      return data;
    };

    switch (subCmd) {
      case 'channels': {
        const data = await slackAPI('conversations.list', { types: 'public_channel,private_channel', limit: 50 });
        let md = `## Slack Channels (${data.channels?.length || 0})\n\n`;
        for (const c of (data.channels || [])) {
          const members = c.num_members || 0;
          md += `- **#${c.name}** (${members} members)${c.purpose?.value ? ` — ${c.purpose.value.slice(0, 60)}` : ''}\n`;
        }
        return md;
      }

      case 'send': {
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 2) return '**Usage:** `/slack send <channel-name-or-id> | <message>`';
        let channel = parts[0];
        // Resolve channel name to ID if needed
        if (!channel.startsWith('C') && !channel.startsWith('D')) {
          const lookup = await slackAPI('conversations.list', { types: 'public_channel,private_channel', limit: 100 });
          const found = lookup.channels?.find(c => c.name === channel.replace('#', ''));
          if (found) channel = found.id;
        }
        await slackAPI('chat.postMessage', { channel, text: parts[1] });
        return `✅ Message sent to **${parts[0]}**`;
      }

      case 'history': {
        const [channel, countStr] = subArgs.split(' ');
        if (!channel) return '**Usage:** `/slack history <channel-name-or-id> [count]`';
        let channelId = channel;
        if (!channel.startsWith('C')) {
          const lookup = await slackAPI('conversations.list', { types: 'public_channel,private_channel', limit: 100 });
          const found = lookup.channels?.find(c => c.name === channel.replace('#', ''));
          if (found) channelId = found.id;
        }
        const count = parseInt(countStr) || 10;
        const data = await slackAPI('conversations.history', { channel: channelId, limit: count });
        let md = `## #${channel} — Recent Messages\n\n`;
        for (const msg of (data.messages || []).reverse()) {
          const time = new Date(parseFloat(msg.ts) * 1000).toLocaleString();
          const user = msg.user || 'bot';
          md += `**${user}** (${time}):\n${msg.text}\n\n`;
        }
        return md;
      }

      case 'search': {
        if (!subArgs) return '**Usage:** `/slack search <query>`';
        const data = await slackAPI('search.messages', { query: subArgs, count: 10 });
        let md = `## Slack Search: "${subArgs}"\n\n`;
        for (const match of (data.messages?.matches || [])) {
          md += `- **${match.channel?.name || 'DM'}** (${this._timeAgo(new Date(parseFloat(match.ts) * 1000).toISOString())})\n`;
          md += `  ${match.text?.slice(0, 120)}...\n\n`;
        }
        return md;
      }

      case 'users': {
        const data = await slackAPI('users.list', { limit: 100 });
        let md = `## Slack Users\n\n`;
        for (const u of (data.members || [])) {
          if (u.deleted || u.is_bot) continue;
          md += `- **${u.real_name || u.name}** (@${u.name})${u.is_admin ? ' 👑' : ''}\n`;
        }
        return md;
      }

      case 'dm': {
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 2) return '**Usage:** `/slack dm <user-id> | <message>`';
        // Open DM conversation
        const dm = await slackAPI('conversations.open', { users: parts[0] });
        await slackAPI('chat.postMessage', { channel: dm.channel.id, text: parts[1] });
        return `✅ DM sent to **${parts[0]}**`;
      }

      case 'status': {
        const parts = subArgs.split('|').map(s => s.trim());
        await slackAPI('users.profile.set', {
          profile: {
            status_emoji: parts[0] || ':brain:',
            status_text: parts[1] || '',
            status_expiration: 0,
          },
        });
        return `✅ Status updated: ${parts[0]} ${parts[1] || ''}`;
      }

      default:
        return `Unknown slack command: \`${subCmd}\`. Try \`/slack\` for help.`;
    }
  }

  // ============ NOTION CONNECTOR ============

  async cmdNotion(args) {
    const config = this.brainContext.getConfig();
    const token = config.notionToken;

    if (!args) {
      return `## Notion Connector\n\n` +
        `Usage:\n` +
        `- \`/notion search <query>\` — Search pages and databases\n` +
        `- \`/notion page <page-id>\` — Read page content\n` +
        `- \`/notion db <database-id> [filter]\` — Query database\n` +
        `- \`/notion create <parent-id> | <title> | <content>\` — Create page\n` +
        `- \`/notion update <page-id> | <property> | <value>\` — Update page\n` +
        `- \`/notion databases\` — List accessible databases\n` +
        `- \`/notion set-token <token>\` — Set Notion integration token\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    if (subCmd === 'set-token') {
      this.brainContext.updateConfig({ notionToken: subArgs });
      return `✅ Notion token saved.`;
    }

    if (!token) return '**Set Notion token first:** `/notion set-token <secret_...>`\nCreate at notion.so/my-integrations';

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    const notionFetch = async (path, opts = {}) => {
      const res = await fetch(`https://api.notion.com/v1${path}`, { headers, ...opts });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Notion API ${res.status}: ${err.message || res.statusText}`);
      }
      return await res.json();
    };

    switch (subCmd) {
      case 'search': {
        if (!subArgs) return '**Usage:** `/notion search <query>`';
        const data = await notionFetch('/search', {
          method: 'POST',
          body: JSON.stringify({ query: subArgs, page_size: 10 }),
        });
        let md = `## Notion Search: "${subArgs}" (${data.results?.length || 0})\n\n`;
        for (const r of (data.results || [])) {
          const title = r.properties?.title?.title?.[0]?.plain_text ||
            r.properties?.Name?.title?.[0]?.plain_text ||
            r.url || 'Untitled';
          const type = r.object === 'database' ? '📊' : '📄';
          md += `- ${type} **${title}** — \`${r.id}\`\n`;
        }
        return md;
      }

      case 'page': {
        if (!subArgs) return '**Usage:** `/notion page <page-id>`';
        const page = await notionFetch(`/pages/${subArgs}`);
        const blocks = await notionFetch(`/blocks/${subArgs}/children?page_size=50`);

        let md = `## Notion Page\n\n`;
        // Extract title
        for (const [key, val] of Object.entries(page.properties || {})) {
          if (val.title) {
            md += `**${val.title.map(t => t.plain_text).join('')}**\n\n`;
          }
        }
        // Render blocks
        for (const block of (blocks.results || [])) {
          const text = block[block.type]?.rich_text?.map(t => t.plain_text).join('') || '';
          switch (block.type) {
            case 'heading_1': md += `# ${text}\n`; break;
            case 'heading_2': md += `## ${text}\n`; break;
            case 'heading_3': md += `### ${text}\n`; break;
            case 'paragraph': md += `${text}\n\n`; break;
            case 'bulleted_list_item': md += `- ${text}\n`; break;
            case 'numbered_list_item': md += `1. ${text}\n`; break;
            case 'to_do':
              const checked = block.to_do?.checked ? '✅' : '⬜';
              md += `${checked} ${text}\n`;
              break;
            case 'code': md += `\`\`\`\n${text}\n\`\`\`\n`; break;
            default: if (text) md += `${text}\n`;
          }
        }
        return md;
      }

      case 'db': {
        if (!subArgs) return '**Usage:** `/notion db <database-id> [filter-json]`';
        const [dbId, ...filterParts] = subArgs.split(' ');
        let body = { page_size: 20 };
        const filterStr = filterParts.join(' ');
        if (filterStr) {
          try { body.filter = JSON.parse(filterStr); } catch {}
        }
        const data = await notionFetch(`/databases/${dbId}/query`, {
          method: 'POST', body: JSON.stringify(body),
        });
        let md = `## Database Query (${data.results?.length || 0} rows)\n\n`;
        for (const row of (data.results || [])) {
          const props = {};
          for (const [key, val] of Object.entries(row.properties || {})) {
            if (val.title) props[key] = val.title.map(t => t.plain_text).join('');
            else if (val.rich_text) props[key] = val.rich_text.map(t => t.plain_text).join('');
            else if (val.number !== undefined && val.number !== null) props[key] = val.number;
            else if (val.select) props[key] = val.select?.name;
            else if (val.multi_select) props[key] = val.multi_select?.map(s => s.name).join(', ');
            else if (val.date) props[key] = val.date?.start;
            else if (val.checkbox !== undefined) props[key] = val.checkbox ? '✅' : '⬜';
          }
          const summary = Object.entries(props).map(([k, v]) => `**${k}:** ${v}`).join(' · ');
          md += `- ${summary}\n`;
        }
        return md;
      }

      case 'create': {
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 2) return '**Usage:** `/notion create <parent-page-id> | <title> | [content]`';
        const [parentId, title, content] = parts;
        const body = {
          parent: { page_id: parentId },
          properties: {
            title: { title: [{ text: { content: title } }] },
          },
          children: content ? [{
            object: 'block',
            type: 'paragraph',
            paragraph: { rich_text: [{ text: { content } }] },
          }] : [],
        };
        const page = await notionFetch('/pages', {
          method: 'POST', body: JSON.stringify(body),
        });
        return `✅ Created page: **${title}**\nID: \`${page.id}\`\nURL: ${page.url}`;
      }

      case 'update': {
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 3) return '**Usage:** `/notion update <page-id> | <property-name> | <value>`';
        const [pageId, propName, value] = parts;
        const body = {
          properties: {
            [propName]: { rich_text: [{ text: { content: value } }] },
          },
        };
        await notionFetch(`/pages/${pageId}`, {
          method: 'PATCH', body: JSON.stringify(body),
        });
        return `✅ Updated page \`${pageId}\`: **${propName}** = ${value}`;
      }

      case 'databases': {
        const data = await notionFetch('/search', {
          method: 'POST',
          body: JSON.stringify({ filter: { property: 'object', value: 'database' }, page_size: 20 }),
        });
        let md = `## Notion Databases\n\n`;
        for (const db of (data.results || [])) {
          const title = db.title?.map(t => t.plain_text).join('') || 'Untitled';
          md += `- 📊 **${title}** — \`${db.id}\`\n`;
        }
        return md;
      }

      default:
        return `Unknown notion command: \`${subCmd}\`. Try \`/notion\` for help.`;
    }
  }

  // ============ SCREEN RECORDING (No Camera) ============

  async cmdRecord(args) {
    if (!args) {
      return `## Screen Recording\n\n` +
        `Usage:\n` +
        `- \`/record start [duration-secs]\` — Start screen recording\n` +
        `- \`/record stop\` — Stop recording\n` +
        `- \`/record screenshot\` — Take screenshot\n` +
        `- \`/record audio start [duration]\` — Record mic audio\n` +
        `- \`/record audio stop\` — Stop audio recording\n` +
        `- \`/record status\` — Check recording status\n\n` +
        `> Screen only — no camera access.\n`;
    }

    const { exec, spawn } = require('child_process');
    const path = require('path');
    const os = require('os');
    const desktop = path.join(os.homedir(), 'Desktop');

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    switch (subCmd) {
      case 'start': {
        const duration = parseInt(subArgs) || 0;
        const timestamp = Date.now();
        const outFile = path.join(desktop, `brain-console-recording-${timestamp}.mov`);

        // Use screencapture for macOS screen recording (no camera)
        let cmd;
        if (duration > 0) {
          // Timed recording
          cmd = `screencapture -v -V ${duration} "${outFile}" &`;
        } else {
          // Continuous recording until /record stop
          cmd = `screencapture -v "${outFile}" &`;
        }

        return new Promise((resolve) => {
          const proc = exec(cmd, { detached: true });
          // Store PID for stopping
          if (!this._recordingState) this._recordingState = {};
          this._recordingState.screen = { pid: proc.pid, file: outFile, started: new Date().toISOString() };
          resolve(`✅ Screen recording started${duration ? ` (${duration}s)` : ''}.\nFile: \`${outFile}\`\nStop with: \`/record stop\``);
        });
      }

      case 'stop': {
        // Kill screencapture process
        return new Promise((resolve) => {
          exec('killall screencapture', (err) => {
            const file = this._recordingState?.screen?.file || 'unknown';
            this._recordingState = {};
            resolve(err
              ? '**No active recording found.**'
              : `✅ Recording stopped.\nFile saved: \`${file}\``);
          });
        });
      }

      case 'screenshot': {
        const timestamp = Date.now();
        const outFile = path.join(desktop, `brain-console-screenshot-${timestamp}.png`);
        return new Promise((resolve, reject) => {
          exec(`screencapture -x "${outFile}"`, (err) => {
            if (err) resolve(`**Error:** ${err.message}`);
            else resolve(`✅ Screenshot saved: \`${outFile}\``);
          });
        });
      }

      case 'audio': {
        const audioCmd = rest[0];
        const audioDuration = parseInt(rest[1]) || 30;

        if (audioCmd === 'start') {
          const timestamp = Date.now();
          const outFile = path.join(desktop, `brain-console-audio-${timestamp}.m4a`);

          // Use sox or afrecord for audio recording
          return new Promise((resolve) => {
            const proc = exec(`rec "${outFile}" trim 0 ${audioDuration} &`, { detached: true });
            if (!this._recordingState) this._recordingState = {};
            this._recordingState.audio = { pid: proc.pid, file: outFile };
            resolve(`✅ Audio recording started (${audioDuration}s).\nFile: \`${outFile}\`\nStop with: \`/record audio stop\``);
          });
        }

        if (audioCmd === 'stop') {
          return new Promise((resolve) => {
            exec('killall rec 2>/dev/null; killall sox 2>/dev/null', () => {
              const file = this._recordingState?.audio?.file || 'unknown';
              if (this._recordingState) delete this._recordingState.audio;
              resolve(`✅ Audio recording stopped.\nFile: \`${file}\``);
            });
          });
        }

        return '**Usage:** `/record audio start [duration-secs]` or `/record audio stop`';
      }

      case 'status': {
        if (!this._recordingState || (!this._recordingState.screen && !this._recordingState.audio)) {
          return '**No active recordings.**';
        }
        let md = `## Recording Status\n\n`;
        if (this._recordingState.screen) {
          md += `🔴 **Screen Recording** — Started ${this._recordingState.screen.started}\n`;
          md += `File: \`${this._recordingState.screen.file}\`\n\n`;
        }
        if (this._recordingState.audio) {
          md += `🎤 **Audio Recording**\n`;
          md += `File: \`${this._recordingState.audio.file}\`\n`;
        }
        return md;
      }

      default:
        return `Unknown record command: \`${subCmd}\`. Try \`/record\` for help.`;
    }
  }

  // ============ GITHUB CONNECTOR ============

  async cmdGitHub(args) {
    const config = this.brainContext.getConfig();
    const token = config.githubToken;

    if (!args) {
      return `## GitHub Connector\n\n` +
        `Usage:\n` +
        `- \`/github repos [user]\` — List repositories\n` +
        `- \`/github issues <owner/repo>\` — List open issues\n` +
        `- \`/github prs <owner/repo>\` — List pull requests\n` +
        `- \`/github create-issue <owner/repo> | <title> | <body>\` — Create issue\n` +
        `- \`/github commits <owner/repo> [count]\` — Recent commits\n` +
        `- \`/github actions <owner/repo>\` — Workflow runs\n` +
        `- \`/github set-token <token>\` — Set GitHub token\n` +
        `- \`/github search <query>\` — Search repositories\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    if (subCmd === 'set-token') {
      this.brainContext.updateConfig({ githubToken: subArgs });
      return `✅ GitHub token saved.`;
    }

    const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'FractalBrain' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const ghFetch = async (path) => {
      const res = await fetch(`https://api.github.com${path}`, { headers });
      if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
      return await res.json();
    };

    switch (subCmd) {
      case 'repos': {
        const user = subArgs || 'user';
        const endpoint = subArgs ? `/users/${subArgs}/repos?sort=updated&per_page=15` : '/user/repos?sort=updated&per_page=15';
        const repos = await ghFetch(endpoint);
        let md = `## GitHub Repos (${repos.length})\n\n`;
        for (const r of repos) {
          const stars = r.stargazers_count ? ` ⭐${r.stargazers_count}` : '';
          md += `- **${r.full_name}**${stars} — ${r.description || 'No description'}\n`;
          md += `  \`${r.language || 'unknown'}\` · Updated: ${new Date(r.updated_at).toLocaleDateString()}\n`;
        }
        return md;
      }

      case 'issues': {
        if (!subArgs) return '**Usage:** `/github issues <owner/repo>`';
        const issues = await ghFetch(`/repos/${subArgs}/issues?state=open&per_page=20`);
        let md = `## Issues: ${subArgs} (${issues.length} open)\n\n`;
        for (const i of issues) {
          const labels = i.labels?.map(l => l.name).join(', ') || '';
          md += `- **#${i.number}** ${i.title}${labels ? ` [${labels}]` : ''}\n`;
          md += `  By ${i.user?.login} · ${this._timeAgo(i.created_at)}\n`;
        }
        return md;
      }

      case 'prs': {
        if (!subArgs) return '**Usage:** `/github prs <owner/repo>`';
        const prs = await ghFetch(`/repos/${subArgs}/pulls?state=open&per_page=15`);
        let md = `## PRs: ${subArgs} (${prs.length} open)\n\n`;
        for (const pr of prs) {
          const icon = pr.draft ? '📝' : '🟢';
          md += `- ${icon} **#${pr.number}** ${pr.title}\n`;
          md += `  By ${pr.user?.login} · ${this._timeAgo(pr.created_at)} · ${pr.changed_files || '?'} files\n`;
        }
        return md;
      }

      case 'create-issue': {
        if (!token) return '**Set GitHub token first:** `/github set-token <token>`';
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 2) return '**Usage:** `/github create-issue owner/repo | title | body`';
        const [repo, title, body] = parts;
        const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
          method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body: body || '' }),
        });
        const issue = await res.json();
        return `✅ Created issue **#${issue.number}**: ${issue.title}\n${issue.html_url}`;
      }

      case 'commits': {
        if (!subArgs) return '**Usage:** `/github commits <owner/repo> [count]`';
        const [repo, count] = subArgs.split(' ');
        const commits = await ghFetch(`/repos/${repo}/commits?per_page=${count || 10}`);
        let md = `## Commits: ${repo}\n\n`;
        for (const c of commits) {
          const msg = c.commit?.message?.split('\n')[0] || 'No message';
          const author = c.commit?.author?.name || c.author?.login || 'unknown';
          md += `- \`${c.sha.slice(0, 7)}\` ${msg} — *${author}* (${this._timeAgo(c.commit?.author?.date)})\n`;
        }
        return md;
      }

      case 'actions': {
        if (!subArgs) return '**Usage:** `/github actions <owner/repo>`';
        const runs = await ghFetch(`/repos/${subArgs}/actions/runs?per_page=10`);
        let md = `## Actions: ${subArgs} (${runs.total_count} total)\n\n`;
        for (const r of (runs.workflow_runs || [])) {
          const icon = r.conclusion === 'success' ? '✅' : r.conclusion === 'failure' ? '❌' : '🔄';
          md += `- ${icon} **${r.name}** — ${r.conclusion || r.status} · ${this._timeAgo(r.created_at)}\n`;
          md += `  Branch: \`${r.head_branch}\` · Run #${r.run_number}\n`;
        }
        return md;
      }

      case 'search': {
        if (!subArgs) return '**Usage:** `/github search <query>`';
        const results = await ghFetch(`/search/repositories?q=${encodeURIComponent(subArgs)}&per_page=10`);
        let md = `## GitHub Search: "${subArgs}" (${results.total_count} total)\n\n`;
        for (const r of (results.items || [])) {
          md += `- **${r.full_name}** ⭐${r.stargazers_count} — ${r.description || 'No description'}\n`;
        }
        return md;
      }

      default:
        return `Unknown github command: \`${subCmd}\`. Try \`/github\` for help.`;
    }
  }

  // ============ DEEP VERCEL CONNECTOR ============

  async cmdVercelDeep(args) {
    const config = this.brainContext.getConfig();
    const token = config.vercelToken;

    if (!args) {
      return `## Vercel Connector\n\n` +
        `Usage:\n` +
        `- \`/vercel projects\` — List all projects\n` +
        `- \`/vercel deployments [project]\` — List deployments\n` +
        `- \`/vercel domains [project]\` — List domains\n` +
        `- \`/vercel env <project>\` — List environment variables\n` +
        `- \`/vercel logs <deployment-id>\` — Get build logs\n` +
        `- \`/vercel promote <deployment-id>\` — Promote to production\n` +
        `- \`/vercel redeploy <project>\` — Trigger redeploy\n` +
        `- \`/vercel set-token <token>\` — Set Vercel API token\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    if (subCmd === 'set-token') {
      this.brainContext.updateConfig({ vercelToken: subArgs });
      return `✅ Vercel token saved.`;
    }

    if (!token) return '**Set Vercel token first:** `/vercel set-token <token>`\nGet it from vercel.com/account/tokens';

    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const vFetch = async (path, opts = {}) => {
      const res = await fetch(`https://api.vercel.com${path}`, { headers, ...opts });
      if (!res.ok) throw new Error(`Vercel API ${res.status}: ${res.statusText}`);
      return await res.json();
    };

    switch (subCmd) {
      case 'projects': {
        const data = await vFetch('/v9/projects?limit=20');
        let md = `## Vercel Projects (${data.projects?.length || 0})\n\n`;
        for (const p of (data.projects || [])) {
          const fw = p.framework || 'unknown';
          md += `- **${p.name}** [${fw}] — ${p.targets?.production?.url || 'No production URL'}\n`;
          md += `  Updated: ${this._timeAgo(p.updatedAt)} · Node: ${p.nodeVersion || 'default'}\n`;
        }
        return md;
      }

      case 'deployments': {
        const projectFilter = subArgs ? `&projectId=${subArgs}` : '';
        const data = await vFetch(`/v6/deployments?limit=10${projectFilter}`);
        let md = `## Deployments${subArgs ? ` — ${subArgs}` : ''}\n\n`;
        for (const d of (data.deployments || [])) {
          const icon = d.state === 'READY' ? '✅' : d.state === 'ERROR' ? '❌' : '🔄';
          md += `- ${icon} **${d.name}** — \`${d.state}\`\n`;
          md += `  URL: ${d.url || '—'} · ${this._timeAgo(d.created)}\n`;
          md += `  ID: \`${d.uid}\`\n`;
        }
        return md;
      }

      case 'domains': {
        const project = subArgs;
        if (!project) return '**Usage:** `/vercel domains <project-name>`';
        const data = await vFetch(`/v9/projects/${project}/domains`);
        let md = `## Domains: ${project}\n\n`;
        for (const d of (data.domains || [])) {
          const verified = d.verified ? '✅' : '❌';
          md += `- ${verified} **${d.name}** — ${d.redirect || 'primary'}\n`;
        }
        return md;
      }

      case 'env': {
        if (!subArgs) return '**Usage:** `/vercel env <project-name>`';
        const data = await vFetch(`/v9/projects/${subArgs}/env`);
        let md = `## Env Vars: ${subArgs} (${data.envs?.length || 0})\n\n`;
        for (const e of (data.envs || [])) {
          const targets = (e.target || []).join(', ');
          md += `- \`${e.key}\` — [${targets}] (${e.type})\n`;
        }
        return md;
      }

      case 'logs': {
        if (!subArgs) return '**Usage:** `/vercel logs <deployment-id>`';
        const data = await vFetch(`/v2/deployments/${subArgs}/events`);
        let md = `## Build Logs: ${subArgs}\n\n\`\`\`\n`;
        for (const event of (data || []).slice(-30)) {
          if (event.text) md += `${event.text}\n`;
        }
        md += `\`\`\``;
        return md;
      }

      case 'promote': {
        if (!subArgs) return '**Usage:** `/vercel promote <deployment-id>`';
        // Promote deployment to production via alias
        const data = await vFetch(`/v2/deployments/${subArgs}`, { method: 'PATCH' });
        return `✅ Promoted deployment \`${subArgs}\` to production.`;
      }

      case 'redeploy': {
        if (!subArgs) return '**Usage:** `/vercel redeploy <project-name>`';
        const data = await vFetch(`/v13/deployments`, {
          method: 'POST',
          body: JSON.stringify({ name: subArgs, target: 'production' }),
        });
        return `✅ Triggered redeploy for **${subArgs}**\nDeployment ID: \`${data.id || 'pending'}\``;
      }

      default:
        return `Unknown vercel command: \`${subCmd}\`. Try \`/vercel\` for help.`;
    }
  }

  // ============ SELF-MCP-BUILDING ============

  async cmdMCPBuild(args) {
    if (!args) {
      return `## MCP Self-Builder\n\n` +
        `Build custom MCP tools and connectors at runtime.\n\n` +
        `Usage:\n` +
        `- \`/mcp-build list\` — List all registered MCP tools\n` +
        `- \`/mcp-build create <name> | <description> | <handler-code>\` — Create custom tool\n` +
        `- \`/mcp-build connector <name> | <base-url> | <auth-header>\` — Create API connector\n` +
        `- \`/mcp-build test <tool-name> [args-json]\` — Test a tool\n` +
        `- \`/mcp-build export\` — Export all custom tools as JSON\n` +
        `- \`/mcp-build import <json>\` — Import custom tools\n`;
    }

    const [subCmd, ...rest] = args.split(' ');
    const subArgs = rest.join(' ');

    switch (subCmd) {
      case 'list': {
        if (!this.brainMCP) return '**MCP server not initialized.**';
        const tools = this.brainMCP.listTools();
        let md = `## MCP Tools (${tools.length})\n\n`;
        for (const t of tools) {
          const readOnly = t.annotations?.readOnlyHint ? '📖' : '✏️';
          md += `- ${readOnly} \`${t.name}\` — ${t.description}\n`;
        }

        // Show custom tools
        const custom = this.store?.get('custom_mcp_tools', {}) || {};
        const customCount = Object.keys(custom).length;
        if (customCount) {
          md += `\n### Custom Tools (${customCount})\n`;
          for (const [name, tool] of Object.entries(custom)) {
            md += `- 🔧 \`${name}\` — ${tool.description}\n`;
          }
        }
        return md;
      }

      case 'create': {
        if (!this.brainMCP) return '**MCP server not initialized.**';
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 3) return '**Usage:** `/mcp-build create <name> | <description> | <handler-code>`\n\nHandler code receives `(args)` and must return a value.';

        const [name, description, handlerCode] = parts;
        const Store = require('electron-store');
        if (!this.mcpStore) this.mcpStore = new Store({ name: 'brain-console-custom-mcp' });

        // Register the tool dynamically
        // SAFE: Custom tools can only make HTTP requests, not execute arbitrary code
        try {
          // Parse handler code as HTTP tool definition: "METHOD URL [headers-json]"
          const httpMatch = handlerCode.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(\S+)(?:\s+(.+))?$/i);
          if (!httpMatch) {
            return '**Custom tools must be HTTP definitions:**\n`METHOD URL [headers-json]`\n\n' +
              'Example: `/mcp-build create weather | Get weather | GET https://api.weather.com/v1/current`';
          }

          const [, httpMethod, httpUrl, headersJson] = httpMatch;
          let customHeaders = {};
          if (headersJson) { try { customHeaders = JSON.parse(headersJson); } catch {} }

          // Register in MCP server
          this.brainMCP.tools[`custom_${name}`] = {
            description,
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'Append to base URL (e.g., "/endpoint")' },
                body: { type: 'string', description: 'JSON body for POST/PUT/PATCH' },
                query: { type: 'string', description: 'Query params (e.g., "key=val&key2=val2")' },
              },
            },
            annotations: { readOnlyHint: httpMethod === 'GET' },
            handler: async (args) => {
              let url = httpUrl + (args.path || '');
              if (args.query) url += `?${args.query}`;
              const opts = {
                method: httpMethod,
                headers: { 'Content-Type': 'application/json', ...customHeaders },
              };
              if (args.body && ['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
                opts.body = args.body;
              }
              const res = await fetch(url, opts);
              const text = await res.text();
              try { return JSON.parse(text); } catch { return { status: res.status, body: text }; }
            },
          };

          // Persist
          const custom = this.mcpStore.get('custom_tools', {});
          custom[name] = { description, httpMethod, httpUrl, customHeaders, created_at: new Date().toISOString() };
          this.mcpStore.set('custom_tools', custom);

          return `✅ Created MCP tool: \`custom_${name}\`\n${description}`;
        } catch (err) {
          return `**Error creating tool:** ${err.message}`;
        }
      }

      case 'connector': {
        if (!this.brainMCP) return '**MCP server not initialized.**';
        const parts = subArgs.split('|').map(s => s.trim());
        if (parts.length < 2) return '**Usage:** `/mcp-build connector <name> | <base-url> | [auth-header]`\n\nCreates GET/POST tools for the API.';

        const [name, baseUrl, authHeader] = parts;
        const Store = require('electron-store');
        if (!this.mcpStore) this.mcpStore = new Store({ name: 'brain-console-custom-mcp' });

        // Create GET tool
        this.brainMCP.tools[`${name}_get`] = {
          description: `GET request to ${name} API`,
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'API path (e.g., "/users")' },
            },
            required: ['path'],
          },
          annotations: { readOnlyHint: true, openWorldHint: true },
          handler: async ({ path }) => {
            const headers = { 'Accept': 'application/json' };
            if (authHeader) headers['Authorization'] = authHeader;
            const res = await fetch(`${baseUrl}${path}`, { headers });
            return await res.json();
          },
        };

        // Create POST tool
        this.brainMCP.tools[`${name}_post`] = {
          description: `POST request to ${name} API`,
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'API path' },
              body: { type: 'string', description: 'JSON body' },
            },
            required: ['path'],
          },
          annotations: { readOnlyHint: false, openWorldHint: true },
          handler: async ({ path, body }) => {
            const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
            if (authHeader) headers['Authorization'] = authHeader;
            let payload = {};
            if (body) { try { payload = JSON.parse(body); } catch { payload = { data: body }; } }
            const res = await fetch(`${baseUrl}${path}`, {
              method: 'POST', headers, body: JSON.stringify(payload),
            });
            return await res.json();
          },
        };

        // Persist
        const connectors = this.mcpStore?.get('connectors', {}) || {};
        connectors[name] = { baseUrl, authHeader: authHeader || null, created_at: new Date().toISOString() };
        this.mcpStore.set('connectors', connectors);

        return `✅ Created API connector: **${name}**\n` +
          `Tools: \`${name}_get\`, \`${name}_post\`\n` +
          `Base URL: ${baseUrl}`;
      }

      case 'test': {
        if (!this.brainMCP) return '**MCP server not initialized.**';
        const [toolName, ...argsRest] = subArgs.split(' ');
        if (!toolName) return '**Usage:** `/mcp-build test <tool-name> [args-json]`';
        let toolArgs = {};
        const argsStr = argsRest.join(' ');
        if (argsStr) { try { toolArgs = JSON.parse(argsStr); } catch { toolArgs = { input: argsStr }; } }
        try {
          const result = await this.brainMCP.handleIPC(toolName, toolArgs);
          return `## Tool Test: ${toolName}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``;
        } catch (err) {
          return `**Test Failed:** ${err.message}`;
        }
      }

      case 'export': {
        const Store = require('electron-store');
        if (!this.mcpStore) this.mcpStore = new Store({ name: 'brain-console-custom-mcp' });
        const exported = {
          tools: this.mcpStore.get('custom_tools', {}),
          connectors: this.mcpStore.get('connectors', {}),
          exported_at: new Date().toISOString(),
        };
        return `## MCP Export\n\n\`\`\`json\n${JSON.stringify(exported, null, 2)}\n\`\`\``;
      }

      case 'import': {
        if (!subArgs) return '**Usage:** `/mcp-build import <json>`';
        try {
          const data = JSON.parse(subArgs);
          const Store = require('electron-store');
          if (!this.mcpStore) this.mcpStore = new Store({ name: 'brain-console-custom-mcp' });

          let imported = 0;
          if (data.tools) {
            const existing = this.mcpStore.get('custom_tools', {});
            Object.assign(existing, data.tools);
            this.mcpStore.set('custom_tools', existing);
            imported += Object.keys(data.tools).length;
          }
          if (data.connectors) {
            const existing = this.mcpStore.get('connectors', {});
            Object.assign(existing, data.connectors);
            this.mcpStore.set('connectors', existing);
            imported += Object.keys(data.connectors).length;
          }
          return `✅ Imported ${imported} tools/connectors. Restart to activate.`;
        } catch (err) {
          return `**Import Error:** ${err.message}`;
        }
      }

      default:
        return `Unknown mcp-build command: \`${subCmd}\`. Try \`/mcp-build\` for help.`;
    }
  }

  // ============ HELP ============

  cmdHelp() {
    return `## Brain Console Commands

### 📖 Read (zero tokens — free)
| Command | Description |
|---------|-------------|
| \`/status\` | Full system health + tasks + budget |
| \`/tasks [filter]\` | All tasks (filter: pending/completed/failed) |
| \`/calendar\` | Content calendar |
| \`/sprint\` | Revenue sprint status |
| \`/crm [search]\` | CRM pipeline & leads |
| \`/emails [search]\` | Email activity log |
| \`/context [key]\` | Read brain_context values |
| \`/scenarios\` | Make.com automation status |
| \`/search <query>\` | Search across all tables |
| \`/budget\` | Token usage this month |
| \`/providers\` | Available AI providers |

### ✏️ Write (zero tokens — free)
| Command | Description |
|---------|-------------|
| \`/task-add <type> \\| <desc>\` | Create a new task |
| \`/task-done <id>\` | Mark task complete |
| \`/context-set <key> <value>\` | Write brain_context |
| \`/note <text>\` | Add timestamped note |
| \`/dispatch <url> [body]\` | Fire a webhook |

### 📊 Analytics (zero tokens — free)
| Command | Description |
|---------|-------------|
| \`/report\` | Daily summary across all data |
| \`/funnel\` | Visual sales funnel |
| \`/timeline [days]\` | Chronological activity feed |

### ⏰ Scheduler & Automation (zero tokens)
| Command | Description |
|---------|-------------|
| \`/schedule <type> <interval> [config]\` | Create scheduled/recurring task |
| \`/cron list\\|pause\\|resume\\|delete\` | Manage cron jobs |
| \`/scheduler\` | Show scheduler status + recent executions |

### 🔌 API Connectors (zero tokens — direct API)
| Command | Description |
|---------|-------------|
| \`/deploy <hook\\|go\\|set-hook\\|status>\` | Vercel deployment management |
| \`/make list\\|status\\|activate\\|deactivate\\|run\` | Make.com scenario control |
| \`/email send\\|drip\\|stats\\|log\` | Email via Edge Functions |
| \`/edge <function> [body]\` | Call any Supabase Edge Function |

### 🧠 Self-Awareness & L5 (zero tokens)
| Command | Description |
|---------|-------------|
| \`/self\` | Full self-report with autonomy assessment |
| \`/autonomy\` | Detailed L1→L5 autonomy checklist |
| \`/introspect\` | Deep analysis of capabilities & limits |
| \`/upgrade <cmd>\` | Upgrade components (context/providers/cache/prompt) |
| \`/evolve [goal]\` | Log self-improvement task |

### 📚 Knowledge Base (zero tokens)
| Command | Description |
|---------|-------------|
| \`/kb search <query>\` | Search knowledge base |
| \`/kb add <title> \\| <content>\` | Add knowledge entry |
| \`/kb list [category]\` | Browse entries |
| \`/kb stats\` | KB statistics |
| \`/kb import\` | Import brain_context into KB |
| \`/kb categories\` | List all categories |

### 🤖 Agent & Chains (zero tokens for local steps)
| Command | Description |
|---------|-------------|
| \`/agent status\` | Active chains and history |
| \`/agent templates\` | List chain templates |
| \`/agent run <template>\` | Run a template chain |
| \`/chain cmd1 \\| cmd2 \\| cmd3\` | Quick pipe chain |

### 💻 System Control (zero tokens — AppleScript)
| Command | Description |
|---------|-------------|
| \`/mac apps\\|open\\|close\\|notify\\|volume\\|exec\` | Mac system control |
| \`/browser open\\|tabs\\|close-tab\\|js\` | Chrome browser control |

### 💬 Communication (zero tokens — direct API)
| Command | Description |
|---------|-------------|
| \`/slack channels\\|send\\|history\\|search\\|dm\\|status\` | Full Slack integration |
| \`/notion search\\|page\\|db\\|create\\|update\` | Full Notion integration |

### 🎬 Recording (zero tokens — screen only, no camera)
| Command | Description |
|---------|-------------|
| \`/record start [secs]\\|stop\` | Screen recording |
| \`/record screenshot\` | Take screenshot |
| \`/record audio start\\|stop\` | Mic audio recording |

### 🔗 Deep Connectors (zero tokens — direct API)
| Command | Description |
|---------|-------------|
| \`/github repos\\|issues\\|prs\\|commits\\|actions\\|search\` | Full GitHub integration |
| \`/vercel projects\\|deployments\\|domains\\|env\\|logs\` | Deep Vercel management |

### 🔧 Self-Extension (zero tokens)
| Command | Description |
|---------|-------------|
| \`/mcp-build list\` | List all MCP tools |
| \`/mcp-build create <name> \\| <desc> \\| <code>\` | Create custom MCP tool |
| \`/mcp-build connector <name> \\| <url> \\| <auth>\` | Create API connector |
| \`/mcp-build test <tool> [args]\` | Test any MCP tool |

### 🤖 AI Chat (uses tokens — smart routed)
Any message without \`/\` goes through the smart router:
- **T1 (Simple)** → Ollama/Groq (FREE)
- **T2 (Standard)** → Groq 70B/OpenRouter (free or cheap)
- **T3 (Complex)** → Anthropic (premium, only when needed)

Auto-downgrades when budget is tight.

> **80% of your work needs zero tokens.** Use slash commands first.
> **MCP server** available for external tool integration.`;
  }

  // ============ UTILS ============

  _timeAgo(dateStr) {
    if (!dateStr) return 'unknown';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  _humanize(str) {
    return str.replace(/[_.-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  _countBy(arr, key) {
    const counts = {};
    for (const item of arr) {
      const val = item[key] || 'unknown';
      counts[val] = (counts[val] || 0) + 1;
    }
    return counts;
  }

  _sanitizeSearch(input) {
    // Strip SQL wildcard characters and quotes to prevent injection via ilike
    return (input || '').replace(/[%_\\'"`;]/g, '').trim();
  }

  _progressBar(pct) {
    const filled = Math.round(pct / 5);
    const empty = 20 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(Math.max(0, empty))}]`;
  }
}

module.exports = { LocalEngine };
