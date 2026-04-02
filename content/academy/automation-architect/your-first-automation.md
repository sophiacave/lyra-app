---
title: "Your First Automation"
course: "automation-architect"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>

<div class="lesson-container">
  <div class="lesson-badge">Module 1 &middot; Lesson 2</div>
  <h1>Your First Automation</h1>
  <p class="subtitle">Build a real automation from scratch — trigger, action, error handling, and testing. No toy examples. Production patterns from line one.</p>

  <div class="section">
    <h2>What You Are Building</h2>
    <p>A webhook automation that receives form submissions, validates the data, saves it to a database, and sends a confirmation email. This is the most common automation pattern in production — you will use variations of it hundreds of times.</p>

    <div style="display:flex;align-items:center;gap:.5rem;justify-content:center;margin:1.5rem 0;flex-wrap:wrap">
      <div style="padding:.6rem 1rem;border-radius:10px;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.15);text-align:center;min-width:100px">
        <div style="font-size:1.1rem">&#x1F517;</div>
        <strong style="color:#8b5cf6;font-size:.75rem">WEBHOOK</strong>
        <div style="font-size:.7rem;color:#a1a1aa">Form submitted</div>
      </div>
      <div style="font-size:1.2rem;color:#52525b">&rarr;</div>
      <div style="padding:.6rem 1rem;border-radius:10px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.15);text-align:center;min-width:100px">
        <div style="font-size:1.1rem">&#x1F6E1;</div>
        <strong style="color:#fb923c;font-size:.75rem">VALIDATE</strong>
        <div style="font-size:.7rem;color:#a1a1aa">Check payload</div>
      </div>
      <div style="font-size:1.2rem;color:#52525b">&rarr;</div>
      <div style="padding:.6rem 1rem;border-radius:10px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.15);text-align:center;min-width:100px">
        <div style="font-size:1.1rem">&#x1F4BE;</div>
        <strong style="color:#34d399;font-size:.75rem">SAVE</strong>
        <div style="font-size:.7rem;color:#a1a1aa">Write to DB</div>
      </div>
      <div style="font-size:1.2rem;color:#52525b">&rarr;</div>
      <div style="padding:.6rem 1rem;border-radius:10px;background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.15);text-align:center;min-width:100px">
        <div style="font-size:1.1rem">&#x1F4E7;</div>
        <strong style="color:#60a5fa;font-size:.75rem">NOTIFY</strong>
        <div style="font-size:.7rem;color:#a1a1aa">Send email</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Step 1: The Webhook Trigger</h2>
    <p>Every automation starts with a trigger. A webhook is a URL that waits for incoming HTTP POST requests. When data arrives, your code runs. Here is a webhook handler in Node.js using Express:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#71717a">// server.js — Your first automation</span><br>
      <span style="color:#c084fc">const</span> <span style="color:#e2e8f0">express</span> = <span style="color:#34d399">require</span>(<span style="color:#fb923c">'express'</span>);<br>
      <span style="color:#c084fc">const</span> <span style="color:#e2e8f0">app</span> = <span style="color:#34d399">express</span>();<br>
      <span style="color:#e2e8f0">app</span>.<span style="color:#34d399">use</span>(<span style="color:#e2e8f0">express</span>.<span style="color:#34d399">json</span>());<br>
      <br>
      <span style="color:#71717a">// TRIGGER: Webhook receives form data</span><br>
      <span style="color:#e2e8f0">app</span>.<span style="color:#34d399">post</span>(<span style="color:#fb923c">'/webhook/form-submitted'</span>, <span style="color:#c084fc">async</span> (<span style="color:#e2e8f0">req</span>, <span style="color:#e2e8f0">res</span>) => {<br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">payload</span> = <span style="color:#e2e8f0">req</span>.<span style="color:#e2e8f0">body</span>;<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a">// Acknowledge receipt IMMEDIATELY (within 3 seconds)</span><br>
      &nbsp;&nbsp;<span style="color:#71717a">// Process in the background — never block the webhook</span><br>
      &nbsp;&nbsp;<span style="color:#e2e8f0">res</span>.<span style="color:#34d399">status</span>(<span style="color:#fb923c">200</span>).<span style="color:#34d399">json</span>({ <span style="color:#e2e8f0">received</span>: <span style="color:#fb923c">true</span> });<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a">// Process asynchronously</span><br>
      &nbsp;&nbsp;<span style="color:#34d399">processFormSubmission</span>(<span style="color:#e2e8f0">payload</span>).<span style="color:#34d399">catch</span>(<span style="color:#e2e8f0">err</span> => {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">console</span>.<span style="color:#34d399">error</span>(<span style="color:#fb923c">'Automation failed:'</span>, <span style="color:#e2e8f0">err</span>);<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#34d399">saveToDeadLetterQueue</span>(<span style="color:#e2e8f0">payload</span>, <span style="color:#e2e8f0">err</span>);<br>
      &nbsp;&nbsp;});<br>
      });
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1);margin:1rem 0">
      <strong style="color:#fb923c;font-size:.85rem">Why respond immediately?</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Webhook senders (Stripe, Zapier, GitHub) expect a response within 3-5 seconds. If you do not respond in time, they will retry — causing duplicate processing. Always acknowledge first, process second.</p>
    </div>
  </div>

  <div class="section">
    <h2>Step 2: Validate the Payload</h2>
    <p>Never trust incoming data. Validate every field before processing. A missing email address should not crash your entire pipeline.</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">function</span> <span style="color:#34d399">validatePayload</span>(<span style="color:#e2e8f0">payload</span>) {<br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">errors</span> = [];<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (!<span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span>) <span style="color:#e2e8f0">errors</span>.<span style="color:#34d399">push</span>(<span style="color:#fb923c">'Missing email'</span>);<br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (!<span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">name</span>)  <span style="color:#e2e8f0">errors</span>.<span style="color:#34d399">push</span>(<span style="color:#fb923c">'Missing name'</span>);<br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (<span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span> && !<span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span>.<span style="color:#34d399">includes</span>(<span style="color:#fb923c">'@'</span>)) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">errors</span>.<span style="color:#34d399">push</span>(<span style="color:#fb923c">'Invalid email format'</span>);<br>
      &nbsp;&nbsp;}<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">return</span> {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">valid</span>: <span style="color:#e2e8f0">errors</span>.<span style="color:#e2e8f0">length</span> === <span style="color:#fb923c">0</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">errors</span><br>
      &nbsp;&nbsp;};<br>
      }
    </div>
  </div>

  <div class="section">
    <h2>Step 3: Save to Database</h2>
    <p>The action — what your automation actually does. This example uses Supabase, but the pattern works with any database:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">async function</span> <span style="color:#34d399">processFormSubmission</span>(<span style="color:#e2e8f0">payload</span>) {<br>
      &nbsp;&nbsp;<span style="color:#71717a">// 1. Validate</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">validation</span> = <span style="color:#34d399">validatePayload</span>(<span style="color:#e2e8f0">payload</span>);<br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (!<span style="color:#e2e8f0">validation</span>.<span style="color:#e2e8f0">valid</span>) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">throw new</span> <span style="color:#e2e8f0">Error</span>(<span style="color:#fb923c">`Validation failed: ${<span style="color:#e2e8f0">validation</span>.<span style="color:#e2e8f0">errors</span>.<span style="color:#34d399">join</span>(<span style="color:#fb923c">', '</span>)}`</span>);<br>
      &nbsp;&nbsp;}<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a">// 2. Idempotency check — prevent duplicate processing</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> { <span style="color:#e2e8f0">data</span>: <span style="color:#e2e8f0">existing</span> } = <span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'submissions'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">select</span>(<span style="color:#fb923c">'id'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">'email'</span>, <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">'submitted_at'</span>, <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">submitted_at</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">single</span>();<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (<span style="color:#e2e8f0">existing</span>) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">console</span>.<span style="color:#34d399">log</span>(<span style="color:#fb923c">'Duplicate detected, skipping'</span>);<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span>;<br>
      &nbsp;&nbsp;}<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a">// 3. Save to database</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> { <span style="color:#e2e8f0">error</span> } = <span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'submissions'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">insert</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">name</span>: <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">name</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">email</span>: <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">message</span>: <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">message</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">submitted_at</span>: <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">submitted_at</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;});<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">if</span> (<span style="color:#e2e8f0">error</span>) <span style="color:#c084fc">throw</span> <span style="color:#e2e8f0">error</span>;<br>
      <br>
      &nbsp;&nbsp;<span style="color:#71717a">// 4. Send confirmation email</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">await</span> <span style="color:#34d399">sendConfirmation</span>(<span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">email</span>, <span style="color:#e2e8f0">payload</span>.<span style="color:#e2e8f0">name</span>);<br>
      }
    </div>

    <div style="padding:.75rem 1rem;border-radius:8px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1);margin:1rem 0">
      <strong style="color:#8b5cf6;font-size:.85rem">The idempotency check is critical</strong>
      <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Webhooks can fire twice (network retry, timeout, server restart). Without the duplicate check on line 8-13, you would save the same submission twice and send two confirmation emails. Always check before inserting.</p>
    </div>
  </div>

  <div class="section">
    <h2>Step 4: Error Handling &amp; Dead Letter Queue</h2>
    <p>Production automations fail. The database goes down. The email API rate-limits you. Your code needs to handle every failure without losing data:</p>

    <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin:1rem 0;font-family:monospace;font-size:.78rem;line-height:1.7;overflow-x:auto">
      <span style="color:#c084fc">async function</span> <span style="color:#34d399">saveToDeadLetterQueue</span>(<span style="color:#e2e8f0">payload</span>, <span style="color:#e2e8f0">error</span>) {<br>
      &nbsp;&nbsp;<span style="color:#71717a">// Save failed messages for retry later</span><br>
      &nbsp;&nbsp;<span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'dead_letter_queue'</span>).<span style="color:#34d399">insert</span>({<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">payload</span>: <span style="color:#e2e8f0">JSON</span>.<span style="color:#34d399">stringify</span>(<span style="color:#e2e8f0">payload</span>),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">error_message</span>: <span style="color:#e2e8f0">error</span>.<span style="color:#e2e8f0">message</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">failed_at</span>: <span style="color:#c084fc">new</span> <span style="color:#e2e8f0">Date</span>().<span style="color:#34d399">toISOString</span>(),<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">retry_count</span>: <span style="color:#fb923c">0</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">status</span>: <span style="color:#fb923c">'pending'</span><br>
      &nbsp;&nbsp;});<br>
      }<br>
      <br>
      <span style="color:#71717a">// Retry failed messages (run on a schedule, e.g. every 10 min)</span><br>
      <span style="color:#c084fc">async function</span> <span style="color:#34d399">retryFailedMessages</span>() {<br>
      &nbsp;&nbsp;<span style="color:#c084fc">const</span> { <span style="color:#e2e8f0">data</span>: <span style="color:#e2e8f0">failed</span> } = <span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'dead_letter_queue'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">select</span>(<span style="color:#fb923c">'*'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">'status'</span>, <span style="color:#fb923c">'pending'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">lt</span>(<span style="color:#fb923c">'retry_count'</span>, <span style="color:#fb923c">3</span>);<br>
      <br>
      &nbsp;&nbsp;<span style="color:#c084fc">for</span> (<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">msg</span> <span style="color:#c084fc">of</span> <span style="color:#e2e8f0">failed</span>) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">try</span> {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">await</span> <span style="color:#34d399">processFormSubmission</span>(<span style="color:#e2e8f0">JSON</span>.<span style="color:#34d399">parse</span>(<span style="color:#e2e8f0">msg</span>.<span style="color:#e2e8f0">payload</span>));<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'dead_letter_queue'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">update</span>({ <span style="color:#e2e8f0">status</span>: <span style="color:#fb923c">'resolved'</span> })<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">'id'</span>, <span style="color:#e2e8f0">msg</span>.<span style="color:#e2e8f0">id</span>);<br>
      &nbsp;&nbsp;&nbsp;&nbsp;} <span style="color:#c084fc">catch</span> (<span style="color:#e2e8f0">err</span>) {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">await</span> <span style="color:#e2e8f0">supabase</span>.<span style="color:#34d399">from</span>(<span style="color:#fb923c">'dead_letter_queue'</span>)<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">update</span>({ <span style="color:#e2e8f0">retry_count</span>: <span style="color:#e2e8f0">msg</span>.<span style="color:#e2e8f0">retry_count</span> + <span style="color:#fb923c">1</span> })<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span style="color:#34d399">eq</span>(<span style="color:#fb923c">'id'</span>, <span style="color:#e2e8f0">msg</span>.<span style="color:#e2e8f0">id</span>);<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;}<br>
      }
    </div>
  </div>

  <div class="section">
    <h2>Step 5: Testing Your Automation</h2>
    <p>Never deploy without testing. Here is how to test each layer of your automation — from unit tests to end-to-end:</p>

    <div style="display:flex;flex-direction:column;gap:.75rem;margin:1rem 0">
      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(52,211,153,.04);border:1px solid rgba(52,211,153,.1)">
        <strong style="color:#34d399">Unit Test: Validation</strong>
        <div style="background:#0a0a0f;border-radius:8px;padding:.75rem;margin:.5rem 0;font-family:monospace;font-size:.75rem;line-height:1.6;overflow-x:auto">
          <span style="color:#71717a">// test/validation.test.js</span><br>
          <span style="color:#34d399">test</span>(<span style="color:#fb923c">'rejects missing email'</span>, () => {<br>
          &nbsp;&nbsp;<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">result</span> = <span style="color:#34d399">validatePayload</span>({ <span style="color:#e2e8f0">name</span>: <span style="color:#fb923c">'Alice'</span> });<br>
          &nbsp;&nbsp;<span style="color:#34d399">expect</span>(<span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">valid</span>).<span style="color:#34d399">toBe</span>(<span style="color:#fb923c">false</span>);<br>
          &nbsp;&nbsp;<span style="color:#34d399">expect</span>(<span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">errors</span>).<span style="color:#34d399">toContain</span>(<span style="color:#fb923c">'Missing email'</span>);<br>
          });<br>
          <br>
          <span style="color:#34d399">test</span>(<span style="color:#fb923c">'accepts valid payload'</span>, () => {<br>
          &nbsp;&nbsp;<span style="color:#c084fc">const</span> <span style="color:#e2e8f0">result</span> = <span style="color:#34d399">validatePayload</span>({<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">name</span>: <span style="color:#fb923c">'Alice'</span>,<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#e2e8f0">email</span>: <span style="color:#fb923c">'alice@example.com'</span><br>
          &nbsp;&nbsp;});<br>
          &nbsp;&nbsp;<span style="color:#34d399">expect</span>(<span style="color:#e2e8f0">result</span>.<span style="color:#e2e8f0">valid</span>).<span style="color:#34d399">toBe</span>(<span style="color:#fb923c">true</span>);<br>
          });
        </div>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(139,92,246,.04);border:1px solid rgba(139,92,246,.1)">
        <strong style="color:#8b5cf6">Integration Test: Full Pipeline</strong>
        <div style="background:#0a0a0f;border-radius:8px;padding:.75rem;margin:.5rem 0;font-family:monospace;font-size:.75rem;line-height:1.6;overflow-x:auto">
          <span style="color:#71717a">// Test with cURL — send a real request to your webhook</span><br>
          <span style="color:#34d399">curl</span> <span style="color:#fb923c">-X POST</span> <span style="color:#a1a1aa">http://localhost:3000/webhook/form-submitted</span> \<br>
          &nbsp;&nbsp;<span style="color:#8b5cf6">-H</span> <span style="color:#a1a1aa">"Content-Type: application/json"</span> \<br>
          &nbsp;&nbsp;<span style="color:#8b5cf6">-d</span> <span style="color:#a1a1aa">'{"name":"Test User","email":"test@example.com","message":"Hello"}'</span>
        </div>
        <p style="font-size:.8rem;color:#a1a1aa;margin:.3rem 0 0">Then check: Did the database get a new row? Did the dead letter queue stay empty? Was the email sent?</p>
      </div>

      <div style="padding:1rem 1.25rem;border-radius:10px;background:rgba(251,146,60,.04);border:1px solid rgba(251,146,60,.1)">
        <strong style="color:#fb923c">Failure Test: What Breaks?</strong>
        <div style="background:#0a0a0f;border-radius:8px;padding:.75rem;margin:.5rem 0;font-family:monospace;font-size:.75rem;line-height:1.6;overflow-x:auto">
          <span style="color:#71717a">// Send invalid data — does validation catch it?</span><br>
          <span style="color:#34d399">curl</span> <span style="color:#fb923c">-X POST</span> <span style="color:#a1a1aa">http://localhost:3000/webhook/form-submitted</span> \<br>
          &nbsp;&nbsp;<span style="color:#8b5cf6">-H</span> <span style="color:#a1a1aa">"Content-Type: application/json"</span> \<br>
          &nbsp;&nbsp;<span style="color:#8b5cf6">-d</span> <span style="color:#a1a1aa">'{"name":"No Email User"}'</span><br>
          <br>
          <span style="color:#71717a">// Send the same payload twice — does idempotency work?</span><br>
          <span style="color:#71717a">// Second call should be silently skipped, no duplicate row</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Five Failure Modes</h2>
    <p>Every automation you build will encounter these failures. Knowing them means you design for them from day one:</p>

    <div style="display:flex;flex-direction:column;gap:.5rem;margin:1rem 0">
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">1. Duplicate triggers</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Webhook fires twice due to timeout/retry. <strong>Fix:</strong> Idempotency check before processing. Use a unique key (email + timestamp) to detect duplicates.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">2. Partial failure</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Database save succeeds but email send fails. <strong>Fix:</strong> Each step should be independently retriable. Save state after each step so retry knows where to resume.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">3. Invalid payload</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — Missing fields, wrong types, unexpected values. <strong>Fix:</strong> Validate immediately. Reject bad data before it touches your database.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">4. Downstream service outage</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — The email API or database is down. <strong>Fix:</strong> Dead letter queue preserves the message. Scheduled retry picks it up when the service recovers.</span>
      </div>
      <div style="padding:.75rem 1rem;border-radius:10px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.1)">
        <strong style="color:#ef4444;font-size:.85rem">5. Payload format change</strong>
        <span style="font-size:.8rem;color:#a1a1aa"> — The external service updates their API. Fields you depend on no longer exist. <strong>Fix:</strong> Validate payload structure, not just individual fields. Log unexpected shapes for debugging.</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>The Complete Script in Python</h2>
    <p>Everything above — webhook, validation, database, email, error handling — combined into a single production-ready Python automation. This is the pattern you will reuse for every webhook automation you build:</p>

    <div style="background:#0a0a0a;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1.25rem;margin:1rem 0;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#a1a1aa;line-height:1.7;overflow-x:auto">
<div style="font-size:.7rem;color:#71717a;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em">Python — Complete form-submission automation</div>
<pre style="margin:0;color:#e5e5e5"><code><span style="color:#c084fc">from</span> flask <span style="color:#c084fc">import</span> Flask, request, jsonify
<span style="color:#c084fc">from</span> supabase <span style="color:#c084fc">import</span> create_client
<span style="color:#c084fc">import</span> os, smtplib
<span style="color:#c084fc">from</span> email.message <span style="color:#c084fc">import</span> EmailMessage

app = <span style="color:#34d399">Flask</span>(__name__)
db = <span style="color:#34d399">create_client</span>(os.environ[<span style="color:#fb923c">"SUPABASE_URL"</span>], os.environ[<span style="color:#fb923c">"SUPABASE_KEY"</span>])

<span style="color:#c084fc">def</span> <span style="color:#34d399">validate</span>(payload: dict) -> list:
    <span style="color:#fb923c">"""Return list of errors. Empty list = valid."""</span>
    errors = []
    <span style="color:#c084fc">if</span> <span style="color:#c084fc">not</span> payload.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"email"</span>):
        errors.<span style="color:#34d399">append</span>(<span style="color:#fb923c">"Missing email"</span>)
    <span style="color:#c084fc">elif</span> <span style="color:#fb923c">"@"</span> <span style="color:#c084fc">not</span> <span style="color:#c084fc">in</span> payload[<span style="color:#fb923c">"email"</span>]:
        errors.<span style="color:#34d399">append</span>(<span style="color:#fb923c">"Invalid email"</span>)
    <span style="color:#c084fc">if</span> <span style="color:#c084fc">not</span> payload.<span style="color:#34d399">get</span>(<span style="color:#fb923c">"name"</span>):
        errors.<span style="color:#34d399">append</span>(<span style="color:#fb923c">"Missing name"</span>)
    <span style="color:#c084fc">return</span> errors

<span style="color:#c084fc">def</span> <span style="color:#34d399">send_email</span>(to: str, name: str):
    msg = <span style="color:#34d399">EmailMessage</span>()
    msg[<span style="color:#fb923c">"Subject"</span>] = <span style="color:#fb923c">"We got your submission!"</span>
    msg[<span style="color:#fb923c">"To"</span>] = to
    msg.<span style="color:#34d399">set_content</span>(<span style="color:#fb923c">f"Hi </span>{name}<span style="color:#fb923c">, thanks for reaching out."</span>)
    <span style="color:#c084fc">with</span> smtplib.<span style="color:#34d399">SMTP</span>(<span style="color:#fb923c">"smtp.example.com"</span>, <span style="color:#fb923c">587</span>) <span style="color:#c084fc">as</span> s:
        s.<span style="color:#34d399">starttls</span>()
        s.<span style="color:#34d399">send_message</span>(msg)

<span style="color:#c084fc">@</span>app.<span style="color:#34d399">route</span>(<span style="color:#fb923c">"/webhook/form"</span>, methods=[<span style="color:#fb923c">"POST"</span>])
<span style="color:#c084fc">def</span> <span style="color:#34d399">handle_form</span>():
    payload = request.<span style="color:#34d399">get_json</span>()

    <span style="color:#71717a"># 1. Validate</span>
    errors = <span style="color:#34d399">validate</span>(payload)
    <span style="color:#c084fc">if</span> errors:
        <span style="color:#c084fc">return</span> <span style="color:#34d399">jsonify</span>({<span style="color:#fb923c">"errors"</span>: errors}), <span style="color:#fb923c">400</span>

    <span style="color:#71717a"># 2. Idempotency check</span>
    existing = db.table(<span style="color:#fb923c">"submissions"</span>).<span style="color:#34d399">select</span>(<span style="color:#fb923c">"id"</span>) \
        .<span style="color:#34d399">eq</span>(<span style="color:#fb923c">"email"</span>, payload[<span style="color:#fb923c">"email"</span>]).<span style="color:#34d399">execute</span>()
    <span style="color:#c084fc">if</span> existing.data:
        <span style="color:#c084fc">return</span> <span style="color:#34d399">jsonify</span>({<span style="color:#fb923c">"status"</span>: <span style="color:#fb923c">"duplicate"</span>}), <span style="color:#fb923c">200</span>

    <span style="color:#71717a"># 3. Save + notify (with error recovery)</span>
    <span style="color:#c084fc">try</span>:
        db.table(<span style="color:#fb923c">"submissions"</span>).<span style="color:#34d399">insert</span>(payload).<span style="color:#34d399">execute</span>()
        <span style="color:#34d399">send_email</span>(payload[<span style="color:#fb923c">"email"</span>], payload[<span style="color:#fb923c">"name"</span>])
    <span style="color:#c084fc">except</span> Exception <span style="color:#c084fc">as</span> e:
        db.table(<span style="color:#fb923c">"dead_letter_queue"</span>).<span style="color:#34d399">insert</span>({
            <span style="color:#fb923c">"payload"</span>: payload, <span style="color:#fb923c">"error"</span>: <span style="color:#34d399">str</span>(e)
        }).<span style="color:#34d399">execute</span>()

    <span style="color:#c084fc">return</span> <span style="color:#34d399">jsonify</span>({<span style="color:#fb923c">"received"</span>: <span style="color:#c084fc">True</span>}), <span style="color:#fb923c">200</span></code></pre>
</div>
  </div>

  <div class="section">
    <h2>Putting It All Together</h2>
    <p>Every automation you build follows the same three decisions: (1) pick a trigger — what event starts the workflow, (2) pick an action — what the automation does with the data, and (3) connect them with validation, error handling, and idempotency in between. The code above gives you the complete production pattern for the most common case: webhook trigger with database save and email notification.</p>
  </div>
</div>

<div class="section" style="padding:0 1.5rem">
  <h2>Production Checklist</h2>
  <p>Before deploying any automation to production, verify every item:</p>

  <div style="display:flex;flex-direction:column;gap:.3rem;margin:1rem 0">
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Webhook responds within 3 seconds (acknowledge first, process async)
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Payload validation rejects bad data before any processing
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Idempotency check prevents duplicate processing
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Dead letter queue catches all failures — no data lost
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Retry logic with max attempts (3 retries, then stop)
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Integration test passes with real HTTP request
    </div>
    <div style="display:flex;align-items:center;gap:.5rem;padding:.4rem .75rem;font-size:.85rem;color:#a1a1aa">
      <span style="color:#34d399">&#x2713;</span> Failure test passes — bad data handled gracefully
    </div>
  </div>
</div>

<footer class="progress-footer">
  <p>Lesson 2 of 9 &middot; Automation Architect</p>
</footer>
<div data-learn="FlashDeck" data-props='{"title":"Production Automation Patterns","cards":[{"front":"Why respond to webhooks immediately?","back":"Webhook senders expect a response within 3-5 seconds. If you do not respond in time, they retry — causing duplicate processing. Always acknowledge first, process in the background."},{"front":"Idempotency","back":"An operation that produces the same result even if executed multiple times. Check for existing records (by unique key) before inserting to prevent duplicates from webhook retries."},{"front":"Dead letter queue","back":"A storage location for messages that failed processing. Preserves the original payload and error details for manual inspection and automated retry."},{"front":"Payload validation","back":"Check that all required fields exist and have correct types BEFORE processing. Reject invalid data at the gate — do not let it reach your database."},{"front":"Partial failure","back":"When step 3 of 5 succeeds but step 4 fails. Each step should be independently retriable. Save state after each step so retry knows where to resume."},{"front":"Exponential backoff","back":"A retry strategy that waits progressively longer between attempts (1s, 2s, 4s, 8s). Prevents hammering a struggling service while it recovers."},{"front":"Integration testing an automation","back":"Send a real HTTP POST to your webhook with test data. Then verify: database row created? Email sent? Dead letter queue empty? Duplicates handled?"},{"front":"The three test layers","back":"(1) Unit test: validate individual functions like payload validation. (2) Integration test: send real HTTP request, check full pipeline. (3) Failure test: send bad data, verify graceful handling."}]}'></div>

<div data-learn="QuizMC" data-props='{"title":"Your First Automation Quiz","questions":[{"q":"Why should a webhook handler respond with 200 before processing the data?","options":["To make the response faster for users","Because webhook senders retry if they do not get a response within 3-5 seconds","Because 200 is the only valid status code","To save server memory"],"correct":1,"explanation":"Webhook senders like Stripe and GitHub expect a response within seconds. No response = retry = duplicate processing. Always acknowledge receipt immediately, then process asynchronously."},{"q":"What is an idempotency check?","options":["A security scan of the payload","Verifying the webhook URL is correct","Checking if this exact payload was already processed to prevent duplicates","A test that runs after deployment"],"correct":2,"explanation":"An idempotency check queries your database for an existing record with the same unique key (like email + timestamp). If found, skip processing. This prevents duplicates from webhook retries."},{"q":"A webhook automation saves to the database successfully but fails to send the email. What should happen?","options":["Delete the database record and start over","Save the failure to a dead letter queue for retry","Ignore the email failure — database is enough","Crash the entire server to alert the developer"],"correct":1,"explanation":"This is a partial failure. The dead letter queue preserves the original payload so a scheduled retry job can attempt the email again without re-saving to the database."},{"q":"Which is NOT a good practice for production automations?","options":["Validate payloads before processing","Respond to webhooks immediately","Process data synchronously inside the webhook handler and block until done","Use a dead letter queue for failures"],"correct":2,"explanation":"Processing synchronously blocks the webhook response. If processing takes more than 3-5 seconds, the sender retries. Always respond immediately and process asynchronously."},{"q":"What should you test BEFORE deploying an automation?","options":["Only that the happy path works","Validation, full pipeline, AND failure scenarios","Only the database connection","Only the email sending"],"correct":1,"explanation":"Test all three layers: unit tests for validation, integration tests for the full pipeline with real HTTP requests, and failure tests to verify graceful error handling."}]}'></div>
