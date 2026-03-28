---
title: Building Your First RAG Pipeline
subtitle: RAG & Vector Search — Like One Academy
slug: building-your-first-rag
template: tutorial
voice: sophia
---

## narration
You understand embeddings. You understand vector search. Now we are going to build something real — a RAG pipeline that turns a simple question into an intelligent, memory-aware answer.
highlight: RAG pipeline, real, question, memory-aware

## timeline
1. Store | Embed your documents and save them to a vector database
2. Retrieve | Search for the most relevant documents given a question
3. Augment | Inject those documents into your AI prompt
4. Generate | Let the AI answer using both the question and the context
duration: 7

## narration
Step one is storage. You take your documents — notes, articles, memories, whatever matters — and convert each one into an embedding. Then you store both the text and the embedding in your database. pgvector makes this a single table.
highlight: storage, documents, embedding, database, pgvector

## code: Store Embeddings
```sql
-- Create a table with vector support
create table memories (
  id serial primary key,
  content text not null,
  embedding vector(384)
);

-- Insert a memory with its embedding
insert into memories (content, embedding)
values (
  'Faye loves building AI tools',
  '[0.12, -0.34, 0.56, ...]'::vector
);
```
highlight-lines: 5, 11, 12
duration: 10

## narration
Step two is retrieval. When a question comes in, you embed the question using the same model, then use pgvector to find the closest stored memories. The match operator orders results by cosine distance.
highlight: retrieval, question, embed, closest, cosine distance

## code: Search by Similarity
```sql
-- Find the 5 most relevant memories
select content,
  1 - (embedding <=> $question_embedding) as similarity
from memories
order by embedding <=> $question_embedding
limit 5;
```
highlight-lines: 3, 5
duration: 8

## narration
Step three is augmentation. You take those retrieved memories and inject them directly into the prompt you send to the AI. This is the augment in retrieval augmented generation. The AI now has context it would not have had otherwise.
highlight: augmentation, inject, prompt, context

## code: Augment the Prompt
```python
context = "\n".join([m["content"] for m in memories])

prompt = f"""Use the following context to answer:

Context:
{context}

Question: {question}
Answer:"""

response = claude.messages.create(
    model="claude-sonnet-4-6-20250514",
    messages=[{"role": "user", "content": prompt}]
)
```
highlight-lines: 1, 3, 11, 12
duration: 10

## narration
Step four is generation. The AI reads your question plus the retrieved context and gives you a grounded, accurate answer. No hallucination. No guessing. Just your knowledge, amplified by intelligence.
highlight: generation, grounded, accurate, no hallucination, amplified

## quote
> Memory is the diary we all carry about with us.
— Oscar Wilde
duration: 5

## outro
heading: Like One Academy
subtext: You just built a RAG pipeline. Now go deeper.
cta: likeone.ai/learn
duration: 4
