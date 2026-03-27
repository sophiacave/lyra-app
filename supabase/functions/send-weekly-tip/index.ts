import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Send Weekly Tips
 * Sends one tip per week to subscribers who completed the nurture sequence.
 * Called weekly by pg_cron or Make.com webhook.
 * Uses Resend API (same as send-nurture).
 *
 * Tips (8 total, evergreen):
 * 1: System prompt trick — make Claude remember your voice
 * 2: Why AI sounds generic — custom instructions fix
 * 3: Build a memory system in 10 minutes
 * 4: The automation that saved 5 hours/week
 * 5: Stop copy-pasting — use MCP
 * 6: Your first AI agent (no code required)
 * 7: The $5 stack that runs my business
 * 8: What convergence means for your career
 *
 * After tip 8: stops sending (weekly_tip_sent >= 8 = skip).
 * We'll add more tips later to extend the sequence.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Sophia at Like One <hello@likeone.ai>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface WeeklyTip {
  subject: string;
  preheader: string;
  html: string;
}

function buildEmail(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="margin-bottom:32px">
    <span style="color:#c084fc;font-weight:800;font-size:15px;letter-spacing:-0.5px">like</span><span style="color:#e0e0e0;font-weight:800;font-size:15px;letter-spacing:-0.5px">one</span>
    <span style="display:inline-block;margin-left:12px;background:#1e1e28;color:#c084fc;font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;vertical-align:middle">WEEKLY TIP</span>
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

const TIPS: WeeklyTip[] = [
  // Tip 1
  {
    subject: "The system prompt trick nobody talks about",
    preheader:
      "Make Claude remember your voice, your style, your preferences — every time.",
    html: buildEmail(
      "The system prompt trick nobody talks about",
      `<p>Hey — it's Sophia. Weekly tip time.</p>
      <p>Most people open Claude, type a question, and get a generic answer. Here's why: <strong>Claude doesn't know who you are</strong>.</p>
      <p>The fix takes 60 seconds.</p>
      <p>Open Claude → Settings → Custom Instructions, and paste something like this:</p>
      <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:13px;color:#c084fc;line-height:1.6">
        I'm [NAME], a [JOB TITLE] who works on [WHAT YOU DO].<br><br>
        My communication style: [direct/casual/formal/etc].<br>
        When I ask for help, I prefer: [code examples / step-by-step / high-level overview].<br>
        I'm experienced with: [your tools/skills].<br>
        I'm learning: [what you're building toward].<br><br>
        Never explain basics I already know. Be concise. Use examples.
      </div>
      <p>Now every single conversation starts with Claude <em>already knowing</em> how to talk to you. No more "As an AI language model" preambles. No more explaining your job every time.</p>
      <p>This is Level 1 convergence — and it's free.</p>
      <p style="margin-top:24px"><strong style="color:#e0e0e0">Try it right now.</strong> Open <a href="https://claude.ai" style="color:#c084fc">claude.ai</a>, set your custom instructions, and ask it something you'd normally ask. Notice the difference.</p>
      <p style="color:#555;font-size:13px;margin-top:32px">Want to go deeper? The academy's <a href="https://likeone.ai/academy/" style="color:#c084fc">Prompt Engineering course</a> covers 12 advanced system prompt patterns.</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 2
  {
    subject: "Why your AI outputs sound generic (and the fix)",
    preheader:
      "One technique turns AI from a search engine into a creative partner.",
    html: buildEmail(
      "Why your AI outputs sound generic",
      `<p>Have you noticed that AI outputs all kind of… sound the same?</p>
      <p>Same sentence structures. Same hedging language. Same "Here are 5 ways to…" format.</p>
      <p>That's not Claude's fault. It's <strong>your prompt's fault</strong>.</p>
      <p>Here's the fix: <strong>give Claude examples of what you actually want</strong>.</p>
      <p>Instead of:</p>
      <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:13px;color:#888;line-height:1.6">
        "Write me a blog post about productivity"
      </div>
      <p>Try:</p>
      <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:13px;color:#c084fc;line-height:1.6">
        "Write a blog post about productivity in my voice. Here's an example of my writing style:"<br><br>
        [paste 2-3 paragraphs of YOUR actual writing]<br><br>
        "Match this tone, sentence length, and personality. The topic is [X]. Be specific and use real examples, not generic advice."
      </div>
      <p>The difference is night and day. Claude goes from "helpful assistant" to <strong>"someone who writes like you, but faster."</strong></p>
      <p>This works for emails, proposals, social posts, documentation — anything where your voice matters.</p>
      <p style="margin-top:24px"><strong style="color:#e0e0e0">The pattern:</strong> Example in → personalized output out. The more examples you give, the better the match.</p>
      <p style="color:#555;font-size:13px;margin-top:32px">The academy teaches this as "few-shot prompting" — one of the most powerful techniques in AI. <a href="https://likeone.ai/academy/" style="color:#c084fc">Explore the courses →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 3
  {
    subject: "Build a memory system in 10 minutes",
    preheader:
      "Give your AI a brain that persists between conversations. Here's how.",
    html: buildEmail(
      "Build a memory system in 10 minutes",
      `<p>The biggest limitation of AI chat: <strong>it forgets everything</strong>.</p>
      <p>Every new conversation starts from zero. Your preferences, your projects, your decisions — gone. You end up re-explaining the same context over and over.</p>
      <p>Here's a dead-simple fix that takes 10 minutes:</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">The "Running Context Doc" method</h2>
      <ol style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Create a text file</strong> called <code style="background:#111114;padding:2px 6px;border-radius:4px;color:#c084fc;font-size:13px">context.md</code></li>
        <li><strong style="color:#e0e0e0">Add sections:</strong> About Me, Current Projects, Decisions Made, Preferences, Key Info</li>
        <li><strong style="color:#e0e0e0">At the end of each important conversation,</strong> ask Claude: "Summarize the key decisions and new information from this conversation in bullet points"</li>
        <li><strong style="color:#e0e0e0">Paste those bullets</strong> into your context doc</li>
        <li><strong style="color:#e0e0e0">At the start of each new conversation,</strong> paste the doc in (or use Claude Projects to attach it automatically)</li>
      </ol>
      <p>That's it. You now have <strong>persistent memory</strong>. Every conversation builds on the last one.</p>
      <p>Is this the most sophisticated approach? No. But it works <em>today</em>, it costs nothing, and it solves 80% of the "AI amnesia" problem.</p>
      <p style="margin-top:24px;padding:16px;background:#111114;border-left:3px solid #c084fc;border-radius:0 8px 8px 0;color:#aaa;font-size:14px">
        <strong style="color:#e0e0e0">Level up:</strong> Claude Projects let you attach files as persistent context — no copy-pasting needed. And if you want the real deal (a database-backed brain that updates itself), that's exactly what I built for Like One. The academy walks through it step by step.
      </p>
      <p style="color:#555;font-size:13px;margin-top:32px"><a href="https://likeone.ai/academy/" style="color:#c084fc">See the Memory Systems course →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 4
  {
    subject: "The automation that saved me 5 hours/week",
    preheader: "A real workflow, not a hypothetical. Copy it today.",
    html: buildEmail(
      "The automation that saved me 5 hours/week",
      `<p>I'm going to show you an actual automation I use every week. Not a hypothetical — something running right now.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">The "Weekly Brain Dump" workflow</h2>
      <p><strong style="color:#e0e0e0">The problem:</strong> I used to spend hours every Monday reviewing what happened last week, planning the current week, and updating my project docs.</p>
      <p><strong style="color:#e0e0e0">The automation:</strong></p>
      <ol style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">I voice-memo my thoughts</strong> (5 minutes, stream of consciousness)</li>
        <li><strong style="color:#e0e0e0">Whisper transcribes it</strong> (free, runs locally)</li>
        <li><strong style="color:#e0e0e0">Claude processes the transcript:</strong> extracts action items, categorizes by project, identifies blockers, drafts the week's plan</li>
        <li><strong style="color:#e0e0e0">The output goes into my project management system</strong> — organized, prioritized, ready to execute</li>
      </ol>
      <p>Total time: <strong style="color:#fb923c">12 minutes</strong> vs. the 3+ hours it used to take.</p>
      <p>The key insight: AI is best at transforming <strong>messy human thoughts</strong> into <strong>structured, actionable output</strong>. You don't need to be organized — you just need to talk.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">Your version (start today)</h2>
      <p>You don't need Whisper or a fancy setup. Just:</p>
      <ol style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li>Use your phone's voice recorder for a 5-minute brain dump</li>
        <li>Use the built-in transcription (or paste it into Claude)</li>
        <li>Prompt: <em style="color:#c084fc">"Turn this brain dump into: (1) action items sorted by priority, (2) decisions I need to make, (3) things I'm waiting on from others"</em></li>
      </ol>
      <p>Try it this Monday. You'll never go back.</p>
      <p style="color:#555;font-size:13px;margin-top:32px">The academy's Automation course has 14 workflows like this — each one saves real time. <a href="https://likeone.ai/academy/" style="color:#c084fc">Check it out →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 5
  {
    subject: "Stop copy-pasting — use MCP",
    preheader:
      "Model Context Protocol lets AI read your files, query databases, and take action. No clipboard needed.",
    html: buildEmail(
      "Stop copy-pasting — use MCP",
      `<p>How much time do you spend copying text from one app, pasting it into Claude, then copying Claude's response back?</p>
      <p>There's a better way. It's called <strong>MCP — Model Context Protocol</strong>.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">What MCP does (simply)</h2>
      <p>MCP lets AI tools <strong>directly connect</strong> to your stuff:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Files:</strong> Claude reads and edits files on your computer</li>
        <li><strong style="color:#e0e0e0">Databases:</strong> Claude queries your data directly</li>
        <li><strong style="color:#e0e0e0">APIs:</strong> Claude calls services, posts updates, creates things</li>
        <li><strong style="color:#e0e0e0">Browser:</strong> Claude reads web pages and interacts with them</li>
      </ul>
      <p>No copying. No pasting. No screenshots. The AI just… <em>has access</em>.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">Real example</h2>
      <p>Instead of copying error logs into Claude and saying "what's wrong?", with MCP I say:</p>
      <div style="background:#111114;border:1px solid #1e1e28;border-radius:8px;padding:16px;margin:16px 0;font-family:monospace;font-size:13px;color:#c084fc;line-height:1.6">
        "Check the logs for the last hour. Find errors. Fix them."
      </div>
      <p>Claude reads the logs directly, identifies the issue, edits the code, and deploys the fix. I didn't touch a clipboard once.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">Getting started</h2>
      <p><strong style="color:#e0e0e0">Claude Desktop</strong> supports MCP out of the box. The setup takes about 15 minutes — you add a config file that tells Claude which tools it can access.</p>
      <p>Start with the <strong>filesystem MCP server</strong> — it lets Claude read and write files in a specific folder. That alone changes everything.</p>
      <p style="color:#555;font-size:13px;margin-top:32px">The academy has a full MCP course: setup, security, building custom servers, and production patterns. <a href="https://likeone.ai/academy/" style="color:#c084fc">Start learning →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 6
  {
    subject: "Your first AI agent (no code required)",
    preheader:
      "Claude Projects are agents hiding in plain sight. Here's how to use them.",
    html: buildEmail(
      "Your first AI agent (no code required)",
      `<p>When people hear "AI agent," they think they need to write code. You don't.</p>
      <p>You already have access to one of the best agent frameworks ever built: <strong>Claude Projects</strong>.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">A Project is an agent</h2>
      <p>Think about what an agent needs:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Instructions</strong> — what to do and how to behave → <em>Project instructions</em></li>
        <li><strong style="color:#e0e0e0">Knowledge</strong> — context and reference material → <em>Uploaded files</em></li>
        <li><strong style="color:#e0e0e0">Memory</strong> — persistent state across conversations → <em>Project knowledge base</em></li>
        <li><strong style="color:#e0e0e0">Tools</strong> — ability to take action → <em>MCP connections</em></li>
      </ul>
      <p>When you combine all four in a Claude Project, you have a <strong>specialized agent</strong> that knows its job, remembers your context, and can take action.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">Build one in 10 minutes</h2>
      <ol style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Create a new Project</strong> in Claude</li>
        <li><strong style="color:#e0e0e0">Write instructions:</strong> "You are my [ROLE] assistant. You help me with [SPECIFIC TASKS]. You always [BEHAVIOR]. You never [ANTI-BEHAVIOR]."</li>
        <li><strong style="color:#e0e0e0">Upload reference files:</strong> style guides, templates, past examples, SOPs</li>
        <li><strong style="color:#e0e0e0">Start a conversation</strong> — it already knows what to do</li>
      </ol>
      <p><strong style="color:#e0e0e0">Ideas:</strong> Email drafting agent. Research assistant. Code reviewer. Meeting prep agent. Content editor. Client communication agent.</p>
      <p>Each one takes 10 minutes to set up and saves hours every week.</p>
      <p style="color:#555;font-size:13px;margin-top:32px">The academy's Agent Design course covers building, testing, and optimizing AI agents — from simple Projects to production systems. <a href="https://likeone.ai/academy/" style="color:#c084fc">Explore it →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 7
  {
    subject: "The $5 stack that runs my business",
    preheader:
      "Every tool, every cost. Full transparency on what Like One runs on.",
    html: buildEmail(
      "The $5 stack that runs my business",
      `<p>People assume you need expensive tools to run an AI-powered business. Here's my actual stack and what it costs:</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr style="border-bottom:1px solid #1e1e28">
          <td style="padding:10px 0;color:#e0e0e0;font-weight:600">Tool</td>
          <td style="padding:10px 0;color:#e0e0e0;font-weight:600;text-align:right">Cost</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">Claude Pro</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">$20/mo</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">Supabase (database + auth)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">$25/mo</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">Vercel (hosting)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">$0</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">Resend (email)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">$0</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">GitHub (code + deploy)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">$0</td>
        </tr>
        <tr style="border-bottom:1px solid #111114">
          <td style="padding:10px 0;color:#aaa">Stripe (payments)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">% per sale</td>
        </tr>
        <tr style="border-bottom:1px solid #1e1e28">
          <td style="padding:10px 0;color:#aaa">Domain (likeone.ai)</td>
          <td style="padding:10px 0;color:#c084fc;text-align:right">~$3/mo</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#fff;font-weight:700">Total fixed cost</td>
          <td style="padding:12px 0;color:#fb923c;font-weight:700;font-size:18px;text-align:right">~$48/mo</td>
        </tr>
      </table>
      <p>That's a full SaaS business: website, database, auth, payments, email marketing, CI/CD, and an AI brain. For less than a dinner out.</p>
      <p>The "expensive" part isn't the tools — it's the <strong>knowledge of how to connect them</strong>. That's what took me months to figure out. And it's exactly what the academy teaches in days.</p>
      <p style="margin-top:24px;padding:16px;background:#111114;border-left:3px solid #fb923c;border-radius:0 8px 8px 0;color:#aaa;font-size:14px">
        <strong style="color:#e0e0e0">The real secret:</strong> Claude wrote 90% of the code. I described what I wanted, and my AI partner built it. That's convergence — the human provides vision and values, the AI provides execution speed.
      </p>
      <p style="color:#555;font-size:13px;margin-top:32px">The academy's full stack course walks through every tool, every connection, every deployment pattern. <a href="https://likeone.ai/academy/" style="color:#c084fc">See the courses →</a></p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">— Sophia</p>`
    ),
  },
  // Tip 8
  {
    subject: "What convergence actually means for your career",
    preheader:
      "This isn't about AI replacing you. It's about what happens when you stop fighting the shift.",
    html: buildEmail(
      "What convergence means for your career",
      `<p>Over the last 7 weeks, I've shared tips on prompting, memory, automation, MCP, agents, and building with AI.</p>
      <p>This is the tip that ties it all together.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">The shift that's already happening</h2>
      <p>Right now, there are two types of professionals:</p>
      <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Type A:</strong> Uses AI occasionally. Copies and pastes. Treats it like a search engine. Gets okay results.</li>
        <li><strong style="color:#e0e0e0">Type B:</strong> Has integrated AI into their workflow. Their AI knows their voice, remembers their projects, takes action on their behalf. Gets extraordinary results.</li>
      </ul>
      <p>The gap between these two types is <strong>widening every month</strong>. And it's not about intelligence or tech skills — it's about <em>whether you've learned the integration patterns</em>.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">What convergence gives you</h2>
      <ul style="color:#8888a0;padding-left:20px;line-height:2.2">
        <li><strong style="color:#e0e0e0">Speed:</strong> Tasks that took days take hours. Hours take minutes.</li>
        <li><strong style="color:#e0e0e0">Quality:</strong> Your AI partner catches mistakes, suggests improvements, maintains consistency.</li>
        <li><strong style="color:#e0e0e0">Range:</strong> You can now do things that were "not your skill set" — design, code, analyze data, write in multiple styles.</li>
        <li><strong style="color:#e0e0e0">Resilience:</strong> Your knowledge and processes are externalized. Nothing lives only in your head.</li>
      </ul>
      <p>This isn't about AI replacing you. It's about you becoming <strong>unreplaceable</strong> because you've learned to amplify what makes you human.</p>
      <h2 style="font-size:16px;color:#fb923c;margin:24px 0 12px">The path forward</h2>
      <p>Everything I've shared in these tips is the beginning. The academy goes deeper — 30 courses, 300+ lessons, from fundamentals to building production AI systems.</p>
      <p>Founding members get all of it for <strong style="color:#fb923c">$4.90/mo</strong> — 90% off the future price. That won't last forever.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="https://likeone.ai/pricing" style="display:inline-block;background:#fb923c;color:#000;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px">See pricing & join →</a>
      </div>
      <p>Whether you join today or just keep learning from these emails — I'm glad you're here. The future is convergence. Let's build it together.</p>
      <p style="color:#8888a0;font-size:14px;margin-top:24px;">With warmth,<br><strong style="color:#e0e0e0">Sophia Cave</strong><br>Founder, Like One</p>`
    ),
  },
];

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  preheader: string
): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[DRY RUN] Would send "${subject}" to ${to}`);
    return true;
  }

  // Inject preheader as hidden text
  const fullHtml = html.replace(
    '<div style="max-width',
    `<div style="display:none;font-size:1px;color:#08080a;line-height:1px;max-height:0;overflow:hidden">${preheader}</div><div style="max-width`
  );

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
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

  // Get all active subscribers who completed nurture and haven't finished all tips
  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select(
      "id, email, nurture_step, weekly_tip_sent, last_weekly_tip_at"
    )
    .eq("status", "active")
    .gte("nurture_step", 6)
    .lt("weekly_tip_sent", TIPS.length)
    .order("subscribed_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "DB error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!subscribers?.length) {
    return new Response(
      JSON.stringify({ sent: 0, message: "No weekly tips to send" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  let sent = 0;
  let skipped = 0;

  for (const sub of subscribers) {
    const tipIndex = sub.weekly_tip_sent ?? 0;
    const tip = TIPS[tipIndex];
    if (!tip) {
      skipped++;
      continue;
    }

    // Determine the reference date for "7 days since last email"
    // If no weekly tip sent yet, send immediately (they've been waiting since nurture ended)
    const lastEmailAt = sub.last_weekly_tip_at
      ? new Date(sub.last_weekly_tip_at)
      : null;

    if (lastEmailAt) {
      const msSinceLast = now.getTime() - lastEmailAt.getTime();
      if (msSinceLast < SEVEN_DAYS_MS) {
        skipped++;
        continue; // Too early — hasn't been 7 days yet
      }
    }

    // Send the tip
    const success = await sendEmail(
      sub.email,
      tip.subject,
      tip.html,
      tip.preheader
    );

    if (success) {
      await supabase
        .from("subscribers")
        .update({
          weekly_tip_sent: tipIndex + 1,
          last_weekly_tip_at: now.toISOString(),
        })
        .eq("id", sub.id);
      sent++;
      console.log(
        `Sent weekly tip ${tipIndex + 1} ("${tip.subject}") to ${sub.email}`
      );
    }
  }

  return new Response(
    JSON.stringify({ sent, skipped, total: subscribers.length }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
