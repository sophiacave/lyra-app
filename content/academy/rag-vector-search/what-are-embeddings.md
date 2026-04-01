---
title: "What Are Embeddings?"
course: "rag-vector-search"
order: 1
type: "lesson"
free: true
---<nav class="nav">
  <a href="/academy" class="logo">LIKE ONE</a>

</nav>
<div class="container">
  <div class="lesson-header">
    <div class="meta">
      <span class="type-badge">Interactive</span>
      <span class="xp-badge">+200 XP</span>
      <span class="time-badge">~45 min</span>
    </div>
    <h1>What Are Embeddings?</h1>
    <p>Every word, sentence, and document can become a list of numbers — a vector — that captures its meaning. This is the foundation of everything in RAG.</p>
  </div>

  <div class="narration">
    <strong>The core idea:</strong> An embedding converts text into a vector (a list of numbers) where <strong>similar meanings are close together</strong> in space. The word "happy" and "joyful" end up near each other, while "happy" and "database" are far apart. Type a word below and watch it appear in semantic space.
  </div>

  <div class="narration">
    <strong>Why does this matter?</strong> Imagine you have a library of 10,000 documents and a user asks a question. You need to find the right answer — fast. That's what <strong>RAG</strong> (Retrieval-Augmented Generation) does: it fetches the most relevant documents and hands them to an AI. Embeddings are what make that search smart — finding answers by meaning, not just matching keywords.
  </div>

  <h3 style="font-size:1rem;margin-bottom:1rem">Key Concepts</h3>
  <div class="concepts">
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Embedding Dimensions</h3>
      <p>Real embeddings have 768-3072 dimensions. We show 2D for visualization.</p>
      <div class="detail">OpenAI's text-embedding-3-small uses 1536 dimensions. Each dimension captures a different aspect of meaning — sentiment, topic, formality, etc. More dimensions = more nuance.</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Cosine Similarity</h3>
      <p>Measures how similar two vectors are by checking if they point in the same direction. 1.0 = identical meaning, 0 = completely unrelated. It ignores length and focuses purely on direction.</p>
      <div class="detail">cos(A,B) = (A · B) / (||A|| × ||B||). We use the angle, not distance, because it's magnitude-independent. A long and short vector pointing the same direction are still "similar."</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Semantic Space</h3>
      <p>The multi-dimensional space where embeddings live. Nearby = related meaning.</p>
      <div class="detail">Embedding models learn this space from billions of text examples. They discover that "king - man + woman = queen" and similar analogies emerge naturally from the geometry.</div>
    </div>
    <div class="concept" onclick="this.classList.toggle('active')">
      <h3>Embedding Models</h3>
      <p>Neural networks trained to map text to vectors that preserve meaning.</p>
      <div class="detail">Popular models: OpenAI text-embedding-3, Cohere embed-v3, BGE, E5. They're trained with contrastive learning — pulling similar texts together and pushing dissimilar texts apart.</div>
    </div>
  </div>

  <div data-learn="QuizMC" data-props='{"title":"Check Your Understanding","questions":[{"q":"What does an embedding model output for a piece of text?","options":["A summary paragraph","A fixed-length list of numbers (vector)","A set of keywords","A JSON object with labels"],"correct":1,"explanation":"Embedding models output a dense vector — a fixed-length list of floating-point numbers — where the position in that high-dimensional space captures the text\u0027s meaning."},{"q":"Why are the words \"happy\" and \"joyful\" close together in embedding space?","options":["They share the same letters","They have the same number of characters","They have similar meanings, so the model places them nearby","They were always grouped together alphabetically"],"correct":2,"explanation":"Embedding models are trained on vast text corpora and learn that words used in similar contexts carry similar meanings. Semantically related words end up geometrically close in vector space."}]}'></div>

  <div data-learn="FlashDeck" data-props='{"title":"Embedding Vocabulary","cards":[{"front":"Vector","back":"A list of numbers representing the meaning of a piece of text in multi-dimensional semantic space."},{"front":"Cosine Similarity","back":"A measure of similarity between two vectors based on the angle between them. Range: -1 (opposite) to 1 (identical). Magnitude-independent."},{"front":"Semantic Space","back":"The high-dimensional coordinate system where all embeddings live. Similar meanings cluster together; unrelated meanings are far apart."},{"front":"Embedding Model","back":"A neural network trained to convert text into vectors that preserve meaning relationships, e.g. OpenAI text-embedding-3-small (1536 dimensions)."},{"front":"Contrastive Learning","back":"The training technique used to build embedding models — similar texts are pulled together and dissimilar texts are pushed apart during training."}]}'></div>


  <div class="footer-nav">
    <span>Lesson 1 of 10</span>

  </div>
</div>
