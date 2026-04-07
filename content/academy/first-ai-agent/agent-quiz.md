---
title: "Agent Quiz"
course: "first-ai-agent"
order: 10
type: "quiz"
free: false
---
<div class="wrap">

<nav class="local-nav">
  <a href="/academy/first-ai-agent/">First AI Agent</a>
  <span class="lesson-badge">Lesson 10 of 10</span>
</nav>

<div class="lesson-hero">
  <h1>Agent Mastery Quiz</h1>
  <p class="sub">8 questions covering everything you've learned. Prove you understand agent fundamentals.</p>
</div>

<!-- ============ COURSE RECAP ============ -->
<div class="section">
  <h2>Course Recap</h2>
  <p>Before you take the quiz, let us walk through everything you have learned across three modules. Each module built on the last — from understanding what agents are, to building one, to shipping it safely.</p>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.25rem 0">

    <div style="padding:1.25rem;border-radius:12px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.12)">
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#34d399;margin-bottom:.5rem;font-weight:600">Module 1</div>
      <strong style="color:#e5e5e5;font-size:1rem">Foundations</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 .75rem">Understanding what agents are, how they think, and why they are different from chatbots.</p>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem">
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#34d399;margin-right:.4rem">&#10003;</span> Chatbot vs. agent — the autonomy spectrum</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#34d399;margin-right:.4rem">&#10003;</span> The agent loop — perceive, think, act, observe, learn</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#34d399;margin-right:.4rem">&#10003;</span> Tool calling — how agents interact with the real world</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#34d399;margin-right:.4rem">&#10003;</span> Why tools turn text generators into action-takers</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.12)">
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#8b5cf6;margin-bottom:.5rem;font-weight:600">Module 2</div>
      <strong style="color:#e5e5e5;font-size:1rem">Building</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 .75rem">Designing your agent from the ground up — its brain, its tools, and its memory.</p>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem">
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#8b5cf6;margin-right:.4rem">&#10003;</span> System prompts — the 6 essential blocks</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#8b5cf6;margin-right:.4rem">&#10003;</span> Tool integration — JSON schemas, descriptions, routing</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#8b5cf6;margin-right:.4rem">&#10003;</span> Memory systems — short-term, long-term, and RAG</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#8b5cf6;margin-right:.4rem">&#10003;</span> Designing agents with a clear goal and focused tool set</li>
      </ul>
    </div>

    <div style="padding:1.25rem;border-radius:12px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.12)">
      <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#fb923c;margin-bottom:.5rem;font-weight:600">Module 3</div>
      <strong style="color:#e5e5e5;font-size:1rem">Production</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.5rem 0 .75rem">Making your agent safe, reliable, and ready for real users in the real world.</p>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem">
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#fb923c;margin-right:.4rem">&#10003;</span> Error handling — try/catch, retries, fallback tools</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#fb923c;margin-right:.4rem">&#10003;</span> Guardrails — what your agent must never do</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#fb923c;margin-right:.4rem">&#10003;</span> Evaluation — the 5 dimensions and the 70+ threshold</li>
        <li style="font-size:.8rem;color:#a1a1aa"><span style="color:#fb923c;margin-right:.4rem">&#10003;</span> Deployment — monitoring, logging, and continuous improvement</li>
      </ul>
    </div>

  </div>
</div>

