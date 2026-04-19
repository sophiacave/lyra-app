# Building the MVP

**Course:** Building AI Products
**Order:** 5
**Type:** lesson
**Access:** Premium

---
[Building AI Products](/academy/building-ai-products/)
  Lesson 5 of 10


  # Building the MVP

  Ship the smallest thing that delivers the full magic trick.
  An AI MVP isn't a stripped-down version of your vision. It's one perfect workflow that makes someone's jaw drop.


  ### What you'll learn


    - How to scope an AI MVP that ships in 2-4 weeks

    - The one-workflow rule for AI products

    - Handling AI failures gracefully

    - Building trust through transparency




  Principle
  ## The One-Workflow Rule

  Your MVP does one thing. Not three features. Not a platform. One workflow, end to end, from input to output. If your product summarizes documents, the MVP takes a PDF and returns a summary. That's the entire product on launch day.
  The temptation with AI is to build a "do anything" tool. Resist this. ChatGPT already exists. Your product wins by being the best at one specific job, not mediocre at twenty.


  Framework
  ## The AI MVP Checklist

  **Input capture:** How does the user give you data? File upload, text input, API connection, or screenshot. Make it frictionless. Every extra step is a drop-off point.
  **Processing:** Your AI pipeline. Prompt engineering, context assembly, model call, output parsing. This is your engine. Optimize for reliability over cleverness.
  **Output delivery:** How does the user get the result? In the UI, via email, as a downloadable file, through a Slack notification. Match the delivery to the user's workflow — don't make them come to you.
  **Error handling:** AI fails. Models hallucinate. Tokens run out. Your MVP must handle these gracefully. A clear error message and a retry button are minimum requirements.


  ### MVP Scope Example: AI Meeting Notes

  **In scope:** Upload recording → get structured notes with action items
  **Out of scope (for now):** Calendar integration, team sharing, search across meetings, live transcription
  **Why:** The magic trick is "recording in, notes out." Everything else is optimization.


  The Code
  ## A complete AI MVP in 30 lines.

  Here is the entire "AI Meeting Notes" MVP — from audio upload to structured output. This is a real, shippable product:


Python — AI Meeting Notes MVP (complete pipeline)

```
import anthropic
from pathlib import Path

client = anthropic.Anthropic()

def process_meeting(transcript: str) -> dict:
    # One prompt. One model call. One workflow. That's the MVP.
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system="""You are a meeting notes assistant. Extract structured notes.
Return JSON with exactly these keys:
- summary (2-3 sentences)
- decisions (list of decisions made)
- action_items (list of {owner, task, deadline})
- key_topics (list of topics discussed)""",
        messages=[{"role": "user", "content": transcript}]
    )
    return json.loads(response.content[0].text)

# That's it. Input → AI → Output. Ship it.
notes = process_meeting("Sarah: Let's move the launch to March 15...")
# → {"summary": "Team agreed to delay launch...",
#    "action_items": [{"owner": "Sarah", "task": "Update timeline", "deadline": "March 10"}],
#    ...}
```



    **This is a complete product.**
     Wrap it in a Next.js page with a file upload, call this function, and display the results. You have an AI product. Calendar integration, team sharing, search — all of that is post-MVP.



  Critical
  ## Handling AI Failures

  Your AI will be wrong sometimes. This isn't a bug — it's a fundamental property of probabilistic systems. The question isn't how to prevent failures, but how to design for them.
  **Show confidence levels** when appropriate. "I'm 90% sure this is a receipt for office supplies" is better than asserting it as fact. Let users correct errors easily — an "edit" button next to every AI output.
  **Never delete the original.** If your AI transforms, summarizes, or categorizes something, always keep the source accessible. Users need to verify. Make verification easy, not insulting.



### AI MVP — The Four Checklist Items

**Card 1:**
Front: Input Capture
Back: How does the user give you data? File upload, text input, API connection, screenshot. Make it frictionless — every extra step is a drop-off point.

**Card 2:**
Front: Processing
Back: Your AI pipeline: prompt engineering, context assembly, model call, output parsing. Optimize for reliability over cleverness.

**Card 3:**
Front: Output Delivery
Back: Match delivery to the user’s workflow — UI display, email, downloadable file, Slack notification. Don’t make users come to you.

