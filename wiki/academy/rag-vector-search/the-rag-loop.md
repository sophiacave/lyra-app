# The RAG Loop

**Course:** RAG & Vector Search
**Order:** 4
**Type:** lesson
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 4 of 10


  # The RAG Loop

  Follow a query through the complete RAG pipeline — from user question to AI-generated answer grounded in your data. This is the heartbeat of every RAG system: embed, search, retrieve, augment, generate. Understanding each step is essential to building systems that give accurate answers instead of confident hallucinations.



    ## RAG in One Sentence

    Instead of hoping the LLM memorized the answer during training, we **find** the relevant documents and **hand them to the LLM** along with the question. The model answers using actual data, not guesswork. This is Retrieval-Augmented Generation — and it is the difference between an AI that says "I think the refund policy is 30 days" (hallucination) and one that says "According to your documentation, the refund window is 14 days from purchase" (grounded answer).



    ## The Six Steps

    Every RAG system — from a prototype to an enterprise deployment — follows these six steps in the same order:



        **Step 1: User Query**
        A natural language question enters the system. "What is the refund policy for international orders?" This is the starting point of every RAG loop. The quality of the query directly affects retrieval quality — vague queries get vague results.


        **Step 2: Embed Query**
        The question is converted to a vector using the **same embedding model** that processed the documents. This is critical — the query vector and document vectors must live in the same semantic space for similarity scores to be meaningful. Different models = different spaces = meaningless comparisons.


        **Step 3: Vector Search**
        The query vector is compared against all stored document vectors using cosine similarity. The HNSW index makes this fast — milliseconds even across millions of chunks. The database returns candidates ranked by how close they are to the query in semantic space.


        **Step 4: Retrieve Chunks**
        The top-K most similar chunks are fetched — typically 3 to 5. Each chunk comes with its text content, similarity score, and metadata (source document, section, date). The similarity threshold (usually 0.7-0.85) filters out low-relevance noise.


        **Step 5: Augment Prompt**
        The retrieved chunks are inserted into a prompt template alongside the original question. The template tells the LLM: "Here is context from our documentation. Answer based ONLY on this context." This is the "A" in RAG — and it is what prevents hallucination.


        **Step 6: LLM Response**
        The model generates an answer grounded in the retrieved context, not in potentially outdated training data. With temperature set low (0.0-0.2), the model sticks closely to the context, producing reliable, verifiable answers.





    ## The Complete Pipeline in Code

    Here is a full RAG loop implementation using OpenAI embeddings, Supabase pgvector, and Claude for generation:



```
from openai import OpenAI
from supabase import create_client
import anthropic

openai_client = OpenAI()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
claude = anthropic.Anthropic()

def rag_query(question, top_k=5, threshold=0.75):
    """Complete RAG pipeline: embed → search → retrieve → augment → generate."""

    # Step 1: User question is already our input

    # Step 2: Embed the query
    query_embedding = openai_client.embeddings.create(
        input=question,
        model="text-embedding-3-small"
    ).data[0].embedding

    # Steps 3-4: Vector search + retrieve chunks
    result = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_threshold": threshold,
        "match_count": top_k
    }).execute()

    chunks = result.data
    if not chunks:
        return "I don't have enough information to answer that question."

    # Step 5: Augment prompt with retrieved context
    context = "\n\n---\n\n".join([
        f"[Source: {c['metadata'].get('source', 'unknown')}]\n{c['content']}"
        for c in chunks
    ])

    # Step 6: Generate grounded answer
    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="Answer based ONLY on the provided context. If the context "
               "doesn't contain the answer, say 'I don't have that information.' "
               "Cite the source for each claim.",
        messages=[{
            "role": "user",
            "content": f"""Context:
{context}

Question: {question}"""
        }]
    )
    return response.content[0].text

# Use it
answer = rag_query("What is the refund policy for international orders?")
print(answer)
```


    This 40-line function is a complete, production-ready RAG pipeline. Every enterprise RAG system — no matter how complex — is built on this same pattern.



    ## The Supabase Match Function

    The `match_documents` function called above is a PostgreSQL function that performs the vector search. Here is how to create it:



