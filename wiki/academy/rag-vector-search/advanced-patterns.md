# Advanced Patterns

**Course:** RAG & Vector Search
**Order:** 9
**Type:** lesson
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 9 of 10


  # Advanced RAG Patterns

  Basic RAG handles straightforward questions. But real-world queries are messy — vague, multi-step, requiring calculations, or spanning multiple knowledge bases. Four advanced patterns handle these cases: Multi-Step RAG, Self-RAG, RAG+Tools, and Agentic RAG. This lesson teaches you when to use each and how to implement them.



    ## When Basic RAG Is Not Enough

    Basic RAG works beautifully for direct questions with clear answers in your knowledge base: "What is the refund policy?" retrieves the policy chunk and generates a grounded answer. But consider these harder cases:


      **"What causes that disease where you forget things?"** → The query is too vague for precise retrieval. Basic RAG might return general cognitive decline articles instead of targeted Alzheimer's content.


      **"What is 2 + 2?"** → This does not need retrieval at all. Fetching documents wastes time and money.


      **"How much did we spend on marketing last quarter?"** → The answer requires a calculation on retrieved data, not just a summary.


      **"Compare our 2023 and 2024 product roadmaps"** → The answer spans multiple document collections and requires synthesis.


    Each of these scenarios needs a different pattern. Here is when to use each:


      **Decision Guide:**

      Is the query vague or uses informal language? → **Multi-Step RAG**

      Does the query even need retrieval? → **Self-RAG**

      Does the answer need math, API calls, or live data? → **RAG + Tools**

      Does the question span multiple databases or need planning? → **Agentic RAG**

      None of the above? → **Basic RAG is fine.**




    ## Pattern 1: Multi-Step RAG

    Like asking follow-up questions. The first retrieval finds relevant documents, the LLM extracts better keywords from those documents, and a second retrieval uses those refined terms for precise results.

    **Best for:** Vague, colloquial queries that need technical vocabulary. Multi-hop questions requiring information from different sections.



```
def multi_step_rag(question, rag_search, generate):
    """Refine the query using first-round retrieval, then search again."""

    # Step 1: Initial retrieval with the vague query
    initial_chunks = rag_search(question, top_k=3)
    initial_context = "\n".join([c["content"] for c in initial_chunks])

    # Step 2: Ask the LLM to refine the query
    refined = generate(
        system="Based on the context below, rewrite the user's question "
               "using precise technical terms found in the documents. "
               "Return ONLY the refined query, nothing else.",
        user=f"Context:\n{initial_context}\n\nOriginal query: {question}"
    )

    # Step 3: Second retrieval with the refined query
    final_chunks = rag_search(refined, top_k=5)

    # Step 4: Generate answer from better context
    return generate_grounded_answer(question, final_chunks)

# Example: "that disease where you forget things"
# Step 1 retrieves general cognitive decline articles
# Step 2 refines to "Alzheimer's disease amyloid plaques tau proteins"
# Step 3 retrieves precise Alzheimer's research papers
```





    ## Pattern 2: Self-RAG

    The LLM decides *whether* it needs to retrieve at all, then self-evaluates the quality of its answer after generating. This saves retrieval costs for simple questions and catches hallucinations through self-critique.

    **Best for:** High-volume systems where many queries are simple and do not need retrieval.



```
def self_rag(question, rag_search, generate):
    """Let the LLM decide if retrieval is needed, then self-evaluate."""

    # Step 1: Should we retrieve?
    needs_retrieval = generate(
        system="Does this question require looking up specific information "
               "from a knowledge base? Answer YES or NO only.",
        user=question
    ).strip().upper()

    if needs_retrieval == "YES":
        chunks = rag_search(question, top_k=5)
        answer = generate_grounded_answer(question, chunks)
    else:
        answer = generate(system="Answer directly.", user=question)

    # Step 2: Self-evaluate
    evaluation = generate(
        system="Rate the answer's quality 1-5. If below 3, say RETRY.",
        user=f"Q: {question}\nA: {answer}"
    )

    if "RETRY" in evaluation:
        # Force retrieval on retry
        chunks = rag_search(question, top_k=8)
        answer = generate_grounded_answer(question, chunks)

    return answer
```





    ## Pattern 3: RAG + Tools

    Retrieval alone is not always enough. Sometimes the answer requires a calculation on retrieved data, an API call for live information, or a database query. RAG+Tools gives the LLM access to executable functions alongside document retrieval.

    **Best for:** Financial queries requiring math, questions needing live data, data transformation tasks.



```
import anthropic

claude = anthropic.Anthropic()

tools = [
    {
        "name": "search_knowledge_base",
        "description": "Search the knowledge base for relevant documents",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculate",
        "description": "Perform a mathematical calculation",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Math expression"}
            },
            "required": ["expression"]
        }
    }
]

# The LLM decides which tools to call and in what order
response = claude.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "How much did marketing spend last quarter and what % of total budget was that?"
    }]
)
# LLM calls search_knowledge_base → gets spending data → calls calculate → returns answer
```





    ## Pattern 4: Agentic RAG

    The most powerful pattern — an autonomous agent that plans its own retrieval strategy. Given a complex question, it decides which knowledge bases to search, in what order, evaluates whether it has enough information, and iterates until it can give a complete answer.

    **Best for:** Enterprise knowledge bases spanning multiple collections. Research-style queries requiring synthesis from diverse sources. Questions that require a multi-step investigation.



