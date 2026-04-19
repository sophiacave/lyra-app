# Words as Numbers

**Course:** AI Foundations
**Order:** 7
**Type:** lesson
**Access:** Premium

---
[← Course Home](/academy/ai-foundations/)
  Lesson 7 of 9


  # Words as Numbers.

  Watch words become vectors in space — and discover that math can capture meaning.


  ### After this lesson you'll know


    - How words become vectors (lists of numbers)

    - Why similar words cluster together in space

    - The famous king - man + woman = queen equation

    - Why embeddings are the foundation of modern AI




  The Big Idea
  ## Words have coordinates in a universe of meaning.

  AI cannot read words the way you do. It reads numbers. So every word gets converted into a list of numbers that captures its meaning. This list of numbers is called a **vector** — think of it as GPS coordinates, but instead of pinpointing a place on Earth, they pinpoint a word's meaning in a universe of concepts.
  "Cat" might have coordinates like [0.2, 0.8, -0.1, ...] across hundreds of **dimensions**. A dimension is just one aspect of meaning — one might roughly capture "is it alive?", another "is it big?", another "is it domestic?" The more dimensions, the more nuance the AI can express.
  The magic: words that mean similar things end up close together on this map. "Happy," "joyful," and "delighted" are neighbors. "Sad" is far away. The map itself encodes meaning — and AI uses this map to understand language.


  From Text to Numbers
  ## Three ways machines have tried to read words.

  Before embeddings, researchers tried simpler approaches. Understanding these older methods makes it clear why embeddings are such a breakthrough:



      **One-Hot Encoding — the dictionary approach (1990s)**
      Assign each word a unique position in a giant vector. "Cat" = [1, 0, 0, ...], "Dog" = [0, 1, 0, ...]. The problem: every word is equally distant from every other word. "Cat" is no closer to "dog" than to "algebra." And with 100,000 words, each vector is 100,000 numbers long with 99,999 zeros. Wasteful and meaningless.


      **Bag of Words — counting occurrences (2000s)**
      Count how many times each word appears in a document. "The cat sat on the mat" becomes {the: 2, cat: 1, sat: 1, on: 1, mat: 1}. Better than one-hot, but it ignores word order entirely. "Dog bites man" and "man bites dog" have the exact same representation despite meaning completely different things.


      **Embeddings — learned meaning (2013+)**
      Instead of hand-crafting representations, let the AI **learn** them from data. Train a model on billions of sentences, and words that appear in similar contexts develop similar vectors. "Cat" and "dog" end up near each other because they appear in similar sentences. "Cat" and "algebra" end up far apart. Dense, compact, and meaningful — this is the modern approach.



  Modern AI also uses **tokenization** — splitting text into subword chunks before embedding:


```
  TOKENIZATION — HOW AI READS TEXT

  Word               Tokens              Why
  ──────────         ──────────          ─────────────────────
  "cat"              [cat]               Common word = 1 token
  "unbelievable"     [un, believ, able]  Rare word = 3 tokens
  "ChatGPT"          [Chat, G, PT]       Brand name = 3 tokens
  "123"              [1, 2, 3]           Numbers = 1 token each
  "    "             [    ]              Spaces = tokens too

  Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 words
  100 tokens ≈ 75 words ≈ one short paragraph
  A 1-page document ≈ 300-400 tokens
```



    **Tokenization + embedding is the full pipeline:** text gets split into tokens, each token gets an embedding vector, and the AI processes those vectors. Every word you type into ChatGPT or Claude goes through this exact pipeline — tokenize, embed, process, generate.



### Embedding Concepts — Flip for Details

**Card 1:**
Front: 📊 VECTORS  Each word becomes a list of numbers. Hundreds of dimensions capturing meaning.
Back: EXAMPLE: "cat" = [0.2, 0.8, -0.1, 0.5, ...]  Each number captures some aspect of meaning — maybe one dimension relates to "is it alive?", another to "is it big?", another to "is it domestic?"  Real embeddings use 768+ dimensions. The more dimensions, the more nuance.

**Card 2:**
Front: 🌌 SEMANTIC SPACE  Similar words cluster together. Meaning becomes geometry.
Back: In embedding space: - "happy" + "joyful" + "delighted" = neighbors - "sad" is far from "happy" — opposite direction - "dog" + "cat" + "puppy" = a cluster - "king" + "queen" + "prince" = another cluster  Search engines use this: your query becomes a vector and they find the nearest document vectors.

**Card 3:**
Front: ➕ VECTOR ARITHMETIC  king - man + woman = queen  Math captures relationships.
Back: This is not a trick. The vector from king to queen captures royalty + female.  The vector from man to woman captures the gender direction.  king - man + woman follows the royalty direction from the female side — and lands on queen.  The AI learned these relationships from patterns in billions of sentences.


  The Code
  ## Embeddings in real Python.

  Now let's look at how vocabulary works in modern AI. A **vocabulary** is the complete set of tokens the model knows. Every word you type gets matched against this vocabulary. Common words like "the" are single tokens. Rare words get split into pieces. Words outside the vocabulary get broken into known subword pieces — so the model can handle any text, even words it has never seen during training.
  Here is how to generate embeddings and compute similarity in Python. *If you are not a coder, you can skip the code — the concepts above are what matter. The code is here for learners who want to see the mechanics behind the scenes.*