```
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY SELECT
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding  query_embedding) AS similarity
  FROM documents d
  WHERE 1 - (d.embedding  query_embedding) > match_threshold
  ORDER BY d.embedding  query_embedding
  LIMIT match_count;
END;
$$;
```


    This function takes a query vector, finds all document chunks above the similarity threshold, and returns them ranked by relevance. It is the core of every Supabase RAG system.



    ## Why Each Step Matters

    Every step in the RAG loop is a potential failure point. Understanding what can go wrong at each stage helps you debug and improve your system:



        **Bad Embeddings**
        If you use different models for documents vs. queries, similarity scores are meaningless. If you use a weak model, subtle meaning differences are lost.


        **Bad Chunks**
        Chunks too large? Irrelevant content dilutes results. Too small? Missing context makes retrieved chunks useless. Wrong overlap? Boundary information is lost.


        **Wrong Top-K**
        Too few chunks? The answer might be in chunk #6 that you did not retrieve. Too many chunks? You fill the LLM's context window with noise, causing confusion.


        **Weak Prompt**
        Without explicit grounding instructions ("Answer based ONLY on the context"), the LLM blends retrieved context with training knowledge — introducing potential hallucinations even with good retrieval.





    ## Hallucination — The Enemy RAG Fights

    Without RAG, an LLM answering "What is your refund policy?" might confidently state "We offer a 30-day money-back guarantee" — a plausible answer that is completely fabricated. The model has no access to your actual policies; it generates statistically likely text based on its training data.

    RAG changes the equation: the model receives your actual refund policy document as context, and is instructed to answer only from that context. The result: "According to your documentation, the refund window is 14 days from purchase. Contact billing@acme.io with your order number." Every claim is traceable to a source document.

    This does not eliminate hallucination entirely — the LLM can still misinterpret context or connect dots that are not there. But it reduces hallucination from "the norm" to "the exception." Lesson 8 covers how to measure this with evaluation metrics.



    ## RAG Pipeline Debugging

    When your RAG system gives bad answers, the bug can hide at any step. Work through these checkpoints in order — most issues are retrieval problems, not generation problems:



        **1. Check Embedding Quality**
        Embed a known query and its expected answer. Compute cosine similarity — it should be above 0.8. If not, your embedding model may be too weak for your domain, or your chunks are poorly formatted. Try a larger model or clean up chunk preprocessing.


        **2. Verify Retrieval Returns Relevant Chunks**
        Log the retrieved chunks for failing queries. Read them yourself — are they actually relevant? If the right chunks exist in your database but are not retrieved, adjust your similarity threshold or increase top-K. If the right content was never chunked properly, fix your ingestion pipeline.


        **3. Test the Augmented Prompt**
        Copy the exact prompt your system sends to the LLM (context + question) and paste it into a playground. Does the model answer correctly with this prompt? If yes, your retrieval is the bottleneck. If no, your prompt template needs work — the grounding instructions may be too weak or the context format confusing.


        **4. Validate Generation Output**
        Check if the model is faithfully using the context or hallucinating beyond it. Ask it to cite sources for each claim. If it cites a chunk that does not support the claim, lower the temperature or add stricter grounding instructions like "If the context does not contain the answer, say so."




  Test Your Understanding

### Quiz

**Q1: Why must the query be embedded with the SAME model used to embed the documents?**
    A. It is faster to reuse the same model
  ✓ B. Both query and documents must live in the same semantic space for similarity scores to be meaningful
    C. The documents cannot be accessed otherwise
    D. Using different models would cause a server error
  *Cosine similarity only makes sense when comparing vectors from the same embedding space. If the query is embedded with model A and documents with model B, the vectors exist in different spaces — the similarity scores would be meaningless.*

**Q2: What is "hallucination" in the context of LLMs, and how does RAG reduce it?**
    A. When the model runs too slowly
  ✓ B. When the model confidently generates plausible but incorrect information — RAG reduces this by grounding answers in retrieved facts
    C. When the embedding model produces duplicate vectors
    D. When the vector database returns too many results
  *Hallucination is when an LLM invents plausible-sounding but false information. RAG reduces hallucination by providing the model with actual source documents and instructing it to answer ONLY based on that context.*

**Q3: In the Augment Prompt step, what instruction prevents the LLM from using its own training knowledge instead of the context?**
    A. temperature=0
    B. max_tokens=100
  ✓ C. Answer based ONLY on the provided context. If unsure, say I don't know.
    D. model=gpt-4-turbo
  *Explicit grounding instructions like "Answer based ONLY on the provided context" constrain the model to use retrieved information. Without this instruction, the model may blend context with potentially incorrect training knowledge.*

**Q4: What does the similarity threshold parameter control?**
    A. How many documents to return
  ✓ B. The minimum relevance score required for a chunk to be included in results
    C. The speed of the vector search
    D. The size of each chunk
  *The similarity threshold (typically 0.7-0.85) filters out chunks with low relevance scores. Without it, every query returns top-K results even when none of them are actually relevant — leading to answers grounded in irrelevant context.*



### RAG Pipeline Terms

**Card 1:**
Front: RAG
Back: Retrieval-Augmented Generation — fetch relevant documents at query time and provide them as context to an LLM, grounding answers in actual data instead of training memory.

**Card 2:**
Front: Augmented Prompt
Back: A prompt that includes retrieved document chunks as context alongside the user question. The "A" in RAG — the bridge between retrieval and generation.

**Card 3:**
Front: Top-K Retrieval
Back: Returning only the K most similar chunks from vector search. K is typically 3-5 depending on context window size and precision needs.

**Card 4:**
Front: Grounded Answer
Back: An LLM response where every claim is supported by retrieved context, not invented from training data. The goal of every RAG system.

**Card 5:**
Front: Similarity Threshold
Back: Minimum cosine similarity score (typically 0.7-0.85) for a chunk to be included in results. Filters out irrelevant noise.

**Card 6:**
Front: Hallucination
Back: When an LLM confidently generates plausible but factually incorrect information. RAG reduces this by anchoring answers to retrieved documents.