**Card 4:**
Front: Error Handling
Back: AI fails. Models hallucinate. Tokens run out. Clear error messages and retry buttons are minimum requirements — never silently fail.


  Trust
  ## Transparency Builds Loyalty

  Tell users what your AI can and cannot do. Set expectations early. "This tool works best with English-language documents under 50 pages" is honest and builds trust. Overpromising and underdelivering is the fastest way to kill an AI product.
  Show the user what the AI did. If you summarized a document, highlight which sections the summary came from. If you categorized data, show the reasoning. Explainability isn't just ethical — it's good product design.


  Framework
  ## The Two-Week MVP Sprint

  A structured two-week sprint that takes you from validated idea to shippable product. Follow this timeline to avoid both under-building and over-engineering.
  **Days 1-2: Core pipeline.** Build the AI pipeline end-to-end with hardcoded inputs. Your system prompt, model call, and output parser should work perfectly on your test cases before you touch any UI. If the pipeline doesn't produce good results, nothing else matters.
  **Days 3-4: Input and output UI.** Build the minimum interface for users to provide input and receive output. One page. One form. One result view. No settings, no history, no profiles. Just the magic trick.
  **Days 5-6: Error handling and edge cases.** What happens when the input is too long? Too short? In the wrong format? What happens when the API times out? What happens when the model hallucinates? Handle every failure mode with a clear, helpful message.
  **Days 7-8: Auth and billing.** User signup, login, and a payment wall. Use Supabase Auth or Clerk for authentication. Use Stripe for billing. Don't build these from scratch — that's a months-long detour. Integrate existing services.
  **Days 9-10: Polish and testing.** Test with 5 real users. Watch them use it. Note where they get confused, stuck, or frustrated. Fix the top 3 issues. Don't fix everything — fix the biggest friction points.
  **Days 11-12: Deploy and monitor.** Ship to production. Set up error tracking (Sentry), analytics (PostHog or Mixpanel), and cost monitoring. You need to know what's happening from day one.
  **Days 13-14: Launch prep.** Write your launch post. Create 3 demo outputs to share. Prepare your Wave 1 invite list. You're ready.


  Pattern
  ## Prompt Engineering as Product Development

  Your system prompt is your product's brain. Treat prompt development with the same rigor you'd apply to code — versioned, tested, and iteratively improved.
  **Start with examples.** Include 2-3 examples of ideal input-output pairs in your system prompt. Few-shot examples improve output quality more reliably than verbose instructions. Show the model what "good" looks like instead of describing it abstractly.
  **Constrain the output format.** If you need JSON, say "Respond with valid JSON matching this schema:" and provide the schema. If you need bullet points, specify the format explicitly. Ambiguous format instructions produce inconsistent results that break your parser.
  **Version your prompts.** Store prompts in a config file or database, not hardcoded in your application. Tag each version. When you change a prompt, compare 20 outputs from the old version vs. the new version before deploying. A prompt that improves 15 outputs but ruins 5 is a net negative.
  **Test on your worst inputs.** Find the inputs that produce the worst outputs. These are your regression tests. Every prompt change must not make these worse. Build a test suite of 20-30 challenging inputs and run them before every prompt update.


  Critical
  ## MVP Infrastructure Checklist

  Beyond the product itself, your MVP needs operational infrastructure. Ship without these and you're flying blind.
  **Error tracking:** Sentry, LogRocket, or Bugsnag. You need to know when things break before your users tell you. AI failures are often silent — the model returns something, it's just wrong. Track model errors separately from application errors.
  **Cost monitoring:** Track API costs in real time. Set up alerts when daily spend exceeds your threshold. A single bug that sends requests in a loop can burn through your monthly budget in hours. Anthropic and OpenAI both provide usage dashboards — check them daily in week one.
  **Usage analytics:** Track every AI interaction — input length, output length, latency, model used, whether the user accepted or rejected the output. This data drives every optimization decision you'll make in the next six months.
  **Rate limiting:** Protect yourself from abuse and runaway costs. Limit free-tier users to 10 queries/day. Limit paid users to a reasonable number based on their plan. Always rate limit, even in beta.
  **Backup and recovery:** Your user data, prompt templates, and configuration must be backed up. Your AI provider's API key should be rotatable without downtime. If your database dies, recovery should take minutes, not days.


  Strategy
  ## The MVP Anti-Pattern Gallery

  These are the most common ways AI MVPs fail. Learn to recognize them so you can avoid them.
  **The Swiss Army Knife:** "Our MVP summarizes documents, generates emails, creates presentations, and analyzes data." That's four products, each of which will be mediocre. An MVP does one thing well. Period.
  **The Invisible AI:** "We'll add AI later — let's build the platform first." If AI is the core value proposition, building the platform without it means you're building a different product. The AI is the MVP. Everything else is scaffolding around it.
  **The Gold-Plated Prototype:** "Let me add user profiles, team collaboration, dark mode, and a notification system before launch." None of these make the core magic trick work better. Ship the magic trick. Add everything else when users demand it.
  **The Perfectionist's Trap:** "The AI output needs to be perfect before we show anyone." It will never be perfect. Ship at "good enough" — typically 75-80% quality — and let user feedback tell you where to focus improvement. Perfection in isolation is a mirage.
  **The Infrastructure Astronaut:** "We need Kubernetes, microservices, a custom ML pipeline, and a dedicated GPU cluster for our MVP." You need a Vercel deployment, a Supabase database, and one API key. Ship on simple infrastructure and scale when traffic demands it.


  Practical
  ## Testing Your MVP Before Launch

  AI products need a different testing approach than traditional software. Unit tests won't catch a hallucinating model. Integration tests won't catch a prompt that works on 90% of inputs but fails spectacularly on the other 10%.
  **Golden dataset testing:** Build a set of 30-50 representative inputs and their expected outputs. Run every prompt change against this golden dataset. Manually review the outputs. If more than 3 degrade significantly, the change isn't ready.
  **Edge case stress testing:** Feed your AI the worst possible inputs. Empty strings. 50,000-word documents. Non-English text. Gibberish. Malicious prompt injections. Your MVP doesn't need to handle all of these gracefully, but it must never crash, hang, or return nonsensical output without a clear error message.
  **User acceptance testing:** Give your MVP to 5 people who match your target user profile. Don't explain anything. Watch them use it. Where do they get confused? Where do they pause? Where do they express surprise (good or bad)? These observations reveal problems that no automated test can find.
  **Cost testing:** Run 100 synthetic queries through your production pipeline and check your AI provider's billing dashboard. Multiply by your expected daily usage. Is the cost sustainable? If 100 test queries cost $5 and you expect 1,000 queries/day from real users, that's $50/day or $1,500/month in AI costs alone. Know this number before you launch.


  Insight
  ## The MVP Mindset: Done Is Better Than Perfect

  Perfectionism kills more AI products than bad ideas do. The AI output will never be perfect. The UI will never be perfect. The onboarding will never be perfect. Shipping an imperfect product that solves a real problem is infinitely more valuable than a perfect product that lives on your localhost.
  Set a ship date. Write it on your wall. Work backwards from it. Everything that doesn't directly support the core magic trick gets cut. You can add it in version 2 — but only if version 1 proves the concept is worth version 2.
  The most successful AI products launched with embarrassingly limited functionality. Midjourney launched as a Discord bot. GitHub Copilot launched supporting only one IDE. They expanded based on user demand, not pre-launch ambition. Start small. Prove the magic. Expand from strength.


  ### Try It Yourself

  Define your MVP scope using this template:
  `My product takes [one specific input]
and produces [one specific output]
in under [time limit].

IN SCOPE: [the one workflow]
OUT OF SCOPE: [everything else — write it down so you don't creep]
FAILURE MODE: [what happens when the AI gets it wrong]`



