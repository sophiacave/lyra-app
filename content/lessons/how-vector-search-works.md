---
title: How Vector Search Works
subtitle: RAG & Vector Search — Like One Academy
slug: how-vector-search-works
template: explainer
voice: sophia
---

## narration
In the last lesson, we learned that embeddings turn text into numbers. But what do we actually do with those numbers? We search through them. This is vector search — and it is the beating heart of every AI brain.
highlight: vector search, numbers, beating heart, AI brain

## concept: Vector Search in 2D
- Your question (0.3, 0.3)
- Memory A (0.25, 0.4)
- Memory B (0.35, 0.25)
- Memory C (0.7, 0.7)
- Memory D (0.8, 0.3)
connect: 0-1, 0-2
duration: 6

## narration
When you ask your brain a question, that question becomes an embedding — a point in space. Then we measure the distance between your question and every stored memory. The closest memories are the most relevant answers.
highlight: question, embedding, distance, closest, relevant

## narration
There are different ways to measure closeness. Cosine similarity looks at the angle between two vectors. Euclidean distance measures the straight line between them. For most text applications, cosine similarity wins — because it cares about direction, not magnitude.
highlight: cosine similarity, angle, direction, magnitude

## code: Cosine Similarity
```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Two similar sentences
q = model.encode("How do embeddings work?")
m = model.encode("What are vector representations?")

score = cosine_similarity(q, m)
print(f"Similarity: {score:.3f}")  # ~0.85
```
highlight-lines: 4, 10
duration: 10

## narration
But here is the problem. If you have a million memories, checking every single one is slow. This is where approximate nearest neighbor search comes in. Tools like pgvector use special index structures to find the closest vectors without checking them all.
highlight: million, slow, approximate nearest neighbor, pgvector, index

## comparison
left: Exact Search
right: Approximate Search (ANN)
left-items: Checks every vector, Always finds the best match, Slow at scale
right-items: Uses smart indexing, Finds nearly-best matches, Fast even with millions
duration: 8

## narration
Your Like One brain uses pgvector with an HNSW index. It can search through thousands of memories in milliseconds. When you ask a question, the brain finds the five most relevant memories and hands them to the AI. This is called retrieval augmented generation — RAG.
highlight: pgvector, HNSW, milliseconds, five most relevant, RAG

## quote
> The art of being wise is the art of knowing what to overlook.
— William James
duration: 5

## outro
heading: Like One Academy
subtext: Next: Building Your First RAG Pipeline
cta: likeone.ai/learn
duration: 4
