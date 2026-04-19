# Documentation & SOPs

**Course:** AI Project Management
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[← AI Project Management](/academy/ai-project-management/)
  Lesson 7 of 10


  # Documentation & SOPs

  Create and maintain project documentation that people actually read — without spending your life writing it.


  ### What You'll Learn


    - Using AI to draft project documentation from conversations and decisions

    - Building standard operating procedures that stay current

    - Documentation maintenance strategies that don't require heroic effort




  The Gap
  ## Everyone Wants Docs. Nobody Wants to Write Them.

  Documentation is the most universally desired and universally avoided activity in project management. Teams constantly say "we need better docs" and then never write them because there's always something more urgent. The knowledge lives in people's heads, in Slack threads, in meeting recordings nobody watches.
  AI closes this gap. It turns the information you're already generating — messages, meetings, decisions, code reviews — into structured documentation. The effort drops from hours to minutes.


  Project Docs
  ## From Chaos to Clarity

  Every project needs a few core documents: a charter or brief, a requirements doc, a technical architecture overview, and a runbook for operations. AI can draft any of these from your existing materials.
  Got a series of emails where requirements were discussed? Feed them to AI and ask for a structured requirements document. Have a Slack thread where the team debated the technical approach? AI turns that into an architecture decision record. The information already exists — AI just organizes it.


  ### SOP Generation Example

  **Input:** "When a customer reports a bug, we triage it in standup, assign it a severity, the dev fixes it in the current sprint if it's P1 or P2, QA tests on staging, then we deploy Thursday. P3 and P4 go in the backlog."
  **AI output:** A complete SOP with sections for Trigger, Triage Process, Severity Matrix (P1-P4 with response times), Assignment Rules, Development Workflow, Testing Requirements, Deployment Schedule, and Escalation Path. Full document from a paragraph of tribal knowledge.


  Staying Current
  ## Docs That Don't Rot

  The hardest part of documentation isn't creating it — it's keeping it updated. Set a monthly cadence: feed AI your current SOP along with any process changes from the last month (new tools, changed steps, lessons learned). Ask it to produce an updated version with a changelog.
  This turns documentation maintenance from a dreaded quarterly project into a 15-minute monthly habit. The docs stay accurate, the team trusts them, and onboarding new people stops being a three-week oral tradition.


  ### Try It Yourself

  Pick a process your team follows but has never documented. Describe it in plain language:
  `Here's a process my team follows but we've never documented: [describe in plain language — who does what, when, in what order, what tools are used]. Please create a Standard Operating Procedure with: (1) Purpose and scope, (2) Roles and responsibilities, (3) Step-by-step procedure with details, (4) Decision points and escalation criteria, (5) Tools and access needed, (6) Common issues and troubleshooting. Format it clearly with headers and numbered steps.`
  Share the draft with the team member who knows the process best. You'll be surprised how close AI gets from just your description — and the gaps they identify make the final doc bulletproof.


  Prompt Templates
  ## Documentation Templates for Common PM Needs

  These templates cover the documents every PM eventually needs but rarely has time to create from scratch:
  **Project Charter Template:**
  `Create a project charter from the following information:

Project name: [name]
Business problem: [what problem this solves]
Proposed solution: [high-level approach]
Sponsor: [who is funding/sponsoring]
Team: [key roles]
Timeline: [target dates]
Budget: [approximate budget]
Success criteria: [how we know it worked]

Include sections for: Executive Summary, Business Case, Scope (in-scope and explicitly out-of-scope), Key Stakeholders, High-Level Timeline, Budget Summary, Assumptions, Constraints, Risks, and Approval Signatures. Keep it to 2-3 pages maximum.`
  **Process Documentation Template:**
  `Document this process that my team follows:

[Describe the process in plain language — who does what, when, what tools are used, what triggers it, what the output is]

Create a process document with:
1. Process overview (what it accomplishes and why it matters)
2. Trigger (what starts this process)
3. Roles involved (who does what)
4. Prerequisites (what needs to be true before starting)
5. Step-by-step procedure with decision points
6. Expected outputs/deliverables
7. Quality checks (how to verify it was done correctly)
8. Common problems and solutions
9. Related processes (what feeds into this, what follows)
10. Version history placeholder`
  **Decision Log Template:**
  `I need a decision log entry for an important project decision. Here are the details:

Decision: [what was decided]
Date: [when]
Decision maker(s): [who made the call]
Context: [why this decision was needed]
Options considered: [what alternatives were evaluated]
Rationale: [why this option was chosen over others]
Impact: [what this decision affects — timeline, budget, scope, etc.]
Revisit criteria: [under what conditions would we reconsider]

Format this as a formal decision record that future team members can reference to understand why we made this choice.`


  Framework
  ## The Documentation Pyramid

  Not all documentation is equal. Think of it as a pyramid with different levels of detail for different audiences:
  **Top: Strategic Documents (1-2 pages).** Project charter, business case, executive summary. Updated rarely. Read by leadership. AI drafts these from your project brief and key decisions.
  **Middle: Operational Documents (3-10 pages).** Requirements, architecture decisions, test plans, release plans. Updated per phase. Read by the project team. AI generates these from meeting notes, Slack discussions, and technical conversations.
  **Base: Reference Documents (varies).** SOPs, runbooks, troubleshooting guides, onboarding materials. Updated continuously. Read by anyone who needs to do the work. AI creates these from tribal knowledge and keeps them current with monthly refresh prompts.
  Most PMs make the mistake of trying to write everything at the same level of detail. A project charter does not need step-by-step procedures. A runbook does not need a business case. AI helps you match the right depth to the right document type.


  Real-World Example
  ## Zero to Documented in Two Weeks

  An infrastructure team had been running for three years with zero documentation. Everything lived in the heads of five engineers. When two of them announced they were leaving, the PM had two weeks to capture everything.
  She scheduled 30-minute "brain dump" sessions with each departing engineer. No structure — just "tell me how you handle X." She recorded the conversations and fed the transcripts to AI with this prompt: "Convert this conversation into a standard operating procedure with numbered steps, decision points, and troubleshooting notes."
  In two weeks, she produced 14 SOPs covering every critical process the team managed — deployment procedures, incident response, vendor management, access provisioning, and more. Each document was reviewed by the engineer who described the process, and corrections took 10-15 minutes per doc.
  The total effort: 14 hours of interviews plus about 7 hours of AI processing and review. What would have been a three-month documentation project (that likely never would have happened) was completed in two weeks — and the documents were higher quality because they captured the actual practitioner's workflow, not an idealized version.


  Advanced Technique
  ## Documentation Quality Audits

  Existing documentation often has gaps, outdated information, or inconsistencies. AI can audit your documentation library systematically:
  `Here is a [SOP / runbook / process document] my team uses:

[Paste the document]

Please audit it for:
1. Steps that are vague or could be interpreted multiple ways
2. Missing information — where would someone get stuck following these instructions?
3. Outdated references — tool names, URLs, or procedures that seem like they might have changed
4. Missing error handling — what happens when things go wrong at each step?
5. Assumptions about reader knowledge — what does someone need to know before starting?
6. Suggest specific improvements for each issue found`
  Running this audit once per quarter keeps your documentation library trustworthy. When people trust the docs, they use the docs. When they use the docs, they stop interrupting the experts — and that is the real time savings.


  Common Pitfalls
  ## Documentation Anti-Patterns

  **The Write-Once-Read-Never:** Spending hours creating perfect documentation that goes into a wiki and is never found again. AI can help here too — generate a documentation index, tag documents with searchable keywords, and create a "quick reference" summary that links to full documents when people need depth.
  **The Screenshot Graveyard:** Documents filled with screenshots that break every time the UI changes. AI-generated text instructions are more resilient to change. Use screenshots for complex visual workflows only — not for showing where a button is.
  **The Perfect Draft Trap:** Waiting until a process is "finalized" before documenting it. Document early, update often. A rough-but-current document is infinitely more valuable than a polished-but-nonexistent one. AI makes updates so fast that "not enough time to update" stops being a valid excuse.


  Technique
  ## Lessons Learned Documents

  The most neglected document in project management is the lessons learned report. Teams finish a project, exhale, and immediately start the next one. The institutional knowledge from what went right and wrong evaporates within weeks.
  AI makes lessons learned capture painless:
  `This project just completed. Here is the context:

Original plan: [brief description of original scope, timeline, budget]
Actual outcome: [what actually happened — scope changes, timeline shifts, budget variance]
Key challenges: [what was hard]
Key wins: [what went well]
Team feedback: [any retro notes or team comments]

Generate a Lessons Learned document with:
1. Project summary (planned vs. actual)
2. What went well (practices to repeat)
3. What did not go well (practices to change)
4. Root causes for major variances
5. Specific, actionable recommendations for future projects
6. Knowledge transfer items (things the next PM on a similar project should know)`
  A good lessons learned document takes 30 minutes with AI. Without AI, it takes half a day — which is why nobody does it. And yet these documents are the most valuable thing you can leave behind for your organization. They are how teams get smarter across projects instead of making the same mistakes over and over.


  Technique
  ## FAQ Documents from Support Channels

  Your Slack channels, support tickets, and email threads contain a goldmine of frequently asked questions. AI can extract and organize them:
  `Here are questions my team has answered repeatedly over the past month (from Slack, email, or support tickets):

[Paste the questions and answers]

Please create a FAQ document organized by topic. For each question: rewrite it clearly, provide a concise answer, and link to any relevant documentation (I will add the links). Identify the top 5 most-asked questions and flag any questions that suggest a process gap — something that should be documented as a full SOP rather than a FAQ entry.`
  This transforms reactive support into proactive documentation. Instead of answering the same question for the tenth time, you point people to the FAQ. The time investment to create it: 15 minutes of pasting and 5 minutes of review. The time saved over the next year: dozens of hours of repeated explanations.


  Pro Tip
  ## Onboarding Documents Write Themselves

  When a new person joins, they ask dozens of questions. Capture those questions and the answers. After a month, feed the whole Q&A to AI and ask for an onboarding guide. The new hire literally wrote the onboarding doc by asking the questions nobody thought to document.



