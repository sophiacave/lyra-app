# Embedding Explorer

**Course:** AI Foundations
**Order:** 8
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 8 of 9


  # Embedding Explorer.

  How to read word vectors, compute similarity, and build semantic search — with production Python code.


  ### After this lesson you'll know


    - How to read word vectors and their coordinates

    - What cosine similarity measures and why it matters

    - How vector analogy calculations work

    - Why embeddings power search, recommendations, and RAG




  The Big Picture
  ## Every word lives at a specific address in meaning-space.

  Imagine a massive warehouse where every word in the English language has its own shelf. Synonyms are on the same shelf. Related words are in the same aisle. Unrelated words are in different buildings. That warehouse is **embedding space** — and the shelf number is the word's **vector**.
  When you search "affordable dining" and the system returns "budget-friendly restaurants" — that's embeddings at work. The two phrases have zero words in common, but they live on the same shelf.


  Under the Hood
  ## How embeddings are created.

  Embeddings are not hand-crafted — they are **learned from data**. An embedding model reads billions of sentences and discovers that words appearing in similar contexts tend to mean similar things. "The cat sat on the mat" and "the dog sat on the mat" teach the model that "cat" and "dog" are interchangeable in some contexts — so their vectors end up nearby.



      **Step 1: Tokenize the text**
      The input text gets split into tokens — subword chunks like "un" + "believ" + "able." Each token is initially assigned a random vector. These random starting points will be refined through training.


      **Step 2: Learn from context**
      The model reads sentences and tries to predict which words appear near each other. If "bank" frequently appears near "money," "account," and "deposit," its vector moves toward that financial cluster. If it also appears near "river," "water," and "fishing," it develops a separate sense captured in different dimensions.


      **Step 3: Vectors stabilize**
      After training on billions of sentences, the vectors settle into stable positions. Words with similar meanings end up in similar regions. The resulting embedding model can convert any new text into a vector that captures its meaning — even text it has never seen before.



  Different embedding models produce different numbers of dimensions. More dimensions capture more nuance, but cost more compute:


```
  POPULAR EMBEDDING MODELS

  Model                     Dimensions    Use Case
  ──────────────────        ──────────    ────────────────────
  all-MiniLM-L6-v2         384           Fast, lightweight, free
  BGE-small-en              384           Fast RAG, free via HuggingFace
  text-embedding-3-small    1536          OpenAI API, good accuracy
  text-embedding-3-large    3072          OpenAI API, best accuracy
  voyage-3                  1024          Anthropic-recommended

  Rule of thumb: 384 dims = good for most use cases
  1024+ dims = when you need maximum precision
  All models: higher dims = more nuance, more compute
```



    **The key insight:** nobody programs the meaning into the vectors. The model discovers meaning by observing patterns in how humans use language. Words that appear in similar contexts converge to similar vectors. Meaning emerges from usage.



  Production Code
  ## Embeddings in real applications.

  Real applications use 768+ dimensions and store vectors in databases for instant lookup. Here are the two patterns that power modern AI applications:


Python — semantic search (find similar documents)

```
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Your "database" of documents
documents = [
    "How to train a neural network from scratch",
    "Best Italian restaurants in downtown",
    "Introduction to deep learning with PyTorch",
    "Budget-friendly places to eat near me",
    "Understanding backpropagation step by step",
]
doc_vectors = model.encode(documents)

# User searches for something
query = "affordable dining options"
query_vec = model.encode(query)

# Find most similar documents (by cosine similarity)
sims = np.dot(doc_vectors, query_vec) / (
    np.linalg.norm(doc_vectors, axis=1) * np.linalg.norm(query_vec)
)

# Top results — notice: ZERO keyword overlap with the query!
for idx in np.argsort(sims)[::-1][:2]:
    print(f"{sims[idx]:.3f} → {documents[idx]}")
# 0.72 → Budget-friendly places to eat near me
# 0.65 → Best Italian restaurants in downtown
```


"Affordable dining options" matches "budget-friendly places to eat" with zero keyword overlap. This is the power of semantic search — it understands *meaning*, not just words.


Python — RAG (Retrieval-Augmented Generation)

