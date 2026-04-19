# Prompt Augmentation

**Course:** RAG & Vector Search
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 6 of 10


  # Prompt Augmentation

  The "A" in RAG. You have retrieved the right documents — now you need to hand them to the LLM in a way that produces accurate, grounded answers instead of confident hallucinations. Prompt engineering for RAG is a discipline of its own. This lesson teaches you the templates, the rules, and the code to get it right.



    ## The Critical Moment

    You have retrieved your top-K chunks. They contain the information the user needs. But the answer quality now depends entirely on **how you present that context to the LLM**. A poorly constructed prompt can produce hallucinations even with perfect retrieval. A well-constructed prompt produces grounded, citable answers every time.

    There are three elements to get right: **grounding instructions** (tell the LLM to use only the context), **context formatting** (make the context easy to parse), and **fallback handling** (what to do when the context does not contain the answer).



    ## Same Question, Dramatically Different Answers




        Without RAG Context
        *"What is the refund policy for the Pro plan?"*
        Based on industry standards, most SaaS companies offer a 30-day money-back guarantee for their Pro plans. You can typically request a refund through the settings page or by emailing support@company.com.
        3 hallucinations. Sounds confident but completely fabricated.


        With RAG Context
        *"What is the refund policy for the Pro plan?"*
        According to the billing documentation, the Pro plan has a 14-day refund window from the date of purchase. To request a refund, contact billing@acme.io with your order number. After 14 days, refunds are handled on a case-by-case basis.
        0 hallucinations. Every claim traced to retrieved context.



    The difference is not the LLM — it is the prompt. The grounded answer uses a template that forces the model to answer from context, not from its training data.



    ## The RAG Prompt Template

    Here is the production-grade template that prevents hallucination:



```
import anthropic

claude = anthropic.Anthropic()

SYSTEM_PROMPT = """You are a knowledgeable assistant. Follow these rules strictly:

1. Answer based ONLY on the provided context documents.
2. If the context does not contain enough information to answer,
   say "I don't have that information in my knowledge base."
3. Cite the source document for each claim using [Source: filename].
4. If multiple sources agree, mention all of them.
5. If sources contradict each other, note the discrepancy.
6. Keep answers concise — 2-4 sentences for simple questions,
   structured paragraphs for complex ones.
7. Never speculate or fill gaps with general knowledge."""

def build_augmented_prompt(question, chunks):
    """Build a RAG prompt with retrieved context."""

    # Format each chunk with clear delimiters and source
    context_sections = []
    for i, chunk in enumerate(chunks):
        source = chunk.get("source", "unknown")
        score = chunk.get("similarity", 0)
        context_sections.append(
            f"--- Document {i+1} [Source: {source}] (relevance: {score:.2f}) ---\n"
            f"{chunk['content']}"
        )

    context = "\n\n".join(context_sections)

    user_message = f"""Context documents:

{context}

---

Question: {question}"""

    return user_message

def generate_answer(question, chunks):
    """Generate a grounded answer from retrieved chunks."""
    user_message = build_augmented_prompt(question, chunks)

    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        temperature=0.1,  # Low temperature for factual answers
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )
    return response.content[0].text
```





    ## Six Rules for RAG Prompts

    These rules are the difference between a RAG system that hallucInates 30% of the time and one that hallucInates 3% of the time:



        **Rule 1: Be Explicit About Grounding**
        "Answer ONLY based on the provided context" is the most important instruction in any RAG prompt. Without it, the LLM blends context with training data — introducing potential hallucinations even with perfect retrieval.


        **Rule 2: Handle Missing Information**
        "If the context doesn't contain the answer, say 'I don't have that information.'" This prevents the model from filling gaps with plausible-sounding inventions. A truthful "I don't know" is infinitely more valuable than a confident hallucination.


        **Rule 3: Request Citations**
        "Cite the source for each claim" makes answers verifiable. Users can check the original document. It also catches hallucinations — if the model cites a source that does not exist or does not support the claim, you know something went wrong.


        **Rule 4: Use Clear Delimiters**
        Separate context blocks with `---` or triple backticks. Label each chunk with its source. This helps the LLM distinguish context from instructions and different documents from each other.


        **Rule 5: System vs. User Role**
        Put grounding instructions in the **system message** and context + question in the **user message**. The system message sets persistent behavior that the model follows more reliably than instructions mixed into the user message.


        **Rule 6: Control Output Format**
        "Answer in 2-3 sentences" or "Use bullet points" keeps responses focused. Long, rambling answers are harder to verify and more likely to contain unsupported claims buried in the text.





    ## Advanced Prompt Patterns


    ### Multi-Document Synthesis

    When chunks come from different sources, add this instruction: "If multiple sources provide different information on the same topic, present all perspectives and note which source supports each claim." This is critical for knowledge bases where documents may have been written at different times or by different authors.

    ### Structured Output



