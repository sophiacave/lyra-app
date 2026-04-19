# What Are Embeddings?

**Course:** RAG & Vector Search
**Order:** 1
**Type:** lesson
**Access:** Free

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 1 of 10


  # What Are Embeddings?

  Every word, sentence, and document can become a list of numbers — a vector — that captures its meaning. Embeddings are the foundation of modern AI search. Without them, there is no RAG. This lesson teaches you what they are, how they work, and how to create them in code.



    ## The Core Idea

    Imagine you could place every word in the English language on a giant map. Words with similar meanings — like "happy" and "joyful" — would be close together. Words with unrelated meanings — like "happy" and "database" — would be far apart. That map exists. It is called an **embedding space**, and it is how modern AI understands meaning.

    An **embedding** is a list of numbers (a vector) that represents the meaning of a piece of text. The word "happy" might become `[0.23, -0.41, 0.87, ...]` — a list of 1,536 numbers that encode everything the model understands about that word: its sentiment, its formality, its relationship to other concepts. The word "joyful" produces a very similar list of numbers, because the meanings are close. The word "database" produces a completely different list.

    This is not keyword matching. Keyword matching asks: "Do these two strings contain the same characters?" Embeddings ask: "Do these two texts *mean* the same thing?" This distinction is the foundation of everything in RAG.


      **Definition:** An embedding is a fixed-length vector of floating-point numbers produced by a neural network, where the geometric position in the vector space encodes the semantic meaning of the input text. Texts with similar meanings produce vectors that are close together; texts with different meanings produce vectors that are far apart.




    ## Why Embeddings Matter for RAG

    Imagine you have a knowledge base of 10,000 documents and a user asks: "How do I handle customer complaints about late deliveries?" A keyword search for that exact phrase might return nothing — your documents say "managing client escalations regarding shipping delays." Same meaning, completely different words.

    With embeddings, both the question and every document are converted to vectors. The question vector and the document vector end up close together in the embedding space — because they *mean* the same thing. The vector database finds the match in milliseconds, even across millions of documents.

    This is the **Retrieval** in Retrieval-Augmented Generation. Without embeddings, there is no intelligent retrieval. Without intelligent retrieval, the LLM has no relevant context. Without context, it hallucinates. Embeddings are the first domino.



    ## How Embedding Models Work

    Embedding models are neural networks trained on billions of text examples. During training, they learn a simple rule: **texts that appear in similar contexts should produce similar vectors**. This is called **contrastive learning** — the model is shown pairs of texts and learns to pull similar pairs together and push dissimilar pairs apart in the vector space.

    The result is a model that has internalized the relationships between words, phrases, and concepts. It knows that "king" and "queen" are related. It knows that "Python" in a programming context is different from "python" in a biology context. It captures nuance that keyword matching cannot.



        **Popular Embedding Models**
        **OpenAI text-embedding-3-small** — 1,536 dimensions, $0.02/1M tokens. Best balance of quality, speed, and cost for most use cases.
        **OpenAI text-embedding-3-large** — 3,072 dimensions, $0.13/1M tokens. Higher quality, 6x the cost.


        **Free / Open-Source Models**
        **BGE-small-en** — 384 dimensions. Free, runs locally. Used by Like One's brain system.
        **E5-large-v2** — 1,024 dimensions. Free via HuggingFace. Strong multilingual support.





    ## Dimensions and What They Mean

    When we say a model produces 1,536-dimensional embeddings, that means each text becomes a list of 1,536 numbers. Each number represents one *aspect* of meaning — though no single dimension maps neatly to a human concept like "sentiment" or "formality." The model learns its own abstract features during training.

    More dimensions means more nuance. A 384-dimensional embedding captures the broad strokes — topic, sentiment, domain. A 3,072-dimensional embedding captures finer distinctions — tone, register, subtle relationships between concepts. The tradeoff is storage and compute cost: more dimensions means larger vectors, more memory, and slightly slower searches.

    For most RAG applications, 1,536 dimensions is the sweet spot. You get excellent semantic understanding without excessive storage costs. Start there and only upgrade if your evaluation metrics (covered in Lesson 8) show a meaningful quality gap.



    ## Cosine Similarity — Measuring Meaning

    Once you have two vectors, you need a way to measure how similar they are. The standard metric is **cosine similarity**, which measures the angle between two vectors. If they point in the same direction, the cosine is 1.0 (identical meaning). If they are perpendicular, it is 0 (unrelated). If they point in opposite directions, it is -1.

    Why cosine instead of regular distance? Because cosine similarity is **magnitude-independent**. A long vector and a short vector pointing in the same direction are considered equally similar. This matters because embedding models sometimes produce vectors of different lengths for different inputs — we care about the *direction* (meaning), not the *length*.



