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
    const { reporter_name, reporter_email, category, page_url, description } = await req.json();

    if (!reporter_name?.trim() || !reporter_email?.trim() || !description?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, and description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporter_email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Rate limit: max 3 reports per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("issue_reports")
      .select("id", { count: "exact", head: true })
      .eq("reporter_email", reporter_email.trim().toLowerCase())
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 3) {
      return new Response(
        JSON.stringify({ error: "Too many reports. Please wait before submitting another." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clean = (s: string) => s.replace(/<[^>]*>/g, "").trim();
    const validCategories = ["bug", "feature", "content", "other"];
    const cat = validCategories.includes(category) ? category : "other";

    const { error } = await supabase.from("issue_reports").insert({
      reporter_name: clean(reporter_name).slice(0, 100),
      reporter_email: reporter_email.trim().toLowerCase().slice(0, 255),
      category: cat,
      page_url: page_url?.trim()?.slice(0, 500) || null,
      description: clean(description).slice(0, 5000),
    });

    if (error) {
      console.error("Report issue error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit report. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Report submitted. Thank you for helping improve Like One!" }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Report issue error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