### Quiz

**Q1: What is the One-Workflow Rule for AI MVPs?**
    A. The MVP should have one screen
  ✓ B. The MVP does one thing end-to-end — one workflow from input to output — not three features or a platform
    C. The MVP should use only one AI model
    D. The MVP should take only one week to build
  *ChatGPT already exists as the ‘do anything’ tool. Your product wins by being the best at one specific job. A document summarizer that takes a PDF and returns a summary — that is a complete MVP.*

**Q2: Why should you never delete the original content your AI transforms or summarizes?**
    A. It is required for legal compliance
  ✓ B. Users need to verify AI output — keeping the source accessible and making verification easy builds trust, not paranoia
    C. It helps debug AI errors
    D. It reduces storage costs
  *AI transforms content imperfectly. Users need to verify and compare. Preserving the original and making it easy to reference turns an AI-assisted workflow into one users can trust and adopt confidently.*

**Q3: What is the minimum requirement for handling AI failures in an MVP?**
    A. Automatic retry logic
  ✓ B. A clear error message and a retry button
    C. Rolling back to the previous version
    D. Sending the user an email notification
  *AI failures are expected behavior, not edge cases. A clear error message explains what happened; a retry button gives users agency. Silent failures with no explanation destroy trust and drive churn.*


  [← Previous: Architecture Decisions](/academy/building-ai-products/architecture-decisions/)
  [Next: User Experience for AI →](/academy/building-ai-products/user-experience-for-ai/)
