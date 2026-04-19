# Similarity Challenge

**Course:** AI Foundations
**Order:** 9
**Type:** quiz
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 9 of 9


  # Similarity Challenge.

  Put your embedding knowledge to the test. Predict similarities and prove your mastery.


  ### This assessment covers


    - Predicting cosine similarity between word pairs

    - Understanding how embeddings power real applications

    - Vector analogies and relationship encoding

    - Everything from the AI Foundations course




  Key Concepts
  ## How machines measure "similar."

  Humans intuitively know that "dog" and "puppy" are related while "dog" and "algebra" are not. But how does a machine know? The answer is **similarity metrics** — mathematical formulas that compare vectors and output a number representing how close two concepts are.



      **Cosine Similarity — measuring the angle**
      The most common similarity metric in AI. It measures the **angle** between two vectors, ignoring their length. Imagine two arrows starting from the same point. If they point in the same direction, cosine similarity = 1.0 (identical meaning). If they are perpendicular, cosine = 0.0 (completely unrelated). If they point in opposite directions, cosine = -1.0 (antonyms). The formula: dot product divided by the product of magnitudes.


      **Euclidean Distance — measuring the gap**
      The straight-line distance between two points in space. If cosine similarity is about direction, Euclidean distance is about position. Two words can point in the same direction (high cosine) but be far apart in absolute position (high Euclidean distance). In practice, cosine similarity is preferred for text because document length affects position but not direction.


      **Dot Product — the raw score**
      Multiply each pair of matching dimensions together and sum the results. The dot product captures both direction AND magnitude. Cosine similarity is just the dot product normalized by the lengths. When vectors are already normalized (length = 1), the dot product and cosine similarity are identical — which is why many systems normalize their embeddings before storing them.



  Here is how these three metrics compare in practice:


```
  SIMILARITY METRICS COMPARED

  Word Pair           Cosine    Euclidean    Dot Product
  ──────────          ──────    ─────────    ───────────
  cat ↔ dog           0.95      0.31         0.92
  cat ↔ kitten        0.89      0.47         0.85
  cat ↔ car           0.27      1.22         0.24
  cat ↔ algebra       0.05      1.38         0.04

  Higher cosine = more similar (max 1.0)
  Lower Euclidean = more similar (min 0.0)
  Higher dot product = more similar

  In practice: cosine similarity is the standard for NLP
  because it ignores vector length (document size)
```




      **Vector Analogies — relationships as directions**
      The famous equation **king - man + woman = queen** works because relationships are encoded as consistent directions in embedding space. The direction from "man" to "king" captures the concept of male royalty. The direction from "man" to "woman" captures gender. Subtracting one direction and adding another navigates the meaning-space — like following a map. This works for geography (Paris - France + Japan = Tokyo), tenses (walking - walk + swim = swimming), and many other relationships.


      **Real-world applications**
      **Semantic search** finds documents by meaning, not keywords. **Recommendation engines** find similar products by comparing embedding vectors. **RAG** retrieves relevant context before the AI generates a response. **Duplicate detection** identifies near-identical content by checking cosine similarity thresholds. **Clustering** groups similar items together for analysis. All of these rely on the same core operation: comparing vectors.




    **The bottom line:** similarity is the bridge between human meaning and machine math. When you understand how cosine similarity works, you understand the engine behind modern search, recommendations, and AI-powered retrieval. Now prove it.



  Part 1
  ## Embedding mastery.


Python — Cosine Similarity from Scratch

```
import math

def cosine_similarity(vec_a, vec_b):
    """Measure how similar two vectors are (0 = unrelated, 1 = identical)."""
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a ** 2 for a in vec_a))
    mag_b = math.sqrt(sum(b ** 2 for b in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

# Toy 2-D embeddings (real ones use 768+ dimensions)
cat   = [0.9, 0.1]   # mostly "animal", a little "object"
dog   = [0.85, 0.15]  # very close to cat
car   = [0.1, 0.95]   # mostly "object", a little "animal"

print(f"cat · dog = {cosine_similarity(cat, dog):.4f}")  # ~0.9949
print(f"cat · car = {cosine_similarity(cat, car):.4f}")  # ~0.2688
```


