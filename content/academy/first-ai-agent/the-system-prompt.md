---
title: "The System Prompt"
course: "first-ai-agent"
order: 5
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy/first-ai-agent/" class="logo">Build Your First AI Agent</a>
  <a href="/academy/first-ai-agent/" class="nav-link">← Course</a>
</nav>

<div class="content">
  <div class="lesson-num">Lesson 5 of 10</div>
  <h1>The System Prompt</h1>
  <p class="subtitle">A system prompt is an agent's DNA. Drag blocks to assemble your agent's instructions, then fill in the details.</p>

  <div class="progress-bar"></div>

  <div class="builder">
    <div>
      <h3 style="font-size:.9rem;color:#a1a1aa;margin-bottom:1rem">Available Blocks — drag to the prompt area or click to add</h3>
    </div>

    <div class="preview-panel">
      <div class="preview">
        <h3>📋 System Prompt Preview</h3>
        <div class="drop-zone" id="drop-zone">
          <div class="drop-hint" id="drop-hint">Drag blocks here to build your system prompt.<br>Order matters — identity first, then goal, tools, etc.</div>
        </div>
      </div>
    </div>
  </div>

  <div class="complete-section" id="complete">
    <h2>System Prompt Built!</h2>
    <p>You've assembled a complete agent system prompt. This is exactly how real agent frameworks structure their instructions.</p>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"System Prompt Block Definitions","cards":[{"front":"Identity Block","back":"Tells the agent who it is and what role it plays. Grounds all reasoning with a consistent voice, expertise area, and sense of purpose."},{"front":"Goal Block","back":"The agent\\\'s primary mission in one clear sentence. Everything the agent does serves this goal."},{"front":"Tools Block","back":"Lists what the agent can use to take real-world actions — APIs, databases, file systems, or external services."},{"front":"Guardrails Block","back":"Hard rules the agent must never violate. Written as explicit prohibitions: never delete production data, never share credentials."},{"front":"Why Block Order Matters","back":"Identity and goal first ensures all subsequent instructions are interpreted through the correct lens. Guardrails before identity makes them harder for the model to internalize."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"System Prompt Structure","questions":[{"q":"What is the purpose of the Identity block in a system prompt?","options":["It stores the agent API key","It tells the agent who it is and what role it plays, grounding all its reasoning","It lists which users are allowed to access the agent","It defines how fast the agent should respond"],"correct":1,"explanation":"The Identity block establishes the agent persona and role. It grounds the agent reasoning — giving it a consistent voice, area of expertise, and sense of purpose that shapes every decision."},{"q":"Why does block order matter in a system prompt?","options":["It does not matter — the LLM reads it all at once","Identity and goal first ensures the agent interprets all subsequent instructions through the right lens","The last block always takes priority","Order only matters for the output format block"],"correct":1,"explanation":"LLMs process context sequentially. Establishing identity and goal first means every tool description, guardrail, and output instruction is interpreted through the correct framing. A system prompt that starts with guardrails before identity is harder for the model to internalize correctly."},{"q":"What should the Guardrails block contain?","options":["A list of all available tools","Hard rules the agent must never violate, written as explicit prohibitions","A description of the agent personality","Examples of ideal responses"],"correct":1,"explanation":"Guardrails are explicit prohibitions — never delete production data, never share credentials, never send emails to external parties without confirmation. They are the safety layer of the system prompt."}]}'></div>

  <div data-learn="MatchConnect" data-props='{"title":"Match Each System Prompt Block to Its Purpose","instruction":"Tap one on the left, then its match on the right","pairs":[{"left":"Identity block","right":"Who the agent is and its role"},{"left":"Goal block","right":"The agent primary mission"},{"left":"Tools block","right":"What the agent can use to take actions"},{"left":"Guardrails block","right":"What the agent must never do"},{"left":"Output Format block","right":"How the agent should structure responses"}]}'></div>

  <div data-learn="SortStack" data-props='{"title":"Order the System Prompt Blocks","instruction":"Arrange these blocks in the recommended order for a well-structured system prompt","items":["Identity — who the agent is","Goal — what it is trying to achieve","Tools — what it can use","Memory — what context it carries","Guardrails — what it must never do","Output Format — how to respond"]}'></div>

</div>