### Documentation & SOPs — Key Concepts

**Card 1:**
Front: SOP (Standard Operating Procedure)
Back: A complete document with: Purpose and scope, Roles and responsibilities, Step-by-step procedure, Decision points and escalation criteria, Tools and access needed, Common issues and troubleshooting. AI generates a full draft from a plain-language description of the process.

**Card 2:**
Front: Architecture Decision Record (ADR)
Back: A document capturing why a technical decision was made. Feed AI the Slack thread or meeting notes where the team debated the approach — AI turns conversation into a structured record before the context is lost.

**Card 3:**
Front: Living Documentation
Back: Monthly cadence: feed AI the current SOP plus any process changes from the past month. AI produces an updated version with a changelog. 15 minutes per month instead of a dreaded quarterly rewrite.

**Card 4:**
Front: Tribal Knowledge
Back: Information that exists only in people’s heads — not written down, passed on verbally. AI turns tribal knowledge into structured docs by having experts describe processes in plain language, then organizing and formalizing the output.

**Card 5:**
Front: Onboarding Doc Strategy
Back: When a new hire joins, capture all their questions and the answers given. After a month, feed the Q&A to AI and ask for an onboarding guide. The new hire wrote the doc by asking the questions nobody thought to document.



### Quiz

**Q1: What is the most efficient way to create project documentation that currently only exists as tribal knowledge?**
    A. Hire a technical writer to interview team members
    B. Have the team write documentation during a documentation sprint
  ✓ C. Describe the process to AI in plain language — AI organizes and formalizes it into a structured document instantly
    D. Record video walkthroughs and store them in Confluence
  *AI closes the documentation gap by turning the information you’re already generating — messages, meetings, decisions — into structured documentation. Describe the process in plain language and AI produces a full SOP with purpose, roles, steps, decision points, and troubleshooting sections.*

