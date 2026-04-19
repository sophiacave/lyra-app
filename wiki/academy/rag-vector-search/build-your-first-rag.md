# Build Your First RAG

**Course:** RAG & Vector Search
**Order:** 5
**Type:** builder
**Access:** Premium

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 5 of 10


  # Build Your First RAG

  Theory is over. In this lesson, you build a complete RAG system from scratch — loading documents, chunking them, embedding them, storing them in a vector database, and querying them with an LLM. Every line of code is explained. By the end, you will have a working system you can adapt to any knowledge base.



    ## What You Are Building

    A knowledge-base chatbot that can answer questions about any collection of documents. You will load text files, split them into searchable chunks, embed them with OpenAI, store them in either Chroma (for quick prototyping) or Supabase pgvector (for production), and query them with Claude. The same architecture powers customer support bots, internal knowledge systems, and documentation search at companies of every size.


      **Prerequisites:** Python 3.9+, an OpenAI API key (for embeddings), and an Anthropic API key (for generation). Install dependencies: `pip install openai anthropic chromadb`




    ## Step 1: Load Your Documents

    Your RAG system can only answer questions about information it has seen. The first step is loading the documents that will become your knowledge base.



```
import os
from pathlib import Path

def load_documents(directory):
    """Load all text files from a directory."""
    docs = []
    for filepath in Path(directory).glob("*.txt"):
        text = filepath.read_text(encoding="utf-8")
        docs.append({
            "content": text,
            "source": filepath.name,
            "char_count": len(text)
        })
    print(f"Loaded {len(docs)} documents")
    return docs

# Load your knowledge base
documents = load_documents("./knowledge-base")
```


    In production, you would also support PDFs (PyPDF2), web pages (BeautifulSoup), Markdown, and databases. The pattern is the same: extract text + attach metadata.



    ## Step 2: Chunk the Documents

    Documents are too long to embed as single vectors. We split them into focused chunks with overlap to prevent boundary information loss.



```
import re

def chunk_document(doc, max_words=200, overlap_sentences=1):
    """Split a document into sentence-based chunks with overlap."""
    sentences = re.split(r'(?, doc["content"])
    chunks = []
    current = []
    word_count = 0

    for sentence in sentences:
        s_words = len(sentence.split())
        if word_count + s_words > max_words and current:
            chunks.append({
                "content": " ".join(current),
                "source": doc["source"],
                "chunk_index": len(chunks)
            })
            current = current[-overlap_sentences:]
            word_count = sum(len(s.split()) for s in current)
        current.append(sentence)
        word_count += s_words

    if current:
        chunks.append({
            "content": " ".join(current),
            "source": doc["source"],
            "chunk_index": len(chunks)
        })
    return chunks

# Chunk all documents
all_chunks = []
for doc in documents:
    all_chunks.extend(chunk_document(doc))
print(f"Created {len(all_chunks)} chunks from {len(documents)} documents")
```





    ## Step 3: Embed All Chunks

    Convert every chunk into a vector using the OpenAI embedding API. Batch processing is significantly cheaper and faster than embedding one at a time.



```
from openai import OpenAI

client = OpenAI()

def embed_chunks(chunks, batch_size=100):
    """Embed all chunks in batches for efficiency."""
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        texts = [c["content"] for c in batch]

        response = client.embeddings.create(
            input=texts,
            model="text-embedding-3-small"
        )

        for j, item in enumerate(response.data):
            chunks[i + j]["embedding"] = item.embedding

        print(f"Embedded batch {i // batch_size + 1}/{(len(chunks) - 1) // batch_size + 1}")

    return chunks

all_chunks = embed_chunks(all_chunks)
print(f"All {len(all_chunks)} chunks embedded (1536 dimensions each)")
```


    Cost estimate: embedding 10,000 chunks of 200 words each costs about $0.06 with text-embedding-3-small. Embedding is the cheapest part of a RAG system.



    ## Step 4: Store in a Vector Database

    Here are two options — Chroma for prototyping, Supabase for production:

    ### Option A: Chroma (Prototype)



```
import chromadb

chroma = chromadb.PersistentClient(path="./chroma-db")
collection = chroma.get_or_create_collection("knowledge-base")

# Store all chunks
collection.add(
    ids=[f"chunk-{i}" for i in range(len(all_chunks))],
    embeddings=[c["embedding"] for c in all_chunks],
    documents=[c["content"] for c in all_chunks],
    metadatas=[{"source": c["source"]} for c in all_chunks]
)
print(f"Stored {collection.count()} chunks in Chroma")
```



    ### Option B: Supabase pgvector (Production)



```
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Store all chunks (table created in Lesson 2)
for chunk in all_chunks:
    supabase.table("documents").insert({
        "content": chunk["content"],
        "embedding": chunk["embedding"],
        "metadata": {
            "source": chunk["source"],
            "chunk_index": chunk["chunk_index"]
        }
    }).execute()

print(f"Stored {len(all_chunks)} chunks in Supabase")
```





    ## Step 5: Query Your RAG System

    Now bring it all together — embed the user's question, search for relevant chunks, and generate a grounded answer:



```
import anthropic

claude = anthropic.Anthropic()

def ask(question, top_k=5):
    """Ask a question against your knowledge base."""

    # Embed the question
    q_vec = client.embeddings.create(
        input=question, model="text-embedding-3-small"
    ).data[0].embedding

    # Search (Chroma version)
    results = collection.query(
        query_embeddings=[q_vec],
        n_results=top_k
    )

    # Build context from retrieved chunks
    context_parts = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        context_parts.append(f"[Source: {meta['source']}]\n{doc}")
    context = "\n\n---\n\n".join(context_parts)

    # Generate grounded answer
    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=("You are a helpful assistant. Answer based ONLY on the "
                "provided context. If the context doesn't contain the "
                "answer, say 'I don't have that information.' "
                "Cite the source document for each claim."),
        messages=[{
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {question}"
        }]
    )
    return response.content[0].text

# Try it!
answer = ask("What is the refund policy?")
print(answer)
```





    ## Step 6: Evaluate and Tune

    Your first version will not be perfect. Here are the key parameters to tune based on the quality of answers you see:



        **chunk_size**
        Start at 200 words. If answers lack context, increase to 300-400. If answers include irrelevant content, decrease to 100-150.


        **top_k**
        Start at 5. If the right answer is not being found, increase to 8-10. If the LLM seems confused by too much context, decrease to 3.


        **similarity_threshold**
        Start at 0.75. If irrelevant chunks are being retrieved, raise to 0.8-0.85. If too few results are returned, lower to 0.65-0.70.


        **temperature**
        For factual RAG, use 0.0-0.2. Higher values make the model more creative — which is the opposite of what you want for grounded answers.




      **Pro Tip:** Keep a test set of 10-20 question-answer pairs that you know the correct answers to. After every parameter change, run your test set and check whether accuracy improved. Lesson 8 covers automated evaluation frameworks that do this at scale.




    ## What You Built

    Congratulations — you now have a working RAG system. Let's summarize the architecture:


      **Document Pipeline:** Load files → Chunk (sentence-based, 200 words, 1-sentence overlap) → Embed (OpenAI text-embedding-3-small, 1536 dimensions) → Store (Chroma or Supabase pgvector)


      **Query Pipeline:** User question → Embed query → Vector search (top-5, threshold 0.75) → Augment prompt with context → Claude generates grounded answer


      **Total Code:** ~100 lines of Python. The same architecture powers production systems at scale — you just add more documents, better chunking, and evaluation.



  Test Your Understanding

### Quiz

**Q1: Why is batch embedding more efficient than embedding one document at a time?**
    A. Batch embedding uses a different model
  ✓ B. One API call with 100 texts is faster and cheaper than 100 API calls with 1 text each
    C. Batch embedding produces higher quality vectors
    D. Batch embedding requires less disk space
  *API calls have overhead — network latency, authentication, rate limiting. Sending 100 texts in one call eliminates 99% of that overhead. Most embedding APIs are priced per token, so the cost is identical, but the speed improvement is dramatic.*

**Q2: What is the purpose of the metadata stored alongside each vector?**
    A. To improve embedding quality
  ✓ B. To enable filtering and to provide source attribution when returning results
    C. To make the vector database faster
    D. To reduce storage costs
  *Metadata serves two purposes: (1) filtering — narrowing search results by source, date, category, etc. (2) attribution — when a chunk is retrieved, the metadata tells you where it came from, enabling citations in the generated answer.*

**Q3: Your RAG system returns irrelevant chunks for specific queries. Which parameter should you adjust first?**
    A. Increase chunk_size to capture more context
  ✓ B. Raise the similarity_threshold to filter out low-relevance results
    C. Lower top_k to return fewer results
    D. Change the LLM model
  *If irrelevant chunks are being retrieved, the similarity threshold is too low — chunks with weak similarity are making it through. Raising the threshold from 0.75 to 0.80-0.85 filters out these low-relevance results. This is the first parameter to tune when retrieval quality is poor.*



### RAG Build — Key Parameters

**Card 1:**
Front: chunk_size
Back: Number of words per chunk. Start at 200. Increase for more context, decrease for more precision. Tune based on answer quality.

**Card 2:**
Front: chunk_overlap
Back: Words repeated between adjacent chunks. Prevents boundary loss. Typical: 10-20% of chunk_size, or 1 overlapping sentence.

**Card 3:**
Front: top_k
Back: How many chunks to retrieve per query. More = more context for the LLM but higher token cost and potential noise. Start at 5.

**Card 4:**
Front: similarity_threshold
Back: Minimum cosine similarity for a chunk to be included. Filters irrelevant results. Start at 0.75, raise if seeing noise.

**Card 5:**
Front: temperature
Back: Controls LLM randomness. Set to 0.0-0.2 for factual RAG answers to minimize hallucination and maximize reliability.

**Card 6:**
Front: batch_size
Back: Number of texts to embed in one API call. Reduces network overhead. Typical: 100. OpenAI supports up to 2048 per call.
