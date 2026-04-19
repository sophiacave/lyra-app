# Chunking Strategies

**Course:** RAG & Vector Search
**Order:** 3
**Type:** lesson
**Access:** Free

---
[RAG & Vector Search](/academy/rag-vector-search/)
  Lesson 3 of 10


  # Chunking Strategies

  Before you can search documents by meaning, you need to split them into pieces. The size and overlap of those pieces dramatically affects whether your RAG system finds the right answer or returns garbage. This lesson teaches you the art and science of chunking.



    ## Why Chunk at All?

    Embedding models have token limits — typically 512 to 8,192 tokens (a token is roughly 3/4 of a word, so 1,000 tokens is about 750 words). A 50-page document has ~15,000 words — far too long to embed as a single vector. Even if you could fit it, a single vector for 50 pages would be so diluted that it would vaguely match everything and precisely match nothing.

    Chunking solves both problems. By splitting documents into smaller pieces — typically 100 to 500 words each — you create focused vectors that represent specific ideas. When a user searches for "refund policy for international orders," the search finds the specific chunk about international refunds, not a 50-page document that mentions refunds once on page 37.

    The challenge is finding the right chunk size. Too small and you lose context. Too large and you dilute relevance. This lesson gives you the rules, the code, and the judgment to get it right.



    ## The Chunk Size Spectrum

    Every chunk size is a tradeoff between **precision** (finding exactly the right passage) and **context** (including enough surrounding information for the passage to make sense).



        **Small Chunks (50-200 words)**
        High precision — each chunk covers one idea. Great for specific factual questions ("What is the max upload size?"). Faster to embed. But may lose context needed to understand the passage ("This causes X" — what is "This"?).


        **Medium Chunks (200-500 words)**
        The sweet spot for most RAG systems. Enough context to stand alone, focused enough to be relevant. Start here and adjust based on evaluation. This is what most production systems use.


        **Large Chunks (500-1000 words)**
        Good for complex questions requiring reasoning across multiple paragraphs. Better context preservation. But may include irrelevant material that confuses the LLM and wastes context window tokens.


        **Danger Zones**
        Below 50 words: meaningless fragments. "The cat sat on" tells the LLM nothing. Above 1000 words: a chunk about 10 topics matches everything poorly. Both extremes degrade retrieval quality.





    ## Overlap — Preventing Boundary Loss

    When you split a document at word 200, any sentence that spans words 195-205 gets cut in half. The first chunk has the beginning of the sentence; the second chunk has the end. Neither chunk has the complete thought, so neither will be retrieved for a query about that idea.

    **Overlap** solves this by repeating the last N words of each chunk at the beginning of the next. A 200-word chunk with 30-word overlap means words 171-200 of chunk 1 also appear as words 1-30 of chunk 2. Any sentence spanning the boundary is fully captured in at least one chunk.

    The rule of thumb: **10-20% overlap**. For 200-word chunks, use 20-40 words of overlap. Too little overlap and you lose boundary information. Too much overlap and you waste storage and create near-duplicate vectors that clutter search results.



    ## Chunking Strategies in Code

    There are four main approaches to chunking, each with different tradeoffs. Here is how to implement each one:

    ### 1. Fixed-Size Chunking

    The simplest approach — split every N words regardless of sentence boundaries. Fast and predictable but can cut sentences mid-thought.



```
def fixed_size_chunk(text, chunk_size=200, overlap=30):
    """Split text into fixed-size word chunks with overlap."""
    words = text.split()
    chunks = []
    start = 0

    while start len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap  # step forward by (size - overlap)

    return chunks

# Example: 1000 words → 6 chunks of 200 words with 30-word overlap
chunks = fixed_size_chunk(document_text)
print(f"{len(chunks)} chunks created")
```



    ### 2. Sentence-Based Chunking

    Groups complete sentences until the chunk reaches the target size. Respects natural language boundaries — never cuts a sentence in half.



```
import re

def sentence_chunk(text, max_words=200, overlap_sentences=1):
    """Split text by sentences, grouping until max_words is reached."""
    sentences = re.split(r'(?, text)
    chunks = []
    current = []
    word_count = 0

    for sentence in sentences:
        s_words = len(sentence.split())
        if word_count + s_words > max_words and current:
            chunks.append(" ".join(current))
            # Overlap: keep last N sentences
            current = current[-overlap_sentences:]
            word_count = sum(len(s.split()) for s in current)
        current.append(sentence)
        word_count += s_words

    if current:
        chunks.append(" ".join(current))
    return chunks
```



    ### 3. Paragraph-Based Chunking

    Uses double newlines as natural split points. Respects document structure — each paragraph becomes one or more chunks. Best for well-structured documents like technical docs, articles, and manuals.



```
def paragraph_chunk(text, max_words=300):
    """Split text by paragraphs, merging short ones."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = []
    word_count = 0

    for para in paragraphs:
        p_words = len(para.split())
        if word_count + p_words > max_words and current:
            chunks.append("\n\n".join(current))
            current = []
            word_count = 0
        current.append(para)
        word_count += p_words

    if current:
        chunks.append("\n\n".join(current))
    return chunks
```



    ### 4. Semantic Chunking

    The most sophisticated approach — split at natural topic shifts detected by the embedding model. Embed each sentence, then split where the cosine similarity between consecutive sentences drops below a threshold. Most accurate but most computationally expensive.