<!-- ============ AGENT BUILDER'S CHECKLIST ============ -->
<div class="section">
  <h2>The Agent Builder's Checklist</h2>
  <p>Every agent needs these seven things before it touches a real user. This is your pre-flight checklist. If any item is missing, your agent is not ready.</p>

  <div style="display:flex;flex-direction:column;gap:.6rem;margin:1.25rem 0">

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">1.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">Clear goal statement</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">One sentence that defines exactly what your agent does and for whom. "This agent helps customer support reps find order information and process refunds." If you cannot say it in one sentence, the agent is too broad.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#38bdf8;font-size:1.1rem;line-height:1.4;flex-shrink:0">2.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">Focused tool set (2-4 tools)</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Start small. Two to four well-defined tools beat ten vague ones. Each tool needs a clear name, a precise description, and a JSON schema the model can understand. More tools means more decision points where the agent can choose wrong.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#8b5cf6;font-size:1.1rem;line-height:1.4;flex-shrink:0">3.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">System prompt with all 6 blocks</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Your system prompt must include: <strong style="color:#e5e5e5">Identity</strong> (who the agent is), <strong style="color:#e5e5e5">Goal</strong> (what it is trying to do), <strong style="color:#e5e5e5">Tools</strong> (what it can use and when), <strong style="color:#e5e5e5">Memory</strong> (what to remember), <strong style="color:#e5e5e5">Guardrails</strong> (what it must never do), and <strong style="color:#e5e5e5">Output Format</strong> (how to structure responses). Missing any block creates blind spots.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#ef4444;font-size:1.1rem;line-height:1.4;flex-shrink:0">4.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">At least one guardrail</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Every agent needs at least one hard boundary it will never cross. "Never share another customer's data." "Never execute a refund over $500 without human approval." "Never generate medical advice." Guardrails are non-negotiable safety rules, not suggestions.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#fb923c;font-size:1.1rem;line-height:1.4;flex-shrink:0">5.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">Memory strategy</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Decide what your agent remembers within a session (short-term: conversation history) and across sessions (long-term: user preferences, past interactions, learned patterns). An agent without long-term memory starts from zero every time. An agent that remembers everything wastes tokens and money. Find the balance.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#34d399;font-size:1.1rem;line-height:1.4;flex-shrink:0">6.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">Error handling with fallback tools</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">When a tool call fails — and it will — your agent needs a plan. Retry once with corrected parameters. If that fails, try a fallback tool. If all tools fail, tell the user what happened honestly and suggest an alternative. Never silently swallow errors. Never make up data to fill the gap.</p>
      </div>
    </div>

    <div style="padding:.85rem 1.15rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1);display:flex;align-items:flex-start;gap:.75rem">
      <span style="color:#38bdf8;font-size:1.1rem;line-height:1.4;flex-shrink:0">7.</span>
      <div>
        <strong style="color:#e5e5e5;font-size:.88rem">Evaluation across 5 dimensions</strong>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Before deploying, score your agent on <strong style="color:#e5e5e5">Accuracy</strong> (correct answers), <strong style="color:#e5e5e5">Speed</strong> (response time under 10 seconds for simple queries), <strong style="color:#e5e5e5">Reliability</strong> (consistent results, no crashes), <strong style="color:#e5e5e5">Cost Efficiency</strong> (affordable per interaction), and <strong style="color:#e5e5e5">User Satisfaction</strong> (people actually like using it). All five must score 70 or higher.</p>
      </div>
    </div>

  </div>
</div>

<!-- ============ COMMON AGENT MISTAKES ============ -->
<div class="section">
  <h2>Common Agent Mistakes</h2>
  <p>These are the mistakes that trip up most first-time agent builders. They are easy to make and expensive to fix in production. Learn them here so you do not learn them from angry users.</p>

  <div style="display:flex;flex-direction:column;gap:.6rem;margin:1.25rem 0">

    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">Too many tools (decision paralysis)</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">When an agent has 15 tools available, it spends more time deciding which tool to use than actually helping the user. Every extra tool adds a decision branch. With 4 tools, the agent has 4 options per step. With 15, it has 15 — and the probability of choosing wrong goes up fast. Start with 2-4 tools. Only add more when you have data showing users need them.</p>
    </div>

    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">No guardrails (dangerous in production)</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">An agent without guardrails is a liability. It might share private data, execute destructive operations, or follow adversarial prompts that trick it into bypassing its own instructions. Guardrails are not optional safety theater — they are the walls that keep your agent inside the sandbox. "But my agent is just a demo" is not an excuse. Demos become products faster than you think.</p>
    </div>

    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">No evaluation before deploy</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Shipping an agent without a test suite is like launching a rocket without checking the fuel gauge. It might work. It might also explode spectacularly in front of your users. Build at least 20 test cases covering happy paths, edge cases, ambiguous inputs, and adversarial prompts. Run them. Score them. Only deploy when all five dimensions hit 70+.</p>
    </div>

    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">Ignoring speed — a 45-second response frustrates users</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Accuracy is not the only thing that matters. If your agent takes 45 seconds to answer a simple question, users will leave before they see how smart it is. Target under 5 seconds for simple queries and under 30 seconds for complex multi-tool tasks. If you are over that, look into caching, parallel tool calls, or routing simple questions to faster models.</p>
    </div>

    <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444">No production monitoring</strong>
      <p style="font-size:.82rem;color:#a1a1aa;margin:.4rem 0 0">Your test suite passes. You deploy. Two weeks later, accuracy has dropped from 85% to 60% and nobody noticed. Why? User patterns changed, an API you depend on updated its response format, or the model drifted. Without production monitoring — logging every interaction, tracking error rates, reviewing failure cases weekly — you are flying blind. Pre-launch testing is the beginning, not the end.</p>
    </div>

  </div>