```
import anthropic

# Step 1: Find relevant docs (semantic search from above)
relevant_docs = [documents[i] for i in np.argsort(sims)[::-1][:3]]

# Step 2: Feed them to Claude as context
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system="Answer questions using ONLY the provided context. "
           "If the context doesn't contain the answer, say so.",
    messages=[{
        "role": "user",
        "content": f"Context:\n{chr(10).join(relevant_docs)}\n\n"
                   f"Question: {query}"
    }]
)
print(response.content[0].text)
```


This is RAG — the pattern behind every "chat with your data" product. Embeddings find the relevant context, then Claude generates an answer grounded in your actual data instead of hallucinating.


  Applications
  ## Five things embeddings power in the real world.

  Embeddings are not just academic — they are the invisible engine behind products you use every day:



      **1. Semantic Search — Google, Notion AI, any "smart search"**
      Traditional search matches keywords. Semantic search matches **meaning**. Searching "how to fix a slow computer" can match an article titled "Speed up your PC performance" — zero keyword overlap, high semantic similarity. The search engine converts your query to a vector and finds the nearest document vectors.


      **2. Recommendations — Spotify, Netflix, Amazon**
      If you like Song A, Spotify finds other songs whose embedding vectors are close to Song A in "music taste space." The same principle works for movies, products, and articles. Recommendations are just nearest-neighbor lookups in embedding space.


      **3. Duplicate Detection — support tickets, content moderation**
      If two support tickets have cosine similarity above 0.9, they are probably about the same issue. This lets companies automatically group related tickets, detect duplicate bug reports, or identify plagiarized content — all without writing manual rules.


      **4. RAG — "chat with your data" products**
      When you upload a PDF and ask questions about it, the system converts your question to a vector, finds the most relevant paragraphs by cosine similarity, and feeds those paragraphs to the AI. This is RAG — and it is why the AI can answer questions about documents it was not trained on.


      **5. Clustering — automatic organization**
      Group thousands of customer reviews by topic without reading them. Embed each review, cluster similar vectors together, and label each cluster by its most representative review. "Battery complaints" naturally separates from "shipping complaints" because they occupy different regions of embedding space.




  Key Concepts
  ## How similarity is measured.


[Interactive: FlashDeck]


### Quiz

**Q1: Which word pair would have the HIGHEST cosine similarity?**
    A. happy and banana
  ✓ B. car and automobile
    C. king and purple
    D. dog and skyscraper
  *Car and automobile are synonyms — they appear in nearly identical contexts so their vectors point in almost the same direction. Cosine similarity would be around 0.95.*

**Q2: In the analogy Paris : France :: Tokyo : ?, the answer is Japan because:**
    A. The model memorized geography
  ✓ B. The vector offset from Paris to France (capital-of) applied to Tokyo lands near Japan
    C. All cities are near all countries in embedding space
    D. Tokyo and France are spelled similarly
  *The direction from Paris to France represents capital-of. This same directional offset applied to Tokyo points toward Japan. The model learned these relationships from patterns in text.*



    **Embeddings turn language into geometry.** Cosine similarity measures the cosine of the angle between two vectors — 1.0 means identical direction, 0 means unrelated, -1.0 means opposite. Real embeddings use 768+ dimensions, but the math is identical to what you see here in 2D.



  Limitations
  ## What embeddings cannot do.

  Embeddings are powerful, but they have real limitations worth understanding:



      **Context blindness**
      The word "bank" means different things in "river bank" vs "bank account." Basic word embeddings give "bank" one vector regardless of context. Modern models like BERT fix this by generating **contextual embeddings** — different vectors for the same word depending on surrounding text. But this adds compute cost.


      **Bias reflection**
      Embeddings learn from human text, which contains human biases. If training data associates certain professions with certain genders, the embeddings will encode those biases. "Nurse" might end up closer to "woman" than "man" in the vector space — reflecting social patterns, not truth. This is an active area of research and mitigation.


      **Language boundaries**
      Most embedding models are trained primarily on English text. They work less well for other languages, especially low-resource languages with little training data. Multilingual models exist but trade off accuracy in any single language for breadth across many.




  [Next: Similarity Challenge →](/academy/ai-foundations/similarity-challenge)