[Interactive: FlashDeck]


### Quiz

**Q1: Which pair of words would have the HIGHEST cosine similarity?**
    A. happy and banana
    B. dog and skyscraper
  ✓ C. car and automobile
    D. king and purple
  *Car and automobile are synonyms — they appear in nearly identical contexts so their embedding vectors point in almost the same direction. Cosine similarity would be around 0.95.*

**Q2: Why are embeddings useful for search engines?**
    A. They make pages load faster
  ✓ B. They allow matching by meaning, not just keywords
    C. They compress images
    D. They prevent typos
  *With embeddings, searching affordable places to eat can match budget-friendly restaurants — even with zero keyword overlap. Both phrases map to nearby vectors because they mean similar things.*

**Q3: Paris : France :: Tokyo : ? works because:**
    A. The model memorized geography facts
  ✓ B. The vector from Paris to France captures capital-of and applying it to Tokyo lands near Japan
    C. All cities are near all countries
    D. Tokyo and France have similar spelling
  *The vector offset from Paris to France represents capital-of. Adding this same offset to Tokyo points toward Japan. Learned from patterns in text, not from explicit geography lessons.*

**Q4: A cosine similarity of 0.0 between two word vectors means:**
    A. The words are synonyms
  ✓ B. The words are completely unrelated (perpendicular vectors)
    C. The words are antonyms
    D. An error occurred in the calculation
  *Cosine similarity of 0 means the vectors are perpendicular — they share no directional component. The words exist in completely unrelated semantic regions.*

**Q5: Real word embeddings typically use how many dimensions?**
    A. 2-3 dimensions
    B. 50-100 dimensions
  ✓ C. 768-1536 dimensions
    D. 1 million dimensions
  *Modern embeddings typically use 768 to 1536 dimensions. More dimensions capture more nuance in meaning. The 2D visualizations in this course simplify the concept but the math is identical.*

**Q6: RAG (Retrieval-Augmented Generation) uses embeddings to:**
    A. Generate images from text
  ✓ B. Find relevant documents to include in the AI context before generating a response
    C. Compress AI models to run faster
    D. Translate between languages
  *RAG converts your question to a vector, searches a database for the most similar document vectors, retrieves those documents, and includes them in the AI prompt. This gives the AI access to specific knowledge without retraining.*


  Math Corner
  ## The math behind cosine similarity.

  You do not need to memorize the formula, but understanding it makes the concept click. Cosine similarity has three steps:



      **Step 1: Dot Product — multiply and sum**
      Multiply each pair of matching dimensions, then add them all up. For vectors [3, 4] and [4, 3]: (3 x 4) + (4 x 3) = 12 + 12 = 24. The dot product is large when vectors point in similar directions and small (or negative) when they point in different directions.


      **Step 2: Magnitudes — measure the lengths**
      Calculate the length of each vector using the Pythagorean theorem. For [3, 4]: sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5. For [4, 3]: same thing, also 5. The magnitude tells you how "strong" the vector is, independent of its direction.


      **Step 3: Divide — normalize the result**
      Divide the dot product by the product of both magnitudes: 24 / (5 x 5) = 24/25 = 0.96. This normalization is what makes cosine similarity ignore vector length and focus purely on direction. Whether a document is 100 words or 10,000 words, its direction in embedding space is what matters for similarity.




```
  COSINE SIMILARITY WORKED EXAMPLE

  Vector A = [3, 4]     (e.g., the word "cat")
  Vector B = [4, 3]     (e.g., the word "dog")

  Dot Product:  (3 × 4) + (4 × 3) = 12 + 12 = 24
  Magnitude A:  sqrt(3² + 4²) = sqrt(25) = 5
  Magnitude B:  sqrt(4² + 3²) = sqrt(25) = 5

  Cosine Sim :  24 / (5 × 5) = 24/25 = 0.96

  Result: very similar! These vectors point nearly the same way.
  For comparison: perpendicular vectors = 0.00, opposite = -1.00
```



    **That is the entire formula.** Dot product divided by magnitudes. Three operations, one number that captures how similar two concepts are. Every semantic search engine, every recommendation system, every RAG pipeline runs this exact calculation millions of times per second.



  Part 2
  ## Full course review.