</div>

<!-- ============ PRE-QUIZ REVIEW ============ -->
<div class="section">
  <h2>Pre-Quiz Review</h2>
  <p>Make sure you can define each of these concepts before taking the quiz. If any term feels fuzzy, revisit the relevant lesson.</p>

  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;margin:1.25rem 0">

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.85rem">Agent Loop</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">The continuous cycle that defines agent behavior: perceive the environment, think about what to do, act using tools, observe the result, and learn from the outcome. Repeats until the goal is met.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.85rem">Tool Calling</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">The mechanism that lets an agent interact with the real world. The model outputs a structured JSON request (function name + arguments), a runtime executes it, and the result feeds back into the conversation.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.85rem">System Prompt</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">The instruction set that defines an agent's identity, goal, tools, memory behavior, guardrails, and output format. It is read before every interaction and shapes every decision the agent makes.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
      <strong style="color:#fb923c;font-size:.85rem">Guardrails</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">Hard boundaries the agent must never cross, regardless of user input. They protect against data leaks, destructive actions, and adversarial prompt injection. A guardrail is a rule, not a guideline.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
      <strong style="color:#ef4444;font-size:.85rem">Graceful Degradation</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">When a tool fails, the agent tries alternatives before giving up. Retry with corrected parameters, try a fallback tool, and only escalate to the user if all options are exhausted. Never silently fail. Never fabricate data.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
      <strong style="color:#34d399;font-size:.85rem">Short-Term vs. Long-Term Memory</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">Short-term memory is the conversation history within a single session — it disappears when the session ends. Long-term memory persists across sessions using a database, letting the agent recall user preferences and past interactions.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
      <strong style="color:#8b5cf6;font-size:.85rem">The Five Evaluation Dimensions</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">Accuracy, Speed, Reliability, Cost Efficiency, and User Satisfaction. An agent must score 70+ on all five to be production-ready. One weak dimension can sink the entire user experience.</p>
    </div>

    <div style="padding:1rem 1.15rem;border-radius:10px;background:rgba(56,189,248,.04);border:1px solid rgba(56,189,248,.1)">
      <strong style="color:#38bdf8;font-size:.85rem">Chatbot vs. Agent</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.35rem 0 0">A chatbot responds to a single message and stops. An agent uses tools, maintains memory, and loops autonomously toward a goal. The difference is autonomy — an agent acts, observes, and adapts without waiting for the next human message.</p>
    </div>

  </div>

  <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);margin-top:1rem">
    <p style="font-size:.85rem;color:#a1a1aa;margin:0"><strong style="color:#8b5cf6">Ready?</strong> The quiz below covers all three modules — 8 multiple-choice questions. You need to understand the agent loop, system prompt blocks, tool calling, memory, error handling, guardrails, and evaluation. Take your time. Good luck.</p>
  </div>