```
import numpy as np

def cosine_similarity(vec_a, vec_b):
    """Measure how similar two embedding vectors are."""
    dot_product = np.dot(vec_a, vec_b)
    magnitude_a = np.linalg.norm(vec_a)
    magnitude_b = np.linalg.norm(vec_b)
    return dot_product / (magnitude_a * magnitude_b)

# Example: compare three sentences
happy_vec  = embed("I am so happy today")
joyful_vec = embed("I feel joyful and alive")
db_vec     = embed("PostgreSQL database indexing")

print(cosine_similarity(happy_vec, joyful_vec))  # ~0.92 — very similar
print(cosine_similarity(happy_vec, db_vec))      # ~0.12 — completely unrelated
```


    The cosine similarity score tells you at a glance whether two texts are semantically related. In RAG, you typically retrieve chunks with a similarity score above 0.7-0.85.



    ## Creating Embeddings in Code

    Here is how you generate embeddings using the OpenAI API — the most common approach in production RAG systems:



```
from openai import OpenAI

client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
    """Convert text to a 1536-dimensional vector."""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# Embed a single sentence
vector = get_embedding("How do I handle customer complaints?")
print(f"Dimensions: {len(vector)}")  # 1536
print(f"First 5 values: {vector[:5]}")  # [0.023, -0.041, ...]

# Embed a batch of documents (more efficient)
documents = [
    "Our refund policy allows returns within 30 days.",
    "Shipping delays should be escalated to logistics.",
    "Customer satisfaction surveys are sent quarterly.",
]
response = client.embeddings.create(input=documents, model="text-embedding-3-small")
vectors = [item.embedding for item in response.data]
print(f"Embedded {len(vectors)} documents")  # 3
```


    Batch embedding is significantly cheaper and faster than embedding one document at a time. Always batch when processing large document collections.



    ## The Semantic Space

    Embedding models learn surprising relationships from their training data. The most famous example is the **word analogy**: the vector for "king" minus "man" plus "woman" produces a vector close to "queen." The model learned gender relationships from context alone — nobody told it that kings and queens are related.

    This emergent structure is what makes embeddings so powerful for search. You do not need to anticipate every way a user might phrase a question. If the meaning is similar, the vectors will be close. A query about "fixing broken CI/CD pipelines" will match documents about "debugging deployment failures" — because the embedding model understands they describe the same problem.


      **Limitations to know:** Embeddings are not perfect. They can struggle with negation ("happy" vs. "not happy" may be closer than expected), rare domain-specific jargon, and very short queries (a single word has less context for the model to work with). These limitations are why Lesson 7 covers hybrid search — combining embeddings with keyword matching for the best of both worlds.




    ## Choosing the Right Model

    The embedding model you choose determines the quality of your entire RAG system. Here are the key factors:



        **Quality vs. Cost**
        text-embedding-3-small costs $0.02 per million tokens. text-embedding-3-large costs $0.13 per million tokens — 6x more for a marginal quality improvement. Start small, measure, upgrade only if needed.


        **Consistency Rule**
        Your query and your documents MUST use the same embedding model. You cannot embed documents with OpenAI and queries with BGE — the vector spaces are different, and similarity scores will be meaningless.


        **Local vs. API**
        API models (OpenAI, Cohere) are the easiest to start with but cost money per call. Local models (BGE, E5 via HuggingFace) are free but require GPU resources. For production RAG, most teams use API models for quality and reliability.





    ## Embedding Gotchas and Best Practices

    Embeddings look simple — call an API, get a vector, store it. But production systems break in subtle ways when you skip the fundamentals. Every one of the gotchas below has caused real outages, corrupted search results, or silently degraded RAG quality in production systems. These five practices separate toy demos from reliable RAG pipelines.

    Think of these as the "hygiene layer" of your embedding pipeline. Getting the vectors right is necessary but not sufficient — you also need to manage how they are created, stored, compared, and maintained over time. Skip any one of these, and your system will work in development but fail in production.



        **Batch Embedding, Not One-at-a-Time**
        When you have a collection of documents, **always embed them in batches**. Sending one API call per document means thousands of round trips, each with network latency and rate-limit overhead. A single batch call with 100 texts is faster, cheaper, and uses the same number of tokens. Most APIs accept arrays of inputs — use them. The OpenAI API, for example, accepts up to 2,048 inputs per batch call. Structure your ingestion pipeline around batch sizes of 100-500 texts for the best throughput.


        **Token Limits: Truncation and Chunking**
        Every embedding model has a maximum input length — typically around 8,192 tokens (roughly 6,000 words). Text beyond that limit is silently truncated by some APIs or rejected outright by others. If your documents are longer than the limit, you must **chunk them first** — split them into passages of 256-512 tokens with overlap. Never assume the model will handle arbitrarily long input. Check your model's documentation for the exact limit, and build your chunking step *before* your embedding step in the pipeline.


        **Caching: Never Re-Embed the Same Text**
        Embedding the same document twice wastes money and compute. Once you generate a vector, **store it in your database alongside the source text**. On subsequent runs, check whether the text has changed before re-embedding. A content hash (SHA-256 of the text) makes this trivial — if the hash matches, skip the embedding call. This is especially important during development, when you might re-run your ingestion pipeline dozens of times. A proper caching layer can cut your embedding costs by 90% or more.


        **Normalization: Know Your Vectors**
        Some embedding models return **normalized vectors** (unit length, magnitude = 1), and some do not. This matters because cosine similarity and dot product give *identical results* on normalized vectors — but different results on unnormalized ones. If your vector database uses inner product (dot product) for speed, but your model returns unnormalized vectors, your similarity scores will be wrong. Always check: OpenAI's models return normalized vectors. Many HuggingFace models do not. When in doubt, normalize explicitly: divide each vector by its L2 norm before storing.


        **Version Pinning: Model Updates Break Everything**
        When an embedding model provider releases a new version, the vector space changes. Vectors from the old model and vectors from the new model are **incompatible** — even for the same text, the numbers will be different. This means a "minor update" can silently destroy your search quality. The fix: **pin your model version explicitly** (e.g., `text-embedding-3-small`, not just "latest"). When you do upgrade, re-embed your entire corpus in one operation. Track which model version produced each vector in your database schema — a simple `model_version` column prevents weeks of debugging inconsistent results.





