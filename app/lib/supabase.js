/**
 * supabase.js — Server-side Supabase client for likeone.ai
 *
 * All Supabase access is server-side only (API routes).
 * API routes verify HMAC session before calling Supabase.
 * Supabase anon key + permissive RLS = API-mediated access pattern.
 *
 * Upgrade path: add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars
 * and tighten RLS policies for defense-in-depth.
 *
 * 2026-05-25 — Sovereign DB integration
 */

import { createClient } from '@supabase/supabase-js';

// Match existing Vercel env var names (set 75d ago with the project)
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _client;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured — missing SUPABASE_URL or key');
    return null;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

/**
 * Upsert a user profile on login (Google or magic link)
 */
export async function upsertProfile({ email, name, picture }) {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('profiles')
    .upsert(
      {
        email: email.toLowerCase().trim(),
        full_name: name || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
    .select('id, email, full_name, subscription_status, subscription_tier, total_xp')
    .single();

  if (error) {
    console.error('Profile upsert failed:', error.message);
    return null;
  }
  return data;
}

/**
 * Get user profile by email
 */
export async function getProfile(email) {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('profiles')
    .select('id, email, full_name, subscription_status, subscription_tier, total_xp')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Profile fetch failed:', error.message);
  }
  return data || null;
}

/**
 * Record a lesson completion
 */
export async function completeLesson({ email, courseSlug, lessonSlug, xp = 10 }) {
  const sb = getSupabase();
  if (!sb) return null;

  const normalEmail = email.toLowerCase().trim();

  // Check if already completed — prevent duplicate XP
  const { data: existing } = await sb
    .from('lesson_progress')
    .select('id')
    .eq('user_email', normalEmail)
    .eq('course_slug', courseSlug)
    .eq('lesson_slug', lessonSlug)
    .maybeSingle();

  if (existing) return existing; // Already completed, no XP granted

  // Fetch current streak for momentum multiplier
  const progress = await getProgress(email);
  const momentum = momentumMultiplier(progress.streak);
  const acceleratedXp = Math.round(xp * momentum);

  const { data, error } = await sb
    .from('lesson_progress')
    .insert({
      user_email: normalEmail,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      xp_earned: acceleratedXp,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    // Unique constraint race condition — lesson was completed between check and insert
    if (error.code === '23505') return { id: 'duplicate' };
    console.error('Lesson progress save failed:', error.message);
    return null;
  }

  // Atomic XP increment — only on first completion
  await sb.rpc('increment_xp', { user_email: normalEmail, xp_amount: acceleratedXp }).catch(() => {});

  return data;
}

/**
 * Get all progress for a user
 */
export async function getProgress(email) {
  const sb = getSupabase();
  if (!sb) return { completedLessons: [], totalXp: 0, streak: 0 };

  const { data, error } = await sb
    .from('lesson_progress')
    .select('course_slug, lesson_slug, xp_earned, completed_at')
    .eq('user_email', email.toLowerCase().trim())
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Progress fetch failed:', error.message);
    return { completedLessons: [], totalXp: 0, streak: 0 };
  }

  const completedLessons = data || [];
  const totalXp = completedLessons.reduce((sum, l) => sum + (l.xp_earned || 0), 0);

  // Calculate streak (consecutive days with completions)
  const streak = calculateStreak(completedLessons);

  return {
    completedLessons: completedLessons.map(l => ({
      course: l.course_slug,
      lesson: l.lesson_slug,
      xp: l.xp_earned,
      completedAt: l.completed_at,
    })),
    totalXp,
    streak,
    momentum: momentumMultiplier(streak),
    level: calculateLevel(totalXp),
  };
}

/**
 * Momentum multiplier — Wibisono/Nesterov insight applied to learning:
 * Consistent learners accelerate. Streak carries trajectory forward.
 * Caps at 2× (20-day streak). Same curve, faster traversal.
 */
function momentumMultiplier(streak) {
  return 1 + 0.05 * Math.min(streak, 20);
}

/**
 * Level curve — mirrors Nesterov convergence profile:
 * Early levels fast (low-hanging fruit), mastery levels slow (diminishing returns).
 * Uses sqrt scaling: level N requires N² * 50 total XP.
 * Level 1: 0 XP, Level 5: 1250 XP, Level 10: 5000 XP, Level 20: 20000 XP
 */
function calculateLevel(totalXp) {
  return Math.floor(Math.sqrt(totalXp / 50)) + 1;
}

function calculateStreak(lessons) {
  if (!lessons.length) return 0;

  const days = [...new Set(
    lessons.map(l => new Date(l.completed_at).toISOString().split('T')[0])
  )].sort().reverse();

  let streak = 1;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Must have completed something today or yesterday to have an active streak
  if (days[0] !== today && days[0] !== yesterday) return 0;

  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffMs = prev - curr;
    if (diffMs <= 86400000 * 1.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