```
# For structured answers (e.g., comparison queries)
STRUCTURED_SYSTEM = """Answer based ONLY on the provided context.
Format your response as:
- **Summary**: 1-2 sentence answer
- **Details**: Key points as bullet points
- **Sources**: List which documents support each point
- **Gaps**: Note any aspects the context does not cover"""
```



    ### Conversational RAG

    For chatbots that maintain conversation history, include previous turns in the prompt but always put fresh context first:



```
def conversational_rag(question, chunks, history):
    """RAG with conversation memory."""
    context = format_chunks(chunks)

    messages = [{
        "role": "user",
        "content": f"Context (freshly retrieved):\n{context}"
    }, {
        "role": "assistant",
        "content": "I've reviewed the context. What would you like to know?"
    }]

    # Add conversation history
    messages.extend(history)

    # Add current question
    messages.append({"role": "user", "content": question})

    return claude.messages.create(
        model="claude-sonnet-4-20250514",
        system=SYSTEM_PROMPT,
        messages=messages
    ).content[0].text
```





    ## Common Mistakes


      **Mistake 1: No grounding instruction.** Without "Answer based ONLY on the context," the model freely mixes retrieved facts with training data. This is the #1 cause of RAG hallucination.


      **Mistake 2: Context and instructions mixed together.** When context and system instructions are in the same message, the model sometimes treats context as instructions or instructions as context. Separate them clearly.


      **Mistake 3: No fallback for unanswerable questions.** Without "say I don't know," the model will fabricate an answer rather than admit the context does not cover the question.


      **Mistake 4: High temperature.** Temperature above 0.3 for factual RAG increases creativity — which means more hallucination. Keep it at 0.0-0.2.



  Test Your Understanding


### Quiz

**Q1: What is the most important instruction to include in a RAG prompt to prevent hallucination?**
    A. Set the temperature to 0
  ✓ B. Include "Answer ONLY based on the provided context"
    C. Use GPT-4 instead of GPT-3.5
    D. Always include at least 10 retrieved chunks
  *Explicit grounding instructions tell the model to restrict itself to the retrieved context. Without this, the model may blend context with its training knowledge, which can introduce confident but incorrect information.*

**Q2: Why should you add "If the context doesn't contain the answer, say I don't have that information"?**
    A. To reduce API costs
  ✓ B. To prevent the model from hallucinating an answer to a question the retrieved context cannot support
    C. To make responses shorter
    D. To improve vector search recall
  *Without this instruction, the model may fill gaps in the context with plausible-sounding invented information. Explicitly handling the "I don't know" case forces the model to acknowledge the limits of its retrieved knowledge rather than fabricate.*

**Q3: Where should grounding instructions be placed in a chat API prompt?**
    A. In the user message alongside the question
  ✓ B. In the system message
    C. In the assistant message as a prefix
    D. Grounding instructions should not be used
  *The system message sets persistent behavior for the entire conversation. Placing grounding rules there means they apply to every response and cannot be accidentally overridden by user input phrasing.*

**Q4: Why is low temperature (0.0-0.2) recommended for RAG answers?**
    A. It makes the model respond faster
  ✓ B. It reduces hallucination by making the model more deterministic and less likely to improvise
    C. It saves API tokens
    D. It is required by all vector databases
  *Temperature controls randomness. Low temperature makes the model stick closely to the context, reducing creative improvisation. For factual RAG answers you want reliability over creativity.*



### Prompt Augmentation Vocabulary

**Card 1:**
Front: Grounding Instruction
Back: A directive in the system prompt like "Answer ONLY based on the provided context" that constrains the LLM to use retrieved facts, not training memory.

**Card 2:**
Front: Augmented Prompt
Back: A prompt that includes retrieved document chunks as context alongside the user question. The bridge between retrieval and generation.

**Card 3:**
Front: Context Delimiter
Back: Clear separators (--- or triple backticks) around context blocks so the LLM can distinguish retrieved content from instructions.

**Card 4:**
Front: Citation Prompt
Back: An instruction asking the model to reference specific sources: "Cite the source for each claim." Increases answer verifiability.

**Card 5:**
Front: Fallback Instruction
Back: "If the context doesn't contain the answer, say I don't know." Prevents hallucination on unanswerable questions.

**Card 6:**
Front: System vs User Role
Back: Grounding rules go in the system message (persistent behavior). Context + question go in the user message (per-turn input).
