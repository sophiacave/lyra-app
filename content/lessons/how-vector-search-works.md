---
title: How Vector Search Works
subtitle: RAG & Vector Search — Like One Academy
slug: how-vector-search-works
template: explainer
voice: sophia
---

## narration
Last lesson, embeddings turned your words into coordinates — points floating in mathematical space. Beautiful. But useless on their own. Vector search is what makes those coordinates powerful. It is how an AI brain remembers — not by scanning a filing cabinet, but by feeling which memories are closest to your question.
highlight: coordinates, vector search, AI brain, closest, question

## concept: Vector Search in 2D
- Your question (0.3, 0.3)
- Memory A (0.25, 0.4)
- Memory B (0.35, 0.25)
- Memory C (0.7, 0.7)
- Memory D (0.8, 0.3)
connect: 0-1, 0-2
duration: 6

## narration
Here is how it works. Your question becomes an embedding — a point in the same space as every stored memory. Then the system measures the distance between your point and all the others. The closest memories win. They are the ones that mean something similar to what you asked — even if they use completely different words.
highlight: embedding, same space, distance, closest, different words

## narration
How do you measure "close"? Two main ways. Cosine similarity looks at the angle between two vectors — are they pointing in the same direction? Euclidean distance measures the straight-line gap between them. For text, cosine similarity almost always wins. It cares about meaning direction, not how long the vector is. A whisper and a shout about the same topic score identically.
highlight: cosine similarity, angle, direction, Euclidean, meaning

## code: Cosine Similarity
```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# These sentences look different but mean similar things
q = model.encode("How do embeddings work?")
m = model.encode("What are vector representations?")

score = cosine_similarity(q, m)
print(f"Similarity: {score:.3f}")  # ~0.85 — high!
```
highlight-lines: 4, 10
duration: 10

## narration
Now the hard part. Checking every vector against your query works fine with a hundred memories. It falls apart at a million. Brute-force search is O(n) — linear time. That is unacceptable at scale. The solution is approximate nearest neighbor search, or ANN. Instead of checking everything, ANN builds a graph structure that lets you hop between neighbors to find the closest match without exhaustive comparison.
highlight: million, brute-force, O(n), approximate nearest neighbor, ANN, graph

## comparison
left: Exact Search (Brute Force)
right: Approximate Search (ANN)
left-items: Checks every single vector, Guarantees the absolute best match, O(n) — collapses at scale
right-items: Navigates a pre-built graph, Finds 95-99% accurate matches, Sub-millisecond even at millions of vectors
duration: 8

## narration
The Like One brain runs pgvector with an HNSW index — Hierarchical Navigable Small World. Think of it as a subway map for your memories. Instead of walking to every station, you take express routes that skip straight to the neighborhood you need. Thousands of memories searched in under 5 milliseconds. The system retrieves the top matches and feeds them to the AI as context. That is retrieval augmented generation — RAG. The AI does not hallucinate an answer from nothing. It reasons over your actual data.
highlight: pgvector, HNSW, subway map, 5 milliseconds, RAG, actual data

## quote
> The art of being wise is the art of knowing what to overlook.
— William James
duration: 5

## outro
heading: Like One Academy
subtext: Next: Building Your First RAG Pipeline
cta: likeone.ai/learn
duration: 4