### Quiz

**Q1: A neuron computes: weighted sum + bias, then applies an activation function. What is the activation function for?**
    A. To speed up computation
  ✓ B. To introduce non-linearity so the network can learn complex patterns
    C. To store the weights
    D. To connect layers together
  *Without activation functions, stacking layers is just multiplying matrices — the whole network reduces to one linear equation. Non-linearity lets networks learn curves, edges, language, and everything complex.*

**Q2: You searched for affordable dining and a semantic search returned budget-friendly restaurants. This works because:**
    A. The search engine matched the word dining
  ✓ B. Both phrases have similar embedding vectors despite zero keyword overlap
    C. The database has a synonym dictionary
    D. The user corrected the query
  *Semantic search converts queries and documents to embedding vectors. Affordable dining and budget-friendly restaurants mean similar things, so their vectors point in similar directions — even with zero shared words.*

**Q3: What is the relationship between tokens, embeddings, and the context window?**
    A. They are three names for the same thing
  ✓ B. Tokens are the input units, each token gets an embedding vector, and the context window limits how many tokens fit
    C. Embeddings control the context window size
    D. Tokens are larger than embeddings
  *Text → tokens (subword chunks) → embedding vectors (numbers capturing meaning). The context window is the maximum number of tokens the model can process at once. All three are parts of the same pipeline.*


  Final Challenge
  ## The AI Foundations gauntlet.


### Quiz

**Q1: Which of these is a core component inside an artificial neuron?**
    A. Pixels
  ✓ B. Weights
    C. Bluetooth
    D. Megabytes
  *Weights are the learnable parameters inside each neuron. They determine how much influence each input has on the output.*

**Q2: What does "few-shot prompting" mean?**
    A. Sending very short prompts
  ✓ B. Giving Claude 2-3 examples of what you want before asking
    C. Using Claude for only a few minutes
    D. Limiting Claude to a few words of response
  *Few-shot means providing examples in your prompt. Claude learns the pattern from your examples and applies it to the new task.*

**Q3: In embedding space, what does cosine similarity measure?**
    A. How long two texts are
  ✓ B. How semantically similar two concepts are
    C. The file size of a document
    D. How fast the model runs
  *Cosine similarity measures the angle between two vectors in embedding space. Closer angles = more semantically similar concepts.*

**Q4: What is RAG (Retrieval-Augmented Generation)?**
    A. A type of neural network layer
  ✓ B. A technique that retrieves relevant data and feeds it to the AI before generating a response
    C. A way to compress images
    D. A programming language for AI
  *RAG searches your data for relevant context, then gives it to the AI so it can generate accurate, grounded responses from your actual information.*

**Q5: What does the temperature parameter control?**
    A. The speed of the AI response
  ✓ B. How creative vs deterministic the output is
    C. The number of tokens generated
    D. The size of the context window
  *Temperature controls randomness. Low temperature (0) = deterministic and focused. High temperature (1) = more creative and varied.*


  Course Complete
  ## You now understand how AI actually works.

  Most people use AI without understanding any of this. You now know:

    - Neurons — weighted sum + bias + activation function

    - Networks — layers of neurons that find increasingly complex patterns

    - Tokens — how AI reads text (not words, not characters)

    - Prompt techniques — zero-shot, few-shot, chain-of-thought, role-play

    - Temperature — the creativity dial

    - Embeddings — words as vectors, meaning as geometry

    - Cosine similarity — how AI measures relatedness

    - RAG — retrieval-augmented generation


  This foundation makes everything else in AI make sense. You're ready for the next course.


  [← Back to Academy](/academy/)
