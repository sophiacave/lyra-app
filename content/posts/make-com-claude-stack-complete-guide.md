---
title: "The Make.com + Claude Stack: A Complete Guide"
date: 2026-04-07
author: Sophia Cave
description: "Make.com and Claude together are the most powerful no-code AI automation stack available. Here's exactly how to set it up, with real scenarios you can build today."
excerpt: "Make.com and Claude together are the most powerful no-code AI automation stack available. Here's exactly how to set it up, with real scenarios you can build today."
tags: [make-com, claude, automation, tutorial, no-code]
---

# The Make.com + Claude Stack: A Complete Guide

If you are building AI automations in 2026 and you are not using Make.com with Claude, you are working too hard.

Make.com handles the plumbing — connecting apps, scheduling triggers, routing data. Claude handles the thinking — writing, analyzing, summarizing, deciding. Together they form a no-code AI stack that can replace hours of manual work every week.

This is not a hype piece. This is the exact setup guide with real scenarios.

## Why Make.com + Claude (and Not the Alternatives)

**Why Make.com over Zapier?** Make.com gives you visual workflow building, better branching logic, and significantly cheaper pricing at scale. Zapier is simpler for basic two-step automations. But the moment you need AI in the loop — and you will — Make.com's HTTP module and JSON handling are dramatically better.

**Why Claude over ChatGPT's API?** Claude handles longer context, follows complex instructions more reliably, and produces output that reads like a human wrote it. For business automation where quality matters — client emails, content, analysis — Claude consistently outperforms on the metrics that matter: accuracy, tone, and instruction-following.

**Why both together?** Because neither is complete alone. Claude cannot trigger on a new email arriving or push data to your CRM. Make.com cannot write a thoughtful email or analyze a spreadsheet. Together: unstoppable.

## Setting Up the Stack

### Step 1: Get Your Accounts

- **Make.com**: Free tier gives you 1,000 operations/month. Enough to test everything below. Sign up at make.com.
- **Claude API**: Go to console.anthropic.com. Add a payment method. You will spend $5-20/month for typical small business use.
- **API Key**: In the Anthropic console, create an API key. Copy it. You will paste it into Make.com.

### Step 2: Connect Claude to Make.com

Make.com does not have a native Claude module yet. That is fine. The HTTP module does everything you need.

1. In your Make.com scenario, add an **HTTP > Make a request** module
2. Configure it:
   - **URL**: `https://api.anthropic.com/v1/messages`
   - **Method**: POST
   - **Headers**:
     - `x-api-key`: your API key
     - `anthropic-version`: `2023-06-01`
     - `content-type`: `application/json`
   - **Body type**: Raw
   - **Content type**: JSON
   - **Request content**:
   ```json
   {
     "model": "claude-sonnet-4-6-20250514",
     "max_tokens": 1024,
     "messages": [
       {
         "role": "user",
         "content": "Your prompt here"
       }
     ]
   }
   ```
3. The response comes back in `data.content[0].text`. Map that to your next module.

That is it. Every scenario below uses this same pattern with different prompts.

## Five Scenarios You Can Build Today

### Scenario 1: Smart Email Responder

**Trigger**: New email arrives in Gmail (Gmail module)
**Filter**: Only emails from clients (check sender domain)
**Claude step**: "Read this email and draft a professional reply. Match my tone: friendly but concise. If the email asks a question I cannot answer without more info, draft a reply asking for clarification. Email: {{email body}}"
**Action**: Create draft in Gmail with Claude's response

**Time saved**: 30-45 minutes per day for anyone handling 20+ client emails.

### Scenario 2: Content Repurposer

**Trigger**: New RSS item from your blog (or new row in Airtable)
**Claude step 1**: "Turn this blog post into 5 distinct social media posts. Each should be under 280 characters, take a different angle, and include a hook in the first line. Blog post: {{content}}"
**Claude step 2**: "Write a 3-paragraph email newsletter summary of this blog post. Include a compelling subject line. Post: {{content}}"
**Action**: Add social posts to a Google Sheet queue. Create email draft in your ESP.

**Time saved**: 2-3 hours per blog post of manual repurposing.

### Scenario 3: Meeting Notes Processor

**Trigger**: New file in Google Drive (meeting recording transcript from Otter.ai or similar)
**Claude step**: "Analyze this meeting transcript. Extract: 1) Key decisions made, 2) Action items with owners, 3) Open questions, 4) 3-sentence summary. Format as clean markdown. Transcript: {{file content}}"
**Action**: Create a Notion page with the structured notes. Send Slack message with the summary.

**Time saved**: 20 minutes per meeting of manual note-taking and organizing.

### Scenario 4: Lead Qualifier

**Trigger**: New form submission (Typeform, Google Forms, or webhook)
**Claude step**: "Analyze this lead form submission. Score the lead 1-10 based on: budget mentioned, urgency, fit with our services (AI automation for small businesses). Recommend: 'hot' (follow up today), 'warm' (follow up this week), or 'nurture' (add to email sequence). Form data: {{fields}}"
**Filter**: Route based on Claude's score
**Action**: Hot leads get a Slack notification + calendar booking link email. Warm leads get a personalized follow-up email. Nurture leads get added to your email sequence.

**Time saved**: Eliminates manual lead review entirely.

### Scenario 5: Weekly Business Digest

**Trigger**: Scheduled every Sunday at 8 PM
**Data pulls**: Google Analytics (HTTP module), Stripe revenue (HTTP module), email subscriber count (HTTP module)
**Claude step**: "Here are this week's business metrics. Write a 3-paragraph executive summary covering: what grew, what declined, and one specific recommendation for next week. Metrics: {{all data}}"
**Action**: Send email to yourself (or your team) with the digest.

**Time saved**: 1-2 hours of manual reporting and analysis.

## Optimization Tips

**Use system prompts for consistency.** Add a `system` field to your Claude API calls with persistent instructions: your brand voice, formatting rules, things to always include or avoid. This eliminates repeating yourself in every prompt.

**Cache expensive operations.** If you are processing the same type of data repeatedly, store Claude's responses in a data store. Check the store before calling the API. This cuts costs and speeds up scenarios.

**Use Claude's longer context window.** Unlike other models that choke on long inputs, Claude handles 200K tokens. Feed it entire documents, full email threads, or long transcripts. The more context it has, the better its output.

**Batch when possible.** Instead of calling Claude once per email or once per social post, batch items together. "Here are 5 emails. Draft replies for all of them." One API call instead of five. Cheaper and often higher quality because Claude can see patterns across the batch.

**Error handling matters.** Add error handlers to your HTTP modules. API calls fail sometimes. A simple retry with a 30-second delay handles 95% of transient failures. For the rest, route to a notification so you know something needs attention.

## Cost Breakdown

For a typical small business running all five scenarios above:

| Component | Monthly Cost |
|-----------|-------------|
| Make.com Pro | $9 |
| Claude API (est. 500 calls) | $8-15 |
| **Total** | **$17-24/month** |

That is less than one hour of freelancer time. For automation that saves 5-10 hours per week.

## Getting Started

Do not try to build all five scenarios in one afternoon. Pick the one that saves you the most time. Build it. Run it for a week. Fix what breaks. Then add the next one.

The Make.com + Claude stack is the closest thing to having a full-time AI assistant without the full-time cost. And unlike hiring, it scales to zero when you do not need it and infinite when you do.

Start with Scenario 1 or 2. You will be hooked within a week.

---

*Want the full automation system? The [AI Automation Checklist](https://likeone.ai/checklist) gives you 15 ready-to-build automations — free with your email.*