```
import numpy as np
import hashlib

def normalize_vector(vec):
    """Normalize a vector to unit length for consistent similarity."""
    norm = np.linalg.norm(vec)
    return vec / norm if norm > 0 else vec

def should_reembed(text, stored_hash):
    """Check if text has changed since last embedding."""
    current_hash = hashlib.sha256(text.encode()).hexdigest()
    return current_hash != stored_hash

# Production pattern: hash → check cache → embed if needed → normalize → store
text = "How do I handle customer complaints?"
text_hash = hashlib.sha256(text.encode()).hexdigest()

if should_reembed(text, cached_hash):
    vector = get_embedding(text)            # API call
    vector = normalize_vector(np.array(vector))  # safe for dot product
    store_in_db(text, vector, text_hash, model_version="text-embedding-3-small")
```


    This pattern — hash, check, embed, normalize, store with version — handles all five gotchas in a single pipeline. Build it once and every document flows through the same reliable path.


  Test Your Understanding


### Quiz

**Q1: What does an embedding model output for a piece of text?**
    A. A summary paragraph
  ✓ B. A fixed-length list of numbers (vector)
    C. A set of keywords
    D. A JSON object with labels
  *Embedding models output a dense vector — a fixed-length list of floating-point numbers — where the position in that high-dimensional space captures the text's meaning.*

**Q2: Why are the words "happy" and "joyful" close together in embedding space?**
    A. They share the same letters
    B. They have the same number of characters
  ✓ C. They have similar meanings, so the model places them nearby
    D. They were always grouped together alphabetically
  *Embedding models are trained on vast text corpora and learn that words used in similar contexts carry similar meanings. Semantically related words end up geometrically close in vector space.*

**Q3: Why is cosine similarity preferred over Euclidean distance for comparing embeddings?**
    A. Cosine similarity is faster to compute
  ✓ B. Cosine similarity measures direction (meaning), not magnitude (length)
    C. Euclidean distance only works in 2D
    D. Cosine similarity always returns values between 0 and 1
  *Cosine similarity measures the angle between vectors, making it magnitude-independent. Two vectors pointing in the same direction are similar regardless of their length — which is what we want when comparing semantic meaning.*

**Q4: You embed documents with OpenAI text-embedding-3-small and queries with BGE-small. Will similarity search work?**
    A. Yes, embeddings are universal
  ✓ B. No — the models produce vectors in different spaces, making similarity scores meaningless
    C. Yes, as long as the dimensions match
    D. It depends on the vector database
  *Different embedding models learn different vector spaces. A vector from OpenAI and a vector from BGE represent meaning in incompatible coordinate systems. You MUST use the same model for both documents and queries.*



### Embedding Vocabulary

**Card 1:**
Front: Embedding
Back: A fixed-length vector of floating-point numbers representing the semantic meaning of a text. Similar meanings → close vectors. Different meanings → distant vectors.

**Card 2:**
Front: Vector
Back: A list of numbers representing a point in multi-dimensional space. In RAG, each text chunk becomes a vector via an embedding model.

**Card 3:**
Front: Cosine Similarity
Back: Measures similarity between two vectors by the angle between them. Range: -1 (opposite) to 1 (identical). Magnitude-independent — focuses on direction, not length.

**Card 4:**
Front: Embedding Dimensions
Back: The number of values in each vector. More dimensions = more nuance but more storage/compute. Common: 384 (BGE-small), 1536 (OpenAI small), 3072 (OpenAI large).

**Card 5:**
Front: Contrastive Learning
Back: The training technique for embedding models. Similar texts are pulled together, dissimilar texts pushed apart — creating a geometric map of meaning.

**Card 6:**
Front: Semantic Space
Back: The high-dimensional coordinate system where all embeddings live. The geometry encodes meaning: nearby = related, distant = unrelated.
