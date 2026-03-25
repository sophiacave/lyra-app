import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
    const { author_name, author_email, title, body, course_slug, parent_id } = await req.json();

    // Validate required fields
    if (!author_name?.trim() || !author_email?.trim() || !body?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Top-level posts need a title
    if (!parent_id && !title?.trim()) {
      return new Response(
        JSON.stringify({ error: "Title is required for new posts" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit: simple check — max 5 posts per email per hour
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("forum_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_email", author_email.trim().toLowerCase())
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 5) {
      return new Response(
        JSON.stringify({ error: "You're posting too quickly. Please wait a bit." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize — strip HTML tags from body and title
    const clean = (s: string) => s.replace(/<[^>]*>/g, "").trim();

    const insertData: Record<string, unknown> = {
      author_name: clean(author_name).slice(0, 100),
      author_email: author_email.trim().toLowerCase().slice(0, 255),
      body: clean(body).slice(0, 5000),
      course_slug: course_slug?.trim() || "general",
      is_pinned: false,
      is_faye_reply: false,
      upvotes: 0,
    };

    if (parent_id) {
      insertData.parent_id = parent_id;
    } else {
      insertData.title = clean(title!).slice(0, 200);
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save post. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, post: data }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Forum post error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
