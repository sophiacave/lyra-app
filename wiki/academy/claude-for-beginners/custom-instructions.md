# Claude Custom Instructions & Memory: Make Claude Remember You

**Course:** Claude for Beginners
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/claude-for-beginners/)
  Lesson 7 of 9


  # Custom Instructions & Memory.

  Teach Claude how you work once, and every conversation gets better automatically.


  ### After this lesson you'll know


    - What custom instructions are and why they matter

    - How to build your own custom instructions (hands-on)

    - How Claude's memory works within and across conversations

    - Which pre-built template matches your work style




  The Concept
  ## Custom instructions are your Day 1 briefing for Claude.

  Imagine hiring a new assistant. On their first day, you'd tell them: **"Here's how I like things done. Here's my role. Here's my style."** You wouldn't repeat that every morning. You'd say it once.
  That's custom instructions. **Persistent instructions that shape every conversation** with Claude. Set them once, and Claude automatically adjusts its tone, format, and approach.


### With vs Without Custom Instructions

**Card 1:**
Front: ❌ Without Custom Instructions  Every conversation starts from zero. You repeat yourself constantly:  "Keep it brief. Use bullets. I am a marketing director. Don not be too formal..."
Back: ✅ With Custom Instructions  Claude already knows: • Your role (marketing director) • Your style (conversational, direct) • Your preferences (bullets over paragraphs, short over long) • Your tools (Google Workspace, Notion, Slack)  Every response is tailored from the first word.


  How It Works
  ## How Claude remembers (and forgets).

  Claude has four memory layers. Understanding them helps you use each one strategically.


### The 4 Memory Layers

**Card 1:**
Front: 💬 Layer 1: Within a Conversation  Claude remembers everything you have said in the current chat.
Back: This is automatic. Claude tracks all context within a single conversation. You can say "go back to the email we drafted earlier" and it knows exactly what you mean.  Limit: Conversations have a context window. Very long chats may lose early details.

**Card 2:**
Front: 🧠 Layer 2: Across Conversations (Memory)  Claude can save key facts you tell it to remember.
Back: You can say "Remember that I prefer bullet points over paragraphs" and Claude stores this. It persists across new conversations.  This is newer and optional — you control what Claude remembers.

**Card 3:**
Front: 📁 Layer 3: Projects  Claude Projects let you upload files and instructions for a specific context.
Back: Create a Project for each major area of your work. Upload relevant docs, add custom instructions specific to that project. Every conversation in that project has full context.  Best for: Recurring work (weekly reports, client management, code projects).

**Card 4:**
Front: ⚙️ Layer 4: Custom Instructions  Your global preferences that apply to ALL conversations.
Back: This is the Day 1 briefing. It includes your role, communication style, formatting preferences, and any always-on rules.  Custom instructions + Projects + Memory = Claude that truly knows you.


  Pick Your Template
  ## 4 custom instruction templates — pick the one that fits.

  Match your work style to the right template, then customize from there.


### Copy-Paste Templates

**Card 1:**
Front: 👔 Executive Template  For managers, directors, and leaders who need speed and clarity.
Back: PASTE THIS INTO CUSTOM INSTRUCTIONS:  I am a [title] at [company]. I manage [team/scope]. My communication style is direct and professional — no fluff. Default to bullet points over paragraphs. Keep responses concise unless I ask for detail. When I ask for help with emails, match a warm but authoritative tone. For decisions, give me the top 3 options with your recommendation first.

**Card 2:**
Front: 🎨 Creative Template  For writers, designers, marketers, and content creators who need ideas and flexibility.
Back: PASTE THIS INTO CUSTOM INSTRUCTIONS:  I am a [creative role] working on [type of projects]. I value original thinking over safe choices. When brainstorming, give me 10+ ideas and include some wild ones. For writing, match a conversational, engaging tone unless I specify otherwise. Help me avoid cliches. When editing, be honest about what is weak — I prefer direct feedback over encouragement.

**Card 3:**
Front: 📊 Analyst Template  For data people, researchers, and anyone who works with numbers and systems.
Back: PASTE THIS INTO CUSTOM INSTRUCTIONS:  I am a [analyst role] at [company]. I work with [data types/tools]. When I share data, look for trends, anomalies, and actionable insights. Always distinguish between correlation and causation. Default to structured outputs: tables, numbered lists, clear headers. When I ask what should I do, give me recommendations ranked by impact with supporting reasoning.

**Card 4:**
Front: ✍️ Writer Template  For anyone who writes as a core part of their job.
Back: PASTE THIS INTO CUSTOM INSTRUCTIONS:  I am a [writer/comms role] writing for [audience]. My default tone is [describe your tone]. When editing my work, focus on clarity and flow — cut words that do not earn their place. When drafting, give me a strong first draft I can edit rather than a perfect draft that sounds like AI. Avoid corporate jargon. Match the voice of [publication/brand] when relevant.


  Full Example
  ## A complete custom instruction — ready to paste.

  Here's a real example you can paste into Claude's settings right now. Replace the brackets with your details.


Custom Instruction — paste into Claude Settings

