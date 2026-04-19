# Memory Matters

**Course:** Build Your First AI Agent
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[First AI Agent](/academy/first-ai-agent/)
  Lesson 6 of 10


  # Memory Matters

  Without memory, your agent is a goldfish — it forgets everything between sessions. With memory, it learns from every interaction and gets better over time. Here is how to implement both types.



    ## Two Types of Memory

    Agents need two kinds of memory, just like humans. Short-term memory holds the current conversation. Long-term memory persists across sessions.



        **Short-Term Memory**
        The conversation history. Each message and tool result from the current session. Lost when the session ends.
        Implementation: the `messages` array you send to Claude on every turn.


        **Long-Term Memory**
        Persistent storage — a database, vector store, or file. Survives across sessions, users, and restarts.
        Implementation: Supabase, Pinecone, or a simple JSON file that the agent reads on boot.





    ## Short-Term Memory in Code

    Short-term memory is simply the conversation history you pass to the API. Each turn adds to the array:


      # Short-term memory = the messages array

      messages = []



      # Turn 1: User asks a question

      messages.append({"role": "user", "content": "What is my account status?"})



      # Turn 1: Agent responds + uses a tool

      response = client.messages.create(messages=messages, ...)

      messages.append({"role": "assistant", "content": response.content})



      # Turn 2: User follows up — agent remembers Turn 1

      messages.append({"role": "user", "content": "Can you upgrade it?"})

      # Claude now sees the full history — it knows "it" = the account



      **The problem with short-term memory**
      When the messages array gets too long, it overflows the context window. When the session ends, the array is gone. The agent starts the next session knowing nothing about what happened before.




    ## Long-Term Memory in Code

    Long-term memory uses a database to persist knowledge across sessions. Here is a complete implementation using Supabase:


      from supabase import create_client



      supabase = create_client(url, key)



      def save_memory(key, value, category="general"):

        """Save a fact to long-term memory"""

        supabase.table("agent_memory").upsert({

          "key": key,

          "value": value,

          "category": category,

          "updated_at": "now()"

        }).execute()



      def recall_memory(key):

        """Retrieve a fact from long-term memory"""

        result = supabase.table("agent_memory").select("value")

          .eq("key", key).execute()

        return result.data[0]["value"] if result.data else None



      def search_memory(category):

        """Search all memories in a category"""

        result = supabase.table("agent_memory").select("*")

          .eq("category", category)

          .order("updated_at", desc=True).execute()

        return result.data



      # Using memory in the agent loop

      def agent_with_memory(user_message):

        # Boot: load relevant memories into context

        past_interactions = search_memory("customer_issues")

        user_prefs = recall_memory("user.preferences")



        # Include memories in the system prompt

        context = f"""You have the following memories:

      Past issues: {past_interactions}

      User preferences: {user_prefs}"""



        response = client.messages.create(

          system=SYSTEM_PROMPT + "\n" + context,

          ...

        )



        # After resolving: save what was learned

        save_memory(

          "resolution.login_failure",

          "Cache clearing does not fix login issues. Root cause is usually expired OAuth token.",

          category="customer_issues"

        )




    ## What to Store in Long-Term Memory

    Not everything should be saved. Store information that will make the agent better at future tasks:



        &#x2713; **Resolutions** — what fixed the problem and why


        &#x2713; **User preferences** — communication style, preferred tools, timezone


        &#x2713; **Failure patterns** — what did NOT work, so the agent does not retry dead ends


        &#x2713; **Domain knowledge** — facts learned from tools that the agent's training data does not have


        &#x2717; **Raw conversation logs** — too noisy. Save the insight, not every word.


        &#x2717; **Temporary state** — "user is on step 3 of signup." This belongs in short-term memory.





    ## The Context Window Problem

    As memory grows, you hit the context window limit — the maximum amount of text the model can process at once. Here is how production agents handle it:



        **Sliding window**
         — Keep the last N messages in full. Summarize or drop older messages. Claude Code uses this approach.


        **RAG (Retrieval-Augmented Generation)**
         — Store memories as embeddings in a vector database. On each turn, retrieve only the most relevant memories. Scales to millions of memories.


        **Summarization**
         — Periodically summarize old memories into compressed form. "We resolved 14 login issues this month. Most were expired OAuth tokens." Compact but lossy.





    ## Comparing Memory Configurations

    Consider a customer support agent that handles the same type of ticket three times. Each time, the issue is slightly different — but the pattern is the same. Here is how each memory configuration performs:



        **No Memory**
         — Starts fresh every single time. On ticket 3, it tries the same failed fix from ticket 1 because it has no record of what did not work. Performance stays flat.


        **Short-Term Memory**
         — Remembers within a single session. If all three tickets come in the same session, it learns from ticket 1 when handling ticket 3. But after a restart, it forgets everything.


        **Long-Term Memory**
         — Remembers everything, across all sessions. By ticket 3, it has stored the resolution pattern and solves it immediately. Performance improves with every interaction.






    ## Memory Anti-Patterns

    Long-term memory is powerful — but implemented poorly, it creates more problems than it solves. Avoid these common mistakes:



        **Storing Everything**
        Saving every message, every tool result, every intermediate step. This bloats storage, slows retrieval, and floods the context window with noise. The agent drowns in its own memories. **Fix:** Save insights and outcomes, not raw data. "OAuth tokens expire after 30 days" is better than 200 lines of debug logs.


        **Never Expiring Old Data**
        Memories from six months ago may be outdated or wrong. A product feature changed, a policy was updated, a workaround is no longer needed — but the agent still acts on stale information. **Fix:** Add TTLs (time-to-live) to memories. Flag memories older than 90 days for review. Let the agent update or delete memories it discovers are outdated.


        **No Access Controls on Stored Memories**
        If your agent serves multiple users and stores memories in a shared table without user scoping, User A's preferences leak into User B's experience. Worse, sensitive information (account details, personal data) becomes accessible to the wrong user. **Fix:** Scope every memory to a user ID. Use row-level security (RLS) in your database. Treat agent memory like user data — because it is.


        **No Memory Validation**
        The agent saves a hallucinated "fact" to memory — now it treats that hallucination as ground truth in every future session. Bad memories compound over time. **Fix:** Validate before storing. Only save memories derived from tool results (real data), not from the model's own generated text. Add a confidence score and review low-confidence memories periodically.





