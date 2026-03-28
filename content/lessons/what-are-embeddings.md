---
title: What Are Embeddings?
subtitle: RAG & Vector Search — Like One Academy
slug: what-are-embeddings
template: explainer
voice: sophia
---

## narration
An embedding is a list of numbers that represents the meaning of text. Think of it as giving every word a unique address in mathematical space. Two words that mean similar things get addresses that are close together.
highlight: embedding, numbers, meaning, address

## concept: Embedding Space
- happy (0.2, 0.3)
- joyful (0.25, 0.5)
- delighted (0.15, 0.45)
- sad (0.7, 0.3)
- melancholy (0.75, 0.5)
- neutral (0.5, 0.8)
connect: 0-1, 0-2, 1-2, 3-4
duration: 5

## narration
Words with similar meanings end up close together. Happy lives near joyful and delighted, but far from sad. This is how your AI brain finds related memories — it searches for nearby addresses in this mathematical space.
highlight: similar, close, brain, memories

## narration
When you store a thought in your brain, it gets converted into an embedding — a list of 384 numbers. When you ask a question, that question also becomes an embedding. Then we find the stored thoughts whose numbers are closest to your question's numbers.
highlight: 384 numbers, question, closest

## code: Embedding in Action
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('BAAI/bge-small-en-v1.5')

# Turn text into numbers
thought = "I love building with AI"
embedding = model.encode(thought)

print(len(embedding))  # 384 dimensions
print(embedding[:5])   # First 5 numbers
```
highlight-lines: 6, 7
duration: 10

## narration
This is the foundation of everything your AI brain does. Every memory, every search, every connection — it all starts with embeddings. The better the embeddings, the smarter the brain.
highlight: foundation, every, smarter

## quote
> The map is not the territory, but a good map changes how you see the territory.
— Alfred Korzybski
duration: 5

## outro
heading: Like One Academy
subtext: Next: How Vector Search Actually Works
cta: likeone.ai/learn
duration: 4
