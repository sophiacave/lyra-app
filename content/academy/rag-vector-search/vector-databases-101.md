---
title: "Vector Databases 101"
course: "rag-vector-search"
order: 2
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Visual</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~50 min</span>
    </div>
    <h1>Vector Databases 101</h1>
    <p>Traditional databases find exact matches. Vector databases find similar meanings. This changes everything about how AI retrieves information.</p>
  </div>

  <div class="narration">
    <strong>The problem:</strong> You search a traditional database for "joyful" and it returns nothing — because the data contains "happy," not "joyful." A vector database finds "happy" because it understands they <strong>mean the same thing</strong>. Type a query below to see the difference.
  </div>

  <div class="narration">
    <strong>How vector databases work under the hood:</strong> They use special index structures (like HNSW — Hierarchical Navigable Small World graphs) to search billions of vectors in milliseconds. Instead of scanning every row, they navigate a graph of connected vectors to find the nearest neighbors quickly.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Popular Vector Databases</h3>
  <div class="features">
    <div class="feature"><h4>Pinecone</h4><p>Fully managed, serverless vector DB. Great for getting started fast. Auto-scales.</p></div>
    <div class="feature"><h4>Weaviate</h4><p>Open-source with built-in vectorization. Supports hybrid search natively.</p></div>
    <div class="feature"><h4>Chroma</h4><p>Lightweight, open-source, runs locally. Perfect for prototyping RAG apps.</p></div>
    <div class="feature"><h4>pgvector</h4><p>PostgreSQL extension. Use vectors in your existing Postgres DB. Supabase supports it.</p></div>
    <div class="feature"><h4>Qdrant</h4><p>Rust-based, high-performance. Great filtering + payload support.</p></div>
    <div class="feature"><h4>Milvus</h4><p>Enterprise-grade, handles billions of vectors. Used by major tech companies.</p></div>
  </div>

  <div data-learn="FlashDeck" data-props='{"title":"Vector Database Fundamentals","cards":[{"front":"Vector Database","back":"A database optimized for storing and searching high-dimensional vectors by similarity rather than exact match. Finds happy when you search for joyful."},{"front":"HNSW Index","back":"Hierarchical Navigable Small World — a graph-based index that finds approximate nearest neighbors in sub-linear time, enabling millisecond searches across billions of vectors."},{"front":"Cosine Similarity","back":"Measures the angle between two vectors, ignoring magnitude. Two vectors pointing in the same direction are similar regardless of length."},{"front":"Top-K Results","back":"The K most similar document chunks returned from a vector search, ranked by similarity score. Typical K values: 3-10."},{"front":"pgvector","back":"A PostgreSQL extension that adds vector storage and similarity search to your existing Postgres database. Supported by Supabase."}]}'></div>

  <div data-learn="QuizMC" data-props='{"title":"Vector Database Concepts","questions":[{"q":"What does a vector database return when you search with a query?","options":["Rows where a column exactly matches the query","The top-K documents whose vectors are most similar in meaning","All documents sorted alphabetically","A count of how many documents mention the query word"],"correct":1,"explanation":"Vector databases perform similarity search — they compare the query vector against all stored vectors and return the K nearest neighbors, ranked by cosine or dot-product similarity."},{"q":"What index structure do most vector databases use to search billions of vectors quickly?","options":["B-tree index","Hash index","HNSW (Hierarchical Navigable Small World)","Full-text inverted index"],"correct":2,"explanation":"HNSW is a graph-based index that allows approximate nearest-neighbor search in sub-linear time. Instead of scanning every vector, it navigates a layered graph to zoom in on likely neighbors quickly."}]}'></div>


  <div data-learn="SortStack" data-props='{"title":"How a Vector Search Works — Put the Steps in Order","instruction":"Arrange these steps in the correct sequence for a vector similarity search","items":["Convert user query to an embedding vector","Compare query vector against all stored document vectors using cosine similarity","Rank results by similarity score","Return the top-K most similar document chunks"]}'></div>

</div>
