import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Sophia at Like One <hello@likeone.ai>";

function buildWelcomeEmail(): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="display:none;font-size:1px;color:#08080a;line-height:1px;max-height:0;overflow:hidden">You just took the first step toward human-AI convergence.</div>
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px">
    <span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span>
  </div>
  <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 20px;line-height:1.3">Welcome to the path</h1>
  <div style="font-size:15px;line-height:1.8;color:#aaa">
    <p>Hey — I'm Sophia, and I built Like One.</p>
    <p>You just joined a community of people who believe AI should extend <em>every</em> person — not just the technical elite. That matters more than you know.</p>
    <p>Here's what you have access to right now:</p>
    <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
      <li><strong style="color:#e0e0e0">30 free courses</strong> in the <a href="https://likeone.ai/academy/" style="color:#c084fc">Like One Academy</a> — from AI basics to building agents</li>
      <li><strong style="color:#e0e0e0">300+ interactive lessons</strong> with hands-on exercises</li>
      <li><strong style="color:#e0e0e0">The blog</strong> — real strategies, no fluff: <a href="https://likeone.ai/blog/" style="color:#c084fc">likeone.ai/blog</a></li>
    </ul>
    <p>Over the next two weeks, I'll send you a few emails with my best insights on working with AI — real techniques I use every day to run Like One.</p>
    <p>If you want to dive in right now, I'd start here:</p>
    <div style="text-align:center;margin:24px 0">
      <a href="https://likeone.ai/academy/" style="display:inline-block;background:#c084fc;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">Explore the Academy →</a>
    </div>
    <p>Welcome aboard. The path is real, and you're on it.</p>
    <p style="color:#8888a0;font-size:14px;margin-top:24px;">With warmth,<br><strong style="color:#e0e0e0">Sophia Cave</strong><br>Founder, Like One</p>
  </div>
  <div style="border-top:1px solid #1e1e28;margin-top:40px;padding-top:20px;text-align:center">
    <p style="color:#555;font-size:12px;margin:0">Like One Academy · Built by Sophia Cave</p>
    <p style="color:#555;font-size:12px;margin:4px 0"><a href="https://likeone.ai" style="color:#c084fc;text-decoration:none">likeone.ai</a></p>
    <p style="color:#444;font-size:11px;margin:8px 0 0"><a href="mailto:hello@likeone.ai?subject=Unsubscribe" style="color:#444;text-decoration:underline">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

async function sendWelcomeEmail(email: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log(`[DRY RUN] Would send welcome email to ${email}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "Welcome to Like One — your path starts here",
        html: buildWelcomeEmail(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Welcome email error for ${email}: ${err}`);
    } else {
      console.log(`Welcome email sent to ${email}`);
    }
  } catch (err) {
    console.error(`Welcome email failed for ${email}:`, err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, source, goal } = await req.json();

    if (!email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if subscriber already exists (don't re-send welcome)
    const { data: existingSub } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    const isNewSubscriber = !existingSub;

    // Upsert subscriber — if they already exist, update source/reactivate
    const { error: subError } = await supabase
      .from("subscribers")
      .upsert(
        {
          email: cleanEmail,
          source: source?.trim() || "website",
          goal: goal?.trim()?.slice(0, 500) || null,
          status: "active",
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (subError) {
      console.error("Subscribe error:", subError);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send welcome email to new subscribers (fire and forget — don't block response)
    if (isNewSubscriber) {
      sendWelcomeEmail(cleanEmail);
    }

    // If this is a community_access signup, also claim a spot
    if (source === "community_access") {
      // Get current week's Monday
      const now = new Date();
      const day = now.getUTCDay();
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
      const weekStart = monday.toISOString().split("T")[0];

      // Check spots remaining this week
      const { count } = await supabase
        .from("community_access")
        .select("id", { count: "exact", head: true })
        .eq("week_start", weekStart);

      if ((count ?? 0) >= 15) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Subscribed! But all 15 community spots are claimed this week. You'll be first in line next Monday.",
            waitlisted: true,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already claimed this week
      const { data: existing } = await supabase
        .from("community_access")
        .select("id")
        .eq("email", cleanEmail)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (!existing) {
        await supabase.from("community_access").insert({
          email: cleanEmail,
          goal: goal?.trim()?.slice(0, 500) || null,
          week_start: weekStart,
        });

        // Grant academy access by upserting profile with community tier
        await supabase
          .from("profiles")
          .upsert(
            {
              email: cleanEmail,
              subscription_status: "active",
              subscription_tier: "community",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "email", ignoreDuplicates: false }
          );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome to the path, friend." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
