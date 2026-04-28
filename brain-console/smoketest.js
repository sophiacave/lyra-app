// smoketest.js — run with: npx electron smoketest.js
const { app } = require('electron');
app.whenReady().then(async () => {
  const { BrainContext } = require('./brain-context');
  const bc = new BrainContext();
  await bc.initialize();
  let pass = 0, fail = 0;
  const ok = (n, msg) => { pass++; console.log(`✅ ${n}: ${msg}`); };
  const no = (n, msg) => { fail++; console.log(`❌ ${n}: ${msg}`); };

  // 1. Brain Explorer
  const entries = bc.getAllEntries();
  entries.length > 100 ? ok('Brain Explorer', `${entries.length} entries`) : no('Brain Explorer', `${entries.length}`);

  // 2. KB Stats
  const kbStats = bc.localBrain.kbStats();
  kbStats.totalEntries > 100 ? ok('Knowledge Base', `${kbStats.totalEntries} total`) : no('Knowledge Base', 'low');

  // 3. KB Search
  const search = bc.localBrain.kbSearch('stripe', 5);
  search.length > 0 ? ok('KB Search', `${search.length} results`) : no('KB Search', 'empty');

  // 4. Fleet
  const hb = bc.localBrain.getHeartbeats();
  ok('Fleet', `${hb.length} machines`);

  // 5. Orchestration
  const stats = bc.localBrain.getTaskStats();
  ok('Orchestration', `${stats.completed} done, ${stats.failed} failed`);

  // 6. Brain count
  ok('Brain', `${bc.localBrain.contextCount()} entries, SQLite sovereign`);

  // 7. Vault
  const vault = bc.localBrain.vaultList();
  ok('Vault', `${vault.length} entries`);

  // 8. Consulting
  const nahid = bc.localBrain.getContextByKey('consulting.client.nahid');
  nahid ? ok('Consulting', `Nahid: ${nahid.status}`) : no('Consulting', 'missing');

  // 9. Write round-trip
  bc.localBrain.upsertContext('test.smoke', { ok: true });
  const rb = bc.localBrain.getContextByKey('test.smoke');
  rb?.ok ? ok('Write', 'round-trip OK') : no('Write', 'FAILED');
  bc.localBrain.db.prepare("DELETE FROM brain_context WHERE key='test.smoke'").run();

  // 10. Shim compat
  const sr = await bc.supabase.from('brain_context').select('key').eq('key', 'session.active_work').single();
  sr.data ? ok('Shim', 'legacy compat') : no('Shim', 'broken');

  // 11. NEW TABLES EXIST
  const tables = ['brain_actions','brain_skills','brain_plans','brain_graph','brain_archive','brain_knowledge','brain_health','subscribers','profiles','agent_conversations','agent_tool_log'];
  let tableOk = 0;
  for (const t of tables) {
    try { bc.localBrain.db.prepare(`SELECT count(*) as c FROM ${t}`).get(); tableOk++; } catch {}
  }
  tableOk === tables.length ? ok('Tables', `${tableOk}/${tables.length} exist`) : no('Tables', `${tableOk}/${tables.length}`);

  // 12. Shim on new tables (brain_actions insert + read)
  try {
    await bc.supabase.from('brain_actions').insert({ id: 'test-1', action_type: 'test', target: 'smoketest', status: 'pending', created_at: new Date().toISOString() });
    const r = await bc.supabase.from('brain_actions').select('*').eq('id', 'test-1').single();
    r.data ? ok('Shim brain_actions', 'insert+read works') : no('Shim brain_actions', 'read failed');
    await bc.supabase.from('brain_actions').delete().eq('id', 'test-1');
  } catch(e) { no('Shim brain_actions', e.message); }

  // 13. Ollama
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'qwen3:14b', prompt: 'Say hi', stream: false, options: { num_predict: 5 } }),
      signal: AbortSignal.timeout(30000),
    });
    const d = await res.json();
    d.response ? ok('Ollama', `"${d.response.trim().slice(0,30)}"`) : no('Ollama', 'empty');
  } catch(e) { no('Ollama', e.message); }

  // 14. Version
  const pkg = require('./package.json');
  pkg.version === '6.0.0' ? ok('Version', '6.0.0') : no('Version', pkg.version);

  console.log(`\n${'='.repeat(40)}\nRESULT: ${pass}/${pass+fail} passed, ${fail} failed\n${'='.repeat(40)}`);
  bc.localBrain.close();
  app.quit();
});