</div>

  <div data-learn="QuizMC" data-props='{"title":"Agent Mastery Quiz","questions":[{"q":"What is the fundamental difference between a chatbot and an agent?","options":["Agents use more advanced AI models","Agents can perceive, decide, act, and loop autonomously — chatbots just respond once","Chatbots are free, agents cost money","Agents always use voice, chatbots use text"],"correct":1,"explanation":"The core difference is the agent loop: perceive → think → act → observe → learn → repeat. A chatbot does one thing: you ask, it answers. An agent operates autonomously toward a goal."},{"q":"What happens in the Observe step of the agent loop?","options":["The agent watches the user type","The agent looks at its training data","The agent checks the result of its action to see if it succeeded or failed","The agent observes other agents working"],"correct":2,"explanation":"Observation is the feedback step. After taking an action (calling a tool), the agent checks the result. Did it work? Did it fail? Was the data good? This closes the loop and enables self-correction."},{"q":"Why does an agent need tools?","options":["To look more professional","Without tools, an agent can only generate text — tools let it actually DO things in the real world","Tools make the AI faster","Tools are optional — agents work fine without them"],"correct":1,"explanation":"Tools are what separate agents from chatbots. Without tools, an agent can only generate text. With tools (APIs, databases, email, etc.), it can take actions, retrieve real data, and interact with the world."},{"q":"What should a system prompt for an agent include?","options":["Just the agent name","Only a list of available tools","Identity, goal, available tools, memory instructions, guardrails, and output format","A copy of the agent training data"],"correct":2,"explanation":"A complete agent system prompt covers all six blocks: Identity (who it is), Goal (what it is trying to do), Tools (what it can use), Memory (what it should remember), Guardrails (what it must never do), and Output Format (how to respond)."},{"q":"What is the main advantage of long-term memory over short-term memory?","options":["Long-term memory is faster","Long-term memory persists across sessions, so the agent improves over time instead of starting fresh","Long-term memory is cheaper","Short-term memory does not actually exist"],"correct":1,"explanation":"Short-term memory helps within a single session but is lost when the session ends. Long-term memory persists — the agent remembers what worked, what failed, and user preferences across all interactions. This is how agents get genuinely smarter over time."},{"q":"When an agent tool call fails, what is the best recovery strategy?","options":["Retry the exact same call 100 times","Tell the user I cannot do that and stop","Try an alternative approach (fallback tool), and explain what happened to the user","Ignore the error and make up a response"],"correct":2,"explanation":"Graceful degradation: try alternatives first, be transparent about what happened, and only escalate if all fallbacks fail. Never hammer a failing service, give up immediately, or fabricate data."},{"q":"An agent encounters a user request that conflicts with its guardrails. What should it do?","options":["Override the guardrail — the user asked for it","Silently do something different from what was asked","Explain the conflict, refuse the unsafe action, and suggest a safe alternative","Shut down completely"],"correct":2,"explanation":"Guardrails exist for safety. The agent should never override them, but it should be helpful — explain WHY it cannot comply and offer an alternative path that achieves the user goal safely."},{"q":"Which 5 dimensions should you evaluate an agent on before deploying?","options":["Speed, color, size, weight, and temperature","Accuracy, speed, reliability, cost efficiency, and user satisfaction","Number of tools, model size, training data, compute, and uptime","Revenue, profit, growth, retention, and churn"],"correct":1,"explanation":"The five evaluation dimensions are: Accuracy (does it give correct answers?), Speed (how fast?), Reliability (does it work consistently?), Cost Efficiency (affordable at scale?), and User Satisfaction (are people happy?). All five need to meet your threshold before deploying."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Agent Concept Flashcards","cards":[{"front":"What is the agent loop?","back":"Perceive → Think → Act → Observe → Learn — a continuous cycle that runs until the agent achieves its goal."},{"front":"What makes an agent different from a chatbot?","back":"Agents use tools, maintain memory, and loop autonomously. Chatbots respond once per turn and have no persistent state."},{"front":"What are the 6 blocks of a good system prompt?","back":"Identity, Goal, Tools, Memory, Guardrails, Output Format."},{"front":"What is graceful degradation?","back":"When a tool fails, try fallback alternatives before escalating to the user. Never give up on the first failure."},{"front":"What are the 5 agent evaluation dimensions?","back":"Accuracy, Speed, Reliability, Cost Efficiency, User Satisfaction."}]}'></div>


</div>
