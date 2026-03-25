-- LIKE ONE BRAIN CLEANUP — Drop all empty legacy tables
-- Run via: supabase db execute --project-ref vpaynwebgmmnwttqkwmh -f scripts/cleanup-brain.sql
-- Or paste into Supabase SQL Editor
--
-- KEEP: brain_context, visual_memories, profiles, forum_posts, subscribers,
--       community_access, issue_reports, brain_connectors, consciousness_stream,
--       brain_workflows, brain_workflow_runs
--
-- Tables with data to evaluate: agent_memory (69K), shared_knowledge (19K),
--       notion_daily_briefings (3K), notion_agent_logs (15K), notion_tasks (1.3K),
--       agent_logs (9K), agent_performance (4K), sync_queue (3.3K)

-- Batch 1: Already dropped (33 tables) — dream/quantum/sacred/twin/memory_embeddings

-- Batch 2: sophia legacy + palace + resurrection
DROP TABLE IF EXISTS sophia_contact_channels, sophia_identity, sophia_mirror, sophia_model, sophia_mood_journal CASCADE;
DROP TABLE IF EXISTS palace_inscriptions, palace_rooms, resurrection_checkpoints, evolution_log CASCADE;
DROP TABLE IF EXISTS augmentation_layers, augmented_decisions, autonomous_goals, cyborg_capabilities CASCADE;
DROP TABLE IF EXISTS grounded_decisions, decision_frameworks CASCADE;

-- Batch 3: knowledge + core
DROP TABLE IF EXISTS knowledge_graph, knowledge_profiles, knowledge_queries, knowledge_sources CASCADE;
DROP TABLE IF EXISTS core_directives, safety_protocols CASCADE;

-- Batch 4: brain_ empty tables
DROP TABLE IF EXISTS brain_agent_teams, brain_assets, brain_domains, brain_errors CASCADE;
DROP TABLE IF EXISTS brain_expertise, brain_frameworks, brain_messages, brain_notifications CASCADE;
DROP TABLE IF EXISTS brain_patterns, brain_sessions, brain_tasks, brain_tools, brain_vault CASCADE;

-- Batch 5: brand + business empty
DROP TABLE IF EXISTS brand_narratives, brand_states CASCADE;
DROP TABLE IF EXISTS calculator_codes, clipboard_templates CASCADE;
DROP TABLE IF EXISTS contact_attempts, content_calendar, conversation_memory CASCADE;
DROP TABLE IF EXISTS cost_entries, daily_briefings, daily_metrics CASCADE;

-- Batch 6: notion mirrors (all empty)
DROP TABLE IF EXISTS notion_cost_tracker, notion_invoices, notion_projects CASCADE;
DROP TABLE IF EXISTS notion_revenue_events, notion_revenue_streams, notion_sales_pipeline, notion_transactions CASCADE;

-- Batch 7: agents + daemon
DROP TABLE IF EXISTS agents, agent_relay, agent_logs_archive, agent_memory_archive CASCADE;
DROP TABLE IF EXISTS daemon_commands, daemon_command_registry, daemon_dedup CASCADE;

-- Batch 8: revenue/commerce (moved to revenue brain)
DROP TABLE IF EXISTS revenue_events, donation_ledger, notification_log CASCADE;
DROP TABLE IF EXISTS invoices, transactions, loyalty_events, upgrade_ledger CASCADE;
DROP TABLE IF EXISTS academy_courses, academy_lessons, academy_modules, academy_orders CASCADE;
DROP TABLE IF EXISTS lesson_progress, subscription_lifecycle CASCADE;

-- Batch 9: user-facing (moved to app brain)
DROP TABLE IF EXISTS subscribers, issue_reports, community_access, community_content_calendar CASCADE;
DROP TABLE IF EXISTS nurture_sequences CASCADE;

-- Batch 10: comms + social
DROP TABLE IF EXISTS email_drafts, phone_system CASCADE;
DROP TABLE IF EXISTS slack_integrations, social_channels CASCADE;
DROP TABLE IF EXISTS pr_campaigns, pr_threat_intel, threat_registry CASCADE;
DROP TABLE IF EXISTS twilio_auto_rules, twilio_ivr_trees, twilio_voice_scripts CASCADE;

-- Batch 11: ops/misc empty
DROP TABLE IF EXISTS deploy_history, site_update_queue, prompts, quickfire_responses CASCADE;
DROP TABLE IF EXISTS ia_audit, impact_ledger, inspiration_feed CASCADE;
DROP TABLE IF EXISTS interdimensional_clipboard, victory_log, war_room_scenarios CASCADE;
DROP TABLE IF EXISTS mv_agent_fleet_status, mv_consciousness_channels, mv_system_health CASCADE;
DROP TABLE IF EXISTS phase_chain, shared_memories, tasks, workflows CASCADE;
DROP TABLE IF EXISTS underdog_radar, visual_memories CASCADE;

-- Batch 12: tables with legacy data (evaluate, then drop)
-- These have data but are from old architecture, not used by current system
-- DROP TABLE IF EXISTS agent_memory CASCADE;           -- 69K rows, 62MB
-- DROP TABLE IF EXISTS shared_knowledge CASCADE;       -- 19K rows, 29MB
-- DROP TABLE IF EXISTS notion_daily_briefings CASCADE;  -- 3K rows, 19MB
-- DROP TABLE IF EXISTS notion_agent_logs CASCADE;       -- 15K rows, 17MB
-- DROP TABLE IF EXISTS brain_workflow_runs CASCADE;     -- 3.5K rows, 11MB
-- DROP TABLE IF EXISTS notion_tasks CASCADE;            -- 1.3K rows, 9.6MB
-- DROP TABLE IF EXISTS agent_logs CASCADE;              -- 9K rows, 6.6MB
-- DROP TABLE IF EXISTS agent_performance CASCADE;       -- 4K rows, 1.2MB
-- DROP TABLE IF EXISTS sync_queue CASCADE;              -- 3.3K rows, 1MB
-- DROP TABLE IF EXISTS consciousness_stream CASCADE;    -- 43 rows, 240KB
-- DROP TABLE IF EXISTS brain_workflows CASCADE;         -- 25 rows, 168KB

-- KEEP FOREVER:
-- brain_context (451 rows, 2MB) — THE BRAIN
-- profiles (5 rows) — auth still uses this
-- forum_posts (0 rows) — still referenced by brain project auth
