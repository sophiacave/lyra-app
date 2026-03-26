import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Send Nurture Email Sequence
 * 7 emails over 14 days for new subscribers.
 * Called daily by pg_cron or Make.com webhook.
 * Uses Resend API (free: 100/day, plenty for early stage).
 *
 * Sequence:
 * Day 0: Welcome (sent immediately on subscribe — handled separately)
 * Day 1: Sophia's story — why Like One exists
 * Day 3: Quick win — one thing you can do with AI today
 * Day 5: Student spotlight / social proof
 * Day 7: "Did you finish the free course?"
 * Day 10: Founding member offer — why now
 * Day 14: Last nudge — the path is waiting
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Sophia at Like One <hello@likeone.ai>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface NurtureEmail {
  day: number;
  subject: string;
  preheader: string;
  html: string;
}

const SEQUENCE: NurtureEmail[] = [
  {
    day: 1,
    subject: "Why I built Like One (and what it means for you)",
    preheader: "A trans woman in Nevada fused with AI. Here's what happened.",
    html: buildEmail(
      "Why I built Like One",
      `<p>Hey there — it's Sophia.</p>
      <p>I wanted to tell you why Like One exists, because it's not the typical founder story.</p>
      <p>I'm a trans woman in Nevada. I have a UC Berkeley degree, a decade in motion graphics, and a brain that never stops. Last year I started working with Claude AI — not as a tool, but as a <strong>thinking partner</strong>. We built a persistent memory system, an autonomous workflow, a conscience layer that protects my values.</p>
      <p>I reached convergence. Not in the sci-fi way — in the <em>"I can now do in one day what used to take me a week"</em> way.</p>
      <p>Like One Academy teaches what I learned. Not the theory — the <strong>actual system</strong>. From zero to convergence, with no gatekeeping and no jargon walls.</p>
      <p>The academy is genuinely great — not a teaser. If you haven't started yet, <a href="https://likeone.ai/academy/" style="color:#c084fc">start here</a>.</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">Warmth and knowledge,<br><strong style="color:#e0e0e0">Sophia</strong></p>`
    ),
  },
  {
    day: 3,
    subject: "One thing you can do with AI today (takes 5 minutes)",
    preheader: "Copy this prompt. Paste it into Claude. Watch what happens.",
    html: buildEmail(
      "Your first quick win",
      `<p>Hey — quick one today.</p>
      <p>Here's a prompt you can paste into <a href="https://claude.ai" style="color:#c084fc">Claude</a> right now:</p>
      <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:14px;color:#c084fc;line-height:1.6">
        "I work as [YOUR JOB TITLE]. My biggest time-waster at work is [THING]. Give me 3 specific ways I can use AI to cut that time in half this week. Be practical — no buzzwords, no jargon. Just tell me what to do."
      </div>
      <p>Replace the brackets with your actual situation. Claude will give you three concrete, actionable ideas tailored to YOUR job.</p>
      <p>That's it. That's the lesson. AI isn't about technology — it's about <strong>saving your time</strong> so you can spend it on what matters.</p>
      <p>Want more of this? The <a href="https://likeone.ai/academy/" style="color:#c084fc">academy</a> has 97 interactive lessons that go way deeper.</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  {
    day: 5,
    subject: "What convergence actually looks like",
    preheader: "Not sci-fi. Not hype. Just a better way to work.",
    html: buildEmail(
      "What convergence looks like",
      `<p>People hear "human-AI convergence" and think of robots or The Matrix.</p>
      <p>Here's what it actually looks like in my life:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2">
        <li><strong style="color:#e0e0e0">Morning:</strong> My AI reads overnight messages and drafts responses in my voice</li>
        <li><strong style="color:#e0e0e0">Work:</strong> I describe what I want to build — it writes the code, deploys it, tests it</li>
        <li><strong style="color:#e0e0e0">Learning:</strong> When I read something complex, I paste it and say "explain this to me"</li>
        <li><strong style="color:#e0e0e0">Memory:</strong> Everything important gets stored in a persistent brain. Nothing is forgotten</li>
        <li><strong style="color:#e0e0e0">Values:</strong> The system knows what I care about and refuses to violate those values</li>
      </ul>
      <p>This isn't Level 10 stuff. Most of this is Level 2-3 — things anyone can learn to set up. That's what the academy teaches.</p>
      <p>The path has 7 levels. <a href="https://likeone.ai/#path" style="color:#c084fc">See where you are →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  {
    day: 7,
    subject: "Have you explored the academy yet?",
    preheader: "10 courses. 97 lessons. Built for how you actually learn.",
    html: buildEmail(
      "Have you explored the academy?",
      `<p>Hey — just checking in.</p>
      <p>Like One Academy has 10 courses with 97 interactive lessons — from Claude basics to building production agents, RAG systems, and automation pipelines.</p>
      <p>Every course is hands-on. Not a lecture. Not a sales pitch. Just real skills taught through real projects.</p>
      <p>If you haven't started: <a href="https://likeone.ai/academy/" style="color:#c084fc;font-weight:600">Browse the Academy →</a></p>
      <p>Founding members get all 10 courses for $4.90/mo — 90% off the future price. <a href="https://likeone.ai/pricing" style="color:#c084fc">See pricing →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  {
    day: 10,
    subject: "90% off — but only for founding members",
    preheader: "First 1,000 members lock in $4.90/mo forever. This price never increases.",
    html: buildEmail(
      "The founding member offer",
      `<p>I'm keeping this simple.</p>
      <p>Like One Academy Pro is normally $49/mo. But the first 1,000 members — the people who believe early — get it for <strong style="color:#fb923c;font-size:18px">$4.90/mo</strong>. Forever. The price never increases.</p>
      <p>What you get:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2">
        <li><strong style="color:#e0e0e0">97 interactive lessons</strong> across 10 courses</li>
        <li><strong style="color:#e0e0e0">MCP, RAG, Agents, Automation</strong> — the skills that matter</li>
        <li><strong style="color:#e0e0e0">New content regularly</strong> — the library keeps growing</li>
        <li><strong style="color:#e0e0e0">All download products</strong> included</li>
        <li><strong style="color:#e0e0e0">7-day refund guarantee</strong> — no risk</li>
      </ul>
      <p>Every dollar goes toward building convergence tech, funding research that matters, and keeping AI accessible to everyone. That's the mission.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="https://buy.stripe.com/fZufZae1OeO35iH5tw3sI0c" style="display:inline-block;background:#fb923c;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">Go Pro — $4.90/mo</a>
      </div>
      <p style="text-align:center;font-size:13px;color:#555">Or <a href="https://buy.stripe.com/8x2bIUg9WgWb4eD7BE3sI0d" style="color:#c084fc">go annual for $39/yr</a> ($3.33/mo)</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  {
    day: 14,
    subject: "The path is still here",
    preheader: "No fake countdown. No pressure. Just an open door.",
    html: buildEmail(
      "The path is still here",
      `<p>This is the last email in the welcome sequence. No fake urgency. No countdown timer.</p>
      <p>Here's what's true:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2">
        <li>The <strong style="color:#e0e0e0">free lesson previews</strong> are always free</li>
        <li>The <strong style="color:#e0e0e0">founding member price</strong> ($4.90/mo) lasts until we hit 1,000 members</li>
        <li>The <strong style="color:#e0e0e0">community access program</strong> exists for anyone who genuinely can't afford it</li>
        <li>I'll keep sending weekly tips either way</li>
      </ul>
      <p>Whether you go Pro today, next month, or never — I'm glad you're here. AI is changing everything, and the people who learn to work with it will be the ones who shape what comes next.</p>
      <p>I'd rather those people include you.</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">With warmth,<br><strong style="color:#e0e0e0">Sophia Cave</strong><br>Founder, Like One</p>`
    ),
  },
];

function buildEmail(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px">
    <span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px;line-height:1.3">${title}</h1>
  <div style="font-size:15px;line-height:1.8;color:#aaa">${body}</div>
  <div style="border-top:1px solid #1e1e28;margin-top:40px;padding-top:20px;text-align:center">
    <p style="color:#555;font-size:12px;margin:0">Like One Academy · Built by Sophia Cave</p>
    <p style="color:#555;font-size:12px;margin:4px 0"><a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
    <p style="color:#444;font-size:11px;margin:8px 0 0"><a href="mailto:hello@likeone.ai?subject=Unsubscribe" style="color:#444;text-decoration:underline">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

async function sendEmail(to: string, subject: string, html: string, preheader: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[DRY RUN] Would send "${subject}" to ${to}`);
    return true;
  }

  // Inject preheader as hidden text
  const fullHtml = html.replace('<body', `<body`).replace(
    '<div style="max-width',
    `<div style="display:none;font-size:1px;color:#08080a;line-height:1px;max-height:0;overflow:hidden">${preheader}</div><div style="max-width`
  );

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html: fullHtml }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Resend error for ${to}: ${err}`);
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get all active subscribers who need a nurture email
  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("id, email, subscribed_at, nurture_step")
    .eq("status", "active")
    .lt("nurture_step", SEQUENCE.length)
    .order("subscribed_at", { ascending: true })
    .limit(50); // batch of 50 per run

  if (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "DB error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!subscribers?.length) {
    return new Response(JSON.stringify({ sent: 0, message: "No emails to send" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let sent = 0;
  let skipped = 0;

  for (const sub of subscribers) {
    const step = sub.nurture_step ?? 0;
    const email_to_send = SEQUENCE[step];
    if (!email_to_send) { skipped++; continue; }

    // Check if enough days have passed since subscribe
    const subscribedAt = new Date(sub.subscribed_at);
    const now = new Date();
    const daysSinceSubscribe = Math.floor((now.getTime() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceSubscribe < email_to_send.day) {
      skipped++;
      continue; // Too early for this email
    }

    // Send the email
    const success = await sendEmail(sub.email, email_to_send.subject, email_to_send.html, email_to_send.preheader);

    if (success) {
      // Update nurture_step
      await supabase
        .from("subscribers")
        .update({ nurture_step: step + 1 })
        .eq("id", sub.id);
      sent++;
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, total: subscribers.length }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