```
class AgenticRAG:
    def __init__(self, knowledge_bases):
        self.kbs = knowledge_bases  # {"hr": hr_search, "finance": finance_search, ...}
        self.context = []
        self.max_iterations = 5

    def plan(self, question):
        """Ask the LLM to create a retrieval plan."""
        return generate(
            system=f"Available knowledge bases: {list(self.kbs.keys())}. "
                   "Create a step-by-step plan to answer this question. "
                   "For each step, specify which KB to search and what query.",
            user=question
        )

    def execute(self, question):
        """Run the agentic loop: plan → search → evaluate → iterate."""
        plan = self.plan(question)

        for iteration in range(self.max_iterations):
            # Execute next step in the plan
            kb_name, query = self.parse_next_step(plan)
            chunks = self.kbs[kb_name](query, top_k=5)
            self.context.extend(chunks)

            # Evaluate: do we have enough info?
            sufficient = generate(
                system="Given this context, can you fully answer the question? "
                       "YES or NO with reason.",
                user=f"Q: {question}\nContext: {self.format_context()}"
            )

            if "YES" in sufficient:
                break

        return generate_grounded_answer(question, self.context)
```




      **When NOT to use Agentic RAG:** Simple questions with a single knowledge source. Agentic RAG is the most powerful but also the slowest and most expensive pattern — multiple LLM calls, multiple searches, planning overhead. For straightforward queries, basic RAG is faster, cheaper, and easier to debug.




    ## Choosing the Right Pattern

    Start simple and upgrade only when needed:


      **80% of queries:** Basic RAG handles them perfectly. Do not over-engineer.

      **10% of queries:** Multi-Step or Self-RAG improves quality for vague or simple queries.

      **8% of queries:** RAG+Tools handles queries needing calculation or live data.

      **2% of queries:** Agentic RAG handles complex, multi-source research queries.


      Build basic RAG first. Measure where it fails. Add advanced patterns only for the failure cases.



  Test Your Understanding


### Quiz

**Q1: A user asks: "What causes that disease where you forget things?" Which pattern is most appropriate?**
    A. Basic RAG — just search for the query as-is
  ✓ B. Multi-Step RAG — first retrieve with the vague query, then refine to technical terminology
    C. Self-RAG — the model likely knows this without retrieval
    D. Agentic RAG — deploy an agent to plan the search
  *Multi-Step RAG is designed for vague, colloquial queries. The first retrieval finds documents mentioning memory loss and cognitive decline. The LLM uses those terms to refine the query to precise medical terminology, then the second retrieval finds targeted results.*

**Q2: What is the key cost-saving benefit of Self-RAG?**
    A. It uses a cheaper embedding model
  ✓ B. It skips retrieval for queries that don't need it, saving vector DB calls and context tokens
    C. It compresses chunk sizes automatically
    D. It caches all previous query results
  *Self-RAG lets the LLM decide whether retrieval is needed. Simple factual questions can be answered directly without a vector search. This reduces latency and cost for high-volume applications where many queries are simple.*

**Q3: When should you NOT use Agentic RAG?**
    A. When the question spans multiple knowledge bases
    B. When complex synthesis across sources is needed
  ✓ C. When a simple single-source query would work with basic RAG
    D. When the user needs a comprehensive research-style answer
  *Agentic RAG is the most powerful but also the slowest and most expensive pattern. For simple questions with a single knowledge source, basic RAG works better — faster, cheaper, and easier to debug.*

**Q4: A user asks "How much revenue did we make in Q3 and what was the growth rate vs Q2?" Which pattern?**
    A. Basic RAG — it can find the numbers
    B. Multi-Step RAG — the query needs refinement
  ✓ C. RAG + Tools — retrieval finds the data, a calculator computes the growth rate
    D. Self-RAG — no retrieval needed
  *This query requires two things: (1) retrieving revenue figures from the knowledge base, and (2) calculating a growth rate — a mathematical operation that RAG alone cannot do. RAG+Tools combines document retrieval with a calculator tool.*



### Advanced Pattern Vocabulary

**Card 1:**
Front: Multi-Step RAG
Back: Query → retrieve → refine query using terminology from results → retrieve again. Handles vague input by iteratively improving the search.

**Card 2:**
Front: Self-RAG
Back: LLM first decides "do I need to retrieve?" then after answering, self-evaluates quality. Saves cost on simple queries, catches hallucinations.

**Card 3:**
Front: RAG + Tools
Back: Combines document retrieval with executable tools (calculator, API calls, database queries) for questions requiring more than text lookup.

**Card 4:**
Front: Agentic RAG
Back: An autonomous agent that plans its own multi-source retrieval strategy, executes searches, evaluates sufficiency, and iterates until complete.

**Card 5:**
Front: Query Refinement
Back: Using the LLM to rewrite a vague query into precise technical vocabulary based on terms found in first-round retrieval results.

**Card 6:**
Front: Tool Use (Function Calling)
Back: The LLM decides which tools to call and with what parameters. In RAG+Tools, the knowledge base search is one tool among several.