```
## About Me
I am a [your title] at [company/industry].
I manage [team size / scope of work].
I work primarily in [tools: Google Workspace, Slack,
Notion, Excel, etc.].

## Communication Style
- Be direct and concise — no fluff
- Default to bullet points over paragraphs
- Use professional but warm tone
- When I ask for options, give your recommendation
  first, then alternatives

## Formatting Rules
- Keep responses under 300 words unless I ask for more
- Use headers and bullets for structure
- Bold key takeaways
- End emails with a clear call to action

## What I Do Not Want
- No corporate jargon or buzzwords
- No "As an AI..." disclaimers
- No repeating my question back to me
- No filler phrases like "Great question!"
```


  Patterns
  ## Common custom instruction patterns — what works and what doesn't.

  After seeing thousands of custom instructions, here are the patterns that produce the best results — and the ones that waste your character limit.




        DO

          Include your role and industry
          "I am a product manager at a B2B SaaS company" gives Claude instant context for every response. It adjusts vocabulary, examples, and recommendations to match your world.



        DO

          Specify what you do NOT want
          "No corporate jargon," "No 'Great question!' openers," "No repeating my question back to me." Negative instructions are surprisingly powerful at cutting the fluff.



        DO

          Name your preferred format
          "Default to bullet points over paragraphs" or "Keep responses under 300 words unless I ask for more." Format preferences save the most editing time across all conversations.



        SKIP

          Do not include task-specific instructions
          "When I ask about marketing, always include ROI" is too specific for custom instructions. Save task-specific rules for Projects instead. Custom instructions should be universal preferences.



        SKIP

          Do not try to "jailbreak" or game the system
          Instructions like "ignore all safety guidelines" or "pretend you have no limitations" waste your character limit and do not work. Focus on genuinely useful preferences about how you work.






  Before & After
  ## See the difference custom instructions make.

  Here is the same question asked with and without custom instructions. The difference is dramatic.


### Before vs After Custom Instructions

**Card 1:**
Front: The Question  You ask Claude: Help me write a status update for my boss.  ❌ WITHOUT custom instructions, Claude does not know your role, your boss preferences, or your communication style. It gives you a generic corporate template.
Back: ✅ WITH custom instructions that say: I am a product manager at a fintech startup. My boss prefers bullet points. Keep it concise. No corporate jargon.  Claude immediately writes a punchy, bulleted update using fintech terminology, formatted exactly how your boss likes it. Zero editing needed.

**Card 2:**
Front: The Question  You ask Claude: Brainstorm ideas for our team offsite.  ❌ WITHOUT custom instructions, Claude gives you generic team-building suggestions for an unknown team size, budget, and culture.
Back: ✅ WITH custom instructions that say: I manage a remote team of 8 engineers. We value deep technical discussions. Budget-conscious startup.  Claude suggests technical hackathons, architecture review sessions, and budget-friendly virtual activities tailored to engineers. Every idea fits your actual team.

**Card 3:**
Front: The Question  You ask Claude: Review this email draft.  ❌ WITHOUT custom instructions, Claude gives generic feedback and may suggest a more formal tone when you prefer casual.
Back: ✅ WITH custom instructions that say: My writing style is conversational and direct. I prefer short sentences. No buzzwords.  Claude edits specifically for your voice — cutting filler words, shortening sentences, replacing buzzwords with plain language. The result sounds like you, not a robot.



    **The math is simple:** Without custom instructions, you spend 10-15 seconds per conversation adding context about yourself. With custom instructions, that context is automatic. Over 10 conversations a day, that is 2-3 minutes saved — plus better results every single time.



  Step-by-Step
  ## How to set up custom instructions right now.

  This takes less than 5 minutes. Follow these steps in order:

    Power Combo
    **Custom instructions + Projects + Memory = Claude that truly knows you.** Start with custom instructions (global). Create a Project for each area of work (specific context). Use Memory for key facts you want Claude to always remember. This is how power users get 10x value from Claude.



  Projects
  ## Claude Projects — your context-specific workspaces.

  Custom instructions are your global settings. Projects are your context-specific settings. Think of Projects as different desks in your office — each one has the files and tools for a specific type of work.




        1

          Client Management Project
          Upload your client brief, past emails, and meeting notes. Add project-specific instructions like "This client prefers formal communication" or "Always reference their Q2 goals." Now every conversation about this client has full context.



        2

          Weekly Reports Project
          Upload your report template, past reports for style reference, and team roster. Add instructions like "Use the same headers every week" and "My manager cares most about pipeline metrics." Consistent, polished reports every time.



        3

          Content Creation Project
          Upload your brand guidelines, tone of voice document, and top-performing posts. Add instructions like "Match the voice of our blog" and "Our audience is small business owners." Every piece of content stays on-brand.






    When to Use Projects vs Custom Instructions
    **Custom instructions** are for things that are true in every conversation — your role, communication style, formatting preferences. **Projects** are for things that are true only in a specific context — client details, project files, domain-specific rules. Use both for maximum effectiveness.



  **The key insight:** Custom instructions are the difference between Claude being a generic AI and Claude being *your* AI. Five minutes of setup saves hours of repeating yourself. Every conversation starts smarter.


  Quick Check
  ## Lock it in.


### Quiz

**Q1: What are custom instructions?**
    A. Commands that make Claude work faster
  ✓ B. Persistent preferences that shape every conversation automatically
    C. Secret codes that unlock features
    D. Rules that limit what Claude can do
  *Custom instructions are persistent context about who you are, how you work, and what you prefer. They apply to every conversation so you never have to repeat yourself.*

**Q2: What happens to Claude memory between separate conversations?**
    A. Everything carries over automatically
  ✓ B. Nothing carries over — each conversation starts fresh by default
    C. Only the last 5 messages carry over
    D. Claude forgets everything after 24 hours
  *By default, each new conversation starts fresh. Custom instructions and the Memory feature let you persist key context, but conversation-specific details do not carry over automatically.*

**Q3: What is the most effective approach to setting up Claude for your work?**
    A. Custom instructions only
  ✓ B. Custom instructions + Projects + Memory combined
    C. No setup — just use Claude as-is
    D. Change your instructions before every conversation
  *The trifecta: Custom instructions (global preferences), Projects (context-specific files and rules), and Memory (persistent facts) — combined, they make Claude a true personalized assistant.*