### Quiz

**Q1: What is the key limitation of short-term memory?**
    A. It is too slow
  ✓ B. It is lost when the session ends — the agent cannot learn across sessions
    C. It cannot store user preferences
    D. It uses too much storage
  *Short-term memory lives within a single session. When the session ends, the context is gone. The agent must re-learn from scratch on every new session.*

**Q2: In the code example, where does long-term memory get injected?**
    A. In the messages array as a user message
  ✓ B. In the system prompt as additional context
    C. In the tools parameter
    D. In the response
  *Long-term memories are loaded from the database and appended to the system prompt. This gives Claude persistent context without cluttering the message history.*

**Q3: What should you NOT store in long-term memory?**
    A. Successful resolutions
    B. Failure patterns that should not be retried
  ✓ C. Raw conversation logs — too noisy, save the insight instead
    D. User preferences
  *Raw conversation logs are too noisy and consume too much storage and context window. Save the insight: what was learned, what worked, what failed. Not every word of the conversation.*

**Q4: What is RAG and why does it matter for agent memory?**
    A. A model architecture that replaces transformers
  ✓ B. Retrieval-Augmented Generation — retrieve only relevant memories from a vector store, enabling memory to scale to millions of entries
    C. A type of fine-tuning
    D. A caching strategy
  *RAG stores memories as embeddings and retrieves only the most relevant ones on each turn. This means your agent can have millions of memories without overflowing the context window.*


### Memory Architecture

**Card 1:**
Front: Short-term memory
Back: The conversation history (messages array) for the current session. Lost when the session ends. Implementation: the messages parameter in the Claude API.

**Card 2:**
Front: Long-term memory
Back: Persistent storage (database, vector store) that survives across sessions. The agent loads relevant memories on boot and saves new learnings after each task.

**Card 3:**
Front: Context window overflow
Back: When memory grows larger than the model can process. Solutions: sliding window (keep last N messages), RAG (retrieve relevant memories only), or summarization (compress old memories).

**Card 4:**
Front: RAG (Retrieval-Augmented Generation)
Back: Store memories as vector embeddings. On each turn, retrieve only the most semantically relevant memories. Scales to millions without overflowing context.

**Card 5:**
Front: What to store in long-term memory
Back: Resolutions, user preferences, failure patterns, domain knowledge. NOT raw conversation logs or temporary state.

**Card 6:**
Front: The goldfish problem
Back: An agent without long-term memory starts every session from zero. It repeats the same mistakes, asks the same questions, and never improves. Memory is the cure.

**Card 7:**
Front: How to inject long-term memory
Back: Load relevant memories from the database on boot. Append them to the system prompt as context. The agent sees its own past knowledge alongside the current conversation.