```
import numpy as np
from openai import OpenAI

client = OpenAI()

def semantic_chunk(text, threshold=0.75):
    """Split at topic boundaries detected by embedding similarity."""
    sentences = re.split(r'(?, text)

    # Embed every sentence
    response = client.embeddings.create(
        input=sentences, model="text-embedding-3-small"
    )
    embeddings = [item.embedding for item in response.data]

    # Find topic boundaries (low similarity between consecutive sentences)
    chunks = []
    current = [sentences[0]]
    for i in range(1, len(sentences)):
        sim = np.dot(embeddings[i-1], embeddings[i])  # cosine sim (normalized)
        if sim # topic shift detected
            chunks.append(" ".join(current))
            current = []
        current.append(sentences[i])

    if current:
        chunks.append(" ".join(current))
    return chunks
```


    Semantic chunking costs extra API calls (one embedding per sentence), so it is best reserved for high-value documents where retrieval quality is critical.



    ## Which Strategy Should You Use?



      **Decision Guide:**

      **FAQ / support docs:** Sentence-based, 100-200 words. Each chunk should contain one complete answer.

      **Technical documentation:** Paragraph-based, 200-400 words. Respects the document's own structure.

      **Legal contracts:** Paragraph-based, 300-500 words. Larger chunks preserve clause context.

      **Chat transcripts:** Fixed-size, 150-250 words. Conversations lack natural paragraph breaks.

      **Research papers:** Semantic chunking. Topic boundaries matter more than character counts.

      **Not sure:** Start with sentence-based, 200 words, 1-sentence overlap. Evaluate and adjust.




    ## Common Mistakes



      **Mistake 1: Zero overlap.** Sentences at chunk boundaries are lost. Always use at least 10% overlap.


      **Mistake 2: One chunk size for all document types.** A 500-word chunk works for manuals but is too large for FAQs. Adapt chunk size to your content.


      **Mistake 3: Not testing with real queries.** The "best" chunk size depends on your specific documents and the questions users actually ask. Run evaluation (Lesson 8) with different sizes before committing.


      **Mistake 4: Chunking without preserving metadata.** Each chunk should carry the source document ID, section title, and page number. Without this, retrieved chunks are context-less fragments.



  Test Your Understanding


### Quiz

**Q1: Why do we need to chunk documents before embedding them?**
    A. Smaller files are cheaper to store
  ✓ B. Embedding models have token limits and cannot process full documents as a single vector
    C. Chunks load faster in the browser
    D. Vector databases only accept chunks, not full documents
  *Embedding models have maximum token limits (typically 512-8192 tokens). Long documents must be split into chunks so each piece can be embedded individually. This also improves retrieval precision since each chunk covers a focused topic.*

**Q2: What is the purpose of overlap between chunks?**
    A. To make the index larger
  ✓ B. To prevent information at chunk boundaries from being lost
    C. To reduce the number of embeddings needed
    D. To increase cosine similarity scores
  *Overlap repeats the end of one chunk at the start of the next. This ensures that a sentence or idea spanning the boundary between two chunks is fully represented in at least one chunk, so it is not lost during retrieval.*

**Q3: A legal firm needs to chunk 500-page contracts for a RAG system. Which strategy is best?**
    A. Fixed-size, 50 words — maximum precision
  ✓ B. Paragraph-based, 300-500 words — preserves clause structure
    C. Semantic chunking with 30-word chunks — topic boundaries matter
    D. No chunking — embed the whole contract as one vector
  *Legal documents have meaningful paragraph and clause structure. Paragraph-based chunking with larger sizes (300-500 words) preserves the context needed to understand legal clauses while keeping chunks focused enough for precise retrieval.*

**Q4: You are building a chatbot FAQ with short Q&A pairs. What chunk size should you start with?**
    A. 500+ words to capture maximum context
  ✓ B. 100-200 words so each chunk contains one complete answer
    C. 50 words for maximum precision
    D. 1000+ words to reduce the number of embeddings
  *FAQ entries are short and self-contained. 100-200 word chunks ensure each chunk captures one complete question-answer pair without diluting it with unrelated content.*



### Chunking Flashcards

**Card 1:**
Front: Token
Back: Roughly 3/4 of a word. 100 tokens ≈ 75 words. Embedding models have a maximum token limit per input.

**Card 2:**
Front: Chunk Overlap
Back: Repeating the last N words of one chunk at the start of the next. Prevents boundary information loss. Typical: 10-20% of chunk size.

**Card 3:**
Front: Fixed-Size Chunking
Back: Split text every N words regardless of sentence boundaries. Simple and predictable but can cut sentences mid-thought.

**Card 4:**
Front: Sentence-Based Chunking
Back: Group complete sentences until the chunk reaches the target size. Preserves natural language boundaries. Best general-purpose strategy.

**Card 5:**
Front: Paragraph-Based Chunking
Back: Use double newlines as split points. Respects document structure — each paragraph becomes one or more chunks. Best for structured documents.

**Card 6:**
Front: Semantic Chunking
Back: Split at natural topic shifts detected by embedding similarity between consecutive sentences. Most accurate but most computationally expensive.