Python — generate embeddings with sentence-transformers (free, runs locally)

```
from sentence_transformers import SentenceTransformer
import numpy as np

# Load a free embedding model (downloads once, ~90MB)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Convert words to vectors (384 dimensions each)
words = ["king", "queen", "man", "woman", "dog", "cat"]
vectors = model.encode(words)

print(f"Each vector has {vectors.shape[1]} dimensions")
print(f"'king' vector (first 5): {vectors[0][:5].round(3)}")
```


Python — cosine similarity from scratch

```
def cosine_similarity(a, b):
    """Measure the angle between two vectors. 1.0 = identical, 0 = unrelated."""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare word pairs
king, queen, man, woman, dog, cat = vectors

print(f"king ↔ queen:  {cosine_similarity(king, queen):.3f}")  # ~0.78 (both royalty)
print(f"king ↔ man:    {cosine_similarity(king, man):.3f}")  # ~0.45 (some overlap)
print(f"king ↔ dog:    {cosine_similarity(king, dog):.3f}")  # ~0.15 (unrelated)
print(f"dog  ↔ cat:    {cosine_similarity(dog, cat):.3f}")  # ~0.80 (both pets)
```


Python — vector arithmetic: king - man + woman = ?

```
# The famous equation
result = king - man + woman

# Find the nearest word to the result vector
similarities = [cosine_similarity(result, v) for v in vectors]
nearest = words[np.argmax(similarities)]

print(f"king - man + woman ≈ {nearest}")  # → queen
```


This is not magic — it is math on the meaning map. The direction from "man" to "king" encodes royalty. Apply that same direction starting from "woman" and you land on "queen." The AI learned these relationships by reading patterns in billions of sentences — nobody programmed them in.


  Dimensions
  ## What do 768 dimensions actually mean?

  It is hard to visualize 768 dimensions — humans can picture 2 or 3 at most. But here is the intuition: each dimension captures one *aspect* of meaning. Think of it like describing a person:



      **2 dimensions: too simple**
      With only 2 numbers (say, height and weight), you can distinguish tall-heavy from short-light, but you cannot tell apart two people who are the same height and weight. Too few dimensions means too many collisions — different words end up at the same coordinates.


      **768 dimensions: rich detail**
      With 768 numbers, you can capture nuances like formality, sentiment, tense, domain, concreteness, and hundreds of other aspects of meaning. "Running" and "jogging" are close on most dimensions but might differ on "intensity." "Bank" (financial) and "bank" (river) share spelling dimensions but diverge on meaning dimensions.




    **More dimensions = more precision.** But there are diminishing returns — going from 384 to 768 dimensions helps a lot. Going from 768 to 3072 helps less. The sweet spot for most applications is 384-1536 dimensions.



  See It
  ## How words cluster in semantic space.

  If we squash the 384 dimensions down to 2D, here is what the word map looks like. Notice how meaning creates geography:


```
        Semantic Space (2D projection)

                    queen ♛
                   ╱
             king ♚     ← royalty cluster
               ╲
                woman
                  │
                man        ← people cluster
                  │
                boy

      dog 🐕 ─── cat 🐈   ← pet cluster
            ╲
            puppy

  car 🚗 ─── truck 🚛  ← vehicle cluster

  Words with similar meanings = nearby coordinates
  The DIRECTION from king→queen = the DIRECTION from man→woman
  That's why king - man + woman ≈ queen
```


  Knowledge Check
  ## Test your understanding.


### Quiz

**Q1: Why do similar words end up close together in embedding space?**
    A. Programmers manually placed them there
  ✓ B. Words that appear in similar contexts develop similar vectors
    C. It is random — sometimes similar words are far apart
    D. The dictionary determines their position
  *Embeddings are learned from text. Words that appear in similar contexts (you can pet a cat / you can pet a dog) develop similar vectors. The AI discovers meaning from usage patterns.*

**Q2: What makes vector arithmetic like king - man + woman = queen possible?**
    A. A lookup table of word relationships
  ✓ B. The embedding space encodes relationships as directional offsets
    C. The AI memorized this specific example
    D. It only works for royalty words
  *The direction from man to king captures royalty. The direction from man to woman captures gender. These are consistent directions in the space — so you can combine them mathematically.*

**Q3: How do search engines use embeddings?**
    A. They match exact keywords only
  ✓ B. They convert queries and documents to vectors and find the nearest matches
    C. They use embeddings to make web pages load faster
    D. They do not use embeddings
  *Modern search converts your query to a vector and finds document vectors that point in a similar direction. This is why searching affordable places to eat can find budget-friendly restaurants — even with zero keyword overlap.*


  [Next: Embedding Explorer →](/academy/ai-foundations/embedding-explorer)