**Q2: How should documentation be maintained to prevent it from becoming outdated?**
    A. Assign a dedicated documentation owner who updates docs daily
    B. Run quarterly documentation sprints where all docs are reviewed
  ✓ C. Monthly: feed AI the current SOP plus process changes from the past month — AI produces an updated version with a changelog in 15 minutes
    D. Set calendar reminders for each document’s annual review
  *Documentation maintenance becomes a 15-minute monthly habit rather than a dreaded quarterly project. Give AI the current doc and describe what changed (new tools, modified steps, lessons learned) — it produces an updated version with a changelog automatically.*

**Q3: What is an Architecture Decision Record (ADR) and how can AI help create one?**
    A. A performance benchmark for AI model selection
  ✓ B. A document capturing why a technical decision was made — AI converts Slack threads or meeting debates into a structured record before the reasoning is lost
    C. A diagram showing the technical architecture of a system
    D. A log of API calls made by the AI system
  *ADRs capture the ‘why’ behind technical decisions — context that disappears as soon as the meeting ends. Feed AI the Slack thread or meeting notes where the team debated the approach, and it produces a structured record: the decision, the options considered, the rationale, and the tradeoffs accepted.*


  [← Previous: Resource Allocation](/academy/ai-project-management/06-resource-allocation/)
  [Next: Agile with AI →](/academy/ai-project-management/08-agile-with-ai/)
