---
title: "The RAG Loop"
course: "rag-vector-search"
order: 4
type: "lesson"
free: false
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Animated</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~60 min</span>
    </div>
    <h1>The RAG Loop</h1>
    <p>Follow a query through the complete RAG pipeline — from user question to AI-generated answer grounded in your data.</p>
  </div>

  <div class="narration">
    <strong>RAG in one sentence:</strong> Instead of hoping the LLM memorized the answer, we <strong>find</strong> the relevant documents and <strong>hand them to the LLM</strong> along with the question. The pipeline has six distinct steps, each transforming the data in a specific way.
  </div>

  <div class="narration">
    <strong>The six steps:</strong>
    <ol>
      <li><strong>User Query</strong> — A natural language question is the starting point of every RAG loop.</li>
      <li><strong>Embed Query</strong> — The question is converted to a vector using the same embedding model that processed the documents, so they share the same semantic space.</li>
      <li><strong>Vector Search</strong> — The query vector is compared against all stored document vectors using cosine similarity. An HNSW index makes this fast even across millions of chunks.</li>
      <li><strong>Retrieve Chunks</strong> — The top-K most similar chunks are fetched with their text, similarity scores, and source metadata.</li>
      <li><strong>Augment Prompt</strong> — The retrieved chunks are inserted into a prompt template alongside the original question, giving the LLM the context it needs.</li>
      <li><strong>LLM Response</strong> — The model generates an answer grounded in the retrieved context, not in potentially outdated training data.</li>
    </ol>
  </div>

  <div data-learn="SortStack" data-props='{"title":"The RAG Pipeline — Order the Steps","instruction":"Arrange the six RAG steps in the correct sequence","items":["Receive user query in natural language","Embed the query into a vector","Search the vector database for similar chunks","Retrieve the top-K matching chunks with scores","Augment the prompt with retrieved context","Send to LLM and generate grounded answer"]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"RAG Loop Deep Dive","questions":[{"q":"Why must the query be embedded with the SAME model used to embed the documents?","options":["It is faster to reuse the same model","Both query and documents must live in the same semantic space for similarity scores to be meaningful","The documents cannot be accessed otherwise","Using different models would cause a server error"],"correct":1,"explanation":"Cosine similarity only makes sense when comparing vectors from the same embedding space. If the query is embedded with model A and documents with model B, the vectors exist in different spaces — the similarity scores would be meaningless."},{"q":"What is \"hallucination\" in the context of LLMs, and how does RAG reduce it?","options":["When the model runs too slowly","When the model confidently generates plausible but incorrect information — RAG reduces this by grounding answers in retrieved facts","When the embedding model produces duplicate vectors","When the vector database returns too many results"],"correct":1,"explanation":"Hallucination is when an LLM invents plausible-sounding but false information. RAG reduces hallucination by providing the model with actual source documents and instructing it to answer ONLY based on that context."},{"q":"In the Augment Prompt step, what instruction prevents the LLM from using its own training knowledge instead of the context?","options":["temperature=0","max_tokens=100","Answer based ONLY on the provided context. If unsure, say I don't know.","model=gpt-4-turbo"],"correct":2,"explanation":"Explicit grounding instructions like \"Answer based ONLY on the provided context\" constrain the model to use retrieved information. Without this instruction, the model may blend context with potentially incorrect training knowledge."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"RAG Pipeline Terms","cards":[{"front":"Augmented Prompt","back":"A prompt that includes retrieved document chunks as context alongside the user question. The \"A\" in RAG."},{"front":"Top-K retrieval","back":"Returning only the K most similar chunks from vector search. K is typically 3-10 depending on context window size and precision needs."},{"front":"Grounded answer","back":"An LLM response where every claim is supported by retrieved context, not invented from training data."},{"front":"HNSW index","back":"Hierarchical Navigable Small World — a graph-based index that finds approximate nearest neighbors in sub-linear time, enabling fast vector search at scale."},{"front":"Hallucination","back":"When an LLM confidently generates plausible but factually incorrect information. RAG reduces this by anchoring answers to retrieved documents."}]}'></div>

</div>
