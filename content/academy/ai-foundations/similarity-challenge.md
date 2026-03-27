---
title: "Similarity Challenge"
course: "ai-foundations"
order: 9
type: "quiz"
free: false
---<div class="wrap">

<nav class="local-nav">
  <a href="/academy/ai-foundations/">&larr; Course Home</a>
  <span class="lesson-badge">Lesson 9 of 9</span>
</nav>

<div class="lesson-hero">
  <h1>Similarity <span class="accent">Challenge.</span></h1>
  <p class="sub">Put your embedding knowledge to the test. Predict similarities and prove your mastery.</p>
</div>

<div class="learn-card">
  <h3>This assessment covers</h3>
  <ul>
    <li>Predicting cosine similarity between word pairs</li>
    <li>Understanding how embeddings power real applications</li>
    <li>Vector analogies and relationship encoding</li>
    <li>Everything from the AI Foundations course</li>
  </ul>
</div>

<!-- SECTION 1: EMBEDDING QUIZ -->
<div class="lesson-section">
  <span class="section-label">Part 1</span>
  <h2 class="section-title">Embedding mastery.</h2>

<div data-learn="QuizMC" data-props='{
  "title": "Similarity Challenge — 6 Questions",
  "questions": [
    {
      "q": "Which pair of words would have the HIGHEST cosine similarity?",
      "options": ["happy and banana", "dog and skyscraper", "car and automobile", "king and purple"],
      "correct": 2,
      "explanation": "Car and automobile are synonyms — they appear in nearly identical contexts so their embedding vectors point in almost the same direction. Cosine similarity would be around 0.95."
    },
    {
      "q": "Why are embeddings useful for search engines?",
      "options": ["They make pages load faster", "They allow matching by meaning, not just keywords", "They compress images", "They prevent typos"],
      "correct": 1,
      "explanation": "With embeddings, searching affordable places to eat can match budget-friendly restaurants — even with zero keyword overlap. Both phrases map to nearby vectors because they mean similar things."
    },
    {
      "q": "Paris : France :: Tokyo : ? works because:",
      "options": ["The model memorized geography facts", "The vector from Paris to France captures capital-of and applying it to Tokyo lands near Japan", "All cities are near all countries", "Tokyo and France have similar spelling"],
      "correct": 1,
      "explanation": "The vector offset from Paris to France represents capital-of. Adding this same offset to Tokyo points toward Japan. Learned from patterns in text, not from explicit geography lessons."
    },
    {
      "q": "A cosine similarity of 0.0 between two word vectors means:",
      "options": ["The words are synonyms", "The words are completely unrelated (perpendicular vectors)", "The words are antonyms", "An error occurred in the calculation"],
      "correct": 1,
      "explanation": "Cosine similarity of 0 means the vectors are perpendicular — they share no directional component. The words exist in completely unrelated semantic regions."
    },
    {
      "q": "Real word embeddings typically use how many dimensions?",
      "options": ["2-3 dimensions", "50-100 dimensions", "768-1536 dimensions", "1 million dimensions"],
      "correct": 2,
      "explanation": "Modern embeddings typically use 768 to 1536 dimensions. More dimensions capture more nuance in meaning. The 2D visualizations in this course simplify the concept but the math is identical."
    },
    {
      "q": "RAG (Retrieval-Augmented Generation) uses embeddings to:",
      "options": ["Generate images from text", "Find relevant documents to include in the AI context before generating a response", "Compress AI models to run faster", "Translate between languages"],
      "correct": 1,
      "explanation": "RAG converts your question to a vector, searches a database for the most similar document vectors, retrieves those documents, and includes them in the AI prompt. This gives the AI access to specific knowledge without retraining."
    }
  ]
}'></div>

</div>

<!-- SECTION 2: FULL COURSE REVIEW -->
<div class="lesson-section">
  <span class="section-label">Part 2</span>
  <h2 class="section-title">Full course review.</h2>

<div data-learn="MatchConnect" data-props='{
  "title": "Match Concept to Its Course Section",
  "instruction": "Tap a concept on the left, then where you learned it on the right",
  "pairs": [
    { "left": "Weighted sum + bias + activation", "right": "What Is a Neuron — the core neuron computation" },
    { "left": "Input → Hidden → Output layers", "right": "Build a Network — layer architecture" },
    { "left": "Tokens and context windows", "right": "Anatomy of a Prompt — how AI reads text" },
    { "left": "Zero-shot, few-shot, chain-of-thought", "right": "Prompt Playground — prompt engineering techniques" },
    { "left": "Cosine similarity and vector arithmetic", "right": "Embedding Explorer — meaning as geometry" }
  ]
}'></div>

</div>

<!-- SECTION 3: FINAL GAME -->
<div class="lesson-section">
  <span class="section-label">Final Challenge</span>
  <h2 class="section-title">The AI Foundations gauntlet.</h2>

<div data-learn="PixelQuest" data-props='{
  "levels": [
    {
      "question": "Collect the core AI concepts!",
      "correct": ["Neurons", "Weights", "Embeddings", "Tokens", "Activation"],
      "wrong": ["Pixels", "Megabytes", "Bluetooth", "WiFi"],
      "gridSize": 7
    },
    {
      "question": "Collect the prompt techniques!",
      "correct": ["Zero-Shot", "Few-Shot", "Chain-of-Thought", "Role-Play", "Temperature"],
      "wrong": ["Copy-Paste", "Spell Check", "Font Size", "Page Layout"],
      "gridSize": 7
    },
    {
      "question": "Collect embedding concepts!",
      "correct": ["Vectors", "Cosine Similarity", "Semantic Space", "RAG", "Analogy"],
      "wrong": ["Screen Resolution", "File Size", "Printer", "Keyboard"],
      "gridSize": 7
    }
  ]
}'></div>

</div>

<!-- COMPLETION -->
<div class="lesson-section">
  <span class="section-label">Course Complete</span>
  <h2 class="section-title">You now understand how AI actually works.</h2>
  <p class="section-text">Most people use AI without understanding any of this. You now know:</p>
  <ul class="section-text" style="padding-left:1.5rem;margin-top:.5rem;margin-bottom:1rem">
    <li><strong>Neurons</strong> — weighted sum + bias + activation function</li>
    <li><strong>Networks</strong> — layers of neurons that find increasingly complex patterns</li>
    <li><strong>Tokens</strong> — how AI reads text (not words, not characters)</li>
    <li><strong>Prompt techniques</strong> — zero-shot, few-shot, chain-of-thought, role-play</li>
    <li><strong>Temperature</strong> — the creativity dial</li>
    <li><strong>Embeddings</strong> — words as vectors, meaning as geometry</li>
    <li><strong>Cosine similarity</strong> — how AI measures relatedness</li>
    <li><strong>RAG</strong> — retrieval-augmented generation</li>
  </ul>
  <p class="section-text">This foundation makes everything else in AI make sense. You're ready for the next course.</p>
</div>

<!-- BACK TO ACADEMY -->
<div class="lesson-section" style="text-align:center;padding:2rem 0">
  <a href="/academy/" style="display:inline-block;background:var(--orange);color:var(--bg);font-weight:700;padding:.75rem 2rem;border-radius:10px;text-decoration:none;font-size:.95rem">&larr; Back to Academy</a>
</div>

</div>